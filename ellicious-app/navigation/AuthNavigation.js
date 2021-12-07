import { createAppContainer } from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import SignUpName from "../screens/Auth/SignUpName";
import SignUpPhone from "../screens/Auth/SignUpPhone";
import SignUpCheckInfo from "../screens/Auth/SignUpCheckInfo";
import SignUpPW from "../screens/Auth/SignUpPW";
import SignUpFin from "../screens/Auth/SignUpFin";
import SignUpID from "../screens/Auth/SignUpID";
import Confirm from "../screens/Auth/Confirm";
import AuthHome from "../screens/Auth/AuthHome";
import Login from "../screens/Auth/Login";
import FindID from "../screens/Auth/FindID";
import EmailCheck from "../screens/Auth/EmailCheck";
import FindPW from "../screens/Auth/FindPW"
import ResetPassword from "../screens/Auth/ResetPassword"

const AuthNavigation = createStackNavigator(
  {
    AuthHome,
    SignUpName,
    Confirm,
    EmailCheck,
    SignUpPhone,
    SignUpID,
    SignUpCheckInfo,
    SignUpPW,
    SignUpFin,
    Login,
    FindID,
    FindPW,
    ResetPassword
  },
  {
    headerMode: "none"
  }
);

export default createAppContainer(AuthNavigation);