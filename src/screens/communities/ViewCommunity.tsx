import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Image,
    Animated as MyAnimated,
    ActivityIndicator, Pressable, Keyboard, Platform,
} from 'react-native';
import {CommunityStackScreenProps, RootStackScreenProps} from "../../../types";
import NavBar from "../../components/layout/NavBar";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {SafeAreaView} from "react-native-safe-area-context";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {AntDesign, Entypo, FontAwesome, Ionicons, MaterialIcons, Octicons, SimpleLineIcons} from "@expo/vector-icons";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";

import Animated, {

    Easing, FadeInDown,
    FadeOutDown, Layout,

    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import Colors from "../../constants/Colors";
import HorizontalLine from "../../components/HorizontalLine";
import {StatusBar} from "expo-status-bar";
import {SearchBar} from "react-native-screens";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getAllAdventure,
    getCommunityInfo,
    getCommunityPosts,
    getPostLike,
    getUser,
    likeAPost
} from "../../action/action";
import {setResponse, unSetResponse, updateUserInfo} from "../../app/slices/userSlice";
import FastImage from "react-native-fast-image";
import Constants from "expo-constants";
import {CardProps} from "react-native-elements";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {FlashList} from "@shopify/flash-list";
import {truncate, useRefreshOnFocus} from "../../helpers";
import Drawer from "./components/Drawer";
import Toast from "../../components/Toast";
import dayjs from "dayjs";
import {Video} from "expo-av";
import {store} from "../../app/store";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";


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
        likes: number,
        commentCount: number,
        liked: boolean,
        "createdAt": string,
        "user": {
            "avatar": string,
            "fullName": string,
            "id": string,
            "username": null,
        },
    },
    myId: string,
    viewPost: (id: string, post: {}) => void,
    commentOnPost: (id: string, post: any) => void,
    handleSnapPress: (id: string,userId:string) => void,
    sheetIndex: string

}

const PostCard = ({theme, item, viewPost, commentOnPost, handleSnapPress, sheetIndex}: cardProps) => {

    const {data: likes, refetch} = useQuery(['getPostLikes'], () => getPostLike(item.id))
    const {mutate} = useMutation(['likeAPost'], likeAPost, {
        onSuccess: (data) => {

            if (data.success) {
                store.dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'succss',
                }))
            } else {
                store.dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'error',
                }))
            }
        }
    })

    const backgroundColorCard = theme == 'light' ? '#fff' : Colors.dark.disable
    const backgroundColor = theme == 'light' ? "#EDEDED" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'
    let type = item.thumbnailUrl?.substring(item.thumbnailUrl.lastIndexOf(".") + 1);
    const videoRef = useRef(null);

    return (
        <Animated.View key={item.id} entering={FadeInDown} exiting={FadeOutDown}
                       layout={Layout.easing(Easing.ease).delay(20)}>
            <Pressable onPress={() => viewPost(item.id, item)}
                       style={[styles.postCard, {backgroundColor: backgroundColorCard}]}>
                <View style={styles.topPostSection}>
                    <View style={styles.userImage}>
                        <FastImage

                            resizeMode={FastImage.resizeMode.cover}
                            source={{
                                uri: !item?.user?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : item?.user?.avatar,
                                cache: FastImage.cacheControl.web,
                                priority: FastImage.priority.normal,
                            }}
                            style={styles.avatar}/>

                    </View>

                    <View style={styles.details}>

                        <View style={styles.nameTag}>


                            <View style={styles.leftDetails}>


                                <Text style={[styles.postName, {
                                    color: textColor
                                }]}>
                                    {item?.user?.fullName}
                                </Text>

                                <View style={[styles.tag, {
                                    // backgroundColor
                                }]}>
                                    <Text style={styles.tagText}>
                                        Admin
                                    </Text>
                                </View>


                            </View>

                            <TouchableOpacity onPress={() => {
                                handleSnapPress(item.id, item.user.id)

                            }}>
                                <Entypo name="dots-three-horizontal" size={24} color={lightTextColor}/>
                            </TouchableOpacity>


                        </View>

                        <Text style={styles.postDate}>

                            {dayjs(item.createdAt).format('DD MMM YYYY')}
                        </Text>
                    </View>



                </View>

                <View style={[styles.postSnippet, {
                    marginBottom: item.thumbnailUrl !== '' ? 10 : 0
                }]}>


                    <Text style={[styles.postHead, {
                        color: textColor
                    }]}>
                        {truncate(item.content.trim(), 80)} <Text style={{fontFamily: Fonts.quickSandBold}}>Read
                        more</Text>
                    </Text>
                </View>
                {
                    item.thumbnailUrl !== '' &&
                    <View style={styles.postImageWrap}>

                        {
                            type !== 'mov' && type !== 'mp4' &&
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

                        {
                            type !== 'jpeg' && type !== 'png' && type !== 'jpg' && type !== 'gif' && type !== 'jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' &&
                            <Video
                                ref={videoRef}

                                style={{
                                    height: '100%',
                                    borderRadius: 10,
                                    width: '100%',
                                }}
                                videoStyle={{backgroundColor: '#fff'}}

                                source={{
                                    //lesson?.data?.video?.url
                                    uri: item.thumbnailUrl,

                                }}
                                useNativeControls
                                resizeMode="contain"

                                isLooping={false}
                                // onPlaybackStatusUpdate={status => setStatus(() => status)}
                            />
                        }
                    </View>
                }
                <View style={styles.actionButtons}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => mutate(item.id)} style={styles.actionButton}>

                        {
                            !item.liked ? <AntDesign name="like2" size={20} color={"#838383"}/>
                                :
                                <AntDesign name="like1" size={20} color={Colors.primaryColor}/>
                        }
                        <Text style={styles.actionButtonText}>
                            {item.likes} likes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} onPress={() => commentOnPost(item.id, item)}
                                      style={styles.actionButton}>

                        <Octicons name="comment" size={20} color="#838383"/>
                        <Text style={styles.actionButtonText}>
                            {item.commentCount} comments
                        </Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Animated.View>
    )
}

