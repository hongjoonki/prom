import React from 'react'
import Post from '../../components/Post';
import PostUpdate from '../../components/PostUpdate';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import styled from "styled-components";
import { BG_POST_COLOR } from '../../components/Color';
import { SafeAreaView } from "react-navigation";
import Loader from "../../components/Loader";

const Container = styled.View`
background-color : ${BG_POST_COLOR};
padding-left: 2px;
padding-right : 2px;
`;

export default class HomePresenter extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            refreshing: false,
            onEndReachedCalledDuringMomentum: false,
            onReachedEnd: false,
            isEnd: this.props.isEnd,
            feedData: this.props.feedData
        }
    }

    shouldComponentUpdate(nextProps) {
        if (this.state.refreshing == true && nextProps.refreshing == false) {
            this.setState({refreshing: false})
            return true
        } else
        if (this.state.isEnd !== nextProps.isEnd) {
            this.setState({ isEnd: true });
            return true
        } else {
            if (this.state.feedData !== nextProps.feedData) {
                this.setState({ feedData: this.props.feedData })
                return true
            } else {
                return false
            }
        }
    }

    LoadingMoreItem = async () => {
        await this.props.onLoadMore().then(() => {
            this.setState({ onEndReached: false })
            this.setState({ onEndReachedCalledDuringMomentum: false });
        });
    }

    refresh = async () => {
        await this.setState({ refreshing: true });
        try {
            await this.props.refetch();
        } catch (e) {
            console.log(e);
        }
         finally {
            this.setState({ refreshing: false })
        }
    };

    renderRow = (item) => {
        return (
            <>
                <View style={styles.items}>
                    <PostUpdate item={item} />
                </View>

            </>
        )
    }

    renderSearchResultsFooter = () => {
        return (

            this.props.isLoading ?
                !this.state.isEnd ?
                    <View style={{ marginBottom: 30, marginTop: -50, alignItems: 'center' }}>
                        <Loader />
                    </View> : null : null
        )
    }

    render() {
        return (
            <SafeAreaView style={Container}>
                {this.props.feedData == undefined ? null : (

                    <FlatList
                        ref={ref => this.flatList = ref}
                        data={this.state.feedData}
                        onRefresh={() => {
                            this.refresh()
                        }}
                        EndReachedThreshold={0}
                        refreshing={this.state.refreshing}
                        keyExtractor={(item, index) => index.toString()}
                        maxToRenderPerBatch={50}
                        removeClippedSubviews={false}
                        windowSize={40}
                        renderItem={({ item }) =>
                            this.renderRow(item)
                        }
                        onEndReached={() => {
                            this.LoadingMoreItem()
                        }}

                        ListFooterComponent={this.renderSearchResultsFooter}


                    //   ListEmptyComponent={()=>{
                    //     recommendCheck();
                    //     return(
                    //       <Container>

                    //         {loading2 ? (
                    //           <Loader />
                    //         ) : (
                    //           data2 &&
                    //           data2.recommendUser &&
                    //           data2.recommendUser.map(user => 
                    //         <SearchAccountBox key={user.id} {...user} />
                    //         )
                    //         )
                    //           }
                    //       <TouchableOpacity onPress={refresh}>
                    //         <Text>완료</Text>
                    //       </TouchableOpacity>
                    //     </Container>
                    //     )
                    //   }
                    // }
                    />

                )}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    items: {
        flex: 1
    }
})