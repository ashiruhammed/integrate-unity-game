import React, {useCallback, useMemo, useRef, useState} from 'react';

import {Text, View, StyleSheet, TouchableOpacity, Pressable, Image, Platform, ActivityIndicator} from 'react-native';
import {useAppSelector} from "../../app/hooks";
import Colors from "../../constants/Colors";
import {SafeAreaView} from "react-native-safe-area-context";
import {AntDesign, Entypo, Ionicons, MaterialIcons} from "@expo/vector-icons";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {RootStackScreenProps} from "../../../types";
import HorizontalLine from "../../components/HorizontalLine";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from "react-native-reanimated";
import FastImage from "react-native-fast-image";
import dayjs from "dayjs";
import {Fonts} from "../../constants/Fonts";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";
import {getCommentReplies, getCommunityPost, getPostComments, likeAComment} from "../../action/action";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {useRefreshOnFocus} from "../../helpers";
import {FlashList} from "@shopify/flash-list";


interface props {
    item:{
        "commentDislikesCount": number,
        "commentLikesCount": number,
        "commentRepliesCount": number,
        "content": string,
        "createdAt": string,
        "deletedAt": null,
        "id": string,
        "imageUrl": null,
        "isDeleted": boolean,
        "isEdited": boolean,
        "liked": boolean,
        "parentId": string,
        "postId": string,
        "updatedAt": string,
        "user": {
            "avatar": string,
            "fullName": string,
            "id": string,
            "username": string,
        },
        "userId": string,
    },
    theme:"light"|'dark'
}

const ReplyCard = ({item,theme}:props) =>{

    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const backgroundColorCard = theme == 'light' ? '#fff' : Colors.dark.disable

    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'

    return(
        <Animated.View key={item.id} entering={FadeInDown} exiting={FadeOutDown}
                       layout={Layout.easing(Easing.ease).delay(20)}>
            <Pressable  style={[styles.postCard, {
                minHeight: heightPixel(80),

                borderTopColor: borderColor,
                borderTopWidth: 1,
                backgroundColor: backgroundColorCard
            }]}>
                <View style={styles.topPostSection}>
                    <View style={styles.userImage}>



                        <FastImage
                            resizeMode={FastImage.resizeMode.cover}
                            source={{
                                uri: !item?.user?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : item?.user?.avatar,
                                cache: FastImage.cacheControl.web,
                                priority: FastImage.priority.normal,
                            }}

                            style={styles.avatar}
                        />

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


            </Pressable>
        </Animated.View>
    )
}

