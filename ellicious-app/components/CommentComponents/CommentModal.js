import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View, TextInput, Alert } from "react-native";
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import styled from "styled-components";
import moment from "moment";
import { CHILD_COMMENT } from "../../fragments";
import { EvilIcons } from "@expo/vector-icons";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { FEED_QUERY } from "../Post";
import Loader from '../../components/Loader';
import { useQuery } from "react-apollo-hooks";
import CommentInput from './CommentInput';


const Container = styled.View`

`;

const CaptionCon = styled.View`
  flex-direction: row; 
  alignItems: center;
  margin-left : 15px;
  margin-top : 5px;
`;

const Caption = styled.Text`
`;




const CommentCount = styled.Text`
  opacity: 0.5;
  font-size: 13px;
`;

const Bold = styled.Text`
  font-weight: 600;
  margin-bottom : 5px;
  font-size : 15px;
  margin-right : 5px;
`;

const Timebox = styled.Text`
  opacity: 0.5;
  font-size: 10px;
  justifyContent : flex-end;
`;

const DELETE_COMMENT = gql`
  mutation editComment($id: String!) {
    editComment(id: $id, action: DELETE){
      id
    }
  }
`;

const GET_CHILD_COMMENTS = gql`
    query seeChildComment($headComment: String){
      seeChildComment(headComment: $headComment){
            ...ChildCommentParts
        }
    }
    ${CHILD_COMMENT}
`;



const CommentModal = ({
  id
}) => {
  const {loading, data, refetch} = useQuery(GET_CHILD_COMMENTS, {
    variables: { headComment: id}
});
  // const [deleteComment] = useMutation(DELETE_COMMENT, {
  //   refetchQueries: () => [
  //     {
  //       query: GET_COMMENTS, variables: {
  //         postId: post.id, headComment: null
  //       }
  //     },
  //     { query: FEED_QUERY }
  //   ]
  // });

  const handleDelete = async () => {
  //   try {
  //     const { data: { editComment } } = await deleteComment({
  //       variables: {
  //         id: id
  //       }
  //     });
  //     if (editComment.id) {
  //       navigation.navigate("CommentDetail")
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     Alert.alert("삭제 에러!");

  //   }
  }

  return (
    <Container>
      {loading ? (<Loader/>) : (data&&data.seeChildComment.map(item=><CommentInput key={item.id}{...item}/>))}
    </Container>
  )
}


CommentModal.propTypes = {
  id: PropTypes.string.isRequired
}

export default CommentModal;
