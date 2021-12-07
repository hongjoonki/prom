import React, { Component,useState } from 'react';
import {
    Text,
    View,
    FlatList,
    ActivityIndicator,
    AppRegistry
  } from 'react-native';
import MapInput from '../components/Map/MapInput';
import MyMapView from '../components/Map/MapView';
import { getLocation, geocodeLocationByName } from '../services/location-service';
import { List, ListItem } from "react-native-elements";
var _ = require('lodash');


export default class extends React.Component {
    constructor(props) {
        super(props);
    //const [loading, isLoading] = useState(false);
    //const [refreshing, setRefreshing] = useState(false);
        this.state = {
          loading: false,
          data: [],
          pageToken: '',
          refreshing: false,
          siteTitle: ''
        };
      }
      componentDidMount() {
 
        this.fetchData();
      }
     
      fetchData = () => {
 
        navigator.geolocation.getCurrentPosition(
                (position) => {
        const api_key = 'AIzaSyDI0c6fpWeaxC1d82jjF5Q0gsjA3I6q4ac';
        const latitude = Number(position.coords.latitude.toFixed(6));
        const longitude = Number(position.coords.longitude.toFixed(6));
        const { pageToken } = this.state;
        const urlFirst = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=restaurant&key=${api_key}
        `
        const urlNext = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=restaurant&key=${api_key}&pagetoken=${pageToken}`;
     
        let url = pageToken === '' ? urlFirst : urlNext
        console.log(url);
        console.log("url");
        this.setState({ loading: true });
        fetch(url)
          .then(res => {
            return res.json()
          })
          .then(res => {
     
            const arrayData = _.uniqBy( [...this.state.data, ...res.results] , 'id' )
     
            this.setState({
              siteTitle: "Resturants Near By",
              data: pageToken === '' ? res.results : arrayData,
              loading: false,
              refreshing: false,
              pageToken: res.next_page_token
            });
     
          })
          .catch(error => {
            console.log(error);
            this.setState({ loading: false });
          });
        })
      };
      renderSeparator = () => {
       return (
         <View
           style={{
             height: 1,
             width: "86%",
             backgroundColor: "#CED0CE",
             marginLeft: "14%"
           }}
         />
       );
      };
      renderHeader = () => {
        return (<Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 20, marginBottom: 10}}>{this.state.siteTitle}</Text>)
      };
      renderFooter = () => {
     
        if (this.state.pageToken === undefined) return null;
     
        return (
          <View
            style={{
              paddingVertical: 20,
              borderTopWidth: 1,
              borderColor: "#CED0CE"
            }}
          >
            <ActivityIndicator animating size="large" />
          </View>
        );
      };
     
      handleRefresh = () => {
        this.setState(
          {
            pageToken: '',
            refreshing: true
          },
          () => {
            this.fetchData();
          }
        );
      };
     
      handleLoadMore = () => {
        this.fetchData();
      };
      render() {
      
        return (
          <View>    
          <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }} >
          <FlatList
            data={this.state.data}
            keyExtractor={item => item.id}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            renderItem={({ item }) =>{
       
              const rating = item.rating ? item.rating : 'na'
     
              return (
              <View><ListItem
                  roundAvatar
                  title={`${item.name}`+" ("+`${rating}`+")"}
                  subtitle={`${item.vicinity}` }
                  avatar={{ uri: item.icon }}
                  containerStyle={{ borderBottomWidth: 0 }}
                />
                <View
                  style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                  }}
                /></View>
              )
            }}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
          </List>
          </View>
        );
      }
    }

    /*
    state = {
        region: {},
    };

    componentDidMount() {
        this.getInitialState();
    }

    getInitialState() {
        getLocation().then(
            (data) => {
                
                this.setState({
                    region: {
                        latitude: data.latitude,
                        longitude: data.longitude,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003
                    }
                });
            }
        );
    }

    getCoordsFromName(loc) {
        this.setState({
            region: {
                latitude: loc.lat,
                longitude: loc.lng,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003
            }
        });
    }

    onMapRegionChange(region) {
       
        this.setState({ region });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <MapInput notifyChange={(loc) => this.getCoordsFromName(loc)}
                    />
                </View>

                {
                    this.state.region['latitude'] ?
                        <View style={{ flex: 4 }}>
                            <MyMapView
                                region={this.state.region}
                                onRegionChange={(reg) => this.onMapRegionChange(reg)} />
                        </View> : null}
            </View>
        );
    }
}

export default MapContainer;*/