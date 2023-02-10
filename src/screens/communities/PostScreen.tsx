import React, {useState} from 'react';

import {Text, View, StyleSheet, TouchableOpacity, Image, Dimensions, ActivityIndicator} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {RootStackScreenProps} from "../../../types";
import {AntDesign, Ionicons, Octicons, SimpleLineIcons} from "@expo/vector-icons";
import Animated, {
    Easing,
    FadeInRight,
    FadeOutRight,
    Layout,
    SlideInRight, SlideOutRight,
    useSharedValue
} from "react-native-reanimated";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {useAppSelector} from "../../app/hooks";
import Colors from "../../constants/Colors";
import {StatusBar} from "expo-status-bar";
import HorizontalLine from "../../components/HorizontalLine";
import Drawer from "./components/Drawer";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getCommunityPost, likeAPost} from "../../action/action";
import dayjs from "dayjs";
import {useRefreshOnFocus} from "../../helpers";



const PostScreen = ({navigation, route}: RootStackScreenProps<'PostScreen'>) => {

const {postId,communityId} = route.params
    const offset = useSharedValue(0);
    const [toggleMenu, setToggleMenu] = useState(false);

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text


    const backgroundColorCard = theme == 'light' ? '#fff' : Colors.dark.disable

    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'
    const goBack = () => {
        navigation.goBack()
    }
    const {data,isLoading,refetch} =  useQuery(['getCommunityPost'],()=>getCommunityPost(postId))


    const { mutate} =useMutation(['likeAPost'],likeAPost,{
        onSuccess:(data)=>{
           refetch()
        }
    })


    const menuToggle = () => {
        offset.value = Math.random()
        setToggleMenu(!toggleMenu)
    }

    useRefreshOnFocus(refetch)

    return (

        <>
            {
                toggleMenu &&

                <Drawer communityId={communityId} menuToggle={menuToggle}/>
            }
            <SafeAreaView style={[styles.safeArea, {
                backgroundColor
            }]}>
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={goBack} style={styles.goBack} activeOpacity={0.8}>
                        <AntDesign name="arrowleft" size={24} color={textColor}/>

                        <Text style={[styles.screenTitle,{
                            color: textColor
                        }]}>
                            Wave community
                        </Text>

                    </TouchableOpacity>


                    <TouchableOpacity onPress={menuToggle} activeOpacity={0.8} style={styles.rightButton}>
                        <SimpleLineIcons name="menu" size={24} color={textColor}/>
                    </TouchableOpacity>
                </View>

                {
                    isLoading &&

                    <ActivityIndicator color={Colors.primaryColor} size={"small"}
                                       style={[StyleSheet.absoluteFillObject, {
                                           backgroundColor: 'rgba(0,0,0,0.2)',
                                           zIndex: 2,
                                       }]}/>
                }
                <View style={[styles.postCard,{
                    backgroundColor: backgroundColorCard
                }]}>
                    <View style={styles.topPostSection}>
                        <View style={styles.userImage}>

                                <Image source={{uri: !data?.user?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'  : data?.user?.avatar}} style={styles.avatar}/>


                        </View>

                        <View style={styles.details}>

                            <View style={styles.nameTag}>
                                <Text style={[styles.postName,{
                                    color: textColor
                                }]}>
                                    {data?.data?.user?.fullName}
                                </Text>

                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>
                                        Admin
                                    </Text>
                                </View>

                            </View>
                            <Text style={styles.postDate}>

                                {dayjs(data?.user?.createdAt).format('DD MMM YYYY')}
                            </Text>
                        </View>


                    </View>

                    <View style={styles.postSnippet}>


                        <Text style={[styles.postHead,{
                            color: textColor
                        }]}>
                            {data?.data?.content}
                        </Text>
                    </View>
                    {
                        data?.data?.thumbnailUrl &&

                    <View style={styles.postImageWrap}>
                        <Image
                            source={{uri:  data?.data?.thumbnailUrl}}
                            style={styles.postImage}
                        />
                    </View>
                    }


                    <View style={styles.actionButtons}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => mutate(postId)} style={styles.actionButton}>
                            <AntDesign name="like2" size={20} color={data?.data?.liked ? Colors.primaryColor : "#838383"}/>
                            <Text style={styles.actionButtonText}>
                                {data?.data?.likes} likes
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>

                            <Octicons name="comment" size={20} color="#838383"/>
                            <Text style={styles.actionButtonText}>
                                6 comments
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <HorizontalLine color={theme == 'light' ? Colors.borderColor : '#313131'}/>

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
    goBack: {
        width: widthPixel(200),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    screenTitle: {
        marginLeft: 15,
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(18),
        color: "#333333",
    },


    postCard: {
        alignItems: 'center',
        minHeight: heightPixel(180),
        width: '100%',
        marginVertical: pixelSizeVertical(10),
        backgroundColor: "#fff",
        paddingHorizontal: pixelSizeHorizontal(25),
        paddingVertical: pixelSizeHorizontal(10)
    },
    topPostSection: {

        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: heightPixel(60)

    },
    details: {
        width: '100%',
        height: heightPixel(50),
        marginLeft: 10,

        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    nameTag: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',

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

    postName: {
        fontFamily: Fonts.quicksandSemiBold,
        fontSize: fontPixel(14),
        color: Colors.light.text,
    },
    postDate: {
        marginTop: 5,
        fontFamily: Fonts.quicksandRegular,
        fontSize: fontPixel(14),
        color: "#838383",
    },
    postSnippet: {
        width: '100%',

        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        height: 60
    },
    postHead: {
        lineHeight: heightPixel(22),
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(14),
        color: Colors.light.text,
    },

    actionButtons: {
        width: '100%',
        height: heightPixel(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    actionButton: {
        minWidth: 130,
        height: heightPixel(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    actionButtonText: {
        marginLeft: 8,
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(14),
        color: "#838383",
    },
    postImageWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 178,
        borderRadius: 10
    },
    postImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10
    },
    userImage: {
        width: 35,
        height: 35,
        borderRadius: 35,
        backgroundColor: "#ccc"
    },
    userImagePhoto: {
        width: "100%",
        height: "100%",
        borderRadius: 35,
        resizeMode: 'cover'
    },
    avatar: {
        borderRadius: 40,
        resizeMode: 'cover',
        backgroundColor: Colors.border,
        width: "100%",
        height: "100%",
    },

})

export default PostScreen;
