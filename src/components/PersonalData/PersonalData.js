import React, { useEffect, useState, useCallback, useRef, } from 'react';
import { 
    Animated, Easing, View, TouchableOpacity, Modal, 
    TextInput, Text, ScrollView, InteractionManager, 
    SafeAreaView, FlatList ,
    useNativeDriver,
} from 'react-native';
import { Box,  FormControl, Stack, } from 'native-base';
import { Divider, Icon } from '@rneui/base';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import { v4 as uuidv4 } from 'uuid';
import { useFocusEffect } from '@react-navigation/native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
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
  import Tooltip from 'react-native-walkthrough-tooltip'

import CustomDivider from '../../components/Divider/CustomDivider';
import COLORS from '../../consts/colors';
import EditFarmerData from '../EditData/EditFarmerData';
import { errorMessages } from '../../consts/errorMessages';
import { roles } from '../../consts/roles';
import ConfirmData from '../EditData/ConfirmDataCopy';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisVertical, faPeopleGroup, faEye, } from '@fortawesome/free-solid-svg-icons';

import { useUser } from '@realm/react';
import { realmContext } from '../../models/realmContext';
import AwesomeAlert from 'react-native-awesome-alerts';
import { resourceValidation } from '../../consts/resourceValidation';
import validateInvalidationMessage from '../../helpers/validateInvalidationMessage';
import CustomActivityIndicator from '../ActivityIndicator/CustomActivityIndicator';
import { PopupMenu } from '../PopupMenu/PopupMenu';
import { Platform } from 'react-native';
import { StatusBar } from 'react-native';
import BottomSheet from '../EditData/EditDataBottomSheet';
const { useRealm, useQuery, useObject } = realmContext; 


const resourceMessage = 'resourceMessage';

