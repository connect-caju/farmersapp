
import React, { useState, useEffect, useRef, useCallback, } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, 
 Pressable, Image, Dimensions, ScrollView, SafeAreaView, Easing, Animated as NativeAnimated } from 'react-native';
import COLORS from '../../consts/colors';
import Animated, { BounceIn, FlipInYLeft, FlipOutYLeft, FlipOutYRight, SlideInLeft } from 'react-native-reanimated';
import { Divider, Icon, Avatar, } from '@rneui/base';




import { useUser } from '@realm/react';
import { realmContext } from '../../models/realmContext';
import { SuccessLottie } from '../../components/LottieComponents/SuccessLottie';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
// import BottomSheet from '../../components/BottomSheet/BottomSheet';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBirthdayCake, faCircleUser, faEllipsisVertical, faHome, faIdCard, faInstitution, faLocation, faLocationPin, faMapLocation, faMapPin, faPeopleGroup, faPerson, faUser } from '@fortawesome/free-solid-svg-icons';
import { calculateAge } from '../../helpers/dates';
import { PopupMenu } from '../../components/PopupMenu/PopupMenu';
import CustomDivider from '../../components/Divider/CustomDivider';
import { bottomSheetFlags } from '../../consts/bottomSheetFlags';
import FarmerDetailsCard from '../../components/FarmerDetailsCard/FarmerDetailsCard';
import FarmlandDetailsCard from '../../components/FarmlandDetailsCard/FarmlandDetailsCard';
import { farmerTypes } from '../../consts/farmerTypes';
import GroupDetailsCard from '../../components/GroupDetailsCard/GroupDetailsCard';
import InstitutionDetailsCard from '../../components/InstitutionDetailsCard/InstitutionDetailsCard';
import { useMemo } from 'react';
const { useRealm, useQuery, useObject } = realmContext; 

const singleFarmer = 'singleFarmer';
const ownFarmlands = 'ownFarmlands';


