import React from "react";
import { TouchableOpacity, Image, Text, View } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import constants from "../../constants";
import styled from "styled-components";

const Header = styled.View`
  padding: 5px;
  flex-direction: row;
  align-items: center;
`;
const Bold = styled.Text`
  font-weight: 600;
  margin-bottom : 5px;
  font-size : 15px;
`;
const Profile = styled.View`
  margin-right : 5px;
`;

const SearchStoreBox = ({ navigation, storeName, storeLocation, id, placeId }) => (
  <TouchableOpacity onPress={() => navigation.navigate("StoreDetail", { storeName, placeId })}>
    <Header>
      <Profile>
        <Image 
          style={{height: 40, width: 40, borderRadius:20}}
          source={{uri: "https://i.pinimg.com/originals/39/cd/e2/39cde2d77b272cfc6816ead14a47232c.png"}}/>
        </Profile>
        <View>
          <Bold>{ storeName }</Bold>
          <Text>{ (storeLocation.length >= 27) ? `${storeLocation.substring(0, 25)}...` : storeLocation }</Text>
        </View>
    </Header>
  </TouchableOpacity>
);

SearchStoreBox.propTypes = {
  id: PropTypes.string.isRequired,
  storeName: PropTypes.string.isRequired,
  storeLocation: PropTypes.string,
  placeId: PropTypes.string.isRequired
};

export default withNavigation(SearchStoreBox);