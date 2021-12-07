import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import styled from "styled-components";

import Stars from 'react-native-stars';
import { FontAwesome, EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TINT_COLOR, IconColor, PointPink, BG_COLOR, StarColor, LightGrey, mainPink, Grey, Line } from '../Color';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle } from "react-native-maps";
import { Platform } from "@unimodules/core";
import Carousel from 'react-native-snap-carousel';
import DeleteButton from './DeleteButton';

const Container = styled.View`
padding : 10px;
background-color : 'rgba(0,0,0,0.6)'
border-radius : 24;
`;

export default class MapViewPick extends React.Component {

  state = {
    //translateYValue: new Animated.Value(value),
    //markers:[],
    coordinate: {
      latitude: 0,
      longitude: 0
    }
  }
  constructor(props) {
    super(props);
    const { marker, region, navigation } = props;
    this.state = { marker, region, navigation };
  }
  
  _isMount = false

  componentWillUnmount() {
    this._isMount = false
  }

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  componentDidMount() {
    this._isMount = true
    this.locationCurrentPosition();
    this.animation.addListener(({ value }) => {

      let index = Math.floor(value / 300 + 0.3);
      // animate 30% away from landing on the next item
      if (index >= this.state.marker.length) {
        index = this.state.marker.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      if (this._isMount) {
        clearTimeout(this.regionTimeout);
        this.regionTimeout = setTimeout(() => {
          if (this.index !== index) {
            this.index = index;
            this.setState({ coordinate: { latitude: this.state.marker[index].post.storeLat, longitude: this.state.marker[index].post.storeLong } })
          }
        }, 10);
      }
    });
  }


  locationCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(position => {
      //this.setState({coordinate:position.coords})
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          ...this.state.region
        }
      })
      //console.log(this.state.region);


    },
      error => alert(error.message),
      { timeout: 20000, maximumAge: 1000 }
    )
  }

  onCarouselItemChange = (index) => {
    let latitude = this.state.marker[index].post.storeLat
    let longitude = this.state.marker[index].post.storeLong
    this._map.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.011864195044303443,
      longitudeDelta: 0.0100142817690068,
    })

  }

  /*onMarkerPressed=(index)=>{
      this._map.animateToRegion({
          latitude: this.state.marker.picks[index].post.storeLat,
          longitude: this.state.marker.picks[index].post.storeLong,
          latitudeDelta: 0.047864195044303443,
          longitudeDelta: 0.0540142817690068
      })

      this._carousel.snapToItem(index);
  }*/


  renderCarouselItem = ({ item }) => (
    <Container>
      <View style={styles.viewNameContainer}>
        <TouchableOpacity onPress={() => this.state.navigation.navigate("Detail", { id: item.post.id })}>
          <Text style={styles.cardTitle}>{(item.post.storeName.length >= 16) ? `${item.post.storeName.substring(0,14)}...` : item.post.storeName}</Text>
        </ TouchableOpacity>
        <View style={{ marginLeft: 15 }}>
          <DeleteButton postId={item.post.id} navigation={this.state.navigation} />
        </View>
      </View>
      <View style={styles.viewSub}>
        <View style={styles.imageCon}>
          <TouchableOpacity onPress={() => this.state.navigation.navigate("Detail", { id: item.post.id })}>
            <Image source={{ uri: item.post.files[0].url }}
              style={{ width: 100, height: 100, borderRadius: 10, marginLeft:20 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.viewDetailContiner}>
          <TouchableOpacity onPress={() => this.state.navigation.navigate("UserDetail", { id: item.post.user.id, username: item.post.user.username })}>
            <View style={styles.viewSubDetail}>
              {item.post.user.avatar == null ?
                <Image
                  style={{ height: 30, width: 30, borderRadius: 10, marginRight: 5 }}
                  source={{ uri: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AAInJR1.img?h=400&w=300&m=6&q=60&o=f&l=f&x=509&y=704" }}
                />
                :
                <Image
                  style={{ height: 30, width: 30, borderRadius: 10, marginRight: 5  }}
                  source={{ uri: item.post.user.avatar }}
                />
              }
              <Text style={styles.cardUsername}>{item.post.user.username}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.viewSubRating}>
            <Stars
              default={item.post.rating}
              count={5}
              disabled={true}
              half={true}
              starSize={50}
              fullStar={<FontAwesome
                color={StarColor}
                size={25}
                name={"star"}
              />}
              emptyStar={<FontAwesome
                color={StarColor}
                size={25}
                name={"star-o"}
              />}
              halfStar={<FontAwesome
                color={StarColor}
                size={25}
                name={"star-half-empty"}
              />}
            />
          </View>
        </View>
      </View>
    </Container>
  )

  render() {

    const interpolations = this.state.marker.map((marker, index) => {
      const inputRange = [
        (index - 1) * 300,
        index * 300,
        ((index + 1) * 300),
      ];
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.45, 1, 0.45],
        extrapolate: "clamp",
      });
      return { opacity };
    });



    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={map => this._map = map}
          style={styles.map}
          showsUserLocation={true}
          initialRegion={this.state.region}>

          {this.state.marker.map((marker, index) => {
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <Marker
                key={index}
                onPress={() => this._carousel.snapToItem(index)}
                coordinate={{ latitude: marker.post.storeLat, longitude: marker.post.storeLong }}
              //ref={ref=>this.state.markers[index] = ref}
              >
                <Animated.View style={opacityStyle}>
                  <MaterialCommunityIcons
                    name={"map-marker-outline"}
                    size={34}
                    color={PointPink} />
                </Animated.View>
              </Marker>)
          })}

        </MapView>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.state.marker}
          renderItem={this.renderCarouselItem}
          sliderWidth={Dimensions.get("window").width}
          itemWidth={300}
          containerCustomStyle={styles.carousel}
          removeClippedSubviews={false}
          onSnapToItem={(index => this.onCarouselItemChange(index))}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
        />
      </View>

    )

  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 48
  },
  cardContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: 200,
    width: 300,
    padding: 24,
    borderRadius: 24

  },
  imageCon: {
    marginRight: 14
  },
  viewSub: {
    flexDirection: 'row'
  },
  viewNameContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center"
  },
  viewDetailContiner: {
    alignItems: "center",
    //justifyContent: "center"
  },
  viewSubDetail: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  viewSubRating: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center"
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  ratingCard: {
    color: "white",
    fontSize: 14,
    alignSelf: 'center',
    marginBottom: 10

  },
  cardImage: {
    height: 120,
    width: 300,
    bottom: 0,
    position: 'absolute',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
  },
  cardTitle: {
    color: "white",
    fontSize: 17,
    alignSelf: 'center',
    marginBottom: 10
  },
  cardUsername: {
    color: "white",
    fontSize: 15,
    alignSelf: 'center',
    marginBottom: 10
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  markerImage: {
    width: 30,
    height: 30,
    opacity: 1,
    borderWidth: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  }
})

AppRegistry.registerComponent("mapfocus", () => screens);