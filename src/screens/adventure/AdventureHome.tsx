import React, {SetStateAction, Dispatch, useCallback, useMemo, useRef, useState, useEffect, memo} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Platform,
    TouchableOpacity,
    ScrollView,
    Modal,
    Image,
    ActivityIndicator,
    Button, Alert, Dimensions, ImageBackground, Pressable
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {AntDesign, Entypo, Feather, FontAwesome5, Ionicons, Octicons} from "@expo/vector-icons";
import {RootStackScreenProps} from "../../../types";
import {StatusBar} from "expo-status-bar";
import SegmentedControl from "../../components/SegmentContol";
import Colors from "../../constants/Colors";
import {Fonts} from "../../constants/Fonts";
import {IF} from "../../helpers/ConditionJsx";
import {RectButton} from "../../components/RectButton";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getAdventure,
    getAdventureReviews,
    getLessonsByModule,
    getModuleByAdventure, getModuleTask, getNextAdventure, getQuizByLesson,
    startAdventure, submitTask
} from "../../action/action";
import {truncate, useRefreshOnFocus} from "../../helpers";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import dayjs from "dayjs";
import Animated, {
    Easing,
    FadeInDown,
    FadeInLeft, FadeInUp,
    FadeOutDown,
    FadeOutLeft,
    FadeOutRight,
    Layout
} from 'react-native-reanimated';

import {setResponse, unSetResponse} from "../../app/slices/userSlice";
import Toast from "../../components/Toast";
import FastImage from "react-native-fast-image";
import Constants from "expo-constants";
import * as WebBrowser from 'expo-web-browser';


const dimensionsForScreen = Dimensions.get('screen');

interface cardProps {
    title: string,
    message?: string,
}

interface reviewProps {
    text: string,
    rating?: string,
    userName?: string,
    updatedAt?: string,
}

interface moduleProps {
    name: string,
    loadingLessons: boolean,
    lessons: [],
    description?: string,
    setCurrentIndex: Dispatch<SetStateAction<null>>,
    currentIndex: number | string | null,
    index: number | null,
}

const AboutCard = ({title, message}: cardProps) => {
    return (
        <Animated.View key={title} entering={FadeInLeft} exiting={FadeOutLeft}
                       layout={Layout.easing(Easing.bounce).delay(20)} style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>
                {title}
            </Text>
            <Text style={styles.aboutBodyText}>
                {message}
            </Text>
        </Animated.View>
    )

}


const ReviewCard = ({text, userName, updatedAt, rating}: reviewProps) => {
const arr =  new Array(rating).fill(rating)

    return (
        <Animated.View key={text} entering={FadeInLeft} exiting={FadeOutLeft}
                       layout={Layout.easing(Easing.bounce).delay(20)} style={styles.reviewCard}>
            <View style={styles.nameStars}>
                <Text style={styles.reviewTitle}>
                    {userName}
                </Text>
                <View style={styles.stars}>
                    {
                    arr.map((value, index, array)=>(
                        <Octicons key={index} name="star-fill" size={14} color={"#EDBA13"}/>
                    ))
                }

                   {/* <Octicons name="star-fill" size={14} color={"#fff"}/>
                    <Octicons name="star-fill" size={14} color={"#fff"}/>*/}
                </View>
            </View>
            <Text style={styles.reviewBodyText}>
                {text}
            </Text>
            <Text style={styles.reviewDateText}>
                {dayjs(updatedAt).format('DD MMM, YYYY')}

            </Text>
        </Animated.View>
    )

}


const MissionCard = ({
                         name,
                         description,
                         currentIndex,
                         setCurrentIndex,
                         index,

                     }: moduleProps) => {

    const [moduleId, setModuleId] = useState('');
    const {isLoading: loadingLessons, data: lessons, mutate: fetchLessons} = useMutation(['getLessonsByModule'],
        getLessonsByModule, {

        })

    return (

        <Animated.View key={index} entering={FadeInLeft} exiting={FadeOutLeft}
                       layout={Layout.easing(Easing.bounce).delay(20)} style={styles.missionCard}>
            <>
                <View style={styles.missionCardHead}>


                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                        setCurrentIndex(index === currentIndex ? null : index);
                        fetchLessons(index)
                    }} style={styles.missionCardLeft}>


                        <View style={styles.nameStars}>
                            <Text style={styles.missionTitle}>

                                {name ? truncate(name,35) : ''}
                            </Text>
                            <Entypo name="dot-single" size={24} color="#fff"/>

                            {/*  <Text style={styles.reviewTitle}>
                        2mins
                    </Text>*/}

                        </View>
                        <Text style={styles.reviewBodyText}>
                            {description ? truncate(description,45) : ''}
                        </Text>

                    </TouchableOpacity>
                 {/*   <TouchableOpacity activeOpacity={0.8}>
                        <Feather name="play-circle" size={28} color={Colors.primaryColor}/>
                    </TouchableOpacity>*/}
