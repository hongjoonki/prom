import React, { useState } from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import AuthButton from "../../components/AuthConfirmButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import PNButton from "../../components/PNConfirmButton";
import AuthInputPN from "../../components/AuthInputPN";
import { useMutation, useQuery } from "react-apollo-hooks";
import { CREATE_ACCOUNT, ID_CHECK, CHECK_USERNAME, REQUEST_SECRET } from "./AuthQueries";
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
const ConfirmPN = styled.View`
flex-direction : row;
align-items: center;
justify-content: space-between;
`;

const InfoCon = styled.View`
  justify-content: center;
  align-items: center;
  flex : 3;

`;

export default ({ navigation }) => {

  const phoneNumInput = useInput("");
  const confirmSecretInput = useInput("");
  const [loading, setLoading] = useState(false);
  const [checkPhone, setCheckPhone] = useState(false);
  const [bottomModalAndTitle, setbottomModalAndTitle] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [auth, setAuth] = useState(false);
  const fName = navigation.getParam("fName");
  const lName = navigation.getParam("lName");

  const { data: userAccount } = useQuery(ID_CHECK, {
    variables: {
      cellPhone: phoneNumInput.value
    },
    skip: checkPhone
  });

  const [requestSecret] = useMutation(REQUEST_SECRET)

  const handleSecret = async () => {
    setLoading(true);
    const { value: phoneNum } = phoneNumInput;

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
          if (userAccount.checkAccount) {
            setbottomModalAndTitle(true)
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

  const handleSubmit = async () => {
    if (!auth) {
      return Alert.alert("?????? ?????? ????????? ???????????? ????????????.")
    }else if (phoneNumInput.value === "" || phoneNumInput.value === undefined) {
      return Alert.alert("??????????????? ???????????????");
    } else if (confirmSecretInput.value === "" || confirmSecretInput.value === undefined) {
      return Alert.alert("??????????????? ???????????????");
    } else {
      if(confirmSecretInput.value === secretCode) {
        navigation.navigate("SignUpID", { fName, lName, phoneNum: phoneNumInput.value })
      } else {
        return Alert.alert("??????????????? ????????????")
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
          <SubTitle>????????? ????????? ????????? ?????????.</SubTitle>
          <Text>?????? ????????? ?????? ???????????????.</Text>
        </SubTitleCon>

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
          <AuthButton onPress={handleSubmit} text="??? ???" />
        </View>

        <Modal.BottomModal
          visible={bottomModalAndTitle}
          onTouchOutside={() => setbottomModalAndTitle(false)}
          height={0.25}
          width={0.8}
          onSwipeOut={() => setbottomModalAndTitle(false)}
        >
          <ModalContent>
            <Text>?????? ???????????? ????????? ???????????????.</Text>
            <Text>??????????????? ????????? ?????????????????????????</Text>
          </ModalContent>
          <ModalFooter>
            <ModalButton
              text="OK"
              onPress={() => {navigation.navigate("FindPW"); setbottomModalAndTitle(false) }}
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