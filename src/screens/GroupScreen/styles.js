import { StyleSheet } from "react-native"
import COLORS from "../../consts/colors"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen"

import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenHeight,
  responsiveScreenWidth,
  useDimensionsChange,
} from "react-native-responsive-dimensions"

const styles = StyleSheet.create({
  images: {
    width: 200,
    height: 200,
    borderColor: COLORS.main,
    // borderWidth: 2,
    marginHorizontal: 3,
    borderRadius: 100,
  },
})

export default styles
