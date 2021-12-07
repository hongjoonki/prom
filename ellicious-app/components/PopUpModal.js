import React, { useState } from 'react'
import { Modal, View, Image, Text, StyleSheet, TouchableHighlight } from 'react-native';
import Loader from './Loader';
import { mainPink } from './Color';


const PopUpModal = (props) => {
    const [deleting, setDelete] = useState(false);
    const handleModal = async () => {
        props.setModal?.()
    }

    const handleDelete = async () => {
        await setDelete(true)
        if (props.child) {
            try {
                await props.handleDelete?.(props.child)
            } catch (e) {
                console.log(e);
            } finally {
                await setDelete(false);
                handleModal()
            }
        } else {
            try {
                await props.handleDelete?.()
            } catch (e) {
                console.log(e);
            } finally {
                await setDelete(false);
                handleModal()
            }
        }

    }

    return (
        <Modal visible={props.display} transparent={true} animationType="none" onRequestClose={() => console.log('closed')}>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 20,
                    backgroundColor: 'rgba(0,0,0,0.50)'
                }}
            >
                <View style={{
                    width: 300,
                    height: 150,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    
                }}>

                   
                    <Text
                        style={{ fontSize: 16, alignSelf: 'center', marginTop: 40, flex: 7, alignItems:'center', justifyContent: 'center'}}
                    >
                        댓글을 삭제하시겠습니까?
                            </Text>
                    <View
                        style={{
                            alignSelf: 'baseline',
                            backgroundColor: mainPink,
                            width: 300,
                            flex: 4,
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            flexDirection: 'row'
                        }}
                    >
                        <TouchableHighlight
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}
                            onPress={handleDelete}>
                            {
                                deleting ? <Loader /> : (<Text style={{ color: 'white', fontSize: 15 }}>삭제</Text>)
                            }


                        </TouchableHighlight>

                        <TouchableHighlight
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                            onPress={handleModal}>
                            <Text style={{ color: 'white', fontSize: 15 }}>취소</Text>
                        </TouchableHighlight>

                    </View>
                </View>

            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    image: {
        marginTop: 20,
        marginLeft: 90,
        height: 200,
        width: 200
    },
    text: {
        fontSize: 20,
        marginLeft: 150
    }
})

export default PopUpModal;