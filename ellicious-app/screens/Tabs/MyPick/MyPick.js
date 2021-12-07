import React, { useState, useEffect } from "react";
import { gql } from "apollo-boost";
//import {NavigationEvents} from 'react-navigation';
import { useQuery } from "react-apollo-hooks";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";
// import MapViewPick from '../../../components/MapView/MapViewPick';
import Loader from "../../../components/Loader";
import { PICK_FRAGMENT } from '../../../fragments';
import MyPickPresenter from './MyPickPresenter';
import { FontAwesome, EvilIcons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { TINT_COLOR, IconColor, PointPink, StarColor, BG_COLOR, mainPink} from '../../../components/Color';

const styles = StyleSheet.create({
  container: {
    flex: 10,
  },
  refreshbt: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 48
},
  button: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(120,3,150, 0.9)",
  },
})

const region = {
  latitude: 37.6247855,
  longitude: 127.0773206,
  latitudeDelta: 0.047864195044303443,
  longitudeDelta: 0.0540142817690068,
};

export const GET_PICK = gql`
  {
    seePick {
        ...PickInfo
    }
  } ${PICK_FRAGMENT}
`;

const MyPick = ({ navigation }) => {
  const { loading, data, refetch } = useQuery(GET_PICK);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async() =>{
    try{
      setRefreshing(true);
      await refetch();
      
    }catch (e){
      console.log(e);
    }finally{
      setRefreshing(false);
    }
  };
  
  


  return (
    <View style={styles.container}>
      

      {refreshing || loading ? <Loader /> : <MyPickPresenter navigation={navigation} marker={data.seePick} region={region}>
        
        </MyPickPresenter>}
        <View
                    style={{
                        position: 'absolute',//use absolute position to show button on top of the map
                        top: '95%', //for center align
                        alignSelf: 'center' //for align to right
                    }}
                >
                    <TouchableOpacity onPress={refresh}>
                      {refreshing ? null: (
                        <FontAwesome name={"refresh"} color={mainPink} size={30}/>
                      )}
                    </TouchableOpacity>
                </View>
                
    </View>
  )
}



export default MyPick;