import React,{useState, useEffect} from "react";
import {Image,ScrollView,Alert,TouchableOpacity} from 'react-native';
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import styled from "styled-components";
import Loader from "../../components/Loader";
import constants from "../../constants";
import { mainPink, TINT_COLOR, IconColor, LightGrey ,PointPink} from "../../components/Color";

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

const SelectBt = styled.View`
  alignItems: center;
  justifyContent: center;
  borderRadius: 9;
  padding : 5px;
  margin : 4px;
  position: absolute;
  background-color: ${props=>props.backgroundColor}
  width : 20px;
  height: 20px
  borderWidth: 1
`; 


const Text = styled.Text`
  color: ${TINT_COLOR};
  font-weight: 600;
  `;


export default ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [selected, setSelected] = useState([]);
  const [first, setFirst] = useState();
  const [allPhotos, setAllPhotos] = useState();
  const temp = selected.map(a=>a);

  const changeSelected = (photo) => {
    var temparr = selected;
    var index = temparr.indexOf(photo);
    if(index===-1){
      temparr.push(photo)
    }else{
      temparr.splice(index, 1);
    }
    setSelected([...temparr]);
  };

  const getPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        sortBy:[[MediaLibrary.SortBy.creationTime, false]],
        first:500
      });
      
      const [firstPhoto] = assets;
      setFirst(firstPhoto);
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

  const handleSelected = () => {
    if(selected.length === 0) { Alert.alert("사진을 선택해 주세요") }
    else { navigation.navigate("Map", { photo: selected }); }
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
                  style={{ width: constants.width, height: constants.height / 2.2 }}
                  source={ temp.length>0 ? { uri: temp[temp.length-1].uri } : {uri:first.uri}}
                />
              <Button onPress={handleSelected}>
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
                          opacity: temp.length>0 ? (photo === temp[temp.length-1] ? 0.5 : null) : null
                        }}
                      >
                      </Image>
                      {temp.indexOf(photo)===-1 ? (
                        <SelectBt 
                        backgroundColor={'#00ff0000'}
                        borderColor= {'#00ff0000'}
                        />
                        ) : (
                          <SelectBt 
                          backgroundColor={PointPink}
                          borderColor= {'white'}>
                            <Text style={{fontSize:9, color: 'white' }}>{temp.indexOf(photo)+1}</Text>
                          </SelectBt>
                        )}
                      
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
/* 
<EvilIcons
  color={PointPink }
  size={20}
  name={"check" }
/>

나중에 사진 선택에 check아이콘 넣고, 
버튼에 next대신 선택한 사진 수 들어가게



 width: 50px;
  height: 50px;
  right: 5px;
  top: 15px;
  background-color: ${mainPink};
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  border-width:2;
  border-color: white;

  position: absolute;
  justify-content: center;
  align-items: center;
  top: 15px;
*/