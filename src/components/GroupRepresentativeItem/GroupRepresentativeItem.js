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
import React, { useEffect, useRef, useState, useCallback } from "react"
import { ListItem, Avatar, Icon, SearchBar } from "@rneui/themed"
import { Box, Center, Pressable, Stack } from "native-base"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
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

// import CustomActivityIndicator from '../../components/ActivityIndicator/CustomActivityIndicator';
import COLORS from "../../consts/colors"

import { realmContext } from "../../models/realmContext"
import { useUser } from "@realm/react"
import { farmerTypes } from "../../consts/farmerTypes"

const { useRealm, useQuery } = realmContext

export default function GroupRepresentativeItem({
  item,
  isSelected,
  setSelectedId,
  selectedId,
}) {
  const navigation = useNavigation()

  const showAddedGroupManagerToast = () => {
    Toast.show({
      type: "addedGroupManager",
      text1: "Representação da organização",
      props: { message: "Adicionado o Representante." },
    })
  }

  return (
    <View
      // exiting={LightSpeedOutRight}
      style={{
        paddingHorizontal: 2,
        marginVertical: 10,
        minHeight: 60,
        width: "95%",
        alignSelf: "center",
        flex: 1,
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
              if (selectedId !== item._id) {
                setSelectedId(item._id)
                showAddedGroupManagerToast()
              }
            }}
          >
            {isSelected ? (
              <Icon name="radio-button-on" size={30} color={COLORS.main} />
            ) : (
              <Icon name="radio-button-off" size={30} color={COLORS.grey} />
            )}
          </TouchableOpacity>
        </Box>

        <Box w="80%">
          <TouchableOpacity
            onPress={() => {
              if (selectedId !== item._id) {
                setSelectedId(item._id)
                showAddedGroupManagerToast()
              }
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: "JosefinSans-Bold",
                color: COLORS.black,
                paddingLeft: 10,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.names?.otherNames} {item?.names?.surname}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "JosefinSans-Regular",
                color: COLORS.grey,
                paddingLeft: 10,
              }}
            >
              {item?.address?.adminPost}
            </Text>
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
            onPress={() => {
              navigation.navigate("Profile", {
                ownerId: item._id,
                farmerType: farmerTypes.farmer,
                farmersIDs: [],
              })
            }}
          >
            <Icon
              name="arrow-forward-ios"
              size={20}
              color={isSelected ? COLORS.main : COLORS.lightgrey}
            />
          </TouchableOpacity>
        </Box>
      </Stack>
    </View>
  )
}
