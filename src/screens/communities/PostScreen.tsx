import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    ScrollView, TextInput as RNTextInput, Pressable, Animated as MyAnimated, FlatList, Platform
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {RootStackScreenProps} from "../../../types";
import {AntDesign, Entypo, Ionicons, MaterialIcons, Octicons, SimpleLineIcons} from "@expo/vector-icons";
import Animated, {
    Easing, FadeIn, FadeInDown,
    FadeInRight, FadeOut, FadeOutDown,
    FadeOutRight,
    Layout,
    SlideInRight, SlideOutRight,
    useSharedValue
} from "react-native-reanimated";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import Colors from "../../constants/Colors";
import {StatusBar} from "expo-status-bar";
import HorizontalLine from "../../components/HorizontalLine";
import Drawer from "./components/Drawer";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {
    getCommunityInfo,
    getCommunityPost,
    getCommunityPosts,
    getPostComments,
    getPostLike,
    likeAComment,
    likeAPost
} from "../../action/action";
import dayjs from "dayjs";
import {isLessThan24HourAgo, truncate, useRefreshOnFocus} from "../../helpers";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import FastImage from "react-native-fast-image";
import {FlashList} from "@shopify/flash-list";
import {Video} from "expo-av";
import {store} from "../../app/store";
import {setResponse} from "../../app/slices/userSlice";
import Toast from "../../components/Toast";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const wait = (timeout: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};


const isRunningInExpoGo = Constants.appOwnership === 'expo'

interface cardProps {
    theme: 'light' | 'dark',
    item: {
        "id": string,
        "content": string,
        "imageUrl": "",
        "userId": string,
        "postId": string,
        "commentLikesCount": 0,
        "commentDislikesCount": 0,
        "commentRepliesCount": 0,
        "isEdited": true,
        "parentId": null,
        liked: boolean,
        "isDeleted": false,
        "createdAt": string,
        "updatedAt": string,
        "deletedAt": null,
        "user": {
            "username": null,
            "avatar": string,
            "fullName": string,
            "id": string
        },

    },
    handleSnapPress: (id: string,userId:string) => void,
    likeComment: (id: string) => void

}

