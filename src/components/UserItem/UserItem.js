import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { Overlay, Icon, Button } from "@rneui/base"
import { Box, CheckIcon, FormControl, Select, Stack } from "native-base"
import { v4 as uuidv4 } from "uuid"

import { CustomInput } from "../Inputs/CustomInput"
import COLORS from "../../consts/colors"
// import CustomDivider from "../Divider/CustomDivider";

import { useUser } from "@realm/react"
import { realmContext } from "../../models/realmContext"
const { useRealm, useQuery, useObject } = realmContext

export default function UserItem({ userItem }) {
  const [targetFarmers, setTargetFarmers] = useState("")
  const [targetFarmlands, setTargetFarmlands] = useState("")
  const [userStats, setUserStats] = useState({})
  const [update, setUpdate] = useState(false)
  const [reset, setReset] = useState(false)
  const [errors, setErrors] = useState({})

  const user = useUser()
  const customUserData = user?.customData
  const realm = useRealm()

  const userStat = useQuery("UserStat").filtered(
    "userId == $0",
    userItem?.userId,
  )[0]

  // updating user goal
  const updateUserGoal = useCallback(
    (newTargetFarmers, newTargetFarmlands) => {
      if (
        Number.isInteger(parseInt(newTargetFarmers)) &&
        Number.isInteger(parseInt(newTargetFarmlands))
      ) {
        const tFarmers = parseInt(newTargetFarmers)
        const tFarmlands = parseInt(newTargetFarmlands)

        if (userStat) {
          realm.write(() => {
            userStat.targetFarmers = tFarmers
            userStat.targetFarmlands = tFarmlands
            userStat.modifiedAt = new Date()
            userStat.modifiedBy = customUserData?.name
          })
        } else {
          realm.write(() => {
            const newStat = realm.create("UserStat", {
              _id: uuidv4(),
              userName: userItem.name,
              userId: userItem.userId,
              userDistrict: userItem.userDistrict,
              userProvince: userItem.userProvince,
              targetFarmers: tFarmers,
              targetFarmlands: tFarmlands,
              modifiedBy: customUserData?.name,
            })
          })
        }
      } else {
        setErrors({
          errorMessage: "Número inválido!",
        })
      }
    },
    [realm, userItem],
  )

  useEffect(() => {
    if (!userStat) {
      setTargetFarmers(0)
      setTargetFarmlands(0)
    } else {
      setTargetFarmers(userStat.targetFarmers)
      setTargetFarmlands(userStat.targetFarmlands)
    }
  }, [userStat])

  useEffect(() => {
    if (
      parseInt(targetFarmers) > 0 &&
      (parseInt(targetFarmlands) <= parseInt(targetFarmers) ||
        !parseInt(targetFarmlands))
    ) {
      setTargetFarmlands(targetFarmers)
    }
  }, [targetFarmers])

  return (
    <Box
      style={{
        flex: 1,
        backgroundColor: COLORS.ghostwhite,
        marginVertical: 10,
        paddingVertical: 4,
        paddingHorizontal: 5,
        borderColor: "#005000",
        shadowColor: "#005000",
        shadowOffset: {
          width: 2,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 3,
        opacity: 1,
      }}
    >
      <Stack key={userItem?.userId} w="100%" direction="row" space={1}>
        <Box
          w="40%"
          style={{
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "JosefinSans-Bold",
              fontSize: 14,
              color: COLORS.black,
            }}
          >
            {userItem?.name}
          </Text>
        </Box>
        <Box
          w="20%"
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FormControl isRequired my="1" isInvalid={"errorMessage" in errors}>
            <CustomInput
              width="90%"
              keyboardType="numeric"
              textAlign="center"
              isDisabled={!update}
              placeholder={`${targetFarmers}`}
              value={targetFarmers}
              onChangeText={(newNumber) => {
                setErrors((prev) => ({
                  ...prev,
                  errorMessage: "",
                }))
                setTargetFarmers(newNumber)
                setReset(false)
                setUpdate(true)
              }}
            />
          </FormControl>
        </Box>

        <Box
          w="20%"
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FormControl isRequired my="1" isInvalid={"errorMessage" in errors}>
            <CustomInput
              width="90%"
              keyboardType="numeric"
              textAlign="center"
              isDisabled={!update}
              placeholder={`${targetFarmlands}`}
              value={targetFarmlands}
              onChangeText={(newNumber) => {
                setErrors((prev) => ({
                  ...prev,
                  errorMessage: "",
                }))
                setTargetFarmlands(newNumber)
                setReset(false)
                setUpdate(true)
              }}
            />
          </FormControl>
        </Box>

        <Box
          w="20%"
          style={{
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (!update && !reset) {
                setUpdate(!update)
                setReset(true)
                setTargetFarmers("")
                setTargetFarmlands("")
              } else if (reset) {
                setUpdate(false)
                setReset(false)
                setTargetFarmers(
                  userStat.targetFarmers ? userStat.targetFarmers : 0,
                )
                setTargetFarmlands(
                  userStat.targetFarmlands ? userStat.targetFarmlands : 0,
                )
              } else {
                updateUserGoal(targetFarmers, targetFarmlands)
                setUpdate(!update)
              }
            }}
          >
            <Icon
              name={
                !update && !reset ? "mode-edit" : reset ? "restore" : "save"
              }
              size={25}
              color={COLORS.main}
            />
          </TouchableOpacity>
        </Box>
      </Stack>
      {errors.errorMessage && (
        <Text
          style={{
            color: COLORS.red,
            fontSize: 12,
            textAlign: "center",
          }}
        >
          {errors.errorMessage}
        </Text>
      )}
    </Box>
  )
}
