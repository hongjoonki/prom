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
  //     return Alert.alert("아이디를 입력하세요");
  //   } else {
  //     try {
  //       setCheck(true);
  //       if(userAccount) {
  //         if(!userAccount.checkAccount) {
  //           setConfirmAccount(true)
  //         } else {
  //           return Alert.alert("이미 존재하는 아이디입니다.");
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
        Alert.alert("이미 존재하는 username입니다.", "다른 username을 입력해주세요")
      }
    } catch (e) {
      console.log(e);
    } finally {
      
      setCheckUsername(false);
    }
  }

  const confirmPhone = async () => {
    if(cellPhoneInput.value=="") {
      return Alert.alert("핸드폰 번호를 입력하세요");
    } else if(cellPhoneInput.value.length !== 11) {
      return Alert.alert("잘못된 형식입니다.");
    } else {
      try {
        setCheckPhone(true);
        if(userAccount) {
          if(!userAccount.checkAccount) {
            setConfirmAccount(true)
          } else {
            return Alert.alert("이미 존재하는 핸드폰 번호입니다.");
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
    //   return Alert.alert("아이디를 확인하세요");
    // }
    if (cellPhone === "") {
      return Alert.alert("Invalid cellphone number");
    }
    if (password === "") {
      return Alert.alert("비밀번호를 입력하세요");
    } else if(password.length < 8) {
      return Alert.alert("비밀번호를 8자이상 입력하세요");
    }
    if( passwordConfirm !== password ) {
      return Alert.alert("비밀번호가 다릅니다.");
    }
    if( username === "" ) {
      return Alert.alert("활동명을 입력해주세요.");
    }
    if (fName === "") {
      return Alert.alert("이름을 입력하세요");
    }
    if (lName === "") {
      return Alert.alert("성을 입력하세요");
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
          <Text>회원가입</Text>
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
              <Text>확인</Text>
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
              <Text>확인</Text>
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
          <AuthButton loading={loading} onPress={handleSingup} text="회원가입" />
        </View>
        <View/>
      </Container>
    </TouchableWithoutFeedback>
  );
};

/* 
          

*/