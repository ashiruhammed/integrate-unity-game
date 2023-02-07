import {Animated, TextStyle, TouchableOpacity, View, StyleSheet} from "react-native";

import {TabButtonLayout, TabElementDisplayOptions} from "./types";
import {isIphoneX} from "./utils/isIphoneX";
import React from "react";


// Config
const BOTTOM_PADDING = 10;
const BOTTOM_PADDING_IPHONE_X = 20;

interface IBottomTabBarWrapper {
    floating?: boolean;
    shadow?: boolean;
    tabBarBackground: string;
    topPadding: number;
    horizontalPadding: number;
    bottomPadding: number;
    children: any;
}



let value = isIphoneX() ? BOTTOM_PADDING_IPHONE_X : BOTTOM_PADDING

const BottomTabBarWrapper = ({
                                 floating,
                                 tabBarBackground,
                                 topPadding,
                                 horizontalPadding,
                                 bottomPadding,
                                 children
                             }: IBottomTabBarWrapper) => (


    <View style={[{
        shadowColor: "#000",

        shadowOffset:{
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 2.41,
        flexDirection: "row",
        marginHorizontal: floating ? 20 : 0,
        elevation: 2,
        marginBottom: floating  ? value : 0 ,
        borderRadius: floating ? 40 : 0,
        paddingBottom: floating ? bottomPadding
            : isIphoneX()
                ? BOTTOM_PADDING_IPHONE_X + bottomPadding
                : bottomPadding,
        paddingTop: topPadding,
        paddingHorizontal: horizontalPadding,
        backgroundColor: tabBarBackground,
    }]}>
        {children}
    </View>
)


interface ILabelProps {
    whenInactiveShow?: TabElementDisplayOptions;
    whenActiveShow?: TabElementDisplayOptions;
    tabButtonLayout?: TabButtonLayout;
    activeColor: string;
    children: any,
    style: TextStyle
}

interface ITabButton {
    tabButtonLayout: TabButtonLayout;
    focused: boolean;
    labelLength: number;
    children: any,
    props: any,
}


const TabButton = ({tabButtonLayout, focused, labelLength, children, props}: ITabButton) => (
    <TouchableOpacity activeOpacity={0.5}  {...props} style={[styles.tabButton, {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center',

        // @ts-ignore
    }]}>
        {children}
    </TouchableOpacity>
)

const Label = ({style, activeColor, children}: ILabelProps) => (
    <Animated.Text style={[style, {
        color: activeColor,

        marginTop:5,
    }]}>
        {children}
    </Animated.Text>
)




const styles = StyleSheet.create({
    tabButton: {
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        borderRadius: 10,
        paddingVertical: 10,

    },

})

export {BottomTabBarWrapper, Label, TabButton};
