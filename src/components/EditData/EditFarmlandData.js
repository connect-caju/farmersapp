
import React, { useState, useEffect, useCallback } from "react";
import { 
    Text, TouchableOpacity, SafeAreaView, StyleSheet, 
    ScrollView, TextInput, View,
 Animated, } from 'react-native';
import { Overlay, Icon, Button, CheckBox } from "@rneui/base";
import { Box, FormControl, Stack, Select, CheckIcon, Center, Radio,  } from 'native-base';
import { MultipleSelectList, SelectList  } from 'react-native-dropdown-select-list';
import Modal from 'react-native-modal';
import ConfirmData from './ConfirmDataCopy';
import COLORS from "../../consts/colors";
import { getFullYears, getFullYears2 } from "../../helpers/dates";
import { plantingTypes } from "../../consts/plantingTypes";
import cloneList from "../../consts/clones";

import { crops } from '../../consts/crops';

import { CustomInput } from '../Inputs/CustomInput';
import validateEditedFarmlandMainData from '../../helpers/validateEditedFarmlandMainData';

import { useUser } from "@realm/react";
import { realmContext } from '../../models/realmContext';
import validateEditedBlockData from "../../helpers/validateEditedBlockData";
const {useRealm} = realmContext;


const EditFarmlandData = ({ 
    scale,
    resizeBox, 
    isOverlayVisible, 
    setIsOverlayVisible,
    isConfirmDataVisible,
    setIsConfirmDataVisible,

    ownerName,
    resource,
    blocks,
    
    resourceName,
    dataToBeUpdated,

    newDataObject,
    oldDataObject,
    setNewDataObject,
    setOldDataObject,

    // farmland main data
    description, setDescription, consociatedCrops, setConsociatedCrops,
    totalArea, setTotalArea, trees, setTrees,

    oldDescription, setOldDescription, oldConsociatedCrops,
    setOldConsociatedCrops, oldTotalArea, setOldTotalArea,
    oldTrees, setOldTrees,

    // block data
    setBlockId,
    blockId,

    plantingYear, setPlantingYear, blockTrees, setBlockTrees,
    usedArea, setUsedArea, densityWidth,  setDensityWidth,
    densityLength, setDensityLength, plantTypes, setPlantTypes,
    clones, setClones, addedClone, setAddedClone,
    selected, setSelected,
    isDensityModeIrregular, setIsDensityModeIrregular,
    isDensityModeRegular, setIsDensityModeRegular, sameTypeTreesList,
    setSameTypeTreesList, remainingArea, setRemainingArea,

    oldBlockId, etOldBlockId, oldPlantingYear, setOldPlantingYear,
    oldBlockTrees, setOldBlockTrees, oldUsedArea, setOldUsedArea,
    oldDensityWidth, setOldDensityWidth, oldDensityLength,
    setOldDensityLength, oldPlantTypes, setOldPlantTypes,
    oldClones, setOldClones, addedOldClone, setAddedOldClone,
    isOldDensityModeIrregular,
    setIsOldDensityModeIrregular, isOldDensityModeRegular,
    setIsOldDensityModeRegular, oldSameTypeTreesList,
    setOldSameTypeTreesList, oldRemainingArea, setOldRemainingArea,

    isEditBlockVisible, setIsEditBlockVisible,
    setAutoRefresh, autoRefresh,

})=>{

    const realm = useRealm();
    const user = useUser();
    const customUserData = user?.customData;

    // // ----------------------------------------------------
    const [errors, setErrors] = useState({});
    const [overlayTitle, setOverlayTitle] = useState('');

    const [editBlockIsOn, setEditBlockIsOn] = useState(false);
    const [isSameTypeTreesUpdated, setIsSameTypeTreesUpdated] = useState(false);

    
    useEffect(()=>{

        let selectedClones = [];
        let mergedSameTypeTrees = [];
        const filteredPlantTypes = plantTypes.filter(plantType=>!plantType.includes('enxer'));
        if (plantTypes.filter(plantType=>plantType.includes('enxer')).length > 0){
            selectedClones = clones?.map(clone=>`Clone: ${clone}`);
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


    useEffect(()=>{
        // save the block if everything is fine
        if (editBlockIsOn){
            setEditBlockIsOn(false);
        }

        // find out the remaing area
        if (isEditBlockVisible) {
            const totalArea = resource?.totalArea;
            const blocksAreas = resource?.blocks?.map(block=>block?.usedArea)?.reduce((acc, el)=> acc + el, 0);
            const remainingArea = totalArea - blocksAreas;
            setRemainingArea(remainingArea);
        }

    }, [ 
        editBlockIsOn,
        isEditBlockVisible,
        resource, 
    ]);



    useEffect(()=>{
        // The farmland main data need to be updated
        // get the existing data associated with the farmland and
        // keep it in two different states: current and old
        if (dataToBeUpdated === 'farmlandMainData' && resourceName === 'Farmland'){
            setDescription(resource?.description);
            setConsociatedCrops(resource?.consociatedCrops);
            setTotalArea(resource?.totalArea);
            setTrees(resource?.trees);

            setOverlayTitle('Actualizar dados do pomar.');

            setOldDescription(resource?.description);
            setOldConsociatedCrops(resource?.consociatedCrops);
            setOldTotalArea(resource?.totalArea);
            setOldTrees(resource?.trees);
        }

        if (dataToBeUpdated === 'plantType' && resourceName === 'Farmland') {

            // just set the title and get the form to supply new information
            // plantType needs no old data for the update
            setOverlayTitle('Actualizar tipos de planta.');
            
        }

        // The farmland block is to be updated
        if (dataToBeUpdated === 'blockData' && resourceName === 'Farmland') {

            const block = resource?.blocks.find((block)=>block._id === blockId);
            setPlantingYear(block?.plantingYear);
            setUsedArea(block?.usedArea);
            setBlockTrees(block?.trees);
            if (block?.density.mode === 'Regular') {
                setDensityWidth(block?.density.width);
                setDensityLength(block?.density.length);
                setOldDensityWidth(block?.density.width);
                setOldDensityLength(block?.density.length);
                setIsDensityModeIrregular(false);
                setIsDensityModeRegular(true);
                setIsOldDensityModeIrregular(false);
                setIsOldDensityModeRegular(true);
            }
            else{
                setIsDensityModeIrregular(true);
                setIsDensityModeRegular(false);
                setIsOldDensityModeIrregular(true);
                setIsOldDensityModeRegular(false);
            }

            setOverlayTitle('Actualizar parcela de cajueiros.');
            
            setOldPlantingYear(block?.plantingYear);
            setOldUsedArea(block?.usedArea);
            setOldBlockTrees(block?.trees);
        }

        // whenever the dataToBeUpdated; resourceName; or blockId changes, 
        // I want to make sure the state associated to this block changes also
    }, [ dataToBeUpdated, resourceName, blockId, ]);

    const onConfirmUpdate = (dataToBeUpdated, resourceName)=> {
        
        const newData = {};
        const oldData = {};
        
        if (dataToBeUpdated === 'farmlandMainData' && resourceName === 'Farmland') {

            if(dataToBeUpdated === 'farmlandMainData' && !validateEditedFarmlandMainData({
                description, consociatedCrops, totalArea,
                trees, oldDescription, oldConsociatedCrops,
                oldTotalArea, oldTrees,
                blocks,
            }, errors, setErrors, dataToBeUpdated, resourceName)) {

                return ;
            }
            else {
                const validatedData = validateEditedFarmlandMainData({
        
                    description, consociatedCrops, totalArea,
                    trees, oldDescription, oldConsociatedCrops,
                    oldTotalArea, oldTrees,
                    blocks,
                }, errors, setErrors, dataToBeUpdated, resourceName);
    
                // new incoming data
                newData['description'] = validatedData?.description;
                newData['consociatedCrops'] = validatedData?.consociatedCrops;
                newData['totalArea'] = validatedData?.totalArea;
                newData['trees'] = validatedData?.trees;
        
                // old data
                oldData['description'] = oldDescription;
                oldData['consociatedCrops'] = oldConsociatedCrops;
                oldData['totalArea'] = oldTotalArea;
                oldData['trees'] = oldTrees;
            }
            
        }

        if (dataToBeUpdated === 'plantType' && resourceName === 'Farmland') {

            if (dataToBeUpdated === 'plantType' && !validateEditedBlockData({
                plantingYear, blockTrees, usedArea,
                isDensityModeIrregular, isDensityModeRegular, densityLength,
                densityWidth, plantTypes, clones, sameTypeTreesList, 
                remainingArea, 
            }, errors, setErrors, dataToBeUpdated, resourceName, resource, blockId)) {
                return ;
            }

            const validatedData = validateEditedBlockData({    
                plantingYear, blockTrees, usedArea,
                isDensityModeIrregular, isDensityModeRegular, densityLength,
                densityWidth, plantTypes, clones, sameTypeTreesList, 
                remainingArea,
            }, errors, setErrors, dataToBeUpdated, resourceName, resource, blockId);
            
            // incoming data
            newData['plantTypes'] = validatedData?.plantTypes;
            newData['sameTypeTrees'] = validatedData?.sameTypeTrees;
            
        }

        if (dataToBeUpdated === 'blockData' && resourceName === 'Farmland') {


            if (dataToBeUpdated === 'blockData' && !validateEditedBlockData({
                plantingYear, oldPlantingYear,  blockTrees, oldBlockTrees,
                usedArea, oldUsedArea,  isDensityModeIrregular, isOldDensityModeIrregular,
                isDensityModeRegular, isOldDensityModeRegular, densityLength, oldDensityLength,
                densityWidth, oldDensityWidth, plantTypes, oldPlantTypes, clones, oldClones,
                 sameTypeTreesList, oldSameTypeTreesList,
                remainingArea, oldRemainingArea,
            }, errors, setErrors, dataToBeUpdated, resourceName, resource, blockId)) {
                return ;
            }


            const validatedData = validateEditedBlockData({    
                plantingYear, blockTrees, usedArea,
                isDensityModeIrregular, isDensityModeRegular, densityLength,
                densityWidth, plantTypes, clones, sameTypeTreesList, 
                remainingArea,
            }, errors, setErrors, dataToBeUpdated, resourceName, blockId);

            // incoming data
            newData['plantingYear'] = validatedData?.plantingYear;
            newData['density'] = validatedData?.density;
            newData['trees'] = validatedData?.trees;
            newData['usedArea'] = validatedData?.usedArea;

            // old data
            oldData['plantingYear'] = oldPlantingYear;
            oldData['density'] = {
                mode: isOldDensityModeRegular ? 'Regular' : 'Irregular',
                length: isOldDensityModeRegular ? oldDensityLength : '',
                width: isOldDensityModeRegular ? oldDensityWidth : '',
            };
            oldData['trees'] = oldBlockTrees;
            oldData['usedArea'] = oldUsedArea;

        }

        setNewDataObject(newData);
        setOldDataObject(oldData);


        setIsOverlayVisible(false);
        setIsEditBlockVisible(false);
        setIsConfirmDataVisible(true);
    }


    const toggleOverlay = () => {
        setIsOverlayVisible(!isOverlayVisible);
      };


    return (
        <Modal
            isVisible={isOverlayVisible}
            supportedOrientations={['portrait', 'landscape']}
            propagateSwipe
            avoidKeyboard
            animationIn={'zoomIn'}
            animationInTiming={600}
            animationOut={'zoomOut'}
            hideModalContentWhileAnimating={true}
            onBackButtonPress={()=>{
                setIsOverlayVisible(false);
            }}
            onBackdropPress={()=>{
                setIsOverlayVisible(false);
            }}
            onSwipeComplete={()=>{
                setIsOverlayVisible(false);            
            }}
            swipeDirection={["left", "right"]}
        >

            <View>
            <View 
                style={{ 
                    width: '100%',
                    minHeight: 50,
                    flexDirection: 'row',
                    backgroundColor: COLORS.dark,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                }}
            >
                <View
                    style={{ width: '90%'}}
                >
                    <Text
                        style={{ 
                            fontFamily: 'JosefinSans-Bold', 
                            fontSize: 18,
                            // fontWeigth: 'bold',
                            color: COLORS.ghostwhite,
                            paddingTop: 15,
                            textAlign: 'center',
                        }}
                        >
                        {overlayTitle}
                    </Text>
                </View>
                <View
                    style={{ width: '10%', justifyContent: 'center', alignItems: 'center',}}
                >
                    <Icon 
                        name="close" 
                        size={30} 
                        color={COLORS.ghostwhite} 
                        onPress={()=>{
                            setIsOverlayVisible(false);
                            setIsEditBlockVisible(false);
                        }}
                    />
                </View>
            </View>







            <ScrollView>
            <View
                flex={1}
                onStartShouldSetResponder={()=>true}
                style={{
                    backgroundColor: COLORS.ghostwhite,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                }}
            >

            {/* update the farmland block data */}

            {
                (dataToBeUpdated === 'blockData' && resourceName === 'Farmland' && blockId) &&
                <Stack direction="column">
                    <Box w="100%"
                        style={{
                            // position: 'absolute',
                            // top: 5,
                            // right: 0,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                color: false ? COLORS.red : COLORS.pantone,
                                fontFamily: 'JosefinSans-Regular',
                                textAlign: 'right',
                                lineHeight: 15,
                            }}
                        >
                            Este pomar tem...
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: false ? COLORS.red : COLORS.pantone,
                                fontFamily: 'JosefinSans-Regular',
                                textAlign: 'right',
                                lineHeight: 15,
                            }}
                        >
                            {resource?.blocks?.length} parcelas;             
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: false ? COLORS.red : COLORS.pantone,
                                fontFamily: 'JosefinSans-Regular',
                                textAlign: 'right',
                                lineHeight: 15,
                            }}
                        >
                            {resource.trees} árvores;
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: false ? COLORS.red : COLORS.pantone,
                                fontFamily: 'JosefinSans-Regular',
                                textAlign: 'right',
                                lineHeight: 15,
                            }}
                        >
                            {remainingArea?.toFixed(2)} hectares disponíveis.
                        </Text>
                    </Box> 

                <Stack direction="row" w="100%" space={1}>
                    <Box w="100%">
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
                                        color: COLORS.black,
                                    }}
                                    boxStyles={{
                                        minHeight: 55,
                                        borderRadius: 5,
                                        borderColor: COLORS.lightgrey,
                                        marginTop: 5,
                                    }}

                                    
                                />

                                {/* <Select
                                    selectedValue={plantingYear}
                                    accessibilityLabel="Ano de plantio"
                                        placeholder="Escolha o ano"
                                    minHeight={55}
                                    _selectedItem={{
                                        bg: 'teal.600',
                                        fontSize: 'lg',
                                        endIcon: <CheckIcon size="5" />,
                                    }}
                                    dropdownCloseIcon={plantingYear 
                                            ? <Icon 
                                                name="close" 
                                                size={25} 
                                                color="grey" 
                                                onPress={()=>setPlantingYear('')} 
                                            /> 
                                            : <Icon 
                                                size={40} 
                                                name="arrow-drop-down" 
                                                color={COLORS.pantone} 
                                            />
                                        }
                                    mt={1}
                                    onValueChange={newYear => {
                                        setErrors((prev)=>({...prev, plantingYear: ''}));
                                        setPlantingYear(newYear);
                                    }}
                                >
                                    {
                                        getFullYears(100)?.map((year, index)=>(
                                            <Select.Item key={index} label={`${year}`} value={year} />
                                        ))
                                    }
                                </Select> */}
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

                <FormControl isRequired my="2" isInvalid={'usedArea' in errors}>
                    <FormControl.Label>Área Aproveitada</FormControl.Label>
                        <CustomInput
                            width="100%"
                            keyboardType="numeric"
                            textAlign="center"
                            placeholder="Hectares"
                            value={usedArea ? usedArea?.toString() : ''}
                            onChangeText={newNumber=>{
                                setErrors(prev=>({
                                    ...prev, 
                                    blockTrees: null, 
                                    usedArea: null,
                                    treeDensity: null,
                                    plantingYear: null,
                                }))
                                setUsedArea(newNumber)
                            }}
                        />
                            
                    {
                        'usedArea' in errors 
                    ? <FormControl.ErrorMessage 
                    leftIcon={<Icon name="error-outline" size={16} color="red" />}
                    _text={{ fontSize: 'xs'}}>{errors?.usedArea}</FormControl.ErrorMessage> 
                    : <FormControl.HelperText></FormControl.HelperText>
                    }
                </FormControl>

                <FormControl isRequired my="2" isInvalid={'blockTrees' in errors}>
                    <FormControl.Label>N° de Cajueiros</FormControl.Label>
                    <CustomInput
                        width="100%"
                        keyboardType="numeric"
                        textAlign="center"
                        placeholder="Cajueiros"
                        value={blockTrees ? blockTrees?.toString() : ''}
                        onChangeText={newNumber=>{
                            setErrors(prev=>({
                                ...prev, 
                                blockTrees: null, 
                                usedArea: null,
                                treeDensity: null,
                                plantingYear: null,
                            }));
                            setBlockTrees(parseInt(newNumber));
                        }}
                    />
                        
                    {
                        'blockTrees' in errors 
                        ? <FormControl.ErrorMessage 
                            style={{
                                paddingVertical: 5,
                            }}
                        leftIcon={<Icon name="error-outline" size={16} color="red" />}
                        _text={{ fontSize: 'xs', paddingRight: 10, }}>{errors?.blockTrees}</FormControl.ErrorMessage> 
                        : <FormControl.HelperText></FormControl.HelperText>
                    }
                </FormControl>


                <FormControl isRequired my="1" isInvalid={'densityMode' in errors}>
                    <FormControl.Label>                
                        <Text
                            style={{
                                fontSize: 16,
                                fontFamily: 'JosefinSans-Regular',
                                color: COLORS.grey,
                                paddingHorizontal: 15,
                            }}
                        >Compasso</Text>
                    </FormControl.Label>
                    <Stack  direction="row" w="100%">
                        <Box w="50%" >
                        <CheckBox
                                center
                                fontFamily = 'JosefinSans-Bold'
                                containerStyle={{
                                    backgroundColor: COLORS.ghostwhite,
                                }}
                                textStyle={{
                                    fontWeight: '120',
                                    color: isDensityModeRegular ? COLORS.pantone : COLORS.grey,
                                }}
                                title="Regular"
                                checked={isDensityModeRegular}
                                checkedIcon={
                                    <Icon
                                        name="check-box"
                                        color={COLORS.pantone}
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
                                        // densityMode: '',
                                        blockTrees: null, 
                                        usedArea: null,
                                        treeDensity: null,
                                        plantingYear: null,
                                    })

                                }}
                                />
                        </Box>
                        <Box w="50%">
                            <CheckBox
                                center
                                fontFamily = 'JosefinSans-Bold'
                                containerStyle={{
                                    backgroundColor: COLORS.ghostwhite,
                                }}
                                textStyle={{
                                    
                                    fontWeight: '120',
                                    color: isDensityModeIrregular ? COLORS.pantone : COLORS.grey,
                                }}
                                title="Irregular"
                                checked={isDensityModeIrregular}
                                checkedIcon={
                                    <Icon
                                        name="check-box"
                                        color={COLORS.pantone}
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
                                        // densityMode: '',
                                        blockTrees: null, 
                                        usedArea: null,
                                        treeDensity: null,
                                        plantingYear: null,
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

            { isDensityModeRegular  && (
            
            <Stack direction="row" w="100%">
                <Box w="45%" >
                    <FormControl my="1" isRequired isInvalid={'density' in errors}>
                        <FormControl.Label>Comprimento</FormControl.Label>
                        <CustomInput
                            width="100%"
                            textAlign="center"
                            keyboardType="numeric"
                            placeholder="Comprimento"
                            value={densityLength ? densityLength?.toString() : ''}
                            onChangeText={newNumber=>{
                                setErrors(prev=>({
                                    ...prev, 
                                    blockTrees: null, 
                                    usedArea: null,
                                    treeDensity: null,
                                    plantingYear: null,
                                }))
                                setDensityLength(parseInt(newNumber));
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
                <Box w="45%">
                <FormControl my="1" isRequired isInvalid={'density' in errors}>
                    <FormControl.Label>Largura</FormControl.Label>
                    <CustomInput
                        width="100%"
                        keyboardType="numeric"
                        textAlign="center"
                        placeholder="Largura"
                        value={densityWidth ? densityWidth?.toString() : ''}
                        onChangeText={newNumber=>{
                            setErrors(prev=>({
                                ...prev, 
                                blockTrees: null, 
                                usedArea: null,
                                treeDensity: null,
                                plantingYear: null,
                            }))
                            setDensityWidth(parseInt(newNumber));
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
        </Stack>
            }

        {
            
            (dataToBeUpdated === 'plantType' && resourceName === 'Farmland') &&
            <Stack direction="column">
                <Box>
                    <Text
                        style={{
                            textAlign: 'right',
                            fontSize: 14,
                            color: COLORS.pantone,
                            fontFamily: 'JosefinSans-Regular',

                        }}
                    >
                        Esta parcela tem...
                    </Text>
                    <Text
                        style={{
                            textAlign: 'right',
                            fontSize: 14,
                            color: COLORS.pantone,
                            fontFamily: 'JosefinSans-Regular',
                        }}
                    >
                        {/* {resource?.blocks?.find(block=>block?._id === blockId).trees} cajueiros. */}
                        {blockTrees} cajueiros
                    </Text>

                </Box>
            <FormControl isRequired my="1" isInvalid={'plantTypes' in errors}>
                <FormControl.Label>Tipo de plantas</FormControl.Label>
                <MultipleSelectList
                    setSelected={(type)=>{
                        setErrors(prev=>({...prev, plantTypes: null}));
                        setPlantTypes(type);
                        setIsSameTypeTreesUpdated(true);

                    }}
                    data={plantingTypes}
                    notFoundText={'Tipo de planta não encontrado'}
                    placeholder="Tipo de plantas"
                    searchPlaceholder='Escolher tipos de plantas'
                    save="value"
                    label="Tipos de plantas"
                    badgeStyles={{
                        backgroundColor: COLORS.pantone,                        
                    }}
                    badgeTextStyles={{
                        fontSize: 16
                    }}

                    arrowicon={
                        <Icon 
                            // size={45} 
                            name="arrow-drop-down" 
                            color={COLORS.pantone} 
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
                            setErrors(prev=>({...prev, clones: null}));
                            setClones(type);
                            setIsSameTypeTreesUpdated(true);               
                        }}
                        data={cloneList}
                        notFoundText={'Clone não encontrado'}
                        placeholder="clones"
                        save="value"
                        label="Clones"
                        badgeStyles={{
                            backgroundColor: COLORS.pantone,                        
                        }}
                        arrowicon={
                            <Icon 
                                // size={20} 
                                name="arrow-drop-down" 
                                color={COLORS.pantone} 
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
                            fontSize: 18,
                        }}
                        inputStyles={{
                            fontSize: 16,
                            color: '#A8A8A8',
                        }}
                        boxStyles={{
                            borderRadius: 4,
                            minHeight: 55,
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
                                        addedClone: null,
                                    });
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
                                backgroundColor: COLORS.pantone,
                                borderColor: COLORS.pantone,
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

                </>
            )        
            }


            
        {  (plantTypes.length > 0 && sameTypeTreesList.length > 0) &&
            <Box 
                w="100%" 
                my="5"
                style={{     }}
            >

            {
                (errors?.sameTypeTrees) && 
                    <Box style={{
                            flexDirection: 'row',
                        }}>
                            <Icon name="error-outline" size={26} color="red" />
                            <Text
                            style={{
                                color: COLORS.red,
                                fontSize: 14,
                                fontFamily: 'JosefinSans-Regular',
                                paddingLeft: 5, 
                            }}
                        >
                            {errors?.sameTypeTrees}
                        </Text>
                    </Box>
                }


                <Box 
                    w="100%"
                    mb="2"
                    style={{
                        // backgroundColor: COLORS.pantone,
                        // borderTopLeftRadius: 20,
                        // borderTopRightRadius: 20,
                        // borderWidth: 2, 
                        // borderColor: COLORS.pantone,

                    }}
                >
                    <Stack direction="row" space={2} >
                        <Box w="65%">
                            <Text
                                style={{
                                    color: COLORS.pantone,
                                    fontSize: 16,
                                    fontFamily: 'JosefinSans-Bold',
                                }}
                            >
                                Tipos de plantas
                            </Text>
                        </Box>
                        <Box w="35%">
                            <Text
                                style={{
                                    color: COLORS.pantone,
                                    fontSize: 16,
                                    fontFamily: 'JosefinSans-Bold',
                                }}
                            >
                                Cajueiros
                            </Text>
                        </Box>
                    </Stack>
                </Box>

            { sameTypeTreesList?.map((sameTypeTree, index)=>(
                <Box 
                    key={index} 
                    w="100%" 
                    // px="5" 
                    mb="1"
                    style={{
                        // borderColor: COLORS.lightgrey,
                        // borderWidth: 2,
                    }}
                >
                    <Stack direction="row" w="100%" space={2} >
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
                            <Icon name="arrow-forward" color={COLORS.grey} size={10} />   {sameTypeTree?.treeType}
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
                                    setErrors(prev=>({...prev, sameTypeTrees: null}));
                                    setSameTypeTreesList(sameTypeTreesList.map((object)=>{
                                        if (object?.treeType === sameTypeTree?.treeType){
                                            object.trees = parseInt(newTrees);
                                        }
                                        return object;
                                    }));

                                }}
                            />
                        </Box>
                    </Stack>
                </Box>
                ))}
            </Box>
            }

            </Stack>
            }



            {/* update the farmland main data */}

            {
                (dataToBeUpdated === 'farmlandMainData' && resourceName === 'Farmland') &&
                <Stack direction="column">

                {
                    (errors?.areaInconsistencies || errors?.treesInconsistencies) &&
                    <Box
                        style={{
                            backgroundColor: COLORS.danger,
                        }}
                    >
                    {
                        errors?.areaInconsistencies && <Text style={{ fontSize: 14, color: COLORS.ghostwhite, padding: 6, }}> <Icon name="error-outline" size={20} color={COLORS.ghostwhite} /> {errors?.areaInconsistencies}</Text>       
                    }
                    {
                        errors?.treesInconsistencies && <Text style={{ fontSize: 14, color: COLORS.ghostwhite, padding: 6, }}> <Icon name="error-outline" size={20} color={COLORS.ghostwhite} /> {errors?.treesInconsistencies}</Text>       
                    }
                    </Box>
                } 

                <FormControl isRequired my="1" isInvalid={'description' in errors}>
                        <FormControl.Label>Localização do Pomar</FormControl.Label>
                        <CustomInput
                            width="100%"
                            type="text"
                            placeholder="Descrição da localização"
                            value={description}
                            onChangeText={newDescription=>{
                                setErrors(prev=>({
                                    ...prev, 
                                    consociatedCrops: '',
                                    totalArea: '',
                                    trees: '',
                                    description: '',
                                
                                }))
                                setDescription(newDescription)
                            }}
                            />
                        {
                        'description' in errors 
                        ? <FormControl.ErrorMessage 
                        leftIcon={<Icon name="error-outline" size={16} color="red" />}
                        _text={{ fontSize: 'xs'}}>{errors?.description}</FormControl.ErrorMessage> 
                        : <FormControl.HelperText></FormControl.HelperText>
                        }
                    </FormControl>

                    <FormControl my="1" isRequired isInvalid={'consociatedCrops' in errors}>
                        <FormControl.Label>Culturas consociadas</FormControl.Label>
                        <MultipleSelectList
                            setSelected={(crop)=>{
                                setErrors(prev=>({
                                    ...prev, 
                                    consociatedCrops: '',
                                    totalArea: '',
                                    trees: '',
                                    description: '',
                                }));
                                setConsociatedCrops(crop);
                            }}
                            data={crops}
                            notFoundText={'Tipo de cultura não encontrada'}
                            save="value"
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
                                fontSize: 18,
                            }}
                            inputStyles={{
                                fontSize: 16,
                                color: '#A8A8A8',
                            }}
                            badgeStyles={{
                                backgroundColor: COLORS.pantone,
                            }}
                            boxStyles={{
                                borderRadius: 4,
                                minHeight: 55,
                            }}
                            label="Culturas"
                            placeholder="Culturas consociadas"
                        />
                        {
                        'consociatedCrops' in errors 
                        ? <FormControl.ErrorMessage 
                        leftIcon={<Icon name="error-outline" size={14} color="red" />}
                        _text={{ fontSize: 'xs'}}>{errors?.consociatedCrops}</FormControl.ErrorMessage> 
                        : 
                        <FormControl.HelperText></FormControl.HelperText>
                        }
                    </FormControl>

                    <FormControl isRequired my="2" isInvalid={'totalArea' in errors}>
                        <FormControl.Label>Área Total Declarada</FormControl.Label>
                        <CustomInput
                            width="100%"
                            keyboardType="numeric"
                            textAlign="center"
                            placeholder="Hectares"
                            value={totalArea ? totalArea?.toString() : ''}
                            onChangeText={newNumber=>{
                                setErrors(prev=>({
                                    ...prev, 
                                    consociatedCrops: '',
                                    totalArea: '',
                                    trees: '',
                                    description: '',
                                    areaInconsistencies: '',
                                }))
                                setTotalArea(Number(newNumber))
                            }}
                        />
                            
                        {
                            'totalArea' in errors 
                        ? <FormControl.ErrorMessage 
                        leftIcon={<Icon name="error-outline" size={16} color="red" />}
                        _text={{ fontSize: 'xs'}}>{errors?.totalArea}</FormControl.ErrorMessage> 
                        : <FormControl.HelperText></FormControl.HelperText>
                        }
                    </FormControl>

                    <FormControl isRequired my="2" isInvalid={'trees' in errors}>
                    <FormControl.Label>N° Total de Cajueiros</FormControl.Label>
                    <CustomInput
                        width="100%"
                        keyboardType="numeric"
                        textAlign="center"
                        placeholder="Cajueiros"
                        value={trees ? trees?.toString() : ''}
                        onChangeText={newNumber=>{
                            setErrors(prev=>({
                                ...prev, 
                                consociatedCrops: '',
                                totalArea: '',
                                trees: '',
                                description: '',
                                treesInconsistencies: '',
                            }))
                            setTrees(newNumber)
                        }}
                    />
                        
                    {
                        'trees' in errors 
                        ? <FormControl.ErrorMessage 
                        leftIcon={<Icon name="error-outline" size={16} color="red" />}
                        _text={{ fontSize: 'xs'}}>{errors?.trees}</FormControl.ErrorMessage> 
                        : <FormControl.HelperText></FormControl.HelperText>
                    }
                    </FormControl>

                </Stack>

            }
                <Button
                    title="Confirmar Dados"
                    titleStyle={{
                        color: COLORS.ghostwhite,
                        fontFamily: 'JosefinSans-Bold',
                    }}
                    iconPosition="right"

                    containerStyle={{
                        backgroundColor: COLORS.pantone,
                        borderRadius: 10,
                        marginTop: 30,
                    }}
                    type="outline"
                    onPress={()=>{
                        onConfirmUpdate(dataToBeUpdated, resourceName);
                    }}
                />
            </View>
                </ScrollView>
        </View>
    
    </Modal>

    )
}


    
export default EditFarmlandData;