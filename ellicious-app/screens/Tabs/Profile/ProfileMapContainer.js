import React, { useState, useEffect } from 'react';
//import MapView,{Marker, PROVIDER_GOOGLE, Callout, Polygon} from 'react-native-maps';
import { StyleSheet, Image, Alert, Text, View, Dimensions, TextBase, ScrollView, TextInput } from 'react-native';
import { IconColor, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery, useMutation } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import Loader from '../../../components/Loader';
import useInput from '../../../hooks/useInput';
import { CATEGORYINFO_FRAGMENT } from '../../../fragments';
import ProfileMapPresenter from '../../Tabs/Profile/ProfileMapPresenter';
import styled from "styled-components";
import Modal, { ModalTitle, ModalContent, ModalFooter, ModalButton } from 'react-native-modals';
import { PointPink, CommentsBox, mainPink, TINT_COLOR, Grey, LightPink } from "../../../components/Color";
import User from "../../../User";

const Touchable = styled.TouchableOpacity`
    margin-bottom : 20px;
    margin-right : 10px;
`;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    subContainer: {
        marginTop: 10,
        marginRight: 10,
        alignItems: 'flex-end'
    }
})

const ModalContainer = styled.View`
  padding: 5px;
  flex-direction: row;
  align-items: center;  
  padding : 5px;
`;
const ModalNameContainer = styled.View`
    align-items: center;  
    flex:5
`;
const ModalDelContainer = styled.View`
    align-items: center;  
    flex:1;
`;
const Delete = styled.Text`
  font-size: 15px;
  font-weight: 400;
  color : ${PointPink};
`;

const region = {
    latitude: 37.6247855,
    longitude: 127.0773206,
    latitudeDelta: 0.057864195044303443,
    longitudeDelta: 0.0640142817690068,
};

const GET_CATEGORYINFO = gql`
  query seeCategory($userId: String!){
    seeCategory(userId: $userId) {
      ...CategoryInfo
      }
    }
    ${CATEGORYINFO_FRAGMENT}
`;

const DELETE_CATEGORY = gql`
mutation editCategory($id: String!){
    editCategory(id: $id, action: DELETE){
        id
    }
}
    `

export const CREATE_CATEGORY = gql`
  mutation createCategory($categoryName:String!){
    createCategory(categoryName: $categoryName){
      id
    }
  }
`

