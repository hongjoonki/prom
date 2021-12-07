import React, { useState }  from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard, Alert,StyleSheet, TouchableOpacity } from "react-native";
import AuthButton from "../../components/AuthConfirmButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { useMutation, useQuery } from "react-apollo-hooks";
import { CREATE_ACCOUNT, ID_CHECK, CHECK_USERNAME,CONFIRM_SECRET} from "./AuthQueries";
import { TINT_COLOR, PointPink, BG_COLOR } from '../../components/Color'
import { useLogIn } from "../../AuthContext";


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
  const fNameInput = useInput("");
  const lNameInput = useInput("");
  const logIn = useLogIn();
  

  const [loading, setLoading] = useState(false);
  const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
    variables: {
      password: fNameInput.value,
      // email: emailInput.value
      cellPhone: lNameInput.value
    }
  });

  const handleSubmit=()=>{
    if (fNameInput.value === "" || fNameInput.value===undefined) {
      return Alert.alert("이름을 입력하세요");
    }
    else if (lNameInput.value === "" ||lNameInput.value === undefined) {
      return Alert.alert("성을 입력하세요");
    }else{
      navigation.navigate("SignUpPhone",{fName: fNameInput.value, lName: lNameInput.value})
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <Container>
        <TitleCon>
          <Title>회원가입</Title>
        </TitleCon>
        <SubTitleCon>
          <SubTitle>이름을 입력해 주세요.</SubTitle>
        </SubTitleCon>
        
        <InfoCon>
          
          
          <AuthInput
            {...fNameInput}
            /*placeholder="First name"*/
            autoCapitalize="words"
            label = "First Name (ex 길동)"
          />
          <AuthInput
            {...lNameInput}
            placeholder="Last name"
            autoCapitalize="words"
            label = "Last Name (ex 홍)"
          />
        </InfoCon>
        <View>
          <AuthButton loading = {loading} onPress={handleSubmit} text="확 인" />
        </View>

      </Container>
    </TouchableWithoutFeedback>
  );
};

