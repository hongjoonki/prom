import React from "react";
import { View, StyleSheet} from "react-native";
import SearchBar from "../../../components/SearchComponents/SearchBar";
import SearchAccountPresenter from "./SearchAccountPresenter";
import SearchStorePresenter from "./SearchStorePresenter";
import TopBarNav from 'top-bar-nav';
import styled from "styled-components";
import constants from "../../../constants";
import { mainPink } from "../../../components/Color";

const Text = styled.Text`
font-weight : 200
font-size: 20
`;

export default class extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <SearchBar
        value={navigation.getParam("term", "")}
        onChange={navigation.getParam("onChange", () => null)}
        onSubmit={navigation.getParam("onSubmit", () => null)}
      />
    )
  });
  constructor(props) {
      super(props);
      const { navigation } = props;
      this.state = {
        term: "",
        shouldFetch: false
      };
      navigation.setParams({
        term: this.state.term,
        onChange: this.onChange,
        onSubmit: this.onSubmit
      });
  }
  onChange = text => {
      const { navigation } = this.props;
      navigation.setParams({
        term: text
      });
      if(text.length == 0) {
        this.setState({ term: text, shouldFetch: false });
      } else this.setState({ term: text, shouldFetch: true });
  };
  onSubmit = () => {
    
  };
  render() {
    const { term, shouldFetch } = this.state;
    const Scene = ({ index }) => (
      <View style={{ flex: 1, justifyContent: 'center'}}>
        {
          (index == 1) ? 
            <SearchStorePresenter term={ term } shouldFetch={ shouldFetch } />
            :
            <SearchAccountPresenter term={ term } shouldFetch={ shouldFetch } />
          }
      </View>
    );
    
    const ROUTES = {
      Scene
      // ideally you would have a ROUTES object with multiple React component scenes
    };
    
    // There are three types of labels (image, text, and element)
    const ROUTESTACK = [
      // { image: require('../'), title: 'Scene' },
      { text: <Text>계정</Text>, title: 'Scene' },
      // { element: <Text>World</Text>, title: 'Scene' },
      { text: <Text>장소</Text>, title: 'Scene' }
    ];

    return (
      <View style={{ flex: 1, justifyContent: 'center'}}>
        <TopBarNav
          routeStack={ROUTESTACK}
          renderScene={(route, i) => {
            let Component = ROUTES[route.title];
            return <Component index={i} />;
          }}
          // headerStyle={[styles.headerStyle, { paddingTop: 30 }]} // probably want to add paddingTop if using TopBarNav for the  entire height of screen to account for notches/status bars
          // labelStyle={styles.labelStyle}
          // underlineStyle={styles.underlineStyle}
          // imageStyle={styles.imageStyle}
          headerStyle={{ paddingTop: 20 }}
          //sidePadding={40}
          inactiveOpacity={1}
          fadeLabels={true}
          underlineStyle={Style.underlineStyle}
        />
      </View>
    )
  }
}

const Style = StyleSheet.create ({
  underlineStyle: {
    height: 3.6,
    backgroundColor: mainPink,
    width: constants.width / 2
  },
  
})