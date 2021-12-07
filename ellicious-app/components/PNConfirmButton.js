import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../constants";
import { ActivityIndicator } from "react-native";
import { BG_COLOR, mainPink, mainBlue, TINT_COLOR } from './Color'

const Touchable = styled.TouchableOpacity``;

const Container = styled.View`
  background-color: #d0cece ;
  justify-content: center;
  align-items: center;
  border-radius: 7;
height : 40;
padding : 2px;

`;

const Text = styled.Text`
  color: ${TINT_COLOR};
  text-align: center;
  font-weight: 600;

`;

const AuthButton = ({ text, onPress, loading = false }) => (
  <Touchable disabled={loading} onPress={onPress}>
    <Container>
      {loading ? <ActivityIndicator color={"white"} /> : <Text>{text}</Text>} 
    </Container>
  </Touchable>
);

AuthButton.propTypes = {
  loading: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

export default AuthButton;