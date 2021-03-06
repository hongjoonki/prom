import React,{useState, useEffect, Component} from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import {Text,Image,ScrollView,TouchableOpacity, TextInput, Platform, TouchableHighlight, Alert, ActivityIndicator, Keyboard, TouchableWithoutFeedback, } from 'react-native';
import { TINT_COLOR,IconColor, PointPink, BG_COLOR, StarColor, LightGrey, mainPink, Grey, Line, LightPink } from '../components/Color';
import {FontAwesome, EvilIcons, AntDesign} from "@expo/vector-icons";
import Stars from 'react-native-stars';
import Hr from "hr-native";
import { useQuery, useMutation } from "react-apollo-hooks";
import { CATEGORY_FRAGMENT } from "../fragments";
import Loader from "../components/Loader";
import axios from 'axios';
import constants from "../constants";
import useInput from '../hooks/useInput';
import { FEED_QUERY } from "./Tabs/Home";
import {ME} from './Tabs/Profile/Profile';
import Modal, {ModalTitle, ModalContent, ModalFooter, ModalButton} from 'react-native-modals';

const UPDATE = gql`
  mutation editPost($id: String!, $caption: String, $rating: Float!, $category: String!, $details:[String!]){
          editPost(id: $id, caption: $caption, rating: $rating, category: $category, details:$details, action: EDIT){
              id
            }
}
`;

const Container = styled.View`
  flex : 1;
  padding : 10px;
`;
const Top = styled.View`
  flex-direction: row;
  margin-bottom : 10px;
`;

const ImageBox = styled.View`
margin-left : 3px;
`;
const TextCon = styled.View`
flex:1;
`;

const InfoCon = styled.View`
  flex : 1
  flex-direction: row;
  margin-horizontal : 10px;
  margin-top:7px;
  margin-bottom : 7px;
`;

const SubTitleCon = styled.View`
  padding : 5px;
  justifyContent: center;
`;
const SubTitle = styled.Text`
  font-size : 25px
  margin-right : 10px
  color : ${PointPink}
  font-weight : 200;
`;

const Restaurant = styled.View`
  alignItems: flex-end;
  justifyContent: center;
  margin-right : 5px
  flex : 1
`;

const StoreName = styled.Text`
  font-weight: 400;
  margin-bottom : 5px;
  font-size : 20px;
`;
const StoreAddress = styled.Text`
  font-weight: 300;
  margin-bottom : 5px;
  font-size : 10px;
`;

const Rating = styled.View`
  alignItems: flex-end;
  justifyContent: center;
  flex : 1

`;

const View = styled.View`
 flex : 1
`;

const SubTitleConMI = styled.View`
  padding : 5px;
  justifyContent: center;
`;
const MoreInfoCon = styled.View`
  flex : 6;
  margin-horizontal : 10px;
  margin-top:7px;
  margin-bottom : 7px;
`;

const UploadCon = styled.TouchableOpacity`
  alignItems: center;
  justifyContent: center;
`;
const UploadButton = styled.TouchableOpacity`
  margin-vertical : 5px;
  height: 40;
  border-radius: 7;
  background-color : ${LightPink};
  flex : 1;
  justifyContent: center;
  alignItems: center;
`;

const ViewModal = styled.View`
backgroundColor: white;
bottom:1;
height : ${constants.height / 2.5};
left:2px;
right:2px;
alignItems: center
position: absolute
border-top-left-radius : 30px;
border-top-right-radius : 30px;
border-color : ${Grey};
border-width : 1px;
`;
const ViewText = styled.Text`
fontWeight : 300;
font-size : 25;
margin-bottom : 10;
color : ${PointPink}
`;
const CategoryName = styled.Text`
fontWeight : 200;
font-size : 20;
margin-bottom : 7;
margin-top : 10px;
`;

const ButtonCon = styled.View`
flex-direction : row;
alignItems: center;
justifyContent: center;
`;

const UploadBt = styled.View`
margin-top: 50px;
flex-direction : row;
alignItems: center;
justifyContent: center;
`;

const PhotoNum = styled.View`
  alignItems: center;
  justifyContent: center;
  padding : 5px;
  margin : 4px;
  position: absolute;
  `;

const Button = styled.TouchableOpacity`
  alignItems: center;
  justifyContent: center;
  borderRadius: 7;
  padding : 5px;
  margin : 4px;
  background-color: ${props=>props.backgroundColor};
  width : ${constants.width /3.7};
`;
const CREATE_CATEGORY= gql`
  mutation createCategory($categoryName:String!){
    createCategory(categoryName: $categoryName){
      id
    }
  }
`
const seeCategory = gql`
  
  query seeCategory($userId: String){
    seeCategory(userId: $userId){
      ...CategoryParts
    }
  }
  ${CATEGORY_FRAGMENT}`
  ;

  const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
  
