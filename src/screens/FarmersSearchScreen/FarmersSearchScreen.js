/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { View, Text, Pressable, TouchableOpacity, FlatList, TextInput, SafeAreaView, } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, { SlideInRight } from "react-native-reanimated";
import COLORS from "../../consts/colors";
import { Avatar, Icon } from "@rneui/themed";
import CustomDivider from "../../components/Divider/CustomDivider";
import { searchCriteria } from "../../consts/searchCriteria";
import { getAdminPostsByDistrict } from "../../helpers/getAdminPostsByDistrict";
import { getVillagesByDistrict } from "../../helpers/getVillagesByDistrict";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import { customizeItem } from "../../helpers/customizeItem";
import { farmerTypes } from "../../consts/farmerTypes";
import { filterByCriteria } from "../../consts/filterByCriteria";
import SearchNotFound from "../../components/LottieComponents/SearchNotFound";
import LoadingIndicator from "../../components/LottieComponents/LoadingIndicator";
import { useCallback } from "react";
import getFarmerCategory from "../../helpers/getFarmerCategory";
const { useRealm } = realmContext;



const SuggestedCriteriaItem = ({ item, handleSearchByCriteriaItem, selectedCriteria }) => {

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
            onPress={() => handleSearchByCriteriaItem(item, selectedCriteria)}
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

const CriteriaItem = ({ item, handleFocusedOption, focusedOption, selectedCriteria, }) => {

    return (
        <TouchableOpacity
            disabled={selectedCriteria ? true : false}
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
            onPress={() => {
                handleFocusedOption(item.focusedOption, item.searchKey, item.criteriaType);
            }}
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
                {item.criteriaName}
            </Text>
        </TouchableOpacity>
    );
};


const FoundFarmerItem = ({ item, navigation, farmerType }) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection: "row",
                marginHorizontal: 10,
                marginVertical: 5,
                elevation: 1,
            }}
            onPress={() => {
                navigation.navigate("Profile", {
                    ownerId: item._id,
                    farmerType,
                });
            }}
        >
            <Avatar
                size={50}
                rounded
                title={item.imageAlt}
                containerStyle={{ backgroundColor: COLORS.grey }}
                source={{
                    uri: item.image,
                }}
            />
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 15,
                    paddingBottom: 5,
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        color: COLORS.black,
                        fontFamily: "JosefinSans-Regular",
                    }}
                >
                    {item.name} {farmerType === farmerTypes.farmer && `(${getFarmerCategory(item.assets)})`}{farmerType === farmerTypes.group && `(${item.type})`}{farmerType === farmerTypes.institution && `(${item.type})`}
                </Text>

            </View>
        </TouchableOpacity>
    );
};



