/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
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
  TextInput,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
  Platform,
} from "react-native"
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { ListItem, Avatar, Icon, SearchBar } from "@rneui/themed"
import { Box, Center, Pressable, Stack } from "native-base"
import { useFocusEffect } from "@react-navigation/native"
import { v4 as uuidv4 } from "uuid"
import {
  KeyboardAwareScrollView,
  useMaskedTextInput,
} from "react-native-keyboard-tools"

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
import Animated, {
  Layout,
  LightSpeedInLeft,
  LightSpeedOutRight,
} from "react-native-reanimated"
import Toast from "react-native-toast-message"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator"
import COLORS from "../../consts/colors"

import { realmContext } from "../../models/realmContext"
import { useUser } from "@realm/react"
import { roles } from "../../consts/roles"
import CustomDivider from "../../components/Divider/CustomDivider"
import { getInitials } from "../../helpers/getInitials"
import GroupRepresentativeItem from "../../components/GroupRepresentativeItem/GroupRepresentativeItem"
import { farmerTypes } from "../../consts/farmerTypes"
const { useRealm, useQuery } = realmContext

export default function GroupRepresentativeScreen({ route, navigation }) {
  const realm = useRealm()
  const user = useUser()
  let customUserData = user.customData
  const { groupId, district } = route?.params // get the group id and district from the previous screen
  let farmers = []
  farmers = realm.objects("Actor").filtered("userDistrict == $0", district)

  //  const farmers = realm.objects('Actor').filtered("userDistrict == $0", district);
  const group = realm.objectForPrimaryKey("Group", groupId)
  const [isEndReached, setIsEndReached] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false)

  let thisActorMembership = []

  //  the id of the farmer who is selected as group representative
  const [selectedId, setSelectedId] = useState(null)
  const [actorMembership, setActorMembership] = useState(null)

  const [isSearching, setIsSearching] = useState(false)

  // all IDs of farmers whom have already been registered in any of the groups.
  // this array of ids helps check whether the current farmer is already regitered in any of the groups
  const [countIdOccurrence, setCountIdOccurrence] = useState(0)

  const [searchQuery, setSearchQuery] = useState("")

  const computedItems = useMemo(() => {
    let result = []
    if (searchQuery) {
      result = farmers.filter((item) => {
        return (
          item.names.otherNames
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.names.surname.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    } else {
      result = farmers
      // .filter((item)=>{
      //   return ((item.names.otherNames.toLowerCase().includes(searchQuery.toLowerCase())) || (item.names.surname.toLowerCase().includes(searchQuery.toLowerCase())))
      // });
    }
    return result
  }, [searchQuery])

  const handleEndReached = () => {
    if (!isEndReached) {
      setIsLoading(true)
      setTimeout(() => {}, 2000)

      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedId) {
      thisActorMembership = realm
        .objects("ActorMembership")
        .filtered("actorId == $0", selectedId)

      if (thisActorMembership?.length > 0) {
        setActorMembership(thisActorMembership[0])
      }
    }
  }, [selectedId])

  const updateGroupManager = useCallback(() => {
    realm.write(async () => {
      if (selectedId) {
        // update the group manager
        group.manager = selectedId
      }
      // add the manager to the group in case is not yes a member
      if (
        selectedId &&
        !group.members.find((memberId) => memberId === selectedId)
      ) {
        group.members.push(selectedId)
      }

      // update this actor membership to the group is appointed as representative
      if (
        thisActorMembership.length > 0 &&
        !thisActorMembership[0].membership.find(
          (membership) => membership?.organizationId === groupId,
        )
      ) {
        thisActorMembership[0]?.membership.push({
          subscriptionYear: new Date().getFullYear(),
          organizationId: groupId,
        })
      } else {
        // find the farmer to extract actorName from
        const foundFarmer = farmers?.find(
          (farmer) => farmer?._id === selectedId,
        )

        // create the actor member from scratch
        const actorMembershipObject = {
          _id: uuidv4(),
          actorId: selectedId,
          actorName: `${foundFarmer?.names?.otherNames} ${foundFarmer?.names?.surname}`,
          membership: [
            {
              subscriptionYear: new Date().getFullYear(),
              organizationId: groupId,
            },
          ],

          userName: customUserData?.name,
          userId: customUserData?.userId,
          userDistrict: customUserData?.userDistrict,
          userProvince: customUserData?.userProvince,
        }

        const actorMembership = await realm.create(
          "ActorMembership",
          actorMembershipObject,
        )
      }
    })
  }, [selectedId])

  useEffect(() => {
    // update the group manager property
    if (selectedId) {
      updateGroupManager()
    }
  }, [selectedId])

  const keyExtractor = (item, index) => index.toString()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        //  paddingBottom: 0,
        backgroundColor: COLORS.white,
      }}
    >
      <View style={{}}>
        <View
          style={{
            width: "100%",
            height: 50,
            paddingHorizontal: wp("3%"),
            // paddingTop: 5,
            backgroundColor: "#EBEBE4",
            borderTopWidth: 0,
            borderColor: "#EBEBE4",
            borderBottomWidth: 3,
            borderLeftWidth: 3,
            borderRightWidth: 3,
            //  marginBottom: 20,
          }}
        >
          <Stack direction="row" w="100%">
            <Box w="10%">
              <Pressable
                onPress={() => {
                  if (isSearching) {
                    setIsSearching(false)
                    setSearchQuery("")
                  } else {
                    navigation.navigate("Profile", {
                      ownerId: group._id,
                      farmerType: farmerTypes.group,
                      farmersIDs: [],
                    })
                  }
                }}
                style={{
                  position: "absolute",
                  left: -10,
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
            </Box>
            <Box
              w="90%"
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isSearching ? (
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
              ) : (
                <Box w="100%">
                  <Box
                    w="100%"
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Box
                      w="80%"
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.black,
                          fontSize: 15,
                          fontFamily: "JosefinSans-Bold",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {`${group?.name}`}
                      </Text>
                      <Text
                        style={{
                          color:
                            countIdOccurrence === 0 ? COLORS.red : COLORS.main,
                          fontSize: 14,
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        {!group?.manager && group?.type === "Cooperativa"
                          ? "Indicar o Presidente"
                          : !group?.manager && group?.type !== "Cooperativa"
                          ? "Indicar o Representante"
                          : group?.manager && group?.type === "Cooperativa"
                          ? "Mudar de Presidente"
                          : "Mudar de Representante"}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            {!isSearching && (
              <Box
                w="10%"
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setIsSearching(!isSearching)
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    size={28}
                    color={COLORS.main}
                    rotation={90}
                  />
                </TouchableOpacity>
              </Box>
            )}
          </Stack>
        </View>

        <Box
          alignItems="stretch"
          w="100%"
          style={{
            marginBottom: 50,
            // marginTop: 20,
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
            data={
              // filtererdItems
              computedItems
              // farmers
              // ?.length > 0 ? computedItems : filtererdItems
            }
            keyExtractor={keyExtractor}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            // ItemSeparatorComponent={()=><CustomDivider thickness={2} />}
            renderItem={({ item }) => {
              const isSelected = item._id === selectedId
              return (
                <GroupRepresentativeItem
                  item={item}
                  isSelected={isSelected}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                />
              )
            }}
            ListFooterComponent={() => {
              if (!isEndReached) {
                return (
                  <Box
                    style={{
                      // height: 10,
                      backgroundColor: COLORS.ghostwhite,
                      // paddingBottom: 45,
                      marginBottom: 180,
                    }}
                  >
                    {/* { isLoading ? (<CustomActivityIndicator />) : null } */}
                  </Box>
                )
              }
              return null
            }}
          />
        </Box>
        {/* } */}

        {computedItems.length === 0 &&
          searchQuery.length > 0 &&
          isSearching && (
            <Box
              style={{
                flex: 1,
                position: "absolute",
                top: 100,
                alignSelf: "center",
              }}
            >
              <Icon name="info-outline" color={COLORS.grey} size={30} />
              <Text
                style={{
                  color: COLORS.grey,
                  fontSize: 14,
                  fontFamily: "JosefinSans-Regular",
                }}
              >
                Não encontrado
              </Text>
            </Box>
          )}
      </View>
    </SafeAreaView>
  )
}
