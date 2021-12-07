import React, { useState }  from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard, StyleSheet } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from "react-apollo-hooks";
import { LOG_IN, CREATE_ACCOUNT } from "./AuthQueries";
import { TINT_COLOR, PointPink, BG_COLOR } from '../../components/Color'

const Container = styled.View`
  flex: 1;
  background-color : ${BG_COLOR}
`;
const View = styled.View`
  justify-content: center;
  align-items: center;
  flex : 1;
`;
const InfoCon = styled.View`
  justify-content: center;
  align-items: center;
  flex : 5;
`;

export default ({ navigation }) => {
  const emailInput = useInput(navigation.getParam("email", ""));
  const [loading, setLoading] = useState(false);
//   const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
//     variables: {
//       username: usernameInput.value,
//       email: emailInput.value,
//       firstName: fNameInput.value,
//       lastName: lNameInput.value
//     }
//   });
  const handleSingup = async () => {
    const { value: email } = emailInput;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("That email is invalid");
    }
    try {
      setLoading(true);
      navigation.navigate("Signup", { email });
    } catch (e) {
      console.log(e);
      Alert.alert("Username or email is already used", "Log in instead");
      navigation.navigate("Signup", { email });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <Container>
        <InfoCon>
          <AuthInput
            {...emailInput}
            placeholder="Email"
            keyboardType="email-address"
            returnKeyType="send"
            autoCorrect={false}
            label = "Email"
          />
        </InfoCon>
        <View>
          <AuthButton loading={loading} onPress={handleSingup} text="회원가입" />
        </View>
        <View/>
      </Container>
    </TouchableWithoutFeedback>
  );
};

/* 
          

*/