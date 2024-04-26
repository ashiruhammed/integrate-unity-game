import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
    Button,
    Pressable, Modal, Alert, Platform
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {RootStackScreenProps} from "../../../types";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {AntDesign, FontAwesome5, Ionicons, Octicons} from "@expo/vector-icons";
import {Fonts} from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getLesson, getLessonsByModule, getModuleTask,
    getNextAdventure,
    getQuizByLesson,
    startAdventure,
    submitQuizAnswers,
    submitTask
} from "../../action/action";
import Animated, {
    Easing,
    FadeInDown,
    FadeInLeft,
    FadeOutDown,
    FadeOutLeft,
    Layout,
    SlideInLeft, SlideOutRight
} from 'react-native-reanimated';
import {isWhatPercentOf, useRefreshOnFocus} from "../../helpers";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {addNotificationItem, clearSubmissions, UPDATE_SUBMISSIONS, updateSubmissions} from "../../app/slices/dataSlice";

import {RectButton} from "../../components/RectButton";
import LottieView from "lottie-react-native";

import {StatusBar} from "expo-status-bar";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import BottomSheetTextInput from "../../components/inputs/BottomSheetTextInput";
import {useFormik} from "formik";
import * as WebBrowser from "expo-web-browser";
import * as yup from "yup";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import * as Haptics from "expo-haptics";

import VideoPlayer from 'react-native-media-console';
import SwipeAnimatedToast from "../../components/toasty";


const _handlePressButtonAsync = async (url:string) => {
    let result = await WebBrowser.openBrowserAsync(url);

};

const formSchema = yup.object().shape({
    // twitterName: yup.string().required('Twitter username is required'),
    // IGName: yup.string().required('Instagram username is required'),
    munaName: yup.string().required('Username or email is required'),
});


const QuizScreen = ({navigation, route}: RootStackScreenProps<'QuizScreen'>) => {

    const queryClient = useQueryClient();
    const dispatch = useAppDispatch()
    const {lessonId, hasNextLesson, nextModuleId, isLastAdventureModule, isLastModuleLesson} = route.params
    const dataSlice = useAppSelector(state => state.data)
    const {submissions, theme,adventure} = dataSlice
    const animation = useRef(null);
    const user = useAppSelector(state => state.user)
    const {responseState, responseType, responseMessage} = user


    const [badgeModalVisible, setBadgeModalVisible] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [selectedAnswerId, setSelectedAnswerId] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const borderColor = theme == 'light' ? "#DBDBDB" : Colors.dark.borderColor
    const optionBg = theme == 'light' ? "#fff" : "#141414"
    const [terms, setTerms] = useState(false);
//lessonId


    const {isLoading:loadingNextLesson, data: nextLesson, mutate} = useMutation(['lesson'], getLesson,{
        onSuccess:(data)=>{
            if(data.success){
               // console.log("THE NEXT LESSON IN THE NEXT MODULE")
               navigation.navigate('VideoScreen', {
                    currentLessonId: data.data.id,

                })


            }
        }
    })
    const { data: currentLesson,refetch:fetchLesson} = useQuery(['lesson'], ()=>getLesson(lessonId))

    const {isLoading, data: lesson, refetch} = useQuery(['getQuizByLesson'], () => getQuizByLesson(lessonId))

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



    const {
        mutate: nextLevel,
        data: missionData,
        isLoading: loadingMission
    } = useMutation(['getNextMission'], getNextAdventure, {
        onSuccess: (data) => {



            //has next lesson ? get next lesson
            //doesnt have next lesson ? get next module
            //last adventure module ? show badge and end adventure

            if (data.success) {

                if (data.data.hasNextLesson) {

                    navigation.navigate('VideoScreen', {
                        currentLessonId: data.data.nextLessonId,

                    })

                }else if(!data.data.isLastModuleLesson){
                    //console.log("THIS IS GOING TO NEXT MODULE LESSON")
                   mutate(data.data.nextLessonId)
                }  else if (data.data.isLastAdventureModule){
                   // console.log("THIS IS GET THE TASK TO COMPLETE ADVENTURE")

                   getTask(currentLesson?.data?.moduleId)
                    if(data.data.nextModuleId == '') {

                        getTask(currentLesson?.data?.moduleId)
                    }
                }
            } else {

                navigation.navigate('AdventureHome')



                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: data.message,
                }))
            }




        },
        onSettled: () => {
            queryClient.invalidateQueries(['getNextMission']);
        }
    })



    const {data:task,mutate:getTask,isLoading:gettingTask} = useMutation(['getModuleTask'],getModuleTask,{
        onSuccess: (data)=>{



            if(data.success){
                handleSnapPress(1)
            }else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
              //  console.log("++++/+/++++/+/+THIS MEANS NO TASK HERE++++++++++")
                setBadgeModalVisible(true)

            }
        }
    })

