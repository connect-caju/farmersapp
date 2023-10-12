/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Box, Stack, Radio } from "native-base";
import COLORS from "../../consts/colors";
import { farmerTypes } from "../../consts/farmerTypes";
import { View } from "react-native";
import { faInstitution, faPeopleGroup, faPerson } from "@fortawesome/free-solid-svg-icons";
import { FlatList } from "react-native";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const farmerTypeOptions = [
  {
    farmerDisplayName: "Singular",
    farmerType: farmerTypes.farmer,
    iconName: faPerson,
    focusedOption: 1,
  },
  {
    farmerDisplayName: "Institucional",
    farmerType: farmerTypes.institution,
    iconName: faInstitution,
    focusedOption: 2,
  },
  {
    farmerDisplayName: "Agrupado",
    farmerType: farmerTypes.group,
    iconName: faPeopleGroup,
    focusedOption: 3,
  },
];

const FarmerTypeRadioButtons = ({ farmerType, setFarmerType }) => {
  const [focusedOption, setFocusedOption] = useState(farmerType);

  const handleFocusedOption = (option, farmerType) => {
    setFocusedOption(option);
    setFarmerType(farmerType);

  };

  const keyExtractor = (item, index) => index.toString();


  return (
    <View
      style={{
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <FlatList
        data={farmerTypeOptions}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        // ListHeaderComponent={<View style={{ width: 6, }} />}
        snapToInterval={86}
        decelerationRate="fast"
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{
                marginHorizontal: 10,
                backgroundColor:
                  ((focusedOption === item.focusedOption) || (farmerType === item.farmerType))
                    ? COLORS.main
                    : COLORS.ghostwhite,
                borderColor:
                  ((focusedOption === item.focusedOption) || (farmerType === item.farmerType))
                    ? COLORS.main
                    : COLORS.lightgrey,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                borderRadius: 8,
                flexDirection: "row",
              }}
              onPress={() => handleFocusedOption(item.focusedOption, item.farmerType)}
            >

                <FontAwesomeIcon
                  icon={item.iconName} size={30} color={((focusedOption === item.focusedOption) || (farmerType === item.farmerType))
                    ? COLORS.ghostwhite
                    : COLORS.grey} />

                <View style={{
                  width: 4,
                }} />

              <Text
                style={{
                  fontSize: 14,
                  color:
                    ((focusedOption === item.focusedOption) || (farmerType === item.farmerType))
                      ? COLORS.ghostwhite
                      : COLORS.grey,
                  fontFamily: "JosefinSans-Bold",
                  textAlign: "center",
                }}
              >
                {item.farmerDisplayName}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
    // <Box my="3" alignItems={"center"}>
    //   <Radio.Group
    //     name="myRadioGroup"
    //     value={farmerType}
    //     defaultValue={farmerTypes.farmer}
    //     onChange={(nextValue) => setFarmerType(nextValue)}
    //   >
    //     <Stack
    //       direction={{
    //         base: "row",
    //         md: "column",
    //       }}
    //       alignItems={{
    //         base: "center",
    //         md: "center",
    //       }}
    //       space={2}
    //       w="100%"
    //     >
    //       <View
    //         style={{
    //           backgroundColor:
    //             farmerType === farmerTypes.farmer
    //               ? COLORS.fourth
    //               : COLORS.ghostwhite,
    //           borderRadius: 8,
    //           paddingRight: 2,
    //           elevation: 3,
    //           borderWidth: 1,
    //           borderColor: COLORS.lightgrey,
    //         }}
    //       >
    //         <Radio
    //           _text={{
    //             fontFamily: "JosefinSans-Bold",
    //             color:
    //               farmerType === farmerTypes.farmer ? COLORS.main : COLORS.grey,
    //             fontSize: 20,
    //             letterSpacing: -1.5,
    //           }}
    //           value={farmerTypes.farmer}
    //           my="0"
    //           colorScheme="emerald"
    //           size="sm"
    //         >
    //           Singular
    //         </Radio>
    //       </View>
    //       <View
    //         style={{
    //           backgroundColor:
    //             farmerType === farmerTypes.institution
    //               ? COLORS.fourth
    //               : COLORS.ghostwhite,
    //           borderRadius: 8,
    //           paddingRight: 2,
    //           elevation: 3,
    //           borderWidth: 1,
    //           borderColor: COLORS.lightgrey,
    //         }}
    //       >
    //         <Radio
    //           _text={{
    //             fontFamily: "JosefinSans-Bold",
    //             color:
    //               farmerType === farmerTypes.institution
    //                 ? COLORS.main
    //                 : COLORS.grey,
    //             fontSize: 20,
    //             letterSpacing: -1.5,
    //           }}
    //           value={farmerTypes.institution}
    //           my="0"
    //           mx="0"
    //           colorScheme="emerald"
    //           size="sm"
    //         >
    //           Institucional
    //         </Radio>
    //       </View>
    //       <View
    //         style={{
    //           backgroundColor:
    //             farmerType === farmerTypes.group
    //               ? COLORS.fourth
    //               : COLORS.ghostwhite,
    //           borderRadius: 8,
    //           paddingRight: 2,
    //           elevation: 3,
    //           borderWidth: 1,
    //           borderColor: COLORS.lightgrey,
    //         }}
    //       >
    //         <Radio
    //           _text={{
    //             fontFamily: "JosefinSans-Bold",
    //             color:
    //               farmerType === farmerTypes.group ? COLORS.main : COLORS.grey,
    //             fontSize: 20,
    //             letterSpacing: -1.5,
    //           }}
    //           value={farmerTypes.group}
    //           my="0"
    //           mx="0"
    //           colorScheme="emerald"
    //           size="sm"
    //         >
    //           Agrupado
    //         </Radio>
    //       </View>
    //     </Stack>
    //   </Radio.Group>
    // </Box>
  );
};

export default FarmerTypeRadioButtons;
