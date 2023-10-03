/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */

import React from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
// import { Icon } from '@rneui/themed';
import { Input, Box, Stack } from "native-base"

import styles from "./styles"
import COLORS from "../../consts/colors"

export function CustomInput({
  placeholder,
  InputLeftElement,
  InputRightElement,
  Icon,
  type,
  label,
  error,
  value,
  secureTextEntry,
  onChangeText,
  autoCapitalize,
  autoFocus,
  keyboardType,
  onFocus,
  isDisabled,
  textAlign,
  maxLength,
  multiline,
  borderColor,
  ...props
}) {
  return (
    <Input
      size="2xl"
      h={55}
      placeholder={placeholder}
      w={props?.width}
      Icon={Icon}
      // type={type}
      textContentType={type}
      secureTextEntry={secureTextEntry ? true : false}
      InputLeftElement={InputLeftElement}
      InputRightElement={InputRightElement}
      isDisabled={isDisabled ? isDisabled : false}
      // borderColor={borderColor}
      borderWidth={1}
      color="#555555"
      fontFamily="JosefinSans-Regular"
      fontSize={16}
      value={value}
      textAlign={textAlign}
      autoCapitalize={autoCapitalize ? autoCapitalize : "none"}
      keyboardType={keyboardType ? keyboardType : "default"}
      onChangeText={onChangeText}
      onFocus={onFocus}
      maxLength={maxLength && maxLength}
      multiline={Boolean(multiline)}
      autoFocus={autoFocus}
      style={{
        borderColor: borderColor ? borderColor : "",
        borderWidth: borderColor ? 1 : 0,
      }}
    />
  )
}
