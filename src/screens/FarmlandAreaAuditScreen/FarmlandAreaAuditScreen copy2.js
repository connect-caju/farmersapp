
import React, { useCallback, useEffect, useState } from "react";
import { 
    View, Text, SafeAreaView, Switch, FlatList, ScrollView, TouchableOpacity, PermissionsAndroid, Alert } from 'react-native';
import { Stack, Box, Center } from "native-base";
import Geolocation from 'react-native-geolocation-service';
import AwesomeAlert from 'react-native-awesome-alerts';
import BackgroundGeolocation, 
    { Location, Subscription, } from "react-native-background-geolocation";


import LottieAddButton from '../../components/Buttons/LottieAddButton';
import { Icon,  } from "@rneui/base";
import CoordinatesItem from "../../components/CoordinatesItem/CoordinatesItem";
import CustomDivider from "../../components/Divider/CustomDivider";
import GeoPin from "../../components/LottieComponents/GeoPin";


import { getPosition, sortCoordinatesByPositions, updateCoordinates } from "../../helpers/updateCoordinates";
import { Farmland } from "../../models/Farmland";
import { positions } from "../../fakedata/positions";

import { realmContext } from '../../models/realmContext';
import COLORS from "../../consts/colors";
import MapModal from "../../components/Modals/MapModal";
import { useFocusEffect } from "@react-navigation/native";
import { InteractionManager } from "react-native";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import { Pressable } from "react-native";
import { calculatePolygonArea } from "../../helpers/calculatePolygonArea";
const {useRealm, useObject, useQuery } = realmContext;