/*    const {isLoading: loadingLessons, data: lessons, mutate: fetchLessons} = useMutation(['getLessonsByModule'],
        getLessonsByModule, {
            onSuccess:(data)=>{
                if(data.sucess){

                    navigation.navigate('VideoScreen', {
                        currentLessonId:data.result.id

                    })
                    console.log("++++/+/++++/+/+ NAVIGATE ++++++++++")
                }
            }
        })*/

    const {mutate: submitTaskNow, isLoading: submittingTask} = useMutation(['submitTask'], submitTask, {
        onSuccess: (data) => {

            if (data.success) {
                handleClosePressForm()
                handleClosePress()
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
              setBadgeModalVisible(true)
            } else {

                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: data.message,
                }))
            }
        },
        onError:(error)=>{
            console.log(error)
        },
        onSettled: () => {
            queryClient.invalidateQueries(['submitTask']);
        }
    })


    //console.log("<<<< ADVENTURE NEXT >>>>")
   // console.log(adventure.id)

    const {mutate: submitAdventureNow, isLoading: submitting} = useMutation(['submitQuizAnswers'], submitQuizAnswers, {
        onSuccess: (data) => {

            if (data.success) {
                dispatch(clearSubmissions())
                //   setModalVisible(true)


                nextLevel(adventure.id)

                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'success',
                    body: data.message,
                }))
            } else {
                nextLevel(adventure.id)


                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: data.message,
                }))
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['submitQuizAnswers']);
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
                response:munaName
            })
            submitTaskNow({id:task?.data?.id, body:data})


        }
    });
    const nextSheet = () => {
        handleClosePress()
        handleSnapPressForm(1)
    }

    // console.log(data?.data?.questions[0])
    const goBack = () => {
        navigation.goBack()
    }

    const selectAnswer = (answer: string, id: string) => {
        setSelectedAnswer(answer)
        setSelectedAnswerId(id)
        //  console.log(data?.data?.questions[currentQuestion]?.id)
        dispatch(updateSubmissions({
            "questionId": lesson?.data?.questions[currentQuestion]?.id,
            "optionIds": [`${id}`]
            //"questionId": "3fbd1801-17f0-4d5c-88ed-bcb707b91dcf", "optionIds":["2521694c-5eb4-41d1-8b65-139eb17262db"]
        }))
        // dispatch(clearSubmissions())

    }

    const nextQuestion = () => {
        if (selectedAnswer !== '') {
            if (currentQuestion + 1 !== lesson?.data?.questions?.length) {
                setCurrentQuestion(currentQuestion + 1)
            }
        }
        setSelectedAnswer('')
    }



    const prevQuestion = () => {

        if (currentQuestion !== 0) {
            setCurrentQuestion(currentQuestion - 1)
        }


    }

    const submitQuestion = () => {

        if (selectedAnswer !== '') {
            const body = JSON.stringify({
                "submissions": submissions
            })
            submitAdventureNow({body, id: lesson?.data?.id})
        }
    }


    const goToNext = () => {
        nextLevel(adventure?.id)

    }
    const deleteAll = () => {
        dispatch(clearSubmissions())
    }

    const giveReview = () => {
        setBadgeModalVisible(false)
        navigation.navigate('LeaveReview',{
            adventureId:lesson?.data?.lesson?.module?.adventure?.id
        })
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




    useRefreshOnFocus(refetch)
 //   useRefreshOnFocus(fetchLesson)


    return (

        <>

            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
                <StatusBar style={theme == 'light' ? 'dark' : 'light'} />
                <SwipeAnimatedToast/>
                {
                    submitting &&
                    <ActivityIndicator size="large" color={Colors.primaryColor}
                                       style={[StyleSheet.absoluteFill, {
                                           zIndex: 1,
                                           backgroundColor: 'rgba(0,0,0,0.1)'
                                       }]}/>
                }
                {
                    isLoading &&
                    <ActivityIndicator size="large" color={Colors.primaryColor}
                                       style={[StyleSheet.absoluteFill, {
                                           zIndex: 1,
                                           backgroundColor: 'rgba(0,0,0,0.1)'
                                       }]}/>
                }
                {
                loadingNextLesson &&
                    <ActivityIndicator size="large" color={Colors.primaryColor}
                                       style={[StyleSheet.absoluteFill, {
                                           zIndex: 1,
                                           backgroundColor: 'rgba(0,0,0,0.1)'
                                       }]}/>
                }
                {
                    loadingMission &&
                    <ActivityIndicator size="large" color={Colors.primaryColor}
                                       style={[StyleSheet.absoluteFill, {
                                           zIndex: 1,
                                           backgroundColor: 'rgba(0,0,0,0.1)'
                                       }]}/>
                }

                {
                    gettingTask &&
                    <ActivityIndicator size="large" color={Colors.primaryColor}
                                       style={[StyleSheet.absoluteFill, {
                                           zIndex: 1,
                                           backgroundColor: 'rgba(0,0,0,0.1)'
                                       }]}/>
                }


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

                            {/* <View style={styles.sheetHead}>

                            <TouchableOpacity activeOpacity={0.8} onPress={closeModal}
                                              style={styles.dismiss}>
                                <Ionicons name="ios-close" size={24} color="#929292"/>
                            </TouchableOpacity>

                        </View>*/}



                                <View style={styles.modalBody}>
                                    <View style={styles.dripImageWrap}>
                                        <Image
                                            //{missionData?.data?.badge?.imageUrl}
                                            source={{uri: missionData?.data?.badge?.imageUrl}}
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
                                            Adventure Complete
                                        </Text>

                                        <Text style={[styles.learnText, {
                                            textAlign: 'center'
                                        }]}>
                                            You just earned {missionData?.data?.badge?.worthInPoints} Reward Points
                                            of {missionData?.data?.badge?.title}
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

                                        <RectButton onPress={goToNext} style={{
                                            width: 150,

                                        }}>
                                            {
                                                loadingMission ? <ActivityIndicator size='small' color="#fff"/>
                                                    :
                                                    <Text style={styles.buttonText}>
                                                        Next Mission

                                                    </Text>
                                            }
                                        </RectButton>
                                    </View>
                                </View>


                        </View>
                    </View>
                </Modal>





                <View style={styles.topBar}>
                    <View style={styles.leftButton}>
                        <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
                            <Octicons name="chevron-left" size={24} color={textColor}/>

                        </TouchableOpacity>
                    </View>


                    <View style={styles.navBody}>
                        <Text style={[styles.title, {
                            color: textColor
                        }]}>
                            Quiz 1
                        </Text>
                    </View>

                    <View style={styles.rightButton}>

                    </View>
                </View>
                {
                    isLoading && <ActivityIndicator size='small' color={Colors.primaryColor}/>
                }
                {
                    !isLoading &&
                    <ScrollView
                        style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                        backgroundColor
                    }]} scrollEnabled
                        showsVerticalScrollIndicator={false}>
                        <View style={styles.progressBar}>
                            <Animated.View key={"ProgressBar" + currentQuestion} entering={FadeInLeft}
                                           exiting={FadeOutLeft}
                                           layout={Layout.easing(Easing.bounce).delay(20)} style={[styles.Bar,
                                lesson && {
                                    width: `${isWhatPercentOf(currentQuestion + 1, lesson?.data?.questions?.length)}%`,
                                }]}>
                                <View style={styles.barCircle}>
                                    <Text style={[styles.barNumber, {
                                        color: "#fff"
                                    }]}>
                                        {currentQuestion + 1}
                                    </Text>
                                </View>
                            </Animated.View>
                        </View>


                        <View style={styles.pageNumber}>
                            <Text style={styles.hardText}>
                                {/*   Boss Level: Hard Question*/}
                            </Text>
                            <View style={styles.Number}>

                                <Text style={styles.numberActive}>
                                    {currentQuestion + 1}
                                </Text>
                                <Text style={styles.numberInActive}>
                                    /{lesson?.data?.questions?.length}
                                </Text>
                            </View>
                        </View>


                        <View style={styles.questionBox}>
                            <Text style={[styles.question, {
                                color: textColor
                            }]}>
                                {lesson?.data?.questions[currentQuestion]?.text}
                            </Text>
                        </View>


                        <View style={styles.answers}>
                            {
                                !isLoading && lesson && lesson?.data?.questions[currentQuestion]?.options.map((({
                                                                                                                    text,
                                                                                                                    id
                                                                                                                }) => (
                                    <Pressable style={{
                                        width: '90%',
                                    }} onPress={() => selectAnswer(text, id)} key={id}>
                                        <Animated.View
                                            key={id}
                                            entering={FadeInLeft} exiting={FadeOutLeft}
                                            layout={Layout.easing(Easing.bounce).delay(20)}
                                            style={[styles.answerBox, {
                                                borderWidth: selectedAnswerId == id ? 0 : 1,
                                                borderColor,
                                                backgroundColor: selectedAnswerId == id ? Colors.primaryColor : optionBg
                                            }]}>
                                            <View style={styles.answerBody}>
                                                <Text style={[styles.answerText, {
                                                    color: selectedAnswerId == id ? '#fff' : textColor,
                                                }]}>
                                                    {text}
                                                </Text>
                                            </View>
                                            {
                                                selectedAnswerId == id &&
                                                <FontAwesome5 name="check" size={18}
                                                              color={selectedAnswerId == id ? '#fff' : Colors.light.text}/>
                                            }

                                        </Animated.View>
                                    </Pressable>

                                )))
                            }
                            <View style={styles.rowButton}>
                                <Button color={textColor} title={"< Prev"} onPress={prevQuestion}/>

                                {
                                    currentQuestion + 1 !== lesson?.data?.questions?.length
                                        ?
                                        <Button color={textColor} title={"Next >"} onPress={nextQuestion}/>
                                        :
                                        <Button color={textColor} disabled={submitting} title={"Submit"}
                                                onPress={submitQuestion}/>

                                }
                            </View>

                        </View>


                    </ScrollView>
                }
                <Animated.View key={"mascot"} layout={Layout.easing(Easing.bounce).delay(30)}
                               entering={FadeInDown.springify()} exiting={FadeOutDown} style={styles.mascotWrap}>
                    <Image source={require('../../assets/images/mascot/gateway-mascot.png')} style={styles.mascot}/>
                </Animated.View>

                <Animated.Image
                    key={"grassImage"}
                    layout={Layout.easing(Easing.bounce).delay(30)}
                    entering={SlideInLeft.springify()} exiting={SlideOutRight}
                    source={require('../../assets/images/grass.png')} style={styles.grassImage}/>


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

                    <View style={[styles.checks,{
                        alignItems:'center',

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

                        <Pressable onPress={() =>_handlePressButtonAsync(task?.data?.linkUrl)} style={{marginTop:10}}>
                            <Text style={{
                                color: "#1579E4",
                                fontFamily: Fonts.quickSandBold,
                                lineHeight: heightPixel(20)
                            }}>
                                Visit link
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
        //  paddingHorizontal: pixelSizeHorizontal(20),
        backgroundColor: "#fff",
    },
    scrollView: {
        backgroundColor: "#fff",
        width: '100%',
        alignItems: 'center'
    },
    topBar: {
        paddingHorizontal: pixelSizeHorizontal(20),
        width: '100%',
        height: heightPixel(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    leftButton: {
        width: widthPixel(50),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    rightButton: {
        width: widthPixel(50),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    navBody: {},
    title: {
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text,
        fontSize: fontPixel(16)
    },
    grassImage: {
        position: "absolute",
        bottom: 10,
        width: '100%',
        height: heightPixel(100),
        resizeMode: 'cover'
    },
    mascotWrap: {
        justifyContent: 'flex-end',
        position: 'absolute',
        alignItems: 'flex-end',
        width: widthPixel(140),
        bottom: 20,

        right: 0,
        zIndex: 20,
        height: heightPixel(200),
    },
    mascot: {
        width: '100%',
        resizeMode: 'contain',
        height: '80%',
    },
    progressBar: {
        marginTop: 20,
        width: '90%',
        height: 10,
        backgroundColor: "#E9E9E9",
        borderRadius: 10,
    },
    Bar: {
        height: 10,
        backgroundColor: Colors.primaryColor,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    barNumber: {
        fontFamily: Fonts.quickSandBold,

        fontSize: fontPixel(12)
    },
    barCircle: {
        width: 20,
        height: 20,
        backgroundColor: Colors.primaryColor,
        borderRadius: 25,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'

    },
    pageNumber: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: pixelSizeHorizontal(20),
    },
    Number: {
        minWidth: widthPixel(100),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    numberActive: {
        fontFamily: Fonts.quicksandMedium,
        color: Colors.primaryColor,
        fontSize: fontPixel(18)
    },
    numberInActive: {
        fontFamily: Fonts.quicksandSemiBold,
        color: "#8B8B8B",
        fontSize: fontPixel(18)
    },
    hardText: {
        fontFamily: Fonts.quicksandRegular,
        color: Colors.primaryColor,
        fontSize: fontPixel(14)
    },
    questionBox: {
        minHeight: heightPixel(70),
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    question: {
        fontFamily: Fonts.quicksandRegular,
        color: Colors.light.text,
        fontSize: fontPixel(18),
        lineHeight: heightPixel(25)
    },
    answers: {
        width: '100%',
        alignItems: 'center'
    },
    answerBox: {
        marginVertical: pixelSizeVertical(12),
        width: '100%',
        height: heightPixel(70),
        borderRadius: 10,
        paddingHorizontal: pixelSizeHorizontal(20),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    answerText: {
        fontFamily: Fonts.quicksandMedium,
        textTransform: 'capitalize',
        fontSize: fontPixel(16),
    },
    answerBody: {
        width: '80%',
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    rowButton: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 50,
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

        resizeMode: 'contain',
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

    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
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
    descriptionTxt:{
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

export default QuizScreen;
