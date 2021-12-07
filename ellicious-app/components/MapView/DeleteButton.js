import React, { useState } from "react";
import {
    View,
    TouchableOpacity,
    Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "react-apollo-hooks";
import { PICK_FRAGMENT } from '../../fragments'

const GET_PICK = gql`
  {
    seePick {
        ...PickInfo
    }
  } ${PICK_FRAGMENT}
`;

const TOGGLE_PICK = gql`
  mutation togglePick($postId: String!) {
    togglePick(postId: $postId)
  }
`;

const DeleteButton = ({postId, navigation}) => {
    const [togglePickMutation] = useMutation(TOGGLE_PICK, {
        refetchQueries: () => [{ query: GET_PICK }]

    });
    const handlePickMutation = async() => {
        if(postId) {
            await togglePickMutation({variables: {postId: postId}})
        }
    }

    return (
        <View>
            <TouchableOpacity onPress={handlePickMutation}>
                <AntDesign
                    name={"minuscircleo"}
                    color={"red"}
                    size={25}
                />
            </TouchableOpacity>
        </View>
    );
};

export default DeleteButton;
