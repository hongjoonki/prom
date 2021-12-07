import React, { useState } from "react";
import { TouchableOpacity, Image, Text } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import constants from "../../constants";
import styled from "styled-components";
import FollowButton from '../FollowButton';
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";

const Container = styled.View`
  flex : 1;
  flex-direction: row;
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


const MessageAccountBox = ({ navigation, username, firstName, avatar, id, isSelf, isFollowing }) => {
  


  return(
    <Container>
        {!isSelf ? 
        isFollowing ?
          (
            <TouchableOpacity onPress={() =>navigation.navigate("MessageDetail",{
              username,
              userId:id,
              avatar,
              firstchatting: true
            }) } >
                <Header>
                <Profile>
                    {avatar==null ? 
                      <Image
                        style={{height: 40, width: 40, borderRadius:20}}
                        source={{uri: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAInJR1.img?h=400&w=300&m=6&q=60&o=f&l=f&x=509&y=704"}}
                      />
                    :
                      <Image
                        style={{height: 40, width: 40, borderRadius:20}}
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
        ) : null
        : null
    }
    </Container>
  )
  };

MessageAccountBox.propTypes = {
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  avatar: PropTypes.string,
  isSelf: PropTypes.bool,
  isFollowing: PropTypes.bool
};

export default withNavigation(MessageAccountBox);