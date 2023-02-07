import React, {useEffect, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
    Button,
    Pressable, Modal, Alert
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {RootStackScreenProps} from "../../../types";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {AntDesign, FontAwesome5, Ionicons, Octicons} from "@expo/vector-icons";
import {Fonts} from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getNextAdventure, getQuizByLesson, startAdventure, submitQuizAnswers} from "../../action/action";
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
import {clearSubmissions, UPDATE_SUBMISSIONS, updateSubmissions} from "../../app/slices/dataSlice";
import {setResponse, unSetResponse} from "../../app/slices/userSlice";
import Toast from "../../components/Toast";
import AdventuresIcon from "../../assets/images/tabs/home/AdventuresIcon";
import {RectButton} from "../../components/RectButton";
import LottieView from "lottie-react-native";
import {IF} from "../../helpers/ConditionJsx";
import {StatusBar} from "expo-status-bar";


const QuizScreen = ({navigation, route}: RootStackScreenProps<'QuizScreen'>) => {

    const queryClient = useQueryClient();
    const dispatch = useAppDispatch()
    const {lessonId, hasNextLesson, nextModuleId, isLastAdventureModule, isLastModuleLesson} = route.params
    const dataSlice = useAppSelector(state => state.data)
    const {submissions, theme} = dataSlice
    const animation = useRef(null);
    const user = useAppSelector(state => state.user)
    const {responseState, responseType, responseMessage} = user

    const [modalVisible, setModalVisible] = useState(false);
    const [badgeModalVisible, setBadgeModalVisible] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [selectedAnswerId, setSelectedAnswerId] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const borderColor = theme == 'light' ? "#DBDBDB" : Colors.dark.borderColor
    const optionBg = theme == 'light' ? "#fff" : "#141414"

//lessonId

    const {isLoading, data: lesson, refetch} = useQuery(['getQuizByLesson'], () => getQuizByLesson(lessonId))

    const {
        mutate: nextMission,
        data: missionData,
        isLoading: loadingMission
    } = useMutation(['getNextMission'], getNextAdventure, {
        onSuccess: (data) => {
           // console.log("NEXT MISSION")

            if (data.success) {

                if (data?.data?.hasNextLesson) {
                    setModalVisible(true)
                    navigation.navigate('VideoScreen', {
                        lessonId: data?.data?.nextLessonId,
                    })
                } else {
                    setModalVisible(false)
                    setBadgeModalVisible(true)

                }
                /*  navigation.navigate('QuizScreen', {
                      lessonId: data?.data?.nextLessonId,
                      nextModuleId: data?.data.nextModuleId,
                      hasNextLesson: data.data.hasNextLesson,
                      isLastAdventureModule: data.data.isLastAdventureModule,
                      isLastModuleLesson: data.data.isLastModuleLesson
                  })*/
            } else {


                setModalVisible(false)
                setBadgeModalVisible(false)

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

    const {mutate: submitAdventureNow, isLoading: submitting} = useMutation(['submitQuizAnswers'], submitQuizAnswers, {
        onSuccess: (data) => {

            if (data.success) {
                dispatch(clearSubmissions())
                //   setModalVisible(true)
                nextMission(lesson?.data?.lesson?.module?.adventure?.id)
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'success',
                }))
            } else {
                nextMission(lesson?.data?.lesson?.module?.adventure?.id)
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'error',
                }))
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['submitQuizAnswers']);
        }
    })

//
//


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

    const closeModal = () => {
        setModalVisible(false)

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
        nextMission(lesson?.data?.lesson?.module?.adventure?.id)

    }
    const deleteAll = () => {
        dispatch(clearSubmissions())
    }

    const giveReview = () => {
        navigation.navigate('LeaveReview',{
            adventureId:lesson?.data?.lesson?.module?.adventure?.id
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

    useRefreshOnFocus(refetch)
    return (

        <>

            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
                <StatusBar style={theme == 'light' ? 'dark' : 'light'}/>
                <Toast message={responseMessage} state={responseState} type={responseType}/>
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
                    loadingMission &&
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
                            <IF condition={missionData?.data?.badge}>


                                <View style={styles.modalBody}>
                                    <View style={styles.dripImageWrap}>
                                        <Image
                                            //{missionData?.data?.badge?.imageUrl}
                                            source={{uri: 'https://res.cloudinary.com/dijyr3tlg/image/upload/v1672951469/gateway/Group_151_cret7t.png'}}
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
                                            Mission Complete
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
                            </IF>
                            <IF condition={!missionData?.data?.badge}>
                                <View style={styles.modalBody}>
                                    {/* <View style={styles.dripImageWrap}>
                                    <Image
                                        source={{uri: 'https://res.cloudinary.com/dijyr3tlg/image/upload/v1672951469/gateway/Group_151_cret7t.png'}}
                                        style={styles.dripImage}/>
                                </View>*/}


                                    <View style={styles.textWrap}>
                                        <Text style={styles.missionText}>
                                            Quiz submitted
                                        </Text>

                                        <Text style={[styles.learnText, {
                                            textAlign: 'center'
                                        }]}>
                                            You just earned 40 Reward Points
                                        </Text>
                                    </View>

                                    <View style={styles.buttonRow}>


                                       {/* <RectButton onPress={giveReview} style={{
                                            width: 150,

                                        }}>
                                            <Text style={styles.buttonText}>
                                                Leave a review

                                            </Text>

                                        </RectButton>*/}

                                        <RectButton onPress={goToNext} style={{
                                            width: 200,

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
                            </IF>
                        </View>
                    </View>
                </Modal>


                <Modal

                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}

                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
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
                                {/* <View style={styles.dripImageWrap}>
                                    <Image
                                        source={{uri: 'https://res.cloudinary.com/dijyr3tlg/image/upload/v1672951469/gateway/Group_151_cret7t.png'}}
                                        style={styles.dripImage}/>
                                </View>*/}


                                <View style={styles.textWrap}>
                                    <Text style={styles.missionText}>
                                        Quiz submitted
                                    </Text>

                                    <Text style={[styles.learnText, {
                                        textAlign: 'center'
                                    }]}>
                                        You just earned 40 Reward Points
                                    </Text>
                                </View>

                                <View style={styles.buttonRow}>


                                    <RectButton onPress={giveReview}  style={{
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

    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
})

export default QuizScreen;
