import React, { useState }  from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import AuthButton from "../../components/AuthConfirmButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation, useQuery } from "react-apollo-hooks";
import { CREATE_ACCOUNT, ID_CHECK, CHECK_USERNAME, UPDATE_PASSWORD } from "./AuthQueries";
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
  const phoneNum = navigation.getParam('phoneNum');
  const [passwordUpdate] = useMutation(UPDATE_PASSWORD);
  
  const handleSubmit=async()=>{
    if (passwordInput.value === "" || passwordInput.value===undefined) {
      Alert.alert("비밀번호를 입력하세요");
      } else if(passwordInput.value.length < 8) {
        Alert.alert("비밀번호를 8자이상 입력하세요");
      }else if(passwordConfirmInput.value !== passwordInput.value){
        Alert.alert("비밀번호가 다릅니다.");
      }
      else{
          try {
            setLoading(true);

            const {data} = await 
            passwordUpdate({variables: {
                phoneNum: phoneNum,
                password: passwordInput.value
            }})

            if(data && data.updatePassword) {
                Alert.alert("재설정 성공");
            } else {
                Alert.alert("재설정 실패");
            }

          } catch (e) {
            Alert.alert("재설정 실패");
          } finally {
            setLoading(false);
            navigation.navigate("AuthHome")
          }
      }
  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <Container>
        <TitleCon>
          <Title>비밀번호 재설정</Title>
        </TitleCon>
        <SubTitleCon>
          <Text><Bold>비밀번호</Bold>를 입력해주세요.</Text>
          <Text>영어 대소문자, 특수문자, 숫자 사용가능</Text>
        </SubTitleCon>
        
        <InfoCon>
          <AuthInput
            {...passwordInput}
            placeholder="Password"
            keyboardType="email-address"
            returnKeyType="send"
            autoCorrect={false}
            label = "Password (8자이상)"
            secureTextEntry = {true}
          />
          <AuthInput
            {...passwordConfirmInput}
            placeholder="Password"
            keyboardType="email-address"
            returnKeyType="send"
            autoCorrect={false}
            label = "비밀번호 확인"
            secureTextEntry = {true}
          />

        </InfoCon>
        <View>
          <AuthButton loading={loading} onPress={handleSubmit} text="확 인" />
        </View>

      </Container>
    </TouchableWithoutFeedback>
  );
};
