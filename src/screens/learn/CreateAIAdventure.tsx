import React, {useEffect, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Platform,
     Image, ActivityIndicator
} from 'react-native';
import {AntDesign, Ionicons, Octicons} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useInfiniteQuery, useQueryClient, useMutation, useQuery} from "@tanstack/react-query";
import {createAIAdventure, getUserDashboard, userNotifications} from "../../action/action";
import {RootStackScreenProps} from "../../../types";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import * as yup from "yup";
import {useFormik} from "formik";
import TextInput from "../../components/inputs/TextInput";
import {RectButton} from "../../components/RectButton";
import Animated, {
    FadeInDown, FadeOutDown,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from "react-native-reanimated";
import {IF} from "../../helpers/ConditionJsx";
import * as SecureStore from "expo-secure-store";




import SwipeAnimatedToast from "../../components/toasty";
import {addNotificationItem, setAdventure} from "../../app/slices/dataSlice";
//import "react-native-url-polyfill/auto"; // Use URL polyfill in React Native




const formSchema = yup.object().shape({

    contract: yup.string().required('Title is required'),

});


const CreateAIAdventure = ({navigation}: RootStackScreenProps<'CreateAIAdventure'>) => {


    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const user = useAppSelector(state => state.user)
    const {userData, responseState, responseType, responseMessage} = user
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const [progress, setProgress] = React.useState(0);
    const [events, setEvents] = useState([]);
    const [isAdLoading, setIsAdLoading] = useState(false)

    const [refreshing, setRefreshing] = useState(false);
    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor

    const [focusContract, setFocusContract] = useState(false)


    const position = useSharedValue(0);

    const translateY = useSharedValue(0);

    const {isLoading: loadingUser,data:userDashboard, refetch:fetchDashboard} = useQuery(['getUserDashboard'], getUserDashboard, {})

    useEffect(() => {
        translateY.value = withRepeat(
            withSpring(50, {damping: 2, stiffness: 80}),
            -1,
            true
        );
    }, [])
    useEffect(() => {
        position.value = withRepeat(
            withSpring(1, {damping: 2, stiffness: 80}),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateY: translateY.value}],
    }));


    useEffect(() => {
        (async () => {
            let Token = await SecureStore.getItemAsync('Gateway-Token');
            //  console.log(Token)
        })()

    }, []);





    const openNotifications = () => {
        navigation.navigate('Notifications')
    }

    const {
        data: notifications,

    } = useInfiniteQuery([`notifications`], ({pageParam = 1}) => userNotifications.notifications({pageParam}),
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


    const {mutate, isLoading, data,} = useMutation(['createAIAdventure'], createAIAdventure, {
        onSuccess: (data) => {
            if (data.success) {

                dispatch(setAdventure({adventure: data.data}))
                navigation.navigate('AdventureHome')


            } else {

                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: data.message,
                }))
            }


        }

    })



    let count = 1;
    const width = useSharedValue(1);
    const animatedProgressStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(width.value, {
                duration: 10
            }),
        };
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!isLoading || count > 200) {
                clearInterval(intervalId);

            } else {

                width.value = count++

            }
        }, 100);

        return () => {
            clearInterval(intervalId);
        }
    }, [count, isLoading]);



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

            contract: '',

        },
        onSubmit: (values) => {
            const {contract} = values;
            const body = JSON.stringify({courseTitle: contract, disableEventEmit: true})


            mutate({body})
        }
    });


    const createAdventure = () => {

    }


    return (
        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>

            <SwipeAnimatedToast/>
            <IF condition={isLoading}>

                <Animated.View entering={FadeInDown}
                               exiting={FadeOutDown} style={styles.progressContainer}>


                    <ImageBackground source={require('../../assets/images/animated-bg.png')} resizeMode={'cover'}
                                     style={styles.backgroundImage}>


                        <View style={styles.container}>

                            <View style={styles.avatar}>
                                <Image source={require('../../assets/images/avatar.png')} style={styles.avatarImage}/>
                            </View>

                            <Text style={styles.noticeText}>
                                A moment while we create
                                your adventure
                            </Text>

                            <Text style={styles.subNoticeText}>
                                Creating your lesson...
                            </Text>
                            <Animated.View key={count}
                                           entering={FadeInDown.springify()} exiting={FadeOutDown} style={styles.barContainer}>
                            <Animated.View style={[styles.loadingViewBorder, animatedProgressStyle ]}/>
                            </Animated.View>

                        </View>

                        <Animated.View style={[styles.floatingRock, animatedStyle]}>
                            <Image source={require('../../assets/images/floating_rock.png')}
                                   style={styles.floatingRockImage}/>
                        </Animated.View>


                    </ImageBackground>
                </Animated.View>
            </IF>


            <IF condition={!isLoading}>


                <KeyboardAwareScrollView style={{width: '100%',}}
                                         contentContainerStyle={[styles.scrollView, {backgroundColor}]} scrollEnabled
                                         showsVerticalScrollIndicator={false}>

                    <View style={styles.topBar}>

                        <View style={styles.leftButton}>
                            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}
                                              style={styles.backButton}>

                                <AntDesign name="arrowleft" size={30} color="black"/>
                            </TouchableOpacity>
                            <View style={styles.pointWrap}>
                                <Ionicons name="gift" size={16} color="#22BB33"/>
                                <Text style={styles.pointsText}>{userDashboard?.data?.totalPoint}</Text>
                            </View>
                        </View>

                        <View style={styles.rightButton}>

                            <ImageBackground style={styles.streaKIcon} resizeMode={'contain'}
                                             source={require('../../assets/images/streakicon.png')}>
                                <Text style={styles.streakText}> {userDashboard?.data?.currentDayStreak}</Text>
                            </ImageBackground>

                            <TouchableOpacity onPress={openNotifications} activeOpacity={0.6}
                                              style={styles.roundTopBtn}>
                                {
                                    notifications?.pages[0]?.data?.result.some((obj: { isRead: boolean; }) => !obj.isRead)  &&
                                    <View style={styles.dot}/>
                                }
                                <Octicons name="bell-fill" size={22} color={"#000"}/>
                            </TouchableOpacity>

                        </View>

                    </View>


                    <View style={styles.bodyCreate}>
                        <Image source={require('../../assets/images/gateway-adaptive.png')} style={styles.gatewayIcon}/>
                        <Text style={styles.bodyText}>
                            Let <Text style={{color: Colors.primaryColor}}>Learning</Text> help you
                            become the best version of <Text style={{color: Colors.primaryColor}}>yourself</Text>.
                        </Text>

                        <TextInput

                            placeholder="What are smart contracts?"
                            keyboardType={"default"}
                            touched={touched.contract}
                            error={touched.contract && errors.contract}
                            onFocus={() => setFocusContract(true)}
                            onChangeText={(e) => {
                                handleChange('contract')(e);

                            }}
                            onBlur={(e) => {
                                handleBlur('contract')(e);
                                setFocusContract(false);
                            }}

                            focus={focusContract}
                            value={values.contract}
                            label=""/>


                        <RectButton disabled={!isValid || isLoading} style={{

                            width: widthPixel(250)
                        }} onPress={() => handleSubmit()}>


                            {isLoading ? <ActivityIndicator size={"small"} color={"#fff"}/>
                                :
                                <Text style={styles.buttonText}>
                                    Create new adventure

                                </Text>
                            }
                        </RectButton>

                    </View>


                </KeyboardAwareScrollView>

            </IF>


        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#FEF1F1",
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    backButton: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    scrollView: {
        //  backgroundColor: Colors.background,
        backgroundColor: "#F9F9F9",
        width: '100%',
        alignItems: 'center'
    },
    topBar: {
        paddingHorizontal: pixelSizeHorizontal(15),
        width: '100%',
        height: heightPixel(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    leftButton: {
        width: '15%',
        height: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'row',

        alignItems: 'center',
    },
    pointWrap: {
        height: 25,
        paddingHorizontal: pixelSizeHorizontal(10),
        borderRadius: 10,
        minWidth: widthPixel(70),
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'row',
        backgroundColor: "#181818"

    },
    pointsText: {
        color: "#fff",
        marginLeft: 5,
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandSemiBold
    },
    rightButton: {
        width: widthPixel(100),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    streaKIcon: {
        marginRight: 10,
        width: 25,
        resizeMode: 'center',
        height: '100%',
        alignItems: "center",
        justifyContent: "center"
    },
    streakText: {
        marginTop: 10,
        fontSize: fontPixel(12),
        color: "#fff",
        fontFamily: Fonts.quicksandMedium
    },
    roundTopBtn: {
        width: 40,
        height: 40,
        borderRadius: 40,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        position: 'absolute',
        width: 10,
        height: 10,
        top: 5,
        zIndex: 1,
        right: 10,
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: Colors.errorRed,
        borderRadius: 15,
    },
    bodyCreate: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        height: heightPixel(500),

    },
    gatewayIcon: {
        width: 250,
        height: 150,
        objectFit: 'cover'
    },
    bodyText: {
        fontSize: fontPixel(24),
        fontFamily: Fonts.quicksandSemiBold,
        textAlign: 'center',
        lineHeight: 30
    },
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },


    /*SECOND SCREEN*/


    barContainer: {

        width: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        overflow: 'hidden',
    },
    floatingRock: {
        width: '100%',
        height: 200,
        alignItems: "center",
        justifyContent: 'center',
    },

    floatingRockImage: {
        width: '100%',
        height: '100%',
        alignItems: "center",
        justifyContent: 'center',
        resizeMode: 'contain'
    },
    backgroundImage: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
    },
    progressContainer: {
        width: '100%',
        flex: 1,
        backgroundColor: "#000"
    },
    container: {
        width: '90%',
        alignItems: "center",
        height: heightPixel(400),
        justifyContent: 'space-evenly'
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: 'center'
    }, avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        alignItems: "center",
        justifyContent: 'center',
        resizeMode: 'cover'
    },
    noticeText: {
        fontSize: fontPixel(24),
        lineHeight: 30,
        color: "#fff",
        textAlign: 'center',
        fontFamily: Fonts.quicksandSemiBold,
        marginVertical: pixelSizeVertical(10)
    },
    subNoticeText: {
        fontSize: fontPixel(14),
        color: "#fff",
        textAlign: 'center',
        fontFamily: Fonts.quicksandMedium
    },
    progressBar: {
        backgroundColor: "#BF1314",
        height: '100%',
        borderRadius: 20,
    },
    loadingViewBorder: {
        borderColor: "#BF1314",
        borderWidth: 5,
        borderRadius: 10,
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
})

export default CreateAIAdventure;
