import React, { useState } from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard, Alert, StyleSheet, TouchableOpacity } from "react-native";
import AuthButton from "../../components/AuthConfirmButton";
import PNButton from "../../components/PNConfirmButton";
import AuthInput from "../../components/AuthInput";
import AuthInputPN from "../../components/AuthInputPN";
import useInput from "../../hooks/useInput";
import { useMutation, useQuery } from "react-apollo-hooks";
import { CREATE_ACCOUNT, ID_CHECK, CHECK_USERNAME, CONFIRM_SECRET, REQUEST_SECRET } from "./AuthQueries";
import { TINT_COLOR, PointPink, BG_COLOR, Grey } from '../../components/Color'
import Modal, { ModalTitle, ModalContent, ModalFooter, ModalButton } from 'react-native-modals';

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

const PW = styled.View`
align-items: center;
justify-content: flex-end;
`;

const ConfirmPN = styled.View`
flex-direction : row;
align-items: center;
justify-content: space-between;
`;

export default ({ navigation }) => {
  const phoneNumInput = useInput("");
  const confirmSecretInput = useInput("");
  const [checkPhone, setCheckPhone] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState(false);
  const [bottomModalAndTitle, setbottomModalAndTitle] = useState(false);

  const { data: userAccount } = useQuery(ID_CHECK, {
    variables: {
      cellPhone: phoneNumInput.value
    },
    skip: checkPhone
  });

  const [requestSecret] = useMutation(REQUEST_SECRET)

  const handleSecret = async () => {
    setLoading(true);
    // const { value: email } = emailInput;
    // const { value: password } = passwordInput;
    const { value: phoneNum } = phoneNumInput;

    // const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (phoneNum === "" || phoneNum === undefined) {
      setLoading(false);
      return Alert.alert("??????????????? ??????????????????");
    } else if (phoneNum.length !== 11) {
      setLoading(false);
      return Alert.alert("????????? ???????????????.");
    } else {
      try {
        setCheckPhone(true);

        if (userAccount) {
          if (!userAccount.checkAccount) {
            Alert.alert("??????????????? ????????? ?????? ?????? ????????????.")
          } else {
            const { data } = await requestSecret({variables: {phoneNum}})
            if(data) {
              setAuth(true)
              Alert.alert("???????????? ?????? ??????")
              setSecretCode(data.requestSecret)
            }
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setCheckPhone(false);
        setLoading(false);
      }
    }
  };


  const handleSubmit = async() => {
    if (!auth) {
      return Alert.alert("?????? ?????? ????????? ???????????? ????????????.")
    }else if (phoneNumInput.value === "" || phoneNumInput.value === undefined) {
      return Alert.alert("??????????????? ???????????????");
    } else if (confirmSecretInput.value === "" || confirmSecretInput.value === undefined) {
      return Alert.alert("??????????????? ???????????????");
    } else {
      if(confirmSecretInput.value === secretCode) {
        setbottomModalAndTitle(true)
      } else {
        return Alert.alert("??????????????? ????????????")
      }
    }
  }






  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <TitleCon>
          <Title>???????????? ??????</Title>
        </TitleCon>

        <InfoCon>

          <ConfirmPN>
            <AuthInputPN
              {...phoneNumInput}
              /*placeholder="First name"*/
              autoCapitalize="words"
              label="????????????"

            />
            <PNButton loading={loading} onPress={handleSecret} text="???????????? ??????" />
          </ConfirmPN>

          <AuthInput
            {...confirmSecretInput}
            /*placeholder="First name"*/
            autoCapitalize="words"
            label="???????????? ??????"
          />

        </InfoCon>

        <View>
          <AuthButton loading={loading} text="??? ???" onPress={handleSubmit} />
        </View>

        <Modal.BottomModal
          visible={bottomModalAndTitle}
          onTouchOutside={() => setbottomModalAndTitle(false)}
          height={0.25}
          width={0.8}
          onSwipeOut={() => setbottomModalAndTitle(false)}
        >
          <ModalContent>
            <Text>??????????????? ????????? ???????????????????</Text>
          </ModalContent>
          <ModalFooter>
            <ModalButton
              text="OK"
              onPress={() => {navigation.navigate("ResetPassword", {phoneNum: phoneNumInput.value}); setbottomModalAndTitle(false) }}
            />
            <ModalButton
              text="CANCEL"
              onPress={() => setbottomModalAndTitle(false)}
            />
          </ModalFooter>
        </Modal.BottomModal>
      </Container>
    </TouchableWithoutFeedback>
  );
};



