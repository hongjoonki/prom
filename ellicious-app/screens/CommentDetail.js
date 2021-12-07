import React,{useState} from "react";
import { useQuery,useMutation } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import Loader from "../components/Loader";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import {Evilcons} from '@expo/vector-icons';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ScrollView,Alert, Text,Image,TextInput,RefreshControl, KeyboardAvoidingView,ActivityIndicator } from "react-native";
import { POST_COMMENT } from "../fragments";
import PostOfComment from '../components/CommentComponents/PostOfComment';
import { LightGrey, CommentsBox, mainPink } from "../components/Color";
import User from '../User';
import { FEED_QUERY } from "../components/Post";

const InfoCon=styled.View`
  flex:1;
  margin-top : 8px;
`;
const Touchable = styled.TouchableOpacity``;

const CaptionCon = styled.View`
  flex:1;
  flex-direction: row;
  alignItems: center;
`;
const CommentBox =styled.View`
  flex-direction:row;
  margin-bottom: 10px;
  alignItems: center;
  margin-left : 5px;
  margin-right : 2px;
  margin-top : 7px;
`;
const Bold = styled.Text`
  font-weight: 600;
  font-size : 15px;
  margin-right : 5px;
`;
const TextBox = styled.View`
  background-color : ${CommentsBox};
  border-radius: 4px;
  justifyContent: center;
  padding : 5px;
  flex : 1;
  margin-right : 5px;
  margin-left : 5px;
  height : 30;
`;

const GET_COMMENTS = gql`
    query seeComment($postId: String!){
        seeComment(postId: $postId){
            ...CommentParts
        }
    } 
    ${POST_COMMENT}
`;
const ADD_COMMENTS = gql`
    mutation addComment($text: String!, $postId: String! ){
      addComment(text: $text, postId:$postId){
        id
        text
      }
    }
`

export default ({navigation})=>{
    const [refreshing, setRefreshing] = useState(false);
    const commentInput = useInput();
    const [isLoading, setIsLoading] = useState(false);
    const postId = navigation.getParam("postId");
    const focusing = navigation.getParam("focusing");
    const caption = navigation.getParam("caption");
    const avatar = navigation.getParam("avatar");
    const username = navigation.getParam("username");
    const {loading, data, refetch} = useQuery(GET_COMMENTS, {
        variables: { postId}
    });
    const [addComments] = useMutation(ADD_COMMENTS, {
      refetchQueries:()=>[{query:GET_COMMENTS, 
      variables:{ postId} },
      {query:FEED_QUERY}
    ]
    });
    
    const refresh = async() =>{
        try{
          setRefreshing(true);
          await refetch();
          
        }catch (e){
          console.log(e);
        }finally{
          setRefreshing(false);
        }
      };

    
    const handleComment = async()=>{
      if (commentInput.value === undefined) {
        Alert.alert("한 글자는 쓰지?");
      }else{
        setIsLoading(true);
        try {
          const {data:{addComment}} = await addComments({
            variables: {
              postId: postId,
              text: commentInput.value
            }
          });
          if(addComment.id){
            commentInput.setValue("")
            //navigation.navigate("CommentDetail");
          }
      }catch (e) {
        console.log(e);
        Alert.alert("댓글 에러!");
        
      } finally {
        setIsLoading(false);
      }
    }
      
};
    
    return (
      <InfoCon>
        <ScrollView 
          scrollEnabled={true} 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh}/>
        }>
          <CaptionCon>
            <Image 
              style={{height: 30, width: 30, borderRadius:15}}
              source={{uri: avatar}}/>
            <Bold>{username}</Bold>
            <Text>{caption}</Text>
          </CaptionCon>

          <CommentBox>
            <TextBox>
              <TextInput
                onChangeText={commentInput.onChange}
                returnKeyType="send"
                value={commentInput.value}
                onSubmitEditing={handleComment}
                autoFocus={focusing}
                placeholder="Comment"
              />
            </TextBox>
            <Touchable onPress={handleComment}>
              {isLoading ? (
              <Loader/>
            ): (
              <Bold>
              <Text>Reply</Text>
              </Bold>
            )}
            </Touchable>
          </CommentBox>
            {loading ? (
              <Loader/>
            ) : (
              data && data.seeComment && data.seeComment.map(comment=>
              <PostOfComment 
              key={comment.id}{...comment}
              postUser={username}
              />)
            )}
          <KeyboardSpacer/>
        </ScrollView>  
      </InfoCon>
    )
}



