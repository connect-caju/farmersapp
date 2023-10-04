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

import { useNavigation } from "@react-navigation/native";
import { user } from "../../consts/user";

import { realmContext } from "../../models/realmContext";
import COLORS from "../../consts/colors";
const { useRealm, useObject, useQuery } = realmContext;

export default function ClientResetModal({
  isVisible,
  isManualResetConfirmed,
  setIsManualResetConfirmed,
}) {
  return (
    <Modal
      isVisible={isVisible}
      supportedOrientations={["portrait", "landscape"]}
      propagateSwipe
      animationIn={"zoomIn"}
      animationInTiming={600}
      animationOut={"zoomOut"}
      hideModalContentWhileAnimating={true}
      swipeThreshold={1000}
    >
      <View>
        <View
          style={{
            width: "70%",
            height: 50,
            flexDirection: "row",
            backgroundColor: COLORS.dark,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <View style={{ width: "100%" }}>
            <Text
              style={{
                fontFamily: "JosefinSans-Bold",
                fontSize: 18,
                color: COLORS.ghostwhite,
                paddingTop: 15,
                textAlign: "center",
              }}
            >
              Sincronização Manual
            </Text>
          </View>
          <View>
            <Text></Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
