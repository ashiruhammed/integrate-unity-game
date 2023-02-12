import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput as RNTextInput,
    Platform,
    Keyboard,
    Pressable, ImageBackground, ActivityIndicator
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import Colors from "../../../constants/Colors";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../../helpers/normalize";
import {RootStackScreenProps} from "../../../../types";
import {Fonts} from "../../../constants/Fonts";
import TextAreaInput from "../../../components/inputs/TextArea";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import HorizontalLine from "../../../components/HorizontalLine";
import * as ImagePicker from "expo-image-picker";
import {isLessThanTheMB} from "../../../helpers";
import {setResponse, unSetResponse} from "../../../app/slices/userSlice";
import * as FileSystem from "expo-file-system";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList, BottomSheetView} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {api_key, upload_preset} from "../../../constants";
import {createCommunity, postToCommunity, uploadToCloudinary} from "../../../action/action";
import Animated, {Easing, FadeIn, FadeInDown, FadeOut, FadeOutDown, Layout} from 'react-native-reanimated';
import {Video} from "expo-av";
import TextInput from "../../../components/inputs/TextInput";
import {useFormik} from "formik";
import * as yup from "yup";
import Toast from "../../../components/Toast";


const getFileInfo = async (fileURI: string) => {
    const fileInfo = await FileSystem.getInfoAsync(fileURI, {
        size: true,

    })

    return fileInfo


}


const formSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    //   category: yup.string().required('Category is required').trim('No white spaces'),
    // NFTAccess: yup.string().required('Please provide NFTs required for access'),
    content: yup.string().required('Content is required'),

});