const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const ProfileScreen = ({ route, navigation })=>{

 const { ownerId, farmerType, farmersIDs } = route.params;
 const realm = useRealm();
 const user = useUser();
 const customUserData = user?.customData;
 let farmer;
 let manager = '';
 if (farmerType === farmerTypes.farmer){
  farmer = realm.objectForPrimaryKey('Actor', ownerId);
 }
 else if (farmerType === farmerTypes.group){
  farmer = realm.objectForPrimaryKey('Group', ownerId);
  if (farmer?.manager) {
    manager = realm.objectForPrimaryKey('Actor', farmer?.manager);
  }

 }
 else if (farmerType === farmerTypes.institution){
  farmer = realm.objectForPrimaryKey('Institution', ownerId);
 }

 const farmlands = realm.objects("Farmland").filtered('farmerId == $0', ownerId);
 const [isAddPhoto, setIsAddPhoto] = useState(false);
 const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
 const [refresh, setRefresh] = useState(false);
 const [currentNode, setCurrentNode] = useState({next: null, prev: null, current: null });
 const [loadingActivitiyIndicator, setLoadingActivityIndicator] = useState(false);
 const [profileType, setProfileType] = useState('');
 const [bottomSheetFlag, setBottomSheetFlag] = useState('');
 const [flag, setFlag] = useState({
  flagType: '',
  resourceName: '',
 });

 // const [popupMenuVisible, setPopupMenuVisible] = useState(false);
 const ref = useRef(null); 
 const bottomSheetRef = useRef(null);
 const snapPoints = useMemo(()=>['25%', '40%', '60', '80%'], []);
 const handlePresentModalPress = useCallback(()=>{
  bottomSheetRef?.current?.present();
 }, []);
 const handleDismissModalPress = useCallback(()=>{
  bottomSheetRef?.current?.dismiss();
 }, [])
 const initialSnapPoints = useMemo(()=>['25%', 'CONTENT_HEIGHT'], []);
 const {
  animatedHandleHeight,
  animatedSnapPoints,
  animatedContentHeight,
  handleContentLayout,
 } = useBottomSheetDynamicSnapPoints(initialSnapPoints);


const onPressEllipsis = useCallback((flag)=>{
  
 const isActive = ref?.current?.isActive();
 if (isActive){
  ref?.current?.scrollTo(0);
  setBottomSheetFlag('');
 }
 else {
  ref?.current?.scrollTo(-300);
  setBottomSheetFlag(flag);
 }
}, []);


 useEffect(()=>{
  if (farmerType === farmerTypes.farmer){
   setProfileType('Produtor Singular');
   setFlag({
    flagType: bottomSheetFlags.farmerDetails,
    resourceName: 'Farmer'
   })
  }
  else if (farmerType === farmerTypes.group){
   setProfileType(farmer?.type);
   setFlag({
    flagType: bottomSheetFlags.groupDetails,
    resourceName: 'Group'
   })
  }
  else if (farmerType === farmerTypes.institution){
   setProfileType('Produtor Institucional');
   setFlag({
    flagType: bottomSheetFlags.institutionDetails,
    resourceName: 'Institution'
   })
  }
 }, [ farmerType ]);


 useEffect(()=>{

 }, [ bottomSheetFlag ]);



 return (
  <BottomSheetModalProvider>
   <Animated.ScrollView
      // entering={FlipInYLeft.duration(400)} 
      exiting={FlipOutYLeft}
     style={styles.container}
   > 

    <View
     style={[styles.profileContainer, { backgroundColor: farmer?.image ? COLORS.dark : COLORS.dark, }]}
    >
    <View
     style={{
       position: 'relative',
       top: 0,
       flexDirection: 'row',
       width: '100%',
       paddingTop: 10,
       zIndex: 10,
     }}
    >
     <View
      style={{
       width: '10%',
      }}
     >
      <TouchableOpacity
       onPress={()=>{
        navigation.navigate('FarmersList', {
         farmerType: farmerType,
        });
       }}
     >
       <Icon 
           name="arrow-back" 
           color={COLORS.ghostwhite}
           size={25}
       /> 
      </TouchableOpacity>
     </View>

     <View
      style={{
       width: '80%'
      }}
     >
     <Text style={styles.profileTypeText}>{profileType}</Text>
     </View>

     <View
         style={{
          width: '10%'
         }}
     >
     </View>
    </View>
     <View
      style={styles.photoContainer}
     >
       <TouchableOpacity
         onPress={()=>{
           navigation.navigate('Camera', {
               ownerType: farmerType,
               ownerId: farmer?._id,
               farmersIDs,
           });
         }}
       >
     {            
       farmer?.image ?
       ( 
       <View>
         <Image 
           source={{ uri: farmer?.image }}
           style={{
             width: 180,
             height: 180,
             borderColor: COLORS.main,
             margin: 18,
             borderRadius: 120,
           }}
         />
       </View>
       )  
             
       :  
       ( <View>
         <Icon 
           name="account-circle" 
           size={200} 
           color={COLORS.lightgrey} 
         />

         </View>
        )      
        }

       <Text 
          style={{  
            color: COLORS.ghostwhite,
            fontSize:  18,
            fontFamily: 'JosefinSans-Bold',
            textAlign: 'center',
          }}
        >
         {
          farmerType === farmerTypes.farmer ?
          `${farmer?.names?.otherNames} ${farmer?.names?.surname}` :
          `${farmer?.name}`        
         }

        </Text>
        {farmerType === farmerTypes.farmer && 
      <>
          { farmer?.assets?.map((asset, index)=>(
            <Text
              key={index}
              style={{  
                color: COLORS.ghostwhite,
                fontSize:  12,
                fontFamily: 'JosefinSans-Bold',
                textAlign: 'center',
                // position: 'relative',
                // top: -50,
              }}                
            >
            ({asset.category} {asset.subcategory})
          </Text>

        )) }

     </>
         }

        {farmerType === farmerTypes.institution && 
          <Text
            style={{  
              color: COLORS.ghostwhite,
              fontSize:  12,
              fontFamily: 'JosefinSans-Bold',
              textAlign: 'center',
              // position: 'relative',
              // top: -50,
            }}                
          >
          ({farmer?.private ? 'Privada': 'Pública'})
        </Text>

        }

       </TouchableOpacity>

     </View>
    
    </View>

  <Text
    style={{
      color: COLORS.black,
      fontSize: 16,
      fontFamily: 'JosefinSans-Bold',
      letterSpacing: 5,
      paddingLeft: 10,
      paddingTop: 10,
      alignSelf: 'flex-start',
    }}
  >
  {farmer?.identifier}
  </Text>


  {
      farmerType === farmerTypes.farmer ?
      <FarmerDetailsCard 
      farmer={farmer} 
      customUserData={customUserData}
      onPressEllipsis={onPressEllipsis} 
      handlePresentModalPress={handlePresentModalPress}
      />
      :
      farmerType === farmerTypes.group ?
      <GroupDetailsCard       
        farmer={farmer} 
        customUserData={customUserData}
        onPressEllipsis={onPressEllipsis}  
        groupManager={manager}
        handlePresentModalPress={handlePresentModalPress}
      />
      :
      <InstitutionDetailsCard 
        farmer={farmer} 
        customUserData={customUserData}
        onPressEllipsis={onPressEllipsis} 
        handlePresentModalPress={handlePresentModalPress}
      />
  }


{
  (farmerType === farmerTypes.farmer || farmerType === farmerTypes.institution ) ?
  <Text
    style={{
      color: COLORS.black,
      fontSize: 16,
      fontFamily: 'JosefinSans-Bold',
      // letterSpacing: 5,
      paddingLeft: 10,
      paddingVertical: 10,
      alignSelf: 'flex-start',
    }}
  >
  Pomares <Text style={{ fontSize: 12, color: COLORS.grey}}>({farmlands?.length})</Text>
  </Text>
  :
  <Text>
    Membros do grupo
  </Text>
}

{
  (farmerType === farmerTypes.farmer || farmerType === farmerTypes.institution ) &&
  <FarmlandDetailsCard       
    farmer={farmer} 
    customUserData={customUserData}
    onPressEllipsis={onPressEllipsis}  
    setRefresh={setRefresh}
    refresh={refresh}
  />
  }

   </Animated.ScrollView>
  <BottomSheetModal 
    ref={bottomSheetRef} 
    index={1}
    snapPoints={snapPoints}
    onChange={()=>{}}
    backgroundStyle={{
      backgroundColor: COLORS.ghostwhite
    }}
    // snapPoints={animatedSnapPoints}
    // handleHeight={animatedHandleHeight}
    // contentHeight={animatedContentHeight}
  >
    <View
    style={{
      padding: 8,
      // width: '100%',
      justifyContent: 'center',
    }}
  >
    {/* Single farmers */}
  { flag?.flagType === bottomSheetFlags.farmerDetails &&
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontFamily: 'JosefinSans-Bold',
          color: COLORS.black,
          marginBottom: 20,
          alignSelf: 'center',
        }}
      >
        Produtor Singular
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          paddingBottom: 16,
        }}
      >

        <View style={{ justifyContent: 'center', width: '33%',  paddingVertical: 20,  }}>
          <TouchableOpacity
            onPress={()=>{
              handleDismissModalPress();
            }}
          >
          <FontAwesomeIcon 
            style={{
              alignSelf: 'center',
            }} 
            icon={faHome} 
            size={35} 
            color={COLORS.main} 
          />
            <Text 
              style={{
                fontSize: 14,
                fontFamily: 'JosefinSans-Regular',
                color: COLORS.grey,
                textAlign: 'center',               
              }}
            >
              Actualizar
              Endereço
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: 'center', width: '33%',  paddingVertical: 20,  }}>
          <TouchableOpacity
            onPress={()=>{
              handleDismissModalPress();
            }}
          >
          <Icon name="phone-in-talk" size={35} color={COLORS.main} />
            <Text 
              style={{
                fontSize: 14,
                fontFamily: 'JosefinSans-Regular',
                color: COLORS.grey,
                textAlign: 'center',               
              }}
            >
              Actualizar
              Contacto
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: 'center', width: '33%',  paddingVertical: 20, }}>
          <TouchableOpacity
            onPress={()=>{
              handleDismissModalPress();
            }}
          >
          <FontAwesomeIcon 
            style={{
              alignSelf: 'center',
            }} 
            icon={faIdCard} 
            size={35} 
            color={COLORS.main} 
          />
            <Text 
              style={{
                fontSize: 14,
                fontFamily: 'JosefinSans-Regular',
                color: COLORS.grey,
                textAlign: 'center',               
              }}
            >
              Actualizar
              Documentação
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: 'center',  width: '33%',  paddingVertical: 20,
         }}>
          <TouchableOpacity
            onPress={()=>{
              handleDismissModalPress();
              navigation.navigate('Geolocation', {
                resourceName: flag?.resourceName,
                resourceId: farmer._id,
                farmersIDs,
              });
            }}
          >
            <Icon name="add-location-alt" size={35} color={COLORS.main} />
            <Text style={{
              fontSize: 14,
              fontFamily: 'JosefinSans-Regular',
              color: COLORS.grey,
              textAlign: 'center',
            }}>
              Actualizar
              Geolocalização
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  }


    {/* groups */}
    { flag?.flagType === bottomSheetFlags.groupDetails &&
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontFamily: 'JosefinSans-Bold',
          color: COLORS.black,
          marginBottom: 20,
          alignSelf: 'center',
        }}
      >
        Produtor Agrupado
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          paddingBottom: 16,
        }}
      >

      <View style={{ justifyContent: 'center', width: '33%',  paddingVertical: 20, }}>
          <TouchableOpacity
            onPress={()=>{
              handleDismissModalPress();
            }}
          >
          <FontAwesomeIcon 
            style={{
              alignSelf: 'center',
            }} 
            icon={faInstitution} 
            size={35} 
            color={COLORS.main} 
          />
            <Text 
              style={{
                fontSize: 14,
                fontFamily: 'JosefinSans-Regular',
                color: COLORS.grey,
                textAlign: 'center',               
              }}
            >
              Actualizar
              Tipo de Organização
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: 'center', width: '33%',  paddingVertical: 20,  }}>
          <TouchableOpacity
            onPress={()=>{
              handleDismissModalPress();
            }}
          >
          <FontAwesomeIcon 
            style={{
              alignSelf: 'center',
            }} 
            icon={faUser} 
            size={35} 
            color={COLORS.main} 
          />
            <Text 
              style={{
                fontSize: 14,
                fontFamily: 'JosefinSans-Regular',
                color: COLORS.grey,
                textAlign: 'center',               
              }}
            >
              Actualizar
              Representação
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: 'center', width: '33%',  paddingVertical: 20, }}>
          <TouchableOpacity
            onPress={()=>{
              handleDismissModalPress();
            }}
          >
          <FontAwesomeIcon 
            style={{
              alignSelf: 'center',
            }} 
            icon={faPeopleGroup} 
            size={35} 
            color={COLORS.main} 
          />
            <Text 
              style={{
                fontSize: 14,
                fontFamily: 'JosefinSans-Regular',
                color: COLORS.grey,
                textAlign: 'center',               
              }}
            >
              Actualizar
              Membros
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: 'center', width: '33%',  paddingVertical: 20, }}>
          <TouchableOpacity
            onPress={()=>{
              handleDismissModalPress();
            }}
          >
          <FontAwesomeIcon 
            style={{
              alignSelf: 'center',
            }} 
            icon={faIdCard} 
            size={35} 
            color={COLORS.main} 
          />
            <Text 
              style={{
                fontSize: 14,
                fontFamily: 'JosefinSans-Regular',
                color: COLORS.grey,
                textAlign: 'center',               
              }}
            >
              Actualizar
              Documentação
            </Text>
          </TouchableOpacity>
        </View>



        <View style={{ justifyContent: 'center',  width: '33%',  paddingVertical: 20,
         }}>
          <TouchableOpacity
            onPress={()=>{
              handleDismissModalPress();
              navigation.navigate('Geolocation', {
                resourceName: flag?.resourceName,
                resourceId: farmer._id,
                farmersIDs,
              });
            }}
          >
            <Icon name="add-location-alt" size={35} color={COLORS.main} />
            <Text style={{
              fontSize: 14,
              fontFamily: 'JosefinSans-Regular',
              color: COLORS.grey,
              textAlign: 'center',
            }}>Adicionar
              Geolocalização
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  }


    {/* Institutions */}
    { flag?.flagType === bottomSheetFlags.institutionDetails &&
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontFamily: 'JosefinSans-Bold',
          color: COLORS.black,
          marginBottom: 20,
          alignSelf: 'center',
        }}
      >
        Produtor Institucional
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          paddingBottom: 16,
        }}
      >


        <View style={{ justifyContent: 'center', width: '33%',  paddingVertical: 20,  }}>
          <TouchableOpacity
            onPress={()=>{
              handleDismissModalPress();
            }}
          >
          <FontAwesomeIcon 
              style={{
                alignSelf: 'center',
              }} 
              icon={faUser} 
              size={35} 
              color={COLORS.main} 
            />
            <Text 
              style={{
                fontSize: 14,
                fontFamily: 'JosefinSans-Regular',
                color: COLORS.grey,
                textAlign: 'center',               
              }}
            >
              Actualizar Representante
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: 'center', width: '33%',  paddingVertical: 20, }}>
          <TouchableOpacity
            onPress={()=>{
              handleDismissModalPress();
            }}
          >
          <FontAwesomeIcon 
            style={{
              alignSelf: 'center',
            }} 
            icon={faIdCard} 
            size={35} 
            color={COLORS.main} 
          />
            <Text 
              style={{
                fontSize: 14,
                fontFamily: 'JosefinSans-Regular',
                color: COLORS.grey,
                textAlign: 'center',               
              }}
            >
              Actualizar
              Documentação
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: 'center', width: '33%',  paddingVertical: 20,
         }}>
          <TouchableOpacity
            onPress={()=>{
              handleDismissModalPress();
              navigation.navigate('Geolocation', {
                resourceName: flag?.resourceName,
                resourceId: farmer._id,
                farmersIDs,
              });
            }}
          >
            <Icon name="add-location-alt" size={35} color={COLORS.main} />
            <Text style={{
              fontSize: 14,
              fontFamily: 'JosefinSans-Regular',
              color: COLORS.grey,
              textAlign: 'center',
            }}>
              Actualizar
              Geolocalização
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  }


  </View>
  </BottomSheetModal>

    {/* <BottomSheet 
      ref={ref} 
      bottomSheetFlag={bottomSheetFlag} 
      setBottomSheetFlag={setBottomSheetFlag}
      farmer={farmer}
      resourceName="Farmer"
      farmersIDs={farmersIDs}
    >

    </BottomSheet> */}
  </BottomSheetModalProvider>
 )
};