const FarmlandAreaAuditScreen = ({ route, navigation })=>{
    
    const realm = useRealm();
    const farmlandId = route.params?.farmlandId;
    const [confirmGeoAlert, setConfirmGeoAlert] = useState(false);
    const [rejectGeoAlert, setRejectGeoAlert] = useState(false);
    const [failedGeoLocationRequest, setFailedGeoLocationRequest] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isCalculatedArea, setIsCalculatedArea] = useState(false);
    const [area, setArea] = useState(null);

    const [currentCoordinates, setCurrentCoordinates] = useState({
        latitude: -1,
        longitude: -1,
    });

    const [isMapVisible, setIsMapVisible] = useState(false);
    const [loadingActivitiyIndicator, setLoadingActivityIndicator] = useState(false);

    // react-native-background-geolocation
    const [enabled, setEnabled] = useState(false);
    const [location, setLocation] = useState(null);
    const [refreshLocation, setRefreshLocation] = useState(false)

    const farmland = useObject('Farmland', farmlandId);

    useEffect(()=>{

    // if (refreshLocation) {
        
        // 1. Subscribe to events
        const onLocation = BackgroundGeolocation.onLocation((location) =>{
            setLocation({lat: parseFloat(location.coords.latitude), lng: parseFloat(location.coords.longitude)});
            console.log('[location]', location);
        })

        const onMotionChange = BackgroundGeolocation.onMotionChange((event)=>{
            console.log('[onMotionChange]', event);
        })

        const onActivityChange = BackgroundGeolocation.onActivityChange((event)=>{
            console.log('[onActivityChange]', event);
        })

        const onProviderChange = BackgroundGeolocation.onProviderChange((event)=>{
            console.log('[onProviderChange]', event);
        })

        // 2.  ready the plugin
        BackgroundGeolocation.ready({
            // Geolocation config
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10,

            // Activity Recognition
            stopTimeout: 5,

            // Application config
            debug: true,
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            stopOnTerminate: false,
            startOnBoot: true,


        }).then((state)=>{
            setEnabled(state.enabled);
            console.log("- BackgroundGeolocation is configured and ready: ", state.enabled)
        })

        return () => {
            // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
            // during development live-reload. Without this, event-listeners will accumulate with
            // each refresh during live-reload.
            onLocation.remove();
            onMotionChange.remove();
            onActivityChange.remove();
            onProviderChange.remove();
        }
    // }

    }, [ refreshLocation ]);

    useEffect(()=>{
            if (enabled) {
                BackgroundGeolocation.start();
            }
            else {
                BackgroundGeolocation.stop();
                setLocation(null);
            }
    }, [ enabled, refreshLocation ])



    // request the permission to use the device position coordinates
    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                // PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, 
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Geolocalização',
                    message: 'Pode o ConnectCaju obter accesso a sua localização?',
                    buttonNeutral: 'Mais tarde',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'OK'
                }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setPermissionGranted(true)
                    setConfirmGeoAlert(true);
                    // subscribeLocation();
                    console.log("You can use the app");
                } else {
                    setPermissionGranted(false)
                    console.log("Location Permission Denied");
                }
            } catch (err) {
                console.log('not granted:', granted);
                console.warn(err);
                setFailedGeoLocationRequest(true);
            }
        };
        
    // persist the acquired coordinates
    const saveCoordinates = (farmland, point)=>{
        realm.write(()=>{
            farmland.extremeCoordinates?.push(point);        
        })
    };

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
                Alert.alert('Falha', 'Tenta novamente!', {
                    cause: error,
                })
            },
            { 
                enableHighAccuracy: true, 
                accuracy: 'high',
                timeout: 15000, 
                maximumAge: 10000, 
                distanceFilter: 100,  
            }
        );
     };

    const getCurrentPosition = ()=>{

        if(!permissionGranted) {
            requestLocationPermission();
        }
        else{
            subscribeLocation();
        }
    }

    // get the current coordinates of device position  
    const getGeolocation = async ()=>{
        if (!permissionGranted){
            requestLocationPermission();
        }
        else { 
            Geolocation.getCurrentPosition(
                (position) => {
                    // get the exact position to the point
                    const number = getPosition(farmland?.extremeCoordinates);

                    saveCoordinates(farmland, {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        position: number,
                    });
                },
                (error) => {
                    Alert.alert('Falha', 'Tenta novamente!', {
                        cause: error,
                    })
                },
                { 
                    enableHighAccuracy: true, 
                    accuracy: 'high',
                    timeout: 15000, 
                    maximumAge: 10000, 
                    distanceFilter: 100,  
                }
            );
        }
    }
    

    useEffect(() => {
        requestLocationPermission();
        return () => {
        //   Geolocation.clearWatch(watchID);
        };
    }, [ navigation ]);
    

    const navigateBack = ()=>{
        if (farmland.ownerType === 'Group'){
            navigation.navigate('Group', {
                ownerId: farmland?.farmerId,
            });
        }
        else if (farmland.ownerType === 'Single') {
            navigation.navigate('Farmer', {
                ownerId: farmland?.farmerId,
            });
        }
        else if (farmland.ownerType === 'Institution') {
            navigation.navigate('Institution', {
                ownerId: farmland?.farmerId,
            });
        }
    }

    const keyExtractor = (item, index)=>index.toString();


    useFocusEffect(
        React.useCallback(() => {
          const task = InteractionManager.runAfterInteractions(() => {
            setLoadingActivityIndicator(true);
          });
          return () => task.cancel();
        }, [])
      );

    // organize the coordinates point objects 
    const handleCalculateArea = ()=>{
        let coordinates = farmland.extremeCoordinates;

        points = coordinates?.map((point)=>{
            return {
                lat: parseFloat(point?.latitude),
                lng: parseFloat(point?.longitude),
            }
        });
        const area = calculatePolygonArea(points); 
        setArea(Number(area));

        return area;
    };


    // save the area that has been calculated
    const  saveAuditedArea = (area)=>{
        realm.write(()=>{
            farmland.auditedArea = parseFloat(area);        
        })
    };

    
      if (loadingActivitiyIndicator) {
        return <CustomActivityIndicator 
            loadingActivitiyIndicator={loadingActivitiyIndicator}
            setLoadingActivityIndicator={setLoadingActivityIndicator}
        />
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
          confirmText="   OK   "
          confirmButtonColor="#DD6B55"
          onConfirmPressed={() => {
            setFailedGeoLocationRequest(false);
          }}
        />


    <AwesomeAlert
          show={isCalculatedArea}
          showProgress={false}
          title="Área"
          message={`${Number(area)} hectares`}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          confirmText=" Confirmar "
          cancelText=" Rejeitar  "
          confirmButtonColor={COLORS.main}
          cancelButtonColor="#DD6B55"
          onConfirmPressed={() => {
            saveAuditedArea(area); // save the auditedarea
            setIsCalculatedArea(false);
            navigateBack();
          }}
          onCancelPressed={()=>{
            setIsCalculatedArea(false);
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
          confirmText="   OK   "
          confirmButtonColor={COLORS.main}
          onConfirmPressed={() => {
            setConfirmGeoAlert(false);
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
          cancelText="  Sim  "
          confirmText="  Não  "
          cancelButtonColor="#DD6B55"
          confirmButtonColor={COLORS.main}
          onCancelPressed={() => {
            setRejectGeoAlert(false);
            setPermissionGranted(true);
          }}
          onConfirmPressed={() => {
            // requestLocationPermission();
            setPermissionGranted(true);
            setRejectGeoAlert(false);
          }}
        />


    <Box
        style={{
            backgroundColor: COLORS.fourth,
            paddingVertical: 20,
        }}
    >
        <Stack
            direction="row" 
            w="100%"
            bg="#EBEBE4"
        >
            <Box>
                <Pressable
                    onPress={()=>{
                        navigateBack();
                    }} 
                    
                    style={{
                        position: 'absolute',
                        left: 4,
                        top: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Icon 
                        name='arrow-back-ios' 
                        color={COLORS.main} 
                        size={30}  
                    />
                </Pressable>
            </Box>
            <Center w="100%">
                <Text
                    style={{ 
                        textAlign: 'center', 
                        fontFamily: 'JosefinSans-Bold', 
                        fontSize: 16, 
                        color: COLORS.main,  
                    }}
                >
                    Geolocalização
                </Text>
            </Center>

        </Stack>

        </Box>

        <Box
            w="100%" 
            px="3" 
        >
            <Stack direction="row"
                px="3"
            >
                <Box  w={farmland?.extremeCoordinates.length === 0 ? "100%" : "50%"}
                    style={{
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'JosefinSans-Bold',
                            fontSize: 14,
                            color: COLORS.black,
                            lineHeight: 20,
                            textAlign: farmland?.extremeCoordinates.length === 0 ? "center" : "left",
                            paddingTop: 20,
                        }}
                    >
                        Pontos extremos da área do pomar
                    </Text>
                    <Switch 
                        value={enabled}
                        onValueChange={setEnabled}
                     />
                </Box>



                <Box w={farmland?.extremeCoordinates.length === 0 ? "0%" : "50%"}
                    alignItems={'flex-end'}
                    style={{
                        flex: 1,
                        justifyContent: 'center'
                    }}
                >
                {   
                    farmland?.extremeCoordinates.length > 0 &&
                        <TouchableOpacity
                            onPress={
                                async ()=> {
                                    await getGeolocation();
                                    setRefreshLocation(!refreshLocation);
                                }
                            }
                        >
                            <GeoPin />
                        </TouchableOpacity>
                    }
                </Box>
            </Stack>
        </Box>
        <Box
            style={{
                width: '100%',
                paddingHorizontal: 10,
            }}
        >

        {/* { extremeLocations?.map(loc=>             */}
            <Text>
                ponto: {location?.lat}; {location?.lng}
            </Text>
            {/* ) */}
        {/* } */}
        </Box>

    {    farmland?.extremeCoordinates.length === 0 &&   
        <Center style={{ minHeight: 300, }}>
            <Box 
                // alignItems={"center"}
                style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                borderWidth: 10,
                borderColor: COLORS.main,
                shadowColor: COLORS.main,
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.5,
                shadowRadius: 1.65,
                elevation: 3,
            }}
            >
                <TouchableOpacity
                    onPress={async ()=> {
                        await getGeolocation();
                        setRefreshLocation(!refreshLocation);
                    }}
                >
                    {/* <GeoPin /> */}
                    <Icon name="location-pin" size={60} color={COLORS.main} />
                </TouchableOpacity>
            </Box>
            <Box w="100%" alignItems={'center'}>
                <Text style={{
                    color: COLORS.grey,
                    fontSize: 12,
                    fontFamily: 'JosefinSans-Regular',
                    textAlign: 'center',
                }}>
                Pontos extremos
                </Text>
            </Box>

    </Center>
    }

    <FlatList
        data={sortCoordinatesByPositions(farmland?.extremeCoordinates)}
        keyExtractor={keyExtractor}
        renderItem={({ item })=>{
            return <CoordinatesItem item={item} farmland={farmland}  />
        }}
    />
    <Center
        style={{
            paddingVertical: 10,
        }}
    >

{        
    farmland?.extremeCoordinates.length > 2 && 
    (

        <TouchableOpacity
        onPress={()=>{
                // navigation.navigate('FarmlandAreaAudit', {
                //     farmlandId,
                // })
                handleCalculateArea();
                setIsCalculatedArea(true);
            }}
            >
        <Box
            style={{
                borderWidth: 1,
                borderColor: COLORS.main,
                borderRadius: 30,
                paddingHorizontal: 20,
                paddingVertical: 10,
                justifyContent: 'center',
            }}
        >
            <Text
                style={{ 
                    fontSize: 16, 
                    fontFamily: 'JosefinSans-Bold', 
                    color: COLORS.main,
                    textAlign: 'center',
                }}
                >
                Calcular Área
            </Text>
        </Box>
        </TouchableOpacity>
    )}    

    </Center>
    <MapModal 
        farmlandId={farmland._id}
        isMapVisible={isMapVisible}
        setIsMapVisible={setIsMapVisible}
        getCurrentPosition={getCurrentPosition}
        currentCoordinates={currentCoordinates}
    />
    </SafeAreaView>
    )
}

export default FarmlandAreaAuditScreen;