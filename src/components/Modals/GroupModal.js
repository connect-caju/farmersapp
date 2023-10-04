/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, { useCallback, useEffect, useState } from "react";
import { Text, Stack, Box, Center, Divider } from "native-base";
import { ScrollView, Pressable, View, TouchableOpacity } from "react-native";
import { Button, Icon } from "@rneui/themed";
import CustomDivider from "../Divider/CustomDivider";
import styles from "./styles";
import Modal from "react-native-modal";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import Realm from "realm";

import SuccessModal from "./SuccessModal";
import { generateUUID } from "../../helpers/generateUUID";
import { generateFormattedDate } from "../../helpers/generateFormattedDate";
import { generateFormattedAdminPost } from "../../helpers/generateFormattedAdminPost";
import { generateFormattedSurname } from "../../helpers/generateFormattedSurname";
import { useNavigation } from "@react-navigation/native";
import { user } from "../../consts/user";

import { realmContext } from "../../models/realmContext";
import COLORS from "../../consts/colors";
import { groupAffiliationStatus } from "../../consts/groupAffiliationStatus";
import { generateUniqueNumber } from "../../helpers/generateUniqueNumber";
const { useRealm, useObject, useQuery } = realmContext;

export default function GroupModal({
  modalVisible,
  setModalVisible,
  farmerData,
  farmerType,
  setFarmerType,

  setGroupType,
  setGroupName,
  setGroupAffiliationYear,
  setGroupAdminPost,
  setGroupVillage,
  // setGroupManagerName,
  // setGroupManagerPhone,
  setGroupOperatingLicence,
  setGroupNuit,
  setGroupMembersNumber,
  setGroupWomenNumber,

  setFarmerItem,
  setIsCoordinatesModalVisible,

  customUserData,
}) {
  const [addDataModalVisible, setAddDataModalVisible] = useState(false);
  // const [farmerId, setFarmerId] = useState(null);
  const navigation = useNavigation();
  const realm = useRealm();

  // const currentUserStat = useObject('UserStat', customUserData?.userId);
  const currentUserStat = useQuery("UserStat").filtered(
    "userId == $0",
    customUserData?.userId,
  )[0];

  const addGroup = useCallback(
    (farmerData, realm) => {
      const {
        operationalStatus,
        type,
        name,
        address,
        identifier,
        creationYear,
        legalStatus,
        affiliationYear,
        numberOfMembers,
        assets,
        // manager,
        licence,
        nuit,
      } = farmerData;

      realm.write(async () => {
        const newGroup = await realm.create("Group", {
          _id: uuidv4(),
          operationalStatus,
          type,
          name,
          identifier,
          creationYear,
          legalStatus,
          affiliationYear,
          address,
          numberOfMembers,
          assets,
          // manager,
          licence,
          nuit,
          userDistrict: customUserData?.userDistrict,
          userProvince: customUserData?.userProvince,
          userId: customUserData?.userId,
          userName: customUserData?.name,
        });
        setFarmerItem({
          ownerId: newGroup._id,
          ownerName: newGroup.type + " " + newGroup.name,
          flag: "Grupo",
        });
      });

      // update userStat (1 more farmer registered by the user)
      if (currentUserStat) {
        realm.write(() => {
          currentUserStat.registeredFarmers =
            currentUserStat.registeredFarmers + 1;
        });
      } else {
        realm.write(() => {
          const newStat = realm.create("UserStat", {
            _id: uuidv4(),
            userName: customUserData.name,
            userId: customUserData.userId,
            userDistrict: customUserData.userDistrict,
            userProvince: customUserData.userProvince,
            userRole: customUserData.role,
            registeredFarmers: 1,
          });
        });
      }
    },
    [
      realm,
      farmerData,
      // farmerType
    ],
  );

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
            // style={{ position: 'relative', top: 10, right: 10, }}
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
                <Box w="40%">
                  <Text style={styles.keys}>Organização:</Text>
                </Box>
                <Box w="60%" style={styles.values}>
                  <Box>
                    <Text style={styles.values}>
                      {farmerData?.name} ({farmerData?.type})
                    </Text>
                    <Text style={styles.values}>
                      {farmerData?.operationalStatus ? "Activo" : "Inactivo"}
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
                <Box w="40%">
                  <Text style={styles.keys}>Finalidade:</Text>
                </Box>
                <Box w="60%" style={styles.values}>
                  <Box>
                    {farmerData?.assets?.map((asset, index) => (
                      <Text key={index} style={styles.values}>
                        - {asset?.subcategory}
                      </Text>
                    ))}
                  </Box>
                </Box>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />

              <Stack direction="row" w="100%" my="1">
                <Box w="40%">
                  <Text style={styles.keys}>Membros</Text>
                </Box>
                <Box w="60%">
                  <Box>
                    <Text style={styles.values}>
                      {farmerData.numberOfMembers?.women} (Mulheres)
                    </Text>
                  </Box>
                  <Box>
                    <Text style={styles.values}>
                      {farmerData.numberOfMembers?.total -
                        farmerData.numberOfMembers?.women}{" "}
                      (Homens)
                    </Text>
                  </Box>
                  <Box>
                    <Text style={styles.values}>________</Text>
                    <Text style={styles.values}>
                      {farmerData.numberOfMembers?.total} (Total)
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
                <Box w="40%">
                  <Text style={styles.keys}>Estado de legalização</Text>
                </Box>
                <Box w="60%">
                  <Box>
                    <Text style={styles.values}>{farmerData?.legalStatus}</Text>
                    <Text style={styles.values}>
                      {farmerData?.creationYear} (an de criação)
                    </Text>
                    {farmerData?.legalStatus ===
                      groupAffiliationStatus.affiliated && (
                        <Text style={styles.values}>
                          {farmerData?.affiliationYear} (ano de legalização)
                        </Text>
                      )}
                  </Box>
                </Box>
              </Stack>

              {farmerData?.legalStatus ===
                groupAffiliationStatus.affiliated && (
                  <>
                    <CustomDivider
                      marginVertical="1"
                      thickness={1}
                      bg={COLORS.lightgrey}
                    />

                    <Stack direction="row" w="100%" my="1">
                      <Box w="40%">
                        <Text style={styles.keys}>Documentos:</Text>
                      </Box>
                      <Box w="60%">
                        <Box>
                          <Text style={styles.values}>
                            {farmerData?.nuit
                              ? farmerData?.nuit + " (NUIT)"
                              : "Nenhum (NUIT)"}
                          </Text>
                          <Text style={styles.values}>
                            {farmerData?.licence
                              ? farmerData?.licence + " (Licença/Alvará)"
                              : "Nenhum (Licença/Alvará)"}
                          </Text>
                        </Box>
                      </Box>
                    </Stack>
                  </>
                )}

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />

              <Stack direction="row" w="100%" my="1">
                <Box w="40%">
                  <Text style={styles.keys}>Endereço:</Text>
                </Box>
                <Box w="60%">
                  <Box>
                    <Text style={styles.values}>
                      {farmerData?.address?.province} (Província)
                    </Text>
                    <Text style={styles.values}>
                      {farmerData?.address?.district} (Distrito)
                    </Text>
                    <Text style={styles.values}>
                      {farmerData?.address?.adminPost} (Posto Admin.)
                    </Text>
                    <Text style={styles.values}>
                      {farmerData.address?.village
                        ? farmerData.address?.village + " (localidade)"
                        : "Nenhum (Localidade)"}
                    </Text>
                  </Box>
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
                      addGroup(farmerData, realm);
                      setModalVisible(false);
                      setIsCoordinatesModalVisible(true);
                    } catch (error) {
                      throw new Error("Failed to register Group", {
                        cause: error,
                      });
                    } finally {
                      setGroupType("");
                      setGroupName("");
                      setGroupAffiliationYear("");
                      setGroupAdminPost("");
                      setGroupVillage("");
                      // setGroupManagerName('');
                      // setGroupManagerPhone('');
                      setGroupOperatingLicence("");
                      setGroupNuit("");
                      setGroupMembersNumber("");
                      setGroupWomenNumber("");
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
          </View>
        </ScrollView>
      </View>
    </Modal>
    // </View>
  );
}

// export default GroupModal;
