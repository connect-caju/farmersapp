/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useCallback, useEffect, useState} from 'react';
import { Text,  Stack, Box, Center, Divider } from 'native-base';
import { Button, Icon } from '@rneui/themed';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';
import CustomDivider from '../Divider/CustomDivider';
import styles from './styles';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Realm from 'realm';

import FarmerAddDataModal from './SuccessModal';

import { useNavigation } from '@react-navigation/native';
import { categorizeFarmer } from '../../helpers/categorizeFarmer';
// import { user } from '../../consts/user';


import { realmContext } from '../../models/realmContext';
import { useUser } from '@realm/react';
import COLORS from '../../consts/colors';
const {useRealm, useQuery, useObject} = realmContext;

export default function FarmlandModal (
    {
        modalVisible,
        setModalVisible,
        farmlandData,

        setPlantingYear, 
        setDescription,
        setConsociatedCrops, 
        setClones,
        setTrees, 
        // setDeclaredArea, 
        setUsedArea,
        setTotalArea,
        setDensityLength, 
        setDensityWidth,
        setPlantTypes, 
        setDensityMode, 

        setFarmlandId,
        setIsCoordinatesModalVisible,

    }
) {

    const navigation = useNavigation();
    const realm = useRealm();
    const user = useUser();
    const customUserData = user?.customData;

    // const currentUserStat = useObject('UserStat', customUserData?.userId);
    const currentUserStat = useQuery('UserStat').filtered("userId == $0", customUserData?.userId)[0];



const onAddFarmland = useCallback((farmlandData, realm) =>{
    const {
        plantingYear, 
        description,
        consociatedCrops,
        density,
        trees,
        usedArea,
        totalArea,
        plantTypes,
        ownerId,
        flag,
    } = farmlandData;

    if (!ownerId) {
        return {
            status: 'FAILED',
            code: 404,
            message: 'Indica o proprietário desta parcela!',
        };
    }


    let owner;
    if (flag === 'Indivíduo'){
        owner = realm.objectForPrimaryKey('Farmer', ownerId);
    }
    else if (flag === 'Grupo') {
        owner = realm.objectForPrimaryKey('Group', ownerId);
    }
    else if (flag === 'Instituição'){
        owner = realm.objectForPrimaryKey('Institution', ownerId);
    }

    if (!owner) {
        return {
            status: 'FAILED',
            code: 404,
            message: 'O proprietário desta parcela ainda não foi registado!',
        };
    }

    let newFarmland;

    realm.write( async ()=>{
        newFarmland = await realm.create('Farmland', {
            _id: uuidv4(),
            plantingYear,
            description,
            consociatedCrops,
            density,
            trees,
            usedArea,
            totalArea,
            plantTypes,
            farmer: owner._id,
            userDistrict: customUserData?.userDistrict,
            userId: customUserData?.userId,
            userName: customUserData?.name,
        })

        // set the farmlandId
        setFarmlandId(newFarmland._id);
    });


    const ownerFarmlands = realm.objects('Farmland').filtered('farmer == $0', owner._id)
    realm.write(()=>{
        owner.farmlands = ownerFarmlands?.map((farmland)=>farmland._id);
        if (flag === 'Indivíduo'){  
            // categorize by 'comercial' | 'familiar' | 'nao-categorizado'
            owner.category = categorizeFarmer(ownerFarmlands);
        }        
    });

    // update user stat (1 more farmland registered by the user)
    if(currentUserStat) {
        realm.write(()=>{
            currentUserStat.registeredFarmlands = currentUserStat.registeredFarmlands + 1; 
        })
    } 
    else {
        realm.write(()=>{
            const newStat = realm.create('UserStat', {
                _id: uuidv4(),
                userName: customUserData.name,
                userId: customUserData.userId,
                userDistrict: customUserData.userDistrict,
                userProvince: customUserData.userProvince,
                userRole: customUserData.role,
                registeredFarmlands: 1,
            });
        })
    }
    

    
}, [ realm, farmlandData ]);

// const updateFarlmandOwnerCategory = useCallback((owner, realm)=>{
    

// }, realm, farmlandData, owner)

  return (
  <>
    <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
    >
        <Stack 
                direction="row" 
                w="100%"
                // pt="3"
                bg={COLORS.fourth}
                
            >
            <Box w="20%">
                <TouchableOpacity
                    onPress={()=>{
                        // navigation.goBack();
                        setModalVisible(false);
                    }}                            
                >
                    <Icon 
                        name='arrow-back-ios' color={COLORS.second} size={30}  
                    />
                </TouchableOpacity>
            </Box>
            <Box w="60%">
                </Box>
                <Box w="20%">
                    <Icon 
                        name="close" 
                        size={35} 
                        color={COLORS.grey} 
                        onPress={() => setModalVisible(false)}
                    />
                </Box>
            </Stack>
        <ScrollView
            contentContainerStyle={{
                flex: 1, 
                justifyContent: 'center', 
                minHeight: '100%',
                paddingVertical: 15,
            }}
        >

            <Center 
            style={{ 
                paddingBottom: 5,    
                paddingTop: 10,
                width: '100%',
                // backgroundColor: '#EBEBE4',           
            }}
        >
            <Text
                style={{ 
                    fontFamily: 'JosefinSans-Bold', 
                    fontSize: 24,
                    fontWeigth: 'bold',
                    color: COLORS.black,
                    paddingTop: 15,

                }}
            >
                Confirmar Dados
            </Text>
        </Center>




    <Box mx="6" mt="5" >
        <CustomDivider
            marginVertical="1"
            thickness={1}
            bg="grey"
        />
        <Stack direction="row" w="100%" my="1">
            <Box w="40%">
                <Text style={styles.keys}>Pomar:</Text>
            </Box>
            <Box w="60%" style={styles.values}>
                <Text style={styles.values}>
                    {farmlandData?.description}
                </Text>
            </Box>
            </Stack>
            <CustomDivider
                marginVertical="1"
                thickness={1}
                bg="grey"
            />
        <Stack direction="row" w="100%" my="1">
            <Box w="40%">
                <Text style={styles.keys}>Ano de plantio:</Text>
            </Box>
            <Box w="60%" style={styles.values}>
                <Text style={styles.values}>
                    {farmlandData?.plantingYear} (ano)
                </Text>
            </Box>                    
        </Stack>
        <CustomDivider
            marginVertical="1"
            thickness={1}
            bg="grey"
        />
        <Stack direction="row" w="100%" my="1">
            <Box w="40%">
                <Text style={styles.keys}>Culturas consociadas:</Text>
            </Box>
            <Box w="60%" style={styles.values}>
                {
                farmlandData?.consociatedCrops?.length > 0 
                && farmlandData?.consociatedCrops?.map(crop=>{
                    return (
                        <Text key={crop} style={styles.values}>
                            {crop}
                        </Text>
                    )                
                })
            }
            </Box>
        </Stack>
        <CustomDivider
            marginVertical="1"
            thickness={1}
            bg="grey"
        />
        <Stack direction="row" w="100%" my="1">
            <Box w="40%">
                <Text style={styles.keys}>Cajueiros:</Text>
            </Box>
            <Box w="60%" style={styles.values}>
                <Text style={styles.values}>
                    {farmlandData?.trees} árvores
                </Text>
            </Box>
        </Stack>
        <CustomDivider
            marginVertical="1"
            thickness={1}
                bg="grey"
        />

        <Stack direction="row" w="100%" my="1">
            <Box w="40%">
                <Text style={styles.keys}>Área:</Text>
            </Box>
            <Box w="60%" style={styles.values}>
                <Text style={styles.values}>
                    {farmlandData?.totalArea} hectares (total)
                </Text>
                <Text style={styles.values}>
                    {farmlandData?.usedArea} hectares (aproveitada)
                </Text>
            </Box>
        </Stack>
        <CustomDivider
            marginVertical="1"
            thickness={1}
                bg="grey"
                />

        <Stack direction="row" w="100%" my="1">
            <Box w="40%">
                <Text style={styles.keys}>Compasso:</Text>
            </Box>
            <Box w="60%">
                <Box>
                    <Text style={styles.values}>
                        {farmlandData?.density?.mode}
                    </Text>
                    {
                        farmlandData?.density?.mode === 'Regular' && (
                            <>
                        <Text style={styles.values}>
                            {farmlandData?.density?.length + ' (comprimento)'}
                        </Text>
                        <Text style={styles.values}>
                            {farmlandData?.density?.width + ' (largura)'}
                        </Text>
                    </>
                )}
                </Box>
            </Box>
        </Stack>
        <CustomDivider
            marginVertical="1"
            thickness={1}
            bg="grey"
            />
        <Stack direction="row" w="100%" my="1">
            <Box w="40%">
                <Text style={styles.keys}>Tipo de plantas:</Text>
            </Box>
            <Box w="60%">
                <Box>
                    <Box style={styles.values}>
                        {farmlandData.plantTypes?.plantType?.map(p=><Text key={p} style={styles.values}>{p}</Text>)}
                    </Box>
{ farmlandData.plantTypes?.plantType?.some(el=>el.includes('enxer')) &&
                <Box>
            {
                farmlandData.plantTypes?.clones?.map(
                    clone=>(
                        <Text key={clone} style={[styles.values, { paddingLeft: 10, }]}>
                            - {clone}
                        </Text>
                        )
                )
            }
                </Box>
}
                </Box>
            </Box>
        </Stack>
        <CustomDivider
            marginVertical="1"
            thickness={1}
            bg="grey"
        />
        <Center
            w="100%"
        >
            <Button
                onPress={()=>{
                    try {
                        onAddFarmland(farmlandData, realm);    
                        setModalVisible(false);
                        setIsCoordinatesModalVisible(true);
                    } catch (error) {
                        throw new Error('Failed to register Farmland', { cause: error})
                    }
                    finally{
                        setPlantingYear('');
                        setDescription('');
                        setConsociatedCrops([]);
                        setClones([]);
                        setTrees('');
                        setUsedArea('');
                        setTotalArea('');
                        setDensityLength('');
                        setDensityWidth('');
                        setPlantTypes([]);
                        setDensityMode('');
                    }

                }}
                type="outline"
                title="Salvar Dados"
                containerStyle={{
                    width: '100%',
                }}
            />
        </Center>
        </Box>


    </ScrollView>
    </Modal>
    </>

  )
}

// export default FarmlandModal;