const PersonalData = ({ 
    farmer, setRefresh, refresh,
    setIsOverlayVisible, isOverlayVisible,
    resizeBox, scale,
    // BottomSheetRef,
    // onScrollToBottomSheet,
})=>{

    const realm = useRealm();
    const navigation = useNavigation();
    const user = useUser();
    const customUserData = user?.customData
    const invalidationMotives = realm.objects('InvalidationMotive').filtered(`resourceId == "${farmer?._id}"`);

    // an array length 0 or 1 of actor
    const membership = realm.objects('ActorMembership').filtered(`actorId == "${farmer?._id}"`);
    let member;
    
    if (membership?.length > 0) {
        // retrieve the only actor membership object
        member = membership[0];
    }

    // controle EditFarmerData Component animation
    // const scale = useRef(new Animated.Value(0)).current;    
    const [isConfirmDataVisible, setIsConfirmDataVisible] = useState(false);
    const [popupMenuVisible, setPopupMenuVisible] = useState(false);
    
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

    
    //  update address
    const [addressProvince, setAddressProvince] = useState('');
    const [addressDistrict, setAddressDistrict] = useState('');
    const [addressAdminPost, setAddressAdminPost] = useState('');
    const [addressVillage, setAddressVillage] = useState('');
    
    const [selectedAddressAdminPosts, setSelectedAddressAdminPosts] = useState([]);

    const [addressOldProvince, setAddressOldProvince] = useState('');
    const [addressOldDistrict, setAddressOldDistrict] = useState('');
    const [addressOldAdminPost, setAddressOldAdminPost] = useState('');
    const [addressOldVillage, setAddressOldVillage] = useState('');

    //  -----------------------------------------------------

    // update contact
    const [ primaryPhone, setPrimaryPhone  ] = useState('');
    const [ secondaryPhone, setSecondaryPhone ] = useState('');

    const [oldPrimaryPhone, setOldPrimaryPhone ] = useState('');
    const [oldSecondaryPhone, setOldSecondaryPhone ] = useState('');

    // ----------------------------------------------------


    const [newDataObject, setNewDataObject] = useState({});
    const [oldDataObject, setOldDataObject] = useState({});

    // -----------------------------------------------
    
    // idDocument
    const [docNumber, setDocNumber] = useState('');
    const [docType, setDocType] = useState('');
    const [nuit, setNuit] = useState('');

    const [oldDocNumber, setOldDocNumber] = useState('')
    const [oldDocType, setOldDocType] = useState('');
    const [oldNuit, setOldNuit] = useState('');
    
    const [isEllipsisVisible, setIsEllipsisVisible] = useState(false);
    // ---------------------------------------------------------------
    
    // const bottomSheetRef = useRef(null);
    // const onScrollToBottomSheet = useCallback(()=>{
    //     const isActive = bottomSheetRef?.current?.isActive();
    //     if (isActive) {
    //         bottomSheetRef?.current?.scrollTo(0);

    //     }
    //     else {
    //         bottomSheetRef?.current?.scrollTo(-200);
    //     }
    // }, [])




    // ---------------------------------------------------
    const validationAction = (realm, resourceId, flag)=>{
        realm.write(()=>{
            const foundFarmer = realm.objectForPrimaryKey('Actor', `${resourceId}`);
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
                    resourceName: 'Farmer',
                    messages: [newMessageObject],  
                    createdAt: new Date(),
                });
            });
        }
    }, [ realm, user, message ]);


    useEffect(()=>{
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.removeByName(resourceMessage);
            mutableSubs.add(
              realm.objects('InvalidationMotive').filtered(`resourceId == "${farmer._id}"`),
              {name: resourceMessage},
            );
          });
        
        const interval = setInterval(()=>{
            setAutoRefresh(!autoRefresh);
        }, 2000);

        clearInterval(interval);
    }, [ realm, user, message, invalidationMotives, autoRefresh, isCollapseOn ]);


    const [loadingActivitiyIndicator, setLoadingActivityIndicator] = useState(false);

    useFocusEffect(
      React.useCallback(() => {
        const task = InteractionManager.runAfterInteractions(() => {
          setLoadingActivityIndicator(true);
        });
        return () => task.cancel();
      }, [])
    );

    // Animate by resizing EditFarmerData Component
    // const resizeBox = (to)=>{
    //     to === 1 && setIsOverlayVisible(true);
    //     Animated.timing(scale, {
    //         toValue: to,
    //         useNativeDriver: true,
    //         duration: 400,
    //         easing: Easing.linear,
    //     }).start(()=> to === 0 && setIsOverlayVisible(false));
        
    // }
  
  
  
    if (loadingActivitiyIndicator) {
      return <CustomActivityIndicator
          loadingActivitiyIndicator={loadingActivitiyIndicator}
          setLoadingActivityIndicator={setLoadingActivityIndicator}
      />
    }



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
            setIsCallapseOne(isOn);
            setRefresh(!isOn);
        }}
    >
        <CollapseHeader
            style={{                     
                height:  hp('10%'),
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
                    Dados Pessoais
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
                    Nascimento
                </Text>
            </Box>
            {/* <Box w="25%"></Box> */}
            <Box w="10%">
        {               
        // customUserData?.role !== roles.provincialManager && 
        //         <TouchableOpacity
        //             disabled={farmer?.status === resourceValidation.status.validated ? true : false}
        //             style={{
        //             }}
        //             onPress={
        //                 ()=>{
        //                     setIsOverlayVisible(!isOverlayVisible);
        //                 }
        //             }
        //         >
        //             <Icon 
        //                 // name="home" 
        //                 name="edit" 
        //                 size={20} 
        //                 color={farmer?.status === resourceValidation.status.validated ? COLORS.lightgrey : farmer?.status === resourceValidation.status.invalidated ? COLORS.red : COLORS.main } 
        //                 />
        //         </TouchableOpacity>
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
                    Data:</Text>
                </Box>
                <Box w="50%">
                    <Text                         
                        style={{
                            color: 'grey',
                            fontSize: 14,
                            // paddingLeft: 10,
                            fontFamily: 'JosefinSans-Regular',
                        }} 
                    >
                        {`${new Date(farmer?.birthDate).getDate()}/${new Date(farmer?.birthDate).getMonth()+1}/${new Date(farmer?.birthDate).getFullYear()}`}  ({new Date().getFullYear() - new Date(farmer?.birthDate).getFullYear()} anos)
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
                    { farmer?.birthPlace?.province?.includes('Estrangeiro') ? 'País' : 'Província' }
                </Text>  
            </Box>
        <Box>
    {   farmer?.birthPlace?.province &&
        <Text                         
            style={{
                color: 'grey',
                fontSize: 14,
                //  paddingLeft: 10,
                fontFamily: 'JosefinSans-Regular',
            }} 
        >
            {farmer?.birthPlace?.province}
        </Text>
    }
    </Box>
    </Stack>
{
    !farmer?.birthPlace?.province?.includes('Estrangeiro') &&
    <>
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
                {farmer?.birthPlace?.district ? farmer?.birthPlace?.district : '(Não Aplicável)'}
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
                {farmer?.birthPlace?.adminPost ? farmer?.birthPlace?.adminPost : '(Não Aplicável)' }
            </Text>  
        </Box>
    </Stack>
    </>
}

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
                            // resizeBox(1);
                            setDataToBeUpdated('address');
                        }
                    }
                >
                    <Icon 
                        // name="home" 
                        name="edit" 
                        size={20} 
                        color={farmer?.status === resourceValidation.status.validated ? COLORS.lightgrey : farmer?.status === resourceValidation.status.invalidated ? COLORS.red : COLORS.pantone } 
                    />
                </TouchableOpacity>
        }
            {
                // popupMenuVisible && 
                //     <PopupMenu 
                //         popupMenuVisible={popupMenuVisible}  
                //         setPopupMenuVisible={setPopupMenuVisible}
                //     />
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
                                // resizeBox(1);
                                setDataToBeUpdated('contact');
                            }
                        }
                    >
                        <Icon 
                            // name="contacts" 
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
                    Telefone
                </Text>  
            </Box>
            <Box w="50%">
            { (farmer?.contact?.primaryPhone !== 0 && farmer?.contact?.secondaryPhone !== 0) &&
                <>
                    <Text 
                        style={{
                            color: 'grey',
                            fontSize: 14,
                            fontFamily: 'JosefinSans-Regular',
                        }}  
                    >
                        {farmer?.contact?.primaryPhone} 
                    </Text>  
                    <Text 
                        style={{
                            color: 'grey',
                            fontSize: 14,
                            fontFamily: 'JosefinSans-Regular',
                        }}  
                    >
                        {farmer?.contact?.secondaryPhone} 
                    </Text>                 
                </>
            }

            {
                (farmer?.contact?.primaryPhone !== 0 && farmer?.contact?.secondaryPhone === 0) &&
                    <Text 
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}  
                    >
                        {farmer?.contact?.primaryPhone} 
                    </Text> 
            }

            {
                (farmer?.contact?.primaryPhone === 0 && farmer?.contact?.secondaryPhone !== 0) &&
                    <Text 
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}  
                    >
                        {farmer?.contact?.secondaryPhone} 
                    </Text> 
            }


            {
                (farmer?.contact?.primaryPhone === 0 && farmer?.contact?.secondaryPhone === 0) &&
                    <Text 
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}  
                    >
                        Nenhum 
                    </Text> 
            }


                {/* <Text 
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}  
                >
                    {farmer?.contact?.primaryPhone !== 0 ? farmer?.contact?.primaryPhone : 'Nenhum'} 
                </Text>
                <Text 
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }}  
                    >
                    {farmer?.contact?.secondaryPhone !== 0 ? farmer?.contact?.secondaryPhone: 'Nenhum'} 
                </Text>     */}
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
                    Documentos de Identificação
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
                        //    resizeBox(1);
                            setDataToBeUpdated('idDocument');
                        }
                    }
                >
                    <Icon 
                        // name="file-present" 
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
                    Tipo
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
            {farmer?.idDocument?.docType !== 'Nenhum' ? farmer?.idDocument?.docType : '(Nenhum)'}
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
                Número
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
                {farmer?.idDocument?.docNumber !== 'Nenhum' ? farmer?.idDocument?.docNumber : '(Nenhum)'}
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
                NUIT
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
                {farmer?.idDocument?.nuit !== 0 ? farmer?.idDocument?.nuit : '(Nenhum)' }
            </Text>  
        </Box>
    </Stack>
    <Box  py="4">
        <CustomDivider />
    </Box>

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
                            resourceName: 'Farmer',
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

    <Box  py="4">
        <CustomDivider />
    </Box>

    <Stack w="100%" direction="row" pb="4">
            <Box w="90%">
                <Text
                    style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: 'JosefinSans-Bold',
                        
                    }}
                    >
                    Adesão à Organização 
                </Text>
            </Box>
            <Box w="10%">
    
