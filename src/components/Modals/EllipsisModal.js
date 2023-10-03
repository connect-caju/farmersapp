import React, { useEffect, useState, useCallback } from "react"
import {
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Text,
  ScrollView,
  InteractionManager,
  SafeAreaView,
  FlatList,
} from "react-native"
import { Box, FormControl, Stack } from "native-base"
import { Divider, Icon } from "@rneui/base"
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native"
import { v4 as uuidv4 } from "uuid"
import { useFocusEffect } from "@react-navigation/native"
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

import CustomDivider from "../../components/Divider/CustomDivider"
import COLORS from "../../consts/colors"
import EditData from "../EditData/EditData"
import EditFarmerData from "../EditData/EditFarmerData"
import { errorMessages } from "../../consts/errorMessages"
import { roles } from "../../consts/roles"
import ConfirmData from "../EditData/ConfirmData"
import { useNavigation } from "@react-navigation/native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"

import { useUser } from "@realm/react"
import { realmContext } from "../../models/realmContext"
import AwesomeAlert from "react-native-awesome-alerts"
import { resourceValidation } from "../../consts/resourceValidation"
import validateInvalidationMessage from "../../helpers/validateInvalidationMessage"
import CustomActivityIndicator from "../ActivityIndicator/CustomActivityIndicator"
const { useRealm, useQuery, useObject } = realmContext

export default function EllipsisModal({ route }) {
  const [isEllipsisVisible, settIsEllipsisVisible] = useState(false)
  // ---------------------------------------------------------------

  const handleEllipsisOptions = (option) => {
    console.log(`selected option: ${option}`)
    settIsEllipsisVisible(false)
  }

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#f2f2f2",
      }}
    >
      <Modal
        visible={isEllipsisVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => settIsEllipsisVisible(false)}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <TouchableOpacity onPress={() => handleEllipsisOptions("Aderir")}>
            <Text>Aderir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEllipsisOptions("Ver")}>
            <Text>Ver</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}
