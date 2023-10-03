import { View, Text, Pressable, Animated } from "react-native"
import React, { useRef, useState } from "react"
import LottieView from "lottie-react-native"

//  const

const DangerAlert = ({ styles, onPress }) => {
  // const progress = useRef(new Animated.Value(0)).current;
  // const [isAddButtonPressed, setIsAddButtonPressed] = useState(false);

  return (
    // <Pressable
    //   // style={styles}
    //   // onPress={handleAdd}
    // >
    <View
      style={{
        width: 100,
        height: 100,
      }}
    >
      <LottieView
        source={require("../../../assets/lottie/dangerAlert.json")}
        // progress={progress}
        style={{}}
        autoPlay
        loop
      />
    </View>
    // </Pressable>
  )
}

export default DangerAlert
