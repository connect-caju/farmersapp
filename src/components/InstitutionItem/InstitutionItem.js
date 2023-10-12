/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { TouchableOpacity, View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Avatar, Icon } from "@rneui/themed";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  responsiveFontSize,
} from "react-native-responsive-dimensions";

import { Box, Center, Stack } from "native-base";
import { getInitials } from "../../helpers/getInitials";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../consts/colors";
import { resourceValidation } from "../../consts/resourceValidation";

const InstitutionItem = ({ item, route }) => {
  const navigation = useNavigation();
  const [farmlandStatus, setFarmlandStatus] = useState("");

  useEffect(() => {
    if (item?.farmlandsList?.length > 0) {
      if (
        item?.farmlandsList.some(
          (farmland) =>
            farmland.status === resourceValidation.status.invalidated,
        )
      ) {
        setFarmlandStatus(resourceValidation.status.invalidated);
      } else if (
        item?.farmlandsList.some(
          (farmland) => farmland.status === resourceValidation.status.pending,
        )
      ) {
        setFarmlandStatus(resourceValidation.status.pending);
      } else {
        setFarmlandStatus(resourceValidation.status.validated);
      }
    } else {
      // setFarmlandStatus(resourceValidation.status.invalidated);
    }
  }, [item]);

  return (
    <View
      style={{
        paddingHorizontal: 8,
        marginVertical: 5,
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: 20,
          right: 5,
          zIndex: 1,
        }}
      >
        <Icon
          name={
            item?.status === resourceValidation.status.pending
              ? "pending-actions"
              : item?.status === resourceValidation.status.validated
                ? "check-circle"
                : "dangerous"
          }
          size={15}
          color={
            item?.status === resourceValidation.status.pending
              ? COLORS.danger
              : item?.status === resourceValidation.status.validated
                ? COLORS.main
                : COLORS.red
          }
        />
      </Box>
      <Stack direction="row" w="100%">
        <Center w="15%" m="2">
          <Avatar
            size={wp("16%")}
            rounded
            title={item.imageAlt}
            containerStyle={{ backgroundColor: COLORS.grey }}
            source={{ uri: item.image }}
          />
        </Center>
        <Box w="80%" pt="3">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile", {
                ownerId: item._id,
                farmersIDs: item?.farmersIDs,
                farmerType: "Instituição",
              });
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "JosefinSans-Bold",
                color: COLORS.black,
              }}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {item?.name}
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "JosefinSans-Italic",
                  color: COLORS.black,
                }}
              >
                {" "}
                ({item?.type === "Outra" ? "Instituição" : item?.type})
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "JosefinSans-Italic",
                color: item.farmlands === 0 ? COLORS.danger : COLORS.grey,

              }}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {item.farmlands === 0 ? "(Sem pomar ainda)" : item.farmlands === 1 ? `(Possui ${item.farmlands} pomar)` : `(Possui ${item.farmlands} pomares)`}
            </Text>
            <Text
              style={{
                textAlign: "right",
                color: COLORS.grey,
                fontFamily: "JosefinSans-Italic",
                fontSize: 12,
              }}
            >
              Registo: {item.createdAt} por {item.user}
            </Text>
            {/* <Stack direction="column">
              <Stack direction="row"> */}
            {/* <Box w="100%" style={{}}>
                  <Stack direction="row">
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.7),
                        fontFamily: "JosefinSans-Italic",
                      }}
                      numberOfLines={1}
                      ellipsizeMode={"tail"}
                    >
                      Responsável: {item.manager}
                    </Text>
                  </Stack>

                  <Stack direction="row">
                    <Box w="50%">
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.7),
                          fontFamily: "JosefinSans-Italic",
                        }}
                      >
                        Tel: {item.phone}
                      </Text>
                    </Box>
                    <Box
                      style={{
                        flexDirection: "row",
                        // borderWidth: 1,
                        borderRadius: 20,
                        borderColor:
                          farmlandStatus === resourceValidation.status.pending
                            ? COLORS.danger
                            : farmlandStatus ===
                              resourceValidation.status.validated
                              ? COLORS.main
                              : COLORS.red,
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.7),
                          fontFamily: "JosefinSans-Italic",
                          marginHorizontal: 2,
                          paddingHorizontal: 5,
                        }}
                      >
                        Pomares: {item.farmlands}
                      </Text>
                      <Icon
                        name={
                          farmlandStatus === resourceValidation.status.pending
                            ? "pending-actions"
                            : farmlandStatus ===
                              resourceValidation.status.validated
                              ? "check-circle"
                              : item?.farmlands === 0
                                ? "error-outline"
                                : "dangerous"
                        }
                        size={wp("6%")}
                        color={
                          farmlandStatus === resourceValidation.status.pending
                            ? COLORS.danger
                            : farmlandStatus ===
                              resourceValidation.status.validated
                              ? COLORS.main
                              : COLORS.red
                        }
                      />
                    </Box>
                    <Box w="5%"></Box>
                  </Stack>
                </Box> */}
            {/* </Stack>
            </Stack> */}
          </TouchableOpacity>
        </Box>
      </Stack>

      {/* <Stack
        direction="row"
        w="100%"
      >
        <Box w="100%">
          <Text
            style={{
              textAlign: "right",
              color: COLORS.grey,
              fontFamily: "JosefinSans-Italic",
              fontSize: responsiveFontSize(1.5),
            }}
          >
            Registo: {item.createdAt} por {item.user}
          </Text>
        </Box>
      </Stack> */}
    </View>
  );
};

export default InstitutionItem;
