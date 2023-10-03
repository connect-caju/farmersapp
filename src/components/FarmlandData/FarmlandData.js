import React, { useState, useEffect, useCallback, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Animated,
  Easing,
  useNativeDriver,
} from "react-native"
import {
  Box,
  FormControl,
  Stack,
  Center,
  Separator,
  Thumbnail,
  List,
  ListItem,
} from "native-base"
import { Avatar, Divider, Icon, Tooltip } from "@rneui/base"
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native"
import { v4 as uuidv4 } from "uuid"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen"

import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenHeight,
  responsiveScreenWidth,
  useDimensionsChange,
} from "react-native-responsive-dimensions"

import CustomDivider from "../Divider/CustomDivider"
import { useNavigation } from "@react-navigation/native"
import COLORS from "../../consts/colors"

import AwesomeAlert from "react-native-awesome-alerts"
import { resourceValidation } from "../../consts/resourceValidation"
import EditFarmlandData from "../EditData/EditFarmlandData"
import { roles } from "../../consts/roles"
import { errorMessages } from "../../consts/errorMessages"
import validateInvalidationMessage from "../../helpers/validateInvalidationMessage"
import ConfirmData from "../EditData/ConfirmDataCopy"

import { useUser } from "@realm/react"
import { realmContext } from "../../models/realmContext"
import { normalizeBlockList } from "../../helpers/normalizeBlockList"
import NewFarmlandBlock from "../FarmlandBlockRegistration/NewFarmlandBlock"
import { getPlantingYears } from "../../helpers/getPlantingYears"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faCrop,
  faEllipsisVertical,
  faTree,
} from "@fortawesome/free-solid-svg-icons"
import { SuccessLottie } from "../LottieComponents/SuccessLottie"
const { useRealm, useQuery, useObject } = realmContext

const farmlandResourceMessage = "farmlandResourceMessage"

