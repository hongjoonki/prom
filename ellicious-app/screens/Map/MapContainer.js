import React, { Component,useState } from 'react';
import {
    Text,
    View,
    FlatList,
    ActivityIndicator,
    AppRegistry,
    TextBase,
    TouchableOpacity
  } from 'react-native';
import Loader from '../../components/Loader';
import MapPresenter from './MapPresenter';
import MapStore from './MapStore';
import axios from 'axios';
import {search} from '../../api';


export default class MapContainer extends React.Component {
    static navigationOptions = ({navigation})=>{
        return{//navigation options은 항상 props들ㅇ이 같이 옴!
            photo: navigation.getParam('photo')
        };
    };
    constructor(props){
        super(props);
        const {
            navigation:{
                state: {
                    params:{
                        photo
                    }}}} = props;
    
    this.state={
        loading : false,
        searchTerm:"",
        error:null,
        searchResults:null,
        photo
    };
}
    onSubmitEditing=async()=>{
    }
    handleSearchUpdate = async(text) => {
        this.setState({
            searchTerm:text
        })
        if(text !==""){
            let loading, searchResults, error;
            this.setState({
                loading:true
            });
            try{
                ({
                data:{results: searchResults}}
                = await search.searchStore(text));
            } catch{
                error:"can't search"
            }finally{
                this.setState({
                    loading:false,
                    searchResults,
                    error
                });
            }
        }
    }
    render(){
        const{loading, searchResults, searchTerm, photo} = this.state;
        return (
            <MapPresenter
            photo={photo}
            loading={loading}
            searchResults={searchResults}
            searchTerm={searchTerm}
            onSubmitEditing={this.onSubmitEditing}
            handleSearchUpdate={this.handleSearchUpdate}/>
        );
    }
}

    