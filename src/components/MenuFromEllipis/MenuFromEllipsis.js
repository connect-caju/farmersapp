/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { View, Text, Animated } from "react-native";
import React, { useState } from "react";
import COLORS from "../../consts/colors";

const MenuFromEllipsis = ({ menu, pop }) => {
    // const [menu] = useState(new Animated.Value(10));
    // const [pop, setPop] = useState(false);

    // const popIn = () => {
    //     setPop(true);
    //     Animated.timing(menu, {
    //         toValue: 50,
    //         timing: 500,
    //         useNativeDriver: false,
    //     }).start();
    // };

    // const popOut = () => {
    //     setPop(false);
    //     Animated.timing(menu, {
    //         toValue: 10,
    //         timing: 500,
    //         useNativeDriver: false,
    //     }).start();
    // };

    return (
        <View
            style={{
                flex: 1,
                zIndex: 150,
            }}
            >
            <Animated.View
                style={[{
                    display: pop ? "flex" : "none",
                    width: 150,
                    height: 200,
                    backgroundColor: COLORS.grey,
                    position: "absolute",
                    top: 25,
                    // right: 
                }, { right: menu, zIndex: 1, }]}
            >
                <Text>MenuFromEllipsis</Text>
            </Animated.View>
        </View>
    );
};

export default MenuFromEllipsis;
