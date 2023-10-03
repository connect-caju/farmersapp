
// import React, { useState } from 'react';
// import { View, Image, StyleSheet } from 'react-native';
// import { PinchGestureHandler, State } from 'react-native-gesture-handler';
// import ImageZoom from 'react-native-image-zoom';
// import { useNavigation } from '@react-navigation/native';

// export function ZoomableImage({ imageSource  }){

//  const [scale, setScale] = useState({ 
//   scale: 1,
//   lastScale: 1,
//  });


//  onPinchGestureEvent = (e)=>{
//   if(e.nativeEvent.scale !== scale.lastScale){
//    setScale(prev=>({
//     ...prev,
//     scale: e.nativeEvent.scale,
//     lastScale: e.nativeEvent.scale,
//    }));
//   }
//  };

//  onPinchHandlerStateChange = (e)=>{
//   if(e.nativeEvent.oldState === State.ACTIVE){
//    setScale(prev=>({
//     ...prev,
//     lastScale: 1,
//    }));
//   }
//  };



//  return (
//   <View style={{
//    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//    width: '100%',
//    height: '100%',
//   }}>
//    <PinchGestureHandler
//     onGestureEvent={onPinchGestureEvent}
//     onHandlerStateChange={onPinchHandlerStateChange}
//    >
//     <ImageZoom 
//      cropWidth={'100%'}
//      imageWidth={'100%'}
//      imageHeight={'100%'}
//      style={{
//       width: '100%',
//       height: '100%',
//       transform: [{ scale: scale.scale }],
//      }}
//     >
//      <Image 
//       source={imageSource}
//       resizeMode='contain'
//       style={{
//        width: '100%',
//        height: '100%',
//       }}
//      />
//     </ImageZoom>
//     </PinchGestureHandler> 
//   </View>
//  )
// }