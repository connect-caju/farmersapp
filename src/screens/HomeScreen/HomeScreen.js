/* eslint-disable semi */
import {
  View,
  Text,
  InteractionManager,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import React, { useCallback, useState, useEffect } from "react"
import { Box, Stack, Center } from "native-base"
import { Icon } from "@rneui/themed"
import { useFocusEffect } from "@react-navigation/native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"

import { responsiveFontSize } from "react-native-responsive-dimensions"

import COLORS from "../../consts/colors"
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator"
import { months } from "../../helpers/dates"
import CustomDivider from "../../components/Divider/CustomDivider"
import UserGoalEdit from "../../components/UserGoalEdit/UserGoalEdit"
import { roles } from "../../consts/roles"
import UserProfile from "../../components/UserProfile/UserProfile"
import { getPercentage } from "../../helpers/getPercentage"

import { useUser } from "@realm/react"
import { realmContext } from "../../models/realmContext"
const { useRealm, useQuery } = realmContext

// sync subscription by this name
const userStats = "userStats"

const districtSingleFarmers = "districtSingleFarmers"
const districtGroupFarmers = "districtGroupFarmers"
const districtInstitutionFarmers = "districtInstitutionFarmers"
const districtFarmlands = "districtFarmlands"
const serviceProviderSubs = "serviceProviderSubs"
const actorMembershipSubs = "actorMembershipSubs"

// realm variable used for manual client reset in the syncConfig
export let realm

export default function HomeScreen({ route, navigation }) {
  realm = useRealm()
  const user = useUser()
  const customUserData = user?.customData

  const [isPerformanceButtonActive, setIsPerformanceButtonActive] =
    useState(false)
  const [isUserProfileVisible, setIsUserProfileVisible] = useState(false)
  const [isGoalUpdateVisible, setIsGoalUpdateVisible] = useState(false)
  const [isFieldAgent, setIsFieldAgent] = useState(true)

  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false)

  const provincialUserStats = useQuery("UserStat").filtered(
    `userProvince == "${customUserData?.userProvince}" && userDistrict != "NA"`,
  )

  // --------------------------------------------------------
  const districts = Array.from(
    new Set(provincialUserStats.map((stat) => stat?.userDistrict)),
  )

  // -------------------------------------------------------------

  // --------------------------------------------------------
  // get extract stats from whole province
  const tWholeProvince = provincialUserStats?.map((stat) => {
    return {
      tFarmers: stat.targetFarmers,
      tFarmlands: stat.targetFarmlands,
    }
  })

  const rWholeProvince = provincialUserStats?.map((stat) => {
    return {
      rFarmers: stat.registeredFarmers,
      rFarmlands: stat.registeredFarmlands,
    }
  })

  // the current user provincial stats (Number of farmers and farmlands that have to be registered
  // until the end of the project execution
  // the current user provincial stats (number of farmers and farmlands that have been registered so far)

  const tpFarmers = tWholeProvince
    .map((stat) => stat.tFarmers)
    .reduce((ac, cur) => ac + cur, 0)
  const rpFarmers = rWholeProvince
    .map((stat) => stat.rFarmers)
    .reduce((ac, cur) => ac + cur, 0)
  const tpFarmlands = tWholeProvince
    .map((stat) => stat.tFarmlands)
    .reduce((ac, cur) => ac + cur, 0)
  const rpFarmlands = rWholeProvince
    .map((stat) => stat.rFarmlands)
    .reduce((ac, cur) => ac + cur, 0)

  // ----------------------------------------------------------------
  //  extract stats from whole district
  const tWholeDistrict = provincialUserStats
    ?.filter(
      (stat) =>
        stat.userDistrict === customUserData?.userDistrict &&
        stat.userDistrict !== "NA",
    )
    ?.map((stat) => {
      return {
        tFarmers: stat.targetFarmers,
        tFarmlands: stat.targetFarmlands,
      }
    })

  const rWholeDistrict = provincialUserStats
    ?.filter(
      (stat) =>
        stat.userDistrict === customUserData?.userDistrict &&
        stat.userDistrict !== "NA",
    )
    ?.map((stat) => {
      return {
        rFarmers: stat.registeredFarmers,
        rFarmlands: stat.registeredFarmlands,
      }
    })

  // the current user district stats in terms of farmers and farmlands that have to be registered
  // within the district and the project execution timeline
  // the current district stats (number of farmers and farmlands that have been registered so far)

  const tdFarmers = tWholeDistrict
    .map((stat) => stat.tFarmers)
    .reduce((ac, cur) => ac + cur, 0)
  const rdFarmers = rWholeDistrict
    .map((stat) => stat.rFarmers)
    .reduce((ac, cur) => ac + cur, 0)
  const tdFarmlands = tWholeDistrict
    .map((stat) => stat.tFarmlands)
    .reduce((ac, cur) => ac + cur, 0)
  const rdFarmlands = rWholeDistrict
    .map((stat) => stat.rFarmlands)
    .reduce((ac, cur) => ac + cur, 0)

  // ---------------------------------------------------------------
  // extract stats of the current user

  const tCurrentUser = provincialUserStats
    ?.filter((stat) => stat.userId === customUserData?.userId)
    ?.map((stat) => {
      return {
        tFarmers: stat.targetFarmers,
        tFarmlands: stat.targetFarmlands,
      }
    })

  const rCurrentUser = provincialUserStats
    ?.filter((stat) => stat.userId === customUserData?.userId)
    ?.map((stat) => {
      return {
        rFarmers: stat.registeredFarmers,
        rFarmlands: stat.registeredFarmlands,
      }
    })

  // the current user stats (target -- gooal in terms of the number of farmers and farmlands)
  //  they must register throughout the project execution
  //  the current user stats (number of farmers and farmlands registered)

  const tuFarmers = tCurrentUser
    .map((stat) => stat.tFarmers)
    .reduce((ac, cur) => ac + cur, 0)
  const ruFarmers = rCurrentUser
    .map((stat) => stat.rFarmers)
    .reduce((ac, cur) => ac + cur, 0)
  const tuFarmlands = tCurrentUser
    .map((stat) => stat.tFarmlands)
    .reduce((ac, cur) => ac + cur, 0)
  const ruFarmlands = rCurrentUser
    .map((stat) => stat.rFarmlands)
    .reduce((ac, cur) => ac + cur, 0)
  //----------------------------------------------------------------------

  // realm subscription to all the resources
  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(userStats)
      mutableSubs.add(
        realm
          .objects("UserStat")
          .filtered(`userProvince == "${user?.customData?.userProvince}"`),
        { name: userStats },
      )
    })

    if (
      customUserData?.role?.includes(roles.provincialManager) ||
      customUserData?.role?.includes(roles.ampcmSupervisor)
    ) {
      setIsFieldAgent(false)
    }
  }, [user, realm])

  useEffect(() => {
    if (
      customUserData?.role !== roles.provincialManager &&
      customUserData?.role !== roles.ampcmSupervisor
    ) {
      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(
          realm
            .objects("Actor")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: districtSingleFarmers },
        )
      })

      realm.subscriptions.update((mutableSubs) => {
        // mutableSubs.removeByName(districtGroupFarmers)
        mutableSubs.add(
          realm
            .objects("Group")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: districtGroupFarmers },
        )
      })

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(
          realm
            .objects("Institution")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: districtInstitutionFarmers },
        )
      })


      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(
          realm
            .objects("Farmland")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: districtFarmlands },
        )
      })

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(
          realm
            .objects("SprayingServiceProvider")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: serviceProviderSubs },
        )
      })

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(
          realm
            .objects("ActorMembership")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: actorMembershipSubs },
        )
      })
    } else if (
      customUserData?.role === roles.provincialManager ||
      // customUserData?.role === roles.coopManager ||
      customUserData?.role === roles.ampcmSupervisor
    ) {
      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(provincialStats)
        mutableSubs.add(
          realm
            .objects("UserStat")
            .filtered(`userProvince == "${user?.customData?.userProvince}"`),
          { name: provincialStats },
        )
      })
    }
  }, [realm, user])

  useFocusEffect(
    useCallback(() => {
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
        backgroundColor: "ghostwhite",
        // alignItems: 'center',
      }}
    >
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderLeftWidth: 1,
          borderColor: "#EBEBE4",
          backgroundColor: "#EBEBE4",
          borderBottomLeftRadius: wp("15%"),
          borderBottomRightRadius: wp("15%"),
          marginBottom: hp("10%"),

          shadowColor: COLORS.main,
        }}
      >
        <Box
          style={{
            paddingVertical: 10,
            paddingHorizontal: 5,
          }}
        >
          <Stack
            direction="row"
            w="100%"
          // py="5"
          >
            <Box w="40%" alignItems={"center"}>
              <Image
                style={{ width: 55, height: 55, borderRadius: 100 }}
                source={require("../../../assets/images/iamLogo2.png")}
              />
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.main,
                  fontSize: responsiveFontSize(2),
                  fontFamily: "JosefinSans-Bold",
                }}
              >
                IAM, IP
              </Text>
            </Box>
            <Box w="20%"></Box>
            <Box w="40%" alignItems={"center"}>
              <TouchableOpacity
                onPress={() => {
                  setIsUserProfileVisible((prev) => !prev)
                }}
              >
                <Icon
                  name="account-circle"
                  color={COLORS.main}
                  size={wp("15%")}
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: COLORS.grey,
                    fontFamily: "JosefinSans-Bold",
                    fontSize: responsiveFontSize(2),
                  }}
                >
                  {customUserData?.name?.split(" ")[0]}
                </Text>
              </TouchableOpacity>
            </Box>
          </Stack>

          <Stack direction="row" w="100%">
            <Center w="30%"></Center>
            <Box w="70%"></Box>
          </Stack>
        </Box>
      </View>

      {/* Province users and districts */}
      {!isFieldAgent && customUserData?.role === roles.provincialManager && (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            borderTopLeftRadius: wp("10%"),
            borderTopRightRadius: wp("10%"),
            padding: 10,
          }}
        >
          <View
            style={{
              marginBottom: hp("2%"),
            }}
          >
            <View
              style={{
                width: "100%",
              }}
            >
              <Box
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  // padding: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.5),
                    color: COLORS.black,
                    fontFamily: "JosefinSans-Bold",
                    textAlign: "center",
                  }}
                >
                  {customUserData?.userProvince}
                </Text>

                <Stack direction="row" w="100%">
                  <Box
                    style={{
                      width: "40%",
                      // height: 100,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2),
                        fontFamily: "JosefinSans-Bold",
                        textAlign: "center",
                        color: COLORS.grey,
                      }}
                    >
                      Usuários
                    </Text>
                    <Box alignItems={"center"}>
                      <Text
                        style={{
                          width: "50%",
                          fontSize: responsiveFontSize(2),
                          fontFamily: "JosefinSans-Regular",
                          textAlign: "center",
                          color: COLORS.grey,
                          borderRadius: 100,
                          borderWidth: 1,
                          backgroundColor: COLORS.ghostwhite,
                          borderColor: COLORS.ghostwhite,
                        }}
                      >
                        {provincialUserStats?.length}
                      </Text>
                    </Box>
                  </Box>

                  <Box w="20%"></Box>

                  <Box
                    style={{
                      width: "40%",
                      // height: 100,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2),
                        fontFamily: "JosefinSans-Bold",
                        textAlign: "center",
                        color: COLORS.grey,
                      }}
                    >
                      Distritos
                    </Text>
                    <Box alignItems={"center"}>
                      <Text
                        style={{
                          width: "50%",
                          fontSize: responsiveFontSize(2),
                          fontFamily: "JosefinSans-Regular",
                          textAlign: "center",
                          color: COLORS.grey,
                          borderRadius: 100,
                          borderWidth: 1,
                          backgroundColor: COLORS.ghostwhite,
                          borderColor: COLORS.ghostwhite,
                        }}
                      >
                        {districts?.length}
                      </Text>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </View>
          </View>

          {/* provincial goals in terms of farmers and farmlands registrations  */}

          <View
            style={{
              width: "100%",
              backgroundColor: COLORS.ghostwhite,
              marginVertical: 10,
              // paddingVertical: 4,
              // paddingHorizontal: 5,
              // borderColor: '#005000',
              // shadowColor: "#005000",
              // shadowOffset: {
              //   width: 2,
              //   height: 3,
              // },
              // shadowOpacity: 0.27,
              // shadowRadius: 4.65,
              // elevation: 3,
              // opacity: 1,
            }}
          >
            <View
              style={
                {
                  // paddingTop: 30,
                }
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  // marginBottom: hp('1%'),
                }}
              >
                <Icon name="update" size={wp("10%")} color={COLORS.danger} />
                <Text
                  style={{
                    fontSize: responsiveFontSize(2),
                    color: COLORS.danger,
                    fontFamily: "JosefinSans-Bold",
                    marginLeft: 10,
                  }}
                >
                  Meta
                </Text>
              </View>

              <Stack w="100%" direction="row" space={3}>
                <Box
                  w="50%"
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "JosefinSans-Bold",
                      textAlign: "center",
                      color: COLORS.danger,
                    }}
                  >
                    Produtores
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "JosefinSans-Regular",
                      textAlign: "center",
                      color: COLORS.danger,
                      paddingTop: 5,
                    }}
                  >
                    {tpFarmers}
                  </Text>
                </Box>
                <Box
                  w="50%"
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "JosefinSans-Bold",
                      textAlign: "center",
                      color: COLORS.danger,
                    }}
                  >
                    Pomares
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "JosefinSans-Regular",
                      textAlign: "center",
                      color: COLORS.danger,
                      paddingTop: 5,
                    }}
                  >
                    {tpFarmlands}
                  </Text>
                </Box>
              </Stack>
            </View>
          </View>

          {/* <CustomDivider thickness={2} bg={COLORS.danger} /> */}
          {/*  provincial achievments in terms of farmers and farmlands registrations */}

          <View
            style={{
              width: "100%",
              backgroundColor: COLORS.ghostwhite,
              marginVertical: 10,
              // paddingVertical: 4,
              paddingHorizontal: 5,
              // borderColor: '#005000',
              // shadowColor: "#005000",
              // shadowOffset: {
              //   width: 2,
              //   height: 3,
              // },
              // shadowOpacity: 0.27,
              // shadowRadius: 4.65,
              // elevation: 3,
              // opacity: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                // marginBottom: 10,
                // paddingTop: 30,
              }}
            >
              <Icon name="done-outline" size={30} color={COLORS.lightdanger} />
              <Text
                style={{
                  fontSize: responsiveFontSize(2),
                  color: COLORS.lightdanger,
                  fontFamily: "JosefinSans-Bold",
                  marginLeft: 10,
                }}
              >
                Realização
              </Text>
            </View>

            <Stack w="100%" direction="row" space={3}>
              <Box
                w="50%"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "JosefinSans-Bold",
                    textAlign: "center",
                    color: COLORS.lightdanger,
                  }}
                >
                  Produtores
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "JosefinSans-Regular",
                    textAlign: "center",
                    color: COLORS.lightdanger,
                    paddingTop: 5,
                  }}
                >
                  {getPercentage(rpFarmers, tpFarmers)}
                </Text>
              </Box>
              <Box
                w="50%"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "JosefinSans-Bold",
                    textAlign: "center",
                    color: COLORS.lightdanger,
                  }}
                >
                  Pomares
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "JosefinSans-Regular",
                    textAlign: "center",
                    color: COLORS.lightdanger,
                    paddingTop: 5,
                  }}
                >
                  {getPercentage(rpFarmlands, tpFarmlands)}
                </Text>
              </Box>
            </Stack>
          </View>
          {/* <CustomDivider thickness={2} bg={COLORS.lightdanger} /> */}
        </ScrollView>
      )}

      {isFieldAgent && (
        <View
          style={{
            padding: 10,
          }}
        >
          <View
            style={{
              width: "100%",
              borderTopLeftRadius: wp("10%"),
              borderTopRightRadius: wp("10%"),
              shadowColor: COLORS.main,
              shadowOffset: {
                width: 1,
                height: 1,
              },
              shadowOpacity: 1,
              shadowRadius: 0.65,
              elevation: 2,
            }}
          >
            <Box
              style={{
                backgroundColor: COLORS.main,
                width: "100%",
                paddingRight: wp("4%"),
                alignItems: "center",
                borderTopLeftRadius: wp("5%"),
                borderTopRightRadius: wp("5%"),
              }}
            >
              <Box pb="2" alignItems={"center"}>
                <Text
                  style={{
                    color: "white",
                    fontSize: responsiveFontSize(2.5),
                    fontFamily: "JosefinSans-Bold",
                    textAlign: "center",
                  }}
                >
                  Desempenho
                </Text>
              </Box>

              <Stack direction="row" w="90%" space={4}>
                <Box w="50%" alignItems={"center"} style={{}}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsPerformanceButtonActive((prev) => !prev)
                    }}
                    style={{
                      backgroundColor: isPerformanceButtonActive
                        ? COLORS.second
                        : COLORS.ghostwhite,
                      width: "100%",
                      borderTopRightRadius: wp("2%"),
                      borderTopLeftRadius: wp("2%"),
                      borderTopWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      borderColor: COLORS.ghostwhite,
                      paddingTop: 5,
                      position: "relative",
                      bottom: isPerformanceButtonActive ? -2 : -2,
                    }}
                  >
                    <Text
                      style={{
                        color: isPerformanceButtonActive
                          ? COLORS.ghostwhite
                          : COLORS.lightdanger,
                        fontSize: responsiveFontSize(2),
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                        textAlign: "center",
                      }}
                    >
                      Produtores
                    </Text>
                  </TouchableOpacity>
                </Box>
                <Box w="50%" alignItems={"center"}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsPerformanceButtonActive((prev) => !prev)
                    }}
                    style={{
                      backgroundColor: isPerformanceButtonActive
                        ? COLORS.ghostwhite
                        : COLORS.second,
                      width: "100%",
                      borderTopRightRadius: wp("2%"),
                      borderTopLeftRadius: wp("2%"),
                      borderTopWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,

                      borderColor: COLORS.ghostwhite,
                      paddingTop: 5,
                      position: "relative",
                      bottom: isPerformanceButtonActive ? -2 : -2,
                    }}
                  >
                    <Text
                      style={{
                        color: isPerformanceButtonActive
                          ? COLORS.danger
                          : COLORS.ghostwhite,
                        fontSize: responsiveFontSize(2),
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                        textAlign: "center",
                      }}
                    >
                      Pomares
                    </Text>
                  </TouchableOpacity>
                </Box>
              </Stack>
            </Box>
            {!isPerformanceButtonActive && (
              <Stack direction="column" w="100%" pt="4">
                <Stack direction="row">
                  <Box w="50%">
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.black,
                        fontSize: responsiveFontSize(1.5),
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Realização
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.grey,
                        fontSize: responsiveFontSize(1.5),
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Até {months[new Date().getMonth()]}{" "}
                      {new Date().getFullYear()}
                    </Text>
                  </Box>
                  <Box w="50%">
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.black,
                        fontSize: responsiveFontSize(1.5),
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Meta
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.grey,
                        fontSize: responsiveFontSize(1.5),
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Até Dezembro {new Date().getFullYear()}
                    </Text>
                  </Box>
                </Stack>
                <CustomDivider />
                <Text
                  style={{
                    textAlign: "center",
                    color: isPerformanceButtonActive
                      ? COLORS.ghostwhite
                      : COLORS.lightdanger,
                    fontFamily: "JosefinSans-Bold",
                    fontSize: responsiveFontSize(1.5),
                    paddingTop: 10,
                  }}
                >
                  Provincial ({customUserData?.userProvince})
                </Text>

                <Stack w="100%" direction="row" space={4} py="2">
                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.ghostwhite
                            : COLORS.lightdanger,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            fontSize: responsiveFontSize(1.5),
                            color: isPerformanceButtonActive
                              ? COLORS.lightdanger
                              : COLORS.ghostwhite,
                          }}
                        >
                          {getPercentage(rpFarmers, tpFarmers)}
                        </Text>
                      </Center>
                    </Center>
                  </Box>

                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.ghostwhite
                            : COLORS.lightdanger,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            fontSize: responsiveFontSize(1.5),
                            color: isPerformanceButtonActive
                              ? COLORS.lightdanger
                              : COLORS.ghostwhite,
                          }}
                        >
                          {tpFarmers}
                        </Text>
                      </Center>
                    </Center>
                  </Box>
                </Stack>

                <CustomDivider />
                <Text
                  style={{
                    textAlign: "center",
                    color: isPerformanceButtonActive
                      ? COLORS.ghostwhite
                      : COLORS.lightdanger,
                    fontFamily: "JosefinSans-Bold",
                    fontSize: responsiveFontSize(1.5),
                    paddingTop: 10,
                  }}
                >
                  Distrital ({customUserData?.userDistrict})
                </Text>

                <Stack w="100%" direction="row" space={4} py="2">
                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.ghostwhite
                            : COLORS.lightdanger,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            fontSize: responsiveFontSize(1.5),
                            color: isPerformanceButtonActive
                              ? COLORS.lightdanger
                              : COLORS.ghostwhite,
                          }}
                        >
                          {getPercentage(rdFarmers, tdFarmers)}
                        </Text>
                      </Center>
                    </Center>
                  </Box>

                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.ghostwhite
                            : COLORS.lightdanger,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            fontSize: responsiveFontSize(1.5),
                            color: isPerformanceButtonActive
                              ? COLORS.lightdanger
                              : COLORS.ghostwhite,
                          }}
                        >
                          {tdFarmers}
                        </Text>
                      </Center>
                    </Center>
                  </Box>
                </Stack>

                <CustomDivider />
                <Text
                  style={{
                    textAlign: "center",
                    color: isPerformanceButtonActive
                      ? COLORS.ghostwhite
                      : COLORS.lightdanger,
                    fontFamily: "JosefinSans-Bold",
                    fontSize: responsiveFontSize(1.5),
                    paddingTop: 10,
                  }}
                >
                  Individual ({customUserData?.name})
                </Text>

                <Stack w="100%" direction="row" space={4} py="2">
                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.ghostwhite
                            : COLORS.lightdanger,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            fontSize: responsiveFontSize(1.5),
                            color: isPerformanceButtonActive
                              ? COLORS.lightdanger
                              : COLORS.ghostwhite,
                          }}
                        >
                          {getPercentage(ruFarmers, tuFarmers)}
                        </Text>
                      </Center>
                    </Center>
                  </Box>

                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.ghostwhite
                            : COLORS.lightdanger,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            fontSize: responsiveFontSize(1.5),
                            color: isPerformanceButtonActive
                              ? COLORS.lightdanger
                              : COLORS.ghostwhite,
                          }}
                        >
                          {tuFarmers}
                        </Text>
                      </Center>
                    </Center>
                  </Box>
                </Stack>
              </Stack>
            )}

            {isPerformanceButtonActive && (
              <Stack direction="column" w="100%" pt="4">
                <Stack direction="row">
                  <Box w="50%">
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.black,
                        fontSize: responsiveFontSize(1.5),
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Realização
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.grey,
                        fontSize: responsiveFontSize(1.5),
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Até {months[new Date().getMonth()]}{" "}
                      {new Date().getFullYear()}
                    </Text>
                  </Box>
                  <Box w="50%">
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.black,
                        fontSize: responsiveFontSize(1.5),
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Meta
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.grey,
                        fontFamily: "JosefinSans-Bold",
                        fontSize: responsiveFontSize(1.5),
                      }}
                    >
                      Até Dezembro {new Date().getFullYear()}
                    </Text>
                  </Box>
                </Stack>
                <CustomDivider />
                <Text
                  style={{
                    textAlign: "center",
                    color: isPerformanceButtonActive
                      ? COLORS.danger
                      : COLORS.main,
                    fontFamily: "JosefinSans-Bold",
                    paddingTop: 10,
                    fontSize: responsiveFontSize(1.5),
                  }}
                >
                  Provincial ({customUserData?.userProvince})
                </Text>

                <Stack w="100%" direction="row" space={4} py="2">
                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.danger
                            : COLORS.main,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: COLORS.ghostwhite,
                            fontSize: responsiveFontSize(1.5),
                          }}
                        >
                          {getPercentage(rpFarmlands, tpFarmlands)}
                        </Text>
                      </Center>
                    </Center>
                  </Box>

                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.danger
                            : COLORS.main,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: COLORS.ghostwhite,
                            fontSize: responsiveFontSize(1.5),
                          }}
                        >
                          {tpFarmlands}
                        </Text>
                      </Center>
                    </Center>
                  </Box>
                </Stack>

                <CustomDivider />
                <Text
                  style={{
                    textAlign: "center",
                    color: isPerformanceButtonActive
                      ? COLORS.danger
                      : COLORS.main,
                    fontFamily: "JosefinSans-Bold",
                    paddingTop: 10,
                    fontSize: responsiveFontSize(1.5),
                  }}
                >
                  Distrital ({customUserData?.userDistrict})
                </Text>

                <Stack w="100%" direction="row" space={4} py="2">
                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.danger
                            : COLORS.main,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: COLORS.ghostwhite,
                            fontSize: responsiveFontSize(1.5),
                          }}
                        >
                          {getPercentage(rdFarmlands, tdFarmlands)}
                        </Text>
                      </Center>
                    </Center>
                  </Box>

                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.danger
                            : COLORS.main,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: COLORS.ghostwhite,
                            fontSize: responsiveFontSize(1.5),
                          }}
                        >
                          {tdFarmlands}
                        </Text>
                      </Center>
                    </Center>
                  </Box>
                </Stack>

                <CustomDivider />
                <Text
                  style={{
                    textAlign: "center",
                    color: isPerformanceButtonActive
                      ? COLORS.danger
                      : COLORS.main,
                    fontFamily: "JosefinSans-Bold",
                    paddingTop: 10,
                    fontSize: responsiveFontSize(1.5),
                  }}
                >
                  Individual ({customUserData?.name})
                </Text>

                <Stack w="100%" direction="row" space={4} py="2">
                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.danger
                            : COLORS.main,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: COLORS.ghostwhite,
                            fontSize: responsiveFontSize(1.5),
                          }}
                        >
                          {getPercentage(ruFarmlands, tuFarmlands)}
                        </Text>
                      </Center>
                    </Center>
                  </Box>

                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.danger
                            : COLORS.main,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: COLORS.ghostwhite,
                          }}
                        >
                          {tuFarmlands}
                        </Text>
                      </Center>
                    </Center>
                  </Box>
                </Stack>
              </Stack>
            )}
          </View>
        </View>
      )}

      <UserProfile
        user={user}
        setIsGoalUpdateVisible={setIsGoalUpdateVisible}
        isUserProfileVisible={isUserProfileVisible}
        setIsUserProfileVisible={setIsUserProfileVisible}
      />
      <UserGoalEdit
        isGoalUpdateVisible={isGoalUpdateVisible}
        setIsGoalUpdateVisible={setIsGoalUpdateVisible}
      />
    </SafeAreaView>
  )
}
