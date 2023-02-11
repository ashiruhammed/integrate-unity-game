import React from 'react';

import {Text, View, StyleSheet, Platform, ActivityIndicator, Image, ImageBackground} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import NavBar from "../../components/layout/NavBar";
import {RootStackScreenProps} from "../../../types";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import Colors from "../../constants/Colors";
import {Fonts} from "../../constants/Fonts";
import {Ionicons} from "@expo/vector-icons";
import {useQuery} from "@tanstack/react-query";
import {generateReferralHistory, getReferralLeaderboard} from "../../action/action";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from "react-native-reanimated";
import {useRefreshOnFocus} from "../../helpers";
import {useAppSelector} from "../../app/hooks";

const Leaderboard = ({}: RootStackScreenProps<'Leaderboard'>) => {

    const {isLoading, data, refetch} = useQuery(['getReferralLeaderboard'], getReferralLeaderboard)

    useRefreshOnFocus(refetch)
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    // ref

   // console.log(data?.data?.result)

    return (
        <SafeAreaView style={[styles.safeArea,{
            backgroundColor
        }]}>
            <KeyboardAwareScrollView
                style={{width: '100%',}} contentContainerStyle={[styles.scrollView,{
                backgroundColor
            }]} scrollEnabled
                showsVerticalScrollIndicator={false}>
                <NavBar title={"Leaderboard"}/>


                <View style={[styles.topDashboard,{
                    backgroundColor
                }]}>
                    <View style={styles.leaderboardWrap}>

                        <View style={[styles.leaderboard,{
                            height: 80,
                            width: 80,
                            borderRadius: 120,
                            borderWidth: 3,
                            borderColor: "#F3D42D",
                        }]}>
                            <Image source={{uri:'https://res.cloudinary.com/dijyr3tlg/image/upload/v1672969187/gateway/Ellipse_107_y39fkd.png'}} style={styles.streakImage}/>

                            <View style={[styles.leaderboardScore,{
                                backgroundColor: "#F3D42D",
                            }]}>
                                <Text style={styles.streakText}>
                                    2
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.leaderboardText,{
                            color: textColor
                        }]}>
                            Francisca
                        </Text>
                    </View>

                    <ImageBackground resizeMode={"cover"}
                                     source={require('../../assets/images/TopLeaderBgImage.png')}
                                     style={[styles.leaderboardWrap,{
                                         alignItems: 'center',
                                         justifyContent: 'space-evenly',
                                         height: heightPixel(220),
                                         width: widthPixel(160)
                                     }]}>
                        <Image source={require('../../assets/images/crownimage.png')} style={{
                            width:'90%',
                            height:25,
                            resizeMode:'contain'
                        }}/>

                        <View style={[styles.leaderboard,{
                            height: 120,
                            width: 120,
                            borderRadius: 120,
                            borderWidth: 3,
                            borderColor: "#701CC5",
                        }]}>
                            <Image source={{uri:'https://res.cloudinary.com/dijyr3tlg/image/upload/v1672969232/gateway/Ellipse_105_rvuxgz.png'}} style={styles.streakImage}/>

                            <View style={[styles.leaderboardScore,{
                                backgroundColor: "#701CC5",
                            }]}>
                                <Text style={styles.streakText}>
                                    2
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.leaderboardText,{
                            color: textColor
                        }]}>
                            David
                        </Text>
                    </ImageBackground>
                    <View style={styles.leaderboardWrap}>

                        <View style={[styles.leaderboard,{
                            height: 80,
                            width: 80,
                            borderRadius: 120,
                            borderWidth: 2,
                            borderColor: "#3AB8A9",
                        }]}>
                            <Image source={require('../../assets/images/streakimage.png')} style={styles.streakImage}/>

                            <View style={[styles.leaderboardScore,{

                                backgroundColor: "#3AB8A9",
                            }]}>
                                <Text style={styles.streakText}>
                                    2
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.leaderboardText,{
                            color: textColor
                        }]}>
                            Temi
                        </Text>
                    </View>
                </View>

                <View style={styles.scoreBoard}>
                    <Text style={styles.currentRankText}>
                        Your Current Rank
                    </Text>
                    <View style={styles.scoreRank}>
                        <Text style={styles.currentRankText}>
                            200
                        </Text>
                        <View style={styles.caret}>
                            <Ionicons name="md-caret-up-outline" size={18} color={Colors.success}/>
                        </View>
                    </View>

                </View>


                <View style={styles.listContainer}>

                    {
                        isLoading && <ActivityIndicator size="small" color={Colors.primaryColor}/>
                    }
                    {
                        !isLoading && data &&
                        data?.data?.result.map((item, index) => (

                            <Animated.View key={"transactions" + index.toString()} entering={FadeInDown}
                                           exiting={FadeOutDown} layout={Layout.easing(Easing.bounce).delay(20)}
                                           style={styles.listCard}>
                                <View style={styles.leftCard}>
                                    <View style={styles.listCardImage}>
                                        <Image source={{uri: !item?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'  : item?.avatar}} style={styles.avatar}/>

                                    </View>
                                    <Text style={[styles.cardText,{
                                        color: textColor
                                    }]}>
                                        {item.fullName}
                                    </Text>
                                </View>

                                <View style={styles.scoreRank}>
                                    <Text style={[styles.cardText,{
                                        color: textColor
                                    }]}>
                                        {item?.noOfReferrals}
                                    </Text>
                                    <View style={[styles.caret, {
                                        backgroundColor: "#EAEAEA"
                                    }]}>
                                        <Ionicons name="md-caret-up-outline" size={14} color={Colors.success}/>
                                    </View>
                                </View>

                            </Animated.View>
                        ))
                    }
                    {/*        <View style={styles.listCard}>
                        <View style={styles.leftCard}>
                            <View style={styles.listCardImage}>

                            </View>
                            <Text style={styles.cardText}>
                                Peter
                            </Text>
                        </View>

                        <View style={styles.scoreRank}>
                            <Text style={styles.cardText}>
                                10
                            </Text>
                            <View style={[styles.caret,{
                                backgroundColor: "#EAEAEA"
                            }]}>
                                <Ionicons name="md-caret-down-outline" size={14} color={Colors.errorRed}/>
                            </View>
                        </View>

                    </View>*/}
                </View>

            </KeyboardAwareScrollView>
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
    topDashboard: {

        height: heightPixel(230),
        width: '100%',
        flexDirection:'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    scoreBoard: {
        marginTop:20,
        height: heightPixel(45),
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: pixelSizeHorizontal(20),
        backgroundColor: Colors.primaryColor,
        borderRadius: 20
    },
    currentRankText: {
        color: "#fff",
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(16)
    },
    scoreRank: {
        minWidth: widthPixel(50),
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    caret: {
        marginLeft: 8,
        width: 20,
        height: 20,
        backgroundColor: "#fff",
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listCard: {
        marginVertical: pixelSizeVertical(5),
        width: '90%',
        height: heightPixel(60),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    leftCard: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '90%'
    },
    listCardImage: {
        width: 40,
        height: 40,
        borderRadius: 45,
        backgroundColor: Colors.primaryColor
    },
    avatar: {
        borderRadius: 40,
        resizeMode: 'cover',
        width: "100%",
        height: "100%",
    },
    listContainer: {
        marginTop: 30,
        width: '100%',
        alignItems: 'center'
    },
    cardText: {
        marginLeft: 10,
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(16)
    },
    leaderboardWrap: {
        height: heightPixel(150),
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: widthPixel(120)
    },
    leaderboard: {

        alignItems: 'center',
        justifyContent: 'center'
    },
    streakImage: {
        resizeMode: 'cover',
        height: "100%",
        width: '100%',
        borderRadius: 120,

    },
    leaderboardScore: {
        position: 'absolute',
        bottom: -10,
        borderRadius: 30,

        minWidth: widthPixel(16),
        height: heightPixel(16),
        alignItems: 'center',

        justifyContent: 'center',
    },
    streakText: {
        color: "#fff",
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(14)
    },
    leaderboardText: {
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(16)
    },

})

export default Leaderboard;
