import React from 'react'
import BottomTabNavigator from './MyTabBar'

import {Image, StyleSheet} from "react-native";
import Colors from "../../constants/Colors";

import {RootTabParamList} from "../../../types";


import {fontPixel} from "../../helpers/normalize";

import {Fonts} from "../../constants/Fonts";

import {FontAwesome5, Ionicons, MaterialCommunityIcons, Octicons} from "@expo/vector-icons";
import Dashboard from "../../screens/Home/Dashboard";
import Adventures from "../../screens/Home/Adventures";
import Community from "../../screens/Home/Community";
import MarketPlace from "../../screens/Home/MarketPlace";
import Profile from "../../screens/Home/Profile";
import HomeFocused from "../../assets/images/tabs/home/HomeFocused";
import AdventuresIcon from "../../assets/images/tabs/home/AdventuresIcon";
import CommunityIcon from "../../assets/images/tabs/home/CommunityIcon";
import MarketPlaceIcon from "../../assets/images/tabs/home/MarketPlaceIcon";
import ProfileIcon from "../../assets/images/tabs/home/ProfileIcon";
import Animated, {
    RotateOutDownRight,
    RotateInUpRight,
    Keyframe, Easing, Layout, BounceIn, BounceOut
} from 'react-native-reanimated';
import {useAppSelector} from "../../app/hooks";
import FastImage from "react-native-fast-image";
import Constants from "expo-constants";


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
                            activeTintColor:textColor,
                            inactiveTintColor: "#ccc",
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
                                <HomeFocused opacity={1}/>
                            </Animated.View>
                            :
                            <HomeFocused opacity={0.3}/>
                    ),

                }}
            />


            <Tabs.Screen
                name="Adventures"
                component={Adventures}
                options={{
                    tabBarIcon: ({focused, color}: any) => (

                        focused ?
                            <Animated.View key={focused}
                                           entering={BounceIn}
                                           exiting={BounceOut}>
                                <AdventuresIcon opacity={1}/>
                            </Animated.View>

                            :
                            <AdventuresIcon opacity={0.3}/>

                    ),
                }}
            />

            <Tabs.Screen
                name="Community"
                component={Community}
                options={{
                    tabBarIcon: ({focused, color}: any) => (
                        /*<Image style={styles.userImage} resizeMethod="scale"
                               source={{uri: avatar, cache:'force-cache'}}/>*/
                        focused ?
                            <Animated.View key={focused}

                                           entering={BounceIn}
                                           exiting={BounceOut}>
                                <CommunityIcon opacity={1}/>
                            </Animated.View>
                            :
                            <CommunityIcon opacity={0.3}/>

                    ),

                }}
            />

            <Tabs.Screen
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
            />

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
                                            uri: !user.userData?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' :  user.userData?.avatar,

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
