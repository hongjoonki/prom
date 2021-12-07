import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ScrollView, Button, Text, RefreshControl, Alert, TouchableOpacity, Image } from "react-native";
import { gql } from "apollo-boost";
// import { USER_FRAGMENT } from "../../fragments";
import Loader from "../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import { mainPink, Yellow, LightGrey } from "../../components/Color";
import firebase from 'firebase';
import User from '../../User'
import { SafeAreaView } from "react-navigation";
import { FlatList } from "react-native-gesture-handler";
import { SortBy } from "expo-media-library";
const Container = styled.View`
flex : 1;
`;
const MsgRoom = styled.View`
flex-direction : row;
`;
const ImgCon=styled.View`
margin-right : 5px;
`;
const View=styled.View`
flex : 1;
`;

const ViewHi = styled.View`
justify-content: space-between;

`;
const ViewTime = styled.View``;
const Name=styled.Text`
font-weight : 600;
`;
const Read=styled.View`
width: 10;
height: 10;
borderRadius : 5;
background-color : ${Yellow}
`;

const ReadCon = styled.View`
align-items: center;
justify-content: center;

flex : 1;

`;
export default class Messages extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Message"
    }
  } 
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      chatting: [],
      dbRef : firebase.database().ref('users/' + User.userId + '/friends')
    }
    //console.log(this.state.meName)
  }

  componentWillUnmount(){
    this.state._isMounted = false;
  }

  componentDidMount() {
    this.state._isMounted = true;
    this.state.dbRef.orderByChild('recentTime').on("value", (val) => {
      let people = [];
      val.forEach((item) => {
        people.push(item.val())
      })

      //people.userId = val.key;
      if(this.state._isMounted === true){
        this.setState((prevState) => {
          return {
            chatting: people
          }
        })
      }
    })
  }
  // checkRead=(userId)=>{
  //     firebase.database().ref('users/' + User.userId + '/friends/' + userId).update({isRead:true});
  // }
  convertTime = (time) => {
    let now = new Date();
    let d = new Date(time);
    let result;
    if(now.getDay()===d.getDay()){
      result = "오늘 ";
    }else if(now.getDay()-d.getDay()===1){
      result = "어제 "
    }else{
      result = (d.getMonth()+1)+"월 "+(d.getDate())+"일 "
    }
    result += (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    return result;
  }
  // test() {
  //   let dbRef = firebase.database().ref('users').orderByChild('friends');
  //   dbRef.on("value", (val) => {

  //     val.forEach((item) => {
  //       if(item.val().ID === "yong_ari"){
  //         console.log(item.val());
  //       }
  //     })
  //     //   let test = firebase.database().ref('messages/' + User.userId).child(item.key).limitToLast(1);
  //     //   test.on("child_added", (value) => {

  //     //   })
  //     })
  //   }


  renderRow = ({ item }) => {

    return (
      <TouchableOpacity style={{ padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1 }}
        onPress={() => this.props.navigation.navigate('MessageDetail', { userId: item.userId, username: item.ID })}>
        
        {item.isRead ?
        <>
          <MsgRoom>
            <ImgCon>
              <Image
                source={{ uri: "https://img.insight.co.kr/static/2019/02/12/700/5k2hz1lne71377ta76gs.jpg" }}
                style={{ width: 40, height:40, borderRadius:20 }}
              />
           </ImgCon>

            <ViewHi>
              <Name style={{ fontSize: 15}}>{item.ID}</Name>
              <Text style={{ fontSize: 13 }}>{item.recentMessage}</Text>
            </ViewHi>

            <View/>

            <ViewTime>
              <Text style={{ fontSize: 10 }}>{this.convertTime(item.recentTime)}</Text>
            </ViewTime>

          </MsgRoom>
        </>
          :
          <>
            <MsgRoom>
            <ImgCon>
              <Image
                source={{ uri: "https://img.insight.co.kr/static/2019/02/12/700/5k2hz1lne71377ta76gs.jpg" }}
                style={{ width: 40, height:40, borderRadius:20 }}
              />
           </ImgCon>

            <ViewHi>
              <Name style={{ fontSize: 15}}>{item.ID}</Name>
              <Text style={{ fontSize: 13 }}>{item.recentMessage}</Text>
            </ViewHi>

            <View/>

            <ViewTime>
              <Text style={{ fontSize: 10 }}>{this.convertTime(item.recentTime)}</Text>
              <ReadCon>
                <Read/>
              </ReadCon>
            </ViewTime>
            </MsgRoom>
          </>
        }

        



      </TouchableOpacity>
    )
  }


  render() {
    return (
      <Container>
      <SafeAreaView>
        <FlatList
          inverted
          data={this.state.chatting}
          renderItem={this.renderRow}
          keyExtractor={(item) => item.userId}
        />
        
      </SafeAreaView >
       
        <Button title="대화상대 추가" onPress={() => this.props.navigation.navigate("MessageRoom")}></Button>
        
      </Container>
    )
  }
  // const dbRef = firebase.database().ref('users/'+User.userId+'friends')
  // dbRef.on('child_added', (val) => {
  //   console.log(val)
  // })
  // console.log(User.username)

  // const [refreshing, setRefreshing] = useState(false);


  //   const refresh = async () => {
  //     try {
  //       setRefreshing(true);
  //       await refetch();

  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setRefreshing(false);
  //     }
  //   };

  //   return (
  //     <ScrollView>

  //         <View>

  //           <Button title="대화상대 추가" onPress={() => navigation.navigate("MessageRoom")}></Button>
  //         </View>
  //     </ScrollView>
  //   );


  //this.props.navigation.navigate("MessageRoom")}>

};