{customUserData?.role !== roles.provincialManager && 

            <Tooltip
                isVisible={isEllipsisVisible}
                disableShadow={true}
                placement="left"
                childContentSpacing={4}
                topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0 }
                content={<Box
                    style={{
                        flexDirection: 'column',
                        minWidth: "80%",
                        minHeight: 120,
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        style={{
                            justifyContent: 'center',
                        }}
                    >
                        <TouchableOpacity
                            onPress={()=>{
                                navigation.navigate('Membership', {
                                    resourceName: 'Farmer',
                                    resourceId: farmer._id,
                                });
                                setIsEllipsisVisible(false);
                            }}
                        >
                            <Box
                                style={{
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                                paddingLeft: 10,
                                paddingVertical: 10,
                                // height: 80,
                            }}  
                            >
                                <FontAwesomeIcon icon={faPeopleGroup} size={20} color={COLORS.grey} />
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'JosefinSans-Regular',
                                        color: COLORS.grey,
                                        paddingLeft: 20,
                                    }}
                                >Aderir a uma organização</Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                    <CustomDivider />
                    <Box
                        style={{
                            justifyContent: 'center',
                        }}
                    >
                        <TouchableOpacity
                            onPress={()=>{
                                navigation.navigate('FarmerGroups', {
                                    farmerId: farmer._id,
                                });
                                setIsEllipsisVisible(false);

                            }}
                        >
                            <Box
                                style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    alignItems: 'center',
                                    paddingLeft: 10,
                                    paddingVertical: 10,
                                    // height: 80,
                                }} 
                            >
                                <FontAwesomeIcon icon={faEye} size={20} color={COLORS.grey} />
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontFamily: 'JosefinSans-Regular',
                                        color: COLORS.grey,
                                        paddingLeft: 20,
                                    }}
                                >Ver organizações</Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </Box>}
                onClose={()=>setIsEllipsisVisible(false)}
            >
