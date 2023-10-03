import React from "react"
import { View, Text, ActivityIndicator } from "react-native"
import COLORS from "../../consts/colors"

function SearchScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size={"large"} color={COLORS.main} />
      <Text
        style={{
          fontSize: 22,
          textAlign: "center",
          fontFamily: "JosefinSans-Bold",
          color: COLORS.main,
        }}
      >
        Desenvolvimento em curso...
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontFamily: "JosefinSans-Bold",
          color: COLORS.main,
        }}
      >
        Tente mais tarde...
      </Text>
    </View>
  )
}

export default SearchScreen
