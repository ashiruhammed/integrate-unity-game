import {ButtonProps, TouchableOpacity} from "../Themed";

import {ImageBackground,StyleSheet, Platform, Pressable, Text,Image} from "react-native";
import Rectangle from "../../assets/images/svg/Rectangle";
import {fontPixel, heightPixel, widthPixel} from "../../helpers/normalize";
import React from "react";
import {Fonts} from "../../constants/Fonts";


const styles = StyleSheet.create({
    smallBtn:{
        height: heightPixel(45),
        width:widthPixel(80),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    imgBck:{
        height: heightPixel(25),
        width:'100%',
        alignItems: 'center',
        flexDirection:'row',
        justifyContent: 'center',
    }
})

export function SmallRectButton(props: ButtonProps) {
   return(

        <Pressable {...props} style={[props?.style,styles.smallBtn]}>

               <ImageBackground  resizeMode='contain' style={styles.imgBck}  source={require('../../assets/images/RectangleSmall.png')}>
            {props.children}
           </ImageBackground>
        </Pressable>
   )

}
