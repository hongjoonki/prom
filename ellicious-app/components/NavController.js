import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useIsLoggedIn } from "../AuthContext";
import AuthNavigation from "../navigation/AuthNavigation";
import Subscribe from "./Subscribe";

export default () => {
  const isLoggedIn = useIsLoggedIn();
  
  

  return (
    <View style={{ flex: 1 }}>
      {isLoggedIn ? <Subscribe /> : <AuthNavigation />}
    </View>
  );
};