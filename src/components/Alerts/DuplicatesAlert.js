import React, { useState, useEffect,  } from "react";
import { FlatList, Pressable, ScrollView, View, Text, SafeAreaView, TouchableOpacity} from "react-native";
import { Icon, CheckBox, Overlay } from '@rneui/themed';

import DuplicatesAlertItem from "./DuplicatesAlertItem";
import COLORS from "../../consts/colors";



const DuplicatesAlert = ({ 
  suspectedDuplicates, 
  setModalVisible,
  isDuplicateModalVisible,
  setIsDuplicateModalVisible,

   })=> {



  return (

    <Overlay
      isVisible={isDuplicateModalVisible}
      onBackdropPress={()=>{
        setIsDuplicateModalVisible(false);
      }}
      overlayStyle={{
        backgroundColor: COLORS.dark,
        
      }}
      fullScreen
    >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            paddingTop: 10,
            color: COLORS.ghostwhite,
            fontFamily: 'JosefinSans-Bold',
          }}
        >
          {suspectedDuplicates?.length > 1 ? "Registos Similares" : "Registo Similar"}
        </Text>

          <View
            style={{ 
              flex: 1, 
              alignItems: 'center',
              paddingTop: 20,
            }}
          >
            <DuplicatesAlertItem 
              suspectedDuplicates={suspectedDuplicates}
            />
          </View>

        <TouchableOpacity 
            style={{ 
              flexDirection: 'row',
              position: 'absolute',
              bottom: 20,
              left: 10,
            }}
            onPress={() => {
              setIsDuplicateModalVisible(false)
            }} 
          >
            <Icon name="arrow-back" size={25} color={COLORS.ghostwhite} />
          <Text
              style={{
                  color: COLORS.ghostwhite,
                  fontSize: 16,
                  fontFamily: 'JosefinSans-Bold',
                  textDecoration: 'underline',
                  textAlign: 'center',
                  paddingHorizontal: 5,
                }}
            >
              Voltar
            </Text>
            </TouchableOpacity>

          <TouchableOpacity 
            style={{ 
              flexDirection: 'row',
              position: 'absolute',
              bottom: 20,
              right: 10,
            }}
              onPress={() => {
                setIsDuplicateModalVisible(false);
                setModalVisible(true);
              }} 
            >
            <Text
                style={{
                    color: COLORS.ghostwhite,
                    fontSize: 16,
                    fontFamily: 'JosefinSans-Bold',
                    textDecoration: 'underline',
                    paddingHorizontal: 5,
                }}
                >
                  Continuar
            </Text>
            <Icon name="arrow-forward" size={25} color={COLORS.ghostwhite} />
          </TouchableOpacity>
          </Overlay>
)
}


export default DuplicatesAlert;