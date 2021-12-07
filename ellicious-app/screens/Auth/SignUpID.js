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
  
  const usernameInput = useInput("");
  const fName = navigation.getParam("fName");
  const lName = navigation.getParam("lName");
  const phoneNum = navigation.getParam('phoneNum');
  const [checkUsername, setCheckUsername] = useState(false);

  const { data: isUsername } = useQuery(CHECK_USERNAME, {
    variables: {
      term: usernameInput.value
    },
    skip: checkUsername
  });

  const handleSubmit = async() => {
    setCheckUsername(true);
    try {
      if(usernameInput.value ==='' || usernameInput.value===undefined ){
        Alert.alert('닉네임을 입력해주세요')
      }else{
        if(!isUsername.checkUsername) {
          navigation.navigate("SignUpCheckInfo", {fName,lName,phoneNum,username:usernameInput.value})
        } else {
          Alert.alert("이미 존재하는 username입니다.", "다른 username을 입력해주세요")
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setCheckUsername(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <Container>
        <TitleCon>
          <Title>회원가입</Title>
        </TitleCon>
        <SubTitleCon>
          <SubTitle>사용할 닉네임을 입력해 주세요.</SubTitle>
          <Text>프로필에서 언제든지 변경이 가능합니다.</Text>
        </SubTitleCon>
        
        <InfoCon>
          
          
          <AuthInput
            {...usernameInput}
            autoCapitalize="words"
            label = "UserName (ex GD_HONG)"
          />
            
        </InfoCon>
        <View>
          <AuthButton onPress={handleSubmit} text="확 인" />
        </View>

      </Container>
    </TouchableWithoutFeedback>
  );
};