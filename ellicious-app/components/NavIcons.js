import React from "react";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import styles from "../styles";
import { PointPink, Grey } from "./Color";

const NavIcon = ({
    focused = true,
    name,
    color = PointPink,
    size = 22
  }) => (
    <Ionicons
      name={name}
      color={focused ? PointPink : Grey}
      size={size}
    />
);

NavIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  focused: PropTypes.bool
};

export default NavIcon;