import React,{useState}from "react";
import { Image,ScrollView, RefreshControl} from 'react-native'
import styled from "styled-components";
import { Grey, TINT_COLOR, LightGrey, LightPink } from "../../components/Color";
import gql from 'graphql-tag';
import { withNavigation } from "react-navigation";
import { useQuery } from "react-apollo-hooks";
import Loader from "../../components/Loader";
import {ALARM_FRAGEMENT} from '../../fragments';
import AlarmPart from './AlarmPart';

const Container=styled.View`

`;

const Box = styled.View`
flex-direction : row;
padding : 10px;

`;

const TextCon=styled.View`
padding : 5px;
alignItems: flex-start;
flex :1;
`;

const Text = styled.Text`
color : ${TINT_COLOR};
`;
const Time = styled.Text`
color : ${Grey};
fontSize:15;
`;

const TimeCon = styled.View`
alignItems: flex-start;
flex : 1;
`;

const Bold = styled.Text`
fontWeight : 600;
color : ${TINT_COLOR};
`;

export const ALARM = gql`
  {
    getAlarm {
      ...AlarmParts
    }
  }
  ${ALARM_FRAGEMENT}
`;

const Alarms =({
  navigation
}) => {
  const {loading, data, refetch, fetchMore} = useQuery(ALARM)
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async() =>{
    try{
      setRefreshing(true);
      await refetch();
      
    }catch (e){
      console.log(e);
    }finally{
      setRefreshing(false);
    }
  };
  return(
    <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh}/>
        }>
        {loading ? (<Loader/>): data && data.getAlarm.map(item=> <AlarmPart key={item.id}{...item} />)}
      </ScrollView>
  
  )
}

export default withNavigation(Alarms);
