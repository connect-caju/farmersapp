import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Pressable,
  Dimensions,
} from "react-native"
import { Box, Stack, Center } from "native-base"
import { Icon } from "@rneui/base"
import AwesomeAlert from "react-native-awesome-alerts"
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

import FarmlandData from "../../components/FarmlandData/FarmlandData"
import GroupData from "../../components/GroupData/GroupData"
import COLORS from "../../consts/colors"
import PhotoModal from "../../components/Modals/PhotoModal"
import styles from "./styles"

import { realmContext } from "../../models/realmContext"
import { roles } from "../../consts/roles"
import { useUser } from "@realm/react"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faTree } from "@fortawesome/free-solid-svg-icons"
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator"
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet"
import PhotoBottomSheet from "../../components/BottomSheet/PhotoBottomSheet"
import { SuccessLottie } from "../../components/LottieComponents/SuccessLottie"
const { useRealm, useQuery, useObject } = realmContext

const group = "group"
const groupFarmlands = "groupFarmlands"

export default function GroupScreen({ route, navigation }) {
  const ownerId = route.params.ownerId
  const farmersIDs = route.params?.farmersIDs
  const realm = useRealm()
  const user = useUser()
  const customUserData = user?.customData
  const farmer = realm.objectForPrimaryKey("Group", ownerId)

  const [isAddPhoto, setIsAddPhoto] = useState(false)
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false)
  const farmlands = realm
    .objects("Farmland")
    .filtered("farmerId == $0", ownerId)
  const [currentNode, setCurrentNode] = useState({
    next: null,
    prev: null,
    current: null,
  })
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false)
  const [successLottieVisible, setSuccessLottieVisible] = useState(false)

  // bottom sheet
  const bottomSheetModalRef = useRef(null)
  const snapPoints = ["25%", "50%", "75%"]

  function handlePresentModal() {
    bottomSheetModalRef.current?.present()
  }

  const keyExtractor = (item, index) => index.toString()

  // SuccesLottie effect
  useEffect(() => {
    if (successLottieVisible) {
      setTimeout(() => {
        setSuccessLottieVisible(false)
      }, 3000)
    }
  }, [successLottieVisible])

  useEffect(() => {
    if (farmersIDs?.length > 0) {
      current = farmersIDs.find((node) => node.current === ownerId)
      setCurrentNode(current)
    }
  }, [ownerId])

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(group)
      mutableSubs.add(realm.objects("Group").filtered(`_id == "${ownerId}"`), {
        name: group,
      })
    })

    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(groupFarmlands)
      mutableSubs.add(
        realm.objects("Farmland").filtered(`farmerId == "${ownerId}"`),
        { name: groupFarmlands },
      )
    })
  }, [realm])

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={{
          minHeight: "100%",
          backgroundColor: COLORS.ghostwhite,
        }}
      >
        <AwesomeAlert
          show={isAddPhoto}
          showProgress={false}
          title="Fotografia"
          message="Pretendes carregar uma nova fotografia?"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="   Não   "
          confirmText="   Sim   "
          confirmButtonColor={COLORS.main}
          cancelButtonColor={COLORS.danger}
          onCancelPressed={() => {
            setIsAddPhoto(false)
          }}
          onConfirmPressed={() => {
            setIsAddPhoto(false)
          }}
        />

        <View
          style={{
            width: "100%",
            paddingHorizontal: 5,
            paddingVertical: hp("1%"),
            backgroundColor: "#EBEBE4",
            borderTopWidth: 0,
            borderColor: "#EBEBE4",
            borderBottomWidth: 3,
            borderLeftWidth: 3,
            borderRightWidth: 3,
            alignItems: "center",
          }}
        >
          <Stack direction="row" w="100%">
            <Box>
              <Pressable
                onPress={() => {
                  navigation.navigate("Farmers")
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="arrow-back-ios"
                  color={COLORS.main}
                  size={wp("8%")}
                />
              </Pressable>
            </Box>

            <Box w="100%">
              <Center>
                <Text
                  style={{
                    fontFamily: "JosefinSans-Bold",
                    fontSize: responsiveFontSize(2),
                    color: COLORS.main,
                  }}
                >
                  {farmer?.type}
                </Text>

                <Stack direction="row" space={2}>
                  <Center>
                    <Text
                      style={{ fontFamily: "JosefinSans-Regular", fonSize: 14 }}
                    ></Text>
                  </Center>
                  <Center>
                    <Text
                      style={{ fontFamily: "JosefinSans-Regular", fonSize: 14 }}
                    ></Text>
                  </Center>
                </Stack>
              </Center>
            </Box>
          </Stack>
        </View>

        <Box
          style={{
            position: "absolute",
            top: Dimensions.get("window").height / 2,
            left: 0,
            zIndex: 10,
          }}
        >
          {currentNode?.prev && (
            <TouchableOpacity
              style={{
                height: 60,
                width: 30,
                backgroundColor: COLORS.fourth,
                opacity: 0.5,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#470000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                elevation: 1,
              }}
              onPress={() => {
                setLoadingActivityIndicator(true)
                navigation.navigate("Group", {
                  ownerId: currentNode?.prev,
                  farmersIDs,
                })
              }}
            >
              <Icon name="arrow-back-ios" size={40} color={COLORS.ghostwhite} />
            </TouchableOpacity>
          )}
        </Box>

        <Box
          style={{
            position: "absolute",
            top: Dimensions.get("window").height / 2,
            right: 0,
            zIndex: 10,
          }}
        >
          {currentNode?.next && (
            <TouchableOpacity
              style={{
                height: 60,
                width: 30,
                backgroundColor: COLORS.fourth,
                opacity: 0.5,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#470000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                elevation: 1,
              }}
              onPress={() => {
                setLoadingActivityIndicator(true)
                navigation.navigate("Group", {
                  ownerId: currentNode?.next,
                  farmersIDs,
                })
              }}
            >
              <Icon
                name="arrow-forward-ios"
                size={40}
                color={COLORS.ghostwhite}
              />
            </TouchableOpacity>
          )}
        </Box>
        {loadingActivitiyIndicator ? (
          <CustomActivityIndicator
            loadingActivitiyIndicator={loadingActivitiyIndicator}
            setLoadingActivityIndicator={setLoadingActivityIndicator}
          />
        ) : (
          <ScrollView
            contentContainerStyle={{
              padding: 5,
            }}
          >
            <Box
              w="100%"
              style={{
                alignItems: "center",
                marginTop: hp("10%"),
                borderRadius: 30,
                borderWidth: 3,
                borderColor: COLORS.pantone,
              }}
            >
              <TouchableOpacity
                // onPress={handlePresentModal}
                onPress={() => {
                  navigation.navigate("Camera", {
                    ownerType: "Grupo",
                    ownerId: farmer?._id,
                    farmersIDs,
                  })
                }}
                style={{
                  position: "relative",
                  top: -50,
                }}
              >
                {farmer?.image ? (
                  <>
                    <Image
                      source={{ uri: farmer?.image }}
                      style={styles.images}
                    />
                  </>
                ) : (
                  <Box>
                    <Icon
                      style={{
                        position: "relative",
                        top: 10,
                      }}
                      name="account-circle"
                      size={wp("60%")}
                      color={COLORS.lightgrey}
                    />
                  </Box>
                )}
              </TouchableOpacity>

              <Text
                style={{
                  color: COLORS.main,
                  fontSize: responsiveFontSize(2.5),
                  fontFamily: "JosefinSans-Bold",
                  textAlign: "center",
                  position: "relative",
                  top: -50,
                }}
              >
                {farmer?.name}
              </Text>
              <Text
                style={{
                  color: COLORS.main,
                  fontSize: responsiveFontSize(1.6),
                  fontFamily: "JosefinSans-Bold",
                  textAlign: "center",
                  position: "relative",
                  top: -50,
                }}
              >
                {farmer?.type}
              </Text>
            </Box>
            <View
              style={{
                marginTop: 40,
              }}
            >
              <Text
                style={{
                  color: COLORS.black,
                  fontSize: 16,
                  fontFamily: "JosefinSans-Bold",
                  textAlign: "right",
                  padding: 10,
                  letterSpacing: 5,
                }}
              >
                {farmer?.identifier}
              </Text>

              <GroupData farmer={farmer} />
            </View>

            <Box
              alignItems="stretch"
              w="100%"
              style={{
                flex: 1,
                paddingVertical: 5,
                marginBottom: 100,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.black,
                  textAlign: "center",
                  fontFamily: "JosefinSans-Bold",
                }}
              >
                Pomares
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.grey,
                  textAlign: "center",
                  fontFamily: "JosefinSans-Regular",
                  paddingBottom: 5,
                }}
              >
                ({farmlands?.length})
              </Text>

              {customUserData?.role !== roles.provincialManager && (
                <Stack direction="row" w="100%" p="4">
                  <Box w="50%"></Box>
                  <Box
                    w="50%"
                    style={{
                      alignItems: "flex-end",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                      }}
                      onPress={() =>
                        navigation.navigate("FarmlandForm1", {
                          ownerId: farmer?._id,
                          ownerName: `${farmer?.type} ${farmer?.name}`,
                          ownerImage: farmer?.image,
                          ownerAddress: farmer?.address,
                          flag: "Grupo",
                        })
                      }
                    >
                      <Box
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 100,
                          borderWidth: 2,
                          borderColor: COLORS.mediumseagreen,
                          padding: 4,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTree}
                          size={20}
                          color={COLORS.mediumseagreen}
                        />
                        <Text
                          style={{
                            color: COLORS.mediumseagreen,
                            fontSize: 14,
                            fontFamily: "JosefinSans-Bold",
                            paddingLeft: 5,
                          }}
                        >
                          Registar Pomar
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  </Box>
                </Stack>
              )}

              {farmlands?.map((farmland) => (
                <FarmlandData
                  key={farmland?._id}
                  farmland={farmland}
                  successLottieVisible={successLottieVisible}
                  setSuccessLottieVisible={setSuccessLottieVisible}
                  ownerImage={farmer?.image}
                />
              ))}
            </Box>

            {/* <View
          style={{
            flex: 1,
          }}
        >
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            // onDismiss={()=>setIsBottomSheetOpen(false)}
            backgroundStyle={{
              borderRadius: 50,
              backgroundColor: COLORS.fourth,
            }}
          >
            <PhotoBottomSheet 
              ownerType={'Grupo'} 
              ownerId={farmer?._id} 
              farmersIDs={farmersIDs} 
            />
          </BottomSheetModal>
        </View> */}

            <PhotoModal
              realm={realm}
              photoOwner={farmer}
              photoOwnerType={"Grupo"}
              isPhotoModalVisible={isPhotoModalVisible}
              setIsPhotoModalVisible={setIsPhotoModalVisible}
              userRole={customUserData?.role}
              loadingActivitiyIndicator={loadingActivitiyIndicator}
              setLoadingActivityIndicator={setLoadingActivityIndicator}
            />
          </ScrollView>
        )}

        {successLottieVisible && (
          <SuccessLottie
            successLottieVisible={successLottieVisible}
            setSuccessLottieVisible={setSuccessLottieVisible}
          />
        )}
      </SafeAreaView>
    </BottomSheetModalProvider>
  )
}
