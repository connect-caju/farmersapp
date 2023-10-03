import {TouchableOpacity, View, Text,} from 'react-native';
import React, { useState } from 'react';
import {Icon, Avatar } from '@rneui/themed';
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

import { Box, Center, Stack,  } from 'native-base';
import { getInitials } from '../../helpers/getInitials';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../consts/colors';
import { months } from '../../helpers/dates'
import { resourceValidation } from '../../consts/resourceValidation';
import { getPlantingYears } from '../../helpers/getPlantingYears';


export default function FarmlandItem ({ item, route, }) {

   const [visible, setVisible] = useState(false);
   const navigation = useNavigation();

  return (
    <View
      style={{
        padding: 10,
        marginVertical: 10,
        // minHeight: 100,
        width: '100%',
        flex: 1,
        borderColor: COLORS.main,
        shadowColor: COLORS.main,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 3,

      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: 1,
          right: 1,
          zIndex: 1,
        }}
      >
        <Icon 
          name={item?.status === resourceValidation.status.pending ? 'pending-actions' : item?.validated === resourceValidation.status.validated ? 'check-circle' : 'dangerous'}
          size={30}
          color={item?.status === resourceValidation.status.pending ? COLORS.danger : item?.validated === resourceValidation.status.validated ? COLORS.main : COLORS.red}
        />
      </Box>
       <TouchableOpacity
         onPress={()=>{
          if (item?.ownerType === 'Single'){
            navigation.navigate('Farmer', {
              ownerId: item?.farmerId,
            })
          }
          else if (item?.ownerType === 'Group'){
            navigation.navigate('Group', {
              ownerId: item?.farmerId,
            })
          }
          else if (item?.ownerType === 'Institution'){
            navigation.navigate('Institution', {
              ownerId: item?.farmerId,
            })
          }
         }}
         >
      <Stack direction="row" w="100%" space={3}>
       <Box w="50%">
       <Text 
         style={{
           fontSize: 15,
           fontFamily: 'JosefinSans-Bold',
           color: COLORS.main,
         }}
         >
          Anos de plantio:
         </Text>

       </Box>

      <Box w="50%" >
       <Text 
          style={{
            fontSize: 15,
            fontFamily: 'JosefinSans-Regular',
            color: COLORS.grey,
          }}
          >
           [ {getPlantingYears(item?.blocks)} ]
        </Text>  

      </Box>
    </Stack> 


    <Stack direction="row" w="100%" space={3}>
       <Box w="50%">
       <Text 
         style={{
           fontSize: 15,
           fontFamily: 'JosefinSans-Bold',
           color: COLORS.main,
         }}
         >
          Cajueiros:
         </Text>

       </Box>

      <Box w="50%" >
       <Text 
          style={{
            fontSize: 15,
            fontFamily: 'JosefinSans-Regular',
            color: COLORS.grey,
          }}
          >
           {item?.trees} árvores. 
        </Text>  

      </Box>
    </Stack> 



    </TouchableOpacity>


  </View>
  )
}

// export default FarmerItem