const ProfileMapContainer = ({ navigation, userId }) => {
    const [mapIdx, setIndex] = useState(0);
    const [confirm, setConform] = useState(false);
    const [modalAndTitle, setmodalAndTitle] = useState(false);
    const [newCategory, setNewCategory] = useState(false);
    const [delCategory, setDelCategory] = useState(false);

    const [isloading, setIsLoading] = useState(false);
    const categoryInput = useInput();
    const { loading, data, refetch } = useQuery(GET_CATEGORYINFO, {
        variables: { userId: userId }
    });
    const [createCategory] = useMutation(CREATE_CATEGORY, {
        refetchQueries: () => [{ query: GET_CATEGORYINFO, variables: { userId: userId } }]
    });

    const [deleteCategory] = useMutation(DELETE_CATEGORY, {
        refetchQueries: () => [{ query: GET_CATEGORYINFO, variables: { userId: userId } }]
    });


    const handleIndex = async (index) => {
        await setmodalAndTitle(false)
        await setConform(true)
        await setIndex(index)
        await setConform(false)
    }

    const handleDelete = async (id) => {
        await setIsLoading(true);
        try {
            await deleteCategory({
                variables: {
                    id: id
                }
            });
        } catch (e) {
            console.log(e);
        } finally {
            await setIsLoading(false);
            await setDelCategory(false);
        }
    }


    const handleCreate = async () => {
        if (categoryInput.value === undefined) {
            Alert.alert("한 글자는 쓰지?");
        } else {
            await setIsLoading(true);
            try {
                await createCategory({
                    variables: {
                        categoryName: categoryInput.value
                    }
                });
            } catch (e) {
                console.log(e)
            } finally {
                await setIsLoading(false);
                await setNewCategory(false);
                categoryInput.setValue("")
            }
        }
    }



    return (
        <View style={styles.container}>
            {loading ? <Loader /> : (
                <>
                    {confirm ? <Loader /> : (
                        <>
                            <ProfileMapPresenter marker={data.seeCategory[mapIdx] ? data.seeCategory[mapIdx] : null} region={region} navigation={navigation} />
                            <View style={styles.subContainer}>
                                <Touchable onPress={() => setmodalAndTitle(true)}>
                                    <MaterialCommunityIcons
                                        color={IconColor}
                                        size={25}
                                        name={"dots-horizontal"}
                                    />
                                </Touchable>
                                <Modal
                                    visible={modalAndTitle}
                                    onTouchOutside={() => setmodalAndTitle(false)}
                                    width={0.8}
                                    onSwipeOut={() => setmodalAndTitle(false)}
                                >
                                    <ModalContent>
                                        <ScrollView height={200}>
                                            {data.seeCategory.map((category, index) => (
                                                <ModalContainer key={index}>
                                                    <ModalNameContainer>
                                                        <ModalButton
                                                            text={category.categoryName}
                                                            onPress={() => handleIndex(index)}
                                                        />
                                                    </ModalNameContainer>
                                                    <ModalDelContainer>
                                                        <ModalButton
                                                            text={"삭제"}
                                                            textStyle={{ color: PointPink }}
                                                            onPress={() => setDelCategory(true)}
                                                        />
                                                    </ModalDelContainer>
                                                    <Modal
                                                        visible={delCategory}
                                                        onTouchOutside={() => setDelCategory(false)}
                                                        width={0.8}
                                                        onSwipeOut={() => setDelCategory(false)}
                                                    >
                                                        <ModalContent>
                                                            <Text>
                                                                삭제하시면 카테고리에 포함 되어있던 포스트가 모두 사라집니다. 그래서 삭제하시겠습니까?
                                                            </Text>
                                                        </ModalContent>

                                                        <ModalFooter>
                                                            {!isloading ? (
                                                                <ModalButton
                                                                    text="확인"
                                                                    onPress={() => handleDelete(category.id)}
                                                                />) : <Loader />}
                                                            <ModalButton
                                                                text="취소"
                                                                onPress={() => setDelCategory(false)}
                                                            />
                                                        </ModalFooter>
                                                    </Modal>
                                                </ModalContainer>
                                            ))}
                                        </ScrollView>
                                    </ModalContent>
                                    {User.userId === userId ? 
                                    <ModalFooter>
                                        <ModalButton
                                            text="카테고리 추가"
                                            onPress={() => setNewCategory(true)}
                                        />
                                        <ModalButton
                                            text="확인"
                                            onPress={() => setmodalAndTitle(false)}
                                        />
                                    </ModalFooter>
                                    :
                                    null
                                    }
                                </Modal>
                                <Modal
                                    visible={newCategory}
                                    onTouchOutside={() => setNewCategory(false)}
                                    width={0.8}
                                    onSwipeOut={() => setNewCategory(false)}
                                >
                                    <ModalContent>
                                        <TextInput
                                            onChangeText={categoryInput.onChange}
                                            placeholder={"새 카테고리 이름"}
                                            placeholderTextColor={TINT_COLOR}
                                        />

                                    </ModalContent>

                                    <ModalFooter>
                                        {!isloading ? (
                                            <ModalButton
                                                text="확인"
                                                onPress={handleCreate}
                                            />) : <Loader />}
                                        <ModalButton
                                            text="취소"
                                            onPress={() => setNewCategory(false)}
                                        />
                                    </ModalFooter>
                                </Modal>

                            </View>
                        </>
                    )}
                </>
            )}
        </View>
    )
}
export default ProfileMapContainer;