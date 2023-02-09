import {ButtonProps, TouchableOpacity} from "../Themed";

import {ImageBackground, Platform, Pressable, Text,Image} from "react-native";
import Rectangle from "../../assets/images/svg/Rectangle";
import {fontPixel, heightPixel, widthPixel} from "../../helpers/normalize";
import React from "react";
import {Fonts} from "../../constants/Fonts";

export function SmallRectButton(props: ButtonProps) {
    return Platform.OS === 'android' ? <TouchableOpacity activeOpacity={0.6} {...props} style={[props?.style, {

            height: heightPixel(35),
            alignItems: 'center',
            paddingVertical: 16,
            justifyContent: 'center',
            borderRadius: 8,

        }]}>
            <ImageBackground style={{
                height: heightPixel(35),
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection:'row',
                minWidth:widthPixel(150)}}  source={require('../../assets/images/Rectangle.png')}>
            {props.children}

            </ImageBackground>
        </TouchableOpacity>
        :

        <Pressable {...props} style={[props?.style, {
            height: heightPixel(45),
            width:widthPixel(80),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,


        }]}>

               <ImageBackground  resizeMode='contain' style={{
               height: heightPixel(25),
            width:'100%',
               alignItems: 'center',
               flexDirection:'row',
               justifyContent: 'center',
           }}  source={require('../../assets/images/RectangleSmall.png')}>
            {props.children}
           </ImageBackground>
        </Pressable>

}
