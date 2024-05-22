import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, StyleSheet, Text, View} from "react-native";
import {WebView} from "react-native-webview";
import Constants from "expo-constants";
import {RootStackScreenProps} from "../../../types";



import {fontPixel, heightPixel, pixelSizeVertical} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";


//const BASE_URL_LIVE = DEV_BASE_URL



const BrowserView = ({navigation, route}: RootStackScreenProps<'BrowserView'>) => {
    const {url} = route.params


    const handleNavigationStateChange = (navState: { url: any; }) => {
        const {url} = navState;


        // Check if the URL matches your redirect URL
        if (url.includes('https://www.gatewayapp.co')) {
            //setRedirectUrl(url);
            navigation.replace('ConfirmIdentity',{
                url
            })

            //CLOSE THE BROWSER
            /* console.log("CLOSE THE BROWSER")
             navigation.goBack()*/
        }

        /*  if (url.startsWith('https://gatewayapp.co')) {
            setRedirectUrl(url);
        }*/
    };



    return (<>


            <WebView
                style={styles.container}
                source={{uri: url}}
                onNavigationStateChange={handleNavigationStateChange}
            />

        </>


    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    loadingContainer: {
        width: '90%',
        alignItems: "center",
        height: heightPixel(400),
        justifyContent: 'space-evenly',

    },
    progressBar: {
        backgroundColor: "#BF1314",
        height: '100%',
        borderRadius: 20,
    },
    barContainer: {

        width: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        overflow: 'hidden',

    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: 'center'
    }, avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        alignItems: "center",
        justifyContent: 'center',
        resizeMode: 'cover'
    },
    noticeText: {
        fontSize: fontPixel(24),
        lineHeight: 30,
        color: "#fff",
        textAlign: 'center',
        fontFamily: Fonts.quicksandSemiBold,
        marginVertical: pixelSizeVertical(10)
    },
    subNoticeText: {
        fontSize: fontPixel(14),
        color: "#fff",
        textAlign: 'center',
        fontFamily: Fonts.quicksandMedium
    },
});

export default BrowserView