const FarmlandData = ({
  farmland,
  setRefresh,
  refresh,
  // setSuccessLottieVisible,  successLottieVisible,
  ownerImage,
  // isOverlayVisible,
  // setIsOverlayVisible,
  // scale, resizeBox,
}) => {
  const realm = useRealm()
  const user = useUser()
  const customUserData = user?.customData
  const invalidationMotives = realm
    .objects("InvalidationMotive")
    .filtered(`resourceId == "${farmland?._id}"`)

  const scaleBlockBox = useRef(new Animated.Value(0)).current
  const [presentEditFarmland, setPresentEditFarmland] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [isCollapseOn, setIsCallapseOn] = useState(false)

  const navigation = useNavigation()

  // ------------------------------------------
  const [alert, setAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState("")
  const [titleAlert, setTitleAlert] = useState("")
  const [cancelText, setCancelText] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [showCancelButton, setShowCancelButton] = useState(false)
  const [showConfirmButton, setShowConfirmButton] = useState(false)
  const [validated, setValidated] = useState(false)
  const [invalidated, setInvalidated] = useState(false)
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState({})

  // ---------------------------------------------
  // adding new Block to an existing farmland
  const [isNewBlockVisible, setIsNewBlockVisible] = useState(false)
  const [isAreaNotEnough, setIsAreaNotEnough] = useState(false)
  const [successLottieVisible, setSuccessLottieVisible] = useState(false)

  // -----------------------------------------------

  // ---------------------------------------------
  //  Data editing

  const [dataToBeUpdated, setDataToBeUpdated] = useState("")
  const [isConfirmDataVisible, setIsConfirmDataVisible] = useState(false)
  // const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // update farmland main data
  const [description, setDescription] = useState("")
  const [consociatedCrops, setConsociatedCrops] = useState([])
  const [totalArea, setTotalArea] = useState("")
  const [trees, setTrees] = useState("")

  const [oldDescription, setOldDescription] = useState("")
  const [oldConsociatedCrops, setOldConsociatedCrops] = useState([])
  const [oldTotalArea, setOldTotalArea] = useState("")
  const [oldTrees, setOldTrees] = useState("")

  const [newDataObject, setNewDataObject] = useState({})
  const [oldDataObject, setOldDataObject] = useState({})

  // -----------------------------------------------
  //  Block data updating
  const [blockId, setBlockId] = useState("")
  const [plantingYear, setPlantingYear] = useState("")
  const [blockTrees, setBlockTrees] = useState("")
  const [usedArea, setUsedArea] = useState("")
  const [densityWidth, setDensityWidth] = useState("")
  const [densityLength, setDensityLength] = useState("")
  const [plantTypes, setPlantTypes] = useState([])
  const [clones, setClones] = useState([])
  const [addedClone, setAddedClone] = useState("")
  const [isDensityModeIrregular, setIsDensityModeIrregular] = useState(false)
  const [isDensityModeRegular, setIsDensityModeRegular] = useState(false)
  const [sameTypeTreesList, setSameTypeTreesList] = useState([])
  const [remainingArea, setRemainingArea] = useState()
  const [selected, setSelected] = useState([])

  const [oldBlockId, setOldBlockId] = useState("")
  const [oldPlantingYear, setOldPlantingYear] = useState("")
  const [oldBlockTrees, setOldBlockTrees] = useState("")
  const [oldUsedArea, setOldUsedArea] = useState("")
  const [oldDensityWidth, setOldDensityWidth] = useState("")
  const [oldDensityLength, setOldDensityLength] = useState("")
  const [oldPlantTypes, setOldPlantTypes] = useState([])
  const [oldClones, setOldClones] = useState([])
  const [addedOldClone, setAddedOldClone] = useState("")
  const [isOldDensityModeIrregular, setIsOldDensityModeIrregular] =
    useState(false)
  const [isOldDensityModeRegular, setIsOldDensityModeRegular] = useState(false)
  const [oldSameTypeTreesList, setOldSameTypeTreesList] = useState([])
  const [oldRemainingArea, setOldRemainingArea] = useState()

  const [isEditBlockVisible, setIsEditBlockVisible] = useState(false)
  // const [autoRefresh, setAutoRefresh] = useState(false);

  // -----------------------------------------------

  // check if there is enough area for a new Block to be added in
  // this function prevent adding new cashew trees in a farmland
  // where there is no enough space left
  const checkAreasConformity = (farmland) => {
    const totalArea = farmland?.totalArea
    const blocksAreas = farmland?.blocks
      ?.map((block) => block?.usedArea)
      .reduce((acc, el) => acc + el, 0)
    if (totalArea - blocksAreas <= 0.02) {
      setIsAreaNotEnough(true)
    }
  }

  useEffect(() => {
    checkAreasConformity(farmland)
  }, [farmland, autoRefresh, refresh])

  const validationAction = (realm, resourceId, flag) => {
    realm.write(() => {
      const foundFarmland = realm.objectForPrimaryKey(
        "Farmland",
        `${resourceId}`,
      )
      if (flag === "validate") {
        foundFarmland.status = resourceValidation.status.validated
        foundFarmland.checkedBy = customUserData?.name
      } else if (flag === "invalidate") {
        foundFarmland.status = resourceValidation.status.invalidated
        foundFarmland.checkedBy = customUserData?.name
      }
    })
  }

  const addMessage = useCallback(
    (realm, newResourceId, newMessage) => {
      if (!validateInvalidationMessage(newMessage, errors, setErrors)) {
        return
      }

      const validatedMessage = validateInvalidationMessage(
        newMessage,
        errors,
        setErrors,
      )

      const invalidationMotive = realm
        .objects("InvalidationMotive")
        .filtered(`resourceId == "${newResourceId}"`)
      const newMessageObject = {
        position:
          invalidationMotive[0] && invalidationMotive[0]?.messages?.length > 0
            ? invalidationMotive[0]?.messages?.length + 1
            : 0,
        message: validatedMessage,
        ownerName: customUserData?.name,
        createdAt: new Date(),
      }

      if (invalidationMotive?.length > 0) {
        realm.write(() => {
          invalidationMotive[0].messages.push(newMessageObject)
        })
      } else {
        realm.write(async () => {
          const newResourceMessage = await realm.create("InvalidationMotive", {
            _id: uuidv4(),
            resourceId: farmland?._id,
            resourceName: "Farmland",
            messages: [newMessageObject],
            createdAt: new Date(),
          })
        })
      }
    },
    [realm, user, message],
  )

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(farmlandResourceMessage)
      mutableSubs.add(
        realm
          .objects("InvalidationMotive")
          .filtered(`resourceId == "${farmland._id}"`),
        { name: farmlandResourceMessage },
      )
    })

    const interval = setInterval(() => {
      setAutoRefresh(!autoRefresh)
    }, 2000)

    clearInterval(interval)
  }, [
    realm,
    user,
    message,
    invalidationMotives,
    autoRefresh,
    isCollapseOn,
    isNewBlockVisible,
  ])

  const resizeBlockBox = (to) => {
    to === 1 && setIsNewBlockVisible(true)
    Animated.timing(scaleBlockBox, {
      toValue: to,
      useNativeDriver: true,
      duration: 400,
      easing: Easing.linear,
    }).start(() => to === 0 && setIsNewBlockVisible(false))
  }

  return (
    <View
      style={{
        paddingVertical: hp("1%"),
      }}
    >
      <AwesomeAlert
        show={alert}
        titleStyle={{
          fontSize: 18,
          // paddingVertical: 15,
          // color: COLORS.ghostwhite,
          fontWeight: "bold",
          marginBottom: 5,
          // backgroundColor: COLORS.main,
          width: "100%",
          textAlign: "center",
        }}
        messageStyle={{
          fontSize: 18,
          color: COLORS.grey,
          fontFamily: "JosefinSans-Regular",
          lineHeight: 25,
          textAlign: "center",
        }}
        alertContainerStyle={
          {
            // width: 300,
          }
        }
        overlayStyle={
          {
            // width: 100,
          }
        }
        contentContainerStyle={
          {
            // width: '90%',
            // height: '70%',
          }
        }
        contentStyle={
          {
            // flex: 1,
            // paddingVertical: 20,
          }
        }
        cancelButtonStyle={{
          // width: 120,
          marginRight: 15,
        }}
        cancelButtonTextStyle={{
          fontSize: 18,
          textAlign: "center",
          //   fontWeight: 'bold',
          fontFamily: "JosefinSans-Bold",
        }}
        confirmButtonStyle={{
          // width: 120,
          marginLeft: 15,
        }}
        confirmButtonTextStyle={{
          fontSize: 18,
          textAlign: "center",
          //   fontWeight: 'bold',
          fontFamily: "JosefinSans-Bold",
        }}
        showProgress={false}
        title={titleAlert}
        message={messageAlert}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={showCancelButton}
        showConfirmButton={showConfirmButton}
        cancelText={cancelText}
        confirmText={confirmText}
        cancelButtonColor="#DD6B55"
        confirmButtonColor={COLORS.main}
        onCancelPressed={() => {
          setAlert(false)
          setValidated(false)
          setInvalidated(false)
        }}
        onConfirmPressed={() => {
          setAlert(false)
          if (validated) {
            validationAction(realm, farmland?._id, "validate")
            setValidated(false)
          } else if (invalidated) {
            validationAction(realm, farmland?._id, "invalidate")
            setInvalidated(false)
          }
        }}
      />

      <Collapse
        style={{
          flex: 1,
        }}
      >
        <CollapseHeader
          style={{
            minHeight: 80,
            padding: 8,
            borderRadius: 8,
            backgroundColor: COLORS.pantone,
            // paddingHorizontal: 10,
            justifyContent: "space-between",
          }}
          onToggle={(isOn) => {
            setIsCallapseOn(isOn)
            setRefresh(!isOn)
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: COLORS.white,
                fontFamily: "JosefinSans-Bold",
              }}
            >
              Anos de Plantio : [{getPlantingYears(farmland?.blocks)}]
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "50%",
              }}
            >
              <FontAwesomeIcon
                icon={faTree}
                size={25}
                color={COLORS.ghostwhite}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.ghostwhite,
                  fontFamily: "JosefinSans-Bold",
                }}
              >
                {"   "}
                {farmland?.trees} árvores
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "50%",
              }}
            >
              <FontAwesomeIcon
                icon={faCrop}
                size={25}
                color={COLORS.ghostwhite}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.ghostwhite,
                  fontFamily: "JosefinSans-Bold",
                }}
              >
                {"   "}
                {farmland?.totalArea.toFixed(1)} hectares
              </Text>
            </View>
          </View>
        </CollapseHeader>
        <CollapseBody>
          <View
            style={{
              marginBottom: 40,
              padding: 10,
              borderColor: COLORS.pantone,
              shadowColor: COLORS.pantone,
              backgroundColor: COLORS.ghostwhite,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 3,
              paddingLeft: 20,
            }}
          >
            <Box
              style={{
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: 4,
                right: 4,
                zIndex: 1,
                flexDirection: "row",
                borderColor:
                  farmland?.status === resourceValidation.status.pending
                    ? COLORS.danger
                    : farmland?.status === resourceValidation.status.validated
                    ? COLORS.pantone
                    : COLORS.red,
                borderWidth: 2,
                borderRadius: 10,
              }}
            >
              <Icon
                name={
                  farmland?.status === resourceValidation.status.pending
                    ? "pending-actions"
                    : farmland?.status === resourceValidation.status.validated
                    ? "check-circle"
                    : "dangerous"
                }
                size={wp("6%")}
                color={
                  farmland?.status === resourceValidation.status.pending
                    ? COLORS.danger
                    : farmland?.status === resourceValidation.status.validated
                    ? COLORS.pantone
                    : COLORS.red
                }
              />
              <Text
                style={{
                  color:
                    farmland?.status === resourceValidation.status.pending
                      ? COLORS.danger
                      : farmland?.status === resourceValidation.status.validated
                      ? COLORS.pantone
                      : COLORS.red,
                }}
              >
                {farmland?.status === resourceValidation.status.pending
                  ? resourceValidation.message.pendingResourceMessage
                  : farmland?.status === resourceValidation.status.validated
                  ? resourceValidation.message.validatedResourceMessage
                  : resourceValidation.message.invalidatedResourceMessage}
              </Text>
            </Box>

            <Stack w="100%" direction="column" py="4">
              <Stack direction="row" mt="5">
                <Box w="90%">
                  {/* <Text
                        style={{
                            color: COLORS.black,
                            fontSize: responsiveFontSize(2),
                            fontFamily: 'JosefinSans-Bold',
                            
                        }}
                    >
                        Dados do Pomar
                    </Text> */}
                </Box>
                {/* <Box w="25%">
                
                </Box>     */}
                <Box w="10%">
                  {customUserData?.role !== roles.provincialManager && (
                    <TouchableOpacity
                      disabled={
                        farmland?.status === resourceValidation.status.validated
                          ? true
                          : false
                      }
                      onPress={() => {
                        setPresentEditFarmland(true)
                        // resizeBox(1);
                        setDataToBeUpdated("farmlandMainData")
                        setBlockId("") // remove the blockId to avoid confusion in the overlay component
                      }}
                    >
                      <Icon
                        // name="home"
                        name="edit"
                        size={20}
                        color={
                          farmland?.status ===
                          resourceValidation.status.validated
                            ? COLORS.lightgrey
                            : farmland?.status ===
                              resourceValidation.status.invalidated
                            ? COLORS.red
                            : COLORS.pantone
                        }
                      />
                    </TouchableOpacity>
                  )}
                </Box>
              </Stack>

              <Stack w="100%" direction="row">
                {/* <Box w="40%" >
                    <Text
                        style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: 'JosefinSans-Regular',
                            
                        }}
                        >
                    Descrição:
                </Text>
                </Box>
                <Box w="60%">
                    <Text
                        style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: 'JosefinSans-Regular',
                        }}  
                        numberOfLines={2}
                        ellipsizeMode={"tail"}

                    >
                        {farmland?.description}
                    </Text>
                </Box> */}
              </Stack>
              <Stack w="100%" direction="row">
                <Box w="40%">
                  <Text
                    style={{
                      color: COLORS.grey,
                      fontSize: responsiveFontSize(1.8),
                      fontFamily: "JosefinSans-Regular",
                    }}
                  >
                    Consociação:
                  </Text>
                </Box>
                <Box w="60%">
                  <Text
                    style={{
                      color: COLORS.grey,
                      fontSize: responsiveFontSize(1.8),
                      fontFamily: "JosefinSans-Regular",
                    }}
                  >
                    [ {farmland?.consociatedCrops.join("; ")} ]
                  </Text>
                </Box>
              </Stack>

              <Stack w="100%" direction="row">
                {/* <Box w="40%" >
                    <Text
                        style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: 'JosefinSans-Regular',
                            
                        }}
                        >
                    Área Total:
                </Text>
                </Box>
                <Box w="60%">
                    <Text
                        style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: 'JosefinSans-Regular',
                        }}                    
                        >
                        {farmland?.totalArea} hectares
                    </Text>
                </Box> */}
              </Stack>

              <Stack w="100%" direction="row">
                {/* <Box w="40%" >
                    <Text
                        style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: 'JosefinSans-Regular',
                            
                        }}
                        >
                    Total de Cajueiros:
                </Text>
                </Box>
                <Box w="60%">
                    <Text
                        style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: 'JosefinSans-Regular',
                        }}                    
                        >
                        {farmland?.trees} árvores
                    </Text>
                </Box> */}
              </Stack>
            </Stack>
            <CustomDivider />

            <Stack w="100%" direction="column" py="4">
              <Stack w="100%" direction="row">
                <Box w="90%">
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: responsiveFontSize(2),
                      fontFamily: "JosefinSans-Bold",
                    }}
                  >
                    Pontos Extremos do Pomar
                  </Text>
                </Box>
                {/* <Box w="25%"></Box> */}
                <Box w="10%">
                  {customUserData?.role !== roles.provincialManager && (
                    <TouchableOpacity
                      disabled={
                        farmland?.status === resourceValidation.status.validated
                          ? true
                          : false
                      }
                      style={{}}
                      onPress={() =>
                        navigation.navigate("FarmlandAreaAudit", {
                          farmlandId: farmland._id,
                        })
                      }
                    >
                      <Icon
                        name="add-location-alt"
                        size={30}
                        color={
                          farmland?.status ===
                          resourceValidation.status.validated
                            ? COLORS.lightgrey
                            : COLORS.pantone
                          // farmland?.status === resourceValidation.status.invalidated ? COLORS.red : COLORS.pantone
                        }
                        // color={farmland?.validated === resourceValidation.status.validated ? COLORS.lightgrey : farmland?.validated === resourceValidation.status.invalidated ? COLORS.red : COLORS.main }
                      />
                    </TouchableOpacity>
                  )}
                </Box>
              </Stack>
              {farmland?.extremeCoordinates.length > 0 &&
                farmland?.extremeCoordinates?.map((coords) => {
                  return (
                    <Stack
                      key={coords?.position}
                      w="100%"
                      direction="row"
                      style={{
                        // backgroundColor: 'grey',
                        marginVertical: 5,
                      }}
                    >
                      <Box
                        w="40%"
                        style={{
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          Ponto {coords?.position}
                        </Text>
                      </Box>
                      <Box w="60%">
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          Latitude: {coords?.latitude}
                        </Text>
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          Longitude: {coords?.longitude}
                        </Text>
                      </Box>
                    </Stack>
                  )
                })}
              {farmland?.extremeCoordinates.length === 0 && (
                <Stack w="100%" direction="row">
                  <Box w="40%">
                    <Text
                      style={{
                        color: COLORS.grey,
                        fontSize: 14,
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      {/*  */}
                    </Text>
                  </Box>
                  <Box w="60%">
                    <Text
                      style={{
                        color: COLORS.grey,
                        fontSize: 14,
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      (Nenhumas)
                    </Text>
                  </Box>
                </Stack>
              )}
            </Stack>

            <CustomDivider />

            <Stack w="100%" direction="column" py="4">
              <Stack w="100%" direction="row">
                <Box w="90%">
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: responsiveFontSize(2),
                      fontFamily: "JosefinSans-Bold",
                    }}
                  >
                    Geolocalização
                  </Text>
                </Box>
                {/* <Box w="25%"></Box> */}
                <Box w="10%">
                  {customUserData?.role !== roles.provincialManager && (
                    <TouchableOpacity
                      disabled={
                        farmland?.status === resourceValidation.status.validated
                          ? true
                          : false
                      }
                      style={{}}
                      onPress={() => {
                        navigation.navigate("Geolocation", {
                          resourceName: "Farmland",
                          resourceId: farmland._id,
                          ownerType: farmland.ownerType,
                          //     navigation.navigate('FarmlandAreaAudit', {
                          //     farmlandId: farmland._id,
                        })
                      }}
                    >
                      <Icon
                        name="add-location-alt"
                        size={30}
                        color={
                          farmland?.status ===
                          resourceValidation.status.validated
                            ? COLORS.lightgrey
                            : COLORS.pantone
                          // farmland?.status === resourceValidation.status.invalidated ? COLORS.red : COLORS.pantone
                        }
                      />
                    </TouchableOpacity>
                  )}
                </Box>
              </Stack>
              {farmland?.geolocation?.latitude &&
                farmland?.geolocation?.longitude && (
                  <>
                    <Stack w="100%" direction="row">
                      <Box w="40%">
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          Latitude
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          {farmland?.geolocation?.latitude}
                        </Text>
                      </Box>
                    </Stack>

                    <Stack w="100%" direction="row">
                      <Box w="40%">
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          Longitude
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          {farmland?.geolocation?.longitude}
                        </Text>
                      </Box>
                    </Stack>
                  </>
                )}
              {!farmland?.geolocation && (
                <Stack w="100%" direction="row">
                  <Box w="40%">
                    <Text
                      style={{
                        color: COLORS.grey,
                        fontSize: 14,
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      {/*  */}
                    </Text>
                  </Box>
                  <Box w="60%">
                    <Text
                      style={{
                        color: COLORS.grey,
                        fontSize: 14,
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      (Nenhuma)
                    </Text>
                  </Box>
                </Stack>
              )}
            </Stack>

            <CustomDivider />

            {
              // !isAreaNotEnough &&
              customUserData?.role !== roles.provincialManager && (
                <Stack w="100%" direction="row" py="4">
                  <Box w="90%">
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: responsiveFontSize(2),
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Parcela de Cajueiros
                    </Text>
                  </Box>
                  <Box w="10%">
                    <TouchableOpacity
                      onPress={() => {
                        if (farmland) {
                          // make the block data form visible
                          // setIsNewBlockVisible(true);
                          resizeBlockBox(1)
                        }
                      }}
                    >
                      <Icon
                        name="add-circle"
                        size={30}
                        color={COLORS.pantone}
                      />
                    </TouchableOpacity>
                  </Box>
                </Stack>
              )
            }

            {/* blocks start here */}
            <Box
              w="100%"
              style={{
                backgroundColor: COLORS.dark,
                paddingVertical: 10,
                paddingHorizontal: 5,
              }}
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(2),
                  color: COLORS.ghostwhite,
                  fontFamily: "JosefinSans-Bold",
                }}
              >
                Parcelas com cajueiros
              </Text>
            </Box>
            {normalizeBlockList(farmland?.blocks)?.length === 0 && (
              <View
                style={{
                  padding: 30,
                  alignSelf: "center",
                  width: "70%",
                }}
              >
                <Icon name="warning" size={25} color={COLORS.danger} />
                <Text
                  style={{
                    color: COLORS.danger,
                    fontSize: 14,
                    fontFamily: "JosefinSans-Bold",
                    textAlign: "center",
                  }}
                >
                  Nenhuma percela de cajueiros associada a esta área
                </Text>
              </View>
            )}

            {normalizeBlockList(farmland?.blocks)?.map((block, index) => (
              <Box
                key={index}
                mt="3"
                style={{
                  marginBottom: 15,
                  marginRight: 10,
                }}
              >
                <Box
                  style={{
                    paddingVertical: 20,
                  }}
                >
                  <Stack w="100%" direction="row" space={2}>
                    {/* <Box w="5%"></Box> */}
                    <Box
                      w="10%"
                      style={{
                        // backgroundColor: COLORS.black,
                        // borderRadius: 100,
                        // justifyContent: 'center',
                        alignItems: "center",
                        // padding: 1,
                      }}
                    >
                      <Box
                        style={{
                          backgroundColor: COLORS.dark,
                          borderRadius: 100,
                          width: wp("6%"),
                          // justifyContent: 'center',
                          // alignItems: 'center',
                          // padding: 1,
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.ghostwhite,
                            fontSize: responsiveFontSize(2),
                            fontFamily: "JosefinSans-Regular",
                            textAlign: "center",
                          }}
                        >
                          {block?.position + 1}
                        </Text>
                      </Box>
                    </Box>
                    <Box w="80%">
                      <Text
                        style={{
                          color: COLORS.dark,
                          fontSize: responsiveFontSize(2),
                          fontFamily: "JosefinSans-Bold",
                        }}
                      >
                        Ano de Plantio: {block.plantingYear}
                      </Text>
                    </Box>
                    <Box w="10%">
                      {customUserData?.role !== roles.provincialManager && (
                        <TouchableOpacity
                          disabled={
                            farmland?.status ===
                            resourceValidation.status.validated
                              ? true
                              : false
                          }
                          style={{}}
                          onPress={() => {
                            // setIsOverlayVisible(!isOverlayVisible);
                            setPresentEditFarmland(true)
                            // resizeBox(1)
                            setDataToBeUpdated("blockData")
                            setBlockId(block._id)
                            setIsEditBlockVisible(true)
                          }}
                        >
                          <Icon
                            // name="home"
                            name="edit"
                            size={20}
                            color={
                              farmland?.status ===
                              resourceValidation.status.validated
                                ? COLORS.lightgrey
                                : farmland?.status ===
                                  resourceValidation.status.invalidated
                                ? COLORS.red
                                : COLORS.pantone
                            }
                          />
                        </TouchableOpacity>
                      )}
                    </Box>
                  </Stack>

                  <Stack w="100%" direction="row">
                    <Box w="35%" style={{}}>
                      <Text
                        style={{
                          color: COLORS.grey,
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        Compasso:
                      </Text>
                    </Box>
                    <Box w="65%">
                      <Text
                        style={{
                          color: COLORS.grey,
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        {block?.density?.mode === "Irregular"
                          ? block?.density?.mode
                          : block?.density?.mode === "Regular"
                          ? `${block?.density?.mode} (${block?.density.length} por ${block?.density?.width} metros)`
                          : ""}{" "}
                      </Text>
                    </Box>
                  </Stack>

                  <Stack w="100%" direction="row">
                    <Box w="35%" style={{}}>
                      <Text
                        style={{
                          color: COLORS.grey,
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        Área:
                      </Text>
                    </Box>
                    <Box w="65%">
                      <Text
                        style={{
                          color: COLORS.grey,
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        {block?.usedArea?.toFixed(2)} hectares
                      </Text>
                    </Box>
                  </Stack>

                  <Stack w="100%" direction="row">
                    <Box w="35%" style={{}}>
                      <Text
                        style={{
                          color: COLORS.grey,
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        Cajueiros:
                      </Text>
                    </Box>
                    <Box w="65%">
                      <Text
                        style={{
                          color: COLORS.grey,
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        {block?.trees} árvores
                      </Text>
                    </Box>
                  </Stack>
                </Box>

                {/* <CustomDivider /> */}

                <Stack w="100%" direction="row" space={3}>
                  <Box w="90%">
                    <Text
                      style={{
                        color: COLORS.grey,
                        fontSize: responsiveFontSize(2),
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Tipos de planta
                    </Text>
                  </Box>
                  <Box w="10%">
                    {customUserData?.role !== roles.provincialManager && (
                      <TouchableOpacity
                        disabled={
                          farmland?.status ===
                          resourceValidation.status.validated
                            ? true
                            : false
                        }
                        style={{}}
                        onPress={() => {
                          // setIsOverlayVisible(!isOverlayVisible);
                          setPlantTypes([])
                          setClones([])
                          setPresentEditFarmland(true)
                          // resizeBox(1);
                          setDataToBeUpdated("plantType")
                          setBlockTrees(block?.trees)
                          setBlockId(block._id)
                          setIsEditBlockVisible(true)
                        }}
                      >
                        <Icon
                          // name="home"
                          name="edit"
                          size={20}
                          color={
                            farmland?.status ===
                            resourceValidation.status.validated
                              ? COLORS.lightgrey
                              : farmland?.status ===
                                resourceValidation.status.invalidated
                              ? COLORS.red
                              : COLORS.pantone
                          }
                        />
                      </TouchableOpacity>
                    )}
                  </Box>
                </Stack>
                {block?.sameTypeTrees?.length > 0 ? (
                  block?.sameTypeTrees?.map((sameType, index) => (
                    <Box key={index}>
                      <Stack
                        w="100%"
                        direction="row"
                        // pl="4"
                      >
                        <Box w="60%" style={{}}>
                          <Text
                            style={{
                              color: COLORS.grey,
                              fontSize: responsiveFontSize(1.8),
                              fontFamily: "JosefinSans-Regular",
                            }}
                          >
                            <Icon
                              name="arrow-forward"
                              color={COLORS.grey}
                              size={10}
                            />{" "}
                            {sameType?.treeType}
                          </Text>
                        </Box>
                        <Box w="40%">
                          <Text
                            style={{
                              color: COLORS.grey,
                              fontSize: responsiveFontSize(1.8),
                              fontFamily: "JosefinSans-Regular",
                            }}
                          >
                            {sameType?.trees} árvores
                          </Text>
                        </Box>
                      </Stack>
                    </Box>
                  ))
                ) : (
                  <Text
                    style={{
                      color: COLORS.red,
                      fontSize: 16,
                      fontFamily: "JosefinSans-Regular",
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    Actualizar os tipos de plantas para esta parcela de
                    cajueiros
                  </Text>
                )}
                <Box
                  style={{
                    paddingTop: 20,
                  }}
                >
                  <CustomDivider />
                </Box>
              </Box>
            ))}

            <Box
              style={{
                marginTop: -10,
                backgroundColor: COLORS.verylightgrey,
              }}
            >
              {/* <CustomDivider /> */}

              <Stack direction="column" w="100%" style={{ paddingTop: 5 }}>
                <Box w="100%">
                  <Text
                    style={{
                      textAlign: "right",
                      color: COLORS.grey,
                      fontFamily: "JosefinSans-Italic",
                      fontSize: 12,
                    }}
                  >
                    Registado por{" "}
                    {farmland?.userName === customUserData?.name
                      ? "mim"
                      : farmland?.userName}{" "}
                    aos {new Date(farmland?.createdAt).getDate()}-
                    {new Date(farmland?.createdAt).getMonth() + 1}-
                    {new Date(farmland?.createdAt).getFullYear()}
                  </Text>

                  {farmland?.modifiedBy && (
                    <Box w="100%">
                      <Text
                        style={{
                          textAlign: "right",
                          color: COLORS.grey,
                          fontFamily: "JosefinSans-Italic",
                          fontSize: 12,
                        }}
                      >
                        Actualizado por{" "}
                        {farmland?.modifiedBy === customUserData?.name
                          ? "mim"
                          : farmland?.modifiedBy}{" "}
                        aos {new Date(farmland?.modifiedAt).getDate()}-
                        {new Date(farmland?.modifiedAt).getMonth() + 1}-
                        {new Date(farmland?.modifiedAt).getFullYear()}
                      </Text>
                    </Box>
                  )}
                </Box>
                {farmland?.status === resourceValidation.status.invalidated && (
                  <Box w="100%">
                    <Text
                      style={{
                        textAlign: "right",
                        color: COLORS.grey,
                        fontFamily: "JosefinSans-Italic",
                        fontSize: 12,
                      }}
                    >
                      Invalidado por{" "}
                      {farmland?.checkedBy
                        ? farmland?.checkedBy
                        : "ConnectCaju"}
                    </Text>
                  </Box>
                )}
                {farmland?.status === resourceValidation.status.validated && (
                  <Box w="100%">
                    <Text
                      style={{
                        textAlign: "right",
                        color: COLORS.grey,
                        fontFamily: "JosefinSans-Italic",
                        fontSize: 12,
                      }}
                    >
                      Validado por {farmland?.checkedBy}
                    </Text>
                  </Box>
                )}
              </Stack>

              {farmland?.status === resourceValidation.status.invalidated && (
                <>
                  {customUserData?.role !== roles.provincialManager && (
                    <Text
                      style={{
                        textAlign: "left",
                        color: COLORS.red,
                        fontSize: 14,
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Motivo da invalidação
                    </Text>
                  )}
                  {/* <Box 
        // w="100%"
        style={{
            // alignItems: 'center',
            paddingTop: 5,
        }}
    > */}
                  {invalidationMotives?.length > 0 ? (
                    invalidationMotives?.length > 0 &&
                    invalidationMotives[0]?.messages?.length > 0 &&
                    invalidationMotives[0]?.messages?.map((motive, index) => (
                      <Box
                        key={index}
                        style={{
                          flexGrow: 1,
                          backgroundColor: COLORS.fourth,
                          borderRadius: 20,
                          paddingHorizontal: 5,
                          paddingVertical: 5,
                          marginVertical: 5,
                          marginHorizontal: 5,
                          alignItems: "flex-end",
                        }}
                      >
                        {/* <Box> */}
                        <Text
                          style={{
                            fontSize: responsiveFontSize(1.7),
                            fontFamily: "JosefinSans-Italic",
                            color: COLORS.black,
                            textAlign: "left",
                            lineHeight: 20,
                          }}
                        >
                          {motive.message
                            ? motive.message
                            : "Dados incompletos."}
                        </Text>

                        <Text
                          style={{
                            textAlign: "right",
                            fontSize: responsiveFontSize(1.5),
                            color: COLORS.grey,
                            paddingTop: 5,
                          }}
                        >
                          {motive?.ownerName} (
                          {new Date(motive?.createdAt).getDate()}-
                          {new Date(motive?.createdAt).getMonth() + 1}-
                          {new Date(motive?.createdAt).getFullYear()})
                        </Text>
                        {/* </Box> */}
                      </Box>
                    ))
                  ) : (
                    <Box
                      // key={index}
                      style={{
                        flexGrow: 1,
                        backgroundColor: COLORS.fourth,
                        borderRadius: 20,
                        paddingHorizontal: 5,
                        paddingVertical: 5,
                        marginVertical: 5,
                        marginHorizontal: 5,
                        alignItems: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.6),
                          fontFamily: "JosefinSans-Italic",
                          color: COLORS.black,
                          textAlign: "left",
                        }}
                      >
                        Dados incompletos.
                      </Text>
                      <Text
                        style={{
                          textAlign: "right",
                          fontSize: responsiveFontSize(1.6),
                          color: COLORS.grey,
                          paddingTop: 5,
                        }}
                      >
                        Connect Caju.
                      </Text>
                    </Box>
                  )}

                  {/* </Box> */}
                </>
              )}

              {farmland?.status === resourceValidation.status.invalidated &&
                customUserData?.role === roles.provincialManager && (
                  <>
                    <Stack direction="row" w="100%" space={1}>
                      <Box w="85%">
                        <FormControl
                          isRequired
                          isInvalid={"invalidationMessage" in errors}
                        >
                          <FormControl.Label>
                            Motivo da invalidação
                          </FormControl.Label>
                          <TextInput
                            style={{
                              borderWidth: 2,
                              borderColor: COLORS.lightgrey,
                              borderRadius: 20,
                              padding: 10,
                              fontSize: 16,
                              backgroundColor: "#efefef",
                            }}
                            placeholder={`Deixa uma mensagem para ${
                              farmland?.userName?.split(" ")[0]
                            }`}
                            multiline={true}
                            textAlignVertical="top"
                            numberOfLines={2}
                            maxLength={120}
                            value={message}
                            onChangeText={(newMessage) => {
                              setErrors({
                                invalidationMessage: "",
                              })
                              setMessage(newMessage)
                            }}
                          />
                          {"invalidationMessage" in errors ? (
                            <FormControl.ErrorMessage
                              leftIcon={
                                <Icon
                                  name="error-outline"
                                  size={16}
                                  color="red"
                                />
                              }
                              _text={{ fontSize: "xs" }}
                            >
                              {errors?.invalidationMessage}
                            </FormControl.ErrorMessage>
                          ) : (
                            <FormControl.HelperText></FormControl.HelperText>
                          )}
                        </FormControl>
                      </Box>
                      <Box
                        style={{
                          width: "15%",
                          alignItems: "baseline",
                          justifyContent: "center",
                        }}
                      >
                        {message && (
                          <Box
                            style={{
                              position: "absolute",
                              bottom: 10,
                              right: 10,
                              padding: 5,
                              borderRadius: 100,
                              width: wp("10%"),
                              height: hp("6%"),
                              borderWidth: 1,
                              borderColor: COLORS.pantone,
                              backgroundColor: COLORS.pantone,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                try {
                                  addMessage(realm, farmland?._id, message)
                                } catch (error) {
                                  console.log(
                                    "Failed to add invalidation message",
                                  )
                                  return
                                } finally {
                                  setMessage("")
                                }
                              }}
                            >
                              <Icon
                                name="send"
                                size={wp("6%")}
                                color={COLORS.ghostwhite}
                                iconStyle={{
                                  transform: [{ rotate: "-45deg" }],
                                }}
                              />
                            </TouchableOpacity>
                          </Box>
                        )}
                      </Box>
                      <Box w="0%"></Box>
                    </Stack>
                  </>
                )}

              {customUserData?.role === roles.provincialManager &&
                farmland?.status === resourceValidation.status.pending && (
                  <Stack
                    direction="row"
                    w="100%"
                    style={{ paddingVertical: 5 }}
                    space={3}
                  >
                    <Box
                      w="50%"
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        disabled={
                          farmland?.status ===
                          resourceValidation.status.validated
                            ? true
                            : false
                        }
                        onPress={() => {
                          setAlert(true)
                          setValidated(true)
                          setTitleAlert(errorMessages.resourceValidation.title)
                          setMessageAlert(
                            errorMessages.resourceValidation.message,
                          )
                          setShowCancelButton(
                            errorMessages.resourceValidation.showCancelButton,
                          )
                          setShowConfirmButton(
                            errorMessages.resourceValidation.showConfirmButton,
                          )
                          setCancelText(
                            errorMessages.resourceValidation.cancelText,
                          )
                          setConfirmText(
                            errorMessages.resourceValidation.confirmText,
                          )
                        }}
                      >
                        <Text
                          style={{
                            color:
                              farmland.status ===
                              resourceValidation.status.validated
                                ? COLORS.lightgrey
                                : COLORS.main,
                            fontSize: 15,
                            fontFamily: "JosefinSans-Bold",
                          }}
                        >
                          Validar Registo
                        </Text>
                      </TouchableOpacity>
                    </Box>
                    <Box
                      w="50%"
                      style={{
                        alignItems: "center",
                        paddingRight: 5,
                      }}
                    >
                      <TouchableOpacity
                        disabled={
                          farmland?.status ===
                          resourceValidation.status.validated
                            ? true
                            : false
                        }
                        onPress={() => {
                          setAlert(true)
                          setInvalidated(true)
                          setTitleAlert(
                            errorMessages.resourceInvalidation.title,
                          )
                          setMessageAlert(
                            errorMessages.resourceInvalidation.message,
                          )
                          setShowCancelButton(
                            errorMessages.resourceInvalidation.showCancelButton,
                          )
                          setShowConfirmButton(
                            errorMessages.resourceInvalidation
                              .showConfirmButton,
                          )
                          setCancelText(
                            errorMessages.resourceInvalidation.cancelText,
                          )
                          setConfirmText(
                            errorMessages.resourceInvalidation.confirmText,
                          )
                        }}
                      >
                        <Text
                          style={{
                            color:
                              farmland?.status ===
                              resourceValidation.status.validated
                                ? COLORS.lightgrey
                                : COLORS.red,
                            fontSize: 15,
                            fontFamily: "JosefinSans-Bold",
                          }}
                        >
                          Invalidar Registo
                        </Text>
                      </TouchableOpacity>
                    </Box>
                  </Stack>
                )}
            </Box>
          </View>

          {/* {
    presentEditFarmland && 
    ( */}
          <EditFarmlandData
            // resizeBox={resizeBox}
            // scale={scale}
            isOverlayVisible={presentEditFarmland}
            setIsOverlayVisible={setPresentEditFarmland}
            isConfirmDataVisible={isConfirmDataVisible}
            setIsConfirmDataVisible={setIsConfirmDataVisible}
            ownerName={farmland?.description}
            resource={farmland}
            blocks={farmland?.blocks}
            resourceName={"Farmland"}
            dataToBeUpdated={dataToBeUpdated}
            newDataObject={newDataObject}
            oldDataObject={oldDataObject}
            setNewDataObject={setNewDataObject}
            setOldDataObject={setOldDataObject}
            description={description}
            setDescription={setDescription}
            consociatedCrops={consociatedCrops}
            setConsociatedCrops={setConsociatedCrops}
            totalArea={totalArea}
            setTotalArea={setTotalArea}
            trees={trees}
            setTrees={setTrees}
            oldDescription={oldDescription}
            setOldDescription={setOldDescription}
            oldConsociatedCrops={oldConsociatedCrops}
            setOldConsociatedCrops={setOldConsociatedCrops}
            oldTotalArea={oldTotalArea}
            setOldTotalArea={setOldTotalArea}
            oldTrees={oldTrees}
            setOldTrees={setOldTrees}
            // block data
            setBlockId={setBlockId}
            blockId={blockId}
            plantingYear={plantingYear}
            setPlantingYear={setPlantingYear}
            blockTrees={blockTrees}
            setBlockTrees={setBlockTrees}
            usedArea={usedArea}
            setUsedArea={setUsedArea}
            densityWidth={densityWidth}
            setDensityWidth={setDensityWidth}
            densityLength={densityLength}
            setDensityLength={setDensityLength}
            plantTypes={plantTypes}
            setPlantTypes={setPlantTypes}
            clones={clones}
            setClones={setClones}
            addedClone={addedClone}
            setAddedClone={setAddedClone}
            selected={selected}
            setSelected={setSelected}
            isDensityModeIrregular={isDensityModeIrregular}
            setIsDensityModeIrregular={setIsDensityModeIrregular}
            isDensityModeRegular={isDensityModeRegular}
            setIsDensityModeRegular={setIsDensityModeRegular}
            sameTypeTreesList={sameTypeTreesList}
            setSameTypeTreesList={setSameTypeTreesList}
            remainingArea={remainingArea}
            setRemainingArea={setRemainingArea}
            oldBlockId={oldBlockId}
            setOldBlockId={setOldBlockId}
            oldPlantingYear={oldPlantingYear}
            setOldPlantingYear={setOldPlantingYear}
            oldBlockTrees={oldBlockTrees}
            setOldBlockTrees={setOldBlockTrees}
            oldUsedArea={oldUsedArea}
            setOldUsedArea={setOldUsedArea}
            oldDensityWidth={oldDensityWidth}
            setOldDensityWidth={setOldDensityWidth}
            oldDensityLength={oldDensityLength}
            setOldDensityLength={setOldDensityLength}
            oldPlantTypes={oldPlantTypes}
            setOldPlantTypes={setOldPlantTypes}
            oldClones={oldClones}
            setOldClones={setOldClones}
            addedOldClone={addedOldClone}
            setAddedOldClone={setAddedOldClone}
            isOldDensityModeIrregular={isOldDensityModeIrregular}
            setIsOldDensityModeIrregular={setIsOldDensityModeIrregular}
            isOldDensityModeRegular={isOldDensityModeRegular}
            setIsOldDensityModeRegular={setIsOldDensityModeRegular}
            oldSameTypeTreesList={oldSameTypeTreesList}
            setOldSameTypeTreesList={setOldSameTypeTreesList}
            oldRemainingArea={oldRemainingArea}
            setOldRemainingArea={setOldRemainingArea}
            isEditBlockVisible={isEditBlockVisible}
            setIsEditBlockVisible={setIsEditBlockVisible}
            setAutoRefresh={setAutoRefresh}
            autoRefresh={autoRefresh}
          />
          {/* )
} */}

          {isConfirmDataVisible && (
            <ConfirmData
              // setIsOverlayVisible={setIsOverlayVisible}
              isConfirmDataVisible={isConfirmDataVisible}
              setIsConfirmDataVisible={setIsConfirmDataVisible}
              ownerName={farmland?.description}
              newDataObject={newDataObject}
              oldDataObject={oldDataObject}
              dataToBeUpdated={dataToBeUpdated}
              resource={farmland}
              resourceName={"Farmland"}
              blockId={blockId}
              setSuccessLottieVisible={setSuccessLottieVisible}
              successLottieVisible={successLottieVisible}
            />
          )}

          {isNewBlockVisible && (
            <NewFarmlandBlock
              isNewBlockVisible={isNewBlockVisible}
              scaleBlockBox={scaleBlockBox}
              resizeBlockBox={resizeBlockBox}
              setIsNewBlockVisible={setIsNewBlockVisible}
              farmland={farmland}
              setAutoRefresh={setAutoRefresh}
              autoRefresh={autoRefresh}
              setSuccessLottieVisible={setSuccessLottieVisible}
              successLottieVisible={successLottieVisible}
              ownerImage={ownerImage ? ownerImage : ""}
            />
          )}

          {successLottieVisible && (
            <SuccessLottie
              successLottieVisible={successLottieVisible}
              setSuccessLottieVisible={setSuccessLottieVisible}
            />
          )}
        </CollapseBody>
      </Collapse>
    </View>
  )
}

export default FarmlandData
