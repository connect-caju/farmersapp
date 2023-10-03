import React, { useCallback, useEffect, useState } from "react"
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Pressable,
} from "react-native"
import { Stack, Box, Center } from "native-base"
import Geolocation from "react-native-geolocation-service"
import AwesomeAlert from "react-native-awesome-alerts"

import LottieAddButton from "../../components/Buttons/LottieAddButton"
import { Icon } from "@rneui/base"
import CoordinatesItem from "../../components/CoordinatesItem/CoordinatesItem"
import CustomDivider from "../../components/Divider/CustomDivider"
import GeoPin from "../../components/LottieComponents/GeoPin"

import {
  getPosition,
  sortCoordinatesByPositions,
  updateCoordinates,
} from "../../helpers/updateCoordinates"
import { Farmland } from "../../models/Farmland"
import { positions } from "../../fakedata/positions"

import { realmContext } from "../../models/realmContext"
import COLORS from "../../consts/colors"
import MapModal from "../../components/Modals/MapModal"
import { useFocusEffect } from "@react-navigation/native"
import { InteractionManager } from "react-native"
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator"
import { SuccessToast } from "../../components/Toast/SuccessToast"
import { SuccessLottie } from "../../components/LottieComponents/SuccessLottie"
import { farmerTypes } from "../../consts/farmerTypes"
const { useRealm, useObject, useQuery } = realmContext

