import React, {useState, useEffect} from 'react';
import MapView,{Marker, PROVIDER_GOOGLE, Callout, Polygon} from 'react-native-maps';
import { StyleSheet,Image, Text, View, Dimensions, TextBase } from 'react-native';
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import Loader from '../Loader';
import {CATEGORYINFO_FRAGMENT} from '../../fragments';
import MapViewContainer from '../../components/MapView/MapViewProfile';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const region = {  
    latitude: 37.6247855,
    longitude: 127.0773206,
    latitudeDelta: 0.047864195044303443,
    longitudeDelta: 0.0540142817690068,
  };

const GET_CATEGORYINFO = gql`
  {
    seeCategory {
        ...CategoryInfo
    }
  } ${CATEGORYINFO_FRAGMENT}
`;


const MapViews=()=> {
    
    const { loading, data } = useQuery(GET_CATEGORYINFO);
    //const [marker, setMarker] = useState(data.seeCategory);

    const [currentPosition, setCurrentPosition] = useState();
    /*
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(position=>{
            const {longitude, latitude} = position.coords;
            setCurrentPosition({
                ...currentPosition,
                latitude,
                longitude
            })
        },
        error=> alert(error.message),
        {timeout:20000, maximumAge:1000}
        )
    },[]);*/
    return(
        <View style={styles.container}>
            {loading ? <Loader/> : <MapViewContainer marker={data.seeCategory[1]} region={region}/> }
        </View>
    )
}
export default MapViews;