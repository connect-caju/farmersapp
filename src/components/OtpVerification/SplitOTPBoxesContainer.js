import React from "react"
import { Pressable, View, Text } from "react-native"
import COLORS from "../../consts/colors"

export default function SplitOTPBoxesContainer({ inputRef }) {
  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false)
  const boxArray = new Array(maximumLength).fill(0)

  const handleOnPress = () => {
    setIsInputBoxFocused(true)
    inputRef.current.focus()
  }

  const handleOnBlur = () => {
    setIsInputBoxFocused(false)
  }

  return (
    <Pressable
      style={{
        width: "80%",
        flexDirection: "row",
        justifyContent: "space-evenly",
      }}
      // onPress={}
    ></Pressable>
  )
}
