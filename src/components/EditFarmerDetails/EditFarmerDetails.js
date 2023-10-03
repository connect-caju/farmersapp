

import React, { useState, useEffect, useCallback } from "react";
import { 
    Text, Animated, Modal, Easing, SafeAreaView, 
    StyleSheet, ScrollView, TextInput, View, TouchableOpacity, } from 'react-native';
import { Overlay, Icon, Button, CheckBox } from "@rneui/base";
import { Box, FormControl, Stack, Select, CheckIcon, Center, Radio,  } from 'native-base';

import ConfirmData from '../EditData/ConfirmDataCopy';
import COLORS from "../../consts/colors";
import CustomActivityIndicator from "../ActivityIndicator/CustomActivityIndicator";

import administrativePosts from '../../consts/administrativePosts';
import provinces from '../../consts/provinces';
import districts from '../../consts/districts';
import villages from '../../consts/villages';
import countries from '../../consts/countries';
import idDocTypes from '../../consts/idDocTypes';
import { CustomInput } from '../Inputs/CustomInput';
import validateFarmerEditedData from '../../helpers/validateFarmerEditedData';

import { useUser } from "@realm/react";
import { realmContext } from '../../models/realmContext';
import { useRef } from "react";
import { far } from "@fortawesome/free-regular-svg-icons";
const {useRealm} = realmContext;


