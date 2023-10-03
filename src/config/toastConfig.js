/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { StatusBar, View, Text, } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { Icon, } from '@rneui/themed';
import COLORS from '../consts/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';

  // toastConfig customized the toast messages
  export const toastConfig = {

    networkConnection: ({ text1, props})=>(
      <View style={{ 
        minHeight: 60, 
        width: '100%', 
        backgroundColor:  COLORS.white,
        paddingHorizontal: 10,
       flexDirection: 'row',
       borderRadius: 10,
       justifyContent: 'space-between',
      }}>
  
          <View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'JosefinSans-Bold',
                color: COLORS.darkyGreen,
                paddingHorizontal: 5,
              }}
            >{text1}</Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'JosefinSans-Regular',
                color: COLORS.darkyGreen,
                paddingRight: 5,
              }}
            >{props.message}</Text>
          </View>
          <View
           style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 5,
           }}
          >
            <Icon 
            name="network-wifi" 
            color={COLORS.grey} 
            size={40} 
          />
          </View>
      </View>
    ),
  


  addedFarmerToGroup: ({ text1, props})=>(
    <View style={{ 
      minHeight: 60, 
      width: '100%', 
      backgroundColor:  COLORS.white,
      paddingHorizontal: 10,
     flexDirection: 'row',
     borderRadius: 10,
     justifyContent: 'space-between',
    }}>

        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'JosefinSans-Bold',
              color: COLORS.darkyGreen,
              paddingHorizontal: 5,
            }}
          >{text1}</Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'JosefinSans-Regular',
              color: COLORS.darkyGreen,
              paddingRight: 5,
            }}
          >{props.message}</Text>
        </View>
        <View
         style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 5,
         }}
        >
          <Icon 
          name="check-circle-outline" 
          color={COLORS.darkyGreen} 
          size={40} 
        />
        </View>
    </View>
  ),

  removedFarmerFromGroup: ({ text1, props})=>(
   <View style={{ 
     minHeight: 60, 
     width: '100%', 
     backgroundColor: COLORS.white,
     paddingHorizontal: 10,
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'space-between',
   }}>

       <View>
         <Text
           style={{
             fontSize: 16,
             fontFamily: 'JosefinSans-Bold',
             color: COLORS.darkyGreen,
             paddingRight: 5,
           }}
         >{text1}</Text>
         <Text
           style={{
             fontSize: 15,
             fontFamily: 'JosefinSans-Regular',
             color: COLORS.darkyGreen,
             paddingHorizontal: 5,
           }}
         >{props.message}</Text>
       </View>
       <View
        style={{
         justifyContent: 'center',
         alignItems: 'center',
         padding: 5,
        }}
       >
         <FontAwesomeIcon icon={faWarning} color={COLORS.darkyGreen} size={40} />
       </View>
   </View>
 ),

 addedGroupManager: ({ text1, props})=>(
  <View style={{ 
    minHeight: 60, 
    width: '100%', 
    backgroundColor:  COLORS.white,
    paddingHorizontal: 10,
   flexDirection: 'row',
   borderRadius: 10,
   justifyContent: 'space-between',

  }}>

      <View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'JosefinSans-Bold',
            color: COLORS.darkyGreen,
            paddingHorizontal: 5,
          }}
        >{text1}</Text>
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'JosefinSans-Regular',
            color: COLORS.darkyGreen,
            paddingRight: 5,
          }}
        >{props.message}</Text>
      </View>
      <View
       style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
       }}
      >
        <Icon 
        name="check-circle-outline" 
        color={COLORS.darkyGreen} 
        size={40} 
      />
      </View>
  </View>
),

userSignUp: ({ text1, props})=>(
  <View style={{ 
    minHeight: 60, 
    width: '100%', 
    backgroundColor:  COLORS.white,
    paddingHorizontal: 10,
   flexDirection: 'row',
   borderRadius: 10,
   justifyContent: 'space-between',

  }}>

      <View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'JosefinSans-Bold',
            color: COLORS.darkyGreen,
            paddingHorizontal: 5,
          }}
        >{text1}</Text>
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'JosefinSans-Regular',
            color: COLORS.darkyGreen,
            paddingRight: 5,
          }}
        >{props.message}</Text>
      </View>
      <View
       style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
       }}
      >
        <Icon 
        name="check-circle-outline" 
        color={COLORS.darkyGreen} 
        size={40} 
      />
      </View>
  </View>
)


}
