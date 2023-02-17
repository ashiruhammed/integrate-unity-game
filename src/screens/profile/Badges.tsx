import React from 'react';

import {Text, View, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import NavBar from "../../components/layout/NavBar";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import HorizontalLine from "../../components/HorizontalLine";
import MedalIcon from "../../assets/images/svg/MedalIcon";
import StarIcon from "../../assets/images/svg/StarIcon";
import {RootStackScreenProps} from "../../../types";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from "react-native-reanimated";
import {useAppSelector} from "../../app/hooks";
import {useQuery} from "@tanstack/react-query";
import {getBadges, getUserBadges} from "../../action/action";
import {useRefreshOnFocus} from "../../helpers";

interface props {


    imageUrl: string
    amount: string
}

const BadgeItem = ({amount, imageUrl}: props) => {
    return (

        <Animated.View key={"badgeItem"} entering={FadeInDown} exiting={FadeOutDown} layout={Layout.easing(Easing.bounce).delay(20)}
                       style={styles.badgeImageWrap}>
            <View style={styles.badgeImageContainer}>
                <Image
                    source={{uri: imageUrl}}
                    style={styles.badgeImage}/>
            </View>


            <View style={styles.badgeStreakScore}>
                <Text style={styles.badgeStreakText}>
                    x{amount}
                </Text>
            </View>
        </Animated.View>


    )
}

const Badges = ({navigation}: RootStackScreenProps<'Badges'>) => {

    const openScreen = (screen: 'AllBadges' | 'NFTs') => {
        navigation.navigate(screen)
    }

    const user = useAppSelector(state => state.user)
    const {userData: {fullName}, userDashboard} = user
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice


    const {isLoading, data: badges, refetch} = useQuery(['getUserBadges'], getUserBadges)


    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    useRefreshOnFocus(refetch)

    return (
        <SafeAreaView style={[styles.safeArea, {
            backgroundColor
        }]}>

            <NavBar title={"Badges"}/>


            <ScrollView
                style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                backgroundColor
            }]} scrollEnabled
                showsVerticalScrollIndicator={false}>


                {
                    isLoading && <ActivityIndicator size='small' color={Colors.primaryColor}/>
                }
                {
                    !isLoading &&
                    <>

                        <View style={styles.streakView}>
                            <View style={styles.streak}>
                                <Image source={require('../../assets/images/streakimage.png')}
                                       style={styles.streakImage}/>

                                <View style={styles.streakScore}>
                                    <Text style={styles.streakText}>
                                        Streak #{userDashboard?.currentDayStreak}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={[styles.buttonsWrap, {borderBottomColor: theme == 'light' ? Colors.borderColor : '#313131'}]}>
                            <TouchableOpacity onPress={() => openScreen('AllBadges')} activeOpacity={0.8}
                                              style={[styles.buttonPress, {
                                                  backgroundColor: '#FFC5BE',
                                              }]}>
                                <MedalIcon/>

                                <Text style={styles.buttonText}>
                                    Badges
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.line}>
                                <View style={[{
                                    height: '70%',
                                    borderColor: theme == 'light' ? Colors.borderColor : '#313131',
                                    borderWidth: 0.6,

                                }]}/>
                            </View>
                            <TouchableOpacity onPress={() => openScreen('NFTs')} activeOpacity={0.8}
                                              style={[styles.buttonPress, {
                                                  backgroundColor: '#D2EB85',
                                              }]}>
                                <StarIcon/>
                                <Text style={styles.buttonText}>
                                    NFT's
                                </Text>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.badgeContainer}>
                            {
                                !isLoading && badges && badges?.data?.length > 0 &&
                                badges?.data?.slice(0, 10)?.map((({
                                                                      id,
                                                                      amount,
                                                                      imageUrl
                                                                  }: { id: string, amount: string, imageUrl: string }) => (
                                    <BadgeItem key={id} amount={amount} imageUrl={imageUrl}/>
                                )))
                            }


                        </View>
                    </>
                }

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    safeArea: {
        width: '100%',
        flex: 1,
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {
        //  backgroundColor: Colors.background,
        width: '100%',
        alignItems: 'center'
    },
    streakView: {
        width: '100%',
        height: heightPixel(200),
        alignItems: 'center',
        justifyContent: "center"
    },
    streak: {
        height: 120,
        width: 120,
        borderRadius: 120,
        borderWidth: 2,
        borderColor: "#701CC5",
        alignItems: 'center',
        justifyContent: 'center'
    },
    streakImage: {
        resizeMode: 'cover',
        height: "100%",
        width: '100%',
        borderRadius: 120,

    },
    streakScore: {
        position: 'absolute',
        bottom: -10,
        borderRadius: 10,
        backgroundColor: "#701CC5",
        minWidth: widthPixel(90),
        height: heightPixel(30),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: pixelSizeHorizontal(10)
    },
    streakText: {
        color: "#fff",
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(14)
    },
    buttonsWrap: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        height: heightPixel(120),

        borderBottomWidth: 1,
    },
    buttonPress: {
        height: 48,
        width: 137,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: "#212121",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,

        elevation: 3,
    },
    buttonText: {
        color: Colors.light.text,
        fontFamily: Fonts.quicksandSemiBold,
        fontSize: fontPixel(14)
    },
    line: {
        width: '5%',

        alignItems: 'center',
        justifyContent: 'flex-end',
        height: "100%",
    },
    badgeContainer: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        paddingHorizontal: pixelSizeHorizontal(20)
    },

    badgeImageWrap: {
        height: heightPixel(110),
        width: widthPixel(85),
        alignItems: 'center',
        margin: 10,
        justifyContent: 'center',
    },
    badgeImageContainer: {
        height:80,
        width: 80,
 alignItems:'center',
        justifyContent:'center'

    },
    badgeImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',

    },
    badgeItemBody: {
        marginLeft: 15,
        height: '80%',
        width: '75%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },

    badgeStreakScore: {
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
    badgeStreakText: {
        color: Colors.light.text,
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(12)
    },


})

export default Badges;
