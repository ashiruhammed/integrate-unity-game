import React from 'react';

import {Text, View, StyleSheet, ViewProps} from 'react-native';
import Colors from "../constants/Colors";
import {pixelSizeVertical} from "../helpers/normalize";

interface props extends ViewProps{
    margin?:boolean, color?:string, width?:string
}

const HorizontalLine = ({margin, color,width,style}:props) => {
    return (
        <View style={[styles.line, style,{
            width: width ? width :'100%',
            borderBottomColor:color ? color : Colors.border,
            marginVertical:margin ? pixelSizeVertical(30) : 0
        }]}/>


    );
};

const styles = StyleSheet.create({
        line: {



            borderBottomWidth: 1,
        }
    }
)

export default HorizontalLine;