const GeolocationScreen = ({ route, navigation }) => {
  const realm = useRealm()

  const resourceName = route.params?.resourceName
  const resourceId = route.params?.resourceId
  const farmersIDs = route.params?.farmersIDs || []
  let resource
  let farmerType
  let ownerType // farmland ownertype (single, group, institution)
  const [areCoordinatesConfirmed, setAreCoordinatesConfirmed] = useState(false)

  if (resourceName === "Farmer") {
    resource = useObject("Actor", resourceId)
    farmerType = farmerTypes.farmer
  }

  if (resourceName === "Group") {
    resource = useObject("Group", resourceId)
    farmerType = farmerTypes.group
  }

  if (resourceName === "Institution") {
    resource = useObject("Institution", resourceId)
    farmerType = farmerTypes.institution
  }

  if (resourceName === "Farmland") {
    resource = useObject("Farmland", resourceId)

    // identity the farmland ownertype (single, group, institution)
    ownerType = route.params?.ownerType
  }
  // const resourceName = route.params?.resourceName;

  const [confirmGeoAlert, setConfirmGeoAlert] = useState(false)
  const [rejectGeoAlert, setRejectGeoAlert] = useState(false)
  const [failedGeoLocationRequest, setFailedGeoLocationRequest] =
    useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)

  const [areCoordinatesPicked, setAreCoordinatesPicked] = useState(false)
  const [coordaintes, setCoordinates] = useState({
    latitude: -1,
    longitude: -1,
    position: 0,
  })

  const [currentCoordinates, setCurrentCoordinates] = useState({
    latitude: -1,
    longitude: -1,
  })

  const [isMapVisible, setIsMapVisible] = useState(false)
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false)
  const [successLottieVisibile, setSuccessLottieVisible] = useState(false) // controlling the success toast component

  // request the permission to use the device position coordinates
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        // PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Geolocalização",
          message: "Pode o ConnectCaju obter accesso a sua localização?",
          buttonNeutral: "Mais tarde",
          buttonNegative: "Cancelar",
          buttonPositive: "OK",
        },
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionGranted(true)
        // setConfirmGeoAlert(true);
        subscribeLocation()
        console.log("You can use the app")
      } else {
        setPermissionGranted(false)
        setRejectGeoAlert(true)
        console.log("Location Permission Denied")
      }
    } catch (err) {
      console.log("not granted:", granted)
      console.warn(err)
      setFailedGeoLocationRequest(true)
    }
  }

  // persist the acquired coordinates
  const saveCoordinates = (resource, coordinates) => {
    realm.write(() => {
      resource.geolocation = coordinates
    })
  }

  const subscribeLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change
        setCurrentCoordinates({
          latitude: position?.coords.latitude,
          longitude: position?.coords.longitude,
        })
      },
      (error) => {
        Alert.alert("Falha", "Tenta novamente!", {
          cause: error,
        })
      },
      {
        enableHighAccuracy: true,
        accuracy: "high",
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 100,
      },
    )

    // Geolocation.clearWatch(watchID);
  }

  const getCurrentPosition = () => {
    if (!permissionGranted) {
      requestLocationPermission()
    } else {
      subscribeLocation()
    }
  }

  // get the current coordinates of device position
  const getGeolocation = async () => {
    if (!permissionGranted) {
      requestLocationPermission()
    } else {
      Geolocation.getCurrentPosition(
        (position) => {
          // save the captured coordinates
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            position: 0,
          })
          setAreCoordinatesPicked(true)
          // saveCoordinates(resource, {
          //     latitude: position.coords.latitude,
          //     longitude: position.coords.longitude,
          //     position: 0,
          // });
          // setLoadingActivityIndicator(true);
        },
        (error) => {
          Alert.alert("Falha", "Tenta novamente!", {
            cause: error,
          })
        },
        {
          enableHighAccuracy: true,
          accuracy: "high",
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 100,
        },
      )
    }
    setPermissionGranted(false)
  }

  const navigateBack = () => {
    if (
      resourceName === "Farmer" ||
      resourceName === "Group" ||
      resourceName === "Institution"
    ) {
      navigation.navigate("Profile", {
        ownerId: resource?._id,
        farmerType: farmerType,
        farmersIDs: [],
      })
    } else if (resourceName === "Farmland") {
      navigation.navigate("Profile", {
        ownerId: resource?.farmerId,
        farmerType:
          ownerType === "Single"
            ? farmerTypes.farmer
            : ownerType === "Group"
            ? farmerTypes.group
            : ownerType === "Institution"
            ? farmerTypes.institution
            : "",
        farmersIDs: [],
      })
    }
  }

  useEffect(() => {
    // if true, the SuccessLottie Overlay should show up and
    // the AwesomeAlert should disappear
    if (areCoordinatesConfirmed) {
      setAreCoordinatesConfirmed(false)
      setSuccessLottieVisible(true)
    }

    // The SuccessLottie Overlay should show up for 2 seconds
    // And disappear by its own
    if (successLottieVisibile && !areCoordinatesConfirmed) {
      setTimeout(() => {
        navigateBack()
        setSuccessLottieVisible(false)
      }, 3000)
    }
  }, [successLottieVisibile, areCoordinatesConfirmed])

  useEffect(() => {
    requestLocationPermission()
    return () => {
      Geolocation.clearWatch(watchID)
    }
  }, [navigation])

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true)
      })
      return () => task.cancel()
    }, []),
  )

  if (loadingActivitiyIndicator) {
    return (
      <CustomActivityIndicator
        loadingActivitiyIndicator={loadingActivitiyIndicator}
        setLoadingActivityIndicator={setLoadingActivityIndicator}
      />
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.ghostwhite,
      }}
    >
      <AwesomeAlert
        show={failedGeoLocationRequest}
        showProgress={false}
        title="Geolocalização"
        message="Não foi possível processar o pedido de acesso à localização do dispositivo. Tente mais tarde!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="   OK!   "
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          setFailedGeoLocationRequest(false)
        }}
      />

      <AwesomeAlert
        show={areCoordinatesPicked}
        showProgress={false}
        title="Coordenadas"
        message={`${coordaintes.latitude}; ${coordaintes.longitude}`}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Cancelar"
        confirmText="Confirmar"
        confirmButtonColor={COLORS.main}
        cancelButtonColor={COLORS.danger}
        onConfirmPressed={() => {
          saveCoordinates(resource, {
            latitude: coordaintes.latitude,
            longitude: coordaintes.longitude,
            position: coordaintes.position,
          })

          // navigate back to the respective farmer screen.
          // navigateBack();

          // call off the AwesomeAlert
          setAreCoordinatesPicked(false)

          // activate the SuccessLottie Overlay
          setAreCoordinatesConfirmed(true)
        }}
        onCancelPressed={() => {
          setAreCoordinatesPicked(false)
          setCoordinates({
            latitude: -1,
            longitude: -1,
            position: 0,
          })
        }}
      />

      <AwesomeAlert
        show={confirmGeoAlert}
        showProgress={false}
        title="Geolocalização"
        message="Este dispositivo aprovou o pedido de permissão deste aplicativo!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="   OK!   "
        confirmButtonColor={COLORS.main}
        onConfirmPressed={() => {
          setConfirmGeoAlert(false)
        }}
      />

      <AwesomeAlert
        show={rejectGeoAlert}
        showProgress={false}
        title="Geolocalização"
        message="O seu dispositivo rejeitou o pedido do ConnectCaju?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Sim"
        confirmText="Não"
        cancelButtonColor="#DD6B55"
        confirmButtonColor={COLORS.main}
        onCancelPressed={() => {
          setRejectGeoAlert(false)
          setPermissionGranted(true)
        }}
        onConfirmPressed={() => {
          // requestLocationPermission();
          setPermissionGranted(true)
          setRejectGeoAlert(false)
        }}
      />

      {/* 
            Controlling the success modal 
        */}

      {successLottieVisibile && (
        <SuccessLottie
          successLottieVisible={successLottieVisibile}
          setSuccessLottieVisible={setSuccessLottieVisible}
        />
      )}

      <Box
        style={{
          backgroundColor: COLORS.fourth,
          paddingBottom: 15,
        }}
      >
        <Stack
          direction="row"
          w="100%"
          pt="3"
          // bg="#EBEBE4"
        >
          <Box>
            <Pressable
              onPress={() => {
                // navigation.goBack() to the respective farmer screen
                navigateBack()
                // if (resourceName === 'Group'){
                //     navigation.navigate('Group', {
                //         ownerId: resource?._id,
                //     })
                // }
                // else if (resourceName === 'Institution'){
                //     navigation.navigate('Institution', {
                //         ownerId: resource?._id,
                //     })
                // }
                // else if (resourceName === 'Farmland') {
                //     if (ownerType === 'Single') {
                //         navigation.navigate('Farmer', {
                //             ownerId: resource?.farmerId,
                //         })
                //     }
                //     else if (ownerType === 'Group'){
                //         navigation.navigate('Group', {
                //             ownerId: resource?.farmerId,
                //         });
                //     }
                //     else if (ownerType === 'Institution') {
                //         navigation.navigate('Institution', {
                //             ownerId: resource?.farmerId,
                //         })
                //     }
                // }
              }}
              style={{
                position: "absolute",
                left: 0,
                top: 4,
                flexDirection: "row",
                // justifyContent: 'center',
                alignItems: "center",
              }}
            >
              <Icon name="arrow-back-ios" color={COLORS.main} size={25} />
              {/* <Text
                        style={{
                            color: COLORS.main,
                            fontFamily: 'JosefinSans-Bold',
                            marginLeft: -10,
                        }}
                    >
                        Voltar
                    </Text> */}
            </Pressable>
          </Box>
          <Center w="100%">
            <Text
              style={{
                textAlign: "center",
                fontFamily: "JosefinSans-Bold",
                fontSize: 16,
                color: COLORS.main,
              }}
            >
              Geolocalização
            </Text>
          </Center>
        </Stack>
      </Box>

      <Center
        style={{
          // minHeight: 300,
          flex: 1,
        }}
      >
        <TouchableOpacity onPress={async () => await getGeolocation()}>
          <GeoPin />
          {/* <Icon name="location-pin" size={60} color={COLORS.main} /> */}
        </TouchableOpacity>
        <Text
          style={{
            color: COLORS.grey,
            fontSize: 15,
            fontFamily: "JosefinSans-Regular",
            textAlign: "center",
          }}
        >
          Captura das coordenadas
        </Text>
      </Center>

      {/* <MapModal 
        farmlandId={resource._id}
        isMapVisible={isMapVisible}
        setIsMapVisible={setIsMapVisible}
        getCurrentPosition={getCurrentPosition}
        currentCoordinates={currentCoordinates}
    /> */}
    </SafeAreaView>
  )
}

export default GeolocationScreen
