import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    ActivityIndicator,
    BackHandler,
    ImageBackground,
    Keyboard,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput as RNTextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {RootStackScreenProps} from "../../../types";
import {AntDesign, Feather, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useFormik} from "formik";
import * as yup from "yup";
import {Fonts} from "../../constants/Fonts";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import FastImage from "react-native-fast-image";

import * as ImagePicker from "expo-image-picker";
import Animated, {
    Easing,
    FadeInDown, FadeOutDown, Layout,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';


import * as Haptics from "expo-haptics";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {Video} from "expo-av";

import * as FileSystem from 'expo-file-system';

import * as SecureStore from "expo-secure-store";
import useKeyboardHeight from "../../helpers/react-native-use-keyboard-height";
import {setResponse, unSetResponse} from "../../app/slices/userSlice";
import Toast from "../../components/Toast";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {commentOnProduct, registerProductHunt} from "../../action/action";


const formSchema = yup.object().shape({

    content: yup.string().required('Content is required'),

});


const MakeComment = ({navigation, route}: RootStackScreenProps<'MakeComment'>) => {


    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()


    const {id} = route.params
    const data = useAppSelector(state => state.data)


    const user = useAppSelector(state => state.user)
    const {
        responseMessage,
        responseState,
        responseType,
        userToken,
        userData
    } = user

    const [postContent, setPostContent] = useState('');


    const snapPoints = useMemo(() => ["1%", "30%"], []);

    const sheetRef = useRef<BottomSheet>(null);
    const handleSnapPress = useCallback((index: number) => {
        Keyboard.dismiss()
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);


    let count = 1;
    const width = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(width.value, {
                duration: 10
            }),
        };
    });


    const {mutate, isLoading} = useMutation(['commentOnProduct'], commentOnProduct,
        {
            onSuccess: async data => {

                if (data.success) {
                    // alert(message)
                    navigation.goBack()

                    dispatch(setResponse({
                        responseMessage: data.message,
                        responseState: true,
                        responseType: 'success',
                    }))

                } else {


                    dispatch(setResponse({
                        responseMessage: `${data.message} 😞`,
                        responseState: true,
                        responseType: 'error',
                    }))

                }

            },

            onError: (err) => {
                console.log(err)
                dispatch(setResponse({
                    responseMessage: 'Something happened, please try again 😞',
                    responseState: true,
                    responseType: 'error',
                }))


            },
            onSettled: () => {
                queryClient.invalidateQueries(['commentOnProduct']);
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

            content: "",


        },
        onSubmit: (values) => {
            const {content} = values


            const body = JSON.stringify({
                "productHuntId": id,
                "content": content,
            })

            mutate({body})

        }
    });


    const handleTextChange = (text: string) => {


        const regex = /\S/;


        // Input is not empty
        setPostContent(text);
        setFieldValue('content', text)

    };


    const selectLocation = () => {
        navigation.navigate('SelectLocation')
    }

    const closeSheet = () => {

        navigation.goBack()
    }
    const goBack = () => {
        if (postContent !== '') {
            handleSnapPress(1)

        } else {

            navigation.goBack()
        }


    }


    useEffect(() => {
        const backAction = () => {

            handleSnapPress(1)
            return true;
        };

        if (postContent !== '') {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',

                backAction,
            );

            return () => backHandler.remove();

        }


    }, []);

    // renders
    const renderBackdrop = useCallback(
        (props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
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

    const selectChargingStation = () => {
        navigation.navigate('SelectStation')
    }


    useEffect(() => {
        // console.log(user)
        let time: NodeJS.Timeout | undefined;
        if (responseState || responseMessage) {


            time = setTimeout(() => {
                dispatch(unSetResponse())
            }, 3500)

        }
        return () => {
            clearTimeout(time)
        };
    }, [responseState, responseMessage])


    return (

        <>

            {
                isLoading &&
                <View style={styles.loading}>

                    <Animated.View key={count}
                                   entering={FadeInDown.springify()} exiting={FadeOutDown} style={styles.loadingView}>
                        <Text style={styles.Uploading}>
                            Posting...
                        </Text>
                        <Animated.View style={[styles.loadingViewBorder, animatedStyle]}/>
                    </Animated.View>

                </View>
            }

            <SafeAreaView style={styles.safeArea}>
                <Toast message={responseMessage} type={responseType} state={responseState}/>
                <View style={[styles.authNavBar, {}]}>
                    <TouchableOpacity style={styles.backBtn} onPress={goBack}>
                        <Ionicons name={'arrow-back'} color={"#000"} size={heightPixel(24)}/>
                    </TouchableOpacity>


                    <View style={styles.headerBox}>

                    </View>

                    <View style={styles.headerBox}/>
                </View>


                <KeyboardAwareScrollView
                    style={{width: '100%',}}
                    contentContainerStyle={[styles.scrollView, {}]} scrollEnabled


                    showsVerticalScrollIndicator={false}>


                    <View style={[styles.inputContainer]}>

                        <View style={styles.userImage}>
                            <FastImage
                                style={styles.image}
                                source={{
                                    uri: !userData.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : userData.avatar,

                                    cache: FastImage.cacheControl.web,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                        <RNTextInput
                            multiline

                            onChangeText={handleTextChange}
                            autoFocus={true}
                            value={values.content}
                            placeholder={'Share your experience...'}
                            placeholderTextColor="#6D6D6D"
                            style={[styles.input, {
                                padding: 10,

                                color: "#000",

                            }]}/>


                        <TouchableOpacity disabled={!isValid} onPress={() => {
                            handleSubmit()
                            //uploadVideo()
                        }} style={[styles.sentButton, {
                            backgroundColor: postContent.length > 0 ? Colors.primaryColor : "#828282",
                        }]}>
                            <Ionicons name="paper-plane-outline" size={20} color="#fff"/>
                        </TouchableOpacity>

                    </View>


                </KeyboardAwareScrollView>


            </SafeAreaView>


            <BottomSheet
                backgroundStyle={{
                    backgroundColor: "#fff",
                }}
                handleIndicatorStyle={{
                    backgroundColor: "#121212"
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
                    <Text style={[styles.sheetTitle]}>
                        Discard post?
                    </Text>
                    <View style={{
                        width: '10%'
                    }}/>

                </View>

                <BottomSheetView style={styles.optionBox}>
                    <Pressable onPress={closeSheet} style={[styles.deleteBtn, {}]}>

                        <AntDesign name="close" size={24} color={Colors.errorRed}/>
                        <Text style={[styles.deleteBtnTxt, {

                            marginLeft: 10,
                        }]}>
                            Discard
                        </Text>
                    </Pressable>

                    <Pressable onPress={() => handleClosePress()} style={[styles.deleteBtn, {}]}>

                        <Feather name="feather" size={24} color={Colors.light.darkText}/>
                        <Text style={[styles.deleteBtnTxt, {

                            marginLeft: 10,
                        }]}>
                            Continue with post
                        </Text>
                    </Pressable>

                </BottomSheetView>

            </BottomSheet>

        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        width: '100%',
        backgroundColor: "#fff",
        alignItems: 'center',
    },
    authNavBar: {
        flexDirection: 'row',

        width: '90%',
        height: heightPixel(60),
        alignItems: 'center',
        justifyContent: 'space-between',


    },
    backBtn: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: widthPixel(50),
        height: '100%'
    },
    headerBox: {
        width: widthPixel(50),
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView: {

        //  backgroundColor: Colors.background,
        width: '100%',
        alignItems: 'center'
    },
    inputContainer: {
        //  height: heightPixel(400),

        width: '90%',
        marginTop: 8,
        marginBottom: 10,
        borderRadius: 10,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    input: {
        width: '80%',
        fontSize: fontPixel(14),
        paddingTop: 10,
        fontFamily: Fonts.quicksandRegular,

    },
    postUtility: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        width: '100%',
        paddingHorizontal: pixelSizeHorizontal(12),
        backgroundColor: '#fff'
    },
    utilityWrap: {
        width: '80%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    utilityLeft: {
        // width: '80%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    utilityText: {
        marginLeft: 8,
        color: "#828282",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandRegular
    },
    sentButton: {
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 40,
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
    image: {
        borderRadius: 100,
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
    mediaPreview: {
        width: '90%',
        height: heightPixel(320),
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 10,

        overflow: 'hidden'
    },
    selectedAddress: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        backgroundColor: "#005FD0",
        minHeight: 30,
        paddingHorizontal: pixelSizeHorizontal(10),
        paddingVertical: pixelSizeHorizontal(10),
    },
    selectedAddressOne: {
        flexDirection: 'row',
        width: '90%',
        alignItems: 'center',
        bottom: 0,
        minHeight: 30,


    },
    selectedAddressTextONe: {
        marginLeft: 8,
        color: "#555A64",
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandSemiBold
    },
    selectedStationText: {
        marginLeft: 8,
        color: Colors.light.text,
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandSemiBold
    },
    selectedAddressText: {
        color: "#fff",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandRegular
    },
    dismissMedia: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        borderRadius: 30,
        position: 'absolute',
        right: 10,
        top: 10,
    },
    loading: {
        flex: 1,

        width: '100%',
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 1,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: pixelSizeVertical(100),
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    loadingView: {
        width: '80%',
        height: 40,
        // paddingHorizontal:pixelSizeHorizontal(10),
        borderRadius: 3,
        backgroundColor: '#fff',
        alignContent: 'center',
        justifyContent: 'flex-end',

    },
    Uploading: {
        marginBottom: 10,
        marginLeft: 14,
        color: Colors.light.text,
        fontSize: pixelSizeHorizontal(14),
        fontFamily: Fonts.quicksandSemiBold
    },
    loadingViewBorder: {
        borderColor: Colors.success,
        borderWidth: 2,
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
        color: Colors.light.darkText

    },
    optionBox: {
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        width: '100%',
        height: '60%',
        paddingHorizontal: pixelSizeHorizontal(20),

    },
    deleteBtn: {
        width: '90%',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        justifyContent: 'flex-start'
    },
    deleteBtnTxt: {
        color: Colors.light.darkText,
        fontSize: fontPixel(18),
        fontFamily: Fonts.quicksandSemiBold,
    },
    selectStation: {
        width: '90%',
        height: 50,
        marginTop: 14,
        alignItems: 'flex-start',

    },
    selectStationBtn: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    selectStationText: {
        marginLeft: 8,
        color: "#000",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quickSandBold,
    },
    videoPreview: {
        width: '100%',
        height: heightPixel(320),
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

        overflow: 'hidden'
    },

})

export default MakeComment;