<View style={[styles.missionCardLeft,{
    width: '5%',
    height:20,
    alignItems: 'flex-end',
    justifyContent:'flex-end'
}]}>


                    <Entypo onPress={() => {
                        setCurrentIndex(index === currentIndex ? null : index);
                        fetchLessons(index)
                    }} name="chevron-right" style={{
                        transform:[{rotate: index === currentIndex ?'90deg' : '0deg'}]
                    }} size={14} color={"#fff"} />
</View>
                </View>

                {index === currentIndex && (


                    !loadingLessons && lessons &&
                    lessons.data.result.length > 0 &&
                    lessons.data.result.map((({name, id}) => (
                        <Animated.View key={id} entering={FadeInDown} exiting={FadeOutDown}
                                       layout={Layout.easing(Easing.bounce).delay(20)} style={styles.subCategoriesList}>
                            <Text style={{
                                color: "#fff"
                            }}>
                                {name}
                            </Text>
                        </Animated.View>
                    )))


                )}

                {loadingLessons && <ActivityIndicator size={'small'} color={Colors.primaryColor}/>}
            </>
        </Animated.View>
    )

}


interface Interface {
    data: [{
        amount: string
    }],
    setData: (newArray: any) => void,
    index: number | null,
    item: {
        name: string
    },
    setCurrentIndex: Dispatch<SetStateAction<null>>,
    currentIndex: number | string | null
}

const isRunningInExpoGo = Constants.appOwnership === 'expo'
const AdventureHome = ({navigation}: RootStackScreenProps<'AdventureHome'>) => {

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();

    const dataSlice = useAppSelector(state => state.data)
    const user = useAppSelector(state => state.user)

    const {responseState, responseType, responseMessage} = user
    const {missionId, adventure} = dataSlice





    const [currentIndex, setCurrentIndex] = useState<number | null | string>(null);



    // variables


    const [tabIndex, setTabIndex] = useState(0);
    const handleTabsChange = useCallback((index: SetStateAction<number>) => {
        setTabIndex(index);
    }, [tabIndex]);

    const {
        isLoading,
        data,
        refetch,
        isRefetching,
        isFetching
    } = useQuery(['getAdventure'], () => getAdventure(adventure?.id))


    const {mutate: startAdventureNow, isLoading: startingAdventure} = useMutation(['startAdventure'], startAdventure, {
        onSuccess: (data) => {

            if (data.success) {
               // console.log(data)
                navigation.navigate('VideoScreen', {
                    currentLessonId: data?.data?.currentLessonId,
                    adventureId: data?.data?.id
                })

            } else {
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'error',
                }))
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['startAdventure']);
        }
    })


    const {isLoading: loadingReviews, data: reviews, refetch: fetchReviews} = useQuery(['getAdventureReviews'],
        () => getAdventureReviews(adventure?.id), {
            enabled: !!adventure?.id
        })


    const {isLoading: loadingModules, data: modules, refetch: fetchModules} = useQuery(['getModuleByAdventure'],
        () => getModuleByAdventure(adventure?.id), {
            enabled: !!adventure?.id
        })

    const {isLoading: loadingLessons, data: lessons, refetch: fetchLessons} = useQuery(['getLessonsByModule'],
        () => getLessonsByModule(currentIndex), {
            enabled: !!currentIndex
        })




    // renders



    const goBack = () => {
        navigation.goBack()
    }


    const startQuiz = () => {
        if (!loadingModules && modules) {
            startAdventureNow(adventure?.id)
        }
//navigation.navigate('VideoScreen')
        /* navigation.navigate('QuizScreen',{
             lessonId:'37143140-f606-4992-b2a1-4aee4df46c45'
         })*/
        // handleSnapPress(1)
    }
