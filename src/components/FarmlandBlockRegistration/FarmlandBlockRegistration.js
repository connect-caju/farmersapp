import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Modal, Animated, SafeAreaView, } from 'react-native';
import { Box, FormControl, Stack, Select, CheckIcon, Center, Radio  } from 'native-base';
import { MultipleSelectList, SelectList  } from 'react-native-dropdown-select-list';
// import Animated, { FadeInLeft, SlideInUp } from "react-native-reanimated";

  
  import { 
    responsiveFontSize,
  
  } from 'react-native-responsive-dimensions';

import { Overlay, Icon, Button, CheckBox } from "@rneui/base";
import COLORS from "../../consts/colors";
import { getFullYears, getFullYears2 } from "../../helpers/dates";
import { plantingTypes } from "../../consts/plantingTypes";
import cloneList from "../../consts/clones";
import { CustomInput } from "../Inputs/CustomInput";

// import { v4 as uuidv4 } from 'uuid';

import { realmContext } from '../../models/realmContext';
import { TouchableOpacity } from "react-native";
import validateBlockData from "../../helpers/validateBlockData";
import AwesomeAlert from "react-native-awesome-alerts";
import { errorMessages } from "../../consts/errorMessages";
const {useRealm, useQuery, useObject} = realmContext;


export default function FarmlandBlockRegistration({ 
    customUserData, 
    farmlandId,
    isOverlayVisible, setIsOverlayVisible, errors, setErrors,
    resizeBlockBox,
    scale,
    // alert, setAlert,
    plantingYear, setPlantingYear, blockTrees, setBlockTrees,
    usedArea, setUsedArea, plantTypes, setPlantTypes,
   
    clones, setClones, densityLength, setDensityLength,
    densityWidth, setDensityWidth,
    isDensityModeIrregular, isDensityModeRegular, setIsDensityModeIrregular,
    setIsDensityModeRegular,

    visualizeBlockData,

    sameTypeTreesList, setSameTypeTreesList,

    totalArea, 
    setTotalArea, setTotalTrees, 
    totalTrees,
    treesFlag, setTreesFlag, areaFlag, setAreaFlag,

    turnOffOverlay,

    alert, setAlert,
    messageAlert, setMessageAlert,
    titleAlert, setTitleAlert,
    cancelText, setCancelText,
    confirmText, setConfirmText,
    showCancelButton, setShowCancelButton,
    showConfirmButton, setShowConfirmButton,

    ownerImage,

    // successLottieVisible, setSuccessLottieVisible,
    
}){

    const realm = useRealm();
    const foundFarmland = realm.objectForPrimaryKey('Farmland', farmlandId);
    const [addedClone, setAddedClone] = useState('');
  
    const [addBlockIsOn, setAddBlockIsOn] = useState(false);
    const [treeRedFlag, setTreeRedFlag] = useState(false);
    const [areaRedFlag, setAreaRedFlag] = useState(false);

    // ---------------------------------------------
   
    const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
    };


    useEffect(()=>{
        if (addBlockIsOn){
              
            if (treesFlag > totalTrees || areaFlag > totalArea) {
                setAlert(true);
                setTitleAlert(errorMessages.farmlandAndBlockConformity.title);
                setMessageAlert(errorMessages.farmlandAndBlockConformity.message);
                setShowCancelButton(errorMessages.farmlandAndBlockConformity.showCancelButton);
                setShowConfirmButton(errorMessages.farmlandAndBlockConformity.showConfirmButton);
                setCancelText(errorMessages.farmlandAndBlockConformity.cancelText);
                setConfirmText(errorMessages.farmlandAndBlockConformity.confirmText);

                setAddBlockIsOn(false);

                setTreeRedFlag(true);
                setAreaRedFlag(true);

                setTreesFlag(prev => prev - parseInt(blockTrees));
                setAreaFlag(prev => prev - parseFloat(usedArea));
        
                return ;
            }
            else {
                setAreaRedFlag(false);
                setTreeRedFlag(false);
            }

            visualizeBlockData();

            setAddBlockIsOn(false);
        }

    }, [ addBlockIsOn ])




    useEffect(()=>{

        let selectedClones = [];
        let mergedSameTypeTrees = [];
        const filteredPlantTypes = plantTypes.filter(plantType=>!plantType.includes('enxer'));
        if (plantTypes.filter(plantType=>plantType.includes('enxer')).length > 0){
            selectedClones = clones?.filter(clone => clone !== 'Outro')?.map(clone=>`Clone: ${clone}`);
            mergedSameTypeTrees = filteredPlantTypes.concat(selectedClones);
        }
        else{
            mergedSameTypeTrees = filteredPlantTypes;
            if(clones?.length > 0){
                setClones([]);
            }
        }
        let normalizedSameTypeTrees = mergedSameTypeTrees?.map((treeType)=>({
            treeType,
            trees: '',
        }));
        setSameTypeTreesList(normalizedSameTypeTrees);

    }, [ clones, plantTypes]);


 return (
//      <Overlay 
//      fullScreen
//     overlayStyle={{ 
//         backgroundColor: COLORS.ghostwhite, 
//         width: '100%',
//         // maxHeight: '95%',
//         borderTopLeftRadius: 0,
//         borderTopRightRadius: 0,
//         paddingBottom: 5,
//     }}
//     isVisible={isOverlayVisible} 
//     onBackdropPress={()=>{

//         turnOffOverlay();

//         if (treeRedFlag || areaRedFlag){
//             setTreeRedFlag(false);
//             setAreaRedFlag(false);
//         }
//     }}
// >
    
    <Modal
        visible={isOverlayVisible}
        // transparent
        onDismiss={()=>{
            turnOffOverlay();
            if (treeRedFlag || areaRedFlag){
                setTreeRedFlag(false);
                setAreaRedFlag(false);
            } 
        }}
    >
    <SafeAreaView
        style={{
            flex: 1,
        }}
        onTouchCancel={()=>{}
            // resizeBlockBox(0)
            // setIsOverlayVisible(false)
        }
    >

    <Animated.View
        style={{
            paddingHorizontal: 10,
            backgroundColor: COLORS.ghostwhite,
            opacity: scale?.interpolate({ inputRange: [0, 1], outputRange: [0, 1]}),
            transform: [{scale}],
        }}
    >
        
        <AwesomeAlert
            show={alert}
            
            titleStyle={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 5,
                // backgroundColor: COLORS.main,
                width: '100%',
                textAlign: 'center',

            }}
            messageStyle={{
                fontSize: 18,
                color: COLORS.grey,
                fontFamily: 'JosefinSans-Regular',
                lineHeight: 25,
                textAlign: 'center',
            }}

            alertContainerStyle	={{
                // width: 300,
                }}

            overlayStyle={{
                // width: 100,

            }}

            contentContainerStyle={{
                // width: '90%',
                minHeight: '30%',
            }}

            contentStyle={{
                // flex: 1,
                // paddingVertical: 1,
            }}

            cancelButtonStyle={{
                // width: 120,
                marginRight: 15,
                }}
        
                cancelButtonTextStyle={{
                    fontSize: 18,
                    textAlign: 'center',
                //   fontWeight: 'bold',
                    fontFamily: 'JosefinSans-Bold',
                }}
        
                confirmButtonStyle={{
                // width: 120,
                marginLeft: 15,
                }}
        
                confirmButtonTextStyle={{
                fontSize: 18,
                textAlign: 'center',
                //   fontWeight: 'bold',
                fontFamily: 'JosefinSans-Bold',
                }}

                showProgress={false}
                title={titleAlert}
                message={messageAlert}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showCancelButton={showCancelButton}
                showConfirmButton={showConfirmButton}
                cancelText={cancelText}
                confirmText={confirmText}
                cancelButtonColor="#DD6B55"
                confirmButtonColor={COLORS.danger}
                onCancelPressed={()=>{
                    setAlert(false);
                }}
                onConfirmPressed={() => {
                    setAlert(false);
                }}
            />


        <Box w="100%">
        <Text
            style={{ 
                textAlign: 'center',
                color: COLORS.black,
                fontSize: responsiveFontSize(2),
                fontFamily: 'JosefinSans-Bold',
            }}
        >
            Parcela {foundFarmland?.blocks?.length + 1}
        </Text>
        </Box>
        <Box 
            style={{
                position: 'absolute',
                top: 5,
                right: 5,
            }}
        >
            <TouchableOpacity 
                onPress={()=>{
                    turnOffOverlay();

                    if (treeRedFlag || areaRedFlag){
                        setTreeRedFlag(false);
                        setAreaRedFlag(false);
                    }
                }}
            >
            <Icon name="close" color={COLORS.grey} size={25} />
            </TouchableOpacity>
        </Box>

        <Animated.ScrollView
            decelerationRate={'normal'}
            fadingEdgeLength={2}
            keyboardDismissMode = 'on-drag'
            keyboardShouldPersistTaps = 'handled'
            style={{

            }}
        >
            <View
                style={{
                    minHeight: '70%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 2,
                    paddingBottom: 50,
                }}
            >
                <Box w="100%" px="1"
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 10,
                        paddingBottom: 20,
                    }}
                >
                {  ownerImage ?                  
                            <Image 
                        
                                source={{ uri: ownerImage }}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderColor: COLORS.main,
                                    marginHorizontal: 3,
                                    borderRadius: 120,
                                }}
                            />
                            :

                            <Icon 
                                name="account-circle" 
                                size={80} 
                                color={COLORS.lightgrey} 
                        />
                    } 
                    <Box>
                        <Text
                            style={{
                                fontSize: 14,
                                color: treeRedFlag ? COLORS.red : COLORS.main,
                                fontFamily: 'JosefinSans-Regular',
                                textAlign: 'right',
                            }}
                        >Quantas das {totalTrees - treesFlag} árvores?</Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: areaRedFlag ? COLORS.red : COLORS.main,
                                fontFamily: 'JosefinSans-Regular',
                                textAlign: 'right',
                            }}
                        >
                            Quais dos {(totalArea - areaFlag).toFixed(1)} hectares?
                        </Text>
                    </Box>  
                </Box>  
            <Stack direction="row" mx="3" w="100%">
                    <Box w="100%" px="1">
                        <FormControl isRequired my="1" isInvalid={'plantingYear' in errors}>
                            <FormControl.Label>Ano de plantio</FormControl.Label>

                            <SelectList
                                data={()=>getFullYears2(70)}
                                setSelected={newYear => {
                                    setErrors((prev)=>({...prev, plantingYear: ''}));
                                    setPlantingYear(newYear);
                                }}
                                save="value"
                                placeholder='Escolher ano'
                                searchPlaceholder='Procurar ano'
                                maxHeight={400}
                                fontFamily='JosefinSans-Regular'
                                notFoundText='Ano não encontrado'
                                dropdownTextStyles={{
                                    fontSize: 16,
                                    color: COLORS.black,
                                    padding: 5,
                                }}
                                arrowicon={
                                    <Icon 
                                    // size={35} 
                                    name="arrow-drop-down" 
                                    color={COLORS.main} 
                                    />
                                }
                                closeicon={
                                    <Icon 
                                        name="close" 
                                        size={20} 
                                        color={COLORS.grey}
                                    />
                                }
                                inputStyles={{
                                    fontSize: 15,
                                    color: plantingYear ? COLORS.black : COLORS.grey,
                                }}
                                boxStyles={{
                                    minHeight: 55,
                                    borderRadius: 5,
                                    borderColor: COLORS.lightgrey,
                                    marginTop: 5,
                                }}

                            />
                            {
                                'plantingYear' in errors 
                            ? <FormControl.ErrorMessage 
                            leftIcon={<Icon name="error-outline" size={16} color="red" />}
                            _text={{ fontSize: 'xs'}}>{errors?.plantingYear}</FormControl.ErrorMessage> 
                            : <FormControl.HelperText></FormControl.HelperText>
                            }
                        </FormControl>

                    </Box>
                </Stack>   


            <Box
                style={{

                }}
            >
            <Stack direction="row" w="100%" space={2}>
                <Box w={"48%"}>
                <FormControl isRequired my="2" isInvalid={'usedArea' in errors}>
                    <FormControl.Label>Área Aproveitada</FormControl.Label>
                    <CustomInput
                        width="100%"
                        keyboardType="numeric"
                        textAlign="center"
                        placeholder="Hectares"
                        value={usedArea}
                        onChangeText={newNumber=>{
                            setErrors(prev=>({
                                ...prev, 
                                blockTrees: null, 
                                usedArea: null,
                                treeDensity: null,
                            }))
                            setUsedArea(newNumber)
                        }}
                    />
                </FormControl>
                </Box>

            <Box w="48%"
                style={{
                    justifyContent: 'flex-end',
                }}
            >
            <FormControl isRequired my="2" isInvalid={'blockTrees' in errors}>
                <FormControl.Label>N° de Cajueiros</FormControl.Label>
                <CustomInput
                    width="100%"
                    keyboardType="numeric"
                    textAlign="center"
                    placeholder="Cajueiros"
                    value={blockTrees}
                    onChangeText={newNumber=>{
                        setErrors(prev=>({
                            ...prev, 
                            blockTrees: null, 
                            usedArea: null,
                            treeDensity: null,
                        }))
                        setBlockTrees(newNumber);
                    }}
                />
                </FormControl>
                </Box>
            </Stack>

                {
                    (errors?.blockTrees && errors?.usedArea) &&
                    <Box
                        style={{
                            backgroundColor: COLORS.danger,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: COLORS.ghostwhite, padding: 6, }}> <Icon name="error-outline" size={20} color={COLORS.ghostwhite} /> {errors?.usedArea}</Text>       
                        <Text style={{ fontSize: 14, color: COLORS.ghostwhite, padding: 6, }}> <Icon name="error-outline" size={20} color={COLORS.ghostwhite} /> {errors?.blockTrees}</Text>       
                        <Text style={{ fontSize: 14, color: COLORS.ghostwhite, padding: 6, }}> <Icon name="error-outline" size={20} color={COLORS.ghostwhite} /> {errors?.treeDensity}</Text>        
                    </Box>
                } 

                {
                    (errors?.blockTrees && !errors?.usedArea) &&
                    <Box>
                        <Text style={{ fontSize: 14, color: COLORS.red, padding: 6, }}> <Icon name="error-outline" size={20} color={COLORS.red} /> {errors?.blockTrees}</Text>       
                    </Box>
                } 

                {
                    (!errors?.blockTrees && errors?.usedArea) &&
                    <Box>
                        <Text style={{ fontSize: 14, color: COLORS.red, padding: 6, }}> <Icon name="error-outline" size={20} color={COLORS.red} /> {errors?.usedArea}</Text>       
                    </Box>
                } 

            </Box>

            <Box w="100%"
                style={{ marginTop: (errors?.usedArea && errors?.blockTrees) ? 0 : 0}}
            >
            <FormControl isRequired my="1" isInvalid={'densityMode' in errors}>
        <FormControl.Label>                
            <Text
                style={{
                    fontSize: 16,
                    fontFamily: 'JosefinSans-Regular',
                    color: COLORS.grey,
                    paddingLeft: 15,
                }}
            >
                Compasso
            </Text>
        </FormControl.Label>
        <Stack  direction="row" mx="3" w="100%">
            <Box w="50%" px="1">
                <CheckBox
                    center
                    fontFamily = 'JosefinSans-Bold'
                    containerStyle={{
                        backgroundColor: COLORS.ghostwhite,
                    }}
                    textStyle={{
                        fontWeight: '120',
                        color: isDensityModeRegular ? COLORS.main : COLORS.grey,
                    }}
                    title="Regular"
                    checked={isDensityModeRegular}
                    checkedIcon={
                        <Icon
                            name="check-box"
                            color={COLORS.main}
                            size={30}
                            iconStyle={{ marginRight: 1 }}
                        />
                    }
                    uncheckedIcon={
                        <Icon
                            name="radio-button-unchecked"
                            color={COLORS.grey}
                            size={30}
                            iconStyle={{ marginRight: 1 }}
                        />
                    }
                    onPress={() => {
                        setIsDensityModeRegular(true);
                        setIsDensityModeIrregular(false);
                        setErrors({
                            ...errors,
                            densityMode: '',
                        })
                    }}
                />
            </Box>
            <Box w="50%" px="1">
                <CheckBox
                    center
                    fontFamily = 'JosefinSans-Bold'
                    containerStyle={{
                        backgroundColor: COLORS.ghostwhite,
                    }}
                    textStyle={{
                        fontWeight: '120',
                        color: isDensityModeIrregular ? COLORS.main : COLORS.grey,
                    }}
                    title="Irregular"
                    checked={isDensityModeIrregular}
                    checkedIcon={
                        <Icon
                            name="check-box"
                            color={COLORS.main}
                            size={30}
                            iconStyle={{ marginRight: 1 }}
                        />
                    }
                    uncheckedIcon={
                        <Icon
                            name="radio-button-unchecked"
                            color={COLORS.grey}
                            size={30}
                            iconStyle={{ marginRight: 1 }}
                        />
                    }
                    onPress={() => {
                        setIsDensityModeIrregular(true);
                        setIsDensityModeRegular(false);    
                        setErrors({
                            ...errors,
                            densityMode: '',
                        });
                        setDensityWidth('');  
                        setDensityLength('');
                    }}
                    />
                </Box>
            </Stack>    
                {
                'densityMode' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.densityMode}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
            </FormControl>

        </Box>


        { isDensityModeRegular  && (
        
        <Stack direction="row" mx="3" w="100%">
            <Box w="45%" px="1">
                <FormControl my="1" isRequired isInvalid={'density' in errors}>
                    <FormControl.Label>Comprimento</FormControl.Label>
                    <CustomInput
                        width="100%"
                        textAlign="center"
                        keyboardType="numeric"
                        placeholder="Comprimento"
                        value={densityLength}
                        onChangeText={newNumber=>{
                            setErrors(prev=>({
                                ...prev, 
                                density: '',
                                blockTrees: null, 
                                usedArea: null,
                                treeDensity: null,
                            
                            }))
                            setDensityLength(newNumber)
                        }}
                        />
                        
                    {
                        'density' in errors 
                    ? <FormControl.ErrorMessage 
                    leftIcon={<Icon name="error-outline" size={16} color="red" />}
                    _text={{ fontSize: 'xs'}}>{errors?.density}</FormControl.ErrorMessage> 
                    : <FormControl.HelperText></FormControl.HelperText>
                    }
                </FormControl>
            </Box>
            <Box w="10%" 
                style={{
                    justifyContent: 'center', 
                    alignItems: 'center',
                    paddingTop: ('density' in errors) ? 10 : 20,
                }}
                >
                <Text 
                    style={{ 
                        fontSize: 20,
                    }}
                >
                    X
                </Text>
            </Box>
            <Box w="45%" px="1">
            <FormControl my="1" isRequired isInvalid={'density' in errors}>
                <FormControl.Label>Largura</FormControl.Label>
                <CustomInput
                    width="100%"
                    keyboardType="numeric"
                    textAlign="center"
                    placeholder="Largura"
                    value={densityWidth}
                    onChangeText={newNumber=>{
                        setErrors(prev=>({
                            ...prev, 
                            density: '',
                            blockTrees: null, 
                            usedArea: null,
                            treeDensity: null,
                        }))
                        setDensityWidth(newNumber)
                    }}
                />
                    
                {
                    'density' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.density}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
            </FormControl> 
            </Box>
        </Stack>            
    )}


        <FormControl isRequired my="1" isInvalid={'plantTypes' in errors}>
            <FormControl.Label>Tipo de plantas</FormControl.Label>
            <MultipleSelectList
                setSelected={(type)=>{
                    setErrors(prev=>({...prev, plantTypes: ''}));
                    setPlantTypes(type)}
                }
                data={plantingTypes}
                notFoundText={'Tipo de planta não encontrado'}
                placeholder="Tipo de plantas"
                searchPlaceholder='Seleccionar tipo de plantas'
                save="value"
                label="Tipo de plantas"
                badgeStyles={{
                    backgroundColor: COLORS.main,                        
                }}
                badgeTextStyles={{
                    fontSize: 16
                }}
                arrowicon={
                    <Icon 
                        // size={45} 
                        name="arrow-drop-down" 
                        color={COLORS.main} 
                        />
                    }
                    closeicon={
                        <Icon 
                        name="close" 
                        size={20} 
                        color={COLORS.grey}
                        />
                }
                fontFamily='JosefinSans-Regular'
                dropdownTextStyles={{
                    fontSize: 16,
                    color: COLORS.black,
                    padding: 5,
                }}
                inputStyles={{
                    fontSize: 16,
                    color: '#A8A8A8',
                }}
                boxStyles={{
                    minHeight: 55,
                    borderRadius: 5,
                    borderColor: COLORS.lightgrey,
                }}
                />
            {
                'plantTypes' in errors 
            ? <FormControl.ErrorMessage 
            leftIcon={<Icon name="error-outline" size={16} color="red" />}
            _text={{ fontSize: 'xs'}}>{errors?.plantTypes}</FormControl.ErrorMessage> 
            : <FormControl.HelperText></FormControl.HelperText>
            }
        </FormControl>


    {   plantTypes?.some((el)=>el?.includes('enxert')) 
        && (
            <>
            <FormControl my="1" isRequired isInvalid={'clones' in errors} >
                <FormControl.Label>Clones</FormControl.Label>
                <MultipleSelectList
                    setSelected={(type)=>{
                        setErrors(prev=>({...prev, clones: ''}));
                        setClones(type)}
                    }
                    data={cloneList}
                    notFoundText={'Clone não encontrado'}
                    placeholder="clones"
                    searchPlaceholder='Seleccionar tipo de plantas'
                    save="value"
                    label="Clones"
                    badgeStyles={{
                        backgroundColor: COLORS.main,                        
                    }}
                    badgeTextStyles={{
                        fontSize: 16
                    }}
                    arrowicon={
                        <Icon 
                            // size={45} 
                            name="arrow-drop-down" 
                            color={COLORS.main} 
                        />
                    }
                    closeicon={
                        <Icon 
                            name="close" 
                            size={20} 
                            color={COLORS.grey} 
                        />
                        }
                        fontFamily='JosefinSans-Regular'
                    dropdownTextStyles={{
                        fontSize: 16,
                        color: COLORS.black,
                        padding: 5,
                    }}
                    inputStyles={{
                        fontSize: 16,
                        color: '#A8A8A8',
                    }}
                    boxStyles={{
                        minHeight: 55,
                        borderRadius: 5,
                        borderColor: COLORS.lightgrey,
                    }}
                    />
                {
                    'clones' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.clones}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }     
            </FormControl>

    {clones?.find(clone => clone === "Outro") &&
            <Box w="100%" alignItems={"center"} style={{
                flexDirection: 'row'
            }}>
                <Box w="70%">
                    <FormControl  my="1" isInvalid={'addedClone' in errors}>
                        <FormControl.Label>Adiciona novo clone</FormControl.Label>
                        <CustomInput
                            width="100%"
                            type="text"
                            placeholder="Clone não econtrado na lista"
                            value={addedClone}
                            onChangeText={newClone=>{
                                setErrors({
                                    ...errors,
                                    addedClone: '',
                                })
                                setAddedClone(newClone);
                            }}
                            />
                    {   'addedClone' in errors ?
                        <FormControl.ErrorMessage 
                            leftIcon={<Icon name="error-outline" size={16} color="red" />}
                            _text={{ fontSize: 'xs'}}>{errors?.addedClone}</FormControl.ErrorMessage> 
                        :
                        <FormControl.HelperText></FormControl.HelperText>
                        }
                    </FormControl>
                </Box>
                <Box
                    // w="15%"
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        // backgroundColor: 'red',
                        position: 'relative',
                        bottom: -5,
                        left: 0,
                    }}
                    >
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginHorizontal: 10,
                            marginTop: 10,
                            padding: 5,
                            borderRadius: 100,
                            backgroundColor: COLORS.main,
                            borderColor: COLORS.main,
                            borderWidth: 1,
                        }}


                        onPress={()=>{
                            if (addedClone){
                                setClones(prev=>[...prev, addedClone]);

                                setAddedClone('');
                            }
                            else{
                                setErrors({
                                    ...errors,
                                    addedClone: 'Indica novo clone'
                                });
                            }
                        }}
                    >
                        <Icon name="arrow-downward" size={35} color={COLORS.ghostwhite} />
                    </TouchableOpacity>
                </Box>
                <Box w="15%">

                </Box>

            </Box>
    }
            </>
        )        
        }

    {  (plantTypes.length > 0 && sameTypeTreesList.length > 0) &&
        <Box 
            w="100%" 
            my="5"
        >
        
        {
            (errors?.sameTypeTrees) && 
            <Box style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                }}>
                    <Icon name="error-outline" size={26} color="red" />
                    <Text
                    style={{
                        color: COLORS.red,
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                        paddingLeft: 5, 
                        marginLeft: 5,
                    }}
                >{errors?.sameTypeTrees}</Text>
                </Box>
            }
        
            <Box 
                w="100%"
                mb="2"
            >
                <Stack direction="row" space={2} >
                    <Box w="65%">
                        <Text
                            style={{
                                color: COLORS.main,
                                fontSize: 16,
                                fontFamily: 'JosefinSans-Bold',
                            }}
                        >Tipos de plantas</Text>
                    </Box>
                    <Box w="35%">
                        <Text
                            style={{
                                color: COLORS.main,
                                fontSize: 16,
                                fontFamily: 'JosefinSans-Bold',
                            }}
                        >Cajueiros</Text>
                    </Box>

                </Stack>
            </Box>


            {
            sameTypeTreesList?.map((sameTypeTree, index)=>(
                    <Box 
                        w="100%" 
                        key={index} 
                        mb="1"
                    >
                        <Stack 
                            direction="row" 
                            w="100%" 
                            space={2} 
                            // mt="1"
                        >
                            <Box w="65%"
                                style={{ 
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'JosefinSans-Regular',
                                        color: COLORS.grey,
                                    }}
                                >
                                    <Icon name="arrow-forward" color={COLORS.grey} size={10} /> {sameTypeTree?.treeType}
                                </Text>
                            </Box>
                            <Box w="35%">
                                <CustomInput
                                    width="90%"
                                    textAlign="center"
                                    keyboardType="numeric"
                                    placeholder="Cajueiros"
                                    value={sameTypeTree?.trees}
                                    onChangeText={newTrees=>{
                                        setErrors(prev=>({...prev, sameTypeTrees: ''}));
                                        setSameTypeTreesList(sameTypeTreesList.map((object)=>{
                                            if (object?.treeType === sameTypeTree?.treeType){
                                                object.trees = newTrees;
                                            }
                                            return object;
                                        }));

                                    }}
                                />
                            </Box>
                        </Stack>
                    </Box>
                ))
            }
        </Box>
    }
    <View
        style={{
            width: '100%',

        }}
    >
        <Button
            title="Salvar Parcela"
            titleStyle={{
                color: COLORS.ghostwhite,
                fontFamily: 'JosefinSans-Bold',
            }}
            iconPosition="right"

            containerStyle={{
                backgroundColor: COLORS.main,
                borderRadius: 10,
                width: '100%',

            }}
            type="outline"
            onPress={()=>{
                // validate data before you update flags
                let blockData = {
                    plantingYear, 
                    usedArea, 
                    densityWidth,
                    densityLength,
                    blockTrees,
                    plantTypes,
                    clones,
                    isDensityModeIrregular,
                    isDensityModeRegular,
                    sameTypeTreesList,
                }
                // if any required data is not validated
                // a alert message is sent to the user   
                if (!validateBlockData(blockData, errors, setErrors)) {
                    setAlert(true);
                    // setValidated(true);
                    setTitleAlert(errorMessages.farmlandError.title);
                    setMessageAlert(errorMessages.farmlandError.message);
                    setShowCancelButton(errorMessages.farmlandError.showCancelButton);
                    setShowConfirmButton(errorMessages.farmlandError.showConfirmButton);
                    setCancelText(errorMessages.farmlandError.cancelText);
                    setConfirmText(errorMessages.farmlandError.confirmText);

                    return;
                }
                // created the validated data object to be passed to the FarmlandModal component
                // let retrievedBlockData = validateBlockData(blockData, errors, setErrors);

                setTreesFlag(prev=>prev + parseInt(blockTrees));
                setAreaFlag(prev=>prev + parseFloat(usedArea));

                setAddBlockIsOn(true); 

                setAreaRedFlag(false);
                setTreeRedFlag(false);
            }}
        />
    </View>
        </View>
        </Animated.ScrollView>
    </Animated.View>
    </SafeAreaView>
</Modal>

 )
}