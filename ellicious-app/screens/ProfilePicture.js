import React,{useState, useEffect} from "react";
import {Image,ScrollView,TouchableOpacity} from 'react-native';
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import styled from "styled-components";
import Loader from "../components/Loader";
import constants from "../constants";
import { mainPink, TINT_COLOR, IconColor, LightGrey } from "../components/Color";
import axios from 'axios';
import { FEED_QUERY } from "../screens/Tabs/Home";
import {ME} from '../screens/Tabs/Profile/Profile';

const View = styled.View`
  flex: 1;
`;
const Button = styled.TouchableOpacity`
  right: 5px;
  top: 15px;
  justify-content: center;
  align-items: center;
  position: absolute;
  margin-right : 15px;  
`;


const Text = styled.Text`
  color: ${TINT_COLOR};
  font-weight: 600;
  `;


export default ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [selected, setSelected] = useState([]);
  const [allPhotos, setAllPhotos] = useState();

  const id = navigation.getParam("id");
  const username =  navigation.getParam("username");
  const avatar =  navigation.getParam("avatar");
  const category =  navigation.getParam("category");
  const categoryCount =  navigation.getParam("categoryCount");
  const bio =  navigation.getParam("bio");
  const email = navigation.getParam("email");

  const changeSelected = (photo) => {
    setSelected(photo);
    //console.log(selected);
  };
  const getPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        sortBy:[[MediaLibrary.SortBy.creationTime, false]],
        first:2000
      });
      
      const [firstPhoto] = assets;
      
      setSelected(firstPhoto);
      setAllPhotos(assets);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };


  const askPermission = async()=>{
    try{
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if(status === "granted"){
        setHasPermission(true);
        getPhotos();
      }
    } catch(e){
      console.log(e);
      hasPermission(false);
    }
  };

  const handleSelected = async() => {
    const formData = new FormData();
    const name = selected.filename;
    const [, type] = name.split(".");
    formData.append("file", {
      name,
      type: "image/jpeg",
      uri: selected.uri
    });

    try {
        setLoading(true);
        const {
          data: {temp}
        } = await axios.post("http://192.168.0.135:4000/api/upload", formData, {
          headers:{
            "content-type" : "multipart/form-data"
          }
        });
        navigation.navigate("EditProfile", {id, username, avatar: temp[0], bio, email})
      } catch (e) {
        console.log(e)
      } finally{
        setLoading(false);
      }
  };

  useEffect(()=>{
    askPermission();
  },[]);
return(
  <View>
      {loading ? (
        <Loader />
      ) : (
        <View>
          {hasPermission ? (
            <>
            <Image
                  style={{ width: constants.width, height: constants.height / 2 }}
                  source={{ uri: selected.uri }}
                />
              <Button onPress={() => handleSelected()}>
                <AntDesign
                  color={IconColor}
                  size={35}
                  name={"rightcircle"}
                  backgroundColor={LightGrey}
                />
              </Button>
                <ScrollView
                  contentContainerStyle={{
                    flexDirection: "row",
                    flexWrap: "wrap"
                  }}
                >
                  {allPhotos.map(photo => (
                    <TouchableOpacity
                      key={photo.id}
                      onPress={() => changeSelected(photo)}
                    >
                      <Image
                        source={{ uri: photo.uri }}
                        style={{
                          width: constants.width / 4,
                          height: constants.height / 8,
                          opacity: photo.id === selected.id ? 0.5 : 1
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
            </>
          ) : null}
        </View>
      )}
    </View>
  );
};