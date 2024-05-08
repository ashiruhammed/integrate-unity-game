import React, {SetStateAction, useCallback, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Platform,
    ScrollView,
    Pressable,
    Keyboard, FlatList, Animated as MyAnimated, ActivityIndicator
} from 'react-native';
import {AntDesign, Entypo, Ionicons, Octicons} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Colors from "../../constants/Colors";
import {
    getCCDWallet,
    getPointsHistory,
    getPublicCommunities, getUserDashboard,
    getUserPoints,
    getUserWallets, redeemPoints,
    userNotifications
} from "../../action/action";
import {RootStackScreenProps} from "../../../types";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import BottomSheet, {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import RedeemForm from "../../components/wallets/RedeemForm";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

import SwipeAnimatedToast from "../../components/toasty";
import {addNotificationItem} from "../../app/slices/dataSlice";
import dayjs from "dayjs";
import {useRefreshOnFocus} from "../../helpers";


interface props {
    item: {
        "amount": "3000",
        "createdAt": "2024-05-07T10:48:52.077Z",
        "deletedAt": null,
        "id": "5d7a3304-85c6-401a-8fdd-949cbafc9292",
        "isDeleted": false,
        "reason": "Point issued.",
        "transactionId": null,
        "user": { "avatar": "", "fullName": "Orji", "id": "c3208ae7-0849-4a86-b6e9-5d54dacd046d", "username": "ace" },
        "userId": "c3208ae7-0849-4a86-b6e9-5d54dacd046d"
    }
}

const HistoryCard = ({item}: props) => {

    return (
        <Animated.View key={item.id} entering={FadeInDown.delay(200).randomDelay()} exiting={FadeOutDown}
                       style={styles.breakDownCard}>
            <View style={[styles.boxSign, {
                backgroundColor: Colors.successTint
            }]}>
                <AntDesign name="arrowdown" size={20} style={{transform: [{rotate: "-130deg"}]}}
                           color={Colors.success}/>
            </View>

            <View style={styles.boxTransactionBody}>

                <View style={styles.boxTransactionBodyLeft}>
                    <Text style={styles.transactionTitle}>
                        {item.reason}
                    </Text>
                    <Text style={styles.transactionDate}>
                        {dayjs(item.createdAt).format('MMM, DD YYYY')}
                    </Text>
                </View>

                <View style={[styles.boxTransactionBodyLeft, {
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start'
                }]}>
                    <Text style={styles.transactionTitle}>
                        -{item.amount} GP
                    </Text>

                </View>
            </View>


        </Animated.View>
    )
}

const ViewPoints = ({navigation}: RootStackScreenProps<'ViewPoints'>) => {


    const [tabIndex, setTabIndex] = useState(0);
    const handleTabsChange = (index: SetStateAction<number>) => {
        setTabIndex(index);
        //  setScreen(index === 0 ? 'Banks' : 'Wallets')
    };

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const user = useAppSelector(state => state.user)
    const {userData, responseState, responseType, responseMessage} = user
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const [refreshing, setRefreshing] = useState(false);
    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const darkTextColor = theme == 'light' ? Colors.light.darkText : Colors.dark.text


    const redeemSheetRef = useRef<BottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => ['1%', '60%'], []);

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

    const {
        isLoading: loadingPoints,
        data: points,
        refetch: fetchPoints
    } = useQuery(['getUserPoints'], getUserPoints, {})

    const {data: ccdWallet, isLoading: isLoadingWallet, refetch:refetchWallet} = useQuery(['getCCDwallet'], getCCDWallet)

    const {
        isLoading: loadingUser,
        data: userDashboard,
        refetch: fetchDashboard
    } = useQuery(['getUserDashboard'], getUserDashboard, {})


    const {
        isLoading,
        data,
        hasNextPage,
        fetchNextPage: fetchNextPageWallet,
        isFetchingNextPage,
        refetch,

        isRefetching
    } = useInfiniteQuery([`points-history`], ({pageParam = 1}) => getPointsHistory.history(pageParam),
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


    const {mutate: redeemPointsNow, isLoading: redeeming} = useMutation(['redeemPoints'], redeemPoints,

        {

            onSuccess: async (data) => {

                if (data.success) {
                    refetch()
                    fetchPoints()
                    refetch()
                    handleClosePressRedeem()

                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'success',
                        body: data.message,
                    }))

                } else {
                    handleClosePressRedeem()

                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'error',
                        body: data.message,
                    }))
                    /*  navigation.navigate('EmailConfirm', {
                          email:contentEmail
                      })*/


                }
            },

            onError: (err) => {

                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: err.message,
                }))

            },
            onSettled: () => {
                queryClient.invalidateQueries(['redeemPoints']);
            }

        })


    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPageWallet();
        }
    };

    const renderItemHeader = useCallback(() => (
        <>


            <View style={styles.dashboardBox}>
                <Text style={styles.cardText}>
                    GP
                </Text>

                <View style={[styles.bottomInfo, {
                    height: 30,
                }]}>
                    <Text style={styles.cardTitle}>
                        Gateway Points
                    </Text>
                    <Text style={styles.cardTitle}>
                        {points?.data?.totalPoint}
                    </Text>
                </View>

                <View style={[styles.bottomInfo, {
                    height: 15,
                }]}>
                    <Text style={styles.cardText}>
                        Value: 200
                    </Text>

                    <Text style={styles.cardText}>
                        +4.0%
                    </Text>
                </View>
            </View>


            <View style={styles.buttonWrap}>

              {/*  <Pressable style={[styles.dahButton, {
                    backgroundColor: "#FDDCDC"
                }]}>
                    <Text style={[styles.buttonText, {
                        color: "#E01414"
                    }]}>
                        Buy Points
                    </Text>
                </Pressable>*/}


                <Pressable disabled={!ccdWallet?.data } onPress={openRedeem} style={[styles.dahButton, {
                    backgroundColor:ccdWallet?.data ?  "#D90429" : '#eee'
                }]}>
                    <Text style={[styles.buttonText, {
                        color: ccdWallet?.data ? "#fff" : '#ccc'
                    }]}>
                        Redeem Points
                    </Text>
                </Pressable>


            </View>


            <View style={styles.rowTitle}>
                <Text style={[styles.titleTxt, {
                    color: textColor
                }]}>
                    Transactions
                </Text>

                <Text>
                    See all
                </Text>
            </View>
        </>
    ), [])

    const renderItem = useCallback(({item}) => (
        <HistoryCard item={item}/>
    ), [])
    const keyExtractor = useCallback((item: { id: any; }) =>
            item.id
        , [])

    const handleClosePressRedeem = () => {
        Keyboard.dismiss()
        if (Platform.OS == 'android') {
            redeemSheetRef.current?.snapToIndex(0)
        } else {
            redeemSheetRef.current?.close()
        }

    }
    const openRedeem = () => {
        redeemSheetRef.current?.snapToIndex(1)
    }
    // renders
    const renderBackdrop = useCallback(
        (props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={0}
                appearsOnIndex={1}
            />
        ),
        []
    );


