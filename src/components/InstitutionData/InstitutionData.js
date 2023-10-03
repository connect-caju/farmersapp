import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, SafeAreaView, FlatList } from 'react-native';
import { Box,  FormControl, Stack, Center, Separator, Thumbnail, List, ListItem } from 'native-base';
import { Divider, Icon } from '@rneui/base';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import { v4 as uuidv4 } from 'uuid';
import {  
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol } 
        from 'react-native-responsive-screen';  
import { 
    responsiveFontSize,
    responsiveScreenFontSize,
    responsiveHeight,
    responsiveWidth,
    responsiveScreenHeight,
    responsiveScreenWidth,
    useDimensionsChange,
  
  } from 'react-native-responsive-dimensions';


import CustomDivider from '../../components/Divider/CustomDivider';
import COLORS from '../../consts/colors';
import { TouchableOpacity } from 'react-native';

import EditInstitutionData from '../EditData/EditInstitutionData';

import AwesomeAlert from 'react-native-awesome-alerts';
import { resourceValidation } from '../../consts/resourceValidation';
import ConfirmData from '../EditData/ConfirmDataCopy';

import { roles } from '../../consts/roles';
import { errorMessages } from '../../consts/errorMessages';
import validateInvalidationMessage from '../../helpers/validateInvalidationMessage';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@realm/react';
import { realmContext } from '../../models/realmContext';
const { useRealm, useQuery, useObject } = realmContext; 

const institutionResourceMessage = 'institutionResourceMessage';

