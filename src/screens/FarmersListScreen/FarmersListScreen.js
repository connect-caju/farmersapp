import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Switch,
  DrawerLayoutAndroid,
  TextInput,
} from "react-native";
import { Box, Center, Pressable, Stack } from "native-base";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { responsiveFontSize } from "react-native-responsive-dimensions";

import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
import { customizeItem } from "../../helpers/customizeItem";
import GroupItem from "../../components/GroupItem/GroupItem";
import FarmerItem from "../../components/FarmerItem/FarmerItem";
import InstitutionItem from "../../components/InstitutionItem/InstitutionItem";
import COLORS from "../../consts/colors";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import { roles } from "../../consts/roles";
import { Icon } from "@rneui/base";
import {
  faEllipsisVertical,
  faInstitution,
  faPeopleGroup,
  faPerson,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { extractIDs } from "../../helpers/extractIDs";

const { useRealm, useQuery } = realmContext;

const districtSingleFarmers = "districtSingleFarmers";
const districtGroupFarmers = "districtGroupFarmers";
const districtInstitutionFarmers = "districtInstitutionFarmers";
const districtFarmlands = "districtFarmlands";
const serviceProviderSubs = "serviceProviderSubs";
const actorMembershipSubs = "actorMembershipSubs";

const userSingleFarmers = "userSingleFarmers";
const userGroupFarmers = "userGroupFarmers";
const userInstitutionFarmers = "userInstitutionFarmers";
const userFarmlands = "userFarmlands";

const DrawerLayout = ({ route, navigation, farmerType }) => {
  // const [loadingActivitiyIndicator, setLoadingActivityIndicator] = useState(true);

  return (
    <View
      style={{
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          paddingBottom: 20,
        }}
      >
        <Stack direction={"row"}>
          <Box
            w="20%"
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,
                backgroundColor: COLORS.main,
                borderColor: COLORS.main,
                borderWidth: 1,
                padding: 5,
              }}
            >
              <FontAwesomeIcon
                icon={
                  farmerType?.includes("Institu")
                    ? faInstitution
                    : farmerType?.includes("Grupo")
                      ? faPeopleGroup
                      : faPerson
                }
                size={30}
                color={COLORS.fourth}
              />
            </Box>
          </Box>
          <Box
            w="80%"
            style={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "JosefinSans-Bold",
                color: COLORS.main,
              }}
            >
              {farmerType?.includes("Institu")
                ? "Produtores Institucionais"
                : farmerType?.includes("Grupo")
                  ? "Organizações"
                  : "Produtores Singulares"}
            </Text>
          </Box>
        </Stack>
      </View>

      {farmerType?.includes("Indiv") && (
        <View>
          {/* user's  */}
          <View></View>

          {/* district's */}
          <View></View>
        </View>
      )}

      <View
        style={{
          height: "70%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CustomActivityIndicator backgroundColor={COLORS.fourth} />
        <Text
          style={{
            color: COLORS.main,
            fontSize: 15,
            fontFamily: "JosefinSans-Regular",
            textAlign: "center",
          }}
        >
          Desenvolvimento em curso . . .
        </Text>
      </View>
    </View>
  );
};

