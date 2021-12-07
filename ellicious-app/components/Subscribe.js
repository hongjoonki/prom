import React, { useState, useEffect } from "react";
import { View, Alert,AsyncStorage } from "react-native";
import PropTypes from "prop-types";
import { useQuery, useSubscription, useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import MainNavigation from "../navigation/MainNavigation";
import User from "../User";
import { ALARM } from "../screens/Alarm/Alarms"

const ME = gql`
    {
        me {
            id
            username
            avatar
        }
    }
`;

const NEW_ALARM = gql`
    subscription newAlarm($id: String) {
      newAlarm (id: $id) {
        check
        category
        from {
          username
        }
      }
    }
`;


const Subscribe = () => {
  const [isSkip, setIsSkip] = useState(false);
  const [userId, setUserId] = useState("");

  const { data } = useQuery(ME);
  const { data: data2, refetch} = useQuery(ALARM)
  
  const getUser = async()=>{
    await setUserId(data.me.id);
    await setIsSkip(true);
    await AsyncStorage.setItem('userId', data.me.id);
    await AsyncStorage.setItem('username', data.me.username);
    User.userId = await AsyncStorage.getItem('userId')
    User.username = await AsyncStorage.getItem('username')
  }

  const {data: newAlarm} = useSubscription(NEW_ALARM, {
    variables: {
      id: userId
    }, skip: !isSkip
  })

  useEffect(()=>{
    if(data){
      getUser();
      
    }
  },[data])

  useEffect(() => {
    if(newAlarm) {
      refetch()
    }
  }, [newAlarm])
  
  return <MainNavigation />
}

export default Subscribe;