const CommentScreen = ({navigation,route}:RootStackScreenProps<'CommentScreen'>) => {
const {comment} = route.params

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const backgroundColorCard = theme == 'light' ? '#fff' : Colors.dark.disable


    const [sheetIndex, setSheetIndex] = useState('');
    const [userId, setUserId] = useState('');


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


    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'

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

    const {
        isLoading: loadingReplies,
        data: replies,
        hasNextPage,
        fetchNextPage: fetchNextPageComment,
        isFetchingNextPage,
        refetch: fetchReplies,
        isFetching,
        isRefetching
    } = useInfiniteQuery([`CommentsReplies`], ({pageParam = 1}) => getCommentReplies.comments(pageParam, comment.id),
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

console.log(replies?.pages[0]?.result)

    const {mutate: likeComment, data: liked} = useMutation(['likeAComment'], likeAComment, {
        onSuccess: (data) => {

            if (data.success) {

                /* store.dispatch(setResponse({
                     responseMessage: data.message,
                     responseState: true,
                     responseType: 'success',
                 }))*/
            } else {
                /* store.dispatch(setResponse({
                     responseMessage: data.message,
                     responseState: true,
                     responseType: 'error',
                 }))*/
            }
        }
    })

    const blockUserScreen = () => {
        handleClosePress()
        navigation.navigate('BlockUser', {
            userId
        })
    }

    const replyComment = () => {
        navigation.navigate('ReplyComment', {
            id: comment.id,
parentId:comment.parentId,
            post: comment
        })
    }

    const flagPost = () => {
        handleClosePress()
        navigation.navigate('FlagPost',{
            postId:sheetIndex
        })
    }
    const goBack = ()=>{
        navigation.goBack()
    }


const renderItem = useCallback(
    ({item}) => (
        <ReplyCard item={item} theme={theme}/>
    )

    ,
    [theme],
);

    const renderHeaderItem = useCallback(
        ({}) => (
            <Animated.View key={comment.id} entering={FadeInDown} exiting={FadeOutDown}
                           layout={Layout.easing(Easing.ease).delay(20)}>
                <Pressable  style={[styles.postCard, {
                    minHeight: heightPixel(80),

                    borderTopColor: borderColor,
                    borderTopWidth: 1,
                    backgroundColor: backgroundColorCard
                }]}>
                    <View style={styles.topPostSection}>
                        <View style={styles.userImage}>



                            <FastImage
                                resizeMode={FastImage.resizeMode.cover}
                                source={{
                                    uri: !comment?.user?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : comment?.user?.avatar,
                                    cache: FastImage.cacheControl.web,
                                    priority: FastImage.priority.normal,
                                }}

                                style={styles.avatar}
                            />

                        </View>

                        <View style={styles.details}>
                            <View style={styles.leftDetails}>
                                <View style={styles.nameTag}>
                                    <Text style={[styles.postName, {
                                        color: textColor
                                    }]}>
                                        {
                                            comment.user.fullName
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
                                    handleSnapPress(comment.id, comment.user.id)

                                }}>
                                    <Entypo name="dots-three-horizontal" size={24} color={lightTextColor}/>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.postDate}>
                                {dayjs(comment.createdAt).fromNow()}


                            </Text>
                        </View>


                    </View>

                    <View style={[styles.postSnippet, {}]}>


                        <Text style={[styles.postHead, {
                            color: textColor
                        }]}>
                            {comment.content}

                        </Text>
                    </View>

                    <View style={[styles.actionButtons, {
                        height: heightPixel(30),
                    }]}>
                        <TouchableOpacity onPress={replyComment} activeOpacity={0.6}  style={styles.actionButton}>
                            <MaterialIcons name="reply" size={20} color={"#838383"}/>
                            <Text style={styles.actionButtonText}>
                                Reply {comment.commentRepliesCount} replies
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => likeComment(comment.id)} style={styles.actionButton}>
                            {
                                !comment.liked ? <AntDesign name="like2" size={20} color={"#838383"}/>
                                    :
                                    <AntDesign name="like1" size={20} color={Colors.primaryColor}/>
                            }

                            <Text style={styles.actionButtonText}>
                                {comment.commentLikesCount} likes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Animated.View>
        ),[])

    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);

    useRefreshOnFocus(fetchReplies)
console.log(replies?.pages[0]?.data)

    return (
        <>


        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
            <View style={styles.navBar}>
                <TouchableOpacity onPress={goBack} style={styles.goBack} activeOpacity={0.8}>
                    <AntDesign name="arrowleft" size={24} color={textColor}/>
                </TouchableOpacity>

                <Text style={[styles.screenTitle, {
                    color: textColor
                }]}>
                    <Text style={{fontFamily:Fonts.quicksandMedium}}>Reply</Text> {comment.user.fullName}
                </Text>


                {/*   <TouchableOpacity onPress={menuToggle} activeOpacity={0.8} style={styles.rightButton}>
                        <SimpleLineIcons name="menu" size={24} color={textColor}/>
                    </TouchableOpacity>*/}
            </View>

            <View style={{
                width: '100%',
                flex: 1,
            }}>




                <FlashList
                    estimatedItemSize={100}
                    automaticallyAdjustKeyboardInsets={true}
                    ListHeaderComponent={renderHeaderItem}
                    scrollEventThrottle={16}

                    refreshing={loadingReplies}
                    onRefresh={fetchReplies}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    data={replies?.pages[0]?.data?.result}
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

export default CommentScreen;
