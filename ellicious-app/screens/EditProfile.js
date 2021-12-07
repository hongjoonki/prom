import React,{useState} from "react";
import { useQuery,useMutation } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import Loader from "../components/Loader";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ScrollView, Text,TextInput,RefreshControl, KeyboardAvoidingView,Alert, TouchableOpacity, StyleSheet  } from "react-native";
import { POST_COMMENT } from "../fragments";
import PostOfComment from '../components/CommentComponents/PostOfComment';
import { PointPink, CommentsBox, mainPink, TINT_COLOR, Grey, LightPink } from "../components/Color";
import { withNavigation } from "react-navigation";
import constants from "../constants";
import { FormLabel, FormInput } from 'react-native-elements';
import {AntDesign, FontAwesome} from '@expo/vector-icons';
import Modal, {ModalTitle, ModalContent, ModalFooter, ModalButton} from 'react-native-modals';
import { FEED_QUERY } from "../screens/Tabs/Home";
import {ME} from '../screens/Tabs/Profile/Profile';
import {seeCategory} from '../screens/Photo/UploadPhoto'
import firebase from 'firebase';

export const EDIT_USER = gql`
  mutation editUser($newAvatar: String, $bio: String, $username: String, $lastName: String, $firstName: String) {
    editUser(avatar: $newAvatar bio: $bio username: $username, firstName: $firstName, lastName: $lastName){
      id
    }
  }
`;
/*export const CREATE_CATEGORY= gql`
  mutation createCategory($categoryName:String!){
    createCategory(categoryName: $categoryName){
      id
    }
  }
`
*/
const Container = styled.View`
flex : 1;
padding : 15px;
`;

const View = styled.View`
flex:1
`;
const EditImage = styled.View`
  height : 30%;
  alignItems: center;
  justifyContent: center;
`;
const ImageCon = styled.View`
`;

const Image = styled.Image`
  width: 95;
  height: 95;
  borderRadius:30;
  position : relative;
`;
const EditButton = styled.TouchableOpacity`
alignItems: center;
justifyContent: center;
`;
const EditId = styled.Text`
margin-top : 5px;
`;

