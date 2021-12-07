import React, { useState }  from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard, Alert,StyleSheet, TouchableOpacity } from "react-native";
import AuthButton from "../../components/AuthConfirmButton";
import PNButton from "../../components/PNConfirmButton";
import AuthInput from "../../components/AuthInput";
import AuthInputPN from "../../components/AuthInputPN";
import useInput from "../../hooks/useInput";
import { useMutation, useQuery } from "react-apollo-hooks";
import { CREATE_ACCOUNT, ID_CHECK, CHECK_USERNAME,CONFIRM_SECRET} from "./AuthQueries";
import { TINT_COLOR, PointPink, BG_COLOR, Grey } from '../../components/Color'
import firebase from 'firebase';
import { useLogIn } from "../../AuthContext";
import constants from "../../constants";

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
 
const Text = styled.Text`
margin-left : 10px;
font-Size : 20px;
color: ${Grey};
`;

const PW=styled.View`
align-items: center;
justify-content: flex-end;
`;

const ConfirmPN = styled.View`
flex-direction : row;
align-items: center;
justify-content: space-between;

`;

export default ({ navigation }) => {
  const cellphoneInput = useInput("");
  const confirmSecretInput = useInput("");
  const logIn = useLogIn();
  

  const [loading, setLoading] = useState(false);
  const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
    variables: {
      password: confirmSecretInput.value,
      // email: emailInput.value
      cellPhone: cellphoneInput.value
    }
  });
  
  const handleConfirm = async () => {
    // const { value: email } = emailInput;
    // const { value: password } = passwordInput;
    // const { value: id } = idInput;

    // const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if (email === "") {
    //   return Alert.alert("Email can't be empty");
    // } else if (!email.includes("@") || !email.includes(".")) {
    //   return Alert.alert("Please write an email");
    // } else if (!emailRegex.test(email)) {
    //   return Alert.alert("That email is invalid");
    // }
    
    try {
      setLoading(true);
      // const {
      //   data: { requestSecret }
      // } = await requestSecretMutation();

      const {
        data: { confirmSecret }
      } = await confirmSecretMutation();


      if (confirmSecret !== "" || confirmSecret !== false) {
        logIn(confirmSecret);
      } else {
        Alert.alert("계정 또는 비밀번호를 확인해주세요");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Can't log in now");
    } finally {
      setLoading(false);
    }
  };

 
  const handleSubmit=()=>{
    if (cellphoneInput.value === "" || cellphoneInput.value===undefined) {
      return Alert.alert("핸드폰번호를 입력하세요");
    }
    else if (confirmSecretInput.value === "" ||confirmSecretInput.value === undefined) {
      return Alert.alert("인증번호를 입력하세요");
    }else{
      // navigation.navigate("SignUpPhone",{fName: fNameInput.value, lName: lNameInput.value})
    }
  }
 
    

  


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <Container>
        <TitleCon>
          <Title>아이디 찾기</Title>
        </TitleCon>
        
        <InfoCon>

          <ConfirmPN>
            <AuthInputPN
              {...cellphoneInput}
              /*placeholder="First name"*/
              autoCapitalize="words"
              label = "전화번호"
              
            />
            <PNButton loading = {loading} onPress={handleConfirm} text="인증번호 받기" />           
          </ConfirmPN>

          <AuthInput
            {...confirmSecretInput}
            /*placeholder="First name"*/
            autoCapitalize="words"
            secureTextEntry={true}
            label = "인증번호 입력"
          />
          
        </InfoCon>

        <PW>
        <TouchableOpacity onPress={() => {navigation.navigate("FindPW") } }>
                <Text>비밀번호 찾기</Text>
            </TouchableOpacity>
        </PW>

          <View>
            <AuthButton loading = {loading}  text="확 인"  onPress={handleSubmit} />
          </View>
      </Container>
    </TouchableWithoutFeedback>
  );
};



