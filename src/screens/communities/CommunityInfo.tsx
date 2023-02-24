import React, {useRef, useState} from 'react';

import {Text, View, StyleSheet, Animated as MyAnimated, TouchableOpacity, Image, ScrollView} from 'react-native';
import Drawer from "./components/Drawer";
import {
    AntDesign,
    FontAwesome,
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
    Octicons,
    SimpleLineIcons
} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import {useSharedValue} from "react-native-reanimated";
import {useAppSelector} from "../../app/hooks";
import Colors from "../../constants/Colors";
import {RootStackScreenProps} from "../../../types";
import {useQuery} from "@tanstack/react-query";
import {getCommunityFollowers, getCommunityInfo} from "../../action/action";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import HorizontalLine from "../../components/HorizontalLine";
import FastImage from "react-native-fast-image";
import Constants from "expo-constants";
import dayjs from "dayjs";
import Toast from "../../components/Toast";


const H_MAX_HEIGHT = 150;
const H_MIN_HEIGHT = 52;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;
const isRunningInExpoGo = Constants.appOwnership === 'expo'


const CommunityInfo = ({navigation, route}: RootStackScreenProps<'CommunityInfo'>) => {

    const user = useAppSelector(state => state.user)
    const {responseState, responseType, responseMessage} = user


    const offset = useSharedValue(0);
    const [toggleMenu, setToggleMenu] = useState(false);

    const dataSlice = useAppSelector(state => state.data)
    const {theme,currentCommunityId} = dataSlice
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'

    const scrollOffsetY = useRef(new MyAnimated.Value(0)).current;
    const headerScrollHeight = scrollOffsetY.interpolate({
        inputRange: [0, H_SCROLL_DISTANCE],
        outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
        extrapolate: "clamp"
    });

    const {isLoading, data, refetch} = useQuery(['getCommunityInfo'], () => getCommunityInfo(currentCommunityId), {})
    const {
        isLoading: loading,
        data: followers,
        refetch: getFollowers
    } = useQuery(['CommunityFollowers'], () => getCommunityFollowers(currentCommunityId), {})

    const goBack = () => {
        navigation.goBack()
    }

    const menuToggle = () => {
     navigation.toggleDrawer()
    }

    return (
        <>

            <SafeAreaView style={[styles.safeArea, {
                backgroundColor
            }]}>
                <Toast message={responseMessage} state={responseState} type={responseType}/>

                <ScrollView


                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>


                    <View style={[styles.cover, {
                        height: 200
                    }]}>

                        <View style={styles.navBar}>
                            <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
                                <AntDesign name="arrowleft" size={24} color="#fff"/>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={menuToggle} activeOpacity={0.8} style={styles.rightButton}>
                                <SimpleLineIcons name="menu" size={24} color="#fff"/>
                            </TouchableOpacity>
                        </View>

                        <Image
                            source={{uri: data?.data?.displayPhoto}}
                            style={{flex: 0.7, width: 200,}}
                            resizeMode={"contain"}/>
                    </View>

                    <View style={styles.aboutBody}>
                        <Text style={[styles.title, {
                            color: textColor
                        }]}>
                            About
                        </Text>

                        <Text style={[styles.aboutText, {
                            color: textColor
                        }]}>
                            {data?.data?.description}
                        </Text>


                        <View style={styles.statsWrap}>
                            <View style={styles.iconWrap}>
                                <FontAwesome name="globe" size={12} color="#575757"/>
                            </View>
                            <View style={styles.statsRow}>

                                <Text style={[styles.statsTitle,{
                                    color:textColor
                                }]}>
                                    {data?.data?.visibility} group
                                </Text>
                                <Text style={[styles.statsText,{
                                    color:lightTextColor
                                }]}>
                                    Anyone can see who’s in the group and
                                    what they post.
                                </Text>

                            </View>

                        </View>

                        <View style={styles.statsWrap}>
                            <View style={styles.iconWrap}>

                                <AntDesign name="eye" size={14} color="#575757"/>
                            </View>
                            <View style={styles.statsRow}>

                                <Text style={[styles.statsTitle,{
                                    color:textColor
                                }]}>
                                    Visible
                                </Text>
                                <Text style={[styles.statsText,{
                                    color:lightTextColor
                                }]}>
                                    Anyone can find this group.
                                </Text>

                            </View>

                        </View>

                        <View style={styles.statsWrap}>
                            <View style={styles.iconWrap}>
                                <Octicons name="history" size={12} color="#575757"/>
                            </View>
                            <View style={styles.statsRow}>

                                <Text style={[styles.statsTitle,{
                                    color:textColor
                                }]}>
                                    History
                                </Text>
                                <Text style={[styles.statsText,{
                                    color:lightTextColor
                                }]}>
                                    Group created on {dayjs(data.data.createdAt).format('DD MMMM YYYY')}.
                                </Text>

                            </View>

                        </View>

                        <HorizontalLine margin color={borderColor}/>
                        <View style={styles.usersInfo}>


                            <View style={styles.imageOverlap}>
                                {
                                    !loading && followers?.data?.result.length > 0
                                    &&
                                    followers?.data?.result.slice(0, 4).map((({id, follower}) => (
                                        <View key={id} style={styles.avatarWrap}>
                                            {
                                                isRunningInExpoGo ?

                                                    <Image
                                                        style={styles.avatar}
                                                        source={{
                                                            uri: !follower?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : follower?.avatar,
                                                        }}
                                                        resizeMode={'cover'}
                                                    />
                                                    :
                                                    <FastImage
                                                        style={styles.avatar}
                                                        source={{
                                                            uri: !follower?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : follower?.avatar,
                                                            cache: FastImage.cacheControl.web,
                                                            priority: FastImage.priority.normal,
                                                        }}
                                                        resizeMode={FastImage.resizeMode.cover}
                                                    />
                                            }
                                        </View>
                                    )))

                                }
                                <View style={styles.numberView}>
                                    <Text style={[styles.numberText, {
                                        fontSize: fontPixel(12)
                                    }]}>
                                        +{data?.data?.totalFollowers}
                                    </Text>
                                </View>


                            </View>

                            <View style={styles.owner}>
                                <View style={styles.userImage}>
                                    <Image
                                        style={styles.userImagePhoto}
                                        source={{
                                            uri: !data?.owner?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : data?.owner?.avatar,

                                        }}
                                    />
                                </View>
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>
                                        Admin
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <HorizontalLine margin color={borderColor}/>
                        <Text style={[styles.title, {
                            color: textColor
                        }]}>
                            Group Activity
                        </Text>
                        <View style={styles.statsWrap}>
                            <View style={styles.iconWrap}>
                                <MaterialCommunityIcons name="comment-outline" size={12} color="#575757" />

                            </View>
                            <View style={styles.statsRow}>

                                <Text style={[styles.statsTitle,{
                                    color:textColor
                                }]}>
                                   0 new post today
                                </Text>
                                <Text style={[styles.statsText,{
                                    color:lightTextColor
                                }]}>
                                    Anyone can see who’s in the group and
                                    what they post.
                                </Text>

                            </View>

                        </View>

                        <View style={styles.statsWrap}>
                            <View style={styles.iconWrap}>
                                <FontAwesome5 name="users" size={12} color="#575757" />

                            </View>
                            <View style={styles.statsRow}>

                                <Text style={[styles.statsTitle,{
                                    color:textColor
                                }]}>
                                    {data?.data?.totalFollowers} members
                                </Text>
                                <Text style={[styles.statsText,{
                                    color:lightTextColor
                                }]}>
                                    +20 in the last week
                                </Text>

                            </View>

                        </View>
                    </View>


                </ScrollView>

            </SafeAreaView>

        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#EDEDED",

    },
    cover: {
        width: '100%',
        alignItems: 'center',
        height: heightPixel(160),
        backgroundColor: "#364A8F"
    },
    navBar: {
        paddingHorizontal: pixelSizeHorizontal(24),
        width: '100%',
        height: heightPixel(60),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    rightButton: {
        width: widthPixel(60),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    scrollView: {

        //  backgroundColor: Colors.background,
        width: '100%',
        alignItems: 'center'
    },
    aboutBody: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: pixelSizeHorizontal(24),
        width: '100%',
        paddingVertical: pixelSizeVertical(20)
    },
    title: {
        fontFamily: Fonts.quickSandBold,

        fontSize: fontPixel(16)
    },
    aboutText: {
        fontFamily: Fonts.quicksandRegular,
        lineHeight: heightPixel(22),
        fontSize: fontPixel(14),
    },
    statsRow: {
        width: '90%',

        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    statsText: {
        textAlign: 'left',
        marginTop: 5,
        fontFamily: Fonts.quicksandRegular,
        fontSize: fontPixel(14),


    },
    statsTitle: {

        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(14),

    },
    iconWrap: {
        height: 20,
        width: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    statsWrap: {

        width: '100%',
        marginVertical: pixelSizeVertical(12),

        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    usersInfo: {

        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',

    },
    imageOverlap: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '90%',
        height: heightPixel(70)
    },
    avatarWrap: {
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: Colors.border,
        width: 30,
        borderRadius: 30,
        height: 30,
        position: 'relative',
        marginLeft: -10
    },
    avatar: {
        borderRadius: 40,
        resizeMode: 'cover',

        width: "100%",
        height: "100%",
    },
    numberView: {
        top: 15,
        left: -20,
        position: 'relative',
        backgroundColor: "#fff",
        borderRadius: 10,
        height: 20,
        minWidth: 35,
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
    numberText: {
        fontSize: fontPixel(14),
        color: Colors.light.text,
        fontFamily: Fonts.quicksandMedium
    },
    owner: {
        width: '100%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    tag: {
        marginLeft: 10,
        minWidth: 50,
        height: 18,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#FEF1F1"
    },
    tagText: {
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(12),
        color: Colors.errorRed,
    },
    userImage: {
        width: 30,
        height: 30,
        borderRadius: 35,
        backgroundColor: "#ccc"
    },
    userImagePhoto: {
        width: "100%",
        height: "100%",
        borderRadius: 35,
        resizeMode: 'cover'
    },
})

export default CommunityInfo;
