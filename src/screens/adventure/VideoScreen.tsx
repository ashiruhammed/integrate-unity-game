import React, {useCallback, useEffect, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Modal,
    Image
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import {AntDesign} from "@expo/vector-icons";
import {RectButton} from "../../components/RectButton";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getAdventure,
    getLesson,
    getNextAdventure,
    getQuizByLesson,
    startAdventure,
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

const VideoScreen = ({navigation, route}: RootStackScreenProps<'VideoScreen'>) => {

    const {lessonId, adventureId} = route.params
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const animation = useRef(null);
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const user = useAppSelector(state => state.user)
    const {responseState, responseType, responseMessage} = user
    const [badgeModalVisible, setBadgeModalVisible] = useState(false);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state: string) => {
        if (state === "ended") {
            setPlaying(false);
            Alert.alert("video has finished playing!");
        }
    }, []);

    const togglePlaying = useCallback(() => {
        setPlaying((prev) => !prev);
    }, []);
    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const borderColor = theme == 'light' ? "#DBDBDB" : Colors.dark.borderColor
    const optionBg = theme == 'light' ? "#fff" : "#141414"


  //  const {isLoading, data: lesson, refetch} = useQuery(['lesson'], () => getLesson(lessonId))
    const {isLoading, data: lesson,mutate} = useMutation(['lesson'], getLesson)
    // const {isLoading:loadingAdventure, data:adventure, refetch:fetchAdevnture,} = useQuery(['getAdventure'], () => getAdventure(adventureId))
    const {isLoading:loadingQuiz, data: quiz, refetch:getQuiz} = useQuery(['getQuizByLesson'], () => getQuizByLesson(lessonId))



    const {
        mutate: nextLevel,
        data: missionData,
        isLoading: loadingMission
    } = useMutation(['getNextMission'], getNextAdventure, {
        onSuccess: (data) => {


            if (data.success) {
                getQuiz()
                if (data?.data?.hasNextLesson) {
                    mutate(data?.data?.nextLessonId)

                } else {
                    getQuiz()


                    if(data?.data?.badge) {


                        setBadgeModalVisible(true)
                    }else{
                        navigation.navigate('AdventureHome')
                    }
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


    const nextMission = async () => {
        getQuiz()
        if(quiz) {

            if (quiz.success) {


                updateVideoWatchCount(lessonId)

                navigation.navigate('QuizScreen', {
                    lessonId,
                })
            } else {
                nextLevel(adventureId)
            }
        }
        // handleSnapPress(1)
    }
    const goToNext = () => {
        setBadgeModalVisible(false)
        nextMission(adventureId)

    }

    const giveReview = () => {
      setBadgeModalVisible(false)
      navigation.navigate('LeaveReview',{
          adventureId
      })
    }


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

                        {
                         //   missionData.data.badge
                        }
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
            <ScrollView
                style={{width: '100%',}} contentContainerStyle={styles.scrollView} scrollEnabled
                showsVerticalScrollIndicator={false}>



                <View style={styles.topDetails}>
                    <Text style={[styles.title, {
                        color: textColor
                    }]}>
                        {lesson?.data?.name}
                    </Text>
                </View>

                {
                    !lesson?.data?.video?.url &&
                    <View style={[styles.videoContainer,{

                        paddingHorizontal:pixelSizeHorizontal(15)
                    }]}>


                        <Text style={[styles.lessonText,{
                            color:textColor
                        }]}>
                            {lesson?.data?.text}
                        </Text>

                    </View>
                }



                {
                    lesson?.data?.video?.url
                    &&

                    <View style={[styles.videoContainer,{
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
    lessonText:{
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
        lineHeight:heightPixel(22)
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



})

export default VideoScreen;