const InstitutionData = ({ farmer })=>{
    const realm = useRealm();
    const user = useUser();
    const navigation = useNavigation();
    const customUserData = user?.customData;
    const invalidationMotives = realm.objects('InvalidationMotive').filtered(`resourceId == "${farmer?._id}"`);

    const [isConfirmDataVisible, setIsConfirmDataVisible] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
   
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [isCollapseOn, setIsCallapseOne] = useState(false);

    // ------------------------------------------
    const [alert, setAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [titleAlert, setTitleAlert] = useState('');
    const [cancelText, setCancelText] = useState('');
    const [confirmText, setConfirmText] = useState('');
    const [showCancelButton, setShowCancelButton] = useState(false);
    const [showConfirmButton, setShowConfirmButton] = useState(false);
    const [validated, setValidated] = useState(false);
    const [invalidated, setInvalidated] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    // ---------------------------------------------

    const [dataToBeUpdated, setDataToBeUpdated] = useState('');

    
    
    // update institution manager personal data
    const [ institutionManagerPhone, setInstitutionManagerPhone  ] = useState('');
    const [ institutionManagerName, setInstitutionManagerName ] = useState('');

    const [oldInstitutionManagerPhone, setOldInstitutionManagerPhone ] = useState('');
    const [oldInstitutionManagerName, setOldInstitutionManagerName ] = useState('');

    // -----------------------------------------------

    const [newDataObject, setNewDataObject] = useState({});
    const [oldDataObject, setOldDataObject] = useState({});

    // ------------------------------------------------

    // idDocument

    const [institutionNuit, setInstitutionNuit] = useState('');
    const [institutionLicence, setInstitutionLicence] = useState('');

    const [oldInstitutionNuit, setOldInstitutionNuit] = useState('');
    const [oldInstitutionLicence, setOldInstitutionLicence] = useState('');

    
    
    // ----------------------------------------------------

    
    
    
    const validationAction = (realm, resourceId, flag)=>{
        realm.write(()=>{
            const foundFarmer = realm.objectForPrimaryKey('Institution', `${resourceId}`);
            if (flag === 'validate'){
                foundFarmer.status = resourceValidation.status.validated;
                foundFarmer.checkedBy = customUserData?.name;
            }
            else if (flag === 'invalidate') {
                foundFarmer.status = resourceValidation.status.invalidated;
                foundFarmer.checkedBy = customUserData?.name;
            }
        });
    };


    const addMessage = useCallback((realm, newResourceId, newMessage)=>{

        if (!validateInvalidationMessage(newMessage, errors, setErrors)){
            return ;
        } 

        const validatedMessage = validateInvalidationMessage(newMessage, errors, setErrors);

        const invalidationMotive = realm.objects('InvalidationMotive').filtered(`resourceId == "${newResourceId}"`);
        const newMessageObject = {
            position: (invalidationMotive[0] && invalidationMotive[0]?.messages?.length > 0) ? invalidationMotive[0]?.messages?.length + 1 : 0,
            message: validatedMessage,
            ownerName: customUserData?.name,
            createdAt: new Date(),
        };
        
        if (invalidationMotive?.length > 0){
           realm.write(()=>{
                invalidationMotive[0].messages.push(newMessageObject);
            });
        }
        else {

            realm.write(async ()=>{
                const newResourceMessage = await realm.create('InvalidationMotive', {
                    _id: uuidv4(),
                    resourceId: farmer?._id,
                    resourceName: 'Institution',
                    messages: [newMessageObject],  
                    createdAt: new Date(),
                });
            });
        }
    }, [ realm, user, message ]);



    useEffect(()=>{
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.removeByName(institutionResourceMessage);
            mutableSubs.add(
              realm.objects('InvalidationMotive').filtered(`resourceId == "${farmer._id}"`),
              {name: institutionResourceMessage},
            );
          });

        const interval = setInterval(()=>{
            setAutoRefresh(!autoRefresh);
        }, 2000);

        clearInterval(interval);

    }, [ realm, user, message, invalidationMotives, autoRefresh, isCollapseOn ]);

    return (
        <>

        <AwesomeAlert
            show={alert}
            
            titleStyle={{
                fontSize: 18,
                // paddingVertical: 15,
                // color: COLORS.ghostwhite,
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
                // height: '70%',
            }}

            contentStyle={{
                // flex: 1,
                // paddingVertical: 20,
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
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={showCancelButton}
            showConfirmButton={showConfirmButton}
            cancelText={cancelText}
            confirmText={confirmText}
            cancelButtonColor="#DD6B55"
            confirmButtonColor={COLORS.main}
            onCancelPressed={()=>{
                setAlert(false);
                setValidated(false);
                setInvalidated(false);
            }}
            onConfirmPressed={() => {
                setAlert(false);
                if (validated){
                    validationAction(realm, farmer?._id, 'validate');
                    setValidated(false);
                }
                else if (invalidated){
                    validationAction(realm, farmer?._id, 'invalidate');
                    setInvalidated(false);
                }
            }}
        />


    <Collapse
        style={{
            flex: 1,
            
        }}
        onToggle={(isOn)=>{
            setIsCallapseOne(isOn)
        }}
    >
        <CollapseHeader
            style={{                     
                height: hp('10%'),
                paddingTop: 14,
                backgroundColor: COLORS.pantone,
                paddingHorizontal: 10,
                marginVertical: hp('1%'),
                
                
            }}
            >
            <View
                style={{
                    
                }}
                >
                <Text
                    style={{ 
                        fontSize: responsiveFontSize(2), 
                        color: 'ghostwhite',
                        fontFamily: 'JosefinSans-Bold',
                    }}
                >
                    Dados da Instituição
                </Text>
                <Text
                    style={{ 
                        fontSize: responsiveFontSize(1.6),  
                        color: 'ghostwhite',
                        fontFamily: 'JosefinSans-Bold',
                        textAlign: 'right',
                    }}
                >
                    {farmer?.private ? 'Privada' : 'Pública'}
                </Text>                
            </View>
        </CollapseHeader>
        <CollapseBody>
        <View
            style={{
                marginBottom: 40,
                padding: 10,
                borderColor: COLORS.pantone,
                shadowColor: COLORS.pantone,
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,
                elevation: 3,
                paddingLeft: 20,
            }}
        >

        <Box
            style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 4,
            right: 4,
            zIndex: 1,
            flexDirection: 'row',
            borderColor: farmer?.status === resourceValidation.status.pending ? COLORS.danger : farmer?.status === resourceValidation.status.validated ? COLORS.pantone : COLORS.red,
            borderWidth: 2,
            borderRadius: 10,
            }}
        >
            <Icon 
                name={farmer?.status === resourceValidation.status.pending ? 'pending-actions' : farmer?.status === resourceValidation.status.validated ? 'check-circle' : 'dangerous'}
                size={wp('6%')}
                color={farmer?.status === resourceValidation.status.pending ? COLORS.danger : farmer?.status === resourceValidation.status.validated ? COLORS.pantone : COLORS.red}
            />
            <Text
                style={{
                    color: farmer?.status === resourceValidation.status.pending ? COLORS.danger : farmer?.status === resourceValidation.status.validated ? COLORS.pantone : COLORS.red,
                }}
            >
            {farmer?.status === resourceValidation.status.pending ? resourceValidation.message.pendingResourceMessage : farmer?.status === resourceValidation.status.validated ? resourceValidation.message.validatedResourceMessage : resourceValidation.message.invalidatedResourceMessage}
            </Text>
        </Box>


    <Stack w="100%" direction="column" pt="8" pb="4">
    <Stack w="100%" direction="row">

<Box w="90%">
    <Text
        style={{
            color: '#000',
            fontSize: 16,
            fontFamily: 'JosefinSans-Bold',
            
        }}
    >
            Instituição
        </Text>   
        </Box>

        <Box w="10%">
        </Box>
        </Stack>     

        <Stack w="100%" direction="row" space={1}>
            <Box w="50%" >
                <Text
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Bold',
                    }}
                    >
                {/* Instituição: */}
                </Text>
            </Box>
            <Box w="50%">
                <Text 
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}
                >
                {farmer?.type !== 'Outra' ? `${farmer?.type} ${farmer?.name}` : `${farmer?.name}`}  
                </Text>
                <Text 
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}
                >
                {farmer?.private ? 'Instituição privada' : 'Instituição pública'} 
                </Text>
            </Box>
        </Stack>
        </Stack>
        <CustomDivider />

        <Stack w="100%" direction="column" py="4">
        <Stack w="100%" direction="row" >
                <Box w="90%">
                    <Text
                        style={{
                            color: COLORS.black,
                            fontSize: 16,
                            fontFamily: 'JosefinSans-Bold',
                            
                        }}
                        >
                        Contacto
                    </Text>
                </Box>
                {/* <Box w="25%"></Box> */}
                <Box w="10%">
            { 
            customUserData?.role !== roles.provincialManager && 
                <TouchableOpacity
                    disabled={farmer?.status === resourceValidation.status.validated ? true : false}
                    style={{
                    }}
                    onPress={
                        ()=>{
                            setIsOverlayVisible(!isOverlayVisible);
                            setDataToBeUpdated('institutionManager');
                        }
                    }
                    >
                    <Icon 
                        name="edit"
                        size={20} 
                        color={farmer?.status === resourceValidation.status.validated ? COLORS.lightgrey : farmer?.status === resourceValidation.status.invalidated ? COLORS.red : COLORS.main }
                    />
                    </TouchableOpacity>
            }
                </Box>
            </Stack>
            <Stack w="100%" direction="row" space={1}>
            <Box w="50%">
                <Text
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                        
                    }}
                    >
                    Responsável
                </Text>
                </Box>
                <Box w="50%" >
                    <Text style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}
                    >
                        {farmer?.manager?.fullname}
                    </Text>
                </Box>
            </Stack>

            <Stack w="100%" direction="row" space={1}>
            <Box w="50%">
                <Text
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                        
                    }}
                    >
                    Telefone
                </Text>
                </Box>
                <Box w="50%" >
{   ((!farmer?.manager?.phone) || (farmer?.manager?.phone === 0)) &&
                 <Text style={{
                        color: 'grey',
                        fontSize: 13,
                        fontFamily: 'JosefinSans-Regular',
                    }}
                    >
                        (Nenhum)
                    </Text>
}
{ ((farmer?.manager?.phone) || (farmer?.manager?.phone !== 0))  &&
                <Text style={{
                    color: 'grey',
                    fontSize: 14,
                    // paddingLeft: 10,
                    fontFamily: 'JosefinSans-Regular',
                }}>
                    {farmer?.manager?.phone}
                </Text>
}
                </Box>
            </Stack>

            </Stack>

        <CustomDivider />

        <Stack w="100%" direction="column" py="4">
        <Stack w="100%" direction="row" >
            <Box w="90%">
                <Text
                    style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: 'JosefinSans-Bold',
                        
                    }}
                    >
                    Endereço
                </Text>
            </Box>
            {/* <Box w="5%"></Box> */}
            <Box w="10%">
        {/* {           
            customUserData?.role !== roles.provincialManager && 
            <TouchableOpacity
                    disabled={farmer?.status === resourceValidation.status.validated ? true : false}
                    style={{
                    }}
                    onPress={
                        ()=>{
                            
                        }
                    }
                >
                    <Icon 
                        // name="home" 
                        name="edit" 
                        size={20} 
                        color={farmer?.status === resourceValidation.status.validated ? COLORS.lightgrey : farmer?.status === resourceValidation.status.invalidated ? COLORS.red : COLORS.main } 
                    />
                </TouchableOpacity>
            } */}
            </Box>
        </Stack>


        <Stack w="100%" direction="row" space={1}>
            <Box w="50%">
                <Text
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}                    
                >
                    Província
                </Text>  
            </Box>
        <Box>
    {   farmer?.address?.province &&
        <Text                         
            style={{
                color: 'grey',
                fontSize: 14,
                //  paddingLeft: 10,
                fontFamily: 'JosefinSans-Regular',
            }} 
        >
            {farmer?.address?.province}
        </Text>
    }
    </Box>
    </Stack>

    <Stack w="100%" direction="row" space={1}>
        <Box w="50%">
            <Text
                style={{
                    color: 'grey',
                    fontSize: 14,
                    fontFamily: 'JosefinSans-Regular',
                }}                    
            >
                Distrito
            </Text>  
        </Box>
        <Box>
            <Text
                style={{
                    color: 'grey',
                    fontSize: 14,
                    fontFamily: 'JosefinSans-Regular',
                }}                    
            >
                {farmer?.address?.district ? farmer?.address?.district : '(Não Aplicável)'}
            </Text>  
        </Box>
    </Stack>

    <Stack w="100%" direction="row" space={1}>
        <Box w="50%">
            <Text
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}                    
                    >
                Posto Admin.
            </Text>  
        </Box>
        <Box>
            <Text
                style={{
                    color: 'grey',
                    fontSize: 14,
                    fontFamily: 'JosefinSans-Regular',
                }}                    
            >
                {farmer?.address?.adminPost ? farmer?.address?.adminPost : '(Não Aplicável)' }
            </Text>  
        </Box>
    </Stack>

    <Stack w="100%" direction="row" space={1}>
        <Box w="50%">
            <Text
                style={{
                    color: 'grey',
                    fontSize: 14,
                    fontFamily: 'JosefinSans-Regular',
                }}                    
            >
                Localidade
            </Text>  
        </Box>
        <Box>
            <Text
                style={{
                    color: 'grey',
                    fontSize: 14,
                    fontFamily: 'JosefinSans-Regular',
                }}                    
            >
                {farmer?.address?.village ? farmer?.address?.village : '(Não Aplicável)' }
            </Text>  
        </Box>
    </Stack>

    </Stack>
    <CustomDivider />


    <Stack w="100%" direction="column" py="4">
    <Stack w="100%" direction="row" >
            <Box w="90%">
                <Text
                    style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: 'JosefinSans-Bold',
                        
                    }}
                    >
                    Documentos
                </Text>
            </Box>
            {/* <Box w="5%"></Box> */}
            <Box w="10%">
            {     
                customUserData?.role !== roles.provincialManager && 
                <TouchableOpacity
                    disabled={farmer?.status === resourceValidation.status.validated ? true : false}
                    style={{
                    }}
                    onPress={
                        ()=>{
                            setIsOverlayVisible(!isOverlayVisible);
                            setDataToBeUpdated('institutionDocument');
                        }
                    }
                >
                <Icon 
                    name="edit"
                    size={20} 
                    color={farmer?.status === resourceValidation.status.validated ? COLORS.lightgrey : farmer?.status === resourceValidation.status.invalidated ? COLORS.red : COLORS.pantone }
                />
                </TouchableOpacity>
            }
            </Box>
        </Stack>


        <Stack w="100%" direction="row" space={1}>
            <Box w="50%">
                <Text
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}                    
                >
                    NUIT
                </Text>  
            </Box>
        <Box>
        <Text                         
            style={{
                color: 'grey',
                fontSize: 14,
                //  paddingLeft: 10,
                fontFamily: 'JosefinSans-Regular',
            }} 
        >
            {(farmer?.nuit && farmer?.nuit !== 0) ? farmer?.nuit : '(Nenhum)'}
        </Text>
    </Box>
    </Stack>

    <Stack w="100%" direction="row" space={1}>
            <Box w="50%">
                <Text
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}                    
                >
                    Alvará/Licença
                </Text>  
            </Box>
        <Box>
        <Text                         
            style={{
                color: 'grey',
                fontSize: 14,
                //  paddingLeft: 10,
                fontFamily: 'JosefinSans-Regular',
            }} 
        >
            {(farmer?.licence && farmer?.licence !== '') ? farmer?.licence : '(Nenhum)'}
        </Text>
    </Box>
    </Stack>
    </Stack>

    <CustomDivider />

    <Stack w="100%" direction="column" py="4">
        <Stack w="100%" direction="row" >
            <Box w="90%">
                <Text
                    style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: 'JosefinSans-Bold',
                        
                    }}
                    >
                    Geolocalização
                </Text>
            </Box>
            <Box w="10%">
        {   

        customUserData?.role !== roles.provincialManager && 
                <TouchableOpacity
                disabled={farmer?.status === resourceValidation.status.validated ? true : false}
                    style={{

                    }}
                    onPress={
                        ()=>{
                            navigation.navigate('Geolocation', {
                            resourceName: 'Institution',
                            resourceId: farmer._id,
                        })
                    }}
                >
                    <Icon 
                        name="add-location-alt" 
                        size={30} 
                        color={farmer?.status === resourceValidation.status.validated ? COLORS.lightgrey : farmer?.status === resourceValidation.status.invalidated ? COLORS.red : COLORS.pantone }
                    />
                </TouchableOpacity>
            }
            </Box>
        </Stack>