//console.log(wallet?.data)

    useRefreshOnFocus(refetchWallet)
    return (
        <>

            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
                <SwipeAnimatedToast/>
                <View

                    style={[styles.scrollView, {
                        backgroundColor
                    }]}
                >
                    <View style={styles.topBar}>

                        <View style={styles.leftButton}>

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

                    <View style={styles.navButtonWrap}>
                        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}
                                          style={styles.navButton}>

                            <AntDesign name="arrowleft" size={24} color="black"/>
                            <Text style={[styles.backText, {
                                color: darkTextColor
                            }]}>Gateway Points</Text>
                        </TouchableOpacity>


                    </View>


                    <View style={styles.transactions}>

                        <FlatList
                            ListHeaderComponent={renderItemHeader}

                            refreshing={isLoading}
                            onRefresh={refetch}
                            scrollEnabled
                            showsVerticalScrollIndicator={false}
                            data={data?.pages[0]?.data?.result}
                            renderItem={renderItem}
                            onEndReached={loadMore}
                            keyExtractor={keyExtractor}
                            onEndReachedThreshold={0.3}
                            ListFooterComponent={isFetchingNextPage ?
                                <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                        />


                        {/*           <Animated.View entering={FadeInDown.delay(200).randomDelay()} exiting={FadeOutDown} style={styles.breakDownCard}>
                            <View style={[styles.boxSign, {
                                backgroundColor: Colors.errorTint
                            }]}>
                                <AntDesign name="arrowdown" size={20} style={{transform: [{rotate: "40deg"}]}}
                                           color={Colors.errorRed}/>
                            </View>

                            <View style={styles.boxTransactionBody}>

                                <View style={styles.boxTransactionBodyLeft}>
                                    <Text style={styles.transactionTitle}>
                                        Withdrawal
                                    </Text>
                                    <Text style={styles.transactionDate}>
                                        Jan 6, 2024
                                    </Text>
                                </View>

                                <View style={[styles.boxTransactionBodyLeft, {
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start'
                                }]}>
                                    <Text style={styles.transactionTitle}>
                                        -500 GP
                                    </Text>

                                </View>
                            </View>


                        </Animated.View>
*/}
                    </View>
                </View>

            </SafeAreaView>

            <BottomSheet
                ref={redeemSheetRef}
                index={0}

                snapPoints={snapPoints}
                keyboardBehavior="interactive"
                backdropComponent={renderBackdrop}
                style={{
                    paddingHorizontal: pixelSizeHorizontal(20)
                }}
                backgroundStyle={{
                    backgroundColor,
                }}
                handleIndicatorStyle={[{
                    backgroundColor: theme == 'light' ? "#121212" : '#cccccc'
                }, Platform.OS == 'android' && {display: 'none'}]}
            >
                {/*  <BottomSheetTextInput style={styles.input} />*/}

                <View style={styles.sheetHead}>


                    <Text style={[styles.sheetTitle, {
                        fontFamily: Fonts.quickSandBold,
                        color: textColor
                    }]}>
                        Redeem Points
                    </Text>


                    {Platform.OS == 'android' && <TouchableOpacity onPress={handleClosePressRedeem}
                                                                   style={[styles.dismiss, {
                                                                       backgroundColor: theme == 'light' ? "#f8f8f8" : Colors.dark.background
                                                                   }]}>
                        <Ionicons name="close-sharp" size={20} color={textColor}/>
                    </TouchableOpacity>}
                </View>

                <RedeemForm isLoading={redeeming} redeemNow={redeemPointsNow}
                            pointBalance={points?.data?.totalPoint ? points?.data?.totalPoint : '0'}/>
            </BottomSheet>
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
    pageTitleWrap: {
        width: '90%',
        marginVertical: pixelSizeVertical(10),
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    pageTitle: {
        fontSize: fontPixel(24),
        fontFamily: Fonts.quickSandBold
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
        width: '60%',
        height: '100%',
        justifyContent: 'center',

        alignItems: 'flex-start',
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

    navButtonWrap: {
        paddingHorizontal: pixelSizeHorizontal(15),
        width: '100%',
        height: heightPixel(40),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    navButton: {
        width: '75%',
        height: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'row',

        alignItems: 'center',
    },
    rightNavButton: {
        width: widthPixel(200),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    backText: {
        marginLeft: 5,
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandSemiBold
    },
    dashboardBox: {
        backgroundColor: "#D90429",
        width: '100%',
        borderRadius: 15,
        height: heightPixel(100),

        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 20,
        paddingHorizontal: pixelSizeHorizontal(20),
    },
    cardTitle: {
        color: "#fff",
        fontSize: fontPixel(20),
        fontFamily: Fonts.quickSandBold
    },
    cardText: {
        color: "#FAB5E7",
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandRegular
    },
    bottomInfo: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    buttonWrap: {
        width: '100%',
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    dahButton: {
        marginHorizontal: pixelSizeHorizontal(15),
        height: 40,
        width: widthPixel(156),
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',

    },
    buttonText: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold
    },
    rowTitle: {

        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: heightPixel(45),
        flexDirection: 'row'
    },
    titleTxt: {
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(16),
    },
    transactions: {
        width: '90%',
        alignItems: 'center'
    },

    breakDownCard: {

        justifyContent: "space-between",
        alignItems: "center",
        width: "100%", height: heightPixel(60),

        backgroundColor: "#fff", borderRadius: 10,
        flexDirection: "row"
    },


    boxSign: {
        alignSelf: "flex-start",
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        marginTop: 10
    },
    boxTransactionBody: {
        width: '85%',

        justifyContent: 'space-between',
        height: '100%',
        alignItems: 'center',
        flexDirection: 'row',

    },
    boxTransactionBodyLeft: {

        width: '45%',
        height: '70%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        flexDirection: 'column',

    },
    transactionTitle: {
        color: Colors.light.text,
        fontFamily: Fonts.quicksandSemiBold,
        fontSize: fontPixel(14),
    },
    transactionDate: {
        color: "#9C9C9C",
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(12),
    },
    sheetHead: {
        // paddingHorizontal: pixelSizeHorizontal(20),
        height: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }, sheetTitle: {
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
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


})

export default ViewPoints;
