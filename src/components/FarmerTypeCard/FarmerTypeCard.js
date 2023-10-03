import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { ImageBackground } from "react-native"
import { ListItem, Avatar, Icon } from "@rneui/themed"
import { View, Text, TouchableOpacity } from "react-native"
import Animated, { LightSpeedOutRight } from "react-native-reanimated"
import COLORS from "../../consts/colors"
import { faRing, faUserTie } from "@fortawesome/free-solid-svg-icons"

export function FarmerTypeCard({ route, item }) {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("FarmersList", { farmerType: item?.farmerType })
      }}
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        width: "100%",
      }}
    >
      {
        <View
          style={{
            marginVertical: 20,
            paddingHorizontal: 5,
            flexDirection: "row",
            paddingVertical: 5,
            width: "100%",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "25%",
            }}
          >
            <View
              style={{
                borderRadius: 100,
                borderWidth: 2,
                borderColor: item?.color,
                padding: 10,
              }}
            >
              <FontAwesomeIcon
                icon={item?.icon}
                size={40}
                color={item?.color}
              />
            </View>
          </View>

          <View
            style={{
              padding: 5,
              width: "75%",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                paddingRight: 5,
              }}
            >
              <View
                style={{
                  width: "85%",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: "JosefinSans-Bold",
                    textAlign: "right",
                    color: item?.color,
                  }}
                  numberOfLines={2}
                  ellipsizeMode={"tail"}
                >
                  {item.title}
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "JosefinSans-Italic",
                    textAlign: "left",
                    color: COLORS.grey,
                  }}
                  numberOfLines={2}
                  ellipsizeMode={"tail"}
                >
                  ({Intl.NumberFormat().format(item?.total)}){" "}
                  {item?.description}
                </Text>
              </View>

              <View
                style={{
                  width: "15%",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <Icon name="arrow-forward-ios" size={25} color={COLORS.grey} />
              </View>
            </View>
          </View>
        </View>
      }
    </TouchableOpacity>
  )
}

export default FarmerTypeCard
