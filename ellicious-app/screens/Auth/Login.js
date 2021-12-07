import React, { useState }  from "react";
import styled from "styled-components";
import constants from "../../constants";
import { TouchableWithoutFeedback, Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import AuthButton from "../../components/AuthConfirmButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert, TextInput } from "react-native";
import { useMutation, useQuery } from "react-apollo-hooks";
import { TINT_COLOR, PointPink, BG_COLOR, Grey, LightGrey } from '../../components/Color'
import firebase from 'firebase';
import Hr from "hr-native";
import { useLogIn } from "../../AuthContext";
import {CONFIRM_SECRET} from "./AuthQueries";

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
font-Size : 20px;
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

const FindingIDPW =styled.View`
justifyContent: center;
alignItems: center;
padding-bottom : 10px;
flex-direction : row;
`;
const SocialLogin = styled.View``;

const ID = styled.View`
alignItems: flex-start;
margin-bottom : 10px;

`;
const PW = styled.View`
alignItems: flex-start;

`;

export default ({ navigation }) => {
  const phoneNum = useInput("");
  const password = useInput("");
  const logIn = useLogIn();
  

  const [loading, setLoading] = useState(false);

  const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
    variables: {
      cellPhone: phoneNum.value,
      // email: emailInput.value
      password: password.value
    }
  });



  const handleLogin = async () => {
    if (phoneNum.value === "" || phoneNum.value ===undefined) {
      Alert.alert("휴대폰 번호를 입력하세요");
      return;
    }
    if(password.value ==="" || password.value === undefined){
      Alert.alert("패스워드를 입력하세요")
      return;
    }
    try {
      setLoading(true);
      
      const {
        data: { confirmSecret }
      } = await confirmSecretMutation();


      if (confirmSecret !== "" || confirmSecret !== false) {
        logIn(confirmSecret);
      }
    } catch (e) {
      Alert.alert("계정 또는 비밀번호를 확인해주세요");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <Container>
        <TitleCon>
          <Title>로 그 인</Title>
        </TitleCon>
        
        
        <InfoCon>
            <ID>
            <Text>아이디(Cellphone)</Text>
            <TextInput
            keyboardType={"number-pad"}
            style={{height: 40, width : constants.width/1.25, backgroundColor: "#e6e6e6", borderRadius: 10, marginTop:2}}
            secureTextEntry={false}
            onChangeText={phoneNum.onChange}

            />          
            </ID>

            <PW>
            <Text>비밀번호</Text>
            <TextInput
            style={{height: 40, width : constants.width/1.25, backgroundColor: "#e6e6e6", borderRadius: 10, marginTop:2}}
            secureTextEntry={true}
            onChangeText={password.onChange}

            />
            </PW>
        </InfoCon>

       

        <FindingIDPW>
            <TouchableOpacity onPress={() => {navigation.navigate("FindPW") } }>
                <Text>비밀번호 찾기</Text>
            </TouchableOpacity>
        </FindingIDPW>

        <View>
          <AuthButton loading={loading} onPress={handleLogin} text="로 그 인" />
        </View>

      </Container>
    </TouchableWithoutFeedback>
  );
};

/* 
          

*/