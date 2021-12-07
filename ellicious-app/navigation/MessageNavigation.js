import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Messages from "../screens/Messages/Messages";
import MessageRoom from "../screens/Messages/MessageRoom";
import MessageDetail from "../screens/Messages/MessageDetail";
import { View, Text, TouchableOpacity } from 'react-native'
import { PointPink, TINT_COLOR } from "../components/Color";
import { Icon } from "native-base";

export default createStackNavigator({
  Messages: {
    screen: Messages,
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: null,
      headerTitle: (
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ fontSize: 30, color: TINT_COLOR, fontWeight: "200" }}>
            Message
          </Text>
        </View>
      ),
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text>뒤로</Text>
        </TouchableOpacity>
      )
    })
  },
  MessageDetail,
  MessageRoom
});