import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Modal,
    Image, Platform, Pressable
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {RectButton} from "../../components/RectButton";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getAdventure,
    getLesson, getLessonsByModule, getModuleTask,
    getNextAdventure,
    getQuizByLesson,
    startAdventure, submitTask,
    updateVideoWatchCount
} from "../../action/action";
import {setResponse} from "../../app/slices/userSlice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {RootStackScreenProps} from "../../../types";
import {Fonts} from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import {Video} from "expo-av";
import {clearSubmissions} from "../../app/slices/dataSlice";
import {IF} from "../../helpers/ConditionJsx";
import LottieView from "lottie-react-native";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import BottomSheetTextInput from "../../components/inputs/BottomSheetTextInput";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import * as WebBrowser from "expo-web-browser";
import {useFormik} from "formik";
import * as yup from "yup";


const _handlePressButtonAsync = async (url: string) => {
    let result = await WebBrowser.openBrowserAsync(url);

};

const formSchema = yup.object().shape({
    // twitterName: yup.string().required('Twitter username is required'),
    // IGName: yup.string().required('Instagram username is required'),
    munaName: yup.string().required('Username or email is required'),
});


const VideoScreen = ({navigation, route}: RootStackScreenProps<'VideoScreen'>) => {

    const {lessonId} = route.params
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const animation = useRef(null);
    const dataSlice = useAppSelector(state => state.data)
    const {theme, adventure} = dataSlice
    const user = useAppSelector(state => state.user)
    const {responseState, responseType, responseMessage} = user
    const [badgeModalVisible, setBadgeModalVisible] = useState(false);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [playing, setPlaying] = useState(false);
    const [terms, setTerms] = useState(false);


    const sheetRef = useRef<BottomSheet>(null);
    // variables
    const snapPoints = useMemo(() => ["1%", "70%"], []);
    const handleSnapPress = useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);


    const sheetFormRef = useRef<BottomSheet>(null);

    // variables
    const snapPointsForm = useMemo(() => ["1%", "70%"], []);
    const handleSnapPressForm = useCallback((index: number) => {
        sheetFormRef.current?.snapToIndex(index);
    }, []);
    const handleClosePressForm = useCallback(() => {
        sheetFormRef.current?.close();
    }, []);

    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const borderColor = theme == 'light' ? "#DBDBDB" : Colors.dark.borderColor
    const optionBg = theme == 'light' ? "#fff" : "#141414"

    const {


        refetch,

    } = useQuery(['getAdventure'], () => getAdventure(adventure?.id))


    const {data: task, mutate: getTask, isLoading: gettingTask} = useMutation(['getModuleTask'], getModuleTask, {
        onSuccess: (data) => {


            if (data.success) {
                handleSnapPress(1)
            } else {
               // console.log("+++++++++++THIS MEANS NO TASK HERE++++++++++")
                setBadgeModalVisible(true)
            }
        }
    })



    //  const {isLoading, data: lesson, refetch} = useQuery(['lesson'], () => getLesson(lessonId))
    const {isLoading, data: lesson, mutate} = useMutation(['lesson'], getLesson)
    const {isLoading: loadingLessons, data: lessons, refetch: fetchLessons} = useQuery(['getLessonsByModule'],
        ()=> getLessonsByModule('dd04af68-ba28-4a28-b2ce-6e134e46c641'), {
enabled:false,
            onSuccess: (data) => {

               // console.log(data)
                if (data.sucess) {
                  //  mutate(data.data.nextLessonId)
                }
            }
        })

    // const {isLoading:loadingAdventure, data:adventure, refetch:fetchAdevnture,} = useQuery(['getAdventure'], () => getAdventure(adventureId))
    const {
        isLoading: loadingQuiz,
        data: quiz,
        refetch: getQuiz
    } = useQuery(['getQuizByLesson'], () => getQuizByLesson(lessonId))


    const {mutate: submitTaskNow, isLoading: submittingTask} = useMutation(['submitTask'], submitTask, {
        onSuccess: (data) => {
//console.log(data)
            if (data.success) {
                handleClosePressForm()
                handleClosePress()
                setBadgeModalVisible(true)

            } else {
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'error',
                }))
            }
        },
        onError: (error) => {
            console.log(error)
        },
        onSettled: () => {
            queryClient.invalidateQueries(['submitTask']);
        }
    })


    const {
        mutate: nextLevel,
        data: missionData,
        isLoading: loadingMission
    } = useMutation(['getNextMission'], getNextAdventure, {
        onSuccess: (data) => {
           // console.log("ADVENTURE NEXT")
           // console.log(data)
            if (data.success) {

                if (data.data.hasNextLesson) {
                   // console.log("===========GOING TO NEXT LESSON========")
                    mutate(data.data.nextLessonId)
                } else if(!data.data.isLastModuleLesson){
                   // console.log("--------THIS IS GOING TO NEXT MODULE---------")
                    mutate(data.data.nextLessonId)
                }
                else if (data.data.isLastAdventureModule) {
                   // console.log("********THIS MEAN ADVENTURE IS COMPLETED********")
                    getTask(lesson?.data?.moduleId)
                }else if(data.data.isLastAdventureModule == false){
                      //  console.log("GO TO NEXT MODULE")
                        navigation.navigate('AdventureHome')
                    }



            } else {

                navigation.navigate('AdventureHome')

                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'error',
                }))
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['getNextMission']);
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


            munaName: '',

        },
        onSubmit: (values) => {
            const {munaName} = values;
            const data = JSON.stringify({
                response: munaName
            })
            submitTaskNow({id: task?.data?.id, body: data})


        }
    });


    useEffect(() => {
        dispatch(clearSubmissions())
    }, []);


    const goBack = () => {
        navigation.goBack()
    }


    useEffect(() => {
        getQuiz()
        mutate(lessonId)
    }, [lessonId]);


   //
    const nextMission = async () => {

        if (quiz?.success) {
            updateVideoWatchCount(lessonId)
            navigation.navigate('QuizScreen', {
                lessonId,
            })
        } else {
            nextLevel(adventure?.id)
        }

        // handleSnapPress(1)
    }

    const goHome = () => {
        refetch()
        navigation.navigate('AdventureHome')
    }

    const giveReview = () => {
        setBadgeModalVisible(false)
        navigation.navigate('LeaveReview', {
            adventureId:adventure?.id
        })
    }


    const nextSheet = () => {
        handleClosePress()
        handleSnapPressForm(1)
    }
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


    return (


        <>

            <Modal

                animationType="slide"
                transparent={true}
                visible={badgeModalVisible}

                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setBadgeModalVisible(!badgeModalVisible);
                }}
            >
                <View style={styles.backDrop}>
                    <View style={styles.modalContainer}>


                        <View style={styles.modalBody}>
                            <View style={styles.dripImageWrap}>
                                <Image
                                    //{}
                                    source={{uri: adventure?.badge?.imageUrl}}
                                    style={styles.dripImage}/>
                            </View>

                            <LottieView
                                autoPlay
                                ref={animation}
                                style={{
                                    width: "100%",
                                    height: heightPixel(340),
                                    position: 'absolute',
                                    zIndex: -1,
                                    top: -10,
                                }}
                                // Find more Lottie files at https://lottiefiles.com/featured
                                source={{uri: 'https://assets5.lottiefiles.com/private_files/lf30_kvdn44jg.json'}}
                            />
                            <View style={styles.textWrap}>
                                <Text style={styles.missionText}>
                                    Adventure Completed
                                </Text>

                                <Text style={[styles.learnText, {
                                    textAlign: 'center'
                                }]}>
                                    You just earned {adventure?.badge?.worthInPoints} Reward Points
                                    of {adventure?.badge?.title}
                                </Text>
                            </View>

                            <View style={styles.buttonRow}>


                                <RectButton onPress={giveReview} style={{
                                    width: 150,

                                }}>
                                    <Text style={styles.buttonText}>
                                        Leave a review

                                    </Text>

                                </RectButton>

                                <RectButton onPress={goHome} style={{
                                    width: 150,

                                }}>

                                    <Text style={styles.buttonText}>
                                        Do this later

                                    </Text>

                                </RectButton>
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>

            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
                <View style={[styles.navBar, {
                    paddingHorizontal: pixelSizeHorizontal(20)
                }]}>
                    <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
                        <AntDesign name="arrowleft" size={24} color={textColor}/>
                    </TouchableOpacity>
                </View>

                {
                    isLoading && <ActivityIndicator size="large" color={Colors.primaryColor}
                                                    style={[StyleSheet.absoluteFill, {
                                                        zIndex: 10,
                                                        backgroundColor: 'rgba(0,0,0,0.5)'
                                                    }]}/>
                }

                {
                    loadingMission && <ActivityIndicator size="large" color={Colors.primaryColor}
                                                         style={[StyleSheet.absoluteFill, {
                                                             zIndex: 10,
                                                             backgroundColor: 'rgba(0,0,0,0.5)'
                                                         }]}/>
                }

                {
                    loadingLessons && <ActivityIndicator size="large" color={Colors.primaryColor}
                                                         style={[StyleSheet.absoluteFill, {
                                                             zIndex: 10,
                                                             backgroundColor: 'rgba(0,0,0,0.5)'
                                                         }]}/>
                }
                <ScrollView
                    style={{width: '100%',}} contentContainerStyle={styles.scrollView} scrollEnabled
                    showsVerticalScrollIndicator={false}>

                    {
                        gettingTask && <ActivityIndicator size="large" color={Colors.primaryColor}
                                                          style={[StyleSheet.absoluteFill, {
                                                              zIndex: 10,
                                                              backgroundColor: '#fff'
                                                          }]}/>
                    }

                    <View style={styles.topDetails}>
                        <Text style={[styles.title, {
                            color: textColor
                        }]}>
                            {lesson?.data?.name}
                        </Text>
                    </View>

                    {
                        !lesson?.data?.video?.url &&
                        <View style={[styles.videoContainer, {

                            paddingHorizontal: pixelSizeHorizontal(15)
                        }]}>


                            <Text style={[styles.lessonText, {
                                color: textColor
                            }]}>
                                {lesson?.data?.text}
                            </Text>

                        </View>
                    }


                    {
                        lesson?.data?.video?.url
                        &&

                        <View style={[styles.videoContainer, {
                            height: heightPixel(400),
                        }]}>
                            <Video
                                ref={video}

                                style={styles.video}
                                source={{
                                    //lesson?.data?.video?.url
                                    uri: lesson?.data?.video?.url,
                                    //uri: 'http://res.cloudinary.com/dj0rcdagd/video/upload/v1674510206/Mission_1_1_qnzkvm.mp4',
                                }}
                                useNativeControls
                                resizeMode="contain"

                                isLooping
                                onPlaybackStatusUpdate={status => setStatus(() => status)}
                            />
                        </View>
                    }


                </ScrollView>


                <RectButton onPress={nextMission} style={{
                    width: widthPixel(200),
                    position: 'absolute',
                    bottom: 50
                }}>

                    {
                        loadingQuiz ? <ActivityIndicator size='small' color={"#fff"}/>
                            :

                            <Text style={styles.buttonText}>
                                Next Level

                            </Text>
                    }
                </RectButton>

            </SafeAreaView>


            <BottomSheet
                index={0}

                handleIndicatorStyle={Platform.OS == 'android' && {display: 'none'}}
                backdropComponent={renderBackdrop}
                ref={sheetRef}
                snapPoints={snapPoints}

            >
                <BottomSheetView style={styles.sheetContainer}>

                    {
                        Platform.OS == 'android' &&

                        <View style={styles.sheetHead}>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => handleClosePress()}
                                              style={styles.dismiss}>
                                <Ionicons name="ios-close" size={24} color="black"/>
                            </TouchableOpacity>

                        </View>
                    }
                    <View style={styles.sheetBody}>

                        <View style={styles.sheetHeadRow}>
                            <Text style={styles.sheetHeadText}>
                                Complete these tasks and
                                earn points
                            </Text>

                            <Text style={styles.sheetHeadTextNumber}>
                                01
                            </Text>
                        </View>

                        <Text style={styles.sheetHeadTextSmall}>

                        </Text>


                    </View>

                    <View style={[styles.checks, {
                        alignItems: 'center',

                    }]}>


                        <View style={styles.descriptionTxt}>
                            <Text style={{
                                color: terms ? "#1579E4" : Colors.light.text,
                                fontFamily: Fonts.quicksandRegular,
                                lineHeight: heightPixel(20)
                            }}>
                                {task?.data?.description}
                            </Text>
                        </View>

                        <Pressable onPress={() => _handlePressButtonAsync(task?.data?.linkUrl)} style={{marginTop: 10}}>
                            <Text style={{
                                color: "#1579E4",
                                fontFamily: Fonts.quickSandBold,
                                lineHeight: heightPixel(20)
                            }}>
                                link
                            </Text>
                        </Pressable>

                    </View>

                    <RectButton onPress={nextSheet} style={{
                        width: 200,

                    }}>
                        <Text style={{
                            position: 'absolute',
                            fontSize: fontPixel(16),
                            color: "#fff",
                            fontFamily: Fonts.quickSandBold
                        }}>
                            Continue

                        </Text>

                    </RectButton>

                </BottomSheetView>
            </BottomSheet>


            <BottomSheet
                index={0}
                keyboardBehavior={"interactive"}
                handleIndicatorStyle={Platform.OS == 'android' && {display: 'none'}}
                backdropComponent={renderBackdrop}
                ref={sheetFormRef}
                snapPoints={snapPointsForm}

            >
                <BottomSheetView style={styles.sheetContainer}>

                    {
                        Platform.OS == 'android' &&

                        <View style={styles.sheetHead}>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => handleClosePress()}
                                              style={styles.dismiss}>
                                <Ionicons name="ios-close" size={24} color="black"/>
                            </TouchableOpacity>

                        </View>
                    }
                    <View style={styles.sheetBody}>

                        <View style={styles.sheetHeadRow}>
                            <Text style={styles.sheetHeadText}>
                                Submit your information
                            </Text>

                            <Text style={styles.sheetHeadTextNumber}>
                                02
                            </Text>
                        </View>

                        <Text style={styles.sheetHeadTextSmall}>
                            We need these information to verify if your
                            tasks were completed.
                        </Text>


                    </View>

                    <View style={styles.sheetFormContainer}>


                        <BottomSheetTextInput
                            placeholder="@"
                            label={"Your handle / email"}
                            keyboardType={"default"}
                            touched={touched.munaName}
                            error={touched.munaName && errors.munaName}

                            onChangeText={(e) => {
                                handleChange('munaName')(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('munaName')(e);

                            }}
                            value={values.munaName}
                        />

                    </View>

                    <RectButton onPress={() => handleSubmit()} disabled={!isValid} style={{
                        width: 200,

                    }}>

                        {
                            submittingTask ? <ActivityIndicator size='small' color='#fff'/>
                                :

                                <Text style={{
                                    position: 'absolute',
                                    fontSize: fontPixel(16),
                                    color: "#fff",
                                    fontFamily: Fonts.quickSandBold
                                }}>
                                    Continue

                                </Text>
                        }
                    </RectButton>

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

    navBar: {


        width: '100%',
        height: heightPixel(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    scrollView: {
        overflow: 'hidden',
        //  backgroundColor: Colors.background,
        width: '100%',

        alignItems: 'center'
    },
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    topDetails: {
        paddingHorizontal: pixelSizeHorizontal(15),
        width: '100%',
        height: heightPixel(100)
    },
    title: {
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(20)
    },
    videoContainer: {

        width: '100%',

        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lessonText: {
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
        lineHeight: heightPixel(22)
    },
    backDrop: {
        width: '100%',
        flex: 1,
        backgroundColor: 'rgba(5,5,5,0.80)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#fff',
        paddingHorizontal: pixelSizeHorizontal(20),
        height: heightPixel(385)
    },
    modalBody: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',

        height: heightPixel(300)
    },
    dripImageWrap: {
        width: 100,
        height: 100,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',

    },

    dripImage: {

        resizeMode: 'center',
        width: "100%",
        height: "100%",
    },
    textWrap: {
        height: 70,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',

    },
    missionText: {
        fontSize: fontPixel(20),
        color: Colors.success,
        fontFamily: Fonts.quickSandBold
    },
    learnText: {
        fontSize: fontPixel(16),
        color: Colors.light.text,
        fontFamily: Fonts.quicksandMedium
    },
    buttonRow: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    sheetContainer: {

        width: '100%',
        alignItems: 'center',
        paddingHorizontal: pixelSizeHorizontal(20),
        paddingVertical: pixelSizeVertical(20)
    },
    sheetBody: {
        width: '100%',
        marginBottom: 30,
    },
    sheetHeadRow: {
        width: '100%',
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    sheetHeadTextNumber: {
        fontSize: fontPixel(20),
        color: "#999999",
        fontFamily: Fonts.quickSandBold
    },
    sheetHeadText: {
        lineHeight: heightPixel(26),
        width: '75%',
        fontSize: fontPixel(18),
        color: "#1E1E1E",
        fontFamily: Fonts.quickSandBold
    },
    sheetHeadTextSmall: {
        marginTop: 8,
        width: '75%',
        fontSize: fontPixel(14),
        color: "#333333",
        fontFamily: Fonts.quicksandRegular
    },
    sheetHead: {
        height: 50,
        top: -20,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        flexDirection: 'row'
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
    terms: {
        marginVertical: pixelSizeVertical(10),
        width: '100%',
        minHeight: heightPixel(40),
        alignItems: 'center',
        justifyContent: 'center',

        flexDirection: 'row'
    },
    checkboxContainer: {
        height: '90%',
        width: '8%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    termsText: {
        height: '100%',
        width: '90%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    descriptionTxt: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    checks: {
        height: heightPixel(300),

    },

    sheetFormContainer: {

        height: heightPixel(350),
        justifyContent: 'flex-start',
        width: '100%',
        alignItems: 'flex-start',
    },


})

export default VideoScreen;
