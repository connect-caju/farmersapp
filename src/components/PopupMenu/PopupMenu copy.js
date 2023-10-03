import { Icon } from "@rneui/base"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Stack, Box, Center } from "native-base"
import CustomDivider from "../Divider/CustomDivider"
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faEllipsisVertical,
  faEye,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons"
import COLORS from "../../consts/colors"

const { SlideInMenu } = renderers

export function CustomizedMenuOption({ text, iconName, value }) {
  return (
    <MenuOption
      onSelect={() => alert(`You clicked ${value}`)}
      customStyles={{
        optionWrapper: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      }}
    >
      <FontAwesomeIcon icon={iconName} size={20} color={COLORS.grey} />
      <Text>{text}</Text>
    </MenuOption>
  )
}

export function PopupMenu({}) {
  const [isOpen, setIsOpen] = useState(false)
  const navigation = useNavigation()

  return (
    <MenuProvider backHandler={true} style={{}}>
      <Menu renderer={SlideInMenu}>
        <MenuTrigger
          // text="Click"
          customStyles={{
            triggerWrapper: {
              // top: -20,
            },
          }}
        >
          <Box>
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              size={20}
              color={COLORS.main}
              fade
            />
          </Box>
        </MenuTrigger>

        <MenuOptions
          customStyles={{
            optionsContainer: {
              // borderRadius: 8,
              // flexDirection: 'row'
            },
          }}
        >
          <CustomizedMenuOption
            text="Aderir a uma organização"
            iconName={faPeopleGroup}
          />
          <CustomDivider />
          <CustomizedMenuOption text="Ver organizações" iconName={faEye} />
        </MenuOptions>
      </Menu>
    </MenuProvider>
  )
}

{
  /* <MenuProvider>
  <Menu
  renderer={renderers.SlideInMenu}
    opened={true}
    onBackdropPress={() =>{}}
    onSelect={()=>{}}
  >
    <MenuTrigger
      
      customStyles={{
        triggerWrapper: {
          position: 'absolute', 
          top: -30, 
          left: -20,
          zIndex: 6,
        },
      }}
    >
    </MenuTrigger>
    <MenuOptions>
    <View 
      style={{
        flex: 1,
        backgroundColor: 'ghostwhite',
        height: "80%",
        width: '100%',
        paddingBottom: 30,
        zIndex: 4,
      }}
      >
      <Stack direction="row" w="100%">
        <Box w="80%">

          <Text
            style={{ 
              color: '#005000', 
              fontSize: 20, 
              fontFamily: 'JosefinSans-Bold',
              marginLeft: 35,
              paddingVertical: 15,
            }}
            >
            Registar..
          </Text>
        </Box>
        <Box w="20%" style={{
          marginTop: 20,
          paddingRight: 20,
        }}>

          <Icon 
            onPress={()=>setIsOpen(false)}
          name="close" size={35} color="grey" />
        </Box>
        </Stack>
      <MenuOption 
        customStyles={{
          optionWrapper: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            // width: 300,
            height: 45,
          },
        }}
        onSelect={
          () => navigation.navigate('IndividualFarmerForm', 
            { user: {
              name: 'evariste musekwa',
              district: 'Mogovolas',
              province: 'Nampula',
            }})
      }
      >
        <Box
          style={{
            paddingVertical: 5,
          }}
        >

        <Stack direction="row" space={4}  ml="7" >
        <Icon name="person" size={30} color="grey" />
        <Text 
          style={{
            color: 'grey', 
            fontSize: 18, 
            fontFamily: 'JosefinSans-Bold'
          }}
        >
          Produtor Singular
        </Text>
        </Stack>
      </Box>
      </MenuOption>
      <Center style={{
        width: "80%",
        marginLeft: 35,
        marginVertical: 2,
      }}>
        <CustomDivider thickness={1} my={2}  bg={"#005000"} />
      </Center>
      <MenuOption 
        customStyles={{
          optionWrapper: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 45,
          },
        }}
        onSelect={() => navigation.navigate('InstitutionalFarmerForm')} 
        >
      <Box
        style={{
          paddingVertical: 5,
        }}
       >
        <Stack direction="row" space={4}  ml="7">
          <Icon name="house-siding" size={30} color="grey" />
          <Text 
            style={{
              color: 'grey', 
              fontSize: 18, 
              fontFamily: 'JosefinSans-Bold'
            }}
            >
              Produtor Institucional
            </Text>
        </Stack>
      </Box>            
      </MenuOption>
      <Center style={{
        width: "80%",
        marginLeft: 35,
        marginVertical: 2,
      }}>
        <CustomDivider thickness={1} my={2}  bg={"#005000"} />
      </Center>
      <MenuOption 
        customStyles={{
          optionWrapper: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 45,
          },
        }}
        onSelect={() => navigation.navigate('GroupFarmerForm')} 
        >
        <Box
          style={{
            paddingVertical: 5,
          }}
        >

          <Stack direction="row" space={4}  ml="7">
            <Icon name="people" size={30} color="grey" />
            <Text 
              style={{
                color: 'grey', 
                fontSize: 18, 
                fontFamily: 'JosefinSans-Bold',
                
              }}
              >
              Grupo de Produtores
            </Text>
          </Stack>
        </Box>            
      </MenuOption>
      </View>
    </MenuOptions>
  </Menu>
</MenuProvider> */
}

export function PopMenuWrapper({ children }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#231547",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
})

//  export default PopupMenu;
