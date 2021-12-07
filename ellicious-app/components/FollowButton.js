import React, {Component} from 'react';
import {TouchableOpacity,Text} from 'react-native';
import {mainPink} from "./Color";
import styled from "styled-components";

const Button = styled.View`
    alignItems: center;
    justifyContent: center;
    borderRadius: 5;
    background-color : ${props=>props.backgroundColor};
    width : 70;
    height : 30;
`;

  export default class CustomButton extends Component{
    constructor(props){
      super(props);
    }

    render(){
      return (
        <TouchableOpacity>
            <Button onPress={this.props.onPress} backgroundColor={this.props.background}>
                <Text>Following</Text>
            </Button>
        </TouchableOpacity>
      )
    }
  }
  
 