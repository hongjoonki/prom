import React, { useState }  from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from "react-apollo-hooks";
import { LOG_IN, CONFIRM_SECRET } from "./AuthQueries";
import { useLogIn } from "../../AuthContext";


const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const View= styled.View`
  flex:1;
`;
const InfoCon = styled.View`
  justify-content: center;
  flex : 2;
`;
const Middle = styled.View`
  flex:5;
`;

export default ({ navigation }) => {
  const confirmInput = useInput("");
  const logIn = useLogIn();
  const [loading, setLoading] = useState(false);
  const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
    variables: {
      secret: confirmInput.value,
      email: navigation.getParam("email")
    }
  });
  const handleConfirm = async () => {
    const { value } = confirmInput;
    if (value === "" || !value.includes(" ")) {
      return Alert.alert("Invalid secret");
    }
    try {
      setLoading(true);
      const {
        data: { confirmSecret }
      } = await confirmSecretMutation();
      if (confirmSecret !== "" || confirmSecret !== false) {
        logIn(confirmSecret);
      } else {
        Alert.alert("Wrong secret!");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Can't confirm secret");
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
      <View/>
      <InfoCon>
        <AuthInput
          {...confirmInput}
          //placeholder="Secret"
          returnKeyType="send"
          onSubmitEditing={handleConfirm}
          autoCorrect={false}
          label="confirm code"
        />
      </InfoCon>
      <View>
        <AuthButton loading={loading} onPress={handleConfirm} text="Confirm" />
      </View> 
      <View/>
      </Container>
    </TouchableWithoutFeedback>
  );
};