{ farmer?.geolocation?.latitude && farmer?.geolocation?.longitude &&
<>
        <Stack w="100%" direction="row">
            <Box w="50%">
                <Text                     
                    style={{
                        color: COLORS.grey,
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}  
                    >
                    Latitude
                </Text>
            </Box>
            <Box>
                <Text                     
                    style={{
                        color: COLORS.grey,
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}  
                    >
                    {farmer?.geolocation?.latitude}
                </Text>
            </Box>
        </Stack>
        <Stack w="100%" direction="row">
            <Box w="50%">
                <Text                     
                    style={{
                        color: COLORS.grey,
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}  
                    >
                    Longitude
                </Text>
            </Box>
            <Box>
                <Text                     
                    style={{
                        color: COLORS.grey,
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}
                    >
                    {farmer?.geolocation?.longitude}
                </Text>
            </Box>
        </Stack>
</>
}
</Stack>



    <CustomDivider />

    <Stack direction="column" w="100%" style={{ paddingTop: 5,  }} >
        <Box w="100%">
            <Text 
            style={{ 
                textAlign: 'right',
                color: COLORS.grey,
                fontFamily: 'JosefinSans-Italic',
                fontSize: 12,
            }}
            >
            Registado por {farmer?.userName === customUserData?.name ? 'mim' : farmer?.userName}
            {' '}aos{' '}                 
            {new Date(farmer?.createdAt).getDate()}-{new Date(farmer?.createdAt).getMonth()+1}-{new Date(farmer?.createdAt).getFullYear()}
            </Text>

            { farmer?.modifiedBy &&
            <Box w="100%">
                    <Text 
                    style={{ 
                        textAlign: 'right',
                        color: COLORS.grey,
                        fontFamily: 'JosefinSans-Italic',
                        fontSize: 12,
                    }}
                    >
                    Actualizado por {farmer?.modifiedBy === customUserData?.name ? 'mim' : farmer?.modifiedBy}
                    {' '}aos{' '}                 
                    {new Date(farmer?.modifiedAt).getDate()}-{new Date(farmer?.modifiedAt).getMonth()+1}-{new Date(farmer?.modifiedAt).getFullYear()} 
                    </Text>
                </Box>
            }


        </Box>
        
    {
    farmer?.status === resourceValidation.status.invalidated &&
        <Box w="100%">
            <Text
                style={{ 
                    textAlign: 'right',
                    color: COLORS.grey,
                    fontFamily: 'JosefinSans-Italic',
                    fontSize: 12,
                }}
            >
                Invalidado por {farmer?.checkedBy ? farmer?.checkedBy : 'Connect Caju'}
                {/* Invalidado por {farmer?.checkedBy} */}
            </Text>
        </Box>
    }
    {
    farmer?.status === resourceValidation.status.validated &&
        <Box w="100%">
            <Text
                style={{ 
                    textAlign: 'right',
                    color: COLORS.grey,
                    fontFamily: 'JosefinSans-Italic',
                    fontSize: 12,
                }}
            >
                Validado por {farmer?.checkedBy}
            </Text>
        </Box>
    }
    </Stack>


    {
    farmer?.status === resourceValidation.status.invalidated && 
    <>
{ customUserData?.role !== roles.provincialManager &&
    <Text style={{
        textAlign: 'left',
        color: COLORS.red,
        fontSize: 16,
        fontFamily: 'JosefinSans-Bold',
    }}>
        Motivo da invalidação
    </Text>
}
    {/* <Box 
        // w="100%"
        style={{
            // alignItems: 'center',
            paddingTop: 5,
        }}
    > */}
        {
        invalidationMotives?.length > 0 ?
        (invalidationMotives?.length > 0 && invalidationMotives[0]?.messages?.length > 0) && 
            invalidationMotives[0]?.messages?.map((motive, index)=>(
                <Box 
                    key={index}
                    style={{
                        flexGrow: 1,
                        backgroundColor: COLORS.fourth,
                        borderRadius: 20,
                        paddingHorizontal: 5,
                        paddingVertical: 5,
                        marginVertical: 5,
                        marginHorizontal: 5,
                        alignItems: 'flex-end',
                    }}
                >
                    {/* <Box> */}
                        <Text
                            style={{
                                fontSize: 14,
                                fontFamily: 'JosefinSans-Italic',
                                color: COLORS.black,
                                textAlign: 'left',
                            }}
                        >
                            {motive.message ? motive.message : ''}
                        </Text>
            
                        <Text 
                            style={{ 
                                textAlign: 'right', 
                                fontSize: 12, 
                                color: COLORS.black, 
                                paddingTop: 5,
                            }}
                        >
                            {motive?.ownerName} ({new Date(motive?.createdAt).getDate()}-{new Date(motive?.createdAt).getMonth()+1}-{new Date(motive?.createdAt).getFullYear()})
                        </Text>
                    {/* </Box> */}
                </Box>
            ))
            :
            <Box 
                // key={index}
                style={{
                    flexGrow: 1,
                    backgroundColor: COLORS.fourth,
                    borderRadius: 20,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    marginVertical: 5,
                    marginHorizontal: 5,
                    alignItems: 'flex-end',
                }}
            >
                <Text
                style={{
                    fontSize: responsiveFontSize(1.6),
                    fontFamily: 'JosefinSans-Italic',
                    color: COLORS.black,
                    textAlign: 'left',
                }}
                >
                    Dados incompletos.
                </Text>
                <Text 
                    style={{ 
                        textAlign: 'right', 
                        fontSize: responsiveFontSize(1.6),
                        color: COLORS.black, 
                        paddingTop: 5,
                    }}
                >
                    Connect Caju.
                </Text>
            </Box>
        }


    {/* </Box> */}
    </>
}



{ (farmer?.status === resourceValidation.status.invalidated && customUserData?.role === roles.provincialManager) &&
        <>
        <Stack 
        direction="row" 
        w="100%" 
        space={1}
    >
        <Box w="85%">
        <FormControl isRequired isInvalid={'invalidationMessage' in errors}>
            <FormControl.Label>Motivo da invalidação</FormControl.Label>
                <TextInput 
                    style={{
                        borderWidth: 2,
                        borderColor: COLORS.lightgrey,
                        borderRadius: 20,
                        padding: 10,
                        fontSize: 16,
                        backgroundColor: '#efefef',
                    }}
                    placeholder={`Deixa uma mensagem para ${farmer?.userName?.split(' ')[0]}`}
                    multiline={true}
                    textAlignVertical="top"
                    numberOfLines={2}
                    maxLength={120}
                    value={message}
                    onChangeText={newMessage=>{
                        setErrors({
                            invalidationMessage: '',
                        })
                    setMessage(newMessage)
                }}
                />
            {
                'invalidationMessage' in errors 
                ? <FormControl.ErrorMessage 
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: 'xs'}}>{errors?.invalidationMessage}</FormControl.ErrorMessage> 
                : <FormControl.HelperText></FormControl.HelperText>
            }
        </FormControl>
        </Box>
        <Box
            style={{
                width: '15%',
                alignItems: 'baseline',
                justifyContent: 'center',
            }}
        >
{  message &&
          <Box
                style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    padding: 5,
                    borderRadius: 100,
                    width: wp('10%'),
                    height: hp('6%'),
                    borderWidth: 1,
                    borderColor: COLORS.pantone,
                    backgroundColor: COLORS.pantone,
                }}
            >
            <TouchableOpacity
                onPress={()=>{
                    try{
                        addMessage(realm, farmer?._id, message);
                    }
                    catch(error) {
                        console.log('Failed to add invalidation message');
                        return ;
                    }
                    finally{
                        setMessage('');
                    }
                }}
            >
                <Icon 
                    name="send" 
                    size={wp('6%')}  
                    color={COLORS.ghostwhite} 
                    iconStyle={{
                        transform: [{ rotate: '-45deg' }]
                    }}
                />
            </TouchableOpacity>

            </Box>
    }
        </Box>
        <Box w="0%">

        </Box>

    </Stack>


    </>

}





    { (customUserData?.role === roles.provincialManager) && (farmer?.status === resourceValidation.status.pending ) &&
<Stack direction="row" w="100%" style={{ paddingVertical: 5,  }} space={3} >
        <Box w="50%"
            style={{
                alignItems: 'center',
            }}
            >
            <TouchableOpacity
                disabled={farmer?.status === resourceValidation.status.validated ? true : false}
                onPress={()=>{
                    // validationAction(realm, farmer._id, 'validate');
                    setAlert(true);
                    setValidated(true);
                    setTitleAlert(errorMessages.resourceValidation.title);
                    setMessageAlert(errorMessages.resourceValidation.message);
                    setShowCancelButton(errorMessages.resourceValidation.showCancelButton);
                    setShowConfirmButton(errorMessages.resourceValidation.showConfirmButton);
                    setCancelText(errorMessages.resourceValidation.cancelText);
                    setConfirmText(errorMessages.resourceValidation.confirmText);
                }}
            >
                <Text
                    style= {{
                        color: farmer.status === resourceValidation.status.validated ? COLORS.lightgrey : COLORS.main,
                        fontSize: 15,
                        fontFamily: 'JosefinSans-Bold',
                    }}
                >
                    Validar Registo
                </Text>
            </TouchableOpacity>
        </Box>
        <Box w="50%"
            style={{
                alignItems: 'center',
                paddingRight: 5,
            }}
        >
            <TouchableOpacity
                disabled={farmer?.status === resourceValidation.status.validated ? true : false}
                onPress={()=>{
                    setAlert(true);
                    setInvalidated(true);
                    setTitleAlert(errorMessages.resourceInvalidation.title);
                    setMessageAlert(errorMessages.resourceInvalidation.message);
                    setShowCancelButton(errorMessages.resourceInvalidation.showCancelButton);
                    setShowConfirmButton(errorMessages.resourceInvalidation.showConfirmButton);
                    setCancelText(errorMessages.resourceInvalidation.cancelText);
                    setConfirmText(errorMessages.resourceInvalidation.confirmText);
                }}
            >
                <Text
                    style= {{
                        color: farmer?.status === resourceValidation.status.validated ? COLORS.lightgrey : COLORS.red,
                        fontSize: 15,
                        fontFamily: 'JosefinSans-Bold',
                    }}
                >
                    Invalidar Registo
                </Text>
            </TouchableOpacity>

        </Box>
    </Stack>
}