const MakeAPost = ({navigation, route}: RootStackScreenProps<'MakeAPost'>) => {

    const {id} = route.params
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch()
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const user = useAppSelector(state => state.user)


    const {responseState, responseType, responseMessage} = user
    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'
    const optionBg = theme == 'light' ? "#fff" : "#141414"
    const [status, setStatus] = React.useState({});

    const [image, setImage] = useState('');
    const [mediaUrl, setMedialUrl] = useState('');
    const [video, setVideo] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const [post, setPost] = useState('');

    const [title, setTitle] = useState('');
    const [focusTitle, setFocusTitle] = useState(false);

    const videoRef = React.useRef(null);
    const snapPoints = useMemo(() => ["1%", "35%"], []);

    const sheetRef = useRef<BottomSheet>(null);
    const handleSnapPress = useCallback((index: number) => {
        Keyboard.dismiss()
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);

    const requestPermission = useCallback(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const libraryResponse =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                const photoResponse = await ImagePicker.requestCameraPermissionsAsync();

                if (
                    libraryResponse.status !== "granted" ||
                    photoResponse.status !== "granted"
                ) {
                    //  setWarning(true);
                    alert("Sorry, we need camera roll permissions to make this work!");
                }
            }
        })();
    }, []);


    const goBack = () => {
        if (values.content !== '' || values.title !== '' || videoUrl !== '' || mediaUrl !== '') {
            handleSnapPress(1)
        } else {
            navigation.goBack()
        }


    }

    const closeScreen = () => {
        navigation.goBack()
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


    const {mutate: postBlog, isLoading: posting} = useMutation(['postToCommunity'], postToCommunity,

        {

            onSuccess: async (data) => {
                if (data.success) {

                    navigation.goBack()
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

                    /*  navigation.navigate('EmailConfirm', {
                          email:contentEmail
                      })*/


                }
            },

            onError: (err) => {
                dispatch(setResponse({
                    responseMessage: err.message,
                    responseState: true,
                    responseType: 'error',
                }))


            },
            onSettled: () => {
                queryClient.invalidateQueries(['postToCommunity']);
            }

        })


    const {mutate, isLoading} = useMutation(['uploadToCloudinary'], uploadToCloudinary,

        {
            networkMode: 'online',
            onSuccess: async data => {

                // alert(message)
                setImage("")
                setVideo("")

                if (data.resource_type == 'image') {
                    setMedialUrl(data.url)
                    setVideoUrl('')
                } else {
                    setVideoUrl(data.url)
                    setMedialUrl('')
                }

            },

            onError: (err) => {

                dispatch(setResponse({
                    responseMessage: 'Something happened, please try again 😞',
                    responseState: true,
                    responseType: 'error',
                }))


            },
            onSettled: () => {
                queryClient.invalidateQueries(['uploadToCloudinary']);
            }

        })


    const pickImage = async () => {
        // requestPermission()
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // base64:true,
            aspect: [4, 3],
            quality: 0,
        });


        if (!result.cancelled) {

            const isLessThan = isLessThanTheMB(result?.assets[0]?.fileSize, 8)
            if (!isLessThan) {
                dispatch(setResponse({
                    responseMessage: 'Image file too large, must be less than 4MB 🤨',
                    responseState: true,
                    responseType: 'error',
                }))
            } else {

                setImage(result?.assets[0].uri);

                // handleChange('photo')(result?.base64);

            }
        }
    };

    const selectVideo = async () => {

        requestPermission()
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            // base64:true,

            quality: 0,
        });


        if (!result.cancelled) {
            const fileInfo = await getFileInfo(result.assets[0]?.uri)
            const isLessThan = isLessThanTheMB(result.assets[0]?.fileSize, 8)
            if (!isLessThan) {
                dispatch(setResponse({
                    responseMessage: 'Image file too large, must be less than 4MB 🤨',
                    responseState: true,
                    responseType: 'error',
                }))
            } else {

                setVideo(result.assets[0].uri);


            }


        }
    };


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
            title: '',
            "content": "",
            "description": "",


        },
        onSubmit: (values) => {
            const {title, content} = values
            const body = JSON.stringify({
                title,
                content,
                "description": "",
                thumbnailUrl: videoUrl !== '' ? videoUrl : mediaUrl,
                "communityId": id
            })
            postBlog({body})

        }
    });


    useEffect(() => {
        if (!image) {
            return;
        } else if (image) {
            (async () => {

                const data = new FormData()

                //data.append('photo', {uri: image, name: 'photo', type: `image/${type}`} as any)
                /*  data.append('photo',{
                      name: fileName,
                      type: type,
                      uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
                  })*/
                let type = await image?.substring(image.lastIndexOf(".") + 1);
                let fileName = image.split('/').pop()

                // data.append("file", image, "[PROXY]");
                data.append("upload_preset", upload_preset);
                data.append("api_key", api_key);
                data.append('file', {uri: image, name: fileName, type: `image/${type}`} as any)


                mutate({body: data, resource_type: 'image'})

            })()
        }
    }, [image]);


    useEffect(() => {
        if (!video) {
            return;
        } else if (video) {
            (async () => {

                const data = new FormData()

                //data.append('photo', {uri: image, name: 'photo', type: `image/${type}`} as any)
                /*  data.append('photo',{
                      name: fileName,
                      type: type,
                      uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
                  })*/
                let type = await video?.substring(video.lastIndexOf(".") + 1);
                let fileName = video.split('/').pop()

                //  data.append("file", video, "[PROXY]");
                data.append("upload_preset", upload_preset);
                data.append("api_key", api_key);
                data.append('file', {uri: video, name: fileName, type: `video/${type}`} as any)


                mutate({body: data, resource_type: 'video'})

            })()
        }
    }, [video]);


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


            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
                <Toast message={responseMessage} state={responseState} type={responseType}/>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={goBack}>
                        <Text style={[styles.btnText, {
                            color: textColor
                        }]}>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleSubmit()} disabled={!isValid || posting}
                                      style={[styles.postBtn, {
                                          backgroundColor: isValid ? Colors.primaryColor : borderColor,
                                      }]}>

                        <Text style={styles.btnText}>
                            Post
                        </Text>
                    </TouchableOpacity>
                </View>

                {
                    posting &&

                    <ActivityIndicator color={Colors.primaryColor} size={"small"}
                                       style={[StyleSheet.absoluteFillObject, {
                                           backgroundColor: 'rgba(0,0,0,0.2)',
                                           zIndex: 2,
                                       }]}/>
                }
                <KeyboardAwareScrollView
                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>

                    <TextInput
                        keyboardAppearance={theme}
                        keyboardType={"default"}
                        touched={touched.title}
                        error={touched.title && errors.title}
                        onFocus={() => setFocusTitle(true)}
                        onChangeText={(e) => {
                            handleChange('title')(e);
                            setTitle(e);
                        }}
                        onBlur={(e) => {
                            handleBlur('title')(e);
                            setFocusTitle(false);
                        }}
                        defaultValue={title}
                        focus={focusTitle}
                        value={values.title}
                        label="Title"/>

                    <View style={[styles.inputContainer, {}]}>

                        <RNTextInput
                            multiline

                            onChangeText={(e) => {
                                handleChange("content")(e)
                            }}
                            autoFocus={true}
                            value={values.content}
                            placeholder={'Write something...'}
                            placeholderTextColor="#6D6D6D"
                            style={[styles.input, {
                                padding: 10,

                                color: textColor,

                            }]}/>

                    </View>

                    {
                        isLoading &&

                        <Animated.View key={"isLoading"} layout={Layout.easing(Easing.bounce).delay(30)}
                                       entering={FadeIn} exiting={FadeOut} style={styles.mediaPreview}>
                            <ActivityIndicator color={Colors.primaryColor} size='small'/>
                        </Animated.View>
                    }
                    {
                        !isLoading && mediaUrl !== '' &&
                        <Animated.View key={mediaUrl} layout={Layout.easing(Easing.bounce).delay(30)}
                                       entering={FadeIn} exiting={FadeOut} style={styles.mediaPreview}>


                            <ImageBackground resizeMode='cover' source={{uri: mediaUrl}} style={{
                                height: '100%',
                                borderRadius: 20,
                                width: '100%',
                            }}/>

                        </Animated.View>
                    }

                    {
                        !isLoading && videoUrl !== '' &&

                        <View style={styles.videoPreview}>
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
                                    uri: videoUrl,

                                }}
                                useNativeControls
                                resizeMode="contain"

                                isLooping={false}
                                onPlaybackStatusUpdate={status => setStatus(() => status)}
                            />
                        </View>
                    }
                    <HorizontalLine color={borderColor}/>

                    <View style={styles.mediaPost}>
                        <TouchableOpacity onPress={pickImage} style={styles.mediaButton}>
                            <Ionicons name="ios-images" size={18} color={Colors.primaryColor}/>
                            <Text style={styles.mediaButtonText}>
                                Photo
                            </Text>
                        </TouchableOpacity>

                        <View style={{
                            height: '100%',
                            width: 1,
                            backgroundColor: borderColor,

                        }}/>
                        <TouchableOpacity onPress={selectVideo} style={styles.mediaButton}>
                            <FontAwesome name="video-camera" size={18} color={Colors.success}/>

                            <Text style={styles.mediaButtonText}>
                                Video
                            </Text>
                        </TouchableOpacity>
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
    )
        ;
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: pixelSizeHorizontal(20)
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
        width: widthPixel(80),
        height: heightPixel(35),

        borderRadius: 10,

    },
    btnText: {
        color: "#fff",
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(16),

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
    scrollView: {

        //  backgroundColor: Colors.background,
        width: '100%',
        alignItems: 'center'
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
    mediaPreview: {
        width: '100%',
        height: 140,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden'
    },
    videoPreview: {
        width: '100%',
        maxHeight: 200,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

        overflow: 'hidden'
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

export default MakeAPost;
