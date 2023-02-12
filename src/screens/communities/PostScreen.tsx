import React, {useCallback, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    ScrollView, TextInput as RNTextInput, Pressable, Animated as MyAnimated, FlatList
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {RootStackScreenProps} from "../../../types";
import {AntDesign, Ionicons, MaterialIcons, Octicons, SimpleLineIcons} from "@expo/vector-icons";
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
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {getCommunityPost, getCommunityPosts, getPostComments, getPostLike, likeAPost} from "../../action/action";
import dayjs from "dayjs";
import {truncate, useRefreshOnFocus} from "../../helpers";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import FastImage from "react-native-fast-image";
import {FlashList} from "@shopify/flash-list";


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
        "liked": false
    },


}

const CommentCard = ({theme, item}: cardProps) => {

    //  const {data: likes, refetch} = useQuery(['getPostLikes'], () => getPostLike(item.id))
//    const {mutate} = useMutation(['likeAPost'], likeAPost)

    const backgroundColorCard = theme == 'light' ? '#fff' : Colors.dark.disable
    const backgroundColor = theme == 'light' ? "#EDEDED" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'

    return (
        <Pressable style={[styles.postCard, {
            backgroundColor: backgroundColorCard
        }]}>
            <View style={styles.topPostSection}>
                <View style={styles.userImage}>

                    {/* {
                        isRunningInExpoGo ?
                            <Image

                                source={{uri:!item?.user?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : item?.user?.avatar}}
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
                    }*/}
                </View>

                <View style={styles.details}>

                    <View style={styles.nameTag}>
                        <Text style={[styles.postName, {
                            color: textColor
                        }]}>
                            Orji ace
                        </Text>

                        <View style={[styles.tag, {
                            // backgroundColor
                        }]}>
                            <Text style={styles.tagText}>
                                Admin
                            </Text>
                        </View>

                    </View>
                    <Text style={styles.postDate}>
                        2Min
                        {/*{dayjs(item.createdAt).format('DD MMM YYYY')}*/}
                    </Text>
                </View>


            </View>

            <View style={[styles.postSnippet, {}]}>


                <Text style={[styles.postHead, {
                    color: textColor
                }]}>
                    {/*     {truncate(item.content.trim(), 80)}*/}
                    Lorem ipsum dolor sit amet consectetur. Ultricies
                    amet fermentum
                </Text>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="reply" size={20} color={"#838383"}/>
                    <Text style={styles.actionButtonText}>
                        Reply
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>

                    <AntDesign name="like2" size={20} color={"#838383"}/>
                    <Text style={styles.actionButtonText}>
                        likes
                    </Text>
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}
const PostScreen = ({navigation, route}: RootStackScreenProps<'PostScreen'>) => {

    const {postId, communityId} = route.params
    const offset = useSharedValue(0);
    const [toggleMenu, setToggleMenu] = useState(false);

    const [refreshing, setRefreshing] = useState(false);
    const [content, setContent] = useState('');
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
    const {data, isLoading, refetch} = useQuery(['getCommunityPost'], () => getCommunityPost(postId))

    const {mutate} = useMutation(['likeAPost'], likeAPost, {
        onSuccess: (data) => {
            refetch()
        }
    })


    const {
        isLoading: loadingComments,
        data: comments,
        hasNextPage,
        fetchNextPage: fetchNextPageComment,
        isFetchingNextPage,
        refetch: fetchComments,

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


    //console.log(comments?.pages[0]?.data?.result)
    const renderItem = useCallback(
        ({item}) => (

                <CommentCard theme={theme} item={item}/>
        ),
        [],
    );

    const renderHeaderItem = useCallback(
        ({}) => (

            <View style={[styles.postCard, {backgroundColor: backgroundColorCard}]}>
                <View style={styles.topPostSection}>
                    <View style={styles.userImage}>

                        <Image
                            source={{uri: !data?.data?.user?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : data?.data?.user?.avatar}}
                            style={styles.avatar}/>


                    </View>

                    <View style={styles.details}>

                        <View style={styles.nameTag}>
                            <Text style={[styles.postName, {
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

                <View style={[styles.postSnippet, {
                    marginBottom: data?.data?.thumbnailUrl !== '' ? 10 : 0
                }]}>


                    <Text style={[styles.postHead, {
                        color: textColor
                    }]}>
                        {data?.data?.content}
                    </Text>
                </View>
                {
                    data?.data?.thumbnailUrl &&

                    <View style={styles.postImageWrap}>
                        <Image
                            source={{uri: data?.data?.thumbnailUrl}}
                            style={styles.postImage}
                        />
                    </View>
                }


                <View style={styles.actionButtons}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => mutate(postId)}
                                      style={styles.actionButton}>
                        <AntDesign name="like2" size={20}
                                   color={data?.data?.liked ? Colors.primaryColor : "#838383"}/>
                        <Text style={styles.actionButtonText}>
                            {data?.data?.likes} likes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>

                        <Octicons name="comment" size={20} color="#838383"/>
                        <Text style={styles.actionButtonText}>
                            {data?.data?.commentCount} comments
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        ),
        [],
    );  const renderFooterItem = useCallback(
        ({}) => (
            <View style={styles.replyInputContainer}>
                <View  style={[styles.inputContainer, {}]}>

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

                        <Text style={[styles.screenTitle, {
                            color: textColor
                        }]}>
                            Wave community
                        </Text>

                    </TouchableOpacity>


                    <TouchableOpacity onPress={menuToggle} activeOpacity={0.8} style={styles.rightButton}>
                        <SimpleLineIcons name="menu" size={24} color={textColor}/>
                    </TouchableOpacity>
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
                {
                    isLoading &&

                    <ActivityIndicator color={Colors.primaryColor} size={"small"}
                                       style={[StyleSheet.absoluteFillObject, {
                                           backgroundColor: 'rgba(0,0,0,0.2)',
                                           zIndex: 2,
                                       }]}/>
                }

                <HorizontalLine color={theme == 'light' ? Colors.borderColor : '#313131'}/>
                <View style={{
                    width: '100%',
                    flex: 1,
                }}>

                    <FlatList

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

                   {/* <View style={styles.replyInputContainer}>
                        <View  style={[styles.inputContainer, {}]}>

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

                        </View>
                    </View>*/}
                </View>

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
        width:'80%',
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

})

export default PostScreen;
