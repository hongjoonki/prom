import React from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Button,
    Platform,
} from "react-native";
import styled from "styled-components";
import Stars from 'react-native-stars';
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import { FontAwesome, EvilIcons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { TINT_COLOR, IconColor, PointPink, StarColor, BG_COLOR, LightGrey, mainPink, Grey, Line, LightPink } from '../../../components/Color';
import { PROVIDER_GOOGLE, Marker, Callout, Circle } from "react-native-maps";
import MapView from 'react-native-map-clustering';
import Modal, { ModalTitle, ModalFooter, ModalButton } from 'react-native-modals';
import { withNavigation } from "react-navigation";
import Star from '../../../components/Star';
import constants from '../../../constants';


const ModalContainer = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: center; 
flex : 1;
margin-left : 5px;
`;

const SubContainer = styled.View`
  padding: 5px;
  flex : 1;
  margin-left : 5px;
`;
const Info = styled.View`
margin-top : 2px;
`;

const ModalContent = styled.View`
flex:1;
justifyContent: center;
alignItems: center;
`;

const Title = styled.View`
justifyContent: center;
alignItems: flex-start;

`;

const Bold = styled.Text`
  font-weight: 600;
  margin-bottom : 5px;
  font-size : 23px;
  margin-right : 5px;
`;

const DetailView = styled.View`
alignItems: center;
  justifyContent: center;
  borderRadius: 7;
  padding : 5px;
  margin : 4px;
  background-color: ${LightGrey};
`;

class MyPickPresenter extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        const { navigation } = props;
        const { marker, region } = props;
        this.state = { marker, region, navigation, isClick: false, indexNum: -1 };
    }

    componentWillUnmount(){
        this.state._isMounted = false;
    }
    componentDidMount() {
        this.locationCurrentPosition();
    }

    locationCurrentPosition = () => {
        this.state._isMounted = true;
        navigator.geolocation.getCurrentPosition(position => {
            //this.setState({coordinate:position.coords})
            if(this.state._isMounted === true){
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        ...this.state.region
                    }
                })
            }

        },
            error => alert(error.message),
            { timeout: 20000, maximumAge: 1000 }
        )
    }

    animate(coordinate) {
        //console.log("로그"+this.mapView.state)
        let newRegion = {
            latitude: coordinate.storeLat,
            longitude: coordinate.storeLong,

            latitudeDelta: this.state.region.latitudeDelta / 20,
            longitudeDelta: this.state.region.longitudeDelta / 20,
        };
        mapView.animateToRegion(newRegion, 2000);
    }

    clickMarker(coordinate, index) {
        let newRegion = {
            latitude: coordinate.storeLat,
            longitude: coordinate.storeLong,
            latitudeDelta: this.state.region.latitudeDelta / 20,
            longitudeDelta: this.state.region.longitudeDelta / 20,
        };

        this.setState({ indexNum: index, isClick: true })
        mapView.animateToRegion(newRegion, 1000);
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    mapRef={(ref) => mapView = ref}
                    clusterColor={mainPink}
                    initialRegion={{
                        latitude: 36.519959, longitude: 127.889604,
                        latitudeDelta: 3, longitudeDelta: 3
                    }}
                    style={{ flex: 1 }}
                    showsUserLocation={true}>
                    {this.state.marker ? (
                        this.state.marker.map((p, index) => {
                            return (
                                <Marker key={index}
                                    coordinate={{ latitude: p.post.storeLat, longitude: p.post.storeLong }}
                                    onPress={() => this.clickMarker(p.post, index)}
                                //onPress={()=>{this.setState({isClick:true})}}
                                >
                                    <View style={styles.ratingBox}>
                                        <Entypo
                                            name={"location-pin"}
                                            size={37}
                                            color={mainPink}
                                        />

                                    </View>

                                </Marker>


                            )
                        })
                    ) : null
                    }
                </MapView>
                

                {this.state.indexNum > -1 ? (
                    <Modal.BottomModal
                        visible={this.state.isClick}
                        onTouchOutside={() => this.setState({ isClick: false })}
                        width={0.1}
                        height={170}
                        onSwipeOut={() => this.setState({ isClick: false })}
                    >
                        <ModalContent>
                            <ModalContainer>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ isClick: false })
                                    this.state.navigation.navigate("StoreDetail", { 
                                    storeName: this.state.marker[this.state.indexNum].post.storeName, 
                                    placeId: this.state.marker[this.state.indexNum].post.placeId })}}>
                                    <Image
                                        source={{ uri: this.state.marker[this.state.indexNum].post.files[0].url }}
                                        style={styles.cardImage, {width: 120, height:120, borderRadius:10}}
                                    />
                                </TouchableOpacity>
                                <SubContainer>
                                    <Title>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({ isClick: false })
                                            this.props.navigation.navigate("StoreDetail", { 
                                            storeName: this.state.marker[this.state.indexNum].post.storeName, 
                                            placeId: this.state.marker[this.state.indexNum].post.placeId })}}>
                                            <Bold>{this.state.marker[this.state.indexNum].post.storeName}</Bold>
                                        </TouchableOpacity>
                                        <Star rating={this.state.marker[this.state.indexNum].post.rating} size={25} color={StarColor} />
                                    </Title>
                                    <Info>
                                        <Text>
                                            {this.state.marker[this.state.indexNum].post.storeLocation.length > 25
                                                ? `${this.state.marker[this.state.indexNum].post.storeLocation.substring(0, 23)}...`
                                                : this.state.marker[this.state.indexNum].post.storeLocation}
                                        </Text>
                                       <ScrollView>
                                            <View flexDirection="row">
                                           
                                                {this.state.marker[this.state.indexNum].post.details.map((detail) => (
                                                    <DetailView>
                                                        <Text key={detail}>{detail}</Text>
                                                    </DetailView>
                                                ))}
                                           
                                            </View>
                                        </ScrollView>
                                    </Info>
                                </SubContainer>
                            </ModalContainer>
                        </ModalContent>
                    </Modal.BottomModal>
                ) : null}

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1
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
    viewSub: {
        flexDirection: 'row'
    },
    ratingBox: {
        alignItems: "center",
        justifyContent: "center"

    },
    cardImage: {
        height: 120,
        width: 300,
        bottom: 0,
        color: "red",
        position: 'absolute',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        alignContent: 'center',
        justifyContent: 'center',


    },
    cardTitle: {
        color: "white",
        fontSize: 22,
        alignSelf: 'center',
        marginBottom: 10
    },
    viewSubRating: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center"
    },
    markerImage: {
        width: 32,
        height: 32,
        opacity: 1,
        borderWidth: 2,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    titleModal: {
        fontSize: 22,
        alignSelf: 'center',
    }
})

AppRegistry.registerComponent("mapfocus", () => screens);

export default withNavigation(MyPickPresenter);

