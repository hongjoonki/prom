import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs"
import SelectPhoto from "../screens/Photo/SelectPhoto";
import TakePhoto from "../screens/Photo/TakePhoto";
import MapContainer from '../screens/Map/MapContainer';
import UploadPhoto from "../screens/Photo/UploadPhoto";
import { PhotostackStyles } from "./config";
import { PointPink, TINT_COLOR, mainPink } from "../components/Color";
import styled from 'styled-components';

const HeaderRight = styled.TouchableOpacity`
margin-right : 8px;
`;

const PhotoTabs = createMaterialTopTabNavigator(
  {
    Take: {
      screen: TakePhoto,
      navigationOptions: {
        tabBarLabel: "Take",

      }
    },
    Select: {
      screen: SelectPhoto,
      navigationOptions: {
        tabBarLabel: "Select"
      }
    }
  },
  {
    tabBarPosition: "bottom",
    tabBarOptions: {
      indicatorStyle: {
        backgroundColor: mainPink,
        marginBottom: 65
      },
      labelStyle: {
        color: mainPink,
        fontWeight: "600"
      },
      style: {
        paddingBottom: 20,
        ...PhotostackStyles
      }
    }
  }
);

export default createStackNavigator({
  Tabs: {
    screen: PhotoTabs,
    navigationOptions: ({navigation}) => ({
      title: "",
      headerBackTitle: null,
      headerTitle: (
        <View style={{ justifyContent: 'center', alignItems: "center", flex: 1, padding: 5, marginLeft: 5 }}>
          <Text style={{ fontSize: 25, color: TINT_COLOR, fontWeight: "200" }}>
            사 진
          </Text>
        </View>
      ),
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text>취소</Text>
        </TouchableOpacity>
      ),
    })
  },
  Upload: {
    screen: UploadPhoto,
    navigationOptions: ({ navigation }) => ({
      title: "",
      headerBackTitle: null,
      headerTitle: (
        <View style={{ justifyContent: 'center', alignItems: "center", flex: 1, padding: 5, marginLeft: 5 }}>
          <Text style={{ fontSize: 22, color: TINT_COLOR, fontWeight: "200" }}>
            게시글
          </Text>
        </View>
      )
    })
  },

Map: {
  screen: MapContainer,
    navigationOptions: {
    title: "",
      headerBackTitle: null,
        headerTitle: (
          <View style={{ justifyContent: 'center', alignItems: "center", flex: 1, padding: 5, marginLeft: 5 }}>
            <Text style={{ fontSize: 22, color: TINT_COLOR, fontWeight: "200" }}>
              방문한 맛집은?
          </Text>
          </View>
        )
  }
}
},
{
  defaultNavigationOptions: {
    headerStyle: {
        ...PhotostackStyles
    },
    headerTintColor: TINT_COLOR,
    }
});