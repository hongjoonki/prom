import React, { useState }  from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import AuthButton from "../../components/AuthConfirmButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation, useQuery } from "react-apollo-hooks";
import { CREATE_ACCOUNT, ID_CHECK, CHECK_USERNAME } from "./AuthQueries";
import { TINT_COLOR, PointPink, BG_COLOR, Grey } from '../../components/Color'
import firebase from 'firebase';

const Container = styled.View`
  flex: 1;
  background-color : ${BG_COLOR}
`;
const TitleCon = styled.View`
flex : 1;
justifyContent: center;
alignItems: center;
`;
const Title = styled.Text`
fontSize : 30px;
`;

const SubTitleCon = styled.View`
flex : 1
justifyContent: center;
alignItems: flex-start;
margin-left : 5px;
`;
const SubTitle = styled.Text`
margin-left : 10px;
font-Size : 28px;
color: ${TINT_COLOR};
font-weight : 800;
`;
const Text = styled.Text`
margin-left : 10px;
font-Size : 17px;
color: ${Grey};

`;

const View = styled.View`
  justify-content: flex-end;
  align-items: center;
  flex : 2;
 
`;

const InfoCon = styled.View`
  justify-content: center;
  align-items: center;
  flex : 3;

`;


export default ({ navigation }) => {
  const fName = navigation.getParam("fName");
  const lName = navigation.getParam("lName");
  const phoneNum = navigation.getParam('phoneNum');
  const username = navigation.getParam('username')
  const handleSubmit=()=>{
   
      navigation.navigate("SignUpPW", {fName,lName,phoneNum,username})
    
  }
  
  // const confirmID = async () => {
  //   if(idInput.value=="") {
  //     return Alert.alert("아이디를 입력하세요");
  //   } else {
  //     try {
  //       setCheck(true);
  //       if(userAccount) {
  //         if(!userAccount.checkAccount) {
  //           setConfirmAccount(true)
  //         } else {
  //           return Alert.alert("이미 존재하는 아이디입니다.");
  //         }
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setCheck(false)
  //     }
  //   }
  // }
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <Container>
        <TitleCon>
          <Title>회원가입</Title>
        </TitleCon>
        <SubTitleCon>
          <SubTitle>정보를 확인해 주세요.</SubTitle>
        </SubTitleCon>
        
        <InfoCon>
          {/* <View flexDirection="row">
            <AuthInput
              {...idInput}
              placeholder="ID"
              keyboardType="email-address"
              returnKeyType="send"
              autoCorrect={false}
              label = "ID"
            />
            {confirmAccount ? null : 
            (
              <TouchableOpacity onPress={() => confirmID()}>
              <Text>확인</Text>
              </TouchableOpacity>
            )}
            
          </View> */}
          
          <AuthInput
            value={fName}
            /*placeholder="First name"*/
            autoCapitalize="words"
            label = "First Name (ex 길동)"
            editable={false}
          />
          <AuthInput
            value={lName}
            autoCapitalize="words"
            label = "Last Name (ex 홍)"
            editable={false}
                      />

            <AuthInput
              value={phoneNum}
              returnKeyType="send"
              autoCorrect={false}
              keyboardType="number-pad"
              label = "CellPhone"
              editable={false}
                          />
            <AuthInput
            value={username}
            /*placeholder="First name"*/
            autoCapitalize="words"
            label = "UserName (ex GD_HONG)"
            editable={false}
              />

        </InfoCon>
        <View>
          <AuthButton onPress={handleSubmit} text="확 인" />
        </View>

      </Container>
    </TouchableWithoutFeedback>
  );
};

/* 
          

*/