// /* eslint-disable prettier/prettier */
import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SearchScreen from "../../screens/SearchScreen/SearchScreen"
import OTPVerificationScreen from "../../screens/OTPVerificationScreen/OTPVerificationScreen"

const OTPVerificationStack = createNativeStackNavigator()

export default function OTPStackScreen() {
  return (
    <OTPVerificationStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#EBEBE4",
        },
        headerTitleAlign: "center",
        headerTintColor: "#005000",
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
          fontFamily: "JosefinSans-Italic",
        },
      }}
    >
      <OTPVerificationStack.Screen
        options={{ title: "Pesquisa" }}
        name="Search"
        component={OTPVerificationScreen}
      />
    </OTPVerificationStack.Navigator>
  )
}