export default function EditFarmerDetails({     
 resourceName,
 dataToBeUpdated,
 isOverlayVisible, 
 setIsOverlayVisible,
 isConfirmDataVisible,
 setIsConfirmDataVisible,
 farmerId,

 }){

 const realm = useRealm();
 const user = useUser();
 const customUserData = user?.customData;
 const farmer = realm.objectForPrimaryKey('Actor', farmerId);

 // // ----------------------------------------------------
 const [errors, setErrors] = useState({});
 const [overlayTitle, setOverlayTitle] = useState('');

 const [address, setAddress] = useState({
     addressProvince: '',
     addressDistrict: '',
     addressAdminPost: '',
     addressVillage: '',
     overlayTitle: '',
 });
 

 const [oldAddress, setOldAddress] = useState({
     addressProvince: '',
     addressDistrict: '',
     addressAdminPost: '',
     addressVillage: '',
 });

 const [contact, setContact] = useState({
     primaryPhone: '',
     secondaryPhone: '',
     overlayTitle: '',
 });

 const [oldContact, setOldContact] = useState({
     primaryPhone: '',
     secondaryPhone: '',
 });

 const [idDocument, setIdDocument] = useState({
     docType: '',
     docNumber: '',
     nuit: '',
     overlayTitle: '',
 });

 const [oldIdDocument, setOldIdDocument] = useState({
     docType: '',
     docNumber: '',
     nuit: '',
 });


 const [newDataObject, setNewDataObject] = useState({});
 const [oldDataObject, setOldDataObject] = useState({});


 useEffect(()=>{
     if (dataToBeUpdated === 'address' && resourceName === 'Farmer'){
         const currentAddress = {
             addressProvince: customUserData?.userProvince,
             addressDistrict: customUserData?.userDistrict,
             addressAdminPost: farmer?.address.adminPost,
             addressVillage: farmer?.address.village,
         }

         setAddress((prev)=>({ prev, ...currentAddress}));
         setOldAddress((prev)=>({prev, ...currentAddress}));
         
         setOverlayTitle('Actualizar endereço.');
     }

     if (dataToBeUpdated === 'contact' && resourceName === 'Farmer') {
         const currentContact = {
             primaryPhone: farmer?.contact.primaryPhone,
             secondaryPhone: farmer?.contact.secondaryPhone,
         };

         setContact((prev)=>({prev, ...currentContact}));
         setOldContact((prev)=>({prev, ...currentContact}));

         setOverlayTitle('Actualizar contactos.');
     }

     if (dataToBeUpdated === 'idDocument' && resourceName === 'Farmer') {
         
         const currentIdDocument = {
             docType: farmer?.idDocument.docType,
             docNumber: farmer?.idDocument.docNumber,  
             nuit: farmer?.idDocument.nuit,
         };

         setIdDocument((prev)=>({prev, ...currentIdDocument}));
         setOldIdDocument((prev)=>({prev, ...currentIdDocument}));
         
         setOverlayTitle('Actualizar Documentos de Identidade.');
     }

 }, [ dataToBeUpdated, resourceName ]);

 const onConfirmUpdate = (dataToBeUpdated, resourceName)=> {

     const validatedData = validateFarmerEditedData({
         address, oldAddress, contact, oldContact, idDocument, oldIdDocument,
     }, errors, setErrors, dataToBeUpdated, resourceName);

     const newData = {};
     const oldData = {};

     if (dataToBeUpdated === 'address' && resourceName === 'Farmer') {
         //  new incoming data
         newData['province'] = address?.addressProvince;
         newData['district'] = address?.addressDistrict;
         newData['adminPost'] = validatedData?.adminPost;
         newData['village'] = validatedData?.village;

         // old data
         oldData['province'] = oldAddress?.addressProvince;
         oldData['district'] = oldAddress?.addressDistrict;
         oldData['adminPost'] = oldAddress?.addressAdminPost;
         oldData['village'] = oldAddress?.addressVillage;
         
         setNewDataObject(newData);
         setOldDataObject(oldData);
     }

     if (dataToBeUpdated === 'contact' && resourceName === 'Farmer') {

         // new incoming data
         newData['primaryPhone'] = validatedData?.primaryPhone ? Number(parseInt(validatedData?.primaryPhone)) : 0;
         newData['secondaryPhone'] = validatedData?.secondaryPhone ? Number(parseInt(validatedData?.secondaryPhone)) : 0;


         // old data
         oldData['primaryPhone'] = oldContact?.primaryPhone ? Number(parseInt(oldContact?.primaryPhone)) : 0;
         oldData['secondaryPhone'] = oldContact?.secondaryPhone ? Number(parseInt(oldContact?.secondaryPhone)) : 0;
     

         setNewDataObject(newData);
         setOldDataObject(oldData);
     }


     if (dataToBeUpdated === 'idDocument' && resourceName === 'Farmer') {

         // new incoming data
         newData['docType'] = validatedData?.docType?.trim();
         newData['docNumber'] = validatedData?.docNumber ? validatedData?.docNumber : '';
         newData['nuit'] = validatedData?.nuit ? Number(parseInt(validatedData?.nuit)) : 0;

         // old data
         oldData['docType'] = oldIdDocument?.docType ? oldIdDocument?.docType : 'Não tem';
         oldData['docNumber'] = oldIdDocument?.docNumber ? oldIdDocument?.docNumber : '';
         oldData['nuit'] = oldIdDocument?.nuit ? oldIdDocument?.nuit : 0;

         setNewDataObject(newData);
         setOldDataObject(oldData);
     }

 }

 useEffect(()=>{
     if (idDocument?.docType === 'Não tem'){
         // setDocNumber('');
         setIdDocument((prev)=>({
             ...prev,
             docNumber: '',
         }))
     }
 }, [ idDocument.docType ])


 return (
  <View
  style={{
      width: '100%',
      justifyContent: 'center',
      backgroundColor: COLORS.ghostwhite,
      borderColor: COLORS.lightgrey,
      borderTopWidth: 2,
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      // borderTopLeftRadius: 30,
      // borderTopRightRadius: 30,
      maxHeight: '80%',
      // opacity: scale?.interpolate({ inputRange: [0, 1], outputRange: [0, 1]}),
      // transform: [{scale}],
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
                  right: 10,
                  top: 10,
              }}
          >
              <Icon 
                  onPress={()=>{
                      setIsOverlayVisible(false);
                      // resizeBox(0);
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
  >


{/* update the farmer idDocuments */}

{
(dataToBeUpdated === 'idDocument' && resourceName === 'Farmer') &&
<Stack direction="column">
<Stack >

  <FormControl my="2" isRequired isInvalid={'docType' in errors}>
      <FormControl.Label>Tipo do documento</FormControl.Label>
        <Select
            selectedValue={idDocument?.docType}
            accessibilityLabel="Tipo de doc."
            placeholder="Tipo de documento"
            minHeight={55}
            _selectedItem={{
                bg: 'teal.600',
                fontSize: 'lg',
                endIcon: <CheckIcon size="5" />,
            }}
            dropdownCloseIcon={idDocument?.docType 
                              ? <Icon 
                                  name="close" 
                                  size={20} 
                                  color={COLORS.lightgrey} 
                                  onPress={()=>{
                                      // setDocType('')
                                      setIdDocument((prev)=>({
                                          ...prev,
                                          docType: ''
                                      }))
                                  }} /> 
                              : <Icon 
                                  // size={45} 
                                  name="arrow-drop-down" 
                                  color={COLORS.pantone} 
                              />
                          }
            mt={1}
            onValueChange={newDocType => {
              setErrors((prev)=>({
                  ...prev, 
                  docType: '',
                  docNumber: '',
              }));
              setIdDocument((prev)=>({
                  ...prev,
                  docType: newDocType,
              }))
            }}
        >
      {  
      idDocTypes?.map((docType)=><Select.Item key={docType} label={docType} value={docType} />)                 
      }
      </Select>
      {
      'docType' in errors 
      ? <FormControl.ErrorMessage 
      leftIcon={<Icon name="error-outline" size={16} color="red" />}
      _text={{ fontSize: 'xs'}}>{errors?.docType}</FormControl.ErrorMessage> 
      : <FormControl.HelperText></FormControl.HelperText>
      }
  </FormControl>
 </Stack>
 <Stack>
 
{       !(idDocument?.docType === 'Não tem') &&  
 <FormControl my="3" isInvalid={'docNumber' in errors}>
      <FormControl.Label>Número do documento</FormControl.Label>
      <CustomInput
          width="100%"
          type="text"
          isDisabled={(idDocument?.docType === 'Não tem' || idDocument?.docType === '') ? true : false }
          value={idDocument?.docNumber?.toString()}
          placeholder={idDocument?.docNumber ? idDocument?.docNumber?.toString() : 'Nenhum'}
          onChangeText={newDocNumber=>{
              setErrors((prev)=>({...prev, docNumber: ''}));
              // setDocNumber(newDocNumber)
              setIdDocument((prev)=>({
                  ...prev,
                  docNumber: newDocNumber,
              }))
          }}
      />
      {
      'docNumber' in errors 
      ? <FormControl.ErrorMessage 
      leftIcon={<Icon name="error-outline" size={16} color="red" />}
      _text={{ fontSize: 'xs'}}>{errors?.docNumber}</FormControl.ErrorMessage> 
      : <FormControl.HelperText></FormControl.HelperText>
      }
  </FormControl>
  
  }

  </Stack>

  <Stack >

  <FormControl isInvalid={'nuit' in errors}>
      <FormControl.Label>NUIT</FormControl.Label>
      <CustomInput
          width="100%"
          type="number"
          placeholder={idDocument?.nuit ? idDocument?.nuit?.toString() : 'Nenhum'}
          value={idDocument?.nuit?.toString()}
          keyboardType="numeric"
          onChangeText={newNuit=>{
              setErrors((prev)=>({...prev, nuit: ''}));
              // setNuit(newNuit)
              setIdDocument((prev)=>({
                  ...prev,
                  nuit: newNuit,
              }))
          }}
      />
      {
      'nuit' in errors 
      ? <FormControl.ErrorMessage 
      leftIcon={<Icon name="error-outline" size={16} color="red" />}
      _text={{ fontSize: 'xs'}}>{errors?.nuit}</FormControl.ErrorMessage> 
      : <FormControl.HelperText></FormControl.HelperText>
      }
  </FormControl>
  </Stack>
</Stack>

}




{/* update the farmer contacts  */}
{
(dataToBeUpdated === 'contact' && resourceName === 'Farmer') &&
  <Stack direction="column">
  <Box w="100%" 
      style={{
          alignItems: 'center',
      }}
  >
  <FormControl my="1" isInvalid={'primaryPhone' in errors}>
      <FormControl.Label>Telemóvel</FormControl.Label>
      <CustomInput
          width="100%"
          type="telephoneNumber"
          placeholder={contact?.primaryPhone ? contact?.primaryPhone?.toString() : 'Nenhum'}
          keyboardType="numeric"
          value={contact?.primaryPhone ? contact?.primaryPhone?.toString() : ''}
          onChangeText={newPhone=>{
              setErrors((prev)=>({...prev, primaryPhone: ''}))                        
              // setPrimaryPhone(newPhone);
              setContact((prev)=>({
                  ...prev,
                  primaryPhone: newPhone,
              }))
          }}
          InputLeftElement={
              <Icon
                  name="phone"
                  color="grey"
                  size={20}
                  type="material"
              />
          }
      />
      {
      'primaryPhone' in errors 
      ? <FormControl.ErrorMessage 
      leftIcon={<Icon name="error-outline" size={16} color="red" />}
      _text={{ fontSize: 'xs'}}>{errors?.primaryPhone}</FormControl.ErrorMessage> 
      : <FormControl.HelperText></FormControl.HelperText>
      }
  </FormControl>
  </Box>
  <Box w="100%" 
      style={{
          alignItems: 'center',
      }}
  
  >
  <FormControl my="1" isInvalid={'secondaryPhone' in errors}>
      <FormControl.Label>Telemóvel Alternativo</FormControl.Label>
      <CustomInput
          width="100%"
          type="telephoneNumber"
          placeholder={contact?.secondaryPhone ? contact?.secondaryPhone?.toString() : 'Nenhum'}
          keyboardType="numeric"
          value={contact?.secondaryPhone ? contact?.secondaryPhone?.toString() : ''}
          onChangeText={(newPhone=>{
              setErrors((prev)=>({...prev, secondaryPhone: ''}))
              setContact((prev)=>({
                  ...prev,
                  secondaryPhone: newPhone,
              }));
          })
          }
          InputLeftElement={
              <Icon
                  name="phone"
                  color="grey"
                  size={20}
                  type="material"
              />
          }
      />
      {
      'secondaryPhone' in errors 
      ? <FormControl.ErrorMessage 
      leftIcon={<Icon name="error-outline" size={16} color="red" />}
      _text={{ fontSize: 'xs'}}>{errors?.secondaryPhone}</FormControl.ErrorMessage> 
      : <FormControl.HelperText></FormControl.HelperText>
      }
  </FormControl>
  </Box>
  </Stack>
}




{/*  update the farmer address */}

{
(dataToBeUpdated === 'address' && resourceName === 'Farmer') &&
<Box> 
<Stack>            
  <FormControl isRequired my="1" isInvalid={'addressAdminPost' in errors}>
      <FormControl.Label>Posto Adm.</FormControl.Label>
          <Select
              selectedValue={address?.addressProvince ? address?.addressAdminPost: ''}
              accessibilityLabel="Escolha um posto administrativo"
              placeholder="Escolha um posto administrativo"
              minHeight={55}
              _selectedItem={{
                  bg: 'teal.600',
                  fontSize: 'lg',
                  endIcon: <CheckIcon size="5" />,
              }}
              dropdownCloseIcon={address?.addressAdminPost 
                  ? <Icon 
                      name="close" 
                      size={20} 
                      color={COLORS.lightgrey} 
                      onPress={()=>{
                          setAddress((prev)=>({
                              ...prev,
                              addressAdminPost: '',
                          }))
                      }} 
                  /> 
                  : <Icon 
                      name="arrow-drop-down" 
                      color={COLORS.pantone} 
                  />
              }
              mt={1}
          onValueChange={newAdminPost=> {
              setErrors((prev)=>({...prev, addressAdminPost: ''}));
              setAddress((prev)=>({
                  ...prev,
                  addressAdminPost: newAdminPost,
              }))
          }}
          >
          {
              administrativePosts[address?.addressDistrict]?.map((adminPost, index)=>(
                  <Select.Item key={index} label={adminPost} value={adminPost} />
                  ))
              }
          </Select>
      {
          'addressAdminPost' in errors 
          ? <FormControl.ErrorMessage 
          leftIcon={<Icon name="error-outline" size={16} color="red" />}
          _text={{ fontSize: 'xs'}}>{errors?.addressAdminPost}</FormControl.ErrorMessage> 
          : <FormControl.HelperText></FormControl.HelperText>
      }
  </FormControl>
</Stack>
<Stack>
  <FormControl isRequired my="3">
      <FormControl.Label>Localidade</FormControl.Label>
          <Select
              selectedValue={address?.addressVillage}
              accessibilityLabel="Escolha uma localidade"
              placeholder="Escolha uma localidade"
              minHeight={55}
              _selectedItem={{
                  bg: 'teal.600',
                  fontSize: 'lg',
                  endIcon: <CheckIcon size="5" />,
              }}
              dropdownCloseIcon={address?.addressVillage 
                              ? <Icon 
                                  name="close" 
                                  size={20} 
                                  color="grey" 
                                  onPress={()=>{
                                      setAddress((prev)=>({
                                          ...prev,
                                          addressVillage: '',
                                      }))
                                  }} 
                              /> 
                              : <Icon 
                                  name="arrow-drop-down" 
                                  color={COLORS.pantone} 
                              />
                          }
              mt={1}
              onValueChange={(newVillage) => {
                  setAddress((prev)=>({
                      ...prev,
                      addressVillage: newVillage,
                  }))
              }}
          >
          {
              villages[address?.addressAdminPost]?.map((village, index)=>(
                  <Select.Item key={index} label={village} value={village} />
              ))
          }
          </Select>
      <FormControl.ErrorMessage>{''}</FormControl.ErrorMessage>
  </FormControl>
</Stack>
</Box>
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
  }}
  type="outline"
  onPress={()=>{
      if(!validateFarmerEditedData({
          address, oldAddress, contact, oldContact, idDocument, oldIdDocument,
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
 )
}