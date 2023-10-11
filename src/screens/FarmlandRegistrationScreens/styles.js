/* eslint-disable prettier/prettier */
import { StyleSheet } from "react-native"
import COLORS from "../../consts/colors"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: "ghostwhite",
  },
  headerText: {
    fontFamily: "JosefinSans-Bold",
    fontSize: 20,
    color: COLORS.black,
  },
  description: {
    textAlign: "left",
    fontFamily: "JosefinSans-Italic",
    color: "grey",
    fontSize: 18,
  },
  secondDescription: {
    textAlign: "center",
    fontFamily: "JosefinSans-Italic",
    color: "#005000",
    fontSize: 18,
    lineHeight: 30,
  },
  formSectionDescription: {
    textAlign: "center",
    fontFamily: "JosefinSans-Italic",
    color: "#005000",
    fontSize: 16,
    paddingVertical: 10,
  },
  datepicker: {
    // backgroundColor: 'grey',
    borderRadius: 10,
  },
})

export default styles
