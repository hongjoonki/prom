import React from 'react';
import {Text, View} from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator} from "react-navigation-tabs"
import Followers from "../screens/ViewUserLIst/Followers";
import Following from "../screens/ViewUserLIst/Following";
import { UserstackStyles } from "./config";
import { PointPink, TINT_COLOR, mainPink } from "../components/Color";
import styled from 'styled-components';

const UsersTabs = createMaterialTopTabNavigator(
    {
        Following:{
            screen: Following,
            navigationOptions:{
                tabBarLabel: "팔로잉",
            }
        },
        Followers:{
            screen: Followers,
            navigationOptions:{
                tabBarLabel:"팔로우"
            }
        }
    },
    {
        tabBarPosition: "bottom",
        tabBarOptions: {
          indicatorStyle:{
            backgroundColor: PointPink,
            marginBottom:65
          },
          labelStyle:{
            color: PointPink,
            fontWeight:"600"
          },
          style:{
            paddingBottom:20,
            ...UserstackStyles
          }
        }
      }
);

export default createStackNavigator({
    Tabs: {
        screen: UsersTabs,
        navigationOptions: ({navigation})=>({
            title: navigation.getParam("username"),
            /*headerBackTitle: true ,
            
            headerTitle : (
                <View style = {{ justifyContent : 'center',alignItems : "center", flex : 1, padding : 5,  marginLeft : 5}}>
                <Text style = {{ fontSize : 25 , color : TINT_COLOR, fontWeight : "200"}}>
                    사 진
                </Text>
                </View>
            )*/
        }) 
        }
    },
    {
        defaultNavigationOptions:{
            headerStyle:{
              ...UserstackStyles
            },
            headerTintColor:TINT_COLOR,
          }
    }
)