const FarmersListScreen = ({ route, navigation }) => {
  const realm = useRealm();
  const user = useUser();
  let customUserData = user.customData;
  customUserData = {
    name: customUserData?.name,
    userDistrict: customUserData?.userDistrict,
    userProvince: customUserData?.userProvince,
    userId: customUserData?.userId,
    role: customUserData?.role,
  };

  const farmerType = route.params?.farmerType || "Indivíduo";
  let farmers;
  let farmlands;
  let serviceProviders;
  let farmersIDs; // IDs to be used for swiping between farmers' screen
  if (farmerType === "Indivíduo") {
    farmers = realm
      .objects("Actor")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    serviceProviders = realm
      .objects("SprayingServiceProvider")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    farmlands = realm
      .objects("Farmland")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    farmers = customizeItem(
      farmers,
      farmlands,
      serviceProviders,
      customUserData,
      "Indivíduo",
    );
    farmersIDs = extractIDs(farmers);
  } else if (farmerType === "Grupo") {
    farmers = realm
      .objects("Group")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    serviceProviders = realm
      .objects("SprayingServiceProvider")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    farmlands = realm
      .objects("Farmland")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    farmers = customizeItem(
      farmers,
      farmlands,
      serviceProviders,
      customUserData,
      "Grupo",
    );
    farmersIDs = extractIDs(farmers);
  } else if (farmerType === "Instituição") {
    farmers = realm
      .objects("Institution")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    serviceProviders = realm
      .objects("SprayingServiceProvider")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    farmlands = realm
      .objects("Farmland")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    farmers = customizeItem(
      farmers,
      farmlands,
      serviceProviders,
      customUserData,
      "Instituição",
    );
    farmersIDs = extractIDs(farmers);
  }

  const [showAll, setShowAll] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);
  const drawerRef = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState("right");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [foundFarmersList, setFoundFarmersList] = useState([]);

  // const [fetchedFarmers, setFetchedFarmers] = useState([]);
  // const [fetchedGroups, setFetchedGroups] = useState([]);
  // const [fetchedInstitutions, setFetchedInstitutions] = useState([]);
  // const [fetchedFarmlands, setFetchedFarmlands] = useState([]);

  // // This state will be used to toggle between showing all items and only showing the current user's items
  // // This is initialized based on which subscription is already active

  useEffect(() => {
    if (
      customUserData?.role !== roles.provincialManager &&
      customUserData?.role !== roles.ampcmSupervisor
    ) {
      if (farmerType === "Indivíduo" && showAll) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(districtSingleFarmers);
          mutableSubs.add(
            realm
              .objects("Actor")
              .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
            { name: districtSingleFarmers },
          );
        });
      } else if (farmerType === "Indivíduo" && !showAll) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(districtSingleFarmers);
          mutableSubs.add(
            realm
              .objects("Actor")
              .filtered(`userId == "${user?.customData?.userId}"`),
            { name: districtSingleFarmers },
          );
        });
      }

      if (farmerType === "Grupo" && showAll) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(districtGroupFarmers);
          mutableSubs.add(
            realm
              .objects("Group")
              .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
            { name: districtGroupFarmers },
          );
        });
      } else if (farmerType === "Grupo" && !showAll) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(districtGroupFarmers);
          mutableSubs.add(
            realm
              .objects("Group")
              .filtered(`userId == "${user?.customData?.userId}"`),
            { name: districtGroupFarmers },
          );
        });
      }

      if (farmerType === "Instituição" && showAll) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(districtInstitutionFarmers);
          mutableSubs.add(
            realm
              .objects("Institution")
              .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
            { name: districtInstitutionFarmers },
          );
        });
      } else if (farmerType === "Instituição" && !showAll) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(districtInstitutionFarmers);
          mutableSubs.add(
            realm
              .objects("Institution")
              .filtered(`userId == "${user?.customData?.userId}"`),
            { name: districtInstitutionFarmers },
          );
        });
      }

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(districtFarmlands);
        mutableSubs.add(
          realm
            .objects("Farmland")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: districtFarmlands },
        );
      });

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(serviceProviderSubs);
        mutableSubs.add(
          realm
            .objects("SprayingServiceProvider")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: serviceProviderSubs },
        );
      });

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(actorMembershipSubs);
        mutableSubs.add(
          realm
            .objects("ActorMembership")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: actorMembershipSubs },
        );
      });
    } else if (customUserData?.role === roles.provincialManager) {
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
  }, [realm, user, showAll]);

  useEffect(() => {
    if (isSearching && searchQuery.length > 0) {
      setFoundFarmersList(
        farmers.filter((item) => {
          if (farmerType?.includes("Indiv")) {
            return item.name?.toLowerCase()?.includes(searchQuery.toLowerCase());
          } else if (farmerType?.includes("Grupo")) {
            return (
              item.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
              item.type?.toLowerCase()?.includes(searchQuery.toLowerCase())
            );
          } else if (farmerType?.includes("Institu")) {
            return (
              item.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
              item.manager?.toLowerCase()?.includes(searchQuery.toLowerCase())
            );
          }
        }),
      );
    }
  }, [isSearching, searchQuery]);

  const keyExtractor = (item, index) => index.toString();

  const handleEndReached = () => {
    if (!isEndReached && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

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
        backgroundColor: COLORS.ghostwhite,
        flex: 1,
      }}
    >
      <DrawerLayoutAndroid
        ref={drawerRef}
        drawerWidth={300}
        drawerBackgroundColor={COLORS.fourth}
        drawerPosition={drawerPosition}
        renderNavigationView={() =>
          DrawerLayout({ route, navigation, farmerType })
        }
      >
        <View
          style={{
            // minHeight: "15%",
            width: "100%",
            paddingHorizontal: 5,
            paddingVertical: 10,
            backgroundColor: COLORS.fourth,
            borderTopWidth: 0,
            borderColor: COLORS.fourth,
            borderBottomWidth: 3,
            borderLeftWidth: 3,
            borderRightWidth: 3,
          }}
        >
          {!isSearching ? (
            <Stack direction="row" w="100%">
              <Center w="20%">
                <Switch
                  trackColor={{ true: COLORS.main, false: COLORS.grey }}
                  thumbColor={showAll ? COLORS.grey : COLORS.main}
                  onValueChange={() => {
                    setShowAll(!showAll);
                    setLoadingActivityIndicator(true);
                  }}
                  value={showAll}
                />
              </Center>

              <Box w="60%">
                <Center>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                    style={{
                      fontFamily: "JosefinSans-Bold",
                      fontSize: responsiveFontSize(2),
                      color: COLORS.main,
                    }}
                  >
                    {showAll
                      ? customUserData?.userDistrict
                      : customUserData?.name}
                  </Text>

                  <Stack direction="row" space={2} my="1">
                    <Center>
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          fonSize: responsiveFontSize(1),
                        }}
                      >
                        [
                        {farmerType === "Grupo"
                          ? "Organizações:"
                          : farmerType === "Indivíduo"
                            ? "Produtores:"
                            : "Instituições:"}{" "}
                        {farmers?.length}]
                      </Text>
                    </Center>
                    {/* <Center>
                  <Text
                    style={{ 
                      fontFamily: 'JosefinSans-Regular', 
                      fonSize: responsiveFontSize(1), 
                    }}
                  >[{'Pomares:'}{' '}{farmlands?.length}]</Text>
                </Center> */}
                  </Stack>
                </Center>
              </Box>
              <Box
                w="10%"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  style={{
                    justifyContent: "center",
                    borderRadius: 100,
                  }}
                >
                  <TouchableOpacity
                    style={{}}
                    onPress={() => setIsSearching(true)}
                  >
                    <Box>
                      <FontAwesomeIcon
                        icon={faSearch}
                        size={25}
                        color={COLORS.main}
                        fade
                      />
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>
              <Box
                w="10%"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  style={{
                    justifyContent: "center",
                    borderRadius: 100,
                  }}
                >
                  <TouchableOpacity
                    style={{}}
                    onPress={() => drawerRef.current.openDrawer()}
                  >
                    <Box>
                      <FontAwesomeIcon
                        icon={faEllipsisVertical}
                        size={25}
                        color={COLORS.main}
                        fade
                      />
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>
            </Stack>
          ) : (
            <Stack direction="row" w="100%">
              <Center w="10%">
                <Pressable
                  onPress={() => {
                    if (isSearching) {
                      setIsSearching(false);
                      setSearchQuery("");
                      setFoundFarmersList([]);
                    }
                  }}
                  style={{
                    position: "absolute",
                    left: -2,
                    top: 5,
                    flexDirection: "row",
                  }}
                >
                  <Icon
                    name="arrow-back-ios"
                    color={COLORS.main}
                    size={wp("8%")}
                  />
                </Pressable>
              </Center>
              <Box
                w="90%"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TextInput
                  autoFocus={isSearching ? true : false}
                  placeholder="Procurar"
                  placeholderTextColor={COLORS.lightgrey}
                  style={{
                    width: "100%",
                    backgroundColor: COLORS.white,
                    borderRadius: 30,
                    color: COLORS.grey,
                    fontFamily: "JosefinSans-Regular",
                    borderWidth: 1,
                    textAlign: "left",
                    paddingLeft: 20,
                    fontSize: 16,
                    borderColor: COLORS.white,
                  }}
                  value={searchQuery}
                  onFocus={() => {
                    // setIsFocused(true);
                  }}
                  onEndEditing={() => {
                    // setIsFocused(false);
                  }}
                  onChangeText={(text) => setSearchQuery(text)}
                />
              </Box>
            </Stack>
          )}
        </View>

        {farmers?.length > 0 && searchQuery.length === 0 ? (
          <Box
            alignItems="stretch"
            w="100%"
            style={{
              marginVertical: 7,
              // marginTop: 10,
            }}
          >
            <FlatList
              StickyHeaderComponent={() => (
                <Box
                  style={{
                    height: hp("10%"),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <Text>Hello! Here is the sticky header!</Text> */}
                </Box>
              )}
              stickyHeaderHiddenOnScroll={true}
              data={farmers}
              keyExtractor={keyExtractor}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.1}
              renderItem={({ item }) => {
                // add all the IDs to each item to allow swiping between screens...
                // when the user open any item from the list
                item.farmersIDs = farmersIDs;

                if (item.flag === "Grupo") {
                  return <GroupItem route={route} item={item} />;
                } else if (item.flag === "Indivíduo") {
                  return (
                    <FarmerItem
                      route={route}
                      navigation={navigation}
                      item={item}
                    />
                  );
                } else if (item.flag === "Instituição") {
                  return <InstitutionItem route={route} item={item} />;
                }
              }}
              ListFooterComponent={() => {
                if (!isEndReached) {
                  return (
                    <Box
                      style={{
                        // height: 10,
                        backgroundColor: COLORS.ghostwhite,
                        paddingBottom: 15,
                        marginBottom: 100,
                      }}
                    ></Box>
                  );
                }
                return null;
              }}
            />
          </Box>
        ) : isSearching && searchQuery.length > 0 ? (
          <Box
            alignItems="stretch"
            w="100%"
            style={{
              marginVertical: 7,
              // marginTop: 10,
            }}
          >
            <FlatList
              StickyHeaderComponent={() => (
                <Box
                  style={{
                    height: hp("10%"),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <Text>Hello! Here is the sticky header!</Text> */}
                </Box>
              )}
              stickyHeaderHiddenOnScroll={true}
              data={foundFarmersList}
              keyExtractor={keyExtractor}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.1}
              renderItem={({ item }) => {
                if (item.flag === "Grupo") {
                  return <GroupItem route={route} item={item} />;
                } else if (item.flag === "Indivíduo") {
                  return (
                    <FarmerItem
                      route={route}
                      navigation={navigation}
                      item={item}
                    />
                  );
                } else if (item.flag === "Instituição") {
                  return <InstitutionItem route={route} item={item} />;
                }
              }}
              ListFooterComponent={() => {
                if (!isEndReached) {
                  return (
                    <Box
                      style={{
                        // height: 10,
                        backgroundColor: COLORS.ghostwhite,
                        paddingBottom: 15,
                        marginBottom: 100,
                      }}
                    ></Box>
                  );
                }
                return null;
              }}
            />
          </Box>
        ) : (
          <Box
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Text
              style={{
                color: COLORS.grey,
                fontSize: 16,
                fontFamily: "JosefinSans-Bold",
                marginHorizontal: 40,
                lineHeight: 22,
                textAlign: "center",
              }}
            >
              Nenhum registo de
              {farmerType === "Grupo"
                ? " organizações"
                : farmerType === "Indivíduo"
                  ? " produtores"
                  : " instituições"}{" "}
              foi encontrado!
            </Text>
          </Box>
        )}

        {foundFarmersList.length === 0 && searchQuery.length > 0 && (
          <Box
            style={{
              justifyContent: "center",
              alignItems: "center",
              //  height: '50%',
            }}
          >
            <Text
              style={{
                color: COLORS.grey,
                fontSize: 16,
                fontFamily: "JosefinSans-Bold",
                marginHorizontal: 40,
                lineHeight: 22,
                textAlign: "center",
              }}
            >
              Nenhum registo de
              {farmerType === "Grupo"
                ? " organizações"
                : farmerType === "Indivíduo"
                  ? " produtores"
                  : " instituições"}{" "}
              foi encontrado!
            </Text>
          </Box>
        )}
      </DrawerLayoutAndroid>
    </SafeAreaView>
  );
};

export default FarmersListScreen;