useRefreshOnFocus(refetch)
    const nextQuiz = () => {
        navigation.navigate('VideoScreen', {
            currentLessonId: data?.data?.userAdventure?.currentLessonId,
            adventureId: data?.data?.id
        })


    }

    const {} = useQuery(['getQuizByLesson'], () => getQuizByLesson(data?.data?.userAdventure?.currentLessonId))


    useEffect(() => {
        if (currentIndex) {
            fetchLessons()
        }

    }, [currentIndex]);


    useRefreshOnFocus(fetchModules)
    useRefreshOnFocus(fetchReviews)

    const dispatchCurrentIndex = (index: number) => {
        setCurrentIndex(index)
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


    return (

        <>

            <SafeAreaView style={styles.safeArea}>
                <Toast message={responseMessage} state={responseState} type={responseType}/>
                <StatusBar style={'light'}/>
                <View style={styles.topViewWrap}>
                    <View style={[styles.navBar, {
                        paddingHorizontal: pixelSizeHorizontal(20)
                    }]}>
                        <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.8}>
                            <AntDesign name="arrowleft" size={24} color="black"/>
                        </TouchableOpacity>
                    </View>


                    <View style={styles.videoContainer}>


                        <FastImage
                            style={styles.adventureCard}
                            source={{
                                uri: adventure?.imageUrl,
                                cache: FastImage.cacheControl.web,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />


                    </View>

                </View>



                <View style={styles.container}>

<View style={{

    width:'100%'
}}>

</View>
                    <ScrollView
                        style={{width: '100%',}} contentContainerStyle={styles.scrollView} scrollEnabled
                        showsVerticalScrollIndicator={false}>
                        <View style={styles.details}>
                            <View style={styles.cardBottom}>

                                <View style={styles.cardBottomLeft}>

                                    <Text onPress={() => navigation.navigate('LeaveReview', {
                                        adventureId: missionId
                                    })} style={[styles.cardBottomLeftText, {
                                        marginBottom:5,
                                    }]}>
                                        {adventure?.name}
                                    </Text>
                                    <Text style={styles.cardTextSmall}>
                                        {modules?.data?.result?.length} missions
                                    </Text>
                                </View>
                                <View style={styles.cardTopLeft}>
                                    <FontAwesome5 name="gift" size={16} color={Colors.success}/>
                                    <Text style={styles.cardTopLeftText}>
                                        {adventure?.rewardPoint} Reward Points
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <SegmentedControl tabs={["About", "Missions", "Reviews"]}
                                          currentIndex={tabIndex}
                                          onChange={handleTabsChange}
                                          segmentedControlBackgroundColor={"#0E0E0E"}
                                          activeSegmentBackgroundColor={Colors.primaryColor}
                                          activeTextColor={"#fff"}
                                          textColor={"#fff"}
                                          paddingVertical={pixelSizeVertical(10)}/>

                        <View style={styles.cardContainer}>
                            <IF condition={tabIndex == 0}>

                                <AboutCard title={"What to Expect"} message={adventure?.expectations}/>
                                <AboutCard title="What to Gain" message={adventure?.gains}/>

                                <AboutCard title="What to Earn" message={adventure?.earnings}/>

                            </IF>

                            <IF condition={tabIndex == 1}>
                                {loadingModules
                                    && <ActivityIndicator size='small' color={Colors.primaryColor}/>
                                }

                                {
                                    !loadingModules && modules && modules?.data?.result?.map((({
                                                                                                   id,
                                                                                                   name,
                                                                                                   description
                                                                                               }) => (
                                        <MissionCard loadingLessons={loadingLessons} index={id}
                                                     lessons={lessons?.data?.result} setCurrentIndex={setCurrentIndex}
                                                     currentIndex={currentIndex} key={id} name={name}
                                                     description={description}/>
                                    )))

                                }

                            </IF>
                            <IF condition={tabIndex == 2}>
                                {loadingReviews
                                    && <ActivityIndicator size='small' color={Colors.primaryColor}/>
                                }
                                {
                                    !loadingReviews && reviews && reviews?.data?.map((({
                                                                                           id,
                                                                                           text,
                                                                                           user,
                                                                                           updatedAt,
                                                                                           rating
                                                                                       }) => (
                                        <ReviewCard key={id} text={text} userName={user?.fullName}
                                                    updatedAt={updatedAt} rating={rating}/>
                                    )))
                                }


                            </IF>
                        </View>


                        {
                            data?.data?.startedAdventure ?
                                <RectButton disabled={data?.data?.userAdventure?.status == 'COMPLETED' || isLoading}
                                            onPress={nextQuiz} style={{
                                    width: widthPixel(200),
                                    position: 'absolute',
                                    bottom: 5
                                }}>
                                    {
                                        isLoading &&
                                        <ActivityIndicator size='small' color={"#fff"}/>
                                    }

                                    {
                                       !isLoading &&
                                            data?.data?.userAdventure?.status == 'COMPLETED' ?
                                            <Text style={styles.buttonText}>
                                                Completed

                                            </Text>
                                            :
                                            <Text style={styles.buttonText}>
                                                Continue

                                            </Text>

                                    }
                                </RectButton>

                                :

                                <RectButton onPress={startQuiz} disabled={startingAdventure} style={{
                                    width: widthPixel(200),
                                    position: 'absolute',
                                    bottom: 5
                                }}>
                                    {
                                        startingAdventure ? <ActivityIndicator size='small' color="#fff"/> :

                                            <Text style={styles.buttonText}>
                                                Start Mission

                                            </Text>
                                    }
                                </RectButton>
                        }

                    </ScrollView>
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
        // paddingHorizontal: pixelSizeHorizontal(20),
        backgroundColor: "#0E0E0E",
    },
    navBar: {
        position: 'absolute',
        top: 10,
        zIndex: 300,
        width: '100%',
        height: heightPixel(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: '#fff',

        alignItems: 'center',
        justifyContent: 'center',
    },
    leftBody: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%'
    },
    container: {
        top: -50,
        zIndex: 3,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        backgroundColor: "#0E0E0E",
        flex: 1,
        overflow: 'hidden',
        width: '100%',
        paddingHorizontal: pixelSizeHorizontal(20)
    },


    videoContainer: {

        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    adventureCard: {
        resizeMode: 'cover',

        width: '100%',
        height: '100%',

    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    details: {
        marginTop: 20,
        height: heightPixel(100),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollView: {
        overflow: 'hidden',
        //  backgroundColor: Colors.background,
        width: '100%',

        alignItems: 'center'
    },
    topViewWrap: {
        //  zIndex: -30,

        width: '100%',
        backgroundColor: "#ccc",
        height: heightPixel(300),
        alignItems: 'center',

    },
    cardBottom: {
        width: '100%',
        height: 70,
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardTopLeft: {
        minWidth: 100,
        height: 35,
        alignItems: 'flex-start',

        flexDirection: 'row',
    },
    cardTopLeftText: {
        marginLeft: 5,
        color: "#fff",
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandMedium
    },
    cardBottomLeft: {
        width: '65%',
        //height: 50,

        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    cardBottomLeftText: {
        textTransform: 'capitalize',
        fontFamily: Fonts.quicksandSemiBold,
        color: "#fff",
        lineHeight: heightPixel(20),
        fontSize: fontPixel(14),
    },
    cardTextSmall: {
        color: "#fff",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandRegular
    },
    cardContainer: {
        minHeight: heightPixel(350),
        marginTop: 30,
        width: '100%',
        marginBottom:30,
    },
    aboutCard: {
        marginVertical: pixelSizeVertical(10),
        width: '100%',
        minHeight: heightPixel(80),
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    aboutTitle: {
        color: Colors.primaryColor,
        fontSize: fontPixel(18),
        fontFamily: Fonts.quicksandRegular
    },

    aboutBodyText: {
        marginTop: 5,
        color: "#ccc",
        lineHeight: heightPixel(20),
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandRegular
    },
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
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

    reviewTitle: {
        color: "#fff",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quickSandBold
    },
    reviewCard: {

        marginVertical: pixelSizeVertical(10),
        width: '100%',
        minHeight: heightPixel(80),
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    nameStars: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    stars: {
        minWidth: 50,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    reviewBodyText: {

        color: "#fff",
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandRegular
    },
    reviewDateText: {
        marginTop: 5,
        color: "#777777",
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandRegular
    },
    missionCardHead: {

        paddingVertical: pixelSizeVertical(10),
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
    },
    missionCard: {
        marginBottom: 5,
        width: '100%',
        minHeight: heightPixel(80),
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    missionCardLeft: {
        width: '80%',
        alignItems: 'flex-start',

    },
    missionTitle: {
        color: Colors.primaryColor,
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold
    },
    subCategoriesList: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: "row",
        height: 40,

    },
})


export default memo(AdventureHome);
