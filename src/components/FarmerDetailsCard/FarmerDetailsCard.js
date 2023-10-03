import { faBirthdayCake, faEllipsisVertical, faHome, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Icon } from '@rneui/base';
import React from 'react';
import { View, Text, TouchableOpacity, } from 'react-native';
import Animated from 'react-native-reanimated';
import CustomDivider from '../Divider/CustomDivider';
import COLORS from '../../consts/colors';
import { bottomSheetFlags } from '../../consts/bottomSheetFlags';
import { calculateAge } from '../../helpers/dates';



export default function FarmerDetailsCard({ 
  handlePresentModalPress,
  farmer, customUserData, onPressEllipsis, }){

 return (
  <Animated.View 
  // entering={BounceIn.duration(1000)}
  style={{
    width: '100%',
    borderRadius: 15,
    padding: 8,
    borderColor: COLORS.dark,
    backgroundColor: COLORS.ghostwhite,
    marginVertical: 10,
    elevation: 3,
    opacity: 1,
  }}
 >

  {/* ellipsis option */}
  <TouchableOpacity
   style={{
    width: '10%',
    // justifiyContent: 'center',
    alignSelf: 'flex-end',
   }}
  //  onPress={()=>onPressEllipsis(bottomSheetFlags.farmerDetails)}
  onPress={handlePresentModalPress}
  >

   <FontAwesomeIcon icon={faEllipsisVertical} size={30} color={COLORS.main} />
  </TouchableOpacity>




  <View
   style={{
    padding: 8,
    width: '100%',
   }}
   >
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
      }}
    >
      <View
        style={{
          width: '50%',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
              style={{
                width: '30%',
                alignItems: 'center',
                justifyContent: 'center',

              }}
          >
          <FontAwesomeIcon 
              style={{
                // alignSelf: 'center',
              }} 
              icon={faHome} 
              size={20} 
              color={COLORS.grey} 
            />
          </View>

        <View
            style={{
              width: '70%',
            }}
        >
          <Text
            style={{
              color: 'grey',
              fontSize: 13,
              fontFamily: 'JosefinSans-Regular',
          }}    
          >
             {farmer?.address?.district ? farmer?.address?.adminPost : 'Não Aplicável'}
          </Text>
          <Text
            style={{
              color: 'grey',
              fontSize: 13,
              fontFamily: 'JosefinSans-Regular',
          }}    
          >
            {farmer?.address?.adminPost ? farmer?.address?.village : 'Não Aplicável' }
          </Text>
        </View>
        
        </View>
      </View>

      <View
        style={{
          width: '50%'
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '30%',
            }}
          >
             <Icon name="phone-in-talk" size={25} color={COLORS.grey} />
          </View>

        <View
            style={{
              width: '70%',
            }}
        >
   { (farmer?.contact?.primaryPhone !== 0 && farmer?.contact?.secondaryPhone !== 0) &&
            <>
                <Text 
                    style={{
                        color: 'grey',
                        fontSize: 13,
                        fontFamily: 'JosefinSans-Regular',
                    }}  
                >
                    {farmer?.contact?.primaryPhone} 
                </Text>  
                <Text 
                    style={{
                        color: 'grey',
                        fontSize: 13,
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
                   fontSize: 13,
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
                    fontSize: 13,
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
                fontSize: 13,
                fontFamily: 'JosefinSans-Regular',
            }}  
            >
                Nenhum 
            </Text> 
        }
        </View>      
        
        </View>
      </View>

    </View>
  </View>

   <CustomDivider thickness={2} color={COLORS.lightgrey} />

   <View
   style={{
    padding: 8,
    width: '100%',
   }}
   >
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
      }}
    >
      <View
        style={{
          width: '50%',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
              style={{
                width: '30%',
                alignItems: 'center',
                justifyContent: 'center',

              }}
          >
          <FontAwesomeIcon 
              style={{
                // alignSelf: 'center',
              }} 
              icon={faIdCard} 
              size={20} 
              color={COLORS.grey} 
            />
          </View>

        <View
            style={{
              width: '70%',
            }}
        >
          <Text
            style={{
              color: 'grey',
              fontSize: 13,
              fontFamily: 'JosefinSans-Regular',
          }}    
          >
            BI: {farmer?.idDocument?.docNumber !== 'Nenhum' ? farmer?.idDocument?.docNumber : 'Nenhum'} {farmer?.idDocument?.docType !== 'Não tem' && `(${farmer?.idDocument?.docType})`}
          </Text>
          <Text
            style={{
              color: 'grey',
              fontSize: 13,
              fontFamily: 'JosefinSans-Regular',
          }}    
          >
            NUIT: {farmer?.idDocument?.nuit !== 0 ? farmer?.idDocument?.nuit : 'Nenhum' }
          </Text>
        </View>
        
        </View>
      </View>

      <View
        style={{
          width: '50%',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
              <View
              style={{
                width: '30%',
                alignItems: 'center',
                justifyContent: 'center',

              }}
          >
            <FontAwesomeIcon icon={faBirthdayCake} size={20} color={COLORS.grey} />
          </View>

      <View
        style={{
          width: '70%',
        }}
      >
      <Text                         
      style={{
          color: 'grey',
          fontSize: 13,
          fontFamily: 'JosefinSans-Regular',
      }} >
      {`${new Date(farmer?.birthDate).getDate()}/${new Date(farmer?.birthDate).getMonth()+1}/${new Date(farmer?.birthDate).getFullYear()}`} ({calculateAge(farmer?.birthDate)} anos)
      </Text> 
      <Text
        style={{
            color: 'grey',
            fontSize: 13,
            fontFamily: 'JosefinSans-Regular',
        }}                    
          >
            {farmer?.birthPlace?.district ? farmer?.birthPlace?.district : '(Não Aplicável)'}
        </Text> 

        </View>      
        
        </View>
      </View>

    </View>
  </View>

  <CustomDivider thickness={2} color={COLORS.lightgrey} />


  <View
   style={{
    padding: 8,
    width: '100%',
   }}
   >
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        // justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: '50%',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          >
          <View
              style={{
                width: '30%',
              }}
          >
            <Icon name="location-pin" size={25} color={COLORS.grey} />
          </View>

        <View
            style={{
              width: '70%',
            }}
        >
          <Text
            style={{
              color: 'grey',
              fontSize: 13,
              fontFamily: 'JosefinSans-Regular',
          }}    
          >
            Long: {farmer?.geolocation?.longitude ? farmer?.geolocation?.longitude : 'Nenhuma'}
          </Text>
          <Text
            style={{
              color: 'grey',
              fontSize: 13,
              fontFamily: 'JosefinSans-Regular',
          }}    
          >
            Lat: {farmer?.geolocation?.latitude ? farmer?.geolocation?.latitude : 'Nenhuma'}
          </Text>
        </View>
        
        </View>
      </View>
    </View>
  </View>

   <CustomDivider thickness={2} color={COLORS.lightgrey} />

<View
  style={{
    backgroundColor: COLORS. fourth,

  }}
>
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
}
</View>

 </Animated.View>
 )
}