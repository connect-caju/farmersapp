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
import React, { useEffect, useMemo, useRef, useState } from "react"
import { ListItem, Avatar, Icon, SearchBar } from "@rneui/themed"
import { Box, Center, Pressable, Stack } from "native-base"
import { useFocusEffect } from "@react-navigation/native"
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
import Animated, {
  Layout,
  LightSpeedInLeft,
  LightSpeedOutRight,
} from "react-native-reanimated"
import Toast from "react-native-toast-message"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { useNavigation } from "@react-navigation/native"

import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator"
import COLORS from "../../consts/colors"

import { realmContext } from "../../models/realmContext"
import { useUser } from "@realm/react"
import { roles } from "../../consts/roles"
import { useCallback } from "react"
import CustomDivider from "../../components/Divider/CustomDivider"
import { getInitials } from "../../helpers/getInitials"
import { farmerTypes } from "../../consts/farmerTypes"
// import { TextInput } from 'react-native-paper';
const { useRealm, useQuery } = realmContext

function MemberGroupItem({
  item,
  farmerId,
  autoRefresh,
  setAutoRefresh,
  setCountIdOccurrence,
  countIdOccurrence,
  isFarmerAdded,
  setIsFarmerAdded,
  isFarmerRemoved,
  setIsFarmerRemoved,
  farmerName,
}) {
  const realm = useRealm()
  const user = useUser()
  let customUserData = user.customData
  const navigation = useNavigation()

  const currentGroup = realm.objectForPrimaryKey("Group", item?._id)
  const membership = realm
    .objects("ActorMembership")
    .filtered(`actorId == "${farmerId}"`)
  let member

  if (membership.length > 0) {
    member = membership[0]
  }

  const [isFarmerAlreadyAdded, setIsFarmerAlreadyAdded] = useState(false)

  const showRemovedFarmerToast = () => {
    Toast.show({
      type: "removedFarmerFromGroup",
      text1: `Retirada de ${currentGroup?.type}`,
      props: { message: `Retirado de ${currentGroup?.type}.` },
    })
  }

  const showAddedFarmerToast = () => {
    Toast.show({
      type: "addedFarmerToGroup",
      text1: `Adesão a ${currentGroup?.type}`,
      props: { message: `Adicionado a ${currentGroup?.type}.` },
    })
  }
  // remove the farmer from the group
  const removeFarmerFromGroup = (realm, farmerId, currentGroup) => {
    try {
      realm.write(() => {
        // add the unsubscription year
        // let foundMembership = membership[0]?.membership?.find(memb=>memb?.organizationId === currentGroup?._id);
        // foundMembership.unsubscriptionYear = new Date().getFullYear();

        // remove the farmer id from the group
        const updatedFarmerIds = currentGroup.members?.filter(
          (id) => id !== farmerId,
        )
        currentGroup.members = []
        for (let i = 0; i < updatedFarmerIds?.length; i++) {
          currentGroup?.members.push(updatedFarmerIds[i])
        }

        const currentActorMemberships = member?.membership

        // check if there is any membership of this actor
        if (currentActorMemberships && currentActorMemberships?.length > 0) {
          // find the organization object that the actor want to unsubscribe from
          const membershipToDelete = currentActorMemberships.find(
            (memb) => memb.organizationId === currentGroup?._id,
          )
          const index = currentActorMemberships.findIndex(
            (memb) => memb.organizationId === membershipToDelete.organizationId,
          )

          // remove that organization object from
          currentActorMemberships.splice(index, 1)
        }

        //  remove the group object from the farmer membership
        //  if (membership?.length > 0){
        //    let member = membership[0];
        //    const updatedMemberships = member?.membership?.filter((memb)=>(memb?.organizationId !== currentGroup?._id));
        //    member.membership = [];
        //    for (let i = 0; i < updatedMemberships?.length; i++){
        //        member?.membership.push(updatedMemberships[i]);
        //     }

        //   }
        setAutoRefresh(!autoRefresh)
        setIsFarmerRemoved(true)
      })
    } catch (error) {
      console.log("The farmer could not be deleted from the group!")
    }
  }

  // add the farmer to the group
  const addFarmerToGroup = (realm, farmerId, currentGroup) => {
    try {
      realm.write(async () => {
        // add the farmer id to the group
        currentGroup?.members.push(farmerId)

        //  update the actor membership
        // in case they membership is already created
        // the the group object to the farmer membership
        if (membership?.length > 0) {
          let member = membership[0]
          member.membership.push({
            subscriptionYear: new Date().getFullYear(),
            unsubscriptionYear: null,
            organizationId: currentGroup?._id,
          })
        } else {
          // create the actor member from scratch
          const actorMembershipObject = {
            _id: uuidv4(),
            actorId: farmerId,
            actorName: farmerName,
            membership: [
              {
                subscriptionYear: new Date().getFullYear(),
                unsubscriptionYear: null,
                organizationId: currentGroup?._id,
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
        setAutoRefresh(!autoRefresh)
        setIsFarmerAdded(true)
      })
    } catch (error) {
      console.log("The farmer could not be added to the group!", {
        cause: error,
      })
    }
  }

  // call this every time the currentGroup object changes
  useEffect(() => {
    // if the farmer is already added to this group
    // then, set the state to true, else set the state to false
    if (currentGroup.members?.find((id) => id === farmerId)) {
      setIsFarmerAlreadyAdded(true)
    } else {
      setIsFarmerAlreadyAdded(false)
    }
  }, [currentGroup])

  return (
    <View
      // exiting={LightSpeedOutRight}
      style={{
        paddingHorizontal: 10,
        marginVertical: 10,
        minHeight: 60,
        width: "95%",
        flex: 1,
        alignSelf: "center",
        backgroundColor: COLORS.ghostwhite,
        elevation: 3,
        opacity: 1,
      }}
    >
      <Stack direction="row" w="100%">
        <Box
          w="10%"
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (!currentGroup.members?.find((id) => id === farmerId)) {
                // add the actor as one of member of this group
                addFarmerToGroup(realm, farmerId, currentGroup)

                // show the sucess (for adding farmer to the group) toast message
                showAddedFarmerToast()
              } else {
                removeFarmerFromGroup(realm, farmerId, currentGroup)
                // show the error (for removing farmer from the group) toast message
                showRemovedFarmerToast()
              }
              // reset the counter to zero
              setCountIdOccurrence(0)
            }}
          >
            {isFarmerAlreadyAdded ? (
              <Icon name="check-box" size={30} color={COLORS.main} />
            ) : (
              <Icon name="add-box" size={30} color={COLORS.lightgrey} />
            )}
          </TouchableOpacity>
        </Box>

        <Box w="80%">
          <TouchableOpacity
            onPress={() => {
              if (!currentGroup.members?.find((id) => id === farmerId)) {
                // add the actor as one of member of this group
                addFarmerToGroup(realm, farmerId, currentGroup)

                // show the sucess (for adding farmer to the group) toast message
                showAddedFarmerToast()
              } else {
                removeFarmerFromGroup(realm, farmerId, currentGroup)
                // show the error (for removing farmer from the group) toast message
                showRemovedFarmerToast()
              }
              // reset the counter to zero
              setCountIdOccurrence(0)
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: "JosefinSans-Bold",
                color: isFarmerAlreadyAdded ? COLORS.main : COLORS.black,
                paddingLeft: 10,
              }}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {item?.type}: {item?.name}
            </Text>
            {/* <Text
           style={{
            fontSize: 14,
            fontFamily: 'JosefinSans-Regular',
            color: COLORS.black,
            paddingLeft: 10,

           }}
           numberOfLines={1}
           ellipsizeMode={'tail'}
           >
            {item?.type === 'Cooperativa' ? 'Presidente' : 'Representante'}: {item?.manager?.fullname}
          </Text> */}
            <Stack direction="row" w="100%">
              <Box w="50%">
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                    color: COLORS.grey,
                    paddingLeft: 10,
                  }}
                >
                  Declarados: {item?.numberOfMembers.total}
                </Text>
              </Box>
              <Box w="50%">
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                    color: isFarmerAlreadyAdded ? COLORS.main : COLORS.grey,
                    paddingLeft: 10,
                  }}
                >
                  Registados: {item?.members?.length}
                </Text>
              </Box>
            </Stack>
          </TouchableOpacity>
        </Box>
        <Box
          w="10%"
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <TouchableOpacity
            disabled={isFarmerAlreadyAdded ? false : true}
            onPress={() => {
              navigation.navigate("GroupMembers", {
                groupId: item._id,
              })
            }}
          >
            <Icon
              name="arrow-forward-ios"
              size={20}
              color={isFarmerAlreadyAdded ? COLORS.main : COLORS.lightgrey}
            />
          </TouchableOpacity>
        </Box>
      </Stack>
    </View>
  )
}