export default ({navigation}) => {
  const [keys, setKey] = useState([false,false,false,false,false,false,false,false,false,false,false,false]);
  const keyword = ['????????????', '?????????', '????????? ??????', '24??????', '????????????', '????????????', '??????????????????', '??? ????????????', '????????? ??????','????????????','????????? ??????','????????? ??????'];
  //const [details, setDetails] = useState([]);
  const details=[];
  const captionInput = useInput();
  const photo = navigation.getParam("photo");
  const storeName = navigation.getParam("name");
  const storeAdr = navigation.getParam("formatted_address");
  const id = navigation.getParam("postId")
  const star = navigation.getParam("star")
  const { loading, data } = useQuery(seeCategory);
  const [isloading, setIsLoading] = useState(false);
  const [starValue, setStarValue] = useState(star);
  const [isModalPick, setModalPick] = useState(false);
  const [selectCate, setSelectCate] = useState();
  const [pickedName, setPickedName] = useState();
  const [newCategory, setNewCategory] = useState(false);
  //const [fileUrl, setFileUrl] = useState([]);
  const categoryInput = useInput();

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    refetchQueries: ()=>[{query: seeCategory}]
  });
  const [updateMutation] = useMutation(UPDATE, {
    refetchQueries: ()=>[{query: FEED_QUERY},{query: ME }]
  });

  const handleSubmit=async()=>{
    if(captionInput.value===undefined || captionInput.value ===''){
      Alert.alert("????????? ????????? ????????? ????????????")
    }
    else if(starValue===undefined){
      Alert.alert("????????? ??????????????????")
    }else if(selectCate===undefined){
      Alert.alert('??????????????? ?????? ????????????')
    }else{
      for(let i =0; i<12; i++){
        if(keys[i]){
          details.push(keyword[i])
        }
      }
      try {
        setIsLoading(true);
  
        const {
          data: { editPost } 
        } = await updateMutation({
          variables: {
            id,
            caption: captionInput.value,
            rating: starValue,
            category: selectCate,
            details
          }
        });
        if(editPost.id){
          navigation.navigate("TabNavigation");
        }
  
      } catch (e) {
        console.log(e)
        Alert.alert("can't update ", "Try later");
      } finally{
        setIsLoading(false);
      }
    }
    
    
};


  const handleKey= async(i)=>{
    keys[i] = !keys[i]
    await setKey([...keys])

  }

  const togglePicker=(p)=>{
    setModalPick(!p)
  }

  const nameValue = (newValue)=>{
    setPickedName(newValue)
  }
  const pickValue=(newValue,categoryName)=>{
    setSelectCate(newValue);
    nameValue(categoryName);
    togglePicker(isModalPick);
  }

  const handleCreate = async ()=>{
    if(categoryInput.value === undefined){
        Alert.alert("??? ????????? ???????");
    }
    else{
        await setIsLoading(true);
        try {
            
            await createCategory({
            variables: {
                categoryName: categoryInput.value
            }
            });
        } catch (e) {
            console.log(e)
        } finally{
            await setIsLoading(false);
            await setNewCategory(false);
            categoryInput.setValue("")
        }
    }
}
  return(
    <DismissKeyboard>
    <Container>
      <Top>
        <ImageBox>
          <Image
            source={{ uri: photo[0].uri }}
            style={{ 
              height: 100, 
              width: 100, 
              marginRight: 20,
              borderRadius:20
            }}
          />
        </ImageBox>

        <TextCon>
          
            <TextInput
              onChangeText={captionInput.onChange}
              value={captionInput.value}
              multiline={true}
              placeholder="?????????..."
              placeholderTextColor={TINT_COLOR}
              maxLength={235}
            />
          
        </TextCon>
      </Top> 

      <Hr lineStyle={{ backgroundColor : Line}} />

      <InfoCon>
        <SubTitleCon>
          <SubTitle> ????????? </SubTitle>
        </SubTitleCon>
        <Restaurant>
          <StoreName>{storeName}</StoreName>
          <StoreAddress>{storeAdr}</StoreAddress>
        </Restaurant>
      </InfoCon>

      <Hr lineStyle={{ backgroundColor : Line}} />

      <InfoCon>
        <SubTitleCon>
          <SubTitle> ??? ??? </SubTitle>
        </SubTitleCon>
        <Rating>
          <Stars
            half={true}
            default={starValue}
            update={(val)=>setStarValue(val)}
            spacing={6}
            count={5}
            fullStar = {<FontAwesome name={'star'} size={25} color={StarColor}/>}
            //fullStar = {<Image source={require('../../assets/star.png')} style={{height:50,width:50}}/>}
            emptyStar={<FontAwesome name={'star-o'} size={25} color={Grey}/>}
            halfStar={<FontAwesome name={'star-half-full'} size={25} color={StarColor}/>}/>
        </Rating>
      </InfoCon>   

      <Hr lineStyle={{ backgroundColor : Line}} />

      <InfoCon>
        <SubTitleCon>
          <SubTitle> Category </SubTitle>
        </SubTitleCon>
        <Restaurant>
          <TouchableOpacity onPress={()=>togglePicker(isModalPick)}>
          <StoreName>
            {selectCate ? <Text>{pickedName}</Text> :'Select'} 
          </StoreName>
          </TouchableOpacity>
        </Restaurant>
      </InfoCon>
      <Hr lineStyle={{ backgroundColor : Line}} />

      <MoreInfoCon>
        <SubTitleConMI>
          <SubTitle> More Information </SubTitle>
        </SubTitleConMI>
        <ButtonCon>
          <ScrollView>
          <ButtonCon>
          <Button onPress={()=>handleKey(0)} backgroundColor={ keys[0] ? mainPink : LightGrey}><Text>????????????</Text></Button>
          <Button onPress={()=>handleKey(1)} backgroundColor={ keys[1] ? mainPink : LightGrey}><Text>?????????</Text></Button>
          <Button onPress={()=>handleKey(2)} backgroundColor={ keys[2] ? mainPink : LightGrey}><Text>????????? ??????</Text></Button>
          </ButtonCon>

          <ButtonCon>
          <Button onPress={()=>handleKey(3)} backgroundColor={ keys[3] ? mainPink : LightGrey}><Text>24??????</Text></Button>
          <Button onPress={()=>handleKey(4)} backgroundColor={ keys[4] ? mainPink : LightGrey}><Text>????????????</Text></Button>
          <Button onPress={()=>handleKey(5)} backgroundColor={ keys[5] ? mainPink : LightGrey}><Text>????????????</Text></Button>
          </ButtonCon>

          <ButtonCon>
          <Button onPress={()=>handleKey(6)} backgroundColor={ keys[6] ? mainPink : LightGrey}><Text>??????????????????</Text></Button>
          <Button onPress={()=>handleKey(7)} backgroundColor={ keys[7] ? mainPink : LightGrey}><Text>??? ????????????</Text></Button>
          <Button onPress={()=>handleKey(8)} backgroundColor={ keys[8] ? mainPink : LightGrey}><Text>????????? ??????</Text></Button>
          </ButtonCon>

          <ButtonCon>
          <Button onPress={()=>handleKey(9)} backgroundColor={ keys[9] ? mainPink : LightGrey}><Text>????????????</Text></Button>
          <Button onPress={()=>handleKey(10)} backgroundColor={ keys[10] ? mainPink : LightGrey}><Text>????????? ??????</Text></Button>
          <Button onPress={()=>handleKey(11)} backgroundColor={ keys[11] ? mainPink : LightGrey}><Text>????????? ??????</Text></Button>
          </ButtonCon>
          
          
        
        </ScrollView>
        </ButtonCon>
        <UploadBt>
            <UploadButton backgroundColor ={mainPink} onPress={handleSubmit}>{isloading ? (
              <ActivityIndicator color="white" />
            ): (
              <Text>UPLOAD</Text>
            )}</UploadButton>
          </UploadBt>
      </MoreInfoCon>
      
      <Modal 
      visible={isModalPick}
      onTouchOutside={() => togglePicker(isModalPick)}
      width={0.8}
      onSwipeOut={() => togglePicker(isModalPick)}
      >
          <ModalContent>
          
            <ViewText>????????????</ViewText>
            <Hr lineStyle={{ backgroundColor : Line}}/>
            <ScrollView height={200}>
            {data && data.seeCategory.map((value, index)=>{
              return <TouchableHighlight key={index } onPress={()=>pickValue(value.id, value.categoryName)} style={{paddingTop:4, paddingBottom:4}}>
                <CategoryName>{value.categoryName}</CategoryName>
              </TouchableHighlight>
            })}
            </ScrollView>
          </ModalContent>

          <ModalFooter>
            <ModalButton onPress={()=>setNewCategory(true)} text="???????????? ????????????" />

            <ModalButton onPress={()=>togglePicker(isModalPick)} text="??????" />

          </ModalFooter>
      </Modal>
      <Modal
          visible={newCategory}
          onTouchOutside={() => setNewCategory(false)}
          width={0.8}
          onSwipeOut={() => setNewCategory(false)}
      >
          <ModalContent>
          <TextInput 
              onChangeText={categoryInput.onChange}
              placeholder={"??? ???????????? ??????"}
              placeholderTextColor={TINT_COLOR}/>
          
          </ModalContent>
          
          <ModalFooter>
          {!isloading ? (
          <ModalButton
              text="??????"
              onPress={()=>handleCreate()}
          />) : <Loader/> }
          <ModalButton
              text= "??????"
              onPress={()=>setNewCategory(false)}
              />
          </ModalFooter>
      </Modal>
    </Container>
    </DismissKeyboard>
  );
}