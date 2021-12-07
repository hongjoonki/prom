import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View, TextInput, Alert } from "react-native";
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import styled from "styled-components";
import moment from "moment";
import { EvilIcons } from "@expo/vector-icons";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { FEED_QUERY } from "../Post";
import { CHILD_COMMENT } from "../../fragments";
import PopUpModal from '../../components/PopUpModal';

const Touchable = styled.TouchableOpacity``;

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

const DELETE_CHILD_COMMENT = gql`
  mutation editChildComment($id: String!) {
    editChildComment(id: $id, action: DELETE){
      id
    }
  }
`;

const GET_CHILD_COMMENTS = gql`
    query seeChildComment($headComment: String!){
      seeChildComment(headComment: $headComment){
            ...ChildCommentParts
        }
    }
    ${CHILD_COMMENT}
`;

const CommentInput = ({
  id,
  user,
  handleDelete,
  display,
  headComment,
  post,
  text,
  isLiked,
  likeCount,
  createdAt,
  navigation
}) => {
  const time = moment(createdAt).startOf('hour').fromNow();
  const [popup, setPopup] = useState(false);

  const handleModal = async()=>{
    await setPopup(!popup)
  }

  const handleDeleteChild = async(childId)=>{
    await handleDelete(childId)
  }

  return (
    <Container>
      <CaptionCon>
        <Touchable>
          <Image
            style={{ height: 25, width: 25, borderRadius: 15 }}
            source={{ uri: user.avatar }}
          />
        </Touchable>
        <Touchable>
          <Bold>{user.username}</Bold>
        </Touchable>
        <Caption>{text}</Caption>

        <Timebox>{time}</Timebox>

        {user.isSelf ?
          <Touchable onPress={handleModal}>
            <EvilIcons name={"trash"} size={20} />
          </Touchable> : null}

      </CaptionCon>
      <PopUpModal display={popup} setModal={handleModal} handleDelete={handleDeleteChild} child={id}/>
    </Container>
  )
}


CommentInput.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired
  }).isRequired,
  likeCount: PropTypes.number,
  isLiked: PropTypes.bool,
  text: PropTypes.string.isRequired,
  headComment: PropTypes.shape({
    id: PropTypes.string
  }),
  post: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  createdAt: PropTypes.string.isRequired
}

export default CommentInput;
