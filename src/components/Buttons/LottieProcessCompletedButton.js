
import { View, Text, Pressable, Animated } from 'react-native'
import React, { useRef, useState } from 'react'
import LottieView from 'lottie-react-native'

//  const

const LottieProcessCompletedButton = ({ styles }) => {

    const progress = useRef(new Animated.Value(0)).current;
    const [isAddButtonPressed, setIsAddButtonPressed] = useState(false);


    const handleAdd = ()=>{
        const newValue = isAddButtonPressed ? 0 : 1; 
        Animated.timing(progress, {
        toValue: newValue,
        duration: 1000,
        useNativeDriver: true,
        }).start();
        setTimeout(()=>{
            onPress()
        }, 800);
        setIsAddButtonPressed(!isAddButtonPressed);
    }

  return (
    <View  
      style={{ 
        width: 200, 
        height: 200, 
    }}
    >
      <LottieView
        source={require('../../../assets/lottie/processcompleted.json')}
        autoPlay
        loop
      />
    </View>
  )
}

// PropTypes.


export default LottieProcessCompletedButton