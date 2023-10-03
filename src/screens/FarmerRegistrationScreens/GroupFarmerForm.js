/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Text, SafeAreaView, ScrollView, TextInput, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { Box, FormControl, Stack, Select, CheckIcon, Center, Radio,  } from 'native-base';
import { Icon, Button, CheckBox } from '@rneui/themed';
import { MultipleSelectList, SelectList  } from 'react-native-dropdown-select-list';

import { CustomInput } from '../../components/Inputs/CustomInput';
import villages from '../../consts/villages';
import CustomDivider from '../../components/Divider/CustomDivider';
import styles from './styles';

import { fullYears, getFullYears, getFullYears2, localeDateService, useDatepickerState } from '../../helpers/dates';
import CustomActivityIndicator from '../../components/ActivityIndicator/CustomActivityIndicator';
import { groups, institutions } from '../../consts/farmerTypes';
import { groupPurposes } from '../../consts/groupPurposes';


import { realmContext } from '../../models/realmContext';
import COLORS from '../../consts/colors';
import { groupAffiliationStatus, groupAffiliationStatus2 } from '../../consts/groupAffiliationStatus';
const {useRealm} = realmContext;

export default function GroupFarmerForm({ 
    route, navigation,
    groupType, setGroupType, groupName, setGroupName, 
    groupAdminPost, setGroupAdminPost, groupVillage, setGroupVillage,
    // groupManagerName, setGroupManagerName, 
    // groupManagerPhone, setGroupManagerPhone,
    groupOperatingLicence, setGroupOperatingLicence, groupNuit, setGroupNuit,
    groupAffiliationYear, setGroupAffiliationYear, 
    groupMembersNumber, setGroupMembersNumber, groupWomenNumber, setGroupWomenNumber,
    errors, setErrors, 
    selectedAddressAdminPosts,
    groupGoals, setGroupGoals,
    groupCreationYear, setGroupCreationYear,
    groupLegalStatus, setGroupLegalStatus,
    isGroupActive, setIsGroupActive,
    isGroupInactive, setIsGroupInactive,
}) {
        
  return (

    <Box px="3" my="6">
        <Box w="100%" alignItems="center">
            <Box w="100%">
             <FormControl isRequired my="1" isInvalid={'isGroupActive' in errors}>
            <FormControl.Label>                
                <Text
                    style={{
                        fontSize: 16,
                        fontFamily: 'JosefinSans-Regular',
                        color: errors.isGroupActive ? COLORS.red : COLORS.grey,
                        paddingHorizontal: 15,
                    }}
                >Esta organização é...</Text>
            </FormControl.Label>
            <Stack  direction="row" mx="3" w="100%">
                <Box w="50%" px="1">
                <CheckBox
                        center
                        fontFamily = 'JosefinSans-Regular'
                        containerStyle={{
                            backgroundColor: COLORS.ghostwhite,
                        }}
                        textStyle={{
                            fontWeight: '120',
                            color: isGroupActive ? COLORS.main : errors.isGroupActive ? COLORS.red : COLORS.grey,
                        }}
                        title="Activa"
                        checked={isGroupActive}
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
                                color={errors?.isGroupActive ? COLORS.red : COLORS.grey}
                                size={30}
                                iconStyle={{ marginRight: 1 }}
                            />
                        }
                        onPress={() => {
                            setIsGroupInactive(false);
                            setIsGroupActive(true);
                            setErrors({
                                ...errors,
                                isGroupActive: '',
                            });
                        }}
                        />
                </Box>
                <Box w="50%" px="1">
                    <CheckBox
                        center
                        fontFamily = 'JosefinSans-Regular'
                        containerStyle={{
                            backgroundColor: COLORS.ghostwhite,
                        }}
                        textStyle={{
                            fontWeight: '120',
                            color: isGroupInactive ? COLORS.main : errors.isGroupActive ? COLORS.red : COLORS.grey,
                        }}
                        title="Inactiva"
                        checked={isGroupInactive}
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
                                color={errors?.isGroupActive ? COLORS.red : COLORS.grey}
                                size={30}
                                iconStyle={{ marginRight: 1 }}
                            />
                        }
                        onPress={() => {
                            setIsGroupInactive(true);
                            setIsGroupActive(false);    
                            setErrors({
                                ...errors,
                                isGroupActive: '',
                            });                  
                        }}
                        />
                    </Box>
                </Stack>    
                {
                'isGroupActive' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
                </FormControl>

            </Box>

            <Stack direction="row" mx="3" w="100%">
            <Box w="50%" px="1">
                <FormControl isRequired my="3" isInvalid={'groupType' in errors}>
                    <FormControl.Label>Tipo de organiz.</FormControl.Label>
                    <Select
                        selectedValue={groupType}
                        accessibilityLabel="Grupo"
                        placeholder="Tipo de grupo "
                        minHeight={55}
                        _selectedItem={{
                            bg: 'teal.600',
                            fontSize: 'lg',
                            endIcon: <CheckIcon size="5" />,
                        }}
                        mt={1}
                        dropdownCloseIcon={groupType 
                                            ? <Icon name="close" size={25} color="grey" onPress={()=>setGroupType('')} /> 
                                            : <Icon 
                                                // size={45} 
                                                name="arrow-drop-down" 
                                                color={COLORS.main} 
                                            />
                                        }
                        onValueChange={newGroupType => {
                            setErrors((prev)=>({...prev, groupType: ''}));
                            setGroupType(newGroupType)
                        }}
                    >
                        {
                            groups?.map((group, index)=>(
                            <Select.Item key={index} label={group} value={group} />
                        ))  
                        }
                    </Select>
                {
                'groupType' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.groupType}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
                </FormControl>
            </Box>
            <Box w="50%" px="1">
            <FormControl isRequired my="4" isInvalid={'groupName' in errors}>
                <FormControl.Label>Nome</FormControl.Label>
                    <CustomInput
                        width="100%"
                        isDisabled={groupType === '' ? true : false}
                        autoCapitalize="words"
                        placeholder="Nome do grupo"
                        value={groupName}
                        onChangeText={newGroupName=>{
                            setErrors(prev=>({...prev, groupName: ''}))
                            setGroupName(newGroupName)
                        }}
                    />
                {
                'groupName' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.groupName}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
            </FormControl>
            </Box>
        </Stack>

        <Stack direction="row" mx="3" w="100%">
        <Box w="50%" px="1" my="2">
        <FormControl  isInvalid={'groupMembersNumber' in errors} isRequired>
            <FormControl.Label>Total de membros</FormControl.Label>
            <CustomInput
                width="100%"
                type="number"
                placeholder="Número de membros"
                textAlign={'center'}
                keyboardType="numeric"
                value={groupMembersNumber}
                onChangeText={groupMembers=>{
                    setErrors((prev)=>({...prev, groupMembersNumber: ''}))                        
                    setGroupMembersNumber(groupMembers);
                }}
            />
            {
            'groupMembersNumber' in errors 
            ? <FormControl.ErrorMessage 
            leftIcon={<Icon name="error-outline" size={16} color="red" />}
            _text={{ fontSize: 'xs'}}>{errors?.groupMembersNumber}</FormControl.ErrorMessage> 
            : <FormControl.HelperText></FormControl.HelperText>
            }
        </FormControl>
        </Box>
        <Box w="50%" px="1" my="2">
            <FormControl isInvalid={'groupWomenNumber' in errors} isRequired>
                <FormControl.Label>Total de mulheres</FormControl.Label>
                <CustomInput
                    width="100%"
                    type="number"
                    placeholder="Número de mulheres"
                    textAlign={'center'}
                    isDisabled={groupMembersNumber === '' ? true : false}
                    value={groupWomenNumber}
                    keyboardType="numeric"
                    onChangeText={womenNumber=>{
                        setErrors((prev)=>({...prev, groupWomenNumber: ''}));
                        setGroupWomenNumber(womenNumber)
                    }}
                />
                {
                'groupWomenNumber' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.groupWomenNumber}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
            </FormControl>
        </Box>
        </Stack>




        <Stack direction="row" mx="3" w="100%">
        <Box w="100%" px="1" my="2">
        <FormControl  isInvalid={'groupGoals' in errors} isRequired>
            <FormControl.Label>Finalidades de {!groupType ? 'Grupo' : groupType }</FormControl.Label>
                <MultipleSelectList
                    setSelected={(goal)=>{
                        setErrors(prev=>({...prev, groupGoals: ''}));
                        setGroupGoals(goal);
                    }}
                    data={groupPurposes}
                    notFoundText={'Finalidade não encontrada'}
                    placeholder="Finalidade de grupo"
                    searchPlaceholder='Seleccionar finalidades'
                    save="value"
                    label="Finalidade de grupo"
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
                                color="grey" 
                            />
                    }
                    fontFamily='JosefinSans-Regular'
                    dropdownTextStyles={{
                        fontSize: 16,
                        color: COLORS.black,
                        padding: 5,
                    }}
                    inputStyles={{
                        fontSize: 15,
                        color: groupGoals?.length > 0 ? COLORS.black : COLORS.grey,
                    }}
                    boxStyles={{
                        minHeight: 55,
                        borderRadius: 5,
                        borderColor: COLORS.lightgrey,
                    }}
                />
            {
            'groupGoals' in errors 
            ? <FormControl.ErrorMessage 
            leftIcon={<Icon name="error-outline" size={16} color="red" />}
            _text={{ fontSize: 'xs'}}>{errors?.groupGoals}</FormControl.ErrorMessage> 
            : <FormControl.HelperText></FormControl.HelperText>
            }
        </FormControl>
        {/* </Box>
        <Box w="50%" px="1" my="2"> */}
            {/* <FormControl isInvalid={'groupWomenNumber' in errors} isRequired>
                <FormControl.Label>Total de mulheres</FormControl.Label>
                <CustomInput
                    width="100%"
                    type="number"
                    placeholder="Número de mulheres"
                    textAlign={'center'}
                    isDisabled={groupMembersNumber === '' ? true : false}
                    value={groupWomenNumber}
                    keyboardType="numeric"
                    onChangeText={womenNumber=>{
                        setErrors((prev)=>({...prev, groupWomenNumber: ''}));
                        setGroupWomenNumber(womenNumber)
                    }}
                />
                {
                'groupWomenNumber' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.groupWomenNumber}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
            </FormControl> */}
        </Box>
        </Stack>


        <Stack direction="row" mx="3" w="100%">
            <Box w="50%" px="1">
                <FormControl isRequired my="1" isInvalid={'groupCreationYear' in errors}>
                    <FormControl.Label>Ano de criação</FormControl.Label>
                    <SelectList
                        data={getFullYears2(50)}
                        setSelected={newYear => {
                            setErrors((prev)=>({...prev, groupCreationYear: ''}));
                            setGroupCreationYear(newYear);
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
                            color: groupCreationYear ? COLORS.black : COLORS.grey,
                        }}
                        boxStyles={{
                            minHeight: 55,
                            borderRadius: 5,
                            borderColor: COLORS.lightgrey,
                            marginTop: 5,
                        }}

                        
                    />
                    {/* <Select
                        selectedValue={groupCreationYear}
                        accessibilityLabel="Escolha o ano"
                        placeholder="Escolha o ano"
                        minHeight={55}
                        _selectedItem={{
                            bg: 'teal.600',
                            fontSize: 'lg',
                            endIcon: <CheckIcon size="5" />,
                        }}
                      dropdownCloseIcon={groupCreationYear 
                                        ? <Icon 
                                            name="close" 
                                            size={20} 
                                            color="grey" 
                                            onPress={()=>setGroupCreationYear('')} 
                                        /> 
                                        : <Icon 
                                            size={45} 
                                            name="arrow-drop-down" 
                                            color={COLORS.main} 
                                        />
                                    }
                        mt={1}
                        onValueChange={newYear => {
                            setErrors((prev)=>({...prev, groupCreationYear: ''}));
                            setGroupCreationYear(newYear);
                        }}
                    >
                    {
                        getFullYears()?.map((year, index)=>(
                            <Select.Item key={index} label={`${year}`} value={year} />
                        ))
                    }
                    </Select> */}
                {
                'groupCreationYear' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.groupCreationYear}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
                </FormControl>
            </Box>
            <Box w="50%" px="1">
                <FormControl isRequired my="1" isInvalid={'groupLegalStatus' in errors}>
                    <FormControl.Label>Situação Legal</FormControl.Label>
                    <SelectList 
                        data={groupAffiliationStatus2}
                        setSelected={status => {
                            setErrors((prev)=>({
                                ...prev, 
                                groupCreationYear: '',
                                groupLegalStatus: '',
                                groupNuit: '',
                                groupOperatingLicence: '',
                                groupAffiliationYear: '',
                            }));
                            setGroupLegalStatus(status);
                            setGroupNuit();
                            setGroupOperatingLicence('');
                            setGroupAffiliationYear('');
                        }}

                        save="value"
                        placeholder='Escolher situação'
                        searchPlaceholder='Escolher situação'
                        maxHeight={400}
                        fontFamily='JosefinSans-Regular'
                        notFoundText='Situação não encontrada'
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
                            color: groupLegalStatus ? COLORS.black : COLORS.grey,
                        }}
                        boxStyles={{
                            minHeight: 55,
                            borderRadius: 5,
                            borderColor: COLORS.lightgrey,
                            marginTop: 5,
                        }}
                    />

                {
                'groupLegalStatus' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.groupLegalStatus}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
                </FormControl>
            </Box>
        </Stack>