const CommentCard = ({theme, item, likeComment,handleSnapPress}: cardProps) => {

    //  const {data: likes, refetch} = useQuery(['getPostLikes'], () => getPostLike(item.id))


    const backgroundColorCard = theme == 'light' ? '#fff' : Colors.dark.disable
    const backgroundColor = theme == 'light' ? "#EDEDED" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'


    return (
        <Animated.View key={item.id} entering={FadeInDown} exiting={FadeOutDown}
                       layout={Layout.easing(Easing.ease).delay(20)}>
            <Pressable style={[styles.postCard, {
                minHeight: heightPixel(80),

                borderTopColor: borderColor,
                borderTopWidth: 1,
                backgroundColor: backgroundColorCard
            }]}>
                <View style={styles.topPostSection}>
                    <View style={styles.userImage}>

                        {
                            isRunningInExpoGo ?
                                <Image

                                    source={{uri: !item?.user?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : item?.user?.avatar}}
                                    style={styles.avatar}
                                />
                                :
                                <FastImage
                                    resizeMode={FastImage.resizeMode.cover}
                                    source={{
                                        uri: !item?.user?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : item?.user?.avatar,
                                        cache: FastImage.cacheControl.web,
                                        priority: FastImage.priority.normal,
                                    }}

                                    style={styles.avatar}
                                />
                        }
                    </View>

                    <View style={styles.details}>
                        <View style={styles.leftDetails}>
                        <View style={styles.nameTag}>
                            <Text style={[styles.postName, {
                                color: textColor
                            }]}>
                                {
                                    item.user.fullName
                                }
                            </Text>

                            {/*   <View style={[styles.tag, {
                            // backgroundColor
                        }]}>
                            <Text style={styles.tagText}>
                                Admin
                            </Text>
                        </View>*/}
                        </View>

                            <TouchableOpacity onPress={() => {
                                handleSnapPress(item.id, item.user.id)

                            }}>
                                <Entypo name="dots-three-horizontal" size={24} color={lightTextColor}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.postDate}>
                            {dayjs(item.createdAt).fromNow()}


                        </Text>
                    </View>


                </View>

                <View style={[styles.postSnippet, {}]}>


                    <Text style={[styles.postHead, {
                        color: textColor
                    }]}>
                        {item.content}

                    </Text>
                </View>

                <View style={[styles.actionButtons, {
                    height: heightPixel(30),
                }]}>
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialIcons name="reply" size={20} color={"#838383"}/>
                        <Text style={styles.actionButtonText}>
                            Reply {item.commentRepliesCount} replies
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => likeComment(item.id)} style={styles.actionButton}>
                        {
                            !item.liked ? <AntDesign name="like2" size={20} color={"#838383"}/>
                                :
                                <AntDesign name="like1" size={20} color={Colors.primaryColor}/>
                        }

                        <Text style={styles.actionButtonText}>
                            {item.commentLikesCount} likes
                        </Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Animated.View>
    )
}
const PostScreen = ({navigation, route}: RootStackScreenProps<'PostScreen'>) => {

    const {postId, communityId, post} = route.params
    const dispatch = useAppDispatch()
    const offset = useSharedValue(0);
    const [toggleMenu, setToggleMenu] = useState(false);
    const user = useAppSelector(state => state.user)
    const {responseState, responseType, responseMessage} = user
    const [refreshing, setRefreshing] = useState(false);
    const [content, setContent] = useState('');
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const videoRef = useRef(null);

    const [sheetIndex, setSheetIndex] = useState('');
    const [userId, setUserId] = useState('');

    const backgroundColorCard = theme == 'light' ? '#fff' : Colors.dark.disable
    const {data: community,} = useQuery(['getCommunityInfo'], () => getCommunityInfo(communityId))
    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'
    const goBack = () => {
        navigation.goBack()
    }
    const {data, isLoading, refetch} = useQuery(['getCommunityPost'], () => getCommunityPost(postId))
    const {mutate: getPost} = useMutation(['getCommunityPost'], getCommunityPost)


    const snapPoints = useMemo(() => ["1%", "30%"], []);

    const sheetRef = useRef<BottomSheet>(null);
    const handleSnapPress = useCallback((id: string, userId) => {
        setSheetIndex(id)
        setUserId(userId)
        sheetRef.current?.snapToIndex(1);
    }, []);
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);


    const blockUserScreen = () => {
        handleClosePress()
        navigation.navigate('BlockUser', {
            userId
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

    const {mutate, data: likedData} = useMutation(['likeAPost'], likeAPost, {
        onSuccess: (data) => {
            if (data.success) {
                refetch()
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'success',
                }))
            } else {
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'error',
                }))
            }

        }
    })


    const {
        isLoading: loadingComments,
        data: comments,
        hasNextPage,
        fetchNextPage: fetchNextPageComment,
        isFetchingNextPage,
        refetch: fetchComments,
        isFetching,
        isRefetching
    } = useInfiniteQuery([`PostComments`], ({pageParam = 1}) => getPostComments.comments(pageParam, postId),
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


    const {mutate: likeComment, data: liked} = useMutation(['likeAComment'], likeAComment, {
        onSuccess: (data) => {

            if (data.success) {
                fetchComments()
                store.dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'success',
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

    let type = post?.thumbnailUrl?.substring(post?.thumbnailUrl.lastIndexOf(".") + 1);

    //console.log(comments?.pages[0]?.data?.result)
    const renderItem = useCallback(
        ({item}) => (

            <>
                {
                    !loadingComments ?

                        <CommentCard handleSnapPress={handleSnapPress} likeComment={likeComment} theme={theme} item={item}/>
                        :
                        <ActivityIndicator size='small' color={Colors.primaryColor}/>
                }
            </>
        ),
        [theme, loadingComments, likeComment],
    );


    const commentOnPost = () => {
        navigation.navigate('CommentOnPost', {
            id: postId,
            post: data?.data
        })
    }

    const flagPost = () => {
        handleClosePress()
        navigation.navigate('FlagPost',{
            postId:sheetIndex
        })
    }
    const renderHeaderItem = useCallback(
        ({}) => (
            <Animated.View key={data?.data.id} entering={FadeIn} exiting={FadeOut}
                           layout={Layout.easing(Easing.ease).delay(20)}
                           style={[styles.postCard, {backgroundColor: backgroundColorCard}]}>

                <View style={styles.topPostSection}>
                    <View style={styles.userImage}>


                        <FastImage
                            resizeMode={FastImage.resizeMode.cover}
                            source={{
                                uri: !post?.user?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : post?.user?.avatar,
                                cache: FastImage.cacheControl.web,
                                priority: FastImage.priority.normal,
                            }}

                            style={styles.avatar}
                        />
                    </View>

                    <View style={styles.details}>

                        <View style={styles.nameTag}>
                            <View style={styles.leftDetails}>
                                <Text style={[styles.postName, {
                                    color: textColor
                                }]}>
                                    {post?.user?.fullName}
                                </Text>

                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>
                                        Admin
                                    </Text>
                                </View>
                            </View>


                            <TouchableOpacity onPress={() => {
                                handleSnapPress(data?.data.id, data?.data.user.id)

                            }}>
                                <Entypo name="dots-three-horizontal" size={24} color={lightTextColor}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.postDate}>

                            {dayjs(data?.user?.createdAt).format('DD MMM YYYY')}
                        </Text>
                    </View>


                </View>

                <View style={[styles.postSnippet, {
                    marginBottom: data?.data?.thumbnailUrl !== '' ? 10 : 0
                }]}>


                    <Text style={[styles.postHead, {
                        color: textColor
                    }]}>
                        {post?.content}
                    </Text>
                </View>
                {
                    data?.data?.thumbnailUrl &&

                    <View style={styles.postImageWrap}>
                        {
                            type !== 'mov' && type !== 'mp4' &&
                            <FastImage
                                resizeMode={FastImage.resizeMode.cover}
                                source={{
                                    uri: post?.thumbnailUrl,
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
                                    uri: post?.thumbnailUrl,

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
                    <TouchableOpacity activeOpacity={0.8} onPress={() => mutate(postId)}
                                      style={styles.actionButton}>

                        {
                            !post?.liked ? <AntDesign name="like2" size={20} color={"#838383"}/>
                                :
                                <AntDesign name="like1" size={20} color={Colors.primaryColor}/>
                        }
                        <Text style={styles.actionButtonText}>
                            {data?.data?.likes} likes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} onPress={commentOnPost} style={styles.actionButton}>

                        <Octicons name="comment" size={20} color="#838383"/>
                        <Text style={styles.actionButtonText}>
                            {data?.data?.commentCount} comments
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        ),
        [data, theme, post],
    );


    const renderFooterItem = useCallback(
        ({}) => (
            <View style={styles.replyInputContainer}>
                <View style={[styles.inputContainer, {}]}>

                    <RNTextInput
                        multiline

                        onChangeText={(e) => {
                            setContent(e)
                        }}

                        value={content}

                        placeholder={'Write something...'}
                        placeholderTextColor="#6D6D6D"
                        style={[styles.input, {
                            padding: 10,

                            color: textColor,

                        }]}/>
                    <Text>
                        Post
                    </Text>
                </View>
            </View>

        ),
        [content],
    );


    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);

    const menuToggle = () => {
        offset.value = Math.random()
        setToggleMenu(!toggleMenu)
    }
    const refresh = () => {
        setRefreshing(true)
        refetch()

        wait(2000).then(() => setRefreshing(false));
    }


    const _scrollToInput = (reactNode: any) => {
        // Add a 'scroll' ref to your ScrollView
        // scroll.props.scrollToFocusedInput(reactNode)
    }
    useEffect(() => {
        fetchComments()
    }, [postId])
    // useRefreshOnFocus(fetchComments)
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
                <Toast message={responseMessage} state={responseState} type={responseType}/>
                <View style={styles.navBar}>
                    <TouchableOpacity onPress={goBack} style={styles.goBack} activeOpacity={0.8}>
                        <AntDesign name="arrowleft" size={24} color={textColor}/>
                    </TouchableOpacity>
                    <Text style={[styles.screenTitle, {
                        color: textColor
                    }]}>
                        {community.data.name}
                    </Text>


                    {/*   <TouchableOpacity onPress={menuToggle} activeOpacity={0.8} style={styles.rightButton}>
                        <SimpleLineIcons name="menu" size={24} color={textColor}/>
                    </TouchableOpacity>*/}
                </View>
                {/*   <KeyboardAwareScrollView
                    automaticallyAdjustKeyboardInsets={true}
                    enableAutomaticScroll

                    refreshControl={<RefreshControl tintColor={Colors.primaryColor}
                                                    refreshing={refreshing} onRefresh={refresh}/>}
                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {

                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>*/}
                {/*   {
                    isLoading &&

                    <ActivityIndicator color={Colors.primaryColor} size={"small"}
                                       style={[StyleSheet.absoluteFillObject, {
                                           backgroundColor: 'rgba(0,0,0,0.2)',
                                           zIndex: 2,
                                       }]}/>
                }*/}

                <HorizontalLine color={theme == 'light' ? Colors.borderColor : '#313131'}/>
                <View style={{
                    width: '100%',
                    flex: 1,
                }}>

                    <FlashList
                        estimatedItemSize={100}
                        automaticallyAdjustKeyboardInsets={true}
                        ListHeaderComponent={renderHeaderItem}
                        scrollEventThrottle={16}

                        refreshing={isLoading}
                        onRefresh={refetch}
                        scrollEnabled
                        showsVerticalScrollIndicator={false}
                        data={comments?.pages[0]?.data?.result}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        onEndReachedThreshold={0.3}
                        automaticallyAdjustContentInsets
                        ListFooterComponent={isFetchingNextPage ?
                            <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}

                        /*     contentContainerStyle={{flexGrow: 1}}
                             ListFooterComponentStyle={{flex:1, justifyContent: 'flex-end' }}*/

                    />


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


                    <Pressable onPress={flagPost} style={[styles.optionsActionButton, {}]}>
                        <Ionicons name="flag" size={20} color={textColor}/>

                        <Text style={[styles.actionBtnTxt, {
                            color: textColor,
                            marginLeft: 10,
                        }]}>
                            Flag Post
                        </Text>
                    </Pressable>


                    <Pressable onPress={blockUserScreen} style={[styles.optionsActionButton, {}]}>
                        <MaterialIcons name="block" size={20} color={textColor}/>

                        <Text style={[styles.actionBtnTxt, {
                            color: Colors.primaryColor,
                            marginLeft: 10,
                        }]}>
                            Block User
                        </Text>
                    </Pressable>

{/*
                    <Pressable style={[styles.optionsActionButton, {}]}>
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
        backgroundColor: "#EDEDED",

    },
    scrollView: {
        //  paddingHorizontal: pixelSizeHorizontal(20),
        //  backgroundColor: Colors.background,
        //  backgroundColor: "#fff",
        width: '100%',
        alignItems: 'center'
    },
    navBar: {
        paddingHorizontal: pixelSizeHorizontal(24),
        width: '100%',
        height: heightPixel(60),
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
        width: widthPixel(30),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    screenTitle: {
        marginLeft: 15,
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(16),
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
        fontSize: fontPixel(12),
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
    replyInputContainer: {
        borderTopColor: Colors.borderColor,
        borderTopWidth: 1,
        //   backgroundColor: 'red',
        width: '100%',
        height: 70,


    },
    input: {
        fontSize: fontPixel(16),
        paddingTop: 10,
        width: '80%',
        fontFamily: Fonts.quicksandSemiBold,
        height: '100%',
    },
    inputContainer: {

        width: '100%',
        marginTop: 8,
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: 'row',


    },

    leftDetails: {
        width: '85%',
        flexDirection: 'row',
        alignItems: 'center',

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
    },
    dismiss: {
        position: 'absolute',
        right: 10,
        borderRadius: 30,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',

    },
})

export default PostScreen;
