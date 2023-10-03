import React, { useCallback, useEffect, useState } from "react"
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native"
import { Stack, Box, Center } from "native-base"
import { Icon } from "@rneui/base"
import AwesomeAlert from "react-native-awesome-alerts"

import CustomDivider from "../Divider/CustomDivider"

import { realmContext } from "../../models/realmContext"
import { updateCoordinates } from "../../helpers/updateCoordinates"
import COLORS from "../../consts/colors"
const { useRealm, useObject, useQuery } = realmContext

let FLAG = false

const CoordinatesItem = ({ item, farmland }) => {
  const realm = useRealm()

  const [deleteAlert, setDeleteAlert] = useState(false)

  const onDeletePoint = () => {
    if (item.icon === "delete-forever") {
      realm.write(() => {
        farmland.extremeCoordinates.pop()
      })
    }
  }

  if (FLAG) {
    onDeletePoint()
    FLAG = false
    return
  }

  return (
    <Center>
      <View
        style={{
          padding: 10,
          marginVertical: 10,
          marginHorizontal: 10,
          borderColor: "#005000",
          width: "98%",
          flex: 1,
          shadowColor: "#005000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 3,
          opacity: 1,
        }}
      >
        <AwesomeAlert
          show={deleteAlert}
          showProgress={false}
          title={"Coordenadas do Ponto"}
          message={"Apagar as coordenados deste ponto!"}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Não Apagar"
          confirmText="   Apagar   "
          cancelButtonColor="#005000"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            setDeleteAlert(false)
          }}
          onConfirmPressed={() => {
            setDeleteAlert(false)
            FLAG = true
          }}
        />

        <Stack direction="row" w="100%">
          <Box
            w="20%"
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontFamily: "JosefinSans-Bold",
                fontSize: 20,
              }}
            >
              P{item?.position}
            </Text>
          </Box>
          <Box w="60%">
            <Stack direction="row">
              <Box>
                <Text
                  style={{
                    color: "#000",
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  Latitude:{"  "}
                </Text>
                <Text
                  style={{
                    color: "#000",
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  Longitude:{"  "}
                </Text>
              </Box>
              <Box>
                <Text
                  style={{
                    color: "#000",
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  {item?.latitude}
                </Text>
                <Text
                  style={{
                    color: "#000",
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  {item?.longitude}
                </Text>
              </Box>
            </Stack>
          </Box>
          <Box w="20%" alignItems={"center"}>
            <Box
              w="50%"
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                disabled={item?.icon === "check-circle" ? true : false}
                onPress={() => {
                  if (item.icon === "delete-forever") {
                    setDeleteAlert(true)
                  }
                }}
              >
                <Icon
                  name={item.icon}
                  size={25}
                  color={item.icon === "check-circle" ? COLORS.main : "red"}
                />
              </TouchableOpacity>
            </Box>
          </Box>
        </Stack>
      </View>
    </Center>
  )
}

export default CoordinatesItem
