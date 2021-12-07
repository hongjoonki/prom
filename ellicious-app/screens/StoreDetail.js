import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import Loader from "../components/Loader";
import { POST_FRAGMENT } from "../fragments";
import Post from "../components/Post";
import styled from "styled-components";
import {BG_COLOR} from "../components/Color";

export const GET_POST_WITH_PLACE_ID = gql`
  query searchPost($placeId: String!){
    searchPost(term: $placeId) {
        ...PostParts
      }
    }
    ${POST_FRAGMENT}
`;

const Container = styled.View`
background-color : ${BG_COLOR};
padding-left: 2px;
padding-right : 2px;
`;

export default ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const {loading, data, refetch} = useQuery(GET_POST_WITH_PLACE_ID, {
    variables: { placeId: navigation.getParam("placeId") }
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

  if(!loading) {
      console.log(data.searchPost.length)
  }
  return (
    <Container>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh}/>
        }>
        {loading ? (<Loader/>): (data && data.searchPost && data.searchPost.map(post=> <Post key={post.id}{...post} />))}
      </ScrollView>
    </Container>
  );
};