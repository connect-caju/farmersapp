/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import LottieView from "lottie-react-native";
import { View } from "react-native";
import React from "react";

const InfoIcon = () => {
    return (
        <View
            style={{
                width: 100,
                height: 100,
            }}
        >
            <LottieView
                source={require("../../../assets/lottie/infoIcon.json")}
                style={{}}
                autoPlay
                loop
            />
        </View>
    );
};

export default InfoIcon;
