import React from "react"
import { View } from "react-native"
import AwesomeAlert from "react-native-awesome-alerts"

const CustomAwesomeAlert = ({
  alert,
  title,
  message,
  confirmText,
  cancelText,
  showCancelButton,
  showConfirmButton,
  onCancelPressed,
  onConfirmPressed,
}) => {
  return (
    <AwesomeAlert
      show={alert}
      titleStyle={{
        fontSize: 20,
        color: COLORS.main,
        fontWeight: "bold",
      }}
      messageStyle={{
        fontSize: 18,
        color: COLORS.grey,
        fontFamily: "JosefinSans-Regular",
        lineHeight: 20,
      }}
      alertContainerStyle={
        {
          // width: 300,
        }
      }
      cancelButtonStyle={{
        width: 600,
      }}
      cancelButtonTextStyle={{
        fontSize: 100,
      }}
      confirmButtonStyle={{}}
      confirmButtonTextStyle={{}}
      showProgress={false}
      title={title}
      message={message}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      showCancelButton={showCancelButton}
      showConfirmButton={showConfirmButton}
      cancelText={cancelText}
      confirmText={confirmText}
      cancelButtonColor="#DD6B55"
      confirmButtonColor={COLORS.main}
      onCancelPressed={onCancelPressed}
      onConfirmPressed={onConfirmPressed}
    />
  )
}
