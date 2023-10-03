/* eslint-disable prettier/prettier */
import { createTheme } from "@rneui/themed"

const elementTheme = createTheme({
  lightColors: {
    primary: "#e7e7e8",
  },
  darkColors: {
    primary: "#000",
  },
  mode: "light",
  components: {
    Button: {
      containerStyle: {
        margin: 10,
      },
      titleStyle: {
        color: "white",
        fontSize: 18,
        fontFamily: "JosefinSans-Bold",
      },
      buttonStyle: {
        backgroundColor: "#005000",
        borderRadius: 10,
        minWidth: 150,
        height: 50,
      },
    },
    Input: {
      containerStyle: {},
      disabledInputStyle: {},
      inputContainerStyle: {},
      errorMessage: {},
      errorStyle: {},
      errorProps: {},
      inputStyle: {},
      label: {},
      labelStyle: {},
      labelProps: {},
      leftIcon: {},
      leftIconContainerStyle: {},
      rightIcon: {},
      rightIconContainerStyle: {},
      InputComponent: {},
      placeholder: {},
    },
    ListItem: {
      containerStyle: {
        marginBottom: 5,
        marginTop: 5,
      },
    },
    Icon: {
      containerStyle: {},
    },
    // ListItemTitle: {
    //     titleStyle: {
    //         color: 'red',
    //     },
    // },
    FAB: {},
  },
})

export default elementTheme
