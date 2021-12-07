import React, { useState, useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import { useQuery } from "react-apollo-hooks";
import {MaterialCommunityIcons} from "@expo/vector-icons"
import { PointPink, mainPink, TINT_COLOR, LightGrey } from "./Color";
import {ALARM} from "../screens/Alarm/Alarms";

const Container = styled.TouchableOpacity``;
const Text = styled.Text`
color : white;
`;
const View =styled.View`
  margin-left : 10px;
  margin-right : 8px;
  margin-top : 1px;
`;
const BG = styled.View`
justify-content: center;
align-items: center;
`;

const AlarmsLink = ({ navigation }) => {
  const {loading, data, refetch} = useQuery(ALARM)
  const [newAl, setNewAl] = useState(0);

  useEffect(() => {
    if(data) {
      setNewAl(data.getAlarm.filter(data => data.check == false).length)
    }
  }, [data]);

  return (
    <Container onPress={() => navigation.navigate("AlarmNavigation")}>
    <View>
      <BG style={styles.CircleShapeView}>
      <MaterialCommunityIcons
        color={TINT_COLOR}
        size={24}
        name={"bell-ring-outline"}
      />
      </BG>
      {newAl ===0 ? null : (
      <BG style={styles.Text}>
        <Text >{newAl}</Text>
      </BG>
      )}
    </View>
  </Container>
  )
};

const styles = StyleSheet.create({
 
  CircleShapeView: {
    width: 38,
    height: 38,
    borderRadius: 34/2,
    backgroundColor: LightGrey
},
Text : {
  width: 16,
  height: 16,
  borderRadius: 7,
  backgroundColor: "#f53b3b",
  position: 'absolute',
}
 
});

export default withNavigation(AlarmsLink);