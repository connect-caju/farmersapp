import React, { useCallback, useState } from "react"
import { Text, Stack, Box, Center } from "native-base"
import { ScrollView, TouchableOpacity, View, Pressable } from "react-native"
import { Button, Icon } from "@rneui/themed"
import Modal from "react-native-modal"
import CustomDivider from "../Divider/CustomDivider"
import styles from "./styles"

import "react-native-get-random-values"
import { v4 as uuidv4 } from "uuid"

import { generateUAID } from "../../helpers/generateUAID"
import { useNavigation } from "@react-navigation/native"
// import { user } from '../../consts/user';

import Realm from "realm"
import { realmContext } from "../../models/realmContext"
import categories from "../../consts/categories"
import { assetTypes } from "../../consts/assetTypes"
import { useEffect } from "react"
import COLORS from "../../consts/colors"
import { generateUniqueNumber } from "../../helpers/generateUniqueNumber"
const { useRealm, useQuery, useObject } = realmContext

export default function IndividualModal({
  modalVisible,
  setModalVisible,
  farmerData,

  setSurname,
  setOtherNames,
  setIsSprayingAgent,
  setGender,
  setFamilySize,
  setAddressVillage,
  setAddressAdminPost,
  setPrimaryPhone,
  setSecondaryPhone,
  setBirthProvince,
  setBirthDistrict,
  setBirthAdminPost,
  setBirthDate,
  setDocType,
  setDocNumber,
  setNuit,

  setFarmerType,

  farmerItem,
  setFarmerItem,
  setIsCoordinatesModalVisible,

  customUserData,
  setActor,
  actor,
  actorCategory,
  setActorCategory,
}) {
  const realm = useRealm()
  const [isActorSaved, setIsActorSaved] = useState(false)

  const currentUserStat = useQuery("UserStat").filtered(
    "userId == $0",
    customUserData?.userId,
  )[0]

  // create a new actor with data received from the form
  const addFarmer = useCallback(
    (farmerData, realm) => {
      const {
        names,
        isSprayingAgent,
        gender,
        familySize,
        identifier,
        assets,
        birthDate,
        birthPlace,
        address,
        contact,
        idDocument,
      } = farmerData

      // use this to check potential farmer duplicates
      const uaid = generateUAID({ names, birthDate, birthPlace })

      // // assign actor identification code
      // const identifier = generateUniqueNumber(birthPlace, 'farmer');

      realm.write(async () => {
        const newFarmer = await realm.create("Actor", {
          _id: uuidv4(),
          names,
          uaid,
          identifier,
          gender,
          familySize,
          birthDate,
          birthPlace,
          address,
          contact,
          idDocument,
          assets,
          userDistrict: customUserData?.userDistrict,
          userProvince: customUserData?.userProvince,
          userId: customUserData?.userId,
          userName: customUserData?.name,
        })

        setActor(newFarmer)
        setIsActorSaved(true)

        setFarmerItem({
          ownerId: newFarmer._id,
          ownerName:
            newFarmer.names?.otherNames + " " + newFarmer.names?.surname,
          flag: "Indivíduo",
        })
      })

      // update user stat (1 more farmer registered by the user)
      if (currentUserStat) {
        realm.write(() => {
          currentUserStat.registeredFarmers =
            currentUserStat.registeredFarmers + 1
        })
      } else {
        realm.write(() => {
          const newStat = realm.create("UserStat", {
            _id: uuidv4(),
            userName: customUserData?.name,
            userId: customUserData?.userId,
            userDistrict: customUserData?.userDistrict,
            userProvince: customUserData?.userProvince,
            userRole: customUserData?.role,
            registeredFarmers: 1,
          })
        })
      }
    },
    [realm, farmerData],
  )

  const addSprayingServiceProvider = useCallback(
    (actor, realm) => {
      const sprayingProviderObject = {
        _id: uuidv4(),
        actorId: actor?._id,
        actorName: actor?.names?.otherNames + " " + actor?.names?.surname,

        userName: customUserData?.name,
        userId: customUserData?.userId,
        userDistrict: customUserData?.userDistrict,
        userProvince: customUserData?.userProvince,
      }

      realm.write(async () => {
        const serviceProvider = await realm.create(
          "SprayingServiceProvider",
          sprayingProviderObject,
        )
      })
    },
    [realm, actor],
  )

  const addActorMembership = useCallback(
    (actor, realm) => {
      const actorMembershipObject = {
        _id: uuidv4(),
        actorId: actor?._id,
        actorName: actor?.names?.otherNames + " " + actor?.names?.surname,

        userName: customUserData?.name,
        userId: customUserData?.userId,
        userDistrict: customUserData?.userDistrict,
        userProvince: customUserData?.userProvince,
      }

      realm.write(async () => {
        const actorMembership = await realm.create(
          "ActorMembership",
          actorMembershipObject,
        )
      })
    },
    [realm, actor],
  )

  useEffect(() => {
    if (isActorSaved) {
      if (farmerData?.isSprayingAgent) {
        try {
          addSprayingServiceProvider(actor, realm)
        } catch (error) {
          console.log("Could not save actor as spraying service provider:", {
            cause: error,
          })
        }
      }

      if (farmerData?.isGroupMember) {
        try {
          addActorMembership(actor, realm)
        } catch (error) {
          console.log("Could not save actor as member of an organization:", {
            cause: error,
          })
        }
      }

      // finally {
      setIsActorSaved(false)
      // }
    }
  }, [realm, isActorSaved, farmerData])

  return (
    <Modal
      isVisible={modalVisible}
      supportedOrientations={["portrait", "landscape"]}
      propagateSwipe
      animationIn={"zoomIn"}
      animationInTiming={600}
      animationOut={"zoomOut"}
      swipeDirection={["left", "right"]}
      // animationOutTiming={600}
      hideModalContentWhileAnimating={true}
      swipeThreshold={1000}
    >
      <View>
        <View
          style={{
            width: "100%",
            height: 50,
            flexDirection: "row",
            backgroundColor: COLORS.dark,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <View style={{ width: "90%" }}>
            <Text
              style={{
                fontFamily: "JosefinSans-Bold",
                fontSize: 18,
                // fontWeigth: 'bold',
                color: COLORS.ghostwhite,
                paddingTop: 15,
                textAlign: "center",
              }}
            >
              Confirmar Dados
            </Text>
          </View>
          <View
            style={{
              width: "10%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              name="close"
              size={30}
              color={COLORS.ghostwhite}
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
        <ScrollView>
          <View
            flex={1}
            onStartShouldSetResponder={() => true}
            style={{
              backgroundColor: COLORS.ghostwhite,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <Box mx="2">
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  <Text style={styles.keys}>Nome Completo:</Text>
                </Box>
                <Box w="50%" style={styles.values}>
                  <Box>
                    <Text style={styles.values}>
                      {farmerData?.names?.surname} (Apelido)
                    </Text>
                    <Text style={styles.values}>
                      {farmerData?.names?.otherNames} (Outros nomes)
                    </Text>
                  </Box>
                </Box>
              </Stack>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  <Text style={styles.keys}>Provedor de Serviços:</Text>
                </Box>
                <Box w="50%" style={styles.values}>
                  <Text style={styles.values}>
                    {farmerData?.isSprayingAgent ? "Sim" : "Não"}
                  </Text>
                </Box>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  <Text style={styles.keys}>Membro de organização:</Text>
                </Box>
                <Box w="50%" style={styles.values}>
                  <Text style={styles.values}>
                    {farmerData?.isGroupMember ? "Sim" : "Não"}
                  </Text>
                </Box>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  <Text style={styles.keys}>Género:</Text>
                </Box>
                <Box w="50%" style={styles.values}>
                  <Text style={styles.values}>{farmerData?.gender}</Text>
                </Box>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  <Text style={styles.keys}>Agregado Familiar:</Text>
                </Box>
                <Box w="50%" style={styles.values}>
                  <Text style={styles.values}>
                    {farmerData?.familySize} (membros)
                  </Text>
                </Box>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  <Text style={styles.keys}>Data Nascimento:</Text>
                </Box>
                <Box w="50%" style={styles.values}>
                  <Text style={styles.values}>
                    {farmerData?.birthDate
                      ? `${new Date(farmerData?.birthDate).getDate()}/${
                          new Date(farmerData?.birthDate).getMonth() + 1
                        }/${new Date(farmerData?.birthDate).getFullYear()}`
                      : "Nenhum"}
                  </Text>
                </Box>
              </Stack>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  <Text style={styles.keys}>Residência:</Text>
                </Box>
                <Box w="50%">
                  <Box>
                    <Text style={styles.values}>
                      {farmerData?.address?.province} (província)
                    </Text>
                    <Text style={styles.values}>
                      {farmerData?.address?.district} (distrito)
                    </Text>
                    <Text style={styles.values}>
                      {farmerData?.address?.adminPost} (posto admin.)
                    </Text>
                    <Text style={styles.values}>
                      {farmerData?.address?.village
                        ? farmerData?.address?.village + " (localidade)"
                        : "Nenhum (localidade)"}
                    </Text>
                  </Box>
                </Box>
              </Stack>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  <Text style={styles.keys}>Telemóveis:</Text>
                </Box>
                <Box w="50%">
                  {farmerData?.contact?.primaryPhone &&
                  farmerData?.contact?.secondaryPhone ? (
                    <Box>
                      <Text style={styles.values}>
                        {farmerData?.contact?.primaryPhone} (principal)
                      </Text>
                      <Text style={styles.values}>
                        {farmerData?.contact?.secondaryPhone} (alternativo)
                      </Text>
                    </Box>
                  ) : farmerData?.contact?.primaryPhone ? (
                    <Box>
                      <Text style={styles.values}>
                        {farmerData?.contact?.primaryPhone} (principal)
                      </Text>
                      <Text style={styles.values}>Nenhum (alternativo)</Text>
                    </Box>
                  ) : farmerData?.contact?.secondaryPhone ? (
                    <Box>
                      <Text style={styles.values}>Nenhum (principal)</Text>
                      <Text style={styles.values}>
                        {farmerData?.contact?.secondaryPhone} (alternativo)
                      </Text>
                    </Box>
                  ) : (
                    <Box>
                      <Text style={styles.values}>Nenhum (principal)</Text>
                      <Text style={styles.values}>Nenhum (alternativo)</Text>
                    </Box>
                  )}
                </Box>
              </Stack>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  <Text style={styles.keys}>Local Nascimento:</Text>
                </Box>
                <Box w="50%">
                  {!farmerData?.birthPlace?.province?.includes(
                    "Estrangeiro",
                  ) ? (
                    <Box>
                      <Text style={styles.values}>
                        {farmerData?.birthPlace?.province + " (província)"}
                      </Text>
                      <Text style={styles.values}>
                        {farmerData?.birthPlace?.district + " (distrito)"}
                      </Text>
                      <Text style={styles.values}>
                        {farmerData?.birthPlace?.adminPost + " (posto admin.)"}
                      </Text>
                    </Box>
                  ) : (
                    <Box>
                      <Text style={styles.values}>
                        {farmerData?.birthPlace?.district +
                          " (País Estrangeiro)"}
                      </Text>
                    </Box>
                  )}
                </Box>
              </Stack>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  <Text style={styles.keys}>Doc. Identificação:</Text>
                </Box>
                <Box w="50%">
                  {farmerData?.idDocument?.docNumber !== "Nenhum" ? (
                    <Text style={styles.values}>
                      {farmerData?.idDocument?.docNumber} (
                      {farmerData?.idDocument?.docType})
                    </Text>
                  ) : farmerData?.idDocument?.docType === "Não tem" ? (
                    <Text style={styles.values}>Não tem</Text>
                  ) : (
                    <Text style={styles.values}>Nenhum (Nenhum)</Text>
                  )}
                </Box>
              </Stack>
              <Stack direction="row" w="100%" my="1">
                <Box w="50%"></Box>
                <Box w="50%">
                  {farmerData?.idDocument?.nuit ? (
                    <Text style={styles.values}>
                      {farmerData?.idDocument?.nuit} (NUIT)
                    </Text>
                  ) : (
                    <Text style={styles.values}>Nenhum (NUIT)</Text>
                  )}
                </Box>
              </Stack>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Center w="100%">
                <Button
                  onPress={() => {
                    try {
                      addFarmer(farmerData, realm)
                      // addActorCategory(actor, realm);
                      // addActorCategory(actorId, realm);
                      setModalVisible(false)
                      setIsCoordinatesModalVisible(true)
                    } catch (error) {
                      throw new Error("Failed to register IndividualFarmer", {
                        cause: error,
                      })
                    } finally {
                      setSurname("")
                      setOtherNames("")
                      setIsSprayingAgent(false)
                      setGender("")
                      setFamilySize("")
                      setAddressVillage("")
                      setAddressAdminPost("")
                      setPrimaryPhone(null)
                      setSecondaryPhone(null)
                      setBirthProvince("")
                      setBirthDistrict("")
                      setBirthAdminPost("")
                      setBirthDate(null)
                      setDocType("")
                      setDocNumber("")
                      setNuit(null)
                    }
                  }}
                  type="outline"
                  title="Salvar Dados"
                  containerStyle={{
                    width: "100%",
                  }}
                />
              </Center>
            </Box>
            {/* </View> */}
          </View>
        </ScrollView>
      </View>
    </Modal>

    // </View>
  )
}

// export default IndividualModal;
