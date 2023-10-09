/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { View, Text, Pressable, TouchableOpacity, FlatList, TextInput, KeyboardNavigation } from "react-native";
import React, { useEffect } from "react";
import Animated, { SlideInRight } from "react-native-reanimated";
import COLORS from "../../consts/colors";
import { Icon } from "@rneui/themed";
import CustomDivider from "../../components/Divider/CustomDivider";
import { useState } from "react";
import { SafeAreaView } from "react-native";
import { searchCriteria } from "../../consts/searchCriteria";
import administrativePosts from "../../consts/administrativePosts";
import villages from "../../consts/villages";
import { getAdminPostsByDistrict } from "../../helpers/getAdminPostsByDistrict";
import { getVillagesByDistrict } from "../../helpers/getVillagesByDistrict";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
const { useRealm } = realmContext;

const filterByCriteria = [
    {
        criteriaType: "Comerciais",
        iconName: "all-inclusive",
        focusedOption: 1,
    },
    {
        criteriaType: "Familiares",
        iconName: "all-inclusive",
        focusedOption: 2,
    },
    {
        criteriaType: "Não categorizados",
        iconName: "all-inclusive",
        focusedOption: 3,
    },
    {
        criteriaType: "Pendentes",
        iconName: "all-inclusive",
        focusedOption: 4,
    },
    {
        criteriaType: "Validados",
        iconName: "all-inclusive",
        focusedOption: 5,
    },
];


const SearchCriteriaItem = ({ item, handleSearchByCriteriaItem, farmerType }) => {

    return (
        <TouchableOpacity
            style={{
                marginRight: 10,
                padding: 15,
                paddingLeft: 20,
                backgroundColor: COLORS.white,
                width: "100%",
                flexDirection: "row",
                // 

            }}
            onPress={() => handleSearchByCriteriaItem(item)}
        >
            <Icon
                name="search"
                size={25}
                style={{
                    // transform: [{ rotateY: "15deg" }, { rotateZ: "90deg" }],
                }}
                color={COLORS.grey}
                onPress={() => {

                }}
            />
            <Text
                style={{
                    fontSize: 16,
                    fontFamily: "JosefinSans-Regular",
                    paddingLeft: 15,
                }}
            >
                {item}
            </Text>
        </TouchableOpacity>
    );
};


const ResourceItem = ({ item }) => {
    return (
        <TouchableOpacity
            style={{
                marginRight: 10,
                padding: 15,
                paddingLeft: 20,
                backgroundColor: COLORS.white,
                width: "100%",
                flexDirection: "row",
                // 

            }}
        // onPress={() => handleFocusedOption(item.focusedOption)}
        >
            <Icon
                name="search"
                size={25}
                style={{
                    // transform: [{ rotateY: "15deg" }, { rotateZ: "90deg" }],
                }}
                color={COLORS.grey}
                onPress={() => {

                }}
            />
            <Text
                style={{
                    fontSize: 16,
                    fontFamily: "JosefinSans-Regular",
                    paddingLeft: 15,
                }}
            >
                {item}
            </Text>
        </TouchableOpacity>
    );
};



