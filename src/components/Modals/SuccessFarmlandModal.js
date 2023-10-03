import { useNavigation } from "@react-navigation/native"
import { Center, Alert, Stack, Box } from "native-base"
import React, { useState } from "react"
import { Button, Text, View, Modal, Pressable } from "react-native"
// import Modal from "react-native-modal";

function SuccessFarmlandModal({
  isCoordinatesModalVisible,
  setIsCoordinatesModalVisible,
  farmlandId,
}) {
  const navigation = useNavigation()

  return (
    <Modal
      animationType="slide"
      visible={isCoordinatesModalVisible}
      onRequestClose={() => setIsCoordinatesModalVisible(false)}
    >
      <View
        style={{
          flex: 1,
          marginTop: 80,
          alignItems: "center",
        }}
      >
        <Alert max="100%" status="success" my={2} bg="ghostwhite">
          <Stack direction="column" space={10} py="6" mh="10" w="100%">
            <Box alignItems={"center"}>
              <Alert.Icon size={120} />
            </Box>
            <View>
              <Text
                style={{
                  fontFamily: "JosefinSans-Regula",
                  color: "#005000",
                  fontSize: 18,
                }}
              >
                Registo do pomar ocorrido com successo!
              </Text>
            </View>
          </Stack>
        </Alert>
        <Stack direction="row" space={4} w="100%" pt="10">
          <Box w="50%" alignItems={"center"} style={{ marginLeft: 10 }}>
            <Pressable
              onPress={() => {
                navigation.goBack()
                setIsCoordinatesModalVisible(false)
              }}
            >
              <Text
                style={{
                  fontFamily: "JosefinSans-Regular",
                  color: "red",
                  fontSize: 18,
                  marginLeft: 15,
                }}
              >
                Terminar
              </Text>
            </Pressable>
          </Box>
          <Box
            w="50%"
            // alignItems={'center'}
          >
            <Pressable
              onPress={() => {
                navigation.goBack()
                setIsCoordinatesModalVisible(false)
              }}
            >
              <Text
                style={{
                  fontFamily: "JosefinSans-Regular",
                  color: "#005000",
                  fontSize: 18,
                  marginRight: 15,
                }}
              >
                Auditar a área
              </Text>
            </Pressable>
          </Box>
        </Stack>

        {/* <Button title="Hide modal" onPress={()=>setIsCoordinatesModalVisible(false)} /> */}
      </View>
    </Modal>
    // </View>
  )
}

export default SuccessFarmlandModal
