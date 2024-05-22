import React, {useEffect, useState} from 'react';

import {Text, View, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import Constants from "expo-constants";
import {fontPixel, heightPixel, pixelSizeVertical} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {RootStackScreenProps} from "../../../types";
import Animated, {
    FadeInDown, FadeOutDown,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import {useQuery} from "@tanstack/react-query";
import {getCCDWallet} from "../../action/action";
import {BASE_URL, ACCESS_TOKEN, DEV_BASE_URL} from "@env";
import SwipeAnimatedToast from "../../components/toasty";
import {addNotificationItem} from "../../app/slices/dataSlice";
import {useAppDispatch} from "../../app/hooks";
import data from "../../components/accordion/AccordionData";
import Colors from '../../constants/Colors';

const BASE_URL_LIVE = __DEV__ ? DEV_BASE_URL : BASE_URL


const ConfirmIdentity = ({navigation, route}: RootStackScreenProps<'ConfirmIdentity'>) => {

    const {url} = route.params

    const [loading, setLoading] = useState(false)

    const dispatch = useAppDispatch()
    let count = 1;
    const width = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(width.value, {
                duration: 10
            }),
        };
    });


    function getCodeUriFromUrl(url: string) {
        // Use URLSearchParams to parse the URL
        const params = new URLSearchParams(url.split('#')[1]);

        // Extract the value of code_uri parameter
        const codeUri = params.get('code_uri');

        return codeUri;
    }


    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!loading || count > 200) {
                clearInterval(intervalId);

            } else {

                width.value = count++

            }
        }, 100);

        return () => {
            clearInterval(intervalId);
        }
    }, [count, loading]);


    const closeWindow = () => {
        navigation.navigate('Concordium')
    }


    const position = useSharedValue(0);

    const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withSpring(50, {damping: 2, stiffness: 80}),
            -1,
            true
        );
    }, [])
    useEffect(() => {
        position.value = withRepeat(
            withSpring(1, {damping: 2, stiffness: 80}),
            -1,
            true
        );
    }, []);

    const {refetch} = useQuery(['getCCDwallet'], getCCDWallet)


    useEffect(() => {
        (async () => {
            setLoading(true)

            let Token = await SecureStore.getItemAsync('Gateway-Token');
            const code_url = getCodeUriFromUrl(url)

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

                    if (result.success) {
                        refetch()
                        dispatch(addNotificationItem({
                            id: Math.random(),
                            type: 'success',
                            body: "Identity confirm",
                        }))
                        navigation.navigate('Concordium')

                    } else {
                        dispatch(addNotificationItem({
                            id: Math.random(),
                            type: 'error',
                            body: result.message,
                        }))
                        setLoading(false)
                        //console.log(result)
                    }

                })
                .catch((error) => {
                    setLoading(false)
                    console.error(error)
                });


        })()
    }, [url]);


    return (
        <SafeAreaView style={[styles.container, {
            alignItems: 'center',
            width: '100%',
            backgroundColor: "#000"
        }]}>
            <SwipeAnimatedToast/>
            <View style={styles.loadingContainer}>

                <View style={styles.avatar}>
                    <Image
                        source={{uri: "https://cdni.iconscout.com/illustration/premium/thumb/wallet-7893040-6294380.png?f=webp"}}
                        style={styles.avatarImage}/>
                </View>

                <Text style={styles.subNoticeText}>
                    Please wait while we create your wallet...
                </Text>


                <Animated.View key={count}
                               entering={FadeInDown.springify()} exiting={FadeOutDown}
                               style={styles.loadingView}>
                    <Animated.View style={[styles.loadingViewBorder, animatedStyle]}/>

                </Animated.View>

            </View>


            {loading && <ActivityIndicator color={"#fff"} size={'small'}/>}


            {
                !loading &&

                <Text onPress={closeWindow} style={styles.closeNow}>
                    Close window
                </Text>
            }
        </SafeAreaView>
    );
};

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
    loadingViewBorder: {

        borderColor: "#BF1314",
        borderWidth: 3,
        borderRadius: 5,
    },
    closeNow: {
        fontSize: fontPixel(16),
        color: "#eee",
        fontFamily: Fonts.quicksandMedium
    },
    loadingView: {
        width: '90%',
        height: 40,
        // paddingHorizontal:pixelSizeHorizontal(10),
        borderRadius: 3,
        //backgroundColor: '#fff',
        alignContent: 'center',
        alignItems: 'flex-start',
        justifyContent: 'center',

    },
})

export default ConfirmIdentity;
