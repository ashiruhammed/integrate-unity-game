import React, {useEffect, useRef, useState} from 'react';

import {Text, View, StyleSheet, Share, Platform, TouchableOpacity} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {ScrollView} from "react-native-gesture-handler";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../../helpers/normalize";
import NavBar from "../../../components/layout/NavBar";
import LottieView from 'lottie-react-native';
import Colors from "../../../constants/Colors";
import {Fonts} from "../../../constants/Fonts";
import {RectButton} from "../../../components/RectButton";
import * as Clipboard from "expo-clipboard";
import {useQuery} from "@tanstack/react-query";
import {generateReferralCode} from "../../../action/action";
import {useAppSelector} from "../../../app/hooks";
import {truncate, truncateString} from "../../../helpers";
import Toast from "../../../components/Toast";
import {unSetResponse} from "../../../app/slices/userSlice";


const ReferAFriend = () => {


    const dataSlice = useAppSelector(state => state.data)
    const user = useAppSelector(state => state.user)
    const {theme} = dataSlice
    const {userData, responseMessage, responseType, responseState} = user
    const [copied, setCopied] = useState(false);
    const animation = useRef(null);
    useEffect(() => {
        // You can control the ref programmatically, rather than using autoPlay
        // animation.current?.play();
    }, []);


    const {isLoading, data} = useQuery(['generateReferralCode'], generateReferralCode)


    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const copyToClipboard = async (content: string) => {
        await Clipboard.setStringAsync(content);
        setCopied(true)
    };

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Hello, ${userData?.username} is inviting you to join Gateway using the referral link https://www.gatewayapp.co/auth/sign-up?ref=@${userData?.username}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };


    useEffect(() => {

        let time: NodeJS.Timeout | undefined;
        if (responseState || responseMessage) {

            time = setTimeout(() => {
                setCopied(false)
            }, 3000)

        }
        return () => {
            clearTimeout(time)
        };
    }, [responseState, responseMessage])


    return (
        <SafeAreaView style={[styles.safeArea, {
            backgroundColor
        }]}>
            <Toast message={"Referral link copied"} state={copied} type={'info'}/>
            <ScrollView
                style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                backgroundColor
            }]} scrollEnabled
                showsVerticalScrollIndicator={false}>

                <NavBar noBell title={"Refer a friend"}/>
                <View style={[styles.topDashboard, {backgroundColor}]}>
                    <LottieView
                        autoPlay
                        ref={animation}
                        resizeMode='cover'
                        style={{
                            width: "100%",
                            height: 240,

                        }}
                        // Find more Lottie files at https://lottiefiles.com/featured
                        source={require('../../../assets/lottie/gift_comp.json')}
                    />
                </View>


                <View style={styles.copyBoxy}>
                    <View style={styles.copyItem}>

                        <Text style={styles.copyValue}>
                            {truncateString(`https://www.gatewayapp.co/auth/sign-up?ref=@${userData?.username}`, 25)}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => copyToClipboard(`https://www.gatewayapp.co/auth/sign-up?ref=@${userData?.username}`)}
                        activeOpacity={0.8} style={styles.copyBtn}>
                        <Text style={styles.btnText}>COPY</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.information}>

                    <Text style={[styles.informationText, {
                        color: textColor
                    }]}>
                        Invite your friends to join gateway and get 20points for each friend that joins using your
                        referral code
                    </Text>

                </View>
                <View style={styles.buttonWrap}>


                    <RectButton onPress={onShare} style={{width: 160}}>
                        <Text style={styles.buttonText}>
                            Invite Now

                        </Text>
                    </RectButton>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {
        //  backgroundColor: Colors.background,
        width: '100%',
        alignItems: 'center'
    },
    topDashboard: {
        height: heightPixel(260),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',

    },
    copyBoxy: {
        width: widthPixel(240),
        borderRadius: 30,
        height: heightPixel(45),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.borderColor

    },
    copyValue: {
        fontSize: fontPixel(12),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
    },
    copyItem: {
        width: '70%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    copyBtn: {
        width: '30%',
        height: '100%',
        backgroundColor: "#1F1F1F",
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        fontSize: fontPixel(16),
        fontFamily: Fonts.quickSandBold,
        color: "#fff",

    },
    information: {
        width: '80%',
        alignItems: 'center',
        marginVertical: pixelSizeVertical(20),
    },
    informationText: {
        textAlign: 'center',
        lineHeight: heightPixel(25),
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
        color: Colors.light.text,

    },
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    buttonWrap: {
        height:heightPixel(200),

        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: pixelSizeHorizontal(20)
    }
})

export default ReferAFriend;
