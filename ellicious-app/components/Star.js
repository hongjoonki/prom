import React from "react";
import { TouchableOpacity, Image,Text } from "react-native";
import { withNavigation } from "react-navigation";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../constants";
import { LightPink, TINT_COLOR, mainPink,PointPink, IconColor, Grey } from "./Color";
import {MaterialCommunityIcons, Ionicons,EvilIcons, AntDesign, FontAwesome } from "@expo/vector-icons";
import Stars from 'react-native-stars';

const StarView = styled.View`
    flex-direction: row;
    align-items: center;  
    justifyContent : center;
}
`
const Star = ({
    rating,
    color={PointPink},
    size=10,
    disabled=true
})=>{
    return(
        <StarView>
            <Stars
                default={rating}
                count={5}
                disabled={disabled}
                half={true}
                fullStar={<FontAwesome
                    color={color}
                    size={size}
                    name={"star"}
                />}
                emptyStar={<FontAwesome
                    color={color}
                    size={size}
                    name={"star-o"}
                />}
                halfStar={<FontAwesome
                    color={color}
                    size={size}
                    name={"star-half-empty"}
                />}
            />
        </StarView>
    )
}


export default Star;