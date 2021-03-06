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
const Bold = styled.Text`
font-weight : 900;
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
  const [loading, setLoading] = useState(false);
  const passwordInput = useInput("");
  const passwordConfirmInput = useInput("");
  const fName = navigation.getParam("fName");
  const lName = navigation.getParam("lName");
  const phoneNum = navigation.getParam('phoneNum');
  const username = navigation.getParam('username')
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
    variables: {
      password: passwordInput.value,
      username: username,
      firstName: fName,
      lastName: lName,
      cellPhone: phoneNum
    }
  });
  
  const checkpw=()=>{
    if (passwordInput.value === "" || passwordInput.value===undefined) {
        Alert.alert("??????????????? ???????????????");
    } else if(passwordInput.value.length < 8) {
      Alert.alert("??????????????? 8????????? ???????????????");
    }else if(passwordConfirmInput.value !== passwordInput.value){
      Alert.alert("??????????????? ????????????.");
    }
    else{
      navigation.navigate("SignUpFin",{fName,lName,phoneNum,username, pw:passwordInput.value})
    }
  }
  
  const handleSubmit=async()=>{
    if (passwordInput.value === "" || passwordInput.value===undefined) {
      Alert.alert("??????????????? ???????????????");
      } else if(passwordInput.value.length < 8) {
        Alert.alert("??????????????? 8????????? ???????????????");
      }else if(passwordConfirmInput.value !== passwordInput.value){
        Alert.alert("??????????????? ????????????.");
      }
      else{
          try {
            setLoading(true);
            const {
              data: { createAccount }
            } = await createAccountMutation();
            if (createAccount) {
              firebase.database().ref("users/"+createAccount.id).set({ID: createAccount.username});
            }else{
              Alert.alert("??????????????????!")
            }
          } catch (e) {
            Alert.alert("??????????????????");
          } finally {
            setLoading(false);
            navigation.navigate("SignUpFin")
          }
      }
  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <Container>
        <TitleCon>
          <Title>????????????</Title>
        </TitleCon>
        <SubTitleCon>
          <SubTitle>?????? ???????????????.</SubTitle>
          <Text><Bold>????????????</Bold>??? ??????????????????.</Text>
          <Text>?????? ????????????, ????????????, ?????? ????????????</Text>
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
              <Text>??????</Text>
              </TouchableOpacity>
            )}
            
          </View> */}
          
          <AuthInput
            {...passwordInput}
            placeholder="Password"
            keyboardType="email-address"
            returnKeyType="send"
            autoCorrect={false}
            label = "Password (8?????????)"
            secureTextEntry = {true}
          />
          <AuthInput
            {...passwordConfirmInput}
            placeholder="Password"
            keyboardType="email-address"
            returnKeyType="send"
            autoCorrect={false}
            label = "???????????? ??????"
            secureTextEntry = {true}
          />

        </InfoCon>
        <View>
          <AuthButton loading={loading} onPress={handleSubmit} text="??? ???" />
        </View>

      </Container>
    </TouchableWithoutFeedback>
  );
};

/* 
          

*/