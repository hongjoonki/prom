import React from "react";
import styled from "styled-components";
import { withNavigation } from "react-navigation";
import { PointPink, mainPink, TINT_COLOR, LightGrey } from "./Color";
import { StyleSheet } from "react-native";
import ModalDropdown from './ModalDropdown';

const View = styled.View``;
const BG = styled.View`
justify-content: center;
align-items: center;
`;

const styles = StyleSheet.create({

    CircleShapeView: {
        width: 38,
        height: 38,
        borderRadius: 34 / 2,
        backgroundColor: LightGrey
    },
    Text: {
        width: 16,
        height: 16,
        borderRadius: 7,
        backgroundColor: "#f53b3b",
        position: 'absolute',
    }

});

const SettingLink = () => {
    return (
        <View>
            <BG style={styles.CircleShapeView}>
                <ModalDropdown
                    options={['option 1', 'Log-out']}
                    defaultValue={"..."}
                />
            </BG>
        </View>
    )
}

export default withNavigation(SettingLink);