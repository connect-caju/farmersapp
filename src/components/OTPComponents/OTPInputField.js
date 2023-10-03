
import React from 'react';

import styled from 'styled-components/native';
import COLORS from '../../consts/colors';


export const OTPInputSection = styled.View`
 justify-content: center;
 align-items: center;
 margin-vertical: 30px;
`;


export const HiddenTextInput = styled.TextInput`
 border-color: ${COLORS.fourth};
 border-width: 2px;
 border-radius: 5px;
 padding: 12px;
 margin-top: 15px;
 width: 300px;
 color: ${COLORS.white};
`;

const OTPInputField = () =>{

 return (
  <OTPInputSection>
   <OTPInputField />
  </OTPInputSection>
 )
};

export default OTPInputField;