import React from 'react';

import {Text, View, StyleSheet, ScrollView, Platform, TouchableOpacity, Image, ImageBackground} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {EvilIcons, Ionicons, MaterialCommunityIcons, Octicons} from "@expo/vector-icons";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import Svg, {Circle, Path} from "react-native-svg";
import FruitIcon from "../../assets/images/svg/FruitIcon";
import WarmIcon from "../../assets/images/svg/WarmIcon";
import HorizontalLine from "../../components/HorizontalLine";
import AdventuresIcon from "../../assets/images/tabs/home/AdventuresIcon";
import {RootTabScreenProps} from "../../../types";
import {logoutUser, updateUserDashboard, updateUserInfo} from "../../app/slices/userSlice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useQuery} from "@tanstack/react-query";
import {getUser, getUserDashboard} from "../../action/action";
import Constants from "expo-constants";
import FastImage from "react-native-fast-image";
import {useRefreshOnFocus} from "../../helpers";


const isRunningInExpoGo = Constants.appOwnership === 'expo'
const Profile = ({navigation}: RootTabScreenProps<'Profile'>) => {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)
    const {userData,userDashboard} = user

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const openNotifications = ()=>{
        navigation.navigate('Notifications')
    }




    const {isLoading: loadingUser, isRefetching, refetch} = useQuery(['getUserDashboard'], getUserDashboard, {

        onSuccess: (data) => {
            if (data.success) {

                dispatch(updateUserDashboard(data.data))

            }
        },
    })

