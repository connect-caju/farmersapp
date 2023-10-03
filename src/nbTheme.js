/* eslint-disable prettier/prettier */

import { extendTheme } from "native-base"

const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
}
const nbTheme = extendTheme({ colors: newColorTheme })

export default nbTheme
