import {ButtonProps, TouchableOpacity} from "./Themed";

import {ImageBackground, Platform, Pressable, Text,Image} from "react-native";
import Rectangle from "../assets/images/svg/Rectangle";
import {fontPixel, heightPixel, widthPixel} from "../helpers/normalize";
import React from "react";
import {Fonts} from "../constants/Fonts";

export function RectButton(props: ButtonProps) {
    return(


        <Pressable {...props} style={[props?.style, {
            height: heightPixel(40),
            alignItems: 'center',
            paddingVertical: 16,
            justifyContent: 'center',
            borderRadius: 8,

        }]}>

           <ImageBackground resizeMode={'contain'} style={[props?.style,{
               height: heightPixel(40),
               alignItems: 'center',
               flexDirection:'row',
               justifyContent: 'center',
           }]}  source={require('../assets/images/Rectangle.png')}>
            {props.children}
           </ImageBackground>
        </Pressable>
    )

}
