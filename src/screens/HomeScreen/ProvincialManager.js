/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import React, { useState, Image, SafeAreaView, TouchableOpacity } from "react";
import { View, Text } from "react-native";
import COLORS from "../../consts/colors";
import { Box, Center, Stack } from "native-base";
import { Icon } from "@rneui/base";


// export let realm;

const ProvincialManager = ({ customUserData, setIsUserProfileVisible, isUserProfileVisible }) => {
    // realm = useRealm();
    // const user = useUser();
    // const customUserData = user?.customData;
    // const [isUserProfileVisible, setIsUserProfileVisible] = useState(false);

    return (
        <View
            style={{
                flex: 1,
                padding: 8,
            }}
        >
            <Text
                style={{
                    fontSize: 24,
                    color: COLORS.black,
                    fontFamily: "JosefinSans-Bold",
                    marginTop: -30,
                }}
            >{customUserData?.userProvince}</Text>
        </View>
    );
};

export default ProvincialManager;
