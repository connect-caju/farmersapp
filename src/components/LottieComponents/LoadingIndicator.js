/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";

const LoadingIndicator = ({ }) => {

    useEffect(() => {

    }, []);

    return (
        <View
            style={{
                width: 500,
                height: 500,
            }}
        >
            <LottieView
                source={require("../../../assets/lottie/loadingIndicator.json")}
                style={{}}
                autoPlay
                loop
            />
        </View>
    );
};

export default LoadingIndicator;
