import React, { useState} from "react";
import { Image, TouchableOpacity, ScrollView, StyleSheet} from "react-native";
import Modal from 'react-native-modalbox';
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../constants";
import SquarePhoto from "./SquarePhoto";
import { LightPink, Grey, TINT_COLOR, PointPink, mainPink, LightGrey, Line } from "./Color";
import {Foundation } from "@expo/vector-icons";
import TopBarNav from 'top-bar-nav';
import ProfileMapContainer from "../screens/Tabs/Profile/ProfileMapContainer";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";
import SameFollowModal from "./SameFollowModal";

export const FOLLOW = gql`
  mutation follow($id: String!) {
    follow(id: $id)
  }
`;

export const UNFOLLOW = gql`
  mutation unfollow($id: String!) {
    unfollow(id: $id)
  }
`;

const Container = styled.View`
  flex : 1;
  height : ${constants.height-100};
`;
const Profile = styled.View`
  padding : 5px;
`;

const Top = styled.View`
  flex-direction: row;  
  alignItems: flex-end;
`;
const View=styled.View`
flex : 1;

`;

const ViewCon=styled.View`
justifyContent: center;
alignItems : center;
alignItems:flex-start;

`;

const ViewBox=styled.View`
height : 30;
`;
const ProfileImage = styled.View`
  margin-left : 10px;
`;

const FollowButton =styled.TouchableOpacity`
  width: 70px;
  height: 27px;
  background-color: ${props=>props.backgroundColor};
  border-radius: 7px;
  alignItems: center;
  justifyContent: center;
  `;

const NameCon = styled.View`
  flex : 1;
  alignItems: center;
  justifyContent: center;

`;
const NameBox = styled.View`
  flex-direction: row;
  alignItems: center;
  justifyContent: center;
  height : 40px;
`;
const EditCon = styled.View`
margin-vertical : 3px;
`;
const FollowCon = styled.View`
  alignItems: flex-end;
  margin-right : 5px;
  justifyContent: flex-end;
  flex-direction: row;
  flex : 1;
`;

const FollowCon1 = styled.TouchableOpacity`
  
  flex-direction: row;
`;

const Bold = styled.Text`
  font-weight: 600;
  font-size : 15;
  color : ${TINT_COLOR}
`;
const BoldName = styled.Text`
  font-weight: 300;
  font-size : 30;
  margin-left : 5px;
  color : ${TINT_COLOR}
`;

const Text = styled.Text`
  color : ${Grey}
`;
const TopButton = styled.Text`
  font-weight: 300;
  font-size : 20;
  color : ${mainPink}
`;
const FollowPick = styled.View`
  flex-direction: row;
  alignItems: center;
  justifyContent: center;
  margin-left : 5px;
`;
const BlankPost = styled.View`
  alignItems: center;
  justifyContent: center;
`;
const PostNum = styled.View`
  flex-direction: row;
  alignItems: center;
  justifyContent: center;
  margin-left : 5px;
`;

const Con = styled.View`
flex-direction : column
flex : 1;
`;

const SameCon = styled.TouchableOpacity`
flex-direction : row;
padding:4px;
`;
const BioCon = styled.View`
flex-direction : row;
`;
const Blank = styled.View`
flex : 1;
`;

const TapCon = styled.View`
flex : 1;
`;

const ModalHeader=styled.View`
background-color : ${LightPink}
height : 40px;
justifyContent: center;
alignItems: center;
`;

const Scene = ({ index, posts, userId }) => (
  
    <>
      {(index == 1) ? (
        <View style={{flex : 1}} >
        <ProfileMapContainer userId={userId}/>
        </View>
      ) : (   
      
        <View style={{flex : 1}} >
          {posts[0] === undefined ? (
            <BlankPost>
              <Text style={{ color:mainPink}}>게시물을 등록해주세요</Text>
            </BlankPost>
          ) : (
          <ViewCon>  
            <View flexDirection= "row" flexWrap= "wrap">
              {posts && posts.map(p =>
                <SquarePhoto key={p.id} {...p} />)
              }
            </View>
          </ViewCon>
          )
        }
        </View>
      )}
    </>
    
);

const ROUTES = {
  Scene
};

const ROUTESTACK = [
  { text: <TopButton>게시물</TopButton>, title: 'Scene' }, 
  { text: <TopButton>맛지도</TopButton>, title: 'Scene' }, 
];

const Style = StyleSheet.create ({
  underlineStyle: {
    height: 3.6,
    backgroundColor: mainPink,
    width: constants.width / 2
  }
})


