import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {TouchableWithoutFeedback} from 'react-native'; //버튼
import {withNavigation} from 'react-navigation'; 
import { ScrollView, RefreshControl, Platform, View, Text,TouchableOpacity, TextBase} from "react-native";

const HContainer = styled.View`
    margin-bottom:20px;
    margin-horizontal:15px;
`;

const Bold = styled.Text`
  font-weight: 600;
  margin-bottom : 5px;
  font-size : 20px;
  margin-right : 5px;
`;

const MapStore=({
    navigation,
    place_id,
    name,
    location,
    formatted_address,
    photo
})=>{
    const storeLat = location.lat;
    const storeLong = location.lng; 
    return(
        <TouchableOpacity onPress={()=>navigation.navigate("Upload",{photo,name,formatted_address, place_id, storeLat,storeLong})}>
        <HContainer>
            <Bold>{name}</Bold>
            <Text>{formatted_address}</Text>
        </HContainer>
        </TouchableOpacity>
);
}


MapStore.propTypes={
    place_id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    formatted_address: PropTypes.string.isRequired,
    location: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired
    })
}
export default withNavigation(MapStore);