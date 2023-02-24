import React from 'react';

import {Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, Pressable, ActivityIndicator} from 'react-native';
import Animated, {
    Easing,
    FadeInRight,
    FadeOutRight,
    Layout,
    SlideInRight,
    SlideOutRight
} from "react-native-reanimated";
import {FontAwesome, FontAwesome5, Ionicons, Octicons} from "@expo/vector-icons";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../../helpers/normalize";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getCommunityInfo, unFollowCommunity} from "../../../action/action";
import {Fonts} from "../../../constants/Fonts";
import Colors from "../../../constants/Colors";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {useNavigation} from "@react-navigation/native";
import {setResponse} from "../../../app/slices/userSlice";


const fullHeight = Dimensions.get('window').height

interface props {
    communityId: string,
    menuToggle: () => void
}

const Drawer = ({menuToggle, communityId}: props) => {

    const navigation = useNavigation()

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const user = useAppSelector(state => state.user)
    const {userData} = user





    const {isLoading, data, refetch} = useQuery(['getCommunityInfo'], () => getCommunityInfo(communityId), {
        enabled: !!communityId
    })


    const openScreen = (screen: 'Followers' | 'CommunityInfo' | 'GroupSettings' | 'RequestsScreen') => {
        menuToggle()
        navigation.navigate('SeeCommunity', {
            screen:'LeaveCommunity',
            params:{id:communityId}
        })
    }
    const leaveCommunity = () => {
        menuToggle()

        navigation.navigate('SeeCommunity', {
            screen:'LeaveCommunity',
            params:{id:communityId}
        })
    }

    return (
        <Animated.View entering={FadeInRight} key={"backdrop"} layout={Layout.easing(Easing.bounce).delay(50)}
                       exiting={FadeOutRight} style={[styles.fullScreenMenu,{

        }]}>
            <View
                style={styles.backdrop}
            />

            <Animated.View entering={SlideInRight} layout={Layout.easing(Easing.bounce).delay(100)}
                           exiting={SlideOutRight} style={[styles.menu,{
                backgroundColor
            }]}>
                <TouchableOpacity activeOpacity={0.8} onPress={()=>navigation.openDrawer()}
                                  style={styles.dismiss}>
                    <Ionicons name="ios-close" size={24} color="black"/>
                </TouchableOpacity>


                <View style={styles.menuBody}>

                    <Image
                        source={{uri: data?.data?.displayPhoto}}
                        style={styles.logoImage}
                    />

                    <View style={styles.menuTabs}>
                        <Pressable onPress={() => openScreen('Followers')} style={styles.tabButton}>


                            <FontAwesome5 name="users" size={18} color={textColor}/>
                            <Text style={[styles.tabText, {
                                color: textColor
                            }]}>
                                Followers
                            </Text>
                        </Pressable>

                        <Pressable onPress={() => openScreen('CommunityInfo')} style={styles.tabButton}>
                            <Ionicons name="information-circle" size={18} color={textColor}/>
                            <Text style={[styles.tabText, {
                                color: textColor
                            }]}>
                                About
                            </Text>
                        </Pressable>
                        {
                            data?.data?.ownerId == userData.id &&
                            data?.data?.visibility == 'PRIVATE' &&
                        <Pressable onPress={() => openScreen('RequestsScreen')} style={styles.tabButton}>
                            <Ionicons name="person-add" size={18} color={textColor} />
                            <Text style={[styles.tabText, {
                                color: textColor
                            }]}>
                                Requests
                            </Text>
                        </Pressable>
                        }
                        {
                            data?.data?.ownerId == userData.id
                        &&
                        <Pressable onPress={() => openScreen('GroupSettings')} style={styles.tabButton}>
                            <FontAwesome name="cog" size={18} color={textColor} />
                            <Text style={[styles.tabText, {
                                color: textColor
                            }]}>
                                Group Settings
                            </Text>
                        </Pressable>
                        }
                        <Pressable onPress={leaveCommunity}  style={styles.tabButton}>
                            <Octicons name="sign-out" size={18} color={Colors.primaryColor}/>
                            <Text style={[styles.tabText, {
                                color: Colors.primaryColor
                            }]}>
                                Leave group
                            </Text>

                        </Pressable>
                    </View>

                </View>


            </Animated.View>


        </Animated.View>
    );
};

const styles = StyleSheet.create({

    fullScreenMenu: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        height: fullHeight,
        position: 'absolute',
        zIndex: 100,
    },
    backdrop: {
        position: 'absolute',
        backgroundColor: 'rgba(25,25,25,0.34)',
        width: '100%',
        flex: 10,
        height: '100%',
    },
    menu: {
        marginTop: 50,
        // paddingVertical: pixelSizeVertical(100),
        paddingHorizontal: pixelSizeHorizontal(10),
        backgroundColor: '#fff',
        width: '70%',
        height: heightPixel(800),
    },
    dismiss: {
        backgroundColor: "#fff",
        borderRadius: 30,
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.10,
        shadowRadius: 7.22,

        elevation: 3,
    },
    logoImage: {
        height: widthPixel(100),
        width: widthPixel(100),
        resizeMode: 'contain'
    },
    menuBody: {
        alignItems: 'center',
        width: '100%'
    },
    menuTabs: {
        width: '90%',
        minHeight:150,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    tabButton: {
        width: '80%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: heightPixel(55),
        flexDirection: 'row'
    },
    tabText: {
        marginLeft: 10,
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(16),
        color: Colors.light.text,
    }

})

export default Drawer;
