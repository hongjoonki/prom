import React from "react";
import { TouchableOpacity, Image, Text, Button } from "react-native";
import PropTypes from "prop-types";
import constants from "../../constants";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import FollowButton from '../FollowButton';
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import Loader from "../Loader";
import { Entypo } from "@expo/vector-icons";
import { NewMsg } from "../Color";

const Container = styled.View`
  flex : 1;
  flex-direction: row;
`;
const UserInfo = styled.View`
margin-Left : 10px;
`;

const Header = styled.View`
  padding: 5px;
  flex-direction: row;
  align-items: center;
  width : ${constants.width}
  
`;
const Bold = styled.Text`
  font-weight: 600;
  margin-bottom : 5px;
  font-size : 15px;
`;
const Profile = styled.View`

  flex-direction: row;
  alignItems: center;
 justifyContent: center;
`;
const State = styled.View`
alignItems: flex-end;

`;
const View = styled.View`
flex : 1;
`;

const MessageRooms = ({ id, participants, navigation }) => {
  return (
    <Container>
      {participants[0].isSelf ? (
        <TouchableOpacity onPress={() => {
          navigation.navigate("MessageDetail", {
            username: participants[1].username,
            userId: participants[1].id,
            roomId: id
          })
        }} >
          <Header>
            <Profile>
              {participants[1].avatar == null ?
                <Image
                  style={{ height: 40, width: 40, borderRadius: 20 }}
                  source={{ uri: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAInJR1.img?h=400&w=300&m=6&q=60&o=f&l=f&x=509&y=704" }}
                />
                :
                <Image
                  style={{ height: 40, width: 40, borderRadius: 20 }}
                  source={{ uri: participants[1].avatar }}
                />
              }
            </Profile>
            <UserInfo>
              <Bold>{participants[1].username}</Bold>
            </UserInfo>
            <View />
            <State>
              <Entypo
                name={'dot-single'}
                color={NewMsg}
                size={30}
              />
            </State>
          </Header>
        </TouchableOpacity>
      ) : (
          <TouchableOpacity onPress={() => {
            navigation.navigate("MessageDetail", {
              username: participants[0].username,
              userId: participants[0].id,
              roomId: id
            })
          }} >
            <Header>
              <Profile>
                {participants[0].avatar == null ?
                  <Image
                    style={{ height: 40, width: 40, borderRadius: 20 }}
                    source={{ uri: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAInJR1.img?h=400&w=300&m=6&q=60&o=f&l=f&x=509&y=704" }}
                  />
                  :
                  <Image
                    style={{ height: 40, width: 40, borderRadius: 20 }}
                    source={{ uri: participants[0].avatar }}
                  />
                }
                <UserInfo>
                  <Bold>{participants[0].username}</Bold>
                </UserInfo>
              </Profile>
              <View />
              <State>
                <Entypo
                  name={'dot-single'}
                  color={NewMsg}
                  size={30}
                />
              </State>
            </Header>
          </TouchableOpacity>
        )}
    </Container>
  );
}

MessageRooms.propTypes = {
  id: PropTypes.string.isRequired,
  participants: PropTypes.array
};

export default withNavigation(MessageRooms);


/**
 * 
 * 
 * <Text>{ participants[1].firstName }</Text>
 */