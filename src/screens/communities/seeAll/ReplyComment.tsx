import React, {useCallback, useEffect, useMemo, useRef} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput as RNTextInput,
    ActivityIndicator,
    Pressable, Keyboard
} from 'react-native';
import Toast from "../../../components/Toast";
import Colors from "../../../constants/Colors";
import {SafeAreaView} from "react-native-safe-area-context";
import {setResponse, unSetResponse} from "../../../app/slices/userSlice";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";
import {RootStackScreenProps} from "../../../../types";
import {useFormik} from "formik";
import * as yup from "yup";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import FastImage from 'react-native-fast-image';
import dayjs from "dayjs";
import {isLessThan24HourAgo, truncate} from "../../../helpers";
import {Entypo, Ionicons} from "@expo/vector-icons";
import {commentOnAPost, postToCommunity, replyToComment} from "../../../action/action";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import SwipeAnimatedToast from "../../../components/toasty";
import {addNotificationItem} from "../../../app/slices/dataSlice";

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)




const formSchema = yup.object().shape({

    content: yup.string().required('Content is required'),

});

const ReplyComment = ({navigation, route}: RootStackScreenProps<'ReplyComment'>) => {

    const {post,parentId,id} = route.params

    const queryClient = useQueryClient();
    const dispatch = useAppDispatch()

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const user = useAppSelector(state => state.user)


    const {responseState, responseType, responseMessage, userData} = user


    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'


    const snapPoints = useMemo(() => ["1%", "30%"], []);

    const sheetRef = useRef<BottomSheet>(null);
    const handleSnapPress = useCallback((index: number) => {
        Keyboard.dismiss()
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);

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


    const {mutate, isLoading} = useMutation(['replyToComment'], replyToComment,

        {

            onSuccess: async (data) => {

                if (data.success) {

                    navigation.goBack()

                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'success',
                        body: data.message,
                    }))
                } else {


                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'error',
                        body: data.message,
                    }))

                    /*  navigation.navigate('EmailConfirm', {
                          email:contentEmail
                      })*/


                }
            },

            onError: (err) => {

                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: err.message,
                }))
            },
            onSettled: () => {
                queryClient.invalidateQueries(['replyToComment']);
            }

        })


    const {
        resetForm,
        handleChange, handleSubmit, handleBlur,
        setFieldValue,
        isSubmitting,
        setSubmitting,
        values,
        errors,
        touched,
        isValid
    } = useFormik({
        validationSchema: formSchema,
        initialValues: {

            "content": "",


        },
        onSubmit: (values) => {
            const {content} = values
            const body = JSON.stringify({
                "postId": post.postId,
                parentId:post.parentId,
                content,

            })

            mutate(body)

        }
    });


    const goBack = () => {
        if (values.content !== '') {
              handleSnapPress(1)
        } else {
            navigation.goBack()
        }


    }
    const closeScreen = () => {
        navigation.goBack()
    }



    return (


        <>

            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
                <SwipeAnimatedToast/>

                <View style={styles.topBar}>
                    <TouchableOpacity onPress={goBack}>
                        <Text style={[styles.btnText, {
                            color: textColor
                        }]}>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleSubmit()} disabled={!isValid || isLoading}
                                      style={[styles.postBtn, {
                                          backgroundColor: isValid ? Colors.primaryColor : borderColor,
                                      }]}>
                        {
                            isLoading ?
                        <ActivityIndicator color={"#fff"} size={"small"}/>
                            :
                        <Text style={styles.btnText}>
                            Reply
                        </Text>
                        }
                    </TouchableOpacity>
                </View>


                <KeyboardAwareScrollView
                    automaticallyAdjustKeyboardInsets

                    enableAutomaticScroll
                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>

                    <View style={styles.theBox}>
                        <View style={styles.timeline}>

                            <View style={styles.userImage}>
                                <FastImage
                                    resizeMode={FastImage.resizeMode.cover}
                                    source={{
                                        uri: !post?.user?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : post?.user?.avatar,
                                        cache: FastImage.cacheControl.web,
                                        priority: FastImage.priority.normal,
                                    }}

                                    style={styles.userImagePhoto}
                                />
                            </View>
                            <View style={[styles.verticalLine, {
                                backgroundColor: borderColor
                            }]}>


                            </View>
                            <View style={styles.userImage}>
                                <FastImage
                                    resizeMode={FastImage.resizeMode.cover}
                                    source={{
                                        uri: !userData?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : userData?.avatar,
                                        cache: FastImage.cacheControl.web,
                                        priority: FastImage.priority.normal,
                                    }}

                                    style={styles.userImagePhoto}
                                />
                            </View>


                        </View>

                        <View style={styles.contentWindow}>
                            <View style={styles.contentWrp}>

                                <View style={styles.details}>

                                    <View style={styles.nameTag}>
                                        <Text style={[styles.postName, {
                                            color: textColor
                                        }]}>
                                            {post?.user?.fullName}
                                        </Text>
                                        <Entypo name="dot-single" size={14} color="black" />
                                        <View style={styles.tag}>
                                            <Text style={styles.postDate}>

                                                { dayjs(post.createdAt).fromNow() }
                                            </Text>
                                        </View>

                                    </View>

                                </View>

                                <View style={[styles.postSnippet, {}]}>


                                    <Text style={[styles.postHead, {
                                        color: textColor
                                    }]}>
                                            {truncate(post.content.trim(), 70)}

                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.inputContainer, {}]}>

                                <RNTextInput
                                    multiline

                                    onChangeText={(e) => {
                                        handleChange("content")(e)
                                    }}
                                    autoFocus={true}

                                    value={values.content}
                                    placeholder={'Write your reply...'}
                                    placeholderTextColor="#6D6D6D"
                                    style={[styles.input, {
                                        padding: 10,

                                        color: textColor,

                                    }]}/>

                            </View>
                        </View>
                    </View>

                </KeyboardAwareScrollView>

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
                    <View style={{
                        width: '10%'
                    }}/>
                    <Text style={[styles.sheetTitle, {
                        color: textColor
                    }]}>
                        You have unfinished post
                    </Text>
                    <View style={{
                        width: '10%'
                    }}/>

                </View>

                <BottomSheetView style={styles.optionBox}>
                    <Pressable onPress={closeScreen} style={[styles.deleteBtn, {
                        borderColor,
                        borderWidth: 1,
                    }]}>
                        <Ionicons name="md-trash-outline" size={24} color={Colors.primaryColor}/>
                        <Text style={[styles.deleteBtnTxt, {
                            color: textColor,
                            marginLeft: 10,
                        }]}>
                            Delete
                        </Text>
                    </Pressable>

                    <Pressable onPress={() => handleClosePress()} style={[styles.deleteBtn, {}]}>

                        <Text style={[styles.deleteBtnTxt, {
                            color: textColor,
                            marginLeft: 10,
                        }]}>
                            Cancel
                        </Text>
                    </Pressable>

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
        paddingHorizontal: pixelSizeHorizontal(20)
    },
    scrollView: {

        //  backgroundColor: Colors.background,
        width: '100%',
        alignItems: 'center'
    },
    topBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: heightPixel(50),

    },
    postBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: widthPixel(100),
        height: heightPixel(35),

        borderRadius: 10,

    },
    btnText: {
        color: "#fff",
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(16),

    },
    theBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    timeline: {
        height: 120,
        width: 40,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    userImage: {
        width: 25,
        height: 25,
        borderRadius: 35,
        backgroundColor: "#ccc"
    },
    userImagePhoto: {
        width: "100%",
        height: "100%",
        borderRadius: 35,
        resizeMode: 'cover'
    },
    verticalLine: {
        height: 80,
        width: 2,

    },
    contentWindow: {
        alignItems: 'center',
        justifyContent: 'flex-start',

        width: '90%',

    },
    contentWrp: {
      //  padding: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

        width: '100%',
        height: heightPixel(100)
    },
    inputContainer: {

        width: '100%',
        marginTop: 8,
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: 'row',


    },
    input: {
        fontSize: fontPixel(14),
        paddingTop: 10,
        fontFamily: Fonts.quicksandMedium,
        height: '100%',
    },
    details: {
        width: '100%',
        height: heightPixel(20),
textAlignVertical:'top',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    nameTag: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',

    },
    tag: {

        minWidth: 50,

        borderRadius: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

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
        lineHeight: heightPixel(18),
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(14),
        color: Colors.light.text,
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
    optionBox: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        height: '80%',
        paddingHorizontal: pixelSizeHorizontal(20),

    },
    deleteBtn: {
        width: '90%',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 55,
        justifyContent: 'center'
    },
    deleteBtnTxt: {
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
    }

})

export default ReplyComment;