const EditInfo = styled.View`
  flex : 2.5;
  alignItems: center;
  justifyContent: center;
  
`;
const EditName = styled.View`
`;
const EditCage = styled.View`
flex : 4
`;
const EditCageDetail = styled.View`
flex-direction : row;
margin-right : 10px;
alignItems: center;
justifyContent: center;
`;
const Button = styled.TouchableOpacity`
  right : 0px;
  bottom: 0px;
  justify-content: center;
  align-items: center;
  position: absolute;
  
`;
const EditProfile=({
    navigation
})=>{
  const id = navigation.getParam("id");
  const username =  navigation.getParam("username");
  const avatar =  navigation.getParam("avatar");
  const firstName =  navigation.getParam("firstName");
  const lastName =  navigation.getParam("lastName");
  //const category =  navigation.getParam("category");
  //const categoryCount =  navigation.getParam("categoryCount");
  const bio =  navigation.getParam("bio");
  const email = navigation.getParam("email");
  //const [addCategory, setAddCategory] = useState(false);
  const [bottomModalAndTitle, setbottomModalAndTitle] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const bioInput = useInput();
  const usernameInput = useInput();
  const firstnameInput = useInput();
  const lastnameInput = useInput();
  const [editProfilePictureMutation] = useMutation(EDIT_USER, {
    refetchQueries: ()=>[{query: FEED_QUERY},{query: ME }]
  });
  /*const [createCategoryMutation] = useMutation(CREATE_CATEGORY,{
    refetchQueries: ()=>[{query: seeCategory}]
  });*/

  const changePicture = async() => {
    try {
      navigation.navigate("ProfilePicture", {id, username, avatar, bio, email});
    } catch (e) {
      console.log(e)
    } finally {
      setbottomModalAndTitle(false);
    }
  }

  

  const handleSubmit = async() => {
    setIsLoading(true);
    let newbio = bio;
    let newusername = username;
    let newfirstname = firstName;
    let newlastname = lastName;

    if(bioInput.value) {
      newbio = bioInput.value;
    }
    if(usernameInput.value) {
      newusername = usernameInput.value;
    }
    if(firstnameInput.value) {
      newfirstname = firstnameInput.value;
    }
    if(lastnameInput.value) {
      newlastname = lastnameInput.value;
    }
   
    try {
      await editProfilePictureMutation({
        variables: {
          newAvatar: avatar,
          bio: newbio,
          username: newusername,
          firstName: newfirstname,
          lastName: newlastname
        }
      });
      firebase.database().ref('users').child(id).update({ID: newusername})
      navigation.goBack();
    } catch (e) {
      console.log(e)
      Alert.alert("같은 UserName이 존재합니다.")
    } finally{
      setIsLoading(false);
    }
  }

    return (
      <Container>
        <EditImage>
          <ImageCon>
            {avatar==null ? 
              <Image 
                source={{uri: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAInJR1.img?h=400&w=300&m=6&q=60&o=f&l=f&x=509&y=704"}}
              />
            :
              <Image 
                source={{uri: avatar}}
              />
            }
            
            <Button onPress={() => setbottomModalAndTitle(true)}>
              <FontAwesome 
                name = {'camera'}
                color ={Grey}
                position={'absolute'}
                size={25}
              />
            </Button>
            
          </ImageCon>
          <EditButton>
            <TextInput 
            style={styles.EditId}
            onChangeText={usernameInput.onChange}
            placeholder={username}
            placeholderTextColor={TINT_COLOR} >
              {username}
            </TextInput>
          </EditButton>
        </EditImage>

      <ScrollView>
        <EditInfo>
        <EditName>
          <Text style={{fontSize : 17, color : PointPink, marginTop : 13}}>성</Text>
            <TextInput 
              style={{ 
                height: 26,
                width: constants.width-30, 
                fontSize: 20, 
                color: TINT_COLOR, 
                borderBottomWidth: 1, 
                borderBottomColor: mainPink,
              }}
            onChangeText={lastName.onChange}
            placeholderTextColor={Grey}
            >
              {lastName}
            </TextInput>
          </EditName>
          <EditName>
          <Text style={{fontSize : 17, color : PointPink, marginTop : 13}}>이름</Text>
            <TextInput 
              style={{ 
                height: 26,
                width: constants.width-30, 
                fontSize: 20, 
                color: TINT_COLOR, 
                borderBottomWidth: 1, 
                borderBottomColor: mainPink,
              }}
            onChangeText={firstName.onChange}
            placeholderTextColor={Grey}
            >
              {firstName}
            </TextInput>
          </EditName>
          <EditName>
          <Text style={{fontSize : 17, color : PointPink, marginTop : 13}}>이메일</Text>
            <TextInput 
              style={{ 
                height: 26,
                width: constants.width-30, 
                fontSize: 20, 
                color: TINT_COLOR, 
                borderBottomWidth: 1, 
                borderBottomColor: mainPink,
              }}
            onChangeText={email.onChange}
            placeholderTextColor={Grey}
            >
              {email}
            </TextInput>
          </EditName>
          <EditName>
          <Text style={{fontSize : 17, color : PointPink, marginTop : 13}}>소개</Text>
            <TextInput 
              style={{ 
                height: 26,
                width: constants.width-30, 
                fontSize: 20, 
                color: TINT_COLOR, 
                borderBottomWidth: 1, 
                borderBottomColor: mainPink,
              }}
            onChangeText={bioInput.onChange}
            placeholder={"자기소개를 입력하세요"}
            placeholderTextColor={Grey}
            >
              {bio}
            </TextInput>
          </EditName>
        </EditInfo>
        
          <TouchableOpacity onPress={() => handleSubmit()}>
            <Text style={{fontSize : 17, color : PointPink, marginTop : 13}}>완 료</Text>
          </TouchableOpacity>
        </ScrollView>
        <Modal.BottomModal
            visible={bottomModalAndTitle}
            onTouchOutside={() => setbottomModalAndTitle(false)}
            height={0.3}
            width={0.8}
            onSwipeOut={() => setbottomModalAndTitle(false)}
          >
            <ModalContent>
              {/* <ModalButton
                text="현재 사진 삭제"
                onPress={() => {}}
              />
              <ModalButton
                text="카메라에서 업로드"
                onPress={() => {}}
              /> */}
              <ModalButton
                text="앨범에서 업로드"
                onPress={()=>changePicture()}
              />
            </ModalContent>
            <ModalFooter>
              <ModalButton
                text="CANCEL"
                onPress={() => setbottomModalAndTitle(false)}
              />
            </ModalFooter>
          </Modal.BottomModal>
      </Container>

        );
      }

    
const styles = StyleSheet.create({
    EditCage:{
      height: 24,
      //width: constants.width-20, 
      marginTop: 15,
      fontSize : 17
    },
    EditId : {
      fontSize : 25, 
      fontWeight : "200",
      marginTop: 7
    },
        header:{
            height:100,
        },
        editbox:{
            marginTop:60,
            alignItems: 'center'
          },
        editImage:{
            fontSize:16,
            color: mainPink,
            fontWeight: "600"
          },
        avatar: {
          width: 130,
          height: 130,
          borderRadius: 63,
          borderWidth: 4,
          borderColor: "white",
          marginBottom:10,
          alignSelf:'center',
          position: 'absolute',
          marginTop:30
        },
        name:{
          fontSize:22,
          color:"#FFFFFF",
          fontWeight:'600',
        },
        body:{
        },
        bodyContent: {
          flex: 1,
          alignItems: 'center',
          padding:30,
        },
        name:{
          fontSize:28,
          color: "#696969",
          fontWeight: "600"
        },
        info:{
          fontSize:16,
          color: "#00BFFF",
          marginTop:10
        },
        description:{
          fontSize:16,
          color: "#696969",
          marginTop:10,
          textAlign: 'center'
        },
        buttonContainer: {
          marginTop:10,
          height:45,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom:20,
          width:250,
          borderRadius:30,
          backgroundColor: "#00BFFF",
        },
      });

export default withNavigation(EditProfile);


/*
{category
            .map(tag => (
            <EditCageDetail key={tag.id}>
              <TextInput 
                style={styles.EditCage}
                placeholder = {tag.categoryName}
                placeholderTextColor={TINT_COLOR}
              />
              <View />
              <TouchableOpacity>
                <Text style={{fontSize : 17, color : PointPink, marginTop : 13, marginRight : 13}}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{fontSize : 17, color : PointPink, marginTop : 13}}>삭제</Text>
              </TouchableOpacity>
            </EditCageDetail>
            ))} */
/* <EditCage>
          <Text style={{fontSize : 17, color : PointPink, marginTop : 13}}>카테고리</Text>
          <TouchableOpacity onPress={handleCategory}>
            <AntDesign name={'pluscircleo'} size={17}/>
          </TouchableOpacity>
          {addCategory ? (
            <TextInput 
            style={{fontSize:17}} 
            placeholder={"카테고리 이름"}
            onChangeText={addedCategory.onChange}/>
          ) : null
          }
          
          </EditCage> */