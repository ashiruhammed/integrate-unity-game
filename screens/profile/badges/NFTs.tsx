import React from 'react';

import {Text, View, StyleSheet, Platform, Image} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import NavBar from "../../../components/layout/NavBar";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../../helpers/normalize";
import Colors from "../../../constants/Colors";
import {Fonts} from "../../../constants/Fonts";
import FruitIcon from "../../../assets/images/svg/FruitIcon";
import WarmIcon from "../../../assets/images/svg/WarmIcon";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from 'react-native-reanimated';
import {useAppSelector} from "../../../app/hooks";


const NFTs = () => {

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice


    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    return (
        <SafeAreaView style={[styles.safeArea,{
            backgroundColor
        }]}>
            <NavBar title={"NFT's"}/>
            <View
                style={[styles.scrollView,{
                    backgroundColor
                }]}
            >

                <Animated.View key={"badgeItem"} entering={FadeInDown} exiting={FadeOutDown} layout={Layout.easing(Easing.bounce).delay(20)}
                               style={[styles.badgeItem,{
                                   backgroundColor,
                                   borderBottomColor: theme == 'light' ? Colors.borderColor : '#313131',
                               }]}>
                    <View style={styles.badgeImageWrap}>
                        <Image
                            source={{uri: 'https://res.cloudinary.com/dijyr3tlg/image/upload/v1672951469/gateway/Group_151_cret7t.png'}}
                            style={styles.badgeImage}/>

                        <View style={styles.streakScore}>
                            <Text style={[styles.streakText]}>
                                x1
                            </Text>
                        </View>
                    </View>

                    <View style={styles.badgeItemBody}>
                        <Text style={[styles.badgeTitle,{
                            color:textColor
                        }]}>
                            Blue Badge
                        </Text>
                        <Text style={styles.badgeSubText}>
                            used to get exclusive access to top communities
                        </Text>


                        <View style={styles.progressBarContainer}>

                            <View style={styles.progressBar}>
                                <View style={styles.Bar}/>

                            </View>
                            <Text style={[styles.badgeSubText, {
                                marginLeft: 10,
                            }]}>
                                1/100
                            </Text>
                        </View>

                    </View>
                </Animated.View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        backgroundColor: "#fff",
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {
        flex: 1,
        //  backgroundColor: Colors.background,
        backgroundColor: "#fff",
        width: '100%',
        alignItems: 'center'
    },
    badgeItem: {

        width: '90%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: heightPixel(120),

        borderBottomWidth: 1,
    },
    badgeImageWrap: {
        height: heightPixel(110),
        width: widthPixel(85),
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'center',

    },
    badgeItemBody: {
        marginLeft: 15,
        height: '80%',
        width: '75%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    badgeTitle: {

        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandSemiBold
    },
    badgeSubText: {

        color: Colors.light.lightTextColor,
        fontSize: fontPixel(14),
        lineHeight: heightPixel(18),
        fontFamily: Fonts.quicksandMedium
    },
    barWrap: {
        height: 30,
        width: '100%'
    },

    progressBarContainer: {
        width: '100%',
        height: heightPixel(30),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    progressBar: {
        width: '75%',
        height: 8,
        borderRadius: 10,
        justifyContent:'center',
        backgroundColor: '#DEDEDE'
    },
    Bar: {
        width: widthPixel(50),
        height: '100%',
        borderRadius: 10,
        backgroundColor: "#325CEE"
    },
    streakScore: {
        position: 'absolute',
        bottom: 10,
        right: 5,
        borderRadius: 10,
        backgroundColor: "#fff",
        width: widthPixel(35),
        height: heightPixel(18),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: pixelSizeHorizontal(5),
        shadowColor: "#212121",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,

        elevation: 3,
    },
    streakText: {
        color: Colors.light.text,
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(12)
    },

})

export default NFTs;
