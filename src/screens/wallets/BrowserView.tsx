import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, StyleSheet, Text, View} from "react-native";
import {WebView} from "react-native-webview";
import Constants from "expo-constants";
import {RootStackScreenProps} from "../../../types";
import * as SecureStore from "expo-secure-store";
import {BASE_URL, ACCESS_TOKEN, DEV_BASE_URL} from "@env";
import {SafeAreaView} from "react-native-safe-area-context";
import {useQuery} from "@tanstack/react-query";
import {getCCDWallet} from "../../action/action";
import Colors from "../../constants/Colors";
import Animated, {useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming} from "react-native-reanimated";
import {fontPixel, heightPixel, pixelSizeVertical} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
const BASE_URL_LIVE = __DEV__ ? DEV_BASE_URL : BASE_URL
//const BASE_URL_LIVE = DEV_BASE_URL




const CustomProgressBar = ({ progress, width, height }) => {
    const animatedProgress = useSharedValue(0);

    React.useEffect(() => {
        animatedProgress.value = withTiming(progress, { duration: 1000 });
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${animatedProgress.value * 100}%`,
    }));

    return (
        <View style={[styles.barContainer, {  height }]}>
            <Animated.View style={[styles.progressBar, animatedStyle]} />
        </View>
    );
};

const BrowserView = ({navigation,route}: RootStackScreenProps<'BrowserView'>)=>{
    const {url} = route.params
    const [redirectUrl, setRedirectUrl] = useState(null);

    const [loading, setLoading] = useState(false)
    const handleNavigationStateChange = (navState: { url: any; }) => {
        const { url } = navState;


        // Check if the URL matches your redirect URL
        if (url.startsWith('https://gatewayapp.co')) {
            setRedirectUrl(url);
        }
    };



    const [progress, setProgress] = React.useState(0);



    const position = useSharedValue(0);

    const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withSpring(50, {damping: 2, stiffness: 80}),
            -1,
            true
        );
    },[])
    useEffect(() => {
        position.value = withRepeat(
            withSpring(1, { damping: 2, stiffness: 80 }),
            -1,
            true
        );
    }, []);

    const {refetch} = useQuery(['getCCDwallet'], getCCDWallet)


    function getCodeUriFromUrl(url) {
        // Use URLSearchParams to parse the URL
        const params = new URLSearchParams(url.split('#')[1]);

        // Extract the value of code_uri parameter
        const codeUri = params.get('code_uri');

        return codeUri;
    }



    useEffect(() => {
        (async ()=>{


            if(redirectUrl !== null){
                setLoading(true)
                let Token = await SecureStore.getItemAsync('Gateway-Token');
              const code_url =  getCodeUriFromUrl(redirectUrl)
console.log(code_url)
                const myHeaders = {
                    'Authorization': `Bearer ${Token}`,
                    'Content-Type': 'application/json',
                    'x-access-token': ACCESS_TOKEN,
                    'x-client-type': 'web',
                }

                const raw = JSON.stringify({
                    "codeUrl": code_url
                });

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,

                };

                fetch(`${BASE_URL_LIVE}/wallet/confirm-identity`, requestOptions)
                    .then((response) => response.json())
                    .then((result) => {

                        if(result.success){
                            refetch()
                            setLoading(false)

                            navigation.navigate('Concordium')

                        }else{
                            setLoading(false)
                            console.log(result)
                        }

                    })
                    .catch((error) => {
                        setLoading(false)
                        console.error(error)
                    });

            }

        })()
    }, [redirectUrl]);


    useEffect(() => {
        if(!loading) {
            const interval = setInterval(() => {
                setProgress((prevProgress) => (prevProgress >= 1 ? 0 : prevProgress + 0.1));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, []);



    return(<>
            {
                loading ?

        <SafeAreaView style={[styles.container,{
            alignItems:'center',
            width:'100%',
            backgroundColor:"#000"
        }]}>
            <View style={styles.loadingContainer}>

                <View style={styles.avatar}>
                    <Image source={{uri:"https://cdni.iconscout.com/illustration/premium/thumb/wallet-7893040-6294380.png?f=webp"}} style={styles.avatarImage}/>
                </View>

                <Text style={styles.subNoticeText}>
                    Please wait while we create your wallet...
                </Text>

                <CustomProgressBar progress={progress} width={200} height={16} />
            </View>

        </SafeAreaView>

           :
        <WebView
            style={styles.container}
            source={{uri:url}}
            onNavigationStateChange={handleNavigationStateChange}
        />
            }
    </>


    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    loadingContainer:{
        width:'90%',
        alignItems:"center",
        height:heightPixel(400),
        justifyContent:'space-evenly',

    },
    progressBar: {
        backgroundColor:"#BF1314",
        height: '100%',
        borderRadius:20,
    },
    barContainer: {

        width:'100%',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        overflow: 'hidden',

    },
    avatar:{
    width:88,
        height:88,
        borderRadius:100,
        alignItems:"center",
        justifyContent:'center'
}, avatarImage:{
    width:'100%',
        height:'100%',
        borderRadius:100,
        alignItems:"center",
        justifyContent:'center',
        resizeMode:'cover'
},
noticeText:{
    fontSize:fontPixel(24),
        lineHeight:30,
        color:"#fff",
        textAlign:'center',
        fontFamily:Fonts.quicksandSemiBold,
        marginVertical:pixelSizeVertical(10)
},
subNoticeText:{
    fontSize:fontPixel(14),
        color:"#fff",
        textAlign:'center',
        fontFamily:Fonts.quicksandMedium
},
});

export default BrowserView
