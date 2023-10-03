
import React from "react";

import { 
 KeyboardAvoidingView, ScrollView, 
 TouchableWithoutFeedback, Keyboard,
} from "react-native";
import COLORS from "../../consts/colors";

export default function KeyboardAvoidingWrapper({ children }) {

 return (
  <KeyboardAvoidingView
   style={{ 
    flex: 1, 
    backgroundColor: COLORS.ghostwhite, 
    alignItems: 'center',
    justifyContent: 'center',
   }}
  >
   <ScrollView>
    <TouchableWithoutFeedback
     onPress={Keyboard.dismiss}
    >
     {children}
    </TouchableWithoutFeedback>
   </ScrollView>
  </KeyboardAvoidingView>
 )
}