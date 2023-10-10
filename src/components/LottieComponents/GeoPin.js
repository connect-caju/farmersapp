/* eslint-disable prettier/prettier */
import { View, Text, Pressable, Animated } from "react-native";
import React, { useRef, useState } from "react";
import LottieView from "lottie-react-native";

//  const

const GeoPin = ({ styles, onPress }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const [isAddButtonPressed, setIsAddButtonPressed] = useState(false);

  const handleAdd = () => {
    const newValue = isAddButtonPressed ? 0 : 1;
    Animated.timing(progress, {
      toValue: newValue,
      duration: 2000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      onPress();
    }, 500);
    setIsAddButtonPressed(!isAddButtonPressed);
  };

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
        source={require("../../../assets/lottie/geopin.json")}
        // progress={progress}
        style={{}}
        autoPlay
        loop
      />
    </View>
    // </Pressable>
  );
};

export default GeoPin;
