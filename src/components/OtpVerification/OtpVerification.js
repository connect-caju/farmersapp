import {
  View,
  Text,
  InteractionManager,
  TextInput,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import React, { useCallback, useState, useEffect, useRef } from "react"
import { Box, Stack, Center } from "native-base"
import { Icon, Overlay } from "@rneui/themed"
import { useFocusEffect } from "@react-navigation/native"
import KeyboardAvoidingWrapper from "../KeyboardAvoidingWrapper/KeyboardAvoidingWrapper"
import COLORS from "../../consts/colors"

// const CodeInputSection = ({ })=>{

//     return (
//         <View
//             style={{
//                 flexDirection: 'row',
//                 padding: 10,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//             }}
//         >
//             <TextInput
//                 ref={textInput}
//             />
//         </View>
//     )
// }

const CodeInputField = ({ code, setPinReady, setCode, maxCodeLength }) => {
  const textInputRef = useRef(null)
  const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false)

  const handleOnBlur = () => {
    setInputContainerIsFocused(false)
  }

  const handleOnPress = () => {
    setInputContainerIsFocused(true)
    textInputRef?.current?.focus()
  }

  return (
    <View
      style={{
        flexDirection: "row",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        ref={textInputRef}
        value={code}
        onChangeText={setCode}
        onSubmitEditing={handleOnBlur}
        keyboardType="number-pad"
        returnKeyType="done"
        maxLength={maxCodeLength}
        // textContentType='oneTimeCode'
        // setPinReady={setPinReady}
        // setCode={setCode}
        // maxCodeLength={maxCodeLength}
      />
    </View>
  )
}

export default function OtpVerification({ isOTPVisible, setIsOTPVisible }) {
  const [code, setCode] = useState("")
  const [pinReady, setPinReady] = useState(false)

  const MAX_CODE_LENGTH = 4

  const toggleOverlay = () => {
    setIsOTPVisible(!isOTPVisible)
  }

  return (
    <Overlay
      overlayStyle={{
        backgroundColor: COLORS.ghostwhite,
        width: "100%",
        height: "100%",
        // borderRadius: 10,
        paddingTop: 10,
        // marginBottom: 10,
      }}
      isVisible={isOTPVisible}
      onBackdropPress={toggleOverlay}
    >
      {/* <KeyboardAvoidingWrapper
        style={{
            // minHeight: '100%',
           
        }}
    > */}
      <View
        style={{
          flex: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            // flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
            borderWidth: 3,
            borderColor: "#EBEBE4",
            width: 150,
            height: 150,
            // height: '100%',
            backgroundColor: "#EBEBE4",
          }}
        >
          <Icon name="lock" size={80} color={COLORS.main} />
        </View>
      </View>

      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          fontFamily: "JosefinSans-Bold",
          color: COLORS.main,
        }}
      >
        Verificação de Conta
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 14,
          fontFamily: "JosefinSans-Regular",
          color: COLORS.grey,
          paddingHorizontal: 20,
          lineHeight: 20,
          paddingVertical: 10,
        }}
      >
        Introduza o código de 4 dígitos enviado para{" "}
        <Text
          style={{
            fontWeight: "bold",
            letterSpacing: 3,
          }}
        >
          840445375
        </Text>
      </Text>

      <View
        style={{
          flex: 2,
          justifyContent: "center",
          alignItems: "center",
          // height: '100%',
          // backgroundColor: 'red',
        }}
      >
        <CodeInputField
          setPinReady={setPinReady}
          code={code}
          setCode={setCode}
          maxCodeLength={MAX_CODE_LENGTH}
        />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          // height: '100%',
          // backgroundColor: 'red',
        }}
      >
        {/* <Text>OTP OtpVerification</Text> */}
      </View>
      {/* </KeyboardAvoidingWrapper> */}
    </Overlay>
  )
}