const H_MAX_HEIGHT = 150;
const H_MIN_HEIGHT = 52;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;


const ViewCommunity = ({navigation, route}: CommunityStackScreenProps<'ViewCommunity'>) => {

    const [toggleMenu, setToggleMenu] = useState(false);
    const user = useAppSelector(state => state.user)
    const {responseState, responseType, responseMessage} = user

    const [sheetIndex, setSheetIndex] = useState('');
    const [userId, setUserId] = useState('');

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();


    const dataSlice = useAppSelector(state => state.data)
    const {theme, currentCommunityId} = dataSlice
    const backgroundColor = theme == 'light' ? "#EDEDED" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'


    const snapPoints = useMemo(() => ["1%", "25%"], []);

    const sheetRef = useRef<BottomSheet>(null);
    const handleSnapPress = useCallback((id: string,userId) => {
        setSheetIndex(id)
        setUserId(userId)
        sheetRef.current?.snapToIndex(1);
    }, []);
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);
    const goBack = () => {
        navigation.goBack()
    }

    const commentOnPost = (postId: string, post: string) => {
        navigation.navigate('CommentOnPost', {
            id: postId,
            post
        })
    }


    const scrollOffsetY = useRef(new MyAnimated.Value(0)).current;


    const {isLoading: loadingUser, data: userInfo} = useQuery(['user-data'], getUser, {
        onSuccess: (data) => {

        },
    })

    const {isLoading, data, refetch} = useQuery(['getCommunityInfo'], () => getCommunityInfo(currentCommunityId))

    const {
        isLoading: loadingPost,
        data: posts,
        hasNextPage,
        fetchNextPage: fetchNextPageWallet,
        isFetchingNextPage,
        refetch: fetchPosts,

        isRefetching
    } = useInfiniteQuery([`CommunityPosts`], ({pageParam = 1}) => getCommunityPosts.posts(pageParam, currentCommunityId),
        {

            getNextPageParam: lastPage => {
                if (lastPage.next !== null) {
                    return lastPage.next;
                }

                return lastPage;
            },
            getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
        })


    const viewPost = (postId: string, post: any) => {
        navigation.navigate('PostScreen', {
            postId,
            communityId: currentCommunityId,
            post
        })

    }

    // renders
    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                style={{
                    backgroundColor: 'rgba(25,25,25,0.34)'
                }}
                {...props}
                disappearsOnIndex={0}
                appearsOnIndex={1}
            />
        ),
        []
    );

    const renderItem = useCallback(
        ({item}) => (
            <PostCard sheetIndex={sheetIndex} handleSnapPress={handleSnapPress} commentOnPost={commentOnPost}
                      myId={user?.userData?.id} viewPost={viewPost} theme={theme}
                      item={item}/>
        ),
        [data, posts, sheetIndex],
    );
    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);


    const renderHeaderItem = useCallback(
        () => (
            <>

                <View style={[styles.cover, {}]}>

                    <View style={styles.navBar}>
                        <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
                            <AntDesign name="arrowleft" size={24} color="#fff"/>
                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.8}
                                          style={styles.rightButton}>
                            <SimpleLineIcons name="menu" size={24} color="#fff"/>
                        </TouchableOpacity>
                    </View>

                    <Image
                        source={{uri: data?.data?.displayPhoto}}
                        style={{flex: 0.7, width: 200, borderRadius: 5,}}
                        resizeMode={"contain"}/>
                </View>

                <View style={[styles.topBox, {
                    backgroundColor: theme == 'light' ? '#fff' : Colors.dark.background,
                }]}>
                    <View style={styles.titleWrap}>
                        <Text style={[styles.title, {
                            color: textColor
                        }]}>
                            {data?.data?.name}
                        </Text>
                    </View>

                    <View style={styles.statsBox}>
                        <View style={styles.statsRowWrap}>
                            <View style={styles.statsRow}>
                                <FontAwesome name="globe" size={14} color={theme == 'light' ? '#575757' : "#fff"}/>
                                <Text style={[styles.statsText, {
                                    color: lightTextColor
                                }]}>
                                    {data?.data?.visibility} group
                                </Text>
                            </View>
                            <Entypo name="dot-single" size={20} color={textColor}/>

                            <View style={styles.statsRow}>

                                <Text style={[styles.statsText, {
                                    color: textColor
                                }]}>
                                    {data?.data?.totalFollowers} members
                                </Text>
                            </View>
                        </View>
                        <View style={styles.statsRowWrap}>
                            <View style={styles.statsRow}>
                                <Ionicons name="person" size={14} color={theme == 'light' ? '#575757' : "#fff"}/>
                                <Text style={[styles.statsText, {
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

                            <FastImage
                                style={styles.userImagePhoto}
                                source={{
                                    uri: !userInfo?.data?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : userInfo?.data?.avatar,

                                    cache: FastImage.cacheControl.web,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />

                        </View>
                        <Pressable onPress={makePost} style={[styles.postInput, {
                            backgroundColor,
                            borderColor
                        }]}>
                            <Text style={[styles.placeHolder, {
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
                            <Text style={[styles.mediaButtonText, {
                                color: textColor
                            }]}>
                                Photo
                            </Text>
                        </TouchableOpacity>

                        <View style={{
                            height: '100%',
                            width: 1,
                            backgroundColor: borderColor,

                        }}/>
                        <TouchableOpacity onPress={makePost} activeOpacity={0.8} style={styles.mediaButton}>
                            <FontAwesome name="video-camera" size={18} color={Colors.success}/>

                            <Text style={[styles.mediaButtonText, {
                                color: textColor
                            }]}>
                                Video
                            </Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </>
        ), [data, posts])

    const offset = useSharedValue(0);


//console.log(posts?.pages[0]?.data?.result)

    useRefreshOnFocus(refetch)
    useRefreshOnFocus(fetchPosts)
    const makePost = () => {
        navigation.navigate('MakeAPost', {
            id: currentCommunityId
        })
    }

    useEffect(() => {
        refetch
    }, [currentCommunityId])
    const menuToggle = () => {
        offset.value = Math.random()
        setToggleMenu(!toggleMenu)
    }

    const blockUserScreen = () => {
        handleClosePress()
      navigation.navigate('BlockUser',{
          userId
      })
    }
 const flagPost = () => {
        handleClosePress()
      navigation.navigate('FlagPost',{
          postId:sheetIndex
      })
    }


    useEffect(() => {
        // console.log(user)
        let time: NodeJS.Timeout | undefined;
        if (responseState || responseMessage) {

            time = setTimeout(() => {
                dispatch(unSetResponse())
            }, 3000)

        }
        return () => {
            clearTimeout(time)
        };
    }, [responseState, responseMessage])


    return (
        <>
            <SafeAreaView style={[styles.safeArea, {}]}>
                <Toast message={responseMessage} state={responseState} type={responseType}/>
                {
                    isLoading &&

                    <ActivityIndicator color={Colors.primaryColor} size={"small"}
                                       style={[StyleSheet.absoluteFillObject, {
                                           backgroundColor: 'rgba(0,0,0,0.2)',
                                           zIndex: 2,
                                       }]}/>
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
            <BottomSheet
                backgroundStyle={{
                    backgroundColor,
                }}
                handleIndicatorStyle={{
                    backgroundColor: theme == 'light' ? "#121212" : '#cccccc'
                }}
                index={0}
                ref={sheetRef}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
            >

                <View style={styles.sheetHead}>
                    {Platform.OS == 'ios' && <View style={{
                        width: '10%'
                    }}/>
                    }
                    <Text style={[styles.sheetTitle, {
                        color: textColor
                    }]}>
                        Actions
                    </Text>
                    <View style={{
                        width: '10%'
                    }}/>
                    {Platform.OS == 'android' && <TouchableOpacity onPress={handleClosePress}
                                                                   style={[styles.dismiss, {
                                                                       backgroundColor: theme == 'light' ? "#f8f8f8" : Colors.dark.background
                                                                   }]}>
                        <Ionicons name="close-sharp" size={20} color={textColor}/>
                    </TouchableOpacity>}
                </View>

                <BottomSheetView style={styles.optionBox}>


                    <Pressable onPress={flagPost} style={[styles.optionsActionButton, {

                    }]}>
                        <Ionicons name="flag" size={20} color={textColor} />

                        <Text style={[styles.actionBtnTxt, {
                            color: textColor,
                            marginLeft: 10,
                        }]}>
                            Flag Post
                        </Text>
                    </Pressable>


                    <Pressable onPress={blockUserScreen} style={[styles.optionsActionButton, {

                    }]}>
                        <MaterialIcons name="block" size={20} color={textColor} />

                        <Text style={[styles.actionBtnTxt, {
                            color: Colors.primaryColor,
                            marginLeft: 10,
                        }]}>
                            Block User
                        </Text>
                    </Pressable>


                   {/* <Pressable style={[styles.optionsActionButton, {

                    }]}>
                        <Ionicons name="md-trash-outline" size={20} color={Colors.primaryColor}/>
                        <Text style={[styles.actionBtnTxt, {
                            color: Colors.primaryColor,
                            marginLeft: 10,
                        }]}>
                            Delete Post
                        </Text>
                    </Pressable>*/}




                </BottomSheetView>

            </BottomSheet>
        </>

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
    leftDetails: {
        width: '85%',
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
        textAlign: 'left',
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
    actionSheet: {
        position: 'absolute',
        width: 200,
        zIndex: 1100,
        top: 20,
        right: 15,
        height: 150,
        backgroundColor: '#ccc',

    },
    sheetHead: {
        paddingHorizontal: pixelSizeHorizontal(20),
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    sheetTitle: {
        //width: '70%',
        textAlign: 'center',
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandSemiBold,

    },
    optionBox: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '80%',


    },
    optionsActionButton: {
        width: '90%',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 55,
        justifyContent: 'flex-start'

    },
    actionBtnTxt: {
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
    }
})

export default memo(ViewCommunity);
