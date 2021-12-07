import React from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import styled from 'styled-components';
import { createBottomTabNavigator } from "react-navigation-tabs"
import { createStackNavigator } from 'react-navigation-stack';
import Home from "../screens/Tabs/Home";
import Search from "../screens/Tabs/Search";
import MyPick from "../screens/Tabs/MyPick/MyPick";
import Profile from "../screens/Tabs/Profile/Profile";
import Detail from "../screens/Detail";
import MessagesLink from "../components/MessageComponents/MessagesLink";
import SettingLink from "../components/SettingLink";
import NavIcon from "../components/NavIcons";
import AlarmsLink from "../components/AlarmsLink";
import { stackStyles, HomestackStyles, SearchstackStyles } from "./config";
import CommentDetail from "../screens/CommentDetail";
import EditProfile from '../screens/EditProfile';
import Users from '../screens/ViewUserLIst/Users';
import ProfilePicture from '../screens/ProfilePicture';
import UpdatePost from '../screens/UpdatePost';
import styles from "../styles";
import UserDetail from "../screens/UserDetail";
import StoreDetail from "../screens/StoreDetail";
import { PointPink, TINT_COLOR, Grey, mainPink } from "../components/Color";
import MapContainer from '../screens/Map/MapContainer';
import { white } from "ansi-colors";
import { AntDesign } from "@expo/vector-icons";

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator({
    InitialRoute: {
      screen: initialRoute,
      navigationOptions: { ...customConfig }
    },
    Detail: {
      screen: Detail,
      navigationOptions: {
        title: "Photo",
        headerTitle: (
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={{ fontSize: 30, color: TINT_COLOR, fontWeight: "200" }}>
              Post
          </Text>
          </View>
        )
      }
    },

    CommentDetail: {
      screen: CommentDetail,
      navigationOptions: ({ navigation }) => ({
        title: "댓 글"
      })
    },

    EditProfile: {
      screen: EditProfile,
      navigationOptions: ({ navigation }) => ({
        title: "프로필 수정"
      })
    },

    Users: {
      screen: Users,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam("username")
      })
    },
    ProfilePicture: {
      screen: ProfilePicture,
      navigationOptions: ({ navigation }) => ({
        title: "프로필 사진 변경"
      })
    },
    UpdatePost: {
      screen: UpdatePost,
      navigationOptions: ({ navigation }) => ({
        title: "포스트 수정"
      })
    },

    UserDetail: {
      screen: UserDetail,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam("username")
      })
    },

    StoreDetail: {
      screen: StoreDetail,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam("storeName")
      })
    }
  },
    {
      defaultNavigationOptions: {
        headerBackTitle: null,
        headerTintColor: styles.blackColor,
        //headerStyle: { ...stackStyles }
      }
    });

const HeaderRight = styled.View`
flex-direction : row;
  alignItems: center;
  justifyContent: center;
  marginTop : 10;
`;
const ConfigHeader = styled.View`
flex-direction : row;
  alignItems: center;
  justifyContent: center;
`;
const Title = styled.Text`
fontFamily : 'korElli';
fontSize : 40 ;
color : ${mainPink};
`;

/* 탭 내비게이션 메뉴 설정 */
export default createBottomTabNavigator({

  Home: {
    screen: stackFactory(Home, {
      // title: "Ellicious",
      headerRight: (
        <HeaderRight>
          <MessagesLink />
          <AlarmsLink />
        </HeaderRight>
      ),
      headerLeft: (
        <View style={{ alignItems: "flex-start", flex: 1, padding: 5, marginLeft: 5, marginTop: 10 }}>
          <Title>
            Ellicious
            </Title>
        </View>
      ),
      headerStyle: HomestackStyles
    }),
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <AntDesign
          focused={focused}
          color={focused ? mainPink : Grey}
          name={Platform.OS === "ios" ? "home" : "home"}
          size={27}
        />
      )
    }
  },

  Search: {
    screen: stackFactory(Search, {
      headerBackTitle: null,
      headerStyle: SearchstackStyles
    }),
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <AntDesign
          size={27}
          color={focused ? mainPink : Grey}
          focused={focused}
          name={Platform.OS === "ios" ? "search1" : "search1"}
        />
      )
    }
  },

  Add: {
    screen: View,
    headerStyle: stackStyles,
    navigationOptions: {
      tabBarOnPress: ({ navigation }) => navigation.navigate("PhotoNavigation"),
      tabBarIcon: ({ focused }) => (
        <AntDesign
          color={focused ? mainPink : Grey}
          focused={focused}
          size={28}
          name={Platform.OS === "ios" ? "pluscircleo" : "pluscircleo"}
        />
      )
    }
  },

  Profile: {
    screen: stackFactory(Profile, {
      headerStyle: stackStyles,
      title: "프로필",
      headerRight: (
        <ConfigHeader>
          <SettingLink />
        </ConfigHeader>
      ),
      headerTitle: (
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ fontSize: 30, color: mainPink, fontWeight: "200" }}>
            Profile
          </Text>
        </View>
      )
    }),
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <AntDesign
          size={28}
          color={focused ? mainPink : Grey}
          focused={focused}
          name={Platform.OS === "ios" ? "user" : "user"}
        />
      )
    }
  },

  MyPick: {
    screen: stackFactory(MyPick, {
      headerStyle: stackStyles,
      title: "MyPick",
      headerTitle: (
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ fontSize: 30, color: mainPink, fontWeight: "200" }}>
            MyPick
          </Text>
        </View>
      )
    }),
    navigationOptions: {
      tabBarIcon: ({ focused }) => (
        <AntDesign
          focused={focused}
          color={focused ? mainPink : Grey}
          name={
            Platform.OS === "ios"
              ? focused
                ? "pushpin"
                : "pushpino"
              : focused
                ? "pushpin"
                : "pushpino"
          }
          size={27}
        />
      )
    }
  },
},
  {
    tabBarOptions: {
      showLabel: false,
      style: {
        height: 50,
        //backgroundColor : mainPink
        //height : 50
        height: 50
      }
    }
  }
);
