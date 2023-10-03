

import { View, Text, Pressable, Animated } from 'react-native'
import React, { useRef, useState } from 'react'
import LottieView from 'lottie-react-native'

//  const

const TreeComponent = ({ styles }) => {


  return (
    <View  
      style={{ 
        width: 200, 
        height: 200, 
    }}
    >
      <LottieView
        source={require('../../../assets/lottie/tree.json')}
        autoPlay
        loop
      />
    </View>
  )
}

// PropTypes.


export default TreeComponent;