export default function MembershipScreen({ route, navigation }) {
  const realm = useRealm()
  const user = useUser()
  let customUserData = user.customData
  const farmerId = route?.params?.resourceId // get the farmer id from the previous screen

  const groups = realm
    .objects("Group")
    .filtered("userDistrict == $0", customUserData?.userDistrict)
  const farmer = realm.objectForPrimaryKey("Actor", farmerId)
  // const [loadingActivitiyIndicator, setLoadingActivityIndicator] = useState(false);
  const [groupsList, setGroupsList] = useState([])
  const [isEndReached, setIsEndReached] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [isFarmerAdded, setIsFarmerAdded] = useState(false)
  const [isFarmerRemoved, setIsFarmerRemoved] = useState(false)

  // all IDs of farmers whom have already been registered in any of the groups.
  // this array of ids helps check whether the current farmer is already regitered in any of the groups
  const [countIdOccurrence, setCountIdOccurrence] = useState(0)
  // search an organization (group)

  const [searchQuery, setSearchQuery] = useState("")
  // const [selectedId, setSelectedId] = useState(null);
  const [isSearching, setIsSearching] = useState(false)

  // const filtererdItems = groupsList.filter((item)=>{
  //  return ((item.type.toLowerCase().includes(searchQuery.toLowerCase())) || (item.name.toLowerCase().includes(searchQuery.toLowerCase())))
  // });

  const computedItems = useMemo(() => {
    let result = []
    if (searchQuery) {
      result = groups.filter((item) => {
        return (
          item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    } else {
      result = groups
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
    // this turn the fetched realm group into a iterable data structure
    // of which items are group objects with customized properties
    //   setGroupsList(groups?.map((group)=>{
    //    return group;
    //  }));

    //  if (groupsList.length > 0){
    // reset the counter to zero before new countings
    // setCountIdOccurrence(0);
    groups.map((group) => {
      if (group.members.indexOf(farmerId) >= 0) {
        setCountIdOccurrence((prev) => prev + 1)
      }
    })
    //  }
  }, [autoRefresh])

  const keyExtractor = (item, index) => index.toString()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingBottom: 100,
        backgroundColor: "ghostwhite",
      }}
    >
      <View>
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
                      ownerId: farmerId,
                      farmerType: farmerTypes.farmer,
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
                  placeholder="Procurar "
                  placeholderTextColor={COLORS.lightgrey}
                  style={{
                    width: "100%",
                    backgroundColor: "white", //COLORS.ghostwhite,
                    borderRadius: 30,
                    color: COLORS.grey,
                    fontFamily: "JosefinSans-Regular",
                    borderWidth: 1,
                    textAlign: "left",
                    paddingLeft: 20,
                    fontSize: 16,
                    borderColor: "white", //COLORS.lightgrey,
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
                        ellipsizeMode={"tail"}
                      >
                        {`${farmer?.names?.otherNames} ${farmer?.names?.surname}`}
                      </Text>
                      <Text
                        style={{
                          color:
                            countIdOccurrence === 0 ? COLORS.red : COLORS.main,
                          fontSize: 14,
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        {countIdOccurrence === 0
                          ? "Marca a organização"
                          : `aderiu a ${countIdOccurrence} ${
                              countIdOccurrence === 1
                                ? "organização"
                                : "organizações"
                            }`}
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
            marginTop: 20,
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
              // groupsList
              // filtererdItems
              computedItems
            }
            keyExtractor={keyExtractor}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            renderItem={({ item }) => {
              return (
                <MemberGroupItem
                  autoRefresh={autoRefresh}
                  setAutoRefresh={setAutoRefresh}
                  item={item}
                  farmerId={farmerId}
                  countIdOccurrence={countIdOccurrence}
                  setCountIdOccurrence={setCountIdOccurrence}
                  isFarmerAdded={isFarmerAdded}
                  setIsFarmerAdded={setIsFarmerAdded}
                  isFarmerRemoved={isFarmerRemoved}
                  setIsFarmerRemoved={setIsFarmerRemoved}
                  farmerName={`${farmer?.names?.otherNames} ${farmer?.names?.surname}`}
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
                    {isLoading ? <CustomActivityIndicator /> : null}
                  </Box>
                )
              }
              return null
            }}
          />
        </Box>

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
