import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Platform,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    Image,
    ActivityIndicator, Pressable, RefreshControl
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {AntDesign, Ionicons, Octicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import FruitIcon from "../../assets/images/svg/FruitIcon";
import WarmIcon from "../../assets/images/svg/WarmIcon";
import {Fonts} from "../../constants/Fonts";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getAllAdventure,
    getBadges,
    getUser,
    requestPhoneVerification,
    updatePhoneNumberVerify,
    verifyPhone
} from "../../action/action";
import Animated, {Easing, FadeInDown, FadeInUp, FadeOutDown, Layout} from "react-native-reanimated";
import {setResponse, unSetResponse, updateUserInfo} from "../../app/slices/userSlice";
import FastImage from 'react-native-fast-image';
import Constants from "expo-constants";
import {setAdventure} from "../../app/slices/dataSlice";
import {RootTabScreenProps} from "../../../types";
import {useRefreshOnFocus} from "../../helpers";
import Toast from "../../components/Toast";
import {RectButton} from "../../components/RectButton";
import BottomSheet, {BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {Portal} from "@gorhom/portal";
import PhoneInputText from "../../components/inputs/PhoneInputText";
import {useFormik} from "formik";
import * as yup from "yup";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";


const formSchema = yup.object().shape({
    phoneNumber: yup.string().required('Phone number is required').min(10, 'Please enter a valid phone number'),
});


const wait = (timeout: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};

interface props {
    badge: {
        imageUrl: string,
        "nftCollection": {
            "seriesId": string,
        },
        "title": string,
    },
    badgeId: string
}


const Dashboard = ({navigation}: RootTabScreenProps<'Home'>) => {

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const user = useAppSelector(state => state.user)
    const {userData, responseState, responseType, responseMessage} = user
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const [countryCode, setCountryCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [refreshing, setRefreshing] = useState(false);

    const backgroundColor = theme == 'light' ? "#FEF1F1" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor

    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);
    // variables
    const snapPoints = useMemo(() => ['1%', '65%'], []);
    const handleClosePress = () => {
        bottomSheetRef.current?.close()
    }
    const openSheet = () => {
        bottomSheetRef.current?.snapToIndex(1)
    }
    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={0}
                appearsOnIndex={1}
            />
        ),
        []
    );


    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // variables
    const modalSnapPoints = useMemo(() => ['1%', '25%'], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleClosetModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);


    const {
        isLoading: loading,
        mutate: requestCodeNow
    } = useMutation(['updatePhoneNumberVerify'], updatePhoneNumberVerify, {
        onSuccess: (data) => {

            if (data.success) {
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'success',
                }))
                handleClosePress()
                navigation.navigate('ConfirmPhonenumber', {
                    phone: phoneNumber
                })
            } else {
                handleClosePress()
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'error',
                }))
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['updatePhoneNumberVerify']);
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

            phoneNumber: '',


        },
        onSubmit: (values) => {
            const {phoneNumber} = values;

            const body = JSON.stringify({
                phone: phoneNumber,
                countryCode

            })
//console.log(body)
            requestCodeNow(body)
        }
    });

    const {isLoading: loadingUser, refetch: fetchUser} = useQuery(['user-data'], getUser, {
        onSuccess: (data) => {
            if (data.success) {

                dispatch(updateUserInfo(data.data))

            }
        },
    })


    const {
        isLoading,
        data,
        hasNextPage,
        fetchNextPage: fetchNextPageWallet,
        isFetchingNextPage,
        refetch,

        isRefetching
    } = useInfiniteQuery([`getAllAdventure`], ({pageParam = 1}) => getAllAdventure.adventures(pageParam),
        {
            networkMode: 'online',
            refetchOnWindowFocus: true,

            getNextPageParam: lastPage => {
                if (lastPage.next !== null) {
                    return lastPage.next;
                }

                return lastPage;
            },
            getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
        })


    const goToAdventure = (adventure: {}) => {
        dispatch(setAdventure({adventure}))
        navigation.navigate('AdventureHome')

    }
    const refresh = () => {
        setRefreshing(true)
        refetch()

        wait(2000).then(() => setRefreshing(false));
    }


    const verifyPhoneNumber = () => {
        if (userData?.phone) {
            const body = JSON.stringify({
                phone: userData?.phone,
                countryCode: userData?.countryCode,
            })
            requestCodeNow(body)

        } else {
            openSheet()
        }
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

    useRefreshOnFocus(fetchUser)

    return (
        <>

            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
                <Toast message={responseMessage} state={responseState} type={responseType}/>
                <ScrollView
                    refreshControl={<RefreshControl tintColor={Colors.primaryColor}
                                                    refreshing={refreshing} onRefresh={refresh}/>}
                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>
                    <View style={[styles.topDashboard, {
                        backgroundColor: theme == 'dark' ? backgroundColor : "#fff"
                    }]}>


                        {/*   */}
                        <Animated.View key={userData?.fullName} entering={FadeInUp} exiting={FadeOutDown}
                                       layout={Layout.easing(Easing.bounce).delay(20)} style={styles.userImage}>

                            <View style={styles.profileImage}>

                                <FastImage
                                    style={styles.Image}
                                    source={{
                                        uri: !user.userData?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : user.userData?.avatar,

                                        cache: FastImage.cacheControl.web,
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />


                            </View>

                        </Animated.View>


                        <View style={[styles.fullNameWrap, {
                            height: userData?.username ? heightPixel(80) : heightPixel(50),
                        }]}>
                            <Text style={[styles.fullName, {
                                color: textColor
                            }]}>
                                {userData?.fullName}
                            </Text>
                            <Text style={[styles.subTitle, {
                                color: textColor
                            }]}>
                                {userData?.username && `@${userData?.username}`}
                            </Text>
                        </View>

                        <View style={styles.progressBarContainer}>
                            <FruitIcon/>
                            <View style={styles.progressBar}>
                                <View style={styles.Bar}/>

                            </View>
                            <WarmIcon/>
                        </View>

                        <Text onPress={handlePresentModalPress} style={[styles.learnMore, {
                            color: lightText
                        }]}>
                            Learn more <AntDesign name="questioncircle" size={14} color={lightText}/>
                        </Text>
                    </View>


                    {
                        !user?.userData?.phoneNumberVerified &&

                        <TouchableOpacity onPress={verifyPhoneNumber} style={[styles.verifyCard, {

                            backgroundColor: theme == 'light' ? "#fff" : Colors.dark.tFareBtn
                        }]}>
                            <Text style={[styles.verifyText, {
                                color: textColor
                            }]}>
                                👋 Please Verify your phone number
                            </Text>
                            <TouchableOpacity activeOpacity={0.6} style={styles.chevronGreen}>
                                <Ionicons name="warning-outline" size={14} color={Colors.primaryColor}/>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    }


                    <View style={styles.badgeContainer}>

                        {
                            isLoading &&

                            <View style={styles.loaderContainer}>
                                <ActivityIndicator size='small' color={Colors.primaryColor}/>
                            </View>
                        }
                        {
                            !isLoading &&

                            <View style={styles.titleWrap}>


                                <Text style={[styles.learnMore, {
                                    width: '70%',
                                    lineHeight: heightPixel(22),
                                    color: textColor
                                }]}>
                                    Explore story adventures below and earn rewards
                                </Text>
                            </View>
                        }
                        {
                            !loading && data &&
                            data?.pages[0]?.data?.result.slice(0, 12).map(((item) => (
                                <Animated.View key={item.id} entering={FadeInDown} exiting={FadeOutDown}
                                               layout={Layout.easing(Easing.bounce).delay(20)}>
                                    <Pressable onPress={() => goToAdventure(item)}
                                               style={[styles.adventureItem, {
                                                   backgroundColor: theme == 'dark' ? Colors.dark.background : "#fff",
                                               }]}>


                                        <FastImage
                                            style={styles.adventureItemImage}
                                            source={{
                                                uri: item.imageUrl,
                                                cache: FastImage.cacheControl.web,
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />


                                    </Pressable>
                                </Animated.View>
                            )))


                        }
                    </View>
                </ScrollView>


            </SafeAreaView>

            <Portal>
                <BottomSheet
                    backgroundStyle={{
                        backgroundColor: theme == 'light' ? "#fff" : Colors.dark.background,
                    }}
                    handleIndicatorStyle={Platform.OS == 'android' && {display: 'none'}}
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    keyboardBehavior="interactive"
                    backdropComponent={renderBackdrop}
                    style={{
                        paddingHorizontal: pixelSizeHorizontal(20)
                    }}
                >


                    <View style={styles.sheetHead}>


                        <Text style={[styles.sheetTitle, {
                            color: textColor
                        }]}>
                            Update phone number
                        </Text>
                        {Platform.OS == 'android' && <TouchableOpacity onPress={handleClosePress}
                                                                       style={[styles.dismiss, {
                                                                           backgroundColor: theme == 'light' ? "#f8f8f8" : Colors.dark.background
                                                                       }]}>
                            <Ionicons name="close-sharp" size={20} color={textColor}/>
                        </TouchableOpacity>}
                    </View>


                    <KeyboardAwareScrollView scrollEnabled
                                             style={{
                                                 width: '100%',

                                             }}
                                             showsVerticalScrollIndicator={false}
                                             showsHorizontalScrollIndicator={false}
                                             contentContainerStyle={
                                                 styles.sheetContainer
                                             }>
                        <View style={styles.authContainer}>
                            <PhoneInputText
                                error={errors.phoneNumber}
                                label="Phone number"
                                onChangeText={(text,code) => {
                                    handleChange('phoneNumber')(text);
                                    setPhoneNumber(text)
                                    setCountryCode(code)
                                }}


                                value={values.phoneNumber}
                                errorMessage=''
                                placeholder="Phone number"/>


                            <RectButton style={{marginTop: 30, width: widthPixel(200)}} onPress={() => handleSubmit()}>
                                {
                                    loading ? <ActivityIndicator size="small" color={"#fff"}/> :

                                        <Text style={styles.buttonText}>
                                            Proceed

                                        </Text>
                                }
                            </RectButton>
                        </View>
                    </KeyboardAwareScrollView>
                </BottomSheet>


                <BottomSheetModalProvider>


                    <BottomSheetModal

                        backgroundStyle={{
                            backgroundColor,
                        }}
                        backdropComponent={renderBackdrop}
                        ref={bottomSheetModalRef}
                        index={1}
                        snapPoints={modalSnapPoints}
                        handleIndicatorStyle={[{backgroundColor: theme == 'light' ? "#333" : "#eee"}, Platform.OS == 'android' && {display: 'none',}]}

                    >
                        <View style={styles.contentContainer}>
                            <View style={[styles.sheetHead, {
                                height: 40,
                            }]}>


                                <Text style={[styles.sheetTitle, {
                                    fontSize: fontPixel(14),
                                    color: Colors.primaryColor
                                }]}>
                                    Growth bar
                                </Text>
                                {Platform.OS == 'android' && <TouchableOpacity onPress={handleClosetModal}
                                                                               style={[styles.dismiss, {
                                                                                   backgroundColor: theme == 'light' ? "#f8f8f8" : Colors.dark.background
                                                                               }]}>
                                    <Ionicons name="close-sharp" size={20} color={textColor}/>
                                </TouchableOpacity>}
                            </View>

                            <Text style={[styles.learnMoreText, {
                                color: textColor
                            }]}>This bar represents your growth from an egg to the ladybug, it fills up based on your
                                activities on the app 🎉</Text>
                        </View>
                    </BottomSheetModal>

                </BottomSheetModalProvider>
            </Portal>
        </>
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
    scrollView: {
        //  backgroundColor: Colors.background,
        backgroundColor: "#F9F9F9",
        width: '100%',
        alignItems: 'center'
    },
    topDashboard: {

        height: heightPixel(360),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomStartRadius: 30,
        borderBottomEndRadius: 30,
        shadowColor: "#000",
        borderRadius: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.42,
        shadowRadius: 7.22,

        elevation: 3,
    },
    topCover: {
        height: heightPixel(150),
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'red',
        borderBottomStartRadius: 250,
        borderBottomEndRadius: 250,
        resizeMode: 'center'
    },
    topBar: {
        paddingHorizontal: pixelSizeHorizontal(15),
        width: '100%',
        height: heightPixel(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    userImage: {
        width: 115,
        height: 115,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 120,
        //  borderWidth:5,
        // borderStyle:'dashed',
        // backgroundColor:Colors.primaryColor,
        bottom: -30
    },
    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 120,

        position: 'absolute',
    },
    Image: {
        borderRadius: 120,
        width: "100%",
        height: "100%",
        resizeMode: 'cover'
    },
    fullNameWrap: {
        marginTop: 40,
        width: '100%',

        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    fullName: {
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(24),
        color: Colors.light.text,
    },
    subTitle: {
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(16),
        color: Colors.light.text,
    },

    rightButton: {
        width: widthPixel(70),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    roundTopBtn: {
        width: 40,
        height: 40,
        borderRadius: 40,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarContainer: {
        width: '100%',
        height: heightPixel(40),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBar: {
        width: widthPixel(150),
        height: 10,
        marginHorizontal: pixelSizeHorizontal(10),
        borderRadius: 10,
        backgroundColor: '#DEDEDE'
    },
    Bar: {
        width: widthPixel(50),
        height: 10,
        borderRadius: 10,
        backgroundColor: Colors.primaryColor
    },
    leftButton: {
        width: '60%',
        height: '100%',
        justifyContent: 'center',

        alignItems: 'flex-start',
    },
    titleWrap: {
        width: '100%'
    },
    badgeContainer: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: 30,

        paddingHorizontal: pixelSizeHorizontal(20)
    },

    badgeImageWrap: {
        height: heightPixel(110),
        width: widthPixel(85),
        alignItems: 'center',
        marginHorizontal: pixelSizeHorizontal(20),
        marginVertical: pixelSizeVertical(15),
        justifyContent: 'center',
    },
    badgeImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'center',

    },
    badgeItemBody: {
        marginLeft: 15,
        height: '80%',
        width: '75%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },

    badgeStreakScore: {
        position: 'absolute',
        bottom: 10,
        right: 5,
        borderRadius: 10,
        backgroundColor: "#fff",
        width: widthPixel(35),
        height: heightPixel(18),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: pixelSizeHorizontal(5),
        shadowColor: "#212121",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,

        elevation: 3,
    },
    badgeStreakText: {
        color: Colors.light.text,
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(12)
    },
    loaderContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: heightPixel(250)
    },
    adventureItem: {
        marginTop: 20,
        width: 100,
        height: 100,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.10,
        shadowRadius: 7.22,

        elevation: 3,
    },
    adventureItemImage: {
        width: 85,
        height: 85,
        borderRadius: 100,
        resizeMode: 'cover'
    },
    verifyCard: {
        marginTop: 16,
        width: '80%',

        height: heightPixel(80),
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    verifyText: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
        color: Colors.tintColor

    },
    chevronGreen: {
        width: 25,
        height: 25,
        backgroundColor: "#fff",
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentContainer: {
        paddingHorizontal: pixelSizeHorizontal(20),
        width: '100%',
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    learnMoreText: {
        textAlign: "center",
        lineHeight: heightPixel(24),
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium
    },
    sheetHead: {
        // paddingHorizontal: pixelSizeHorizontal(20),
        height: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
    ,
    sheetTitle: {
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
    },
    sheetContainer: {
        marginTop: 10,

        width: '100%',
        alignItems: 'center',
    },
    authContainer: {

        width: '100%',
        alignItems: 'center',
        height: heightPixel(400)
    },
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
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
    learnMore: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium
    },


})

export default Dashboard;
