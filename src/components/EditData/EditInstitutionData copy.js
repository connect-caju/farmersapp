
import React, { useState, useEffect, useCallback } from "react";
import { Text, SafeAreaView, StyleSheet, ScrollView, TextInput, View } from 'react-native';
import { Overlay, Icon, Button, CheckBox } from "@rneui/base";
import { Box, FormControl, Stack, Select, CheckIcon, Center, Radio,  } from 'native-base';

import ConfirmData from './ConfirmDataCopy';
import COLORS from "../../consts/colors";
import CustomActivityIndicator from "../ActivityIndicator/CustomActivityIndicator";

import administrativePosts from '../../consts/administrativePosts';
import provinces from '../../consts/provinces';
import districts from '../../consts/districts';
import villages from '../../consts/villages';
import countries from '../../consts/countries';
import idDocTypes from '../../consts/idDocTypes';
import { CustomInput } from '../Inputs/CustomInput';
import validateInstitutionEditedData from '../../helpers/validateInstitutionEditedData';

import { useUser } from "@realm/react";
import { realmContext } from '../../models/realmContext';
const {useRealm} = realmContext;


const EditInstitutionData = ({  
    isOverlayVisible, 
    setIsOverlayVisible,
    isConfirmDataVisible,
    setIsConfirmDataVisible,

    ownerName,
    resource,
    
    resourceName,
    dataToBeUpdated,

    newDataObject,
    oldDataObject,
    setNewDataObject,
    setOldDataObject,

    // the institution manager personal data
    institutionManagerPhone,
    setInstitutionManagerPhone,
    institutionManagerName,
    setInstitutionManagerName,
    oldInstitutionManagerPhone,
    setOldInstitutionManagerPhone,
    oldInstitutionManagerName,
    setOldInstitutionManagerName,

    // the institution documents
    institutionNuit,
    setInstitutionNuit,
    institutionLicence,
    setInstitutionLicence,
    oldInstitutionNuit,
    setOldInstitutionNuit,
    oldInstitutionLicence,
    setOldInstitutionLicence
    
})=>{

    const realm = useRealm();
    const user = useUser();
    const customUserData = user?.customData;

    // // ----------------------------------------------------
    const [errors, setErrors] = useState({});
    const [overlayTitle, setOverlayTitle] = useState('');



    useEffect(()=>{
        if (dataToBeUpdated === 'institutionDocument' && resourceName === 'Institution'){
            setInstitutionNuit(resource?.nuit);
            setInstitutionLicence(resource?.licence);
            setOverlayTitle('Actualizar Documentação.');

            setOldInstitutionNuit(resource?.nuit);
            setOldInstitutionLicence(resource?.licence);

        }

        if (dataToBeUpdated === 'institutionManager' && resourceName === 'Institution') {
            setInstitutionManagerName(resource?.manager.fullname);
            setInstitutionManagerPhone(resource?.manager.phone);
            setOverlayTitle('Actualizar Contacto.');

            setOldInstitutionManagerName(resource?.manager.fullname);
            setOldInstitutionManagerPhone(resource?.manager.phone);
        }

    }, [ dataToBeUpdated, resourceName ]);


    const onConfirmUpdate = (dataToBeUpdated, resourceName)=> {

        const validatedData = validateInstitutionEditedData({
            institutionNuit, oldInstitutionNuit,
            institutionLicence, oldInstitutionLicence,
            institutionManagerName, oldInstitutionManagerName,
            institutionManagerPhone, oldInstitutionManagerPhone,
        }, errors, setErrors, dataToBeUpdated, resourceName);

        
        const newData = {};
        const oldData = {};
        
        if (dataToBeUpdated === 'institutionDocument' && resourceName === 'Institution') {
            //  new incoming data
            newData['nuit'] = validatedData?.nuit;
            newData['licence'] = validatedData?.licence;

            // old data
            oldData['nuit'] = oldInstitutionNuit;
            oldData['licence'] = oldInstitutionLicence;
            
            setNewDataObject(newData);
            setOldDataObject(oldData);
        }

        if (dataToBeUpdated === 'institutionManager' && resourceName === 'Institution') {

            // new incoming data
            newData['fullname'] = validatedData?.fullname ? validatedData?.fullname?.trim() : '';
            newData['phone'] = validatedData?.phone ? Number(parseInt(validatedData?.phone)) : 0;


            // old data
            oldData['fullname'] = oldInstitutionManagerName ? oldInstitutionManagerName?.trim() : '';
            oldData['phone'] = oldInstitutionManagerPhone ? Number(parseInt(oldInstitutionManagerPhone)) : 0;
        

            setNewDataObject(newData);
            setOldDataObject(oldData);
        }


    }


    const toggleOverlay = () => {
        setIsOverlayVisible(!isOverlayVisible);
      };

    return (

    <Overlay 
        overlayStyle={{ 
            backgroundColor: COLORS.ghostwhite, 
            width: '90%',
            maxHeight: '80%',
            borderRadius: 10,
            // paddingBottom: 10,
        }}
        isVisible={isOverlayVisible} 
        onBackdropPress={toggleOverlay}
    >

        <View
            style={{
                // minHeight: '80%',
                justifyContent: 'center',
                maxHeight: '100%',
                // marginVertical: 10,
            }}
        >
                    <View
                        style={{ 
                            width: '100%', 
                            // backgroundColor: COLORS.pantone, 
                        }}
                    >
                        <Text
                            style={{ 
                                textAlign: 'center',
                                color: COLORS.black,
                                fontSize: 16,
                                paddingVertical: 5,
                                fontFamily: 'JosefinSans-Bold',
                                
                            }}
                        >{overlayTitle}</Text>
                    </View>

                    <View
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                        }}
                    >
                        <Icon 
                            onPress={()=>{
                                setIsOverlayVisible(false);
                            }}
                            name="close" 
                            size={25} 
                            color={COLORS.grey} 
                        />
                    </View>
            <ScrollView
                decelerationRate={'normal'}
                fadingEdgeLength={2}
                keyboardDismissMode = 'on-drag'
                keyboardShouldPersistTaps = 'handled'
                style={{
                    // flex: 1,
                    // minHeight: '100%',
                    // marginVertical: 10,
                }}
            >

    {
        (dataToBeUpdated === 'institutionManager' && resourceName === 'Institution') &&
        <Stack direction="column">
          
          <FormControl isRequired my="1" isInvalid={'institutionManagerName' in errors}>
            <FormControl.Label>Nome do Representante</FormControl.Label>
            <CustomInput
                width="100%"
                type="text"
                autoCapitalize="words"
                placeholder="Nome completo do representante"
                value={institutionManagerName}
                onChangeText={newManagerName=>{
                    setErrors(prev=>({...prev, institutionManagerName: ''}))
                    setInstitutionManagerName(newManagerName)
                }}
            />
            {
            'institutionManagerName' in errors 
            ? <FormControl.ErrorMessage 
            leftIcon={<Icon name="error-outline" size={16} color="red" />}
            _text={{ fontSize: 'xs'}}>{errors?.institutionManagerName}</FormControl.ErrorMessage> 
            : <FormControl.HelperText></FormControl.HelperText>
            }
        </FormControl>

        <FormControl  isInvalid={'institutionManagerPhone' in errors}>
            <FormControl.Label>Tel. do Responsável</FormControl.Label>
            <CustomInput
                width="100%"
                type="telephoneNumber"
                placeholder={institutionManagerPhone ? institutionManagerPhone.toString() : 'Nenhum'}
                keyboardType="numeric"
                value={institutionManagerPhone !== 0 && institutionManagerPhone?.toString()}
                onChangeText={newManagerPhone=>{
                    setErrors((prev)=>({...prev, institutionManagerPhone: ''}))                        
                    setInstitutionManagerPhone(newManagerPhone);
                }}
                InputLeftElement={
                    <Icon
                        name="phone"
                        color="grey"
                        size={25}
                        type="material"
                    />
                }
            />
            {
            'institutionManagerPhone' in errors 
            ? <FormControl.ErrorMessage 
            leftIcon={<Icon name="error-outline" size={16} color="red" />}
            _text={{ fontSize: 'xs'}}>{errors?.institutionManagerPhone}</FormControl.ErrorMessage> 
            : <FormControl.HelperText></FormControl.HelperText>
            }
        </FormControl>

   

    </Stack>

    }





    {/* update the institution Documents */}

    {
        (dataToBeUpdated === 'institutionDocument' && resourceName === 'Institution') &&
        <Stack direction="column">
          
            <FormControl isInvalid={'institutionNuit' in errors}>
                <FormControl.Label>NUIT da Instituição</FormControl.Label>
                <CustomInput
                    width="100%"
                    type="number"
                    placeholder={institutionNuit ? institutionNuit.toString() : 'Nenhum'}
                    value={institutionNuit}
                    keyboardType="numeric"
                    onChangeText={newNuit=>{
                        setErrors((prev)=>({...prev, institutionNuit: ''}));
                        setInstitutionNuit(newNuit)
                    }}
                />
                {
                'institutionNuit' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.institutionNuit}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
            </FormControl>
   
        <FormControl  isInvalid={'institutionLicence' in errors}>
            <FormControl.Label>N°. de Alvará da Instituição</FormControl.Label>
            <CustomInput
                width="100%"
                type="text"
                placeholder={institutionLicence ? institutionLicence?.toString() : 'Nenhum'}
                // keyboardType="numeric"
                value={institutionLicence?.toString()}
                onChangeText={newLicence=>{
                    setErrors((prev)=>({...prev, institutionLicence: ''}))                        
                    setInstitutionLicence(newLicence);
                }}
                />
            {
                'institutionLicence' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.institutionLicence}</FormControl.ErrorMessage> 
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
                // color: COLORS.ghostwhite,
            }}
            type="outline"
            onPress={()=>{
                if(!validateInstitutionEditedData({
                    institutionNuit, oldInstitutionNuit,
                    institutionLicence, oldInstitutionLicence,
                    institutionManagerName, oldInstitutionManagerName,
                    institutionManagerPhone, oldInstitutionManagerPhone,
                }, errors, setErrors, dataToBeUpdated, resourceName)) {
                    return ;
                }
                onConfirmUpdate(dataToBeUpdated, resourceName);
                setIsOverlayVisible(false);
                setIsConfirmDataVisible(true);

            }}
        />
        </ScrollView>

        </View>

    </Overlay>

    )
}


    
export default EditInstitutionData;