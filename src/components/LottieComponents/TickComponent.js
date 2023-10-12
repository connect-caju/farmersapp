/* eslint-disable prettier/prettier */
import { View, Text, Pressable, Animated } from "react-native";
import React, { useRef, useState } from "react";
import LottieView from "lottie-react-native";

//  const

const TickComponent = ({ }) => {
  return (
    <View
      style={{
        width: 100,
        height: 100,
      }}
    >
      <LottieView
        source={require("../../../assets/lottie/tick.json")}
        autoPlay
        loop
      />
    </View>
  );
};

// PropTypes.

export default TickComponent;
