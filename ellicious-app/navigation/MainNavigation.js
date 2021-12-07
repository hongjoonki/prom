import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import TabNavigation from "./TabNavigation";
import PhotoNavigation from "./PhotoNavigation";
import MessageNavigation from "./MessageNavigation";
import UsersNavigation from "./UsersNavigation";

import AlarmNavigation from "./AlarmNavigation";
import { stackStyles } from "./config";


const MainNavigation = createStackNavigator(
  {
    TabNavigation,
    PhotoNavigation,
    MessageNavigation,
    AlarmNavigation,
    //UsersNavigatio0n
  },
  {
    defaultNavigationOptions: {
      headerStyle:{
        ...stackStyles
      }
    },
    headerMode: "none",
    mode:"modal"
  }
);

export default createAppContainer(MainNavigation);