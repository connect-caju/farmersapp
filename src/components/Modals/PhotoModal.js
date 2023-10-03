import { useNavigation } from "@react-navigation/native";
import { Center, Alert, Stack, Box, } from "native-base";
import React, { useState, useCallback, useEffect, useRef, } from "react";
import { Overlay } from "@rneui/base";

import { Icon, CheckBox } from '@rneui/themed';
import { Button, Text, View, Modal, Pressable, TouchableOpacity, SafeAreaView, Image, Linking, StyleSheet } from "react-native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { Camera, useCameraDevices } from 'react-native-vision-camera';


import COLORS from "../../consts/colors";

import { useUser } from "@realm/react";
import { roles } from "../../consts/roles";
import CustomActivityIndicator from "../ActivityIndicator/CustomActivityIndicator";

function PhotoModal({ 
    realm, 
    photoOwner, 
    photoOwnerType, 
    isPhotoModalVisible, 
    setIsPhotoModalVisible,
    updateUserImage,
    userRole,
    setLoadingActivityIndicator,
    loadingActivitiyIndicator,
    launchNativeImageLibrary,
    }) {

    const navigation = useNavigation();
    const user = useUser();
    const customUserData = user?.customData;
    // console.log('userId: ', user.id);

    // const camera = useRef(null);
    // const [imageSource, setImageSource] = useState('');
    // const [showCamera, setShowCamera] = useState(false);




    const launchNativeCamera = () => {
        let options = {
          includeBase64: true,
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        launchCamera(options, (response) => {
        //   console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
          } else {

            const source = { uri: response.uri };
            const imageString = 'data:image/jpeg;base64,' + response.assets[0].base64;

            if (photoOwnerType !== 'Usuário') {
                realm.write(()=>{
                    // photoOwner.image = 'data:image/jpeg;base64,' + response.assets[0].base64;
                    photoOwner.image = imageString;
                });
            }
            else {
                updateUserImage(customUserData.userId, imageString)
            }
            setIsPhotoModalVisible(false);

            if (photoOwnerType === 'Grupo') {
                navigation.navigate('Group', {
                    ownerId: photoOwner?._id,
                })
            } 
            else if (photoOwnerType === 'Indivíduo') {
                navigation.navigate('Farmer', {
                    ownerId: photoOwner?._id,
                })
            } 
            else if (photoOwnerType === 'Instituição') {
                navigation.navigate('Institution', {
                    ownerId: photoOwner?._id,
                })
            }
            else if (photoOwnerType === 'Usuário') {
                // taking user photo
                // navigation.goBack();
            }
        
          }
        });
    };
  

    const deletePhoto = useCallback((photoOwner, realm)=>{
        realm.write(()=>{
          photoOwner.image = '';
        })
        
        if (photoOwnerType === 'Grupo') {
            navigation.navigate('Group', {
                ownerId: photoOwner?._id,
            })
        } 
        else if (photoOwnerType === 'Indivíduo') {
            navigation.navigate('Farmer', {
                ownerId: photoOwner?._id,
            })
        } 
        else if (photoOwnerType === 'Instituição') {
            navigation.navigate('Institution', {
                ownerId: photoOwner?._id,
            })
        }
        else if (photoOwnerType === 'Usuário') {
            // taking user photo
            // navigation.goBack();
        }
        
        setIsPhotoModalVisible(false);

    }, [ photoOwner ]);

    //   const launchNativeImageLibrary = () => {
    //     let options = {
    //       includeBase64: true,
    //       storageOptions: {
    //         skipBackup: true,
    //         path: 'images',
    //       },
    //     };
    //     launchImageLibrary(options, (response) => {
    
    //       if (response.didCancel) {
    //         console.log('User cancelled image picker');
    //       } else if (response.errorCode) {
    //         console.log('ImagePicker Error: ', response.error);
    //       } else {
    //         const source = { uri: response.assets.uri };

    //         // realm.write(()=>{
    //         //   photoOwner.image = 'data:image/jpeg;base64,' + response.assets[0].base64;
    //         // })
    //         const imageString = 'data:image/jpeg;base64,' + response.assets[0].base64;

    //         if (photoOwnerType !== 'Usuário') {
    //             realm.write(()=>{
    //                 // photoOwner.image = 'data:image/jpeg;base64,' + response.assets[0].base64;
    //                 photoOwner.image = imageString;
    //             });
    //         }
    //         else {
    //             updateUserImage(customUserData.userId, imageString)
    //         }

    //         setIsPhotoModalVisible(false);
    //         if (photoOwnerType === 'Grupo') {
    //             navigation.navigate('Group', {
    //                 ownerId: photoOwner?._id,
    //             })
    //         } 
    //         else if (photoOwnerType === 'Indivíduo') {
    //             navigation.navigate('Farmer', {
    //                 ownerId: photoOwner?._id,
    //             })
    //         } 
    //         else if (photoOwnerType === 'Instituição') {
    //             navigation.navigate('Institution', {
    //                 ownerId: photoOwner?._id,
    //             })
    //         }
    //         else if (photoOwnerType === 'Usuário') {
    //             // taking user photo
    //             // navigation.goBack();
    //         }
    //       }
    //     });
    
    //   } 

    return (
        <Overlay 
            animationType="slide"
            onBackdropPress={()=>setIsPhotoModalVisible(false)}
            isVisible={isPhotoModalVisible}
            style={{
                backgroundColor: COLORS.black,
                // opacity: .6,               
            }}
            // fullScreen={showCamera}
            // transparent
            >
            <View style={{ 
                flex: 1, 
                // marginTop: 40,
                alignItems: 'center' ,
                // marginHorizontal: 10,
                // width: '100%',
                // height: '100%',
                }}
            >
                <Box 
                    style={{
                        position: 'absolute',
                        top: -20,
                        left: 0,
                        zIndex: 1,
                    }}
                >
                    <TouchableOpacity
                    style={{ flexDirection: 'row' }}
                        onPress={()=>{
                            setIsPhotoModalVisible(false);
                            if (photoOwnerType === 'Grupo') {
                                navigation.navigate('Group', {
                                    ownerId: photoOwner?._id,
                                })
                            } 
                            else if (photoOwnerType === 'Indivíduo') {
                                navigation.navigate('Farmer', {
                                    ownerId: photoOwner?._id,
                                })
                            } 
                            else if (photoOwnerType === 'Instituição') {
                                navigation.navigate('Institution', {
                                    ownerId: photoOwner?._id,
                                })
                            }
                        }}                            
                    >
                        <Icon name='close' color={COLORS.ghostwhite} size={30}  />
                    </TouchableOpacity>
                </Box>
                {/* <Box
                    style={{
                    }}
                    >
                    <Text
                        style={{
                            marginTop: -20,
                            fontSize: 20,
                            fontFamily: 'JosefinSans-Bold',
                            color: COLORS.ghostwhite,
                        }}
                    >Foto {photoOwnerType === 'Indivíduo' ? 'do Produtor' : photoOwnerType === 'Grupo' ? 'Organização' : 'Instituição'}</Text>
                </Box> */}



        <Box
            style={{
                flex: 1,
                height: '50%',
                marginTop: 10,
            }}
        >
        {  
             photoOwner?.image ?
                <Image 
                    source={{ uri: photoOwner?.image }}
                    style={{
                        width: '100%',
                        height: 'auto',
                        aspectRatio: 9 / 16,
                    }}
                />
                :
                <Icon 
                style={{
                minWidth: 400,
                minHeight: 300,
                }}
                name="account-circle" 
                size={200} 
                color={COLORS.grey} 
            />            
        }
        </Box>

           <View >
            <Stack 
                direction="column" 
                space={4} 
                // py="6"
                mh="5"
                w="100%"
                style={{ 
                    // backgroundColor: COLORS.ghostwhite, 
                    // borderColor: COLORS.ghostwhite,
                    // borderRadius: 10,
                    position: 'absolute',
                    bottom: 5,
                    alignSelf: 'center',
                }}
            >
                {/* <Box alignItems={'flex-start'}>

                { photoOwnerType === 'Indivíduo'  ?
                    ( <Text
                        style={{ color: COLORS.grey, fontSize: 16, fontFamily: 'JosefinSans-Bold', }}
                    >
                        {photoOwner?.names?.otherNames} {photoOwner?.names?.surname}
                    </Text>
                )
                : photoOwnerType === 'Usuário' ?
                (
                    <Text
                    style={{ color: COLORS.grey, fontSize: 16, fontFamily: 'JosefinSans-Bold', }}
                    >
                        {photoOwner?.name}
                    </Text>
                )
                :
                (
                    <Text
                    style={{ color: COLORS.grey, fontSize: 16, fontFamily: 'JosefinSans-Bold', }}
                    >
                        {photoOwner?.manager?.fullname}
                    </Text>
                )
            }
            </Box> */}
            <Box 
                w="100%" 
                alignItems={'center'} 
            >
                <Stack direction="row" w="100%">
                    <Box w="33%">
                            <TouchableOpacity
                                onPress={()=>{
                                    // launchNativeCamera();
                                    setShowCamera(true);
                                }}
                                disabled={userRole === roles.coopManager || userRole === roles.provincialManager}
                                >
                                <Icon 
                                    name="photo-camera" 
                                    size={30}  
                                    color={(userRole === roles.coopManager || userRole === roles.provincialManager) ? COLORS.lightgrey : COLORS.grey }
                                />
                            </TouchableOpacity>
                            {/* <Text
                                style={{ 
                                    textAlign: 'center', 
                                    fontSize: 14, 
                                    fontFamily: 'JosefinSans-Regular', 
                                    color: COLORS.grey, 
                                }}
                            >
                                Câmera
                            </Text> */}
                    </Box>
                    <Box w="33%">
                        <TouchableOpacity
                            onPress={()=>{
                                launchNativeImageLibrary()
                            }}
                            disabled={userRole === roles.coopManager || userRole === roles.provincialManager}
                        >
                            <Icon 
                                name="photo-library" 
                                size={30} 
                                color={(userRole === roles.coopManager || userRole === roles.provincialManager) ? COLORS.lightgrey : COLORS.grey } 
                                />
                        </TouchableOpacity>
                            {/* <Text
                                style={{ 
                                    textAlign: 'center', 
                                    fontSize: 14, 
                                    fontFamily: 'JosefinSans-Regular', 
                                    color: COLORS.grey, 
                                }}
                                >
                                Galeria
                            </Text> */}
                        </Box>
                        <Box w="33%">
                        <TouchableOpacity
                            onPress={()=>{
                               deletePhoto(photoOwner, realm);
                            }}
                            disabled={!photoOwner?.image || (userRole === roles.coopManager || userRole === roles.provincialManager)}
                            >
                            <Icon 
                                name="delete" 
                                size={30} 
                                color={(!photoOwner?.image || (userRole === roles.coopManager || userRole === roles.provincialManager))  ? COLORS.lightgrey : COLORS.grey} 
                                />
                        </TouchableOpacity>
                            {/* <Text
                                style={{ 
                                    textAlign: 'center', 
                                    fontSize: 14, 
                                    fontFamily: 'JosefinSans-Regular', 
                                    color: COLORS.grey, 
                                }}
                            >
                                Apagar
                            </Text> */}
                        </Box>
                    </Stack>
                </Box>
            </Stack>
        </View>
    </View>
    </Overlay>
    );
}

export default PhotoModal;