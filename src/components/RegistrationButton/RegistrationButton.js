/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import {
    View,
    Animated,
    TouchableOpacity,
    Text,
} from "react-native";
import React, { useState } from "react";
import { Icon } from "@rneui/themed";
import {
    faPeopleGroup,
    faInstitution,
    faPerson,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import COLORS from "../../consts/colors";
import { farmerTypes } from "../../consts/farmerTypes";

const RegistrationButton = ({ customUserData, navigation, route, }) => {
    const [farmerType, setFarmerType] = useState("");
    const [icon_1,] = useState(new Animated.Value(30));
    const [icon_2,] = useState(new Animated.Value(30));
    const [icon_3,] = useState(new Animated.Value(30));

    const [pop, setPop] = useState(false);

    const popIn = () => {
        setPop(true);
        Animated.timing(icon_1, {
            toValue: 100,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2, {
            toValue: 100,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3, {
            toValue: 100,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const popOut = () => {
        setPop(false);
        Animated.timing(icon_1, {
            toValue: 30,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2, {
            toValue: 30,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3, {
            toValue: 30,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const addFarmer = (farmerType) => {
        navigation.navigate("FarmerForm1", { customUserData, farmerType });
    };

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <Animated.View
                style={[{
                    width: 60,
                    height: 60,
                    position: "absolute",
                    bottom: 30,
                    right: 30,
                    // borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                }, { bottom: icon_1 }]}
            >
                <View
                    style={{
                        borderRadius: 100,
                        borderColor: COLORS.fourth,
                        backgroundColor: COLORS.fourth,
                        padding: 10,
                        elevation: 8,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            addFarmer(farmerTypes.group);
                        }}
                    >
                        <FontAwesomeIcon icon={faPeopleGroup} size={30} color={COLORS.main} />
                    </TouchableOpacity>

                </View>
                {pop && <Text style={{
                    fontSize: 10,
                }}>Grupo</Text>}
            </Animated.View>
            <Animated.View
                style={[{
                    // backgroundColor: COLORS.main,
                    width: 60,
                    height: 60,
                    position: "absolute",
                    bottom: 30,
                    right: 30,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                }, { bottom: icon_2, right: icon_2 }]}
            >
                <View
                    style={{
                        borderRadius: 100,
                        borderColor: COLORS.fourth,
                        backgroundColor: COLORS.fourth,
                        padding: 10,
                        elevation: 8,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            addFarmer(farmerTypes.farmer);
                        }}
                    >
                        <FontAwesomeIcon icon={faPerson} size={30} color={COLORS.main} />
                    </TouchableOpacity>
                </View>
                {pop && <Text style={{
                    fontSize: 10,
                }}>Singular</Text>}
            </Animated.View>
            <Animated.View
                style={[{
                    // backgroundColor: COLORS.main,
                    width: 60,
                    height: 60,
                    position: "absolute",
                    bottom: 30,
                    right: 30,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                }, { right: icon_3, }]}
            >
                <View
                    style={{
                        borderRadius: 100,
                        borderColor: COLORS.fourth,
                        backgroundColor: COLORS.fourth,
                        padding: 10,
                        elevation: 8,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            addFarmer(farmerTypes.institution);
                        }}
                    >
                        <FontAwesomeIcon icon={faInstitution} size={30} color={COLORS.main} />
                    </TouchableOpacity>
                </View>
                {pop && <Text style={{
                    fontSize: 10,
                }}>Instituição</Text>}
            </Animated.View>
            <View
                style={{
                    zIndex: 10,
                }}
            >
                <View
                    style={{
                        borderRadius: 50,
                        backgroundColor: COLORS.main,
                        padding: 4,
                        elevation: 8,
                        position: "absolute",
                        bottom: 30,
                        right: 30,
                    }}
                >
                    <View
                        style={{
                            justifyContent: "center",
                            borderRadius: 50,
                            borderWidth: 3,
                            borderColor: COLORS.lightestgrey,
                            backgroundColor: COLORS.main,
                            padding: 2,
                        }}
                    >
                        <TouchableOpacity onPress={() => {
                            pop === false ? popIn() : popOut();
                        }}>
                            <Icon
                                name="app-registration"
                                color={COLORS.lightestgrey}
                                size={40}
                            />
                        </TouchableOpacity>

                    </View>
                </View>
                <Text
                    style={{
                        position: "absolute",
                        bottom: 10,
                        right: 35,
                        fontSize: 12,
                        fontFamily: "JosefinSans-BoldItalic",
                    }}
                >
                    Registar
                </Text>
            </View>
        </View>
    );
};

export default RegistrationButton;