const UserProfile = ({
  id,
  avatar,
  username,
  fullName,
  category,
  firstName,
  lastName,
  email,
  navigation,
  isSelf,
  isFollowing,
  followersCount,
  followingCount,
  postsCount,
  categoryCount,
  followers,
  following,
  bio,
  posts
}) => {
  const [isGrid, setIsGrid] = useState(true);
  const toggleGrid = () => setIsGrid(i => !i);
  const [modalstate, setModalstate] = useState(false);
  const [bottomModalAndTitle, setbottomModalAndTitle] = useState(false);
  const [followingConfirm, setFollowing] = useState(isFollowing);
  const [followCount, setFollowCount] = useState(followersCount);
  const sametimeFollow = followers.filter(name=> name.isFollowing !== false && name.isSelf !== true)
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
      setFollowing(f => !f);
      await UnFollowMutation();
      setFollowCount(l=>l-1)
    } else {
      setFollowing(f => !f);
      await FollowMutation();
      setFollowCount(l=>l+1)
    }
  } catch (e) {}
};

  return (
    <Container>
      
      <ViewBox/>
      <Profile>
        <Top>
          <ProfileImage>
            {avatar==null ? 
              <Image
              style={{height: 90, width: 90, borderRadius:30}}
                source={{uri: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAInJR1.img?h=400&w=300&m=6&q=60&o=f&l=f&x=509&y=704"}}
              />
            :
              <Image
                style={{height: 90, width: 90, borderRadius:30}}
                source={{uri: avatar}}
              />
            }
          </ProfileImage>
          <Con>
          <NameCon>
            <NameBox>
            <View/>
              <BoldName>{username}</BoldName>
              <EditCon>
            {
              isSelf ?
              <TouchableOpacity onPress={()=>navigation.navigate("EditProfile", { id, avatar, lastName, firstName, bio, username, email })}>
              <Foundation
                  color={Grey}
                  size={17}
                  name={"pencil"}
                  />
                  </TouchableOpacity> : <FollowButton onPress={handleFollow} backgroundColor={followingConfirm ? LightGrey :mainPink }>
                  <Text style={followingConfirm ? {color:"black"} : {color:"white"}}>Following</Text>
                </FollowButton>
            }
          </EditCon>
          </NameBox>
          <BioCon>
            <Blank/>
            <Text>{bio}</Text>
          </BioCon>
          {!isSelf ? (
          <SameCon onPress={()=>setModalstate(true)}>
            <Blank/>
            {sametimeFollow[0] ? 
            <Text>{sametimeFollow[0].username+`님 등 ${sametimeFollow.length-1} 명이 팔로우 해요!`}</Text>
            : null
          }
          </SameCon>) : null
          }
          </NameCon>
          <FollowCon>
            <PostNum>
              <Text>게시물 </Text>
              <Bold>{postsCount}</Bold>
            </PostNum>
            <FollowCon1 onPress={()=>navigation.navigate("Users",{id, username})}>
              <FollowPick>
                <Text>Follower </Text>
                <Bold>{followCount}</Bold>
              </FollowPick>
              <FollowPick>
              <Text>Following </Text>
                <Bold>{followingCount}</Bold>
              </FollowPick>
            </FollowCon1>
          </FollowCon>
          </Con>
          
        </Top>
      </Profile>
      

     
      <TopBarNav
          routeStack={ROUTESTACK}
          renderScene={(route, i) => {
            let Component = ROUTES[route.title];
            return <Component index={i} posts={posts} userId={id} style={{justifyContent: 'flex-start'}}/>;
          }}
          headerStyle={{ paddingTop: 20 }}
          inactiveOpacity={1}
          fadeLabels={true}
          underlineStyle={Style.underlineStyle}
          
        />
        
        <Modal 
          onClosed={()=>setModalstate(false)}
          isOpen={modalstate}
          position='bottom'
          coverScreen={true}
          style={{borderTop: 10,height : 500}}
          backdrop={true}
          swipeToClose={false}
        >
          <ModalHeader>
            <Text style={{fontSize : 19}}>함께 아는 친구</Text>
          </ModalHeader>
          <ScrollView>
           {sametimeFollow.map(user=><SameFollowModal key={user.id} {...user}/>)}
          </ScrollView>
          <TapCon/>
        </Modal>
    </Container>
  )
};

UserProfile.propTypes = {
      id: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      username: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      fullName: PropTypes.string.isRequired,
      isSelf: PropTypes.bool.isRequired,
      bio: PropTypes.string,
      postsCount: PropTypes.number.isRequired,
      followersCount: PropTypes.number.isRequired,
      followingCount: PropTypes.number.isRequired,
      categoryCount: PropTypes.number.isRequired,
      isFollowing: PropTypes.bool.isRequired,
      followers:PropTypes.arrayOf(
        PropTypes.shape({
          username:PropTypes.string.isRequired,
          avatar:PropTypes.string,
          isFollowing:PropTypes.bool.isRequired,
        })
      ),
      following:PropTypes.arrayOf(
        PropTypes.shape({
          username:PropTypes.string.isRequired,
          avatar:PropTypes.string,
          isFollowing:PropTypes.bool.isRequired,
        })
      ),
      posts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            likeCount: PropTypes.number.isRequired,
            pickCount: PropTypes.number.isRequired,
            commentCount: PropTypes.number.isRequired,
            files: PropTypes.arrayOf(
              PropTypes.shape({
                id: PropTypes.string.isRequired,
                url: PropTypes.string.isRequired
              })
            ).isRequired
        })
      ),
    category: PropTypes.arrayOf(
      PropTypes.shape({
      id: PropTypes.string,
      categoryName: PropTypes.string,
    })
    )

};

export default withNavigation(UserProfile);