useRefreshOnFocus(refetch)
    const openScreen = (screen: 'EditProfile' | 'Wallet' | 'Leaderboard' | 'Badges' | 'Settings' | 'MyReferrals') => {
        navigation.navigate(screen)
    }

    return (
        <SafeAreaView style={[styles.safeArea,{
            backgroundColor
        }]}>
            <ScrollView
                style={{width: '100%',}} contentContainerStyle={[styles.scrollView,{
                backgroundColor
            }]} scrollEnabled
                showsVerticalScrollIndicator={false}>


                <ImageBackground resizeMode={"cover"} source={require('../../assets/images/ellipse.png')}
                                 style={styles.topCover}>
                    <View style={styles.topBar}>

                        <View style={styles.leftButton}>

                        </View>

                        <View style={styles.rightButton}>
                            <TouchableOpacity onPress={openNotifications} activeOpacity={0.6}
                                              style={styles.roundTopBtn}>
                                <View style={styles.dot}/>
                                <Octicons name="bell-fill" size={22} color={"#fff"}/>
                            </TouchableOpacity>

                        </View>

                    </View>


                    {/*   */}
                    <View style={styles.userImage}>
                        <Svg height="100%" width="100%" viewBox="0 0 100 100">
                            <Circle

                                cx="50"
                                cy="50"
                                r="45"
                                strokeLinejoin={'bevel'}
                                strokeLinecap={'round'}
                                strokeDasharray={8}
                                strokeWidth="4"
                                fill="none"
                                stroke={Colors.primaryColor}
                            />
                        </Svg>
                        <View style={styles.profileImage}>


                            {
                                isRunningInExpoGo ?
                                    <Image
                                        style={styles.Image}
                                        source={{
                                            uri: !user.userData?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' :  user.userData?.avatar,

                                        }}
                                    />
                                    :

                                    <FastImage
                                        style={styles.Image}
                                        source={{
                                            uri: !user.userData?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' :  user.userData?.avatar,

                                            cache: FastImage.cacheControl.web,
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                            }

                        </View>
                    </View>
                </ImageBackground>


                <View style={styles.fullNameWrap}>
                    <Text style={[styles.fullName,{
                        color: textColor
                    }]}>
                        {userData.fullName}
                    </Text>
                </View>

                <View style={styles.progressBarContainer}>
                    <FruitIcon/>
                    <View style={styles.progressBar}>
                        <View style={styles.Bar}/>

                    </View>
                    <WarmIcon/>
                </View>

                <View style={styles.boardsView}>
                    <View style={styles.topBoard}>

                        <View style={styles.boardWrap}>
                            <Text style={[styles.boardText,{
                                color:textColor,
                            }]}>
                                Total points
                            </Text>
                            <View style={[styles.board,{
                                backgroundColor
                            }]}>
                                <View style={styles.boardIcon}>
                                    <Ionicons name="gift" size={28} color="#22BB33"/>
                                </View>
                                <View style={styles.numberWrap}>

                                    <Text style={[styles.boardText, {
                                        color:textColor,
                                        fontSize: fontPixel(24),
                                    }]}>
                                        {userDashboard?.totalAccruedPoint}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.boardWrap}>
                            <Text style={[styles.boardText,{
                                color:textColor,
                            }]}>
                                Daily Streaks
                            </Text>
                            <View style={[styles.board,{
                                backgroundColor
                            }]}>
                                <View style={styles.boardIcon}>
                                    <Image style={styles.boardIconImage}
                                           source={require('../../assets/images/trophies.png')}/>
                                </View>


                                <View style={styles.numberWrap}>

                                    <Text style={[styles.boardText, {
                                        color:textColor,
                                        fontSize: fontPixel(24),
                                    }]}>
                                        {userDashboard?.currentDayStreak}
                                    </Text>
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={styles.topBoard}>
                        <View style={styles.boardWrap}>
                            <Text style={[styles.boardText,{
                                color:textColor,
                            }]}>
                                Adventures Completed
                            </Text>
                            <View style={[styles.board,{
                                backgroundColor
                            }]}>
                                <View style={styles.boardIcon}>
                                    <AdventuresIcon/>
                                </View>

                                <View style={styles.numberWrap}>

                                    <Text style={[styles.boardText, {
                                        color:textColor,
                                        fontSize: fontPixel(24),
                                    }]}>
                                        {userDashboard?.completedAdventures}
                                    </Text>
                                </View>

                            </View>
                        </View>

                        <View style={styles.boardWrap}>
                            <Text style={[styles.boardText,{
                                color:textColor,
                            }]}>
                                Obtained Badges
                            </Text>
                            <View style={[styles.board,{
                                backgroundColor,
                                shadowColor: theme == 'light' ? "#212121" : '#000',
                            }]}>
                                <View style={styles.boardIcon}>
                                    <Image style={styles.boardIconImage}
                                           source={require('../../assets/images/BadgeIcon.png')}/>
                                </View>

                                <View style={styles.numberWrap}>

                                    <Text style={[styles.boardText, {
                                        color:textColor,
                                        fontSize: fontPixel(24),
                                    }]}>
                                        {userDashboard?.totalBadges}
                                    </Text>
                                </View>
                            </View>
                        </View>

                    </View>
                </View>

                <HorizontalLine width={"90%"} color={theme == 'light' ? Colors.borderColor : '#313131'}/>


                <View style={styles.profileButtonsContainer}>
                    <TouchableOpacity onPress={() => openScreen('EditProfile')} activeOpacity={0.9}
                                      style={styles.profileButton}>

                        <View style={[styles.profileButtonIcon, {
                            backgroundColor: "#FFAA88"
                        }]}>
                            <EvilIcons name="user" size={30} color="#fff"/>
                        </View>

                        <View style={styles.profileButtonBody}>
                            <Text style={[styles.profileButtonText,{
                                color:textColor,
                            }]}>
                                Edit Profile
                            </Text>
                        </View>
                        <Octicons name="chevron-right" size={20} color={textColor}/>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => openScreen('Wallet')} activeOpacity={0.9}
                                      style={styles.profileButton}>

                        <View style={[styles.profileButtonIcon, {
                            backgroundColor: "#4F1F80"
                        }]}>
                            <Ionicons name="wallet-outline" size={24} color="#fff"/>

                        </View>

                        <View style={styles.profileButtonBody}>
                            <Text style={[styles.profileButtonText,{
                                color:textColor,
                            }]}>
                                Wallet
                            </Text>
                        </View>

                        <Octicons name="chevron-right" size={20} color={textColor}/>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => openScreen('Leaderboard')} activeOpacity={0.9}
                                      style={styles.profileButton}>

                        <View style={[styles.profileButtonIcon, {
                            backgroundColor: "#97C602"
                        }]}>
                            <MaterialCommunityIcons name="medal-outline" size={24} color="#fff"/>
                        </View>

                        <View style={styles.profileButtonBody}>
                            <Text style={[styles.profileButtonText,{
                                color:textColor,
                            }]}>
                                Leaderboard
                            </Text>
                        </View>

                        <Octicons name="chevron-right" size={20} color={textColor}/>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => openScreen('Badges')} activeOpacity={0.9}
                                      style={styles.profileButton}>

                        <View style={[styles.profileButtonIcon, {
                            backgroundColor: "#FFBD26"
                        }]}>

                            <MaterialCommunityIcons name="medal-outline" size={24} color="#fff"/>
                        </View>

                        <View style={styles.profileButtonBody}>
                            <Text style={[styles.profileButtonText,{
                                color:textColor,
                            }]}>
                                My Badges
                            </Text>
                        </View>

                        <Octicons name="chevron-right" size={20} color={textColor}/>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => openScreen('Settings')} activeOpacity={0.9}
                                      style={styles.profileButton}>

                        <View style={[styles.profileButtonIcon, {
                            backgroundColor: "#E5531A"
                        }]}>


                            <Ionicons name="settings-outline" size={24} color="#fff"/>
                        </View>

                        <View style={styles.profileButtonBody}>
                            <Text style={[styles.profileButtonText,{
                                color:textColor,
                            }]}>
                                Settings
                            </Text>
                        </View>

                        <Octicons name="chevron-right" size={20} color={textColor}/>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => openScreen('MyReferrals')} activeOpacity={0.9}
                                      style={styles.profileButton}>

                        <View style={[styles.profileButtonIcon, {
                            backgroundColor: "#888888"
                        }]}>

                            <Ionicons name="information-circle-outline" size={24} color="#fff"/>

                        </View>

                        <View style={styles.profileButtonBody}>
                            <Text style={[styles.profileButtonText,{
                                color:textColor,
                            }]}>
                                My Referrals
                            </Text>
                        </View>

                        <Octicons name="chevron-right" size={20} color={textColor}/>
                    </TouchableOpacity>

                </View>


                <TouchableOpacity onPress={() => dispatch(logoutUser())} style={styles.logoutBtn} activeOpacity={0.9}>
                    <Text style={styles.logoutText}>
                        Log Out
                    </Text>
                    <Octicons name="sign-in" size={20} color={Colors.primaryColor}/>
                </TouchableOpacity>

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
    topCover: {
        height: heightPixel(250),
        width: '100%',
        alignItems: 'center',

        borderBottomStartRadius: 250,
        borderBottomEndRadius: 250,
        resizeMode: 'center'
    },
    topBar: {
        paddingHorizontal: pixelSizeHorizontal(15),
        width: '100%',
        height: heightPixel(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    userImage: {
        width: 130,
        height: 130,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 120,
        // borderWidth:5,
         borderStyle:'dashed',
      //  borderColor:Colors.primaryColor,
       //  backgroundColor:Colors.primaryColor,
        position: 'absolute',
        bottom: -30
    },
    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 120,
       // backgroundColor: Colors.primaryColor,
        position: 'absolute',
    },
    Image:{
        borderRadius: 120,
        width: "100%",
        height:  "100%",
        resizeMode:'cover'
    },
    fullNameWrap: {
        marginTop: 30,
        width: '100%',
        height: heightPixel(60),
        alignItems: 'center',
        justifyContent: 'center'
    },
    fullName: {
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(24),

    },

    rightButton: {
        width: widthPixel(70),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    roundTopBtn: {
        width: 40,
        height: 40,
        borderRadius: 40,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarContainer: {
        width: '100%',
        height: heightPixel(40),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBar: {
        width: widthPixel(150),
        height: 10,
        marginHorizontal: pixelSizeHorizontal(10),
        borderRadius: 10,
        backgroundColor: '#DEDEDE'
    },
    Bar: {
        width: widthPixel(50),
        height: 10,
        borderRadius: 10,
        backgroundColor: Colors.primaryColor
    },
    leftButton: {
        width: '60%',
        height: '100%',
        justifyContent: 'center',

        alignItems: 'flex-start',
    },
    boardsView: {

        marginTop: 10,
        marginBottom: 10,
        width: '90%',
        height: heightPixel(270),
        alignItems: 'center',
        justifyContent: 'space-evenly',

    },
    topBoard: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: heightPixel(140)
    },
    boardWrap: {
        width: widthPixel(165),
        alignItems: 'flex-start',
        height: heightPixel(90),
        justifyContent: 'space-between'
    },

    boardText: {
        fontFamily: Fonts.quicksandSemiBold,

        fontSize: fontPixel(12)
    },
    board: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: pixelSizeHorizontal(5),
        justifyContent: 'space-between',
        height: heightPixel(65),

        borderRadius: 20,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,

        elevation: 3,
    },
    boardIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.secondaryColor,
        width: widthPixel(60),
        height: heightPixel(55),
        borderRadius: 20,
    },
    boardIconImage: {
        resizeMode: 'cover',
        width: '60%',
        height: '50%',
    },
    numberWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        width: widthPixel(90),
        height: '90%',

    },

    profileButtonsContainer: {

        width: '100%',
        paddingHorizontal: pixelSizeHorizontal(10),
        marginVertical: pixelSizeVertical(10),
        alignItems: 'center',
    },
    profileButton: {
        width: '90%',
        alignItems: 'center',
        height: heightPixel(85),
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    profileButtonIcon: {
        justifyContent: 'center',
        width: 40,
        height: 40,
        alignItems: 'center',
        borderRadius: 5,
    },
    profileButtonBody: {
        width: '75%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '90%'
    },
    profileButtonText: {
        fontFamily: Fonts.quicksandMedium,
        color: Colors.light.text,
        fontSize: fontPixel(18)
    },
    logoutBtn: {
        height: 45,
        width: widthPixel(200),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    logoutText: {
        marginRight: 8,
        fontFamily: Fonts.quicksandMedium,
        color: Colors.primaryColor,
        fontSize: fontPixel(18)
    },
    dot: {
        position: 'absolute',
        width: 10,
        height: 10,
        top: 5,
        zIndex: 1,
        right: 10,
        borderWidth:2,
        borderColor:"#7C0E87",
        backgroundColor: Colors.errorRed,
        borderRadius: 15,
    }


})

export default Profile;
