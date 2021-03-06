import React, { useState }  from "react";
import styled from "styled-components";
import { TouchableWithoutFeedback, Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation, useQuery } from "react-apollo-hooks";
import { CREATE_ACCOUNT, ID_CHECK, CHECK_USERNAME } from "./AuthQueries";
import { TINT_COLOR, PointPink, BG_COLOR } from '../../components/Color'
import firebase from 'firebase';

const Container = styled.View`
  flex: 1;
  background-color : ${BG_COLOR}
`;
const View = styled.View`
  justify-content: center;
  align-items: center;
  flex : 1;
`;
const Title = styled.View`
  flex:1;
  
`;
const Text = styled.Text`
  margin-left : 20px;
  font-Size : 40px;
  color: ${TINT_COLOR};
  margin-bottom : 5px;
`;
const InfoCon = styled.View`
  justify-content: center;
  align-items: center;
  flex : 5;
`;

const OtherSignUP = styled.View`
  flex-direction : row;
  margin-top : 10px;
  justify-content: center;
  flex:1;
`;

const styles = StyleSheet.create({
  lineStyle:{
        borderWidth: 1,
        borderColor: '#919191',
        margin:10,
   }
 });

export default ({ navigation }) => {
  const fNameInput = useInput("");
  const lNameInput = useInput("");
  const usernameInput = useInput("");
  const cellPhoneInput = useInput("");
  const passwordInput = useInput("");
  const passwordConfirmInput = useInput("");
  const [loading, setLoading] = useState(false);
  // const [check, setCheck] = useState(false);
  const [checkPhone, setCheckPhone] = useState(false);
  const [confirmAccount, setConfirmAccount] = useState(false);
  const [checkUsername, setCheckUsername] = useState(false);
  const [usernameOK, setUsernameOK] = useState(false);
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
    variables: {
      password: passwordInput.value,
      username: usernameInput.value,
      firstName: fNameInput.value,
      lastName: lNameInput.value,
      cellPhone: cellPhoneInput.value,
    }
  });

  const { data: userAccount } = useQuery(ID_CHECK, {
    variables: {
      cellPhone: cellPhoneInput.value
    },
    skip: checkPhone
  });

  const { data: isUsername } = useQuery(CHECK_USERNAME, {
    variables: {
      term: usernameInput.value
    },
    skip: checkUsername
  });

  // const confirmID = async () => {
  //   if(idInput.value=="") {
  //     return Alert.alert("???????????? ???????????????");
  //   } else {
  //     try {
  //       setCheck(true);
  //       if(userAccount) {
  //         if(!userAccount.checkAccount) {
  //           setConfirmAccount(true)
  //         } else {
  //           return Alert.alert("?????? ???????????? ??????????????????.");
  //         }
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setCheck(false)
  //     }
  //   }
  // }
  const confirmUsername = async() => {
    setCheckUsername(true);
    try {
      if(!isUsername.checkUsername) {
        const {
          data: { createAccount }
        } = await createAccountMutation();
        if (createAccount) {
          firebase.database().ref("users/"+createAccount.id).set({ID: createAccount.username});
          Alert.alert("Account created", "Log in now!");
          navigation.navigate("AuthHome");
        }
      } else {
        Alert.alert("?????? ???????????? username?????????.", "?????? username??? ??????????????????")
      }
    } catch (e) {
      console.log(e);
    } finally {
      
      setCheckUsername(false);
    }
  }

  const confirmPhone = async () => {
    if(cellPhoneInput.value=="") {
      return Alert.alert("????????? ????????? ???????????????");
    } else if(cellPhoneInput.value.length !== 11) {
      return Alert.alert("????????? ???????????????.");
    } else {
      try {
        setCheckPhone(true);
        if(userAccount) {
          if(!userAccount.checkAccount) {
            setConfirmAccount(true)
          } else {
            return Alert.alert("?????? ???????????? ????????? ???????????????.");
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setCheckPhone(false)
      }
    }
  }

  const handleSingup = async () => {
    const { value: fName } = fNameInput;
    const { value: lName } = lNameInput;
    const { value: password } = passwordInput;
    const { value: passwordConfirm } = passwordConfirmInput;
    const { value: username } = usernameInput;
    const { value: cellPhone } = cellPhoneInput;
    // if(!confirmAccount) {
    //   return Alert.alert("???????????? ???????????????");
    // }
    if (cellPhone === "") {
      return Alert.alert("Invalid cellphone number");
    }
    if (password === "") {
      return Alert.alert("??????????????? ???????????????");
    } else if(password.length < 8) {
      return Alert.alert("??????????????? 8????????? ???????????????");
    }
    if( passwordConfirm !== password ) {
      return Alert.alert("??????????????? ????????????.");
    }
    if( username === "" ) {
      return Alert.alert("???????????? ??????????????????.");
    }
    if (fName === "") {
      return Alert.alert("????????? ???????????????");
    }
    if (lName === "") {
      return Alert.alert("?????? ???????????????");
    }

    try {
      setLoading(true);
      await confirmUsername();
    } catch (e) {
      console.log(e);
      Alert.alert("This Phone number is already used", "Log in instead");
      navigation.navigate("AuthHome");
    } finally {
      setLoading(false);
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <Container>
        <View/>
        <Title>
          <Text>????????????</Text>
          <View style = {styles.lineStyle} />
        </Title>
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
          {confirmAccount ?
          (
            <AuthInput
            {...cellPhoneInput}
            placeholder="cellphone number"
            returnKeyType="send"
            autoCorrect={false}
            keyboardType="number-pad"
            label = "CellPhone"
            editable={false}
          />
          )
          :
          (
            <>
            <AuthInput
              {...cellPhoneInput}
              placeholder="cellphone number"
              returnKeyType="send"
              autoCorrect={false}
              keyboardType="number-pad"
              label = "CellPhone"
            />
            <TouchableOpacity onPress={() => confirmPhone()}>
              <Text>??????</Text>
            </TouchableOpacity>
            </>
          )
          }
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
          <AuthInput
            {...usernameInput}
            /*placeholder="First name"*/
            autoCapitalize="words"
            label = "UserName (ex GD_HONG)"
          />
          <AuthInput
            {...fNameInput}
            /*placeholder="First name"*/
            autoCapitalize="words"
            label = "First Name (ex ??????)"
          />
          <AuthInput
            {...lNameInput}
            placeholder="Last name"
            autoCapitalize="words"
            label = "Last Name (ex ???)"
          />
        </InfoCon>
        <View>
          <AuthButton loading={loading} onPress={handleSingup} text="????????????" />
        </View>
        <View/>
      </Container>
    </TouchableWithoutFeedback>
  );
};

/* 
          

*/