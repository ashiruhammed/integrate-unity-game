import React, {useCallback, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Image,
    Animated as MyAnimated,
    ActivityIndicator,
    Pressable
} from 'react-native';
import {RootStackScreenProps} from "../../../types";
import NavBar from "../../components/layout/NavBar";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {SafeAreaView} from "react-native-safe-area-context";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {AntDesign, Entypo, FontAwesome, Ionicons, Octicons, SimpleLineIcons} from "@expo/vector-icons";
import {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import Animated, {
    Easing,
    FadeInRight, FadeOutRight, Layout,
    SlideInRight,
    SlideOutRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import Colors from "../../constants/Colors";
import HorizontalLine from "../../components/HorizontalLine";
import {StatusBar} from "expo-status-bar";
import {SearchBar} from "react-native-screens";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {
    getAllAdventure,
    getCommunityInfo,
    getCommunityPosts,
    getPostLike,
    getUser,
    likeAPost
} from "../../action/action";
import {updateUserInfo} from "../../app/slices/userSlice";
import FastImage from "react-native-fast-image";
import Constants from "expo-constants";
import {CardProps} from "react-native-elements";
import {useAppSelector} from "../../app/hooks";
import {FlashList} from "@shopify/flash-list";
import {truncate, useRefreshOnFocus} from "../../helpers";
import Drawer from "./components/Drawer";
import Toast from "../../components/Toast";
import dayjs from "dayjs";

const fullHeight = Dimensions.get('window').height


const isRunningInExpoGo = Constants.appOwnership === 'expo'

interface cardProps {
    theme: 'light' | 'dark',
    item: {
        "id": string,
        "communityId": null,
        "category": string,
        "authorId": string,
        "title": string,
        "content": string,
        "description": string,
        "thumbnailUrl": string,
        likes:number,
        commentCount:number,
        "createdAt": string,
        "user": {
            "avatar": string,
            "fullName": string,
            "id": string,
            "username": null,
        },
    },
    myId:string,
    viewPost: (id: string) => void
}

const PostCard = ({theme, item, viewPost}: cardProps) => {

    const {data:likes, refetch} =useQuery(['getPostLikes'],()=>getPostLike(item.id))
    const { mutate} =useMutation(['likeAPost'],likeAPost)

    const backgroundColorCard = theme == 'light' ? '#fff' : Colors.dark.disable
    const backgroundColor = theme == 'light' ? "#EDEDED" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'

    return (
        <Pressable onPress={() => viewPost(item.id)} style={[styles.postCard,{
            backgroundColor: backgroundColorCard
        }]}>
            <View style={styles.topPostSection}>
                <View style={styles.userImage}>
                    <Image source={{uri: !item?.user?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'  : item?.user?.avatar}} style={styles.avatar}/>

                </View>

                <View style={styles.details}>

                    <View style={styles.nameTag}>
                        <Text style={[styles.postName,{
                            color: textColor
                        }]}>
                            {item?.user?.fullName}
                        </Text>

                        <View style={[styles.tag,{
                           // backgroundColor
                        }]}>
                            <Text style={styles.tagText}>
                                Admin
                            </Text>
                        </View>

                    </View>
                    <Text style={styles.postDate}>

                        {dayjs(item.createdAt).format('DD MMM YYYY')}
                    </Text>
                </View>


            </View>

            <View style={[styles.postSnippet,{
                marginBottom: item.thumbnailUrl !== '' ? 10 : 0
            }]}>


                <Text style={[styles.postHead,{
                    color: textColor
                }]}>
                    {truncate(item.content.trim(), 80)} <Text style={{fontFamily: Fonts.quickSandBold}}>Read more</Text>
                </Text>
            </View>
            {
                item.thumbnailUrl !== '' &&
                <View style={styles.postImageWrap}>

                    {
                        isRunningInExpoGo ?
                            <Image

                                source={{uri: item.thumbnailUrl}}
                                style={styles.postImage}
                            />
                            :
                            <FastImage
                                resizeMode={FastImage.resizeMode.cover}
                                source={{
                                    uri: item.thumbnailUrl,
                                    cache: FastImage.cacheControl.web,
                                    priority: FastImage.priority.normal,
                                }}

                                style={styles.postImage}
                            />
                    }
                </View>
            }
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                    <AntDesign name="like2" size={20} color={"#838383"}/>
                    <Text style={styles.actionButtonText}>
                        {item.likes} likes
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>

                    <Octicons name="comment" size={20} color="#838383"/>
                    <Text style={styles.actionButtonText}>
                        {item.commentCount} comments
                    </Text>
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}

const H_MAX_HEIGHT = 150;
const H_MIN_HEIGHT = 52;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;


const ViewCommunity = ({navigation, route}: RootStackScreenProps<'ViewCommunity'>) => {
    const {id} = route.params
    const [toggleMenu, setToggleMenu] = useState(false);
    const user = useAppSelector(state => state.user)
    const {responseState, responseType, responseMessage} = user

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const backgroundColor = theme == 'light' ? "#EDEDED" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'

    const goBack = () => {
        navigation.goBack()
    }


    const scrollOffsetY = useRef(new MyAnimated.Value(0)).current;
    const headerScrollHeight = scrollOffsetY.interpolate({
        inputRange: [0, H_SCROLL_DISTANCE],
        outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
        extrapolate: "clamp"
    });

    const headerScrollOpacity = scrollOffsetY.interpolate({
        inputRange: [0, 50, 100],
        outputRange: [1, 0.5, 0],
        extrapolate: "clamp"
    });

    const topScrollHeight = scrollOffsetY.interpolate({
        inputRange: [0, 250],
        outputRange: [250, 0],
        extrapolate: "clamp"
    });

    const {isLoading: loadingUser, data: userInfo} = useQuery(['user-data'], getUser, {
        onSuccess: (data) => {

        },
    })

    const {isLoading, data, refetch} = useQuery(['getCommunityInfo'], () => getCommunityInfo(id))

    const {
        isLoading: loadingPost,
        data: posts,
        hasNextPage,
        fetchNextPage: fetchNextPageWallet,
        isFetchingNextPage,
        refetch: fetchPosts,

        isRefetching
    } = useInfiniteQuery([`CommunityPosts`], ({pageParam = 1}) => getCommunityPosts.posts(pageParam, id),
        {
            networkMode: 'online',
            getNextPageParam: lastPage => {
                if (lastPage.next !== null) {
                    return lastPage.next;
                }

                return lastPage;
            },
            getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
        })


    const viewPost = (postId: string) => {
        navigation.navigate('PostScreen', {
            postId,
            communityId: id
        })
    }


    const renderItem = useCallback(
        ({item}) => (
            <PostCard myId={user?.userData?.id} viewPost={viewPost} theme={theme} item={item}/>
        ),
        [],
    );
    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);


    const renderHeaderItem = useCallback(
        ({}) => (
<>

    <View style={[styles.cover, {

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
            style={{flex: 0.7, width: 200, borderRadius:5,}}
            resizeMode={"contain"}/>
    </View>

    <View style={[styles.topBox, {
        backgroundColor:theme == 'light' ? '#fff' : Colors.dark.background,
    }]}>
        <View style={styles.titleWrap}>
            <Text style={[styles.title,{
                color: textColor
            }]}>
                {data?.data?.name}
            </Text>
        </View>

        <View style={styles.statsBox}>
            <View style={styles.statsRowWrap}>
                <View style={styles.statsRow}>
                    <FontAwesome name="globe" size={14} color={theme == 'light' ? '#575757' : "#fff" }/>
                    <Text style={[styles.statsText,{
                        color: lightTextColor
                    }]}>
                        {data?.data?.visibility} group
                    </Text>
                </View>
                <Entypo name="dot-single" size={20} color={textColor}/>

                <View style={styles.statsRow}>

                    <Text style={[styles.statsText,{
                        color: textColor
                    }]}>
                        {data?.data?.totalFollowers} members
                    </Text>
                </View>
            </View>
            <View style={styles.statsRowWrap}>
                <View style={styles.statsRow}>
                    <Ionicons name="person" size={14} color={theme == 'light' ? '#575757' : "#fff" }/>
                    <Text style={[styles.statsText,{
                        color: textColor
                    }]}>
                        4 followed
                    </Text>
                </View>
            </View>
        </View>
        <HorizontalLine color={borderColor}/>

        <View style={styles.writePost}>
            <View style={styles.userImage}>
                {
                    isRunningInExpoGo ?
                        <Image
                            style={styles.userImagePhoto}
                            source={{
                                uri: !userInfo?.data?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : userInfo?.data?.avatar,

                            }}
                        />
                        :

                        <FastImage
                            style={styles.userImagePhoto}
                            source={{
                                uri: !userInfo?.data?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : userInfo?.data?.avatar,

                                cache: FastImage.cacheControl.web,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                }
            </View>
            <Pressable onPress={makePost} style={[styles.postInput,{
                backgroundColor,
                borderColor
            }]}>
                <Text style={[styles.placeHolder,{
                    color: textColor
                }]}>
                    Write Something...
                </Text>
            </Pressable>
            {/* <TextInput placeholder={"Write Something..."} style={styles.postInput}/>*/}
        </View>

        <HorizontalLine color={borderColor}/>

        <View style={styles.mediaPost}>
            <TouchableOpacity onPress={makePost} activeOpacity={0.8} style={styles.mediaButton}>
                <Ionicons name="ios-images" size={18} color={Colors.primaryColor}/>
                <Text style={[styles.mediaButtonText,{
                    color: textColor
                }]}>
                    Photo
                </Text>
            </TouchableOpacity>

            <View style={{
                height: '100%',
                width: 1,
                backgroundColor:borderColor,

            }}/>
            <TouchableOpacity onPress={makePost} activeOpacity={0.8} style={styles.mediaButton}>
                <FontAwesome name="video-camera" size={18} color={Colors.success}/>

                <Text style={[styles.mediaButtonText,{
                    color: textColor
                }]}>
                    Video
                </Text>
            </TouchableOpacity>
        </View>


    </View>
</>
        ),[])

    const offset = useSharedValue(0);

    const defaultSpringStyles = useAnimatedStyle(() => {
        return {
            transform: [{translateX: withSpring(offset.value * 255)}],
        };
    });

//console.log(posts?.pages[0]?.data?.result)

    useRefreshOnFocus(refetch)
    useRefreshOnFocus(fetchPosts)
    const makePost = () => {
        navigation.navigate('MakeAPost', {
            id
        })
    }


    const menuToggle = () => {
        offset.value = Math.random()
        setToggleMenu(!toggleMenu)
    }
    return (
        <SafeAreaView style={[styles.safeArea,{
           // backgroundColor
        }]}>
            <Toast message={responseMessage} state={responseState} type={responseType}/>
            {
                isLoading &&

                <ActivityIndicator color={Colors.primaryColor} size={"small"}
                                   style={[StyleSheet.absoluteFillObject, {
                                       backgroundColor: 'rgba(0,0,0,0.2)',
                                       zIndex: 2,
                                   }]}/>
            }
            {
                toggleMenu &&

                <Drawer communityId={id} menuToggle={menuToggle}/>
            }
            <View style={styles.scrollView}>



                <View style={{
                    width: '100%',
                    flex: 1,
                }}>
                    {
                        !loadingPost && posts &&


                        <FlashList
                            ListHeaderComponent={renderHeaderItem}
                            onScroll={MyAnimated.event([

                                {nativeEvent: {contentOffset: {y: scrollOffsetY}}}
                            ], {useNativeDriver: false})}
                            scrollEventThrottle={16}
                            estimatedItemSize={200}
                            refreshing={isLoading}
                            onRefresh={refetch}
                            scrollEnabled
                            showsVerticalScrollIndicator={false}
                            data={posts?.pages[0]?.data?.result}
                            renderItem={renderItem}

                            keyExtractor={keyExtractor}
                            onEndReachedThreshold={0.3}
                            ListFooterComponent={isFetchingNextPage ?
                                <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                        />
                    }
                </View>



            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',


    },
    scrollView: {
        flex: 1,
        //  backgroundColor: Colors.background,

        width: '100%',
        alignItems: 'center'
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
    leftBody: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%'
    },
    screenTitle: {
        marginLeft: 15,
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(18),
        color: "#333333",
    },
    rightButton: {
        width: widthPixel(60),
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
    fullScreenMenu: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        height: fullHeight,
        position: 'absolute',
        zIndex: 10,
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
    topBox: {
        alignItems: 'center',
        //height: heightPixel(250),
        width: '100%',

        backgroundColor: "#fff",
        paddingHorizontal: pixelSizeHorizontal(25)
    },
    titleWrap: {
        width: '100%',
        height: heightPixel(40),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(18),
        color: Colors.light.text,
    },
    statsBox: {

        width: '100%',
        height: heightPixel(80),
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    statsRowWrap: {
        height: 30,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    statsRow: {
        height: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    statsText: {
        marginLeft: 5,
        fontFamily: Fonts.quicksandRegular,
        fontSize: fontPixel(14),
        color: Colors.light.text,
    },
    writePost: {
        width: '100%',
        alignItems: 'center',
        justifyContent: "space-between",
        height: heightPixel(60),
        flexDirection: 'row',
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
    mediaPost: {
        width: '100%',
        alignItems: 'center',
        justifyContent: "space-evenly",
        height: heightPixel(55),
        flexDirection: 'row',
    },
    mediaButton: {
        width: widthPixel(100),
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    mediaButtonText: {
        fontFamily: Fonts.quicksandRegular,
        fontSize: fontPixel(14),
        color: Colors.light.text,
    },
    postInput: {
        borderColor: "#DEE6ED",
        borderWidth: 1,
        paddingHorizontal: pixelSizeHorizontal(15),
        borderRadius: 10,
        height: heightPixel(40),
        backgroundColor: '#fff',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    placeHolder: {
        fontFamily: Fonts.quicksandRegular,
        fontSize: fontPixel(14),
        color: Colors.light.text,
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
    },
    postHead: {
   textAlign:'left',
        lineHeight: heightPixel(18),
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(14),
        color: Colors.light.text,
    },
    actionButtons: {
        width: '100%',
        height: heightPixel(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    actionButton: {
        minWidth: 90,
        height: heightPixel(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
    avatar: {
        borderRadius: 40,
        resizeMode: 'cover',
        backgroundColor: Colors.border,
        width: "100%",
        height: "100%",
    },
})

export default ViewCommunity;
