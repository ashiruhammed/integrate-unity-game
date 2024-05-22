import React from 'react'
import BottomTabNavigator from './MyTabBar'

import {Image, StyleSheet} from "react-native";
import Colors from "../../constants/Colors";

import {RootTabParamList} from "../../../types";


import {fontPixel} from "../../helpers/normalize";

import {Fonts} from "../../constants/Fonts";


import Profile from "../../screens/Home/Profile";

import Animated, {
    BounceIn, BounceOut
} from 'react-native-reanimated';
import {useAppSelector} from "../../app/hooks";
import FastImage from "react-native-fast-image";
import Constants from "expo-constants";
import Dashboard from "../../screens/Home/Dashboard";
import Games from "../../screens/Home/Games";
import Wallet from "../../screens/Home/Wallet";
import Learn from "../../screens/Home/Learn";
import HomeIcon from "../../assets/tabs-svg/HomeIcon";
import LearnIcon from "../../assets/tabs-svg/LearnIcon";
import GameIcon from "../../assets/tabs-svg/GameIcon";
import WalletIcon from "../../assets/tabs-svg/WalletIcon";


const Tabs = BottomTabNavigator<RootTabParamList>()
const isRunningInExpoGo = Constants.appOwnership === 'expo'

export default () => {

    const user = useAppSelector(state => state.user)
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const backgroundColor = theme == 'light' ? "#fff" : "#000"
    const textColor = theme == 'light' ? Colors.light.text :Colors.dark.text
    return (
        <Tabs.Navigator backBehavior='history'
                        initialRouteName="Home"
                        tabBarOptions={{
                            activeTintColor:Colors.primaryColor,
                            inactiveTintColor: "#616161",
                            labelStyle: {
                                fontSize: fontPixel(12),
                                fontFamily: Fonts.quicksandRegular,
                            },
                        }}
                        appearance={{
                            tabBarBackground:backgroundColor
                        }}>
            <Tabs.Screen
                name="Home"
                component={Dashboard}

                options={{
                    tabBarIcon: ({focused, color}: any) => (
                        focused ?
                            <Animated.View key={focused}
                                           entering={BounceIn}
                                           exiting={BounceOut}>
                                <HomeIcon color={Colors.primaryColor}/>
                            </Animated.View>
                            :
                            <HomeIcon color={"#616161"} />
                    ),

                }}
            />


            <Tabs.Screen
                name="Learn"
                component={Learn}
                options={{
                    tabBarIcon: ({focused, color}: any) => (

                        focused ?
                            <Animated.View key={focused}
                                           entering={BounceIn}
                                           exiting={BounceOut}>
                                <LearnIcon color={Colors.primaryColor}/>
                            </Animated.View>

                            :
                            <LearnIcon color={"#616161"}/>

                    ),
                }}
            />

           {/* <Tabs.Screen
                name="Games"
                component={Games}
                options={{
                    tabBarIcon: ({focused, color}: any) => (

                        focused ?
                            <Animated.View key={focused}
                                           entering={BounceIn}
                                           exiting={BounceOut}>
                                <GameIcon color={Colors.primaryColor}/>
                            </Animated.View>

                            :
                            <GameIcon color={"#616161"}/>

                    ),
                }}
            />*/}

            <Tabs.Screen


                name="Wallet"
                component={Wallet}
                options={{
                    tabBarIcon: ({focused, color}: any) => (
                        /*<Image style={styles.userImage} resizeMethod="scale"
                               source={{uri: avatar, cache:'force-cache'}}/>*/
                        focused ?
                            <Animated.View key={focused}

                                           entering={BounceIn}
                                           exiting={BounceOut}>
                                <WalletIcon color={Colors.primaryColor}/>
                            </Animated.View>
                            :
                            <WalletIcon color={"#616161"}/>

                    ),

                }}
            />

          {/*  <Tabs.Screen
                name="MarketPlace"
                component={MarketPlace}
                options={{
                    tabBarIcon: ({focused, color}: any) => (
                        focused ?
                            <Animated.View key={focused}

                                           entering={BounceIn}
                                           exiting={BounceOut}>
                                <MarketPlaceIcon opacity={1}/>
                            </Animated.View>
                            :

                            <MarketPlaceIcon opacity={0.3}/>

                    ),
                }}
            />*/}

            <Tabs.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({focused, color}: any) => (



                                isRunningInExpoGo ?
                                    <Image
                                        style={[styles.userImage,{
                                            opacity:focused ? 1 : 0.3
                                        }]}
                                        source={{
                                            uri: !user.userData?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' :  user.userData?.avatar,

                                        }}
                                    />
                                    :

                                    <FastImage
                                        style={[styles.userImage,{
                                            opacity:focused ? 1 : 0.3
                                        }]}
                                        source={{
                                            uri: !user.userData?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' :  user.userData?.avatar.replace(/^http:\/\//i, 'https://'),

                                            cache: FastImage.cacheControl.web,
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />



                    ),
                }}
            />

        </Tabs.Navigator>
    )
}
//On your navigation index


const styles = StyleSheet.create({
    userImage: {
        width: 20,
        height: 20,
        resizeMode: 'cover',
        borderRadius: 50,

    },
})