{
    groupLegalStatus === groupAffiliationStatus.affiliated &&
        <>
        <Stack direction="row" mx="3" w="100%">

            <Box w="50%" px="1">
                <FormControl isRequired my="1" isInvalid={ groupLegalStatus === groupAffiliationStatus.affiliated && 'groupAffiliationYear' in errors}>
                    <FormControl.Label>Ano de legalização</FormControl.Label>

                        <SelectList 
                            data={getFullYears2(50)}
                            setSelected={newYear => {
                                setErrors((prev)=>({...prev, groupAffiliationYear: ''}));
                                setGroupAffiliationYear(newYear);
                            }}

                            save="value"
                            placeholder='Escolher ano'
                            searchPlaceholder='Escolher ano'
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
                                color: groupAffiliationYear ? COLORS.black : COLORS.grey,
                            }}
                            boxStyles={{
                                minHeight: 55,
                                borderRadius: 5,
                                borderColor: COLORS.lightgrey,
                                marginTop: 5,
                            }}
                        />

                {
                 groupLegalStatus === groupAffiliationStatus.affiliated && 'groupAffiliationYear' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.groupAffiliationYear}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
                </FormControl>
            </Box>

            <Box w="50%" px="1" my="2">
                <FormControl  isInvalid={ groupLegalStatus === groupAffiliationStatus.affiliated && 'groupOperatingLicence' in errors} isRequired>
                    <FormControl.Label>N°. de Alvará</FormControl.Label>
                    <CustomInput
                        width="100%"
                        placeholder="Alvará"
                        value={groupOperatingLicence}
                        onChangeText={newOperatingLicence=>{
                            setErrors((prev)=>({...prev, groupOperatingLicence: ''}))                        
                            setGroupOperatingLicence(newOperatingLicence);
                        }}
                    />
                    {
                       groupLegalStatus === groupAffiliationStatus.affiliated &&  'groupOperatingLicence' in errors 
                    ? <FormControl.ErrorMessage 
                    leftIcon={<Icon name="error-outline" size={16} color="red" />}
                    _text={{ fontSize: 'xs'}}>{errors?.groupOperatingLicence}</FormControl.ErrorMessage> 
                    : <FormControl.HelperText></FormControl.HelperText>
                    }
                </FormControl>
            </Box>

        </Stack>

    <Stack direction="row" mx="3" w="100%">

        <Box w="50%" px="1" my="2">
            <FormControl isInvalid={ groupLegalStatus === groupAffiliationStatus.affiliated && 'groupNuit' in errors} isRequired>
                <FormControl.Label>NUIT</FormControl.Label>
                <CustomInput
                    width="100%"
                    type="number"
                    placeholder="NUIT"
                    value={groupNuit}
                    keyboardType="numeric"
                    onChangeText={newNuit=>{
                        setErrors((prev)=>({...prev, groupNuit: ''}));
                        setGroupNuit(newNuit)
                    }}
                    />
                {
                   groupLegalStatus === groupAffiliationStatus.affiliated &&  'groupNuit' in errors 
                    ? <FormControl.ErrorMessage 
                    leftIcon={<Icon name="error-outline" size={16} color="red" />}
                    _text={{ fontSize: 'xs'}}>{errors?.groupNuit}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
            </FormControl>
        </Box>

        <Box w="50%" px="1" my="2">
        </Box>

        </Stack>
    </>
}
        <CustomDivider
            marginVertical="2"
            thickness={2}
            bg="#005000"
        />

        <Center>
            <Text 
                style={styles.formSectionDescription}
            >
                Endereço e Contacto
            </Text>
        </Center>

        <Stack direction="row" mx="3" w="100%">
        <Box w="50%" px="1">
            <FormControl isRequired my="2" isInvalid={'groupAdminPost' in errors}>
                <FormControl.Label>Posto Adm.</FormControl.Label>
                <Select
                    selectedValue={groupAdminPost}
                    accessibilityLabel="posto administrativo"
                    placeholder="Escolha posto administrativo"
                    minHeight={55}
                    _selectedItem={{
                        bg: 'teal.600',
                        fontSize: 'lg',
                        endIcon: <CheckIcon size="5" />,
                    }}
                    dropdownCloseIcon={groupAdminPost 
                                    ? <Icon name="close" size={25} color="grey" onPress={()=>setGroupAdminPost('')} /> 
                                    : <Icon 
                                        // size={45} 
                                        name="arrow-drop-down" 
                                        color={COLORS.main} 
                                    />
                                }
                    mt={1}
                    onValueChange={newAdminPost => {
                        setErrors((prev)=>({...prev, groupAdminPost: ''}));
                        setGroupAdminPost(newAdminPost);
                    }}
                >
                {
                    selectedAddressAdminPosts?.map((adminPost, index)=>(
                        <Select.Item key={index} label={adminPost} value={adminPost} />
                    ))
                }
                </Select>
            {
            'groupAdminPost' in errors 
            ? <FormControl.ErrorMessage 
            leftIcon={<Icon name="error-outline" size={16} color="red" />}
            _text={{ fontSize: 'xs'}}>{errors?.groupAdminPost}</FormControl.ErrorMessage> 
            : <FormControl.HelperText></FormControl.HelperText>
            }
            </FormControl>
        </Box>
        <Box w="50%" px="1">
        <FormControl isRequired my="2">
            <FormControl.Label>Localidade</FormControl.Label>
                <Select
                    selectedValue={groupVillage}
                    accessibilityLabel="Escolha uma localidade"
                    placeholder="Escolha uma localidade"
                    minHeight={55}
                    _selectedItem={{
                        bg: 'teal.600',
                        fontSize: 'lg',
                        endIcon: <CheckIcon size="5" />
                    }}
                    dropdownCloseIcon={groupVillage
                                    ? <Icon name="close" size={25} color="grey" onPress={()=>setGroupVillage('')} /> 
                                    : <Icon 
                                        // size={45} 
                                        name="arrow-drop-down" 
                                        color={COLORS.main} 
                                    />
                                }
                    mt={1}
                    onValueChange={newVillage => setGroupVillage(newVillage)}
                >
                {
                    villages[groupAdminPost]?.map((village, index)=>(
                        <Select.Item key={index} label={village} value={village} />
                    ))
                }
                </Select>
            <FormControl.ErrorMessage>{''}</FormControl.ErrorMessage>
        </FormControl>
        </Box>
        </Stack>

        </Box>

        {/* <Box w="100%" alignItems="center">
            <FormControl isRequired my="1" isInvalid={'groupManagerName' in errors}>
                <FormControl.Label>Nome do {groupType?.includes('Grupo') ? "Representante" : "Presidente"}</FormControl.Label>
                <CustomInput
                    width="100%"
                    type="text"
                    autoCapitalize="words"
                    placeholder="Nome completo do Gerente"
                    value={groupManagerName}
                    onChangeText={newName=>{
                        setErrors(prev=>({...prev, groupManagerName: ''}))
                        setGroupManagerName(newName)
                    }}
                />
                {
                'groupManagerName' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.groupManagerName}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
                }
            </FormControl>
 
        <Stack direction="row" mx="3" w="100%">
        <Box w="50%" px="1" my="2">
        <FormControl  isInvalid={'groupManagerPhone' in errors}>
            <FormControl.Label>Tel. do {groupType?.includes('Grupo') ? "Representante" : "Presidente"}</FormControl.Label>
            <CustomInput
                width="100%"
                type="telephoneNumber"
                placeholder="Telemóvel"
                keyboardType="numeric"
                value={groupManagerPhone}
                onChangeText={newManagerPhone=>{
                    setErrors((prev)=>({...prev, groupManagerPhone: ''}))                        
                    setGroupManagerPhone(newManagerPhone);
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
            'groupManagerPhone' in errors 
            ? <FormControl.ErrorMessage 
            leftIcon={<Icon name="error-outline" size={16} color="red" />}
            _text={{ fontSize: 'xs'}}>{errors?.groupManagerPhone}</FormControl.ErrorMessage> 
            : <FormControl.HelperText></FormControl.HelperText>
            }
        </FormControl>
        </Box>
        <Box w="50%" px="1" my="2">
        </Box>
    </Stack>



    </Box> */}
    </Box>
  );
}
