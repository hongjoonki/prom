import React, { useState } from "react";
import { TouchableOpacity, Image, Text } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import constants from "../constants";
import styled from "styled-components";
// import FollowButton from '../FollowButton';
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo-hooks";
import { LightPink, Grey, TINT_COLOR, PointPink, mainPink, LightGrey, Line } from "./Color";

const SEE_USER = gql`
  query seeUser($id: String!) {
    seeUser(id: $id) {
      id
      isFollowing
    }
  }
`;

const FOLLOW = gql`
  mutation follow($id: String!) {
    follow(id: $id)
  }
`;

const UNFOLLOW = gql`
  mutation unfollow($id: String!) {
    unfollow(id: $id)
  }
`;

const FollowButton =styled.TouchableOpacity`
  width: 70px;
  height: 27px;
  background-color: ${props=>props.backgroundColor};
  border-radius: 7px;
  alignItems: center;
  justifyContent: center;
  `;

const Container = styled.View`
  flex-direction: row;
  margin-bottom : 5px;
  height : 55;
  alignItems: center;
  justifyContent: center;
`;
const UserInfo = styled.View`
`;

const Header = styled.View`
  padding: 5px;
  flex-direction: row;
  align-items: center;

`;
const Bold = styled.Text`
  font-weight: 600;
  margin-bottom : 5px;
  font-size : 15px;
`;
const Profile = styled.View`
  margin-right : 5px;
`;
const View = styled.View`
  flex : 1;
`;
const Button = styled.View`
  margin-right : 10px;
  alignItems: center;
  justifyContent: center;

`;



const SameFollowModal = ({ navigation, username, firstName, avatar, id, isSelf, isFollowing }) => {
  const [followingConfirm, setFollowing] = useState(isFollowing);
  const [FollowMutation] = useMutation(FOLLOW, {
    variables: {
    id: id
    }});

  const [UnFollowMutation] = useMutation(UNFOLLOW, {
    variables:{
      id: id
    }
  });


  const handleFollow = async () =>{
    try{
      if(followingConfirm === true) {
        await UnFollowMutation();
        setFollowing(f => !f);
      } else {
        await FollowMutation();
        setFollowing(f => !f);
      }
    } catch (e) {}
  };

  return (
    <Container>
      <TouchableOpacity onPress={() => {
        navigation.navigate("UserDetail", { id, username }) } } >
        <Header>
          <Profile>
          {avatar==null ? 
              <Image
                style={{height: 40, width: 40, borderRadius:15}}
                source={{uri: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAInJR1.img?h=400&w=300&m=6&q=60&o=f&l=f&x=509&y=704"}}
              />
            :
              <Image
                style={{height: 40, width: 40, borderRadius:15}}
                source={{uri: avatar}}
              />
            }
          </Profile>
          <UserInfo>
            <Bold>{ username }</Bold>
            <Text>{ firstName }</Text>
          </UserInfo>
        </Header>
      </TouchableOpacity>
      <View/>
      <Button>
        <FollowButton onPress={handleFollow} backgroundColor={followingConfirm ? LightGrey :mainPink }>
          <Text style={{color:"black"}}>Following</Text>
        </FollowButton>
      </Button>
    </Container>
  );
};

SameFollowModal.propTypes = {
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  avatar: PropTypes.string,
  isSelf: PropTypes.bool,
  isFollowing: PropTypes.bool,

};

export default withNavigation(SameFollowModal);