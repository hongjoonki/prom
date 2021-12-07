import React from "react";
import {Alert } from "react-native"
import Post from "./Post";

export default class PostUpdate extends React.Component {
    
    shouldComponentUpdate(nextProps) {
        return this.props.item !== nextProps.item
    }

    render() {
        return <Post key={this.props.item}{...this.props.item} />
    }
}