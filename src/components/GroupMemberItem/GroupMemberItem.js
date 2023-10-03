import React, { useState, useEffect, useRef,  } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity, } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faRemove } from '@fortawesome/free-solid-svg-icons';
import COLORS from '../../consts/colors';
import { Icon } from '@rneui/base';
import { calculateAge } from '../../helpers/dates';


export default function GroupMemberItem({ member }){

 const [onPressMember, setOnPressMember] = useState(false);
 const togglePressedMember = ()=>{
  setOnPressMember(!onPressMember);
 }

 return (
  <Animated.View 
    style={{ 
      width: '40%',  
      margin: 10,
      alignSelf: 'center', 
    }}
  >
  <TouchableOpacity
    onLongPress={()=>{

    }}
    onPress={togglePressedMember}
  >
{            
  member?.image ?

   <Image 
     source={{ uri: member?.image }}
     style={{
       width: 62,
       height: 62,
       marginBottom: 7,
       borderColor: COLORS.main,
       alignSelf: 'center',
       borderRadius: 120,
     }}
    />            
   :  
  <Icon 
    style={{
     alignSelf: 'center',
    }}
    name="account-circle" 
    size={72} 
    color={COLORS.lightgrey} 
  />
        
 }

    <Text 
      style={{
        fontSize: 13,
        fontFamily: 'JosefinSans-Regular',
        color: COLORS.grey,
        textAlign: 'center',               
      }}
      lineBreakMode='tail'
      numberOfLines={2}
    >
     {member.names.surname}, {member.names.otherNames}
    </Text>
   <Text
    style={{
        fontSize: 10,
        fontFamily: 'JosefinSans-Regular',
        color: COLORS.grey,
        textAlign: 'center',               
      }}
      lineBreakMode='tail'
      numberOfLines={2}
    >
     ({member?.gender === 'Masculino' ? 'H' : 'M'}, {calculateAge(member?.birthDate)})
    </Text>

  </TouchableOpacity>

{ onPressMember &&       
  <View
   style={{
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginVertical: 10,
   }}
  >
   <FontAwesomeIcon icon={faRemove} size={15} color={COLORS.danger} />
   {/* <FontAwesomeIcon icon={faCheck} size={15} color={COLORS.danger} /> */}
  </View>
}

</Animated.View>
 )
}