</Tooltip>
}
            </Box>
        </Stack>
    {member &&  (member?.membership?.length === 0) &&
    <>
        <Stack w="100%" direction="row">
            <Box w="50%">
                <Text
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }} 
                >Membro de organização</Text>
            </Box>
            <Box w="50%">
                <Text
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }} 
                >Sim</Text>
            </Box>

        </Stack>
        <Box w="100%" py="4">
            <Text                     
                style={{
                    color: COLORS.red,
                    fontSize: 15,
                    fontFamily: 'JosefinSans-Regular',
                    textAlign: 'center',
                    paddingHorizontal: 10,
                    lineHeight: 25,
                }}  
                >
                Especifica a organização a qual este produtor aderiu.
            </Text>
        </Box>
    </>
    }


{member && (member?.membership?.length > 0) &&

    <Box  pb="4">
        <Stack w="100%" direction="row">
            <Box w="50%">
                <Text
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }} 
                >Membro</Text>
            </Box>
            <Box w="50%">
                <Text
                    style={{
                        color: 'grey',
                        fontSize: 14,
                        fontFamily: 'JosefinSans-Regular',
                    }} 
                >{member?.membership?.length} {member?.membership?.length == 1 ? 'organização' : 'organizações'}</Text>
            </Box>
        </Stack>
    </Box>
}



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
        </Box>

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
        </Box>}

        
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
                Invalidado por {farmer?.checkedBy ? farmer?.checkedBy : 'ConnectCaju'}
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
        <EditFarmerData 
            isOverlayVisible={isOverlayVisible}
            setIsOverlayVisible={setIsOverlayVisible}
            resizeBox={resizeBox}
            scale={scale}
            isConfirmDataVisible={isConfirmDataVisible}
            setIsConfirmDataVisible={setIsConfirmDataVisible}

            ownerName={farmer?.names?.otherNames + ' ' + farmer?.names?.surname}
            resource={farmer}
            resourceName={'Farmer'}
            dataToBeUpdated={dataToBeUpdated}

            newDataObject={newDataObject}
            oldDataObject={oldDataObject}
            setNewDataObject={setNewDataObject}
            setOldDataObject={setOldDataObject}

            addressProvince={addressProvince}
            setAddressProvince={setAddressProvince}
            addressDistrict={addressDistrict}
            setAddressDistrict={setAddressDistrict}
            addressAdminPost={addressAdminPost}
            setAddressAdminPost={setAddressAdminPost}
            addressVillage={addressVillage}
            setAddressVillage={setAddressVillage}
                        
            selectedAddressAdminPosts={selectedAddressAdminPosts}
            setSelectedAddressAdminPosts={setSelectedAddressAdminPosts}
            addressOldProvince={addressOldProvince}
            setAddressOldProvince={setAddressOldProvince}
            addressOldDistrict={addressOldDistrict}
            setAddressOldDistrict={setAddressOldDistrict}
            addressOldAdminPost={addressOldAdminPost}
            setAddressOldAdminPost={setAddressOldAdminPost}
            addressOldVillage={addressOldVillage} 
            setAddressOldVillage={setAddressOldVillage}


            // contact
            setPrimaryPhone={setPrimaryPhone}
            setSecondaryPhone={setSecondaryPhone}
            primaryPhone={primaryPhone}
            secondaryPhone={secondaryPhone}
            oldPrimaryPhone={oldPrimaryPhone}
            oldSecondaryPhone={oldSecondaryPhone}
            setOldPrimaryPhone={setOldPrimaryPhone}
            setOldSecondaryPhone={setOldSecondaryPhone}

            // idDocument
            setDocNumber={setDocNumber}
            docNumber={docNumber}
            docType={docType}
            setDocType={setDocType}
            nuit={nuit}
            setNuit={setNuit}

            setOldDocNumber={setOldDocNumber}
            oldDocNumber={oldDocNumber}
            oldDocType={oldDocType}
            setOldDocType={setOldDocType}
            oldNuit={oldNuit}
            setOldNuit={setOldNuit}

        />
        )
    }


    {isConfirmDataVisible &&
            <ConfirmData
                // setIsOverlayVisible={setIsOverlayVisible}
                // isConfirmDataVisible={isConfirmDataVisible}
                setIsConfirmDataVisible={setIsConfirmDataVisible}
                ownerName={farmer?.names?.otherNames + ' ' + farmer?.names?.surname}
                newDataObject={newDataObject}
                oldDataObject={oldDataObject}
                dataToBeUpdated={dataToBeUpdated}
                resource={farmer}
                resourceName={'Farmer'}
            />
    }


    {/* <BottomSheet ref={bottomSheetRef} /> */}
    </CollapseBody>
    </Collapse>  
        </>
    )
}

export default PersonalData;