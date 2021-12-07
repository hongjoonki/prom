import React from "react";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import {AntDesign} from "@expo/vector-icons"
import { PointPink, mainPink, TINT_COLOR, LightGrey } from "../Color";
import User from '../../User';
import firebase from 'firebase';
import { AsyncStorage, StyleSheet } from "react-native";

const Container = styled.TouchableOpacity``;
const Text = styled.Text`
color : white;
`;
const View =styled.View``;
const BG = styled.View`
justify-content: center;
align-items: center;


`;


class MessagesLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newMs : 0
    }
    //console.log(this.state.meName)
  }


  componentDidMount=async()=>{
    let id = await AsyncStorage.getItem("userId")
    let people =[]
    if(id){
      let dbRef = firebase.database().ref('users/' + id + '/friends').orderByChild('isRead');
      dbRef.on("value", (val) => {
        val.forEach((item) => {
          if(item.val().isRead === false){
            people.push(item.val())
          }
        })
        this.setState({
            newMs: people.length
      })
      people= []
  })
}
}

  render(){
    return (
      <Container onPress={() => this.props.navigation.navigate("MessageNavigation")}>
    <View>
      <BG style={styles.CircleShapeView}>
        <AntDesign
          color={TINT_COLOR}
          size={22}
          name={"message1"}
        />
      </BG>
      {this.state.newMs !==0 ? (
        <>
        <BG style={styles.Text}>
        <Text>{this.state.newMs}</Text>
        </BG>
        </>
      ) : null}
    </View>
  </Container>
    )
  }
}
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

export default withNavigation(MessagesLink);
