/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import {
  FlatList,
  InteractionManager,
  ScrollView,
  Switch,
  Image,
  SafeAreaView,
  Text,
  View,
  PermissionsAndroid,
  Animated,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
  useNativeDriver,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@rneui/themed";
import { Box, Center, Pressable, Stack } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import {
  faPeopleGroup,
  faInstitution,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  responsiveFontSize,
  // responsiveScreenFontSize,
  // responsiveHeight,
  // responsiveWidth,
  // responsiveScreenHeight,
  // responsiveScreenWidth,
  // useDimensionsChange,
} from "react-native-responsive-dimensions";

import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
// import LottieAddButton from '../../components/Buttons/LottieAddButton';
import TickComponent from "../../components/LottieComponents/TickComponent";
import { customizeItem } from "../../helpers/customizeItem";

import COLORS from "../../consts/colors";

import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
import { roles } from "../../consts/roles";
import StatItem from "../../components/StatItem/StatItem";
import FarmerTypeCard from "../../components/FarmerTypeCard/FarmerTypeCard";
import CustomDivider from "../../components/Divider/CustomDivider";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import RegistrationButton from "../../components/RegistrationButton/RegistrationButton";
const { useRealm, useQuery } = realmContext;

const provincialStats = "provincialStats";

const farmersTypes = [
  {
    farmerType: "Indivíduo",
    icon: faPerson,
    description:
      "Produtores singulares categorizados em familiares e comerciais.",
    title: "Produtores Singulares",
    iconColor: COLORS.main,
    borderColor: COLORS.darkyGreen,
    color: COLORS.main,
  },
  {
    farmerType: "Grupo",
    icon: faPeopleGroup,
    description: "Cooperativas, Associações, Grupos de produtores e EMC.",
    title: "Organizações de Produtores",
    iconColor: COLORS.main,
    borderColor: COLORS.darkyGreen,
    color: COLORS.main,
  },
  {
    farmerType: "Instituição",
    icon: faInstitution,
    description: "Instituições (públicas e privadas) produtoras de caju.",
    title: "Produtores Institucionais",
    iconColor: COLORS.main,
    borderColor: COLORS.darkyGreen,
    color: COLORS.main,
  },

];

export default function FarmersScreen({ route, navigation }) {
  const realm = useRealm();
  const user = useUser();
  let customUserData = user.customData;

  const farmers = realm
    .objects("Actor")
    .filtered("userDistrict == $0", customUserData?.userDistrict);
  const serviceProviders = realm
    .objects("SprayingServiceProvider")
    .filtered("userDistrict == $0", customUserData?.userDistrict);
  const groups = realm
    .objects("Group")
    .filtered("userDistrict == $0", customUserData?.userDistrict);
  const institutions = realm
    .objects("Institution")
    .filtered("userDistrict == $0", customUserData?.userDistrict);
  const farmlands = realm
    .objects("Farmland")
    .filtered("userDistrict == $0", customUserData?.userDistrict);
  const stats = realm
    .objects("UserStat")
    .filtered("userProvince == $0", customUserData?.userProvince);

  const [fetchedFarmers, setFetchedFarmers] = useState([]);
  const [fetchedGroups, setFetchedGroups] = useState([]);
  const [fetchedInstitutions, setFetchedInstitutions] = useState([]);
  const [refresh, setRefresh] = useState(false);


  const districts = Array.from(
    new Set(stats.map((stat) => stat?.userDistrict)),
  ).filter((district) => district !== "NA");

  customUserData = {
    name: customUserData?.name,
    userDistrict: customUserData?.userDistrict,
    userProvince: customUserData?.userProvince,
    userId: customUserData?.userId,
    role: customUserData?.role,
  };

  const individualsList = customizeItem(
    fetchedFarmers,
    farmlands,
    serviceProviders,
    customUserData,
    "Indivíduo",
  );
  const groupsList = customizeItem(
    fetchedGroups,
    farmlands,
    serviceProviders,
    customUserData,
    "Grupo",
  );
  const institutionsList = customizeItem(
    fetchedInstitutions,
    farmlands,
    serviceProviders,
    customUserData,
    "Instituição",
  );

  const filteredStats = stats?.filter((stat) => stat.userDistrict !== "NA");
  // ------------------------------------------------------

  // ----------------------------------------------------------------------------
  const listStatsByDistrict = (stats) => {
    // get the array of all the districts in which users are living
    // to create a SectionList where each item has title and data properties
    // excluding the stats whose district value is 'NA'
    const districts = Array.from(
      new Set(stats.map((stat) => stat.userDistrict)),
    )
      .filter((district) => district !== "NA")
      .sort();
    const statsByDistrict = [];
    for (let i = 0; i < districts.length; i++) {
      const district = districts[i];
      let newObject = {};
      const usersStats = stats.filter((stat) => stat.userDistrict === district);
      newObject["title"] = `${district}`;
      newObject["data"] = usersStats;
      statsByDistrict.push(newObject);
    }

    return statsByDistrict;
  };

  const statsByDistrict = listStatsByDistrict(stats);
  //  ---------------------------------------------------------------------------------

  // // merge the three arrays of farmers and sort the items by createdAt
  let farmersList = [];

  if (individualsList.length > 0) {
    farmersList = farmersList.concat(individualsList);
  }
  if (groupsList.length > 0) {
    farmersList = farmersList.concat(groupsList);
  }
  if (institutionsList.length > 0) {
    farmersList = farmersList.concat(institutionsList);
  }
  if (farmersList.length > 0) {
    farmersList = farmersList?.sort(
      (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
    );
  }

  useEffect(() => { }, [refresh]);

  useEffect(() => {
    if (
      customUserData?.role === roles.provincialManager ||
      customUserData?.role === roles.ampcmSupervisor
    ) {
      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(provincialStats);
        mutableSubs.add(
          realm
            .objects("UserStat")
            .filtered(`userProvince == "${user?.customData?.userProvince}"`),
          { name: provincialStats },
        );
      });
    }
  }, [
    realm,
    user,
    // showAll
  ]);

  const keyExtractor = (item, index) => index.toString();

  const addFarmer = () => {
    navigation.navigate("FarmerForm1", { customUserData });
  };

  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true);
      });
      return () => task.cancel();
    }, []),
  );

  if (loadingActivitiyIndicator) {
    return (
      <CustomActivityIndicator
        loadingActivitiyIndicator={loadingActivitiyIndicator}
        setLoadingActivityIndicator={setLoadingActivityIndicator}
      />
    );
  }




  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingBottom: 100,
        backgroundColor: "ghostwhite",
      }}
    >
      {/*
    Show this if the user is a provincial manager
*/}

      {customUserData?.role === roles.provincialManager && (
        <View>
          <View
            style={{
              width: "100%",
              paddingHorizontal: wp("3%"),
              // paddingTop: 5,
              backgroundColor: "#EBEBE4",
              borderTopWidth: 0,
              borderColor: "#EBEBE4",
              borderBottomWidth: 3,
              borderLeftWidth: 3,
              borderRightWidth: 3,
            }}
          >
            <Stack direction="row" w="100%">
              <Center w="15%"></Center>

              <Box w="70%">
                <Center>
                  <Text
                    style={{
                      fontFamily: "JosefinSans-Bold",
                      fontSize: responsiveFontSize(2),
                      color: COLORS.main,
                    }}
                  >
                    {customUserData?.userProvince}
                  </Text>

                  <Stack direction="row" space={2} my="1">
                    <Center>
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          fonSize: responsiveFontSize(1.5),
                        }}
                      >
                        [{"Usuários:"} {filteredStats.length}]
                      </Text>
                    </Center>
                    <Center>
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          fonSize: responsiveFontSize(1.5),
                        }}
                      >
                        [{"Distritos:"} {districts.length}]
                      </Text>
                    </Center>
                  </Stack>
                </Center>
              </Box>
              <Box w="15%"></Box>
            </Stack>
          </View>

          {stats?.length === 0 ? (
            <Box>
              <Center
                style={{
                  margin: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "JosefinSans-Regular",
                    fontSize: responsiveFontSize(2.5),
                    textAlign: "center",
                    lineHeight: 30,
                    color: COLORS.red,
                  }}
                >
                  A província de {customUserData?.userProvince} ainda não possui
                  usuários activos!
                </Text>
                <TickComponent />
              </Center>
            </Box>
          ) : (
            <Box
              alignItems="stretch"
              w="100%"
              style={{
                marginBottom: 140,
              }}
            >
              <SectionList
                sections={statsByDistrict}
                keyExtractor={(item, index) => {
                  return item.userId;
                }}
                renderItem={({ item }) => (
                  <StatItem route={route} navigation={navigation} item={item} />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <Text
                    style={{
                      paddingLeft: 10,
                      fontWeight: "bold",
                      color: COLORS.danger,
                    }}
                  >
                    {title}
                  </Text>
                )}
              />
            </Box>
          )}
        </View>
      )}

      {/*
   Show this if the user is a field agent only
*/}

      {customUserData?.role !== roles.provincialManager &&
        customUserData?.role !== roles.ampcmSupervisor && (
          <View
            style={{
            }}
          >
            <View
              style={{
                width: "100%",
                height: 70,
                paddingHorizontal: 15,
                paddingVertical: 10,
                backgroundColor: COLORS.fourth,
                borderColor: COLORS.fourth,
              }}
            >
              <View
                style={{
                  width: "80%"
                }}
              >
                <Pressable
                  onPress={() => {
                    setRefresh(!refresh);
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                    style={{
                      fontFamily: "JosefinSans-Bold",
                      fontSize: 24,
                      color: COLORS.grey,
                    }}
                  >
                    {customUserData?.userDistrict}
                  </Text>
                </Pressable>
              </View>
              <View
                style={{
                  borderRadius: 100,
                  backgroundColor: COLORS.main,
                  padding: 4,
                  elevation: 8,
                  position: "absolute",
                  right: 10,
                  top: 5,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    borderRadius: 100,
                    borderWidth: 3,
                    borderColor: COLORS.lightestgrey,
                    backgroundColor: COLORS.main,
                    padding: 2,
                  }}
                >
                  <TouchableOpacity onPress={addFarmer}>
                    <Icon
                      name="app-registration"
                      color={COLORS.lightestgrey}
                      size={30}
                    />
                  </TouchableOpacity>

                </View>
              </View>
            </View>

            {
              <Box
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <FlatList
                  numColumns={1}
                  horizontal={false}
                  StickyHeaderComponent={() => (
                    <Box
                      style={{
                        height: hp("10%"),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></Box>
                  )}
                  stickyHeaderHiddenOnScroll={true}
                  data={farmersTypes}
                  keyExtractor={keyExtractor}
                  // onEndReached={handleEndReached}
                  onEndReachedThreshold={0.1}
                  ItemSeparatorComponent={() => <CustomDivider thickness={2} />}
                  renderItem={({ item }) => {
                    if (item?.farmerType === "Grupo") {
                      item["total"] = groups?.length;
                    } else if (item?.farmerType === "Indivíduo") {
                      item["total"] = farmers?.length;
                    } else if (item?.farmerType === "Instituição") {
                      item["total"] = institutions?.length;
                    }
                    return <FarmerTypeCard route={route} item={item} />;
                  }}
                  ListFooterComponent={() => {
                    return (
                      <Box
                        style={{
                          paddingBottom: 100,
                        }}
                      >
                        <Text></Text>
                      </Box>
                    );
                  }}
                />
              </Box>
            }
          </View>
        )}

      {
        customUserData?.role !== roles.provincialManager &&
        customUserData?.role !== roles.ampcmSupervisor &&
        (
          <RegistrationButton customUserData={customUserData} navigation={navigation} route={route} />
        )
      }

    </SafeAreaView>
  );
}