</View>

{
    isOverlayVisible && 
    (
    <EditInstitutionData 
    isOverlayVisible={isOverlayVisible}
    setIsOverlayVisible={setIsOverlayVisible}
    isConfirmDataVisible={isConfirmDataVisible}
    setIsConfirmDataVisible={setIsConfirmDataVisible}
    
    ownerName={farmer?.type + ' ' + farmer?.name}
    resource={farmer}
    resourceName={"Institution"}
    dataToBeUpdated={dataToBeUpdated}

    newDataObject={newDataObject}
    oldDataObject={oldDataObject}
    setNewDataObject={setNewDataObject}
    setOldDataObject={setOldDataObject}

    // the institution manager personal data
    institutionManagerPhone={institutionManagerPhone}
    setInstitutionManagerPhone={setInstitutionManagerPhone}
    institutionManagerName={institutionManagerName}
    setInstitutionManagerName={setInstitutionManagerName}
    oldInstitutionManagerPhone={oldInstitutionManagerPhone}
    setOldInstitutionManagerPhone={setOldInstitutionManagerPhone}
    oldInstitutionManagerName={oldInstitutionManagerName}
    setOldInstitutionManagerName={setOldInstitutionManagerName}

    // the institution documents
    institutionNuit={institutionNuit}
    setInstitutionNuit={setInstitutionNuit}
    institutionLicence={institutionLicence}
    setInstitutionLicence={setInstitutionLicence}
    oldInstitutionNuit={oldInstitutionNuit}
    setOldInstitutionNuit={setOldInstitutionNuit}
    oldInstitutionLicence={oldInstitutionLicence}
    setOldInstitutionLicence={setOldInstitutionLicence}

   

    />
    )
    }

{isConfirmDataVisible &&
        <ConfirmData
            // setIsOverlayVisible={setIsOverlayVisible}
            isConfirmDataVisible={isConfirmDataVisible}
            setIsConfirmDataVisible={setIsConfirmDataVisible}
            ownerName={farmer?.type + ' ' + farmer?.name}
            newDataObject={newDataObject}
            oldDataObject={oldDataObject}
            dataToBeUpdated={dataToBeUpdated}
            resource={farmer}
            resourceName={'Institution'}
        />
    }

    </CollapseBody>
    </Collapse>  
        </>
    )
}

export default InstitutionData;