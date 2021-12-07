import React, { useState } from "react";
import { ScrollView, RefreshControl, Platform, View, Text} from "react-native";
import styled from "styled-components";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import Loader from "../../../components/Loader";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../../styles";
import MessageAccountBox from "../../../components/MessageComponents/MessageAccountBox";


const SEARCH_USER = gql`
  query search($term: String!) {
    searchUser(term: $term) {
      id
      username
      firstName
      avatar
      isFollowing
      isSelf
    }
  }
`;

const MessagePresenter = ({ term, shouldFetch }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(SEARCH_USER, {
    variables: {
      term
    },
    skip: !shouldFetch,
    fetchPolicy: "network-only"
  });
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch({ variables: { term } });
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  };
  
  return (
    <ScrollView refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        data &&
        data.searchUser &&
        data.searchUser.map(user => 
          <MessageAccountBox key={user.id} {...user} />
        )
      )}
    </ScrollView>
  );
};

MessagePresenter.propTypes = {
  term: PropTypes.string.isRequired,
  shouldFetch: PropTypes.bool.isRequired
};

export default MessagePresenter;