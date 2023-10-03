import { View, Text, ActivityIndicator } from "react-native"
import React from "react"
import styles from "./style"
import COLORS from "../../consts/colors"

const CustomActivityIndicator = ({
  loadingActivitiyIndicator,
  setLoadingActivityIndicator,
  backgroundColor,
  indicatorColor,
}) => {
  // const startLoading = ()=>{
  // setLoadingActivityIndicator(true);
  // }

  if (loadingActivitiyIndicator) {
    // startLoading();
    setTimeout(() => {
      setLoadingActivityIndicator(false)
    }, 0)
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
        // paddingTop: 5,
        backgroundColor: backgroundColor ? backgroundColor : "ghostwhite",
        padding: 8,
      }}
    >
      <ActivityIndicator
        //visibility of Overlay Loading Spinner
        visible={loadingActivitiyIndicator}
        //Text with the Spinner
        // textContent={'Connect Caju...'}
        //Text style of the Spinner Text
        textStyle={{
          color: indicatorColor ? indicatorColor : COLORS.main,
        }}
        size={"large"}
        color={indicatorColor ? indicatorColor : COLORS.main}
      />
      <Text
        style={{
          textAlign: "center",
          fontSize: 12,
          color: indicatorColor ? indicatorColor : COLORS.main,
          fontFamily: "JosefinSans-Regular",
        }}
      >
        Connect Caju...
      </Text>
    </View>
  )
}

export default CustomActivityIndicator