const FarmersSearchScreen = ({ navigation, route }) => {

    const farmerType = route.params?.farmerType || "Indivíduo";
    const [focusedOption, setFocusedOption] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCriteria, setSelectedCriteria] = useState(null);
    const [criteriaSuggestions, setCriteriaSuggestions] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [filteredCriteria, setFilteredCriteria] = useState([]);
    const user = useUser();
    const customUserData = user?.customData;
    const realm = useRealm();


    const handleSearchCriteria = (selectedCriteria) => {
        setSelectedCriteria(selectedCriteria);
    };


    const handleFocusedOption = (option, item = "", selectedCriteria = "") => {
        if (option === focusedOption) {
            setFocusedOption(null);
        }
        else {
            setFocusedOption(option);
            // fetch data according to the selected criteria
            handleSearchByCriteriaItem(item, selectedCriteria);
        }
    };

    const handleTextInputChange = (text) => {
        setSearchQuery(text);
        // setTimeout(() => {
        // }, 2000);
        // setLoading(true);
    };


    const handleNavigationToPreviousScreen = () => {
        // if the found farmers are still displayed, remove
        if (searchResults?.length > 0 || searchQuery.length > 0) {
            handleTextInputChange("");
            setSearchResults([]);
            setIsSearching(false);
        }
        // else remove the search screen and navigate back
        else {
            navigation.pop();
        }
    };

    // fetch resources by the selected selectedCriteria 
    // selectedCriteria may be: - adminPost; - village; -- status
    // - subcategory; - private; - type
    // The query expression is built according to the object(collection) to be queried 
    const handleSearchByCriteriaItem = (item, selectedCriteria) => {
        let farmers = [];

        setLoading(true);

        switch (selectedCriteria) {
            case searchCriteria.adminPost:
                if (farmerType === farmerTypes.farmer) {
                    farmers = realm
                        .objects("Actor")
                        .filtered("address.adminPost == $0", item);

                } else if (farmerType === farmerTypes.group) {
                    farmers = realm
                        .objects("Group")
                        .filtered("address.adminPost == $0", item);
                } else if (farmerType === farmerTypes.institution) {
                    farmers = realm
                        .objects("Institution")
                        .filtered("address.adminPost == $0", item);
                }
                break;
            case searchCriteria.village:
                if (farmerType === farmerTypes.farmer) {
                    farmers = realm
                        .objects("Actor")
                        .filtered("address.village == $0", item);

                } else if (farmerType === farmerTypes.group) {
                    farmers = realm
                        .objects("Group")
                        .filtered("address.village == $0", item);
                } else if (farmerType === farmerTypes.institution) {
                    farmers = realm
                        .objects("Institution")
                        .filtered("address.village == $0", item);
                }
                break;
            case searchCriteria.status:
                if (farmerType === farmerTypes.farmer) {
                    farmers = realm
                        .objects("Actor")
                        .filtered("status == $0", item);

                } else if (farmerType === farmerTypes.group) {
                    farmers = realm
                        .objects("Group")
                        .filtered("status == $0", item);
                } else if (farmerType === farmerTypes.institution) {
                    farmers = realm
                        .objects("Institution")
                        .filtered("status == $0", item);
                }
                break;
            case searchCriteria.farmerSubcategory:
                farmers = realm
                    .objects("Actor")
                    .filtered("assets.subcategory == $0", item);
                break;
            case searchCriteria.isPrivateInstitution:
                farmers = realm
                    .objects("Institution")
                    .filtered("private == $0", item);
                break;
            case searchCriteria.groupType:
                farmers = realm
                    .objects("Group")
                    .filtered("type == $0", item);
                break;
            default:
                farmers = [];
        }

        const foundResources = customizeItem(farmers, [], [], {}, farmerType);
        setSearchResults(foundResources);
        setCriteriaSuggestions([]);
        setIsSearching(true);
        setSelectedCriteria(null);
        setLoading(false);
    };

    useEffect(() => {
        // set the list of AdminPosts of the current user's district 
        if (selectedCriteria === searchCriteria.adminPost) {
            const suggestions = getAdminPostsByDistrict(customUserData?.userDistrict);
            setCriteriaSuggestions(suggestions);
        }

        // set the list of villages of the current user's district
        if (selectedCriteria === searchCriteria.village) {
            const suggestions = getVillagesByDistrict(customUserData?.userDistrict);
            setCriteriaSuggestions(suggestions);
        }

    }, [selectedCriteria, user]);

    useEffect(() => {
        // filter the list of criterii according to the farmerType
        // Individuo: comerciais, farmiliares, pendentes, validados
        // Grupo: legalizados, em processo de legalizacao, nao legalizados, pendentes, validados
        // Instituicao: privados, publicos, pendentes, validados
        const filtered = filterByCriteria.filter((criteria) => criteria.farmerType === farmerType);
        setFilteredCriteria(filtered);

    }, [farmerType]);


    useEffect(() => {
        matchedResources();
    }, [searchQuery]);


    // performs search by searchKey passed to the TextInput
    // the search result is passed to the searchResult state
    const matchedResources = useCallback(() => {
        if (searchQuery.length > 0) {
            let farmers = [];
            let matchedResources = [];
            if (farmerType?.includes("Indiv")) {
                farmers = realm.objects("Actor").filtered("userDistrict == $0", customUserData?.userDistrict);
                farmers = customizeItem(farmers, [], [], {}, farmerType);
                matchedResources = farmers.filter((item) =>
                    item.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
                );
            }
            else if (farmerType?.includes("Grupo")) {
                farmers = realm.objects("Group").filtered("userDistrict == $0", customUserData?.userDistrict);
                farmers = customizeItem(farmers, [], [], {}, farmerType);
                matchedResources = farmers.filter((item) => (item.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                    item.type?.toLowerCase()?.includes(searchQuery.toLowerCase()))
                );
            }
            else if (farmerType?.includes("Institu")) {
                farmers = realm.objects("Institution").filtered("userDistrict == $0", customUserData?.userDistrict);
                farmers = customizeItem(farmers, [], [], {}, farmerType);
                matchedResources = farmers.filter((item) => (item.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                    item.manager?.toLowerCase()?.includes(searchQuery.toLowerCase()))
                );
            }
            setSearchResults(matchedResources);
        }
    }, [searchQuery]);

    const keyExtractor = (item, index) => index.toString();

    return (
        <SafeAreaView
            style={{
                flex: 1,
            }}
        >
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
                            <Icon name="arrow-back" size={30} color={COLORS.main} />
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
                                    name={!(searchQuery || selectedCriteria) ? "search" : "close"}
                                    size={25}
                                    style={{
                                        transform: [{ rotateY: "15deg" }, { rotateZ: "90deg" }],
                                    }}
                                    color={COLORS.grey}
                                    onPress={() => {
                                        if (searchQuery) {
                                            handleTextInputChange("");
                                            setIsSearching(false);
                                            setSearchResults([]);
                                        }

                                        if (selectedCriteria) {
                                            handleSearchCriteria(null);
                                        }
                                    }}
                                />
                            </View>
                            <TextInput
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
                                    setIsSearching(true);
                                }}
                                onChangeText={handleTextInputChange}
                            />
                        </View>
                    </View>
                    <CustomDivider thickness={1} color={COLORS.lightgrey} />
                    {!selectedCriteria &&
                        <View
                            style={{
                                marginTop: 5,
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <FlatList
                                data={filteredCriteria}
                                keyExtractor={keyExtractor}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                // ListHeaderComponent={<View style={{ width: 6, }} />}
                                snapToInterval={86}
                                decelerationRate="fast"
                                renderItem={({ item }) => {
                                    return (
                                        <CriteriaItem
                                            item={item}
                                            handleFocusedOption={handleFocusedOption}
                                            selectedCriteria={selectedCriteria}
                                            focusedOption={focusedOption}
                                        />
                                    );
                                }}
                            />
                        </View>
                    }

                </View>
                {!selectedCriteria &&
                    <View
                        style={{
                            height: 10,
                            backgroundColor: selectedCriteria ? "rgba(0,0,0,0.5)" : COLORS.main,
                        }}
                    />}

                {!loading ?
                    <>
                        <View
                            style={{
                                opacity: selectedCriteria ? 0.2 : 1,
                                backgroundColor: selectedCriteria ? "rgba(0,0,0,0.5)" : COLORS.white,
                                height: selectedCriteria && "100%",
                            }}
                        >
                            {((!selectedCriteria && searchResults?.length === 0) || (searchQuery.length === 0 && searchResults?.length === 0)) &&
                                <View>

                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: COLORS.black,
                                            fontFamily: "JosefinSans-Bold",
                                            padding: 20,
                                            marginRight: 20,
                                            lineHeight: 25,
                                        }}
                                    >
                                        Tenta procurar registos de {farmerType === farmerTypes.farmer ? "Produtores Singulares" : farmerType === farmerTypes.group ? "Produtores Agrupados" : "Produtores Institucionais"} por
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
                                            <Icon name="search" size={25} color={COLORS.grey} />
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
                                            <Icon name="search" size={25} color={COLORS.grey} />
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

                        {(selectedCriteria === searchCriteria.adminPost || selectedCriteria === searchCriteria.village)
                            && <View
                                style={{
                                    borderRadius: 5,
                                    position: "absolute",
                                    top: 48,
                                    left: 50,
                                    zIndex: 10,
                                    width: "85%",
                                    height: 500,
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
                                            <SuggestedCriteriaItem
                                                item={item}
                                                handleSearchByCriteriaItem={handleSearchByCriteriaItem}
                                                selectedCriteria={selectedCriteria}
                                            />
                                        );
                                    }}
                                />
                            </View>
                        }
                        {((isSearching && searchResults?.length > 0) || (searchQuery.length > 0 && searchResults?.length > 0))
                            && <View
                                style={{
                                    height: "90%",
                                }}
                            >
                                <FlatList
                                    data={searchResults}
                                    keyExtractor={keyExtractor}
                                    showsVerticalScrollIndicator={false}
                                    ItemSeparatorComponent={
                                        <CustomDivider />
                                    }
                                    // ListHeaderComponent={<View style={{ width: 6, }} />}
                                    snapToInterval={86}
                                    decelerationRate="fast"
                                    renderItem={({ item }) => {
                                        return (
                                            <FoundFarmerItem item={item} navigation={navigation} route={route} farmerType={farmerType} />
                                        );
                                    }}
                                />
                            </View>
                        }
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                height: "30%",
                                paddingHorizontal: 30,
                                zIndex: 4,
                            }}
                        >
                            {((isSearching && searchResults?.length === 0) || (searchQuery.length > 0 && searchResults?.length === 0)) &&
                                (
                                    <>
                                        <View
                                            style={{
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <SearchNotFound />
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: COLORS.lightestgrey,
                                                padding: 10,
                                                borderRadius: 6,
                                                width: 220,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: COLORS.grey,
                                                    fontSize: 15,
                                                    fontFamily: "JosefinSans-Regular",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Nenhum registo encontrado
                                            </Text>
                                            <Text
                                                style={{
                                                    color: COLORS.grey,
                                                    fontSize: 14,
                                                    fontFamily: "JosefinSans-Regular",
                                                    textAlign: "center",
                                                }}
                                            >
                                                Tenta usar parâmetros de pesquisa diferentes
                                            </Text>
                                        </View>
                                    </>
                                )
                            }

                        </View>
                    </>
                    :
                    <View
                        style={{
                            height: "70%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <LoadingIndicator />
                    </View>
                }
            </Animated.View>
        </SafeAreaView>
    );
};

export default FarmersSearchScreen;