const FarmersSearchScreen = ({ navigation, route }) => {

    const farmerType = route.params?.farmerType || "Indivíduo";
    const [focusedOption, setFocusedOption] = useState(null);
    const [isSearching, setIsSearching] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [criteria, setCriteria] = useState(null);
    const [criteriaSuggestions, setCriteriaSuggestions] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const user = useUser();
    const customUserData = user?.customData;
    const realm = useRealm();


    const handleSearchCriteria = (criteria) => {
        setCriteria(criteria);
    };


    const handleFocusedOption = (option) => {
        if (option === focusedOption) {
            setFocusedOption(null);
        }
        else {
            setFocusedOption(option);
        }
    };

    const handleTextInputChange = (text) => {
        setSearchQuery(text);
    };

    const handleNavigationToPreviousScreen = () => {
        navigation.pop();
    };

    const handleSearchByCriteriaItem = (item) => {
        let farmers = [];
        if (farmerType === "Indivíduo") {
            farmers = realm
                .objects("Actor")
                .filtered("address.adminPost == $0", item);

        } else if (farmerType === "Grupo") {
            farmers = realm
                .objects("Group")
                .filtered("address.adminPost == $0", item);
        } else if (farmerType === "Instituição") {
            farmers = realm
                .objects("Institution")
                .filtered("address.adminPost == $0", item);
        }
        setSearchResults(farmers);
    };

    useEffect(() => {

        if (criteria === searchCriteria.adminPost) {
            const suggestions = getAdminPostsByDistrict(customUserData?.userDistrict);
            setCriteriaSuggestions(suggestions);
        }

        if (criteria === searchCriteria.village) {
            const suggestions = getVillagesByDistrict(customUserData?.userDistrict);
            setCriteriaSuggestions(suggestions);
        }


    }, [searchQuery, criteria, user]);

    const keyExtractor = (item, index) => index.toString();

    console.log("searchResults:", searchResults);

    return (
        <SafeAreaView
            style={{
            }}
        >
            {/* <KeyboardNavigation
                oneTapToTriggerAction={() => console.log("Keyboard closed")}
            > */}

                <Animated.View
                    entering={SlideInRight}
                    style={{
                        height: "100%",
                        width: "100%",
                        backgroundColor: COLORS.white,
                    }}
                >
                    <View
                        style={{

                            width: "100%",
                            padding: 5,
                            backgroundColor: COLORS.fourth,
                        }}
                    >

                        <View
                            style={{
                                flexDirection: "row",
                            }}
                        >
                            <Pressable
                                onPress={() => handleNavigationToPreviousScreen()}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 5,
                                }}
                            >
                                <Icon name="arrow-back" size={35} color={COLORS.grey} />
                            </Pressable>
                            <View

                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "90%",
                                    paddingBottom: 5,
                                }}
                            >
                                <View
                                    style={{
                                        position: "absolute",
                                        top: 8,
                                        right: 12,
                                        zIndex: 10,
                                        borderRadius: 50,
                                    }}
                                >
                                    <Icon
                                        name={!(searchQuery || criteria) ? "search" : "close"}
                                        size={25}
                                        style={{
                                            transform: [{ rotateY: "15deg" }, { rotateZ: "90deg" }],
                                        }}
                                        color={COLORS.grey}
                                        onPress={() => {
                                            if (searchQuery) {
                                                handleTextInputChange("");
                                            }

                                            if (criteria) {
                                                handleSearchCriteria(null);
                                            }
                                        }}
                                    />
                                </View>
                                <TextInput
                                    autoFocus={isSearching ? true : false}
                                    placeholder="Procurar"
                                    placeholderTextColor={COLORS.lightgrey}
                                    style={{
                                        width: "98%",
                                        height: 40,
                                        marginRight: 5,
                                        backgroundColor: COLORS.white,
                                        borderRadius: 15,
                                        color: COLORS.grey,
                                        fontFamily: "JosefinSans-Regular",
                                        borderWidth: 1,
                                        textAlign: "left",
                                        paddingLeft: 20,
                                        fontSize: 16,
                                        borderColor: COLORS.white,
                                    }}
                                    value={searchQuery}
                                    onFocus={() => {
                                        setFocusedOption(true);
                                    }}
                                    onEndEditing={() => {
                                        setFocusedOption(false);
                                    }}
                                    onChangeText={handleTextInputChange}
                                />
                            </View>
                        </View>
                        <CustomDivider thickness={1} color={COLORS.lightgrey} />
                        {!criteria &&
                            <View
                                style={{
                                    marginTop: 5,
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                }}
                            >
                                <FlatList
                                    data={filterByCriteria}
                                    keyExtractor={keyExtractor}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    // ListHeaderComponent={<View style={{ width: 6, }} />}
                                    snapToInterval={86}
                                    decelerationRate="fast"
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity
                                                disabled={criteria ? true : false}
                                                style={{
                                                    marginRight: 10,
                                                    backgroundColor:
                                                        focusedOption === item.focusedOption
                                                            ? COLORS.main
                                                            : COLORS.fourth,
                                                    borderColor:
                                                        focusedOption === item.focusedOption
                                                            ? COLORS.main
                                                            : COLORS.lightgrey,
                                                    borderWidth: 1,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    paddingHorizontal: 6,
                                                    paddingBottom: 5,
                                                    borderRadius: 100,
                                                    elevation: 1,
                                                }}
                                                onPress={() => handleFocusedOption(item.focusedOption)}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        color:
                                                            focusedOption === item.focusedOption
                                                                ? COLORS.white
                                                                : COLORS.grey,
                                                        fontFamily: "JosefinSans-Regular",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {item.criteriaType}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                            </View>
                        }

                    </View>
                    {!criteria &&
                        <View
                            style={{
                                height: 10,
                                backgroundColor: criteria ? "rgba(0,0,0,0.5)" : COLORS.main,
                            }}
                        />}

                    <View
                        style={{
                            opacity: criteria ? 0.2 : 1,
                            backgroundColor: criteria ? "rgba(0,0,0,0.5)" : COLORS.white,
                            height: criteria && "100%",
                        }}
                    >
                        {!criteria &&
                            <View>

                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: COLORS.black,
                                        fontFamily: "JosefinSans-Regular",
                                        padding: 20,
                                    }}
                                >
                                    Tenta procurar registos por
                                </Text>
                                <View
                                    style={{
                                        paddingLeft: 20,
                                        height: 100,
                                        justifyContent: "space-around",
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: "row",
                                        }}
                                        onPress={() => handleSearchCriteria(searchCriteria.adminPost)}
                                    >
                                        <Icon name="search" size={30} color={COLORS.grey} />
                                        <Text
                                            style={{
                                                paddingLeft: 15,
                                                fontSize: 18,
                                                color: COLORS.grey,
                                                fontFamily: "JosefinSans-Regular",

                                            }}
                                        >Posto Administrativo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: "row",
                                        }}
                                        onPress={() => handleSearchCriteria(searchCriteria.village)}
                                    >
                                        <Icon name="search" size={30} color={COLORS.grey} />
                                        <Text
                                            style={{
                                                paddingLeft: 15,
                                                fontSize: 18,
                                                color: COLORS.grey,
                                                fontFamily: "JosefinSans-Regular",
                                            }}
                                        >Localidade</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>


                    {(criteria === searchCriteria.adminPost || criteria === searchCriteria.village)
                        && <View
                            style={{
                                borderRadius: 5,
                                position: "absolute",
                                top: 48,
                                left: 50,
                                zIndex: 10,
                                width: "85%",
                                height: 500,
                                // elevation: 1,
                            }}
                        >
                            <FlatList
                                data={criteriaSuggestions}
                                keyExtractor={keyExtractor}
                                ItemSeparatorComponent={
                                    <CustomDivider />
                                }
                                showsVerticalScrollIndicator={false}
                                snapToInterval={86}
                                decelerationRate="fast"
                                renderItem={({ item }) => {
                                    return (
                                        <SearchCriteriaItem
                                            item={item}
                                            handleSearchByCriteriaItem={handleSearchByCriteriaItem}
                                            farmerType={farmerType}
                                        />
                                    );
                                }}
                            />
                        </View>
                    }

                    <View
                        style={{
                            height: "90%",
                        }}
                    >
                        <FlatList
                            data={searchResults}
                            keyExtractor={keyExtractor}
                            showsVerticalScrollIndicator={false}
                            // ListHeaderComponent={<View style={{ width: 6, }} />}
                            snapToInterval={86}
                            decelerationRate="fast"
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            paddingHorizontal: 6,
                                            paddingBottom: 5,
                                            borderRadius: 100,
                                            elevation: 1,
                                        }}
                                        onPress={() => {

                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontFamily: "JosefinSans-Regular",
                                                textAlign: "center",
                                            }}
                                        >
                                            {"item"}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>

                </Animated.View>
            {/* </KeyboardNavigation> */}

        </SafeAreaView>
    );
};

export default FarmersSearchScreen;
