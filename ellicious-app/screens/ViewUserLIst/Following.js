import React,{useState} from "react";
import { useQuery,useMutation } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import Loader from "../../components/Loader";
import styled from "styled-components";
import useInput from "../../hooks/useInput";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ScrollView, Text,TextInput,RefreshControl, KeyboardAvoidingView,Alert, TouchableOpacity, StyleSheet  } from "react-native";
import { POST_COMMENT } from "../../fragments";
import PostOfComment from '../../components/CommentComponents/PostOfComment';
import { PointPink, CommentsBox, mainPink, TINT_COLOR, Grey, LightPink } from "../../components/Color";
import {FOLLOWING_FRAGMENT} from '../../fragments';
import SearchAccountBox from "../../components/SearchComponents/SearchAccountBox";

const Container = styled.View`
flex : 1;
padding : 15px;
`;

export const GET_FOLLOWING = gql`
  query seeUser($id: String!){
    seeUser(id: $id) {
      ...FollowingParts
      }
    }
    ${FOLLOWING_FRAGMENT}
`;

const Following=({navigation , userId}) => {

    const [refreshing, setRefreshing] = useState(false);
    const { loading, data, refetch } = useQuery(GET_FOLLOWING, {
        variables: {id: userId},
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
    
    return(
        <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh}/>
        }>
      {loading ? (
        <Loader />
      ) : (
          data && data.seeUser && data.seeUser.following.map(user =>
          <SearchAccountBox key={user.id} {...user}/>
      ))}
    </ScrollView>
    )
};

export default Following;