/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, {useEffect, useState} from 'react';
import { Text,  Stack, Box, Center } from 'native-base';
import { Button, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
// import Modal from "react-native-modal";

// import styles from './styles';
import { Pressable, View, Modal, StyleSheet } from 'react-native';
import LottieAddButton from '../Buttons/LottieAddButton';
import LottieProcessCompletedButton from '../Buttons/LottieProcessCompletedButton';
import COLORS from '../../consts/colors';

export default function SuccessModal({
    addDataModalVisible,
    setAddDataModalVisible,
    setFarmerType,
}) {

    const navigation = useNavigation();

    useEffect(()=>{
        if (addDataModalVisible) {
            setTimeout(()=>{
                setAddDataModalVisible(false);
                setFarmerType('')
            }, 5000)
        }

    }, [addDataModalVisible])

  return (
     <View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={addDataModalVisible}
        onRequestClose={() => {
          setAddDataModalVisible(false);
          setFarmerType('');
        }}
        statusBarTranslucent={false}
      >
        <View 
            style={{ 
                flex: 1, 
                paddingVertical: 50,
                alignItems: 'center'
            }}
            >
            {/* <LottieProcessCompletedButton /> */}
            <Icon name="check-circle" size={100} color={COLORS.main} />
            <View 
                style={{ 
                    flex: 1,
                    justifyContent: 'center',
                    marginVertical: 20, 
                    paddingVertical: 20,
                }}
            >
                <Text
                style={{
                    paddingVertical: 10,
                    fontSize: 18,
                    fontFamily: 'JosefinSans-Regular',
                    color: COLORS.main,
                }}
                >
                    O registo ocorrido com sucesso!
                </Text>
            </View>
        </View>

      </Modal>
    </View>
  );
}
