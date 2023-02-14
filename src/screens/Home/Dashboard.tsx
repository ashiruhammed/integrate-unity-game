import React, {useEffect, useState} from 'react';

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
import {Ionicons, Octicons} from "@expo/vector-icons";
import Svg, {Circle} from "react-native-svg";
import Colors from "../../constants/Colors";
import FruitIcon from "../../assets/images/svg/FruitIcon";
import WarmIcon from "../../assets/images/svg/WarmIcon";
import {Fonts} from "../../constants/Fonts";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getAllAdventure, getBadges, getUser, requestPhoneVerification, verifyPhone} from "../../action/action";
import Animated, {Easing, FadeInDown, FadeInUp, FadeOutDown, Layout} from "react-native-reanimated";
import {setResponse, unSetResponse, updateUserInfo} from "../../app/slices/userSlice";
import FastImage from 'react-native-fast-image';
import Constants from "expo-constants";
import {setAdventure} from "../../app/slices/dataSlice";
import {RootTabScreenProps} from "../../../types";
import {useRefreshOnFocus} from "../../helpers";
import Toast from "../../components/Toast";




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

const BadgeItem = ({badge}: props) => {
    return (

        <Animated.View key={badge.title} entering={FadeInDown} exiting={FadeOutDown}
                       layout={Layout.easing(Easing.bounce).delay(20)} style={styles.badgeImageWrap}>
            <Image
                source={{uri: 'https://res.cloudinary.com/dijyr3tlg/image/upload/v1672951469/gateway/Group_151_cret7t.png'}}
                style={styles.badgeImage}/>

            <View style={styles.badgeStreakScore}>
                <Text style={styles.badgeStreakText}>
                    x1
                </Text>
            </View>
        </Animated.View>


    )
}

const isRunningInExpoGo = Constants.appOwnership === 'expo'
const Dashboard = ({navigation}: RootTabScreenProps<'Home'>) => {

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const user = useAppSelector(state => state.user)
    const {userData,responseState, responseType, responseMessage} = user
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const [refreshing, setRefreshing] = useState(false);

    const backgroundColor = theme == 'light' ? "#FEF1F1" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text


    const {isLoading: loadingUser, refetch: fetchUser} = useQuery(['user-data'], getUser, {
        onSuccess: (data) => {
            if (data.success) {

                dispatch(updateUserInfo(data.data))

            }
        },
    })



    const { mutate:requestPhone} = useMutation(['requestPhoneVerification'], requestPhoneVerification, {
        onSuccess: (data) => {

            if (data.success) {
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
            }


        },
        onSettled: () => {
            queryClient.invalidateQueries(['requestPhoneVerification'])
        }
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

//console.log(data?.pages[0]?.data?.result)

    const goToAdventure = ( adventure: {}) => {
        dispatch(setAdventure({adventure}))
        navigation.navigate('AdventureHome')

    }
    const refresh = () => {
        setRefreshing(true)
        refetch()

        wait(2000).then(() => setRefreshing(false));
    }


    const verifyPhoneNumber = () => {
        const body = JSON.stringify({
            email: userData?.phone,
        })
        requestPhone(body)
        navigation.navigate('ConfirmPhonenumber')

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
        <SafeAreaView style={[styles.safeArea, {
            backgroundColor
        }]}>
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
                            {
                                isRunningInExpoGo ?
                                    <Image
                                        style={styles.Image}
                                        source={{
                                            uri: !user.userData?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : user.userData?.avatar,

                                        }}
                                    />
                                    :

                                    <FastImage
                                        style={styles.Image}
                                        source={{
                                            uri: !user.userData?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : user.userData?.avatar,

                                            cache: FastImage.cacheControl.web,
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                            }

                        </View>

                    </Animated.View>


                    <View style={styles.fullNameWrap}>
                        <Text style={[styles.fullName, {
                            color: textColor
                        }]}>
                            {userData?.fullName}
                        </Text>
                        <Text style={[styles.subTitle, {
                            color: textColor
                        }]}>
                            Cocoon
                        </Text>
                    </View>

                    <View style={styles.progressBarContainer}>
                        <FruitIcon/>
                        <View style={styles.progressBar}>
                            <View style={styles.Bar}/>

                        </View>
                        <WarmIcon/>
                    </View>
                </View>


                {
                    !user?.userData?.phoneNumberVerified &&

                    <TouchableOpacity onPress={verifyPhoneNumber} style={[styles.verifyCard, {

                        backgroundColor: theme == 'light' ? "#fff" : Colors.dark.tFareBtn
                    }]}>
                        <Text style={[styles.verifyText, {
                            color: textColor
                        }]}>
                            👋 Verify your phone number
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
                        data?.pages[0]?.data?.result.map(((item) => (
                            <Animated.View key={item.id} entering={FadeInDown} exiting={FadeOutDown}
                                           layout={Layout.easing(Easing.bounce).delay(20)}>
                                <Pressable onPress={() => goToAdventure(item)}
                                           style={[styles.adventureItem, {
                                               backgroundColor: theme == 'dark' ? Colors.dark.background : "#fff",
                                           }]}>
                                    {
                                        isRunningInExpoGo ?

                                            <Image
                                                style={styles.adventureItemImage}
                                                source={{
                                                    uri: item.imageUrl,
                                                }}
                                                resizeMode={'cover'}
                                            />
                                            :
                                            <FastImage
                                                style={styles.adventureItemImage}
                                                source={{
                                                    uri: item.imageUrl,
                                                    cache: FastImage.cacheControl.web,
                                                    priority: FastImage.priority.normal,
                                                }}
                                                resizeMode={FastImage.resizeMode.cover}
                                            />
                                    }

                                </Pressable>
                            </Animated.View>
                        )))


                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems:'center',
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
        height: heightPixel(80),
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

    badgeContainer: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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
        width: widthPixel(25),
        height: heightPixel(25),
        backgroundColor: "#fff",
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },

})

export default Dashboard;
