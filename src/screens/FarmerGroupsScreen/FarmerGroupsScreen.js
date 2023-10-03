import React, { useState, useEffect } from 'react';
import { 
 View, Text, ScrollView, FlatList, StyleSheet, SafeAreaView, 
 TouchableOpacity, Image, Pressable,
 ImageBackground,
 } from 'react-native';
import { Box, Stack, Center } from 'native-base';
import { Icon, Card, } from '@rneui/base';
import AwesomeAlert from 'react-native-awesome-alerts';
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
import { useNavigation } from '@react-navigation/native';

import Animated, { Layout, LightSpeedInLeft, LightSpeedOutRight, } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';

import COLORS from '../../consts/colors';

import { realmContext } from '../../models/realmContext';
import { useUser } from '@realm/react';
import CustomDivider from '../../components/Divider/CustomDivider';
import { getInitials } from '../../helpers/getInitials';
// import { TextInput } from 'react-native-paper';
const { useRealm, useQuery } = realmContext; 



export function FarmerGroupItem({ item }) {

 const navigation = useNavigation();


 return (
   <Animated.View
    exiting={LightSpeedOutRight}
    style={{
      // borderWidth: 1,
     marginHorizontal: 10,
     marginVertical: 10,
    //  width: '90%',
     height: 300,
     shadowOffset: {
       width: 0,
       height: 3,
     },

   }}
   >
    <TouchableOpacity
      style={{
        // width: '100%',
      }}
     onPress={()=>{
      navigation.navigate('Group', { ownerId: item?._id });
     }}
    >
      <View
       style={{
        width: '100%',
        height: '70%',
        backgroundColor: COLORS.lightgrey,
       }}
      >
{ 
 item?.image &&
<ImageBackground
         source={{ uri: item?.image }}
         style={{
          width: '100%',
          height: '100%',
         }}
         resizeMode="cover"
        >

        </ImageBackground>
   }

   {
    !item?.image &&
    <View
    style={{
     padding: 10,
    }}
   >
    <View
     style={{
      justifyContent: 'center',
      alignItems: 'center',
      
     }}
    >
      <FontAwesomeIcon icon={faPeopleGroup} size={120} color={COLORS.grey} />
    </View>
    
    </View>
   }

<View
  style={{
    minHeight: '30%',
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.lightgrey,
    paddingHorizontal: 10,
  }}
>
      <Text
       style={{
        fontSize: 18,
        color: COLORS.black,
        fontFamily: 'JosefinSans-Bold',
       }}
       >
       {item?.name}{' '}
        <Text
        style={{
          fontSize: 14,
          color: COLORS.grey,
          fontFamily: 'JosefinSans-Regular',
          // textAlign: 'right',
        }}
        >
        ({item?.type})
        </Text>
      </Text>

    

      <Stack direction="row"
        style={{
          // paddingHorizontal: 10,
          paddingTop: 4,
        }}
      >
        <Box w="50%">
          <Text
            style={{
              fontSize: 12,
              color: COLORS.grey,
              fontFamily: 'JosefinSans-Regular',
            
            }}
          >Declarados: {item?.numberOfMembers?.total}</Text>
        </Box>
        <Box w="50%">
          <Text
            style={{
              fontSize: 12,
              color: COLORS.grey,
              fontFamily: 'JosefinSans-Regular',
              textAlign: 'right',
            }}
          >Registados: {item?.members?.length > 0 ? item?.members?.length : 0}</Text>
        </Box>
      </Stack>

</View>

 
      </View>

    </TouchableOpacity>
   
   </Animated.View>
 )
}




export default function FarmerGroupsScreen({ navigation, route }) {

 const { farmerId } = route.params;
 const realm = useRealm();

 let farmerMembership =  realm.objects('ActorMembership').filtered("actorId == $0", farmerId);
 const [groupsList, setGroupsList] = useState([]);
 const [actorName, setActorName] = useState('');

 let groups = [];
 let actor = realm.objectForPrimaryKey('Actor', farmerId);
  if(farmerMembership.length > 0){
    farmerMembership = farmerMembership[0];
    groups = farmerMembership?.membership.map((membership)=>{
    return realm.objectForPrimaryKey('Group', membership.organizationId);
   });

  }


 const handleGroupsList = ()=>{
  if (groups.length > 0){
    setGroupsList(groups?.map(group => group));
  }
 }
 
 useEffect(()=>{

  handleGroupsList();
  setActorName(`${actor?.names.otherNames} ${actor?.names.surname}`);

 }, [ realm ])
 

 const keyExtractor = (item, index)=>index.toString();



 return (
  <SafeAreaView 
  style={{ 
      minHeight: '100%', 
      width: '100%',
      backgroundColor: COLORS.ghostwhite,
      // margin: 20,

  }}
>

  <View
     style={{
       // minHeight: "15%",
       width: '100%',
       paddingHorizontal: 5,
       paddingVertical: 10,
       backgroundColor: '#EBEBE4',
       borderTopWidth: 0,
       borderColor: '#EBEBE4',
       borderBottomWidth: 3,
       borderLeftWidth: 3,
       borderRightWidth: 3,
       marginBottom: 30,

     }}
    >
        <Stack
          direction="row" w="100%"
        >
         <Center w="10%">
          <Pressable
            onPress={()=>{
              navigation.navigate('Farmer', {
               ownerId: farmerId
              });
            }}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Icon 
                    name="arrow-back-ios" 
                    color={COLORS.main}
                    size={wp('8%')}
                /> 
            </Pressable>
          </Center>

          <Box w="80%">
            <Center>
              <Text
                style={{ 
                  fontFamily: 'JosefinSans-Bold', 
                  fontSize: 14, 
                  color: COLORS.main, 
                }}
                numberOfLines={1}
                ellipsizeMode={'tail'}
              >
                {actorName}
              </Text>
              <Text
                    style={{ 
                      fontFamily: 'JosefinSans-Regular', 
                      fonSize: responsiveFontSize(1), 
                    }}
                  >
                   [{`Organizações de Produtores: ${farmerMembership?.membership?.length > 0 ? farmerMembership?.membership?.length : 0}`}]
                   </Text>

            </Center>
          </Box>
          <Box 
            w="10%"
            style={{ 
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >

          </Box>
        </Stack>
      </View>


{groupsList?.length > 0 ?
      <FlatList

       StickyHeaderComponent={()=>(
         <Box style={{

         }}>
         </Box>
       )}
      stickyHeaderHiddenOnScroll={true}
      data={groupsList}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={0.1}
      renderItem={({ item })=>{
        return <FarmerGroupItem  route={route} item={item} /> 
      }}
      ListFooterComponent={()=>{ 
       return (<Box
        style={{
         paddingBottom: 150,
        }}
       >
        <Text></Text>
       </Box>)
      }} 
    />
    :
    <View
      style={{
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{ 
          fontFamily: 'JosefinSans-Bold', 
          fontSize: 16, 
          color: COLORS.black, 
          textAlign: 'center',

        }}
      >
        {actorName}
      </Text>
      <Text
        style={{
          paddingHorizontal: 30,
          fontSize: 14,
          fontFamily: 'JosefinSans-Regular',
          color: COLORS.black,
          textAlign: 'center',
          lineHeight: 25,
        }}
      >Não pertence a nenhuma organização de produtores!</Text>
    </View>
  
  }

</SafeAreaView>
 )
}