
import React, { useRef, forwardRef, } from 'react';
import { View, TextInput, Pressable, Text } from "react-native";
import TextInputHidden from "./TextInputHidden";
import COLORS from '../../consts/colors';


export default function OtpInput({ code, setCode, maximumLength, setIsPinReady, isInputBoxFocused }) {

 const inputRef = useRef();
 const boxArray = new Array(maximumLength).fill(0);
 

 const boxDigit = (_, index)=>{
  const emptyInput = "";
  const digit = code[index] || emptyInput;
  const isCurrentValue = index === code.length;
  const isLastValue = index === maximumLength - 1;
  const isCodeComplete = code.length === maximumLength;
  const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);

  

  return (
   <View
    key={index}
    style={{
     borderColor: (isInputBoxFocused && isValueFocused) ? "#ecdbba" : COLORS.fourth,
     backgroundColor: (isInputBoxFocused && isValueFocused) ? "grey" : "",
     borderWidth: 2,
     borderRadius: 5,
     padding: 12,
     minWidth: 50,
    }}
    
   >
      <Text
       style={{
        fontSize: 20,
        textAlign: 'center',
        color: COLORS.fourth,
       }}
      >
       {digit}
      </Text>
   </View>
  )
 }

 const handleOnBlur = () =>{};


 return (
  <View
   style={{
    justifyContent: 'center',
    alignItems: 'center',
   }}
  >
   <Pressable
    style={{
     width: '80%',
     flexDirection: 'row',
     justifyContent: 'space-evenly',
    }}
   >
    {boxArray.map(boxDigit)}
   </Pressable>

   <TextInput
    style={{
     width: 300,
     borderColor: "#e5e5e5",
     borderWidth: 1,
     borderRadius: 5,
     padding: 15,
    }}
     maxLength={maximumLength}
     code={code}
     setCode={setCode}
     setIsPinReady={setIsPinReady}
     // ref={inputRef}
     onBlur={handleOnBlur}
   />
  </View>
 )
}