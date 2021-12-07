import React, { useState } from "react";
import { ScrollView, RefreshControl, Platform, View, Text} from "react-native";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import Loader from "../../../components/Loader";

import SearchStoreBox from "../../../components/SearchComponents/SearchStoreBox";

const SEARCH_STORE = gql`
  query search($term: String!) {
    searchStore(term: $term) {
      id
      storeName
      storeLocation
      placeId
    }
  }
`;

const SearchStorePresenter = ({ term, shouldFetch }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(SEARCH_STORE, {
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

  function getUniqueObjectArray(array) {
    return array.filter((item, i) => {
      return array.findIndex(item2 => {
        return item.placeId === item2.placeId;
      }) === i;
    });
  }

  return (
      <ScrollView refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
      >
        {loading ? (
          <Loader />
        ) : (
          data &&
          data.searchStore &&
          getUniqueObjectArray(data.searchStore)
          .map(store => 
            <SearchStoreBox key={store.id} {...store} />
          )
        )}
      </ScrollView>
    );
};

SearchStorePresenter.propTypes = {
  term: PropTypes.string.isRequired,
  shouldFetch: PropTypes.bool.isRequired
};

export default SearchStorePresenter;