import React, { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native"
import { Overlay, Icon, Button } from "@rneui/base"
import { Box, Center, CheckIcon, FormControl, Select, Stack } from "native-base"
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

// import CustomActivityIndicator from "../ActivityIndicator/CustomActivityIndicator";
import COLORS from "../../consts/colors"
import districts from "../../consts/districts"

import { secrets } from "../../secrets"
import { useUser } from "@realm/react"
import UserItem from "../UserItem/UserItem"
import { useFocusEffect } from "@react-navigation/native"
import { InteractionManager } from "react-native"
import { errorMessages } from "../../consts/errorMessages"

export default function UserGoalEdit({
  isGoalUpdateVisible,
  setIsGoalUpdateVisible,
}) {
  const user = useUser()
  const customUserData = user?.customData
  const [district, setDistrict] = useState("")
  const [province, setProvince] = useState(customUserData?.userProvince)
  const [districtalUsers, setDistritalUsers] = useState([])
  const [selectedDistricts, setSelectedDistricts] = useState([])

  // ------------------------------------------
  const [alert, setAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState("")
  const [titleAlert, setTitleAlert] = useState("")
  const [cancelText, setCancelText] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [showCancelButton, setShowCancelButton] = useState(false)
  const [showConfirmButton, setShowConfirmBttom] = useState(false)

  // ---------------------------------------------

  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false)

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true)
      })
      return () => task.cancel()
    }, []),
  )

  const getUsersByDistrict = async (district) => {
    const mongo = user.mongoClient(secrets.serviceName)
    const collection = mongo
      .db(secrets.databaseName)
      .collection(secrets.userCollectionName)
    let users
    try {
      users = await collection.find({ userDistrict: district })
      setDistritalUsers(users)
    } catch (error) {
      if (error.includes(errorMessages.network.logFlag)) {
        // Alert message
        setTitleAlert(errorMessages.network.title)
        setMessageAlert(errorMessages.network.message)
        setShowCancelButton(errorMessages.network.showCancelButton)
        setShowConfirmBttom(errorMessages.network.showCancelButton)
        setConfirmText(errorMessages.network.confirmText)
        setCancelText(errorMessages.network.cancelText)
        setAlert(true)
      } else {
        // Alert message
        setTitleAlert(errorMessages.server.title)
        setMessageAlert(errorMessages.server.message)
        setShowCancelButton(errorMessages.server.showCancelButton)
        setShowConfirmBttom(errorMessages.service.showConfirmButton)
        setConfirmText(errorMessages.server.confirmText)
        setCancelText(errorMessages.server.cancelText)
        setAlert(true)
      }
      return
    }
    return users
  }

  useEffect(() => {
    if (province) {
      setSelectedDistricts(districts[province])
    }
  }, [province])

  const toggleOverlay = () => {
    setIsGoalUpdateVisible(!isGoalUpdateVisible)
  }

  return (
    <>
      <Overlay
        overlayStyle={{
          backgroundColor: "ghostwhite",
          width: "100%",
          minHeight: "100%",
        }}
        isVisible={isGoalUpdateVisible}
        onBackdropPress={toggleOverlay}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          <Stack w="100%" py="4" direction="row">
            <Box>
              <Pressable
                onPress={() => {
                  setIsGoalUpdateVisible(false)
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  flexDirection: "row",
                }}
              >
                <Icon
                  name="arrow-back-ios"
                  color={COLORS.main}
                  size={wp("8%")}
                />
              </Pressable>

              {/* <Icon 
                    name='arrow-back-ios' 
                    color={COLORS.main} 
                    size={35}  
                    onPress={()=>{
                        setIsGoalUpdateVisible(false);
                    }}
                />            */}
            </Box>
            <Box
              w="100%"
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.main,
                  fontSize: 15,
                  fontFamily: "JosefinSans-Bold",
                }}
              >
                Actualização de Meta
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.main,
                  fontSize: 15,
                  fontFamily: "JosefinSans-Bold",
                }}
              >
                ({customUserData?.userProvince})
              </Text>
            </Box>
          </Stack>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: COLORS.main,
              fontFamily: "JosefinSans-Bold",
            }}
          ></Text>
          <Box
            style={{
              width: "100%",
            }}
          >
            <Stack w="100%" direction="column" space={1}>
              {false && (
                <Box w="100%">
                  <FormControl isRequired my="3">
                    <FormControl.Label>Província</FormControl.Label>
                    <Select
                      selectedValue={province}
                      accessibilityLabel="Escolha província"
                      placeholder="Escolha província"
                      _selectedItem={{
                        bg: "teal.600",
                        fontSize: "lg",
                        endIcon: <CheckIcon size="5" />,
                      }}
                      dropdownCloseIcon={
                        province ? (
                          <Icon
                            name="close"
                            size={25}
                            color="grey"
                            onPress={() => {
                              setDistrict("")
                              setProvince("")
                            }}
                          />
                        ) : (
                          <Icon
                            size={25}
                            name="arrow-drop-down"
                            color="#005000"
                          />
                        )
                      }
                      mt={1}
                      onValueChange={(newProvince) => {
                        setDistrict("")
                        setProvince(newProvince)
                      }}
                    >
                      <Select.Item
                        label={customUserData?.userProvince}
                        value={customUserData?.userProvince}
                      />
                    </Select>
                  </FormControl>
                </Box>
              )}
              <Box w="100%">
                <FormControl isRequired my="3">
                  <FormControl.Label>Distrito</FormControl.Label>
                  <Select
                    selectedValue={district}
                    accessibilityLabel="Escolha distrito"
                    placeholder="Escolha distrito"
                    _selectedItem={{
                      bg: "teal.600",
                      fontSize: "lg",
                      endIcon: <CheckIcon size="5" />,
                    }}
                    dropdownCloseIcon={
                      district ? (
                        <Icon
                          name="close"
                          size={25}
                          color="grey"
                          onPress={() => setDistrict("")}
                        />
                      ) : (
                        <Icon
                          size={25}
                          name="arrow-drop-down"
                          color="#005000"
                        />
                      )
                    }
                    mt={1}
                    onValueChange={async (newDistrict) => {
                      setDistrict(newDistrict)
                      await getUsersByDistrict(newDistrict)
                    }}
                  >
                    {selectedDistricts?.map((district, index) => (
                      <Select.Item
                        key={index}
                        label={district}
                        value={district}
                      />
                    ))}
                  </Select>
                  <FormControl.HelperText></FormControl.HelperText>
                </FormControl>
              </Box>
            </Stack>
          </Box>

          <Box
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            {!district && (
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "JosefinSans-Regular",
                  fontSize: 15,
                  color: COLORS.grey,
                }}
              >
                Selecciona Distrito.
              </Text>
            )}

            {district && districtalUsers.length === 0 && (
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: 30,
                  fontFamily: "JosefinSans-Bold",
                  fontSize: 16,
                  color: COLORS.danger,
                }}
              >
                O distrito de {district} não tem usuários registados!
              </Text>
            )}
            {}
          </Box>

          {district && districtalUsers.length > 0 && (
            <Box
              style={{
                flex: 1,
                width: "100%",
              }}
            >
              <Stack
                w="100%"
                direction="row"
                mb="2"
                space={1}
                style={{
                  backgroundColor: COLORS.main,
                  padding: 10,
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
                      fontFamily: "JosefinSans-Bold",
                      fontSize: 16,
                      color: COLORS.ghostwhite,
                    }}
                  >
                    Usuário
                  </Text>
                </Box>
                <Box w="20%">
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "JosefinSans-Bold",
                      fontSize: 14,
                      color: COLORS.ghostwhite,
                    }}
                  >
                    Meta
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "JosefinSans-Bold",
                      fontSize: 12,
                      color: COLORS.ghostwhite,
                    }}
                  >
                    Produtores
                  </Text>
                </Box>
                <Box w="20%">
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "JosefinSans-Bold",
                      fontSize: 14,
                      color: COLORS.ghostwhite,
                    }}
                  >
                    Meta
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "JosefinSans-Bold",
                      fontSize: 12,
                      color: COLORS.ghostwhite,
                    }}
                  >
                    Parcelas
                  </Text>
                </Box>

                <Box
                  w="20%"
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "JosefinSans-Bold",
                      fontSize: 14,
                      color: COLORS.ghostwhite,
                    }}
                  >
                    Acção
                  </Text>
                </Box>
              </Stack>
              <ScrollView>
                {districtalUsers?.map((userItem) => {
                  return <UserItem key={userItem.userId} userItem={userItem} />
                })}
              </ScrollView>
            </Box>
          )}
        </View>
      </Overlay>
      <AwesomeAlert
        show={alert}
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
        }}
        onConfirmPressed={() => {
          setAlert(false)
        }}
      />
    </>
  )
}