const styles = StyleSheet.create({
 container: {
  flex: 1,
  // backgroundColor: COLORS.red,
  // height: '100%',
 },
 profileTypeText: {
  color: COLORS.ghostwhite,
  fontSize: 18,
  fontFamily: 'JosefinSans-Bold',
  textAlign: 'center',
  },
  profileContainer: {
   width: '100%',
   height: SCREEN_HEIGHT / 2,
   borderRadius: 7,
   // position: 'absolute',
   // top: 0,
   alignSelf: 'center',
   elevation: 20,
   // opacity: 1,
  },
  detailsContainer: {
   height: SCREEN_HEIGHT / 2,
  },
  photoContainer: {
   justifyContent: 'center',
   alignItems: 'center',
   height: '100%',
  },
  detailsStyle: {
   // minHeight: 150,
   width: '100%',
   borderRadius: 15,
   flexDirection: 'row',
   justifyContent: 'space-around',
   // alignItems: 'center',
   padding: 8,
   borderColor: COLORS.dark,
   backgroundColor: COLORS.ghostwhite,
   marginVertical: 20,
   elevation: 3,
   opacity: 1,
  },
  bottomStyle: {
   // minHeight: 150,
   width: '100%',
   // borderRadius: 15,
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   paddingVertical: 20,
   paddingHorizontal: 20,
   borderColor: COLORS.dark,
   backgroundColor: COLORS.ghostwhite,
   // marginVertical: 20,
   elevation: 3,
   opacity: 1,   
  }
});

export default ProfileScreen;