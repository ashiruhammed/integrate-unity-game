import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Platform,
    FlatList,
    Animated as MyAnimated,
    useWindowDimensions,
    TouchableOpacity, ScrollView, ActivityIndicator, Keyboard
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import NavBar from "../../components/layout/NavBar";
import {SafeAreaView} from "react-native-safe-area-context";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import OnBoardingItem from "../../components/onboarding/OnBoardingItem";
import Colors from "../../constants/Colors";
import {Fonts} from "../../constants/Fonts";
import {Entypo, FontAwesome, Ionicons} from "@expo/vector-icons";
import BottomSheet, {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {useFormik} from "formik";
import * as yup from "yup";
import BottomSheetTextInput from "../../components/inputs/BottomSheetTextInput";
import {RectButton} from "../../components/RectButton";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getUser,
    getUserPoints,
    getUserTransaction,
    getUserWallets,
    loginUser,
    redeemPoints,
    withdrawFromWallet
} from "../../action/action";

import {currencyFormatter, useRefreshOnFocus} from "../../helpers";
import {useAppDispatch, useAppSelector} from "../../app/hooks";

import RedeemForm from "../../components/wallets/RedeemForm";
import dayjs from "dayjs";
import Animated,
{Easing, FadeInDown, FadeOutDown, Layout} from "react-native-reanimated";
import SwipeAnimatedToast from "../../components/toasty";
import {addNotificationItem} from "../../app/slices/dataSlice";


const formSchema = yup.object().shape({
    amount: yup.number().required('Amount is required'),
    walletAddress: yup.string().required('QWallet address is required'),

});


interface props {
    item: {
        id: string,
        balance: number,
        amount: string,
        "name": string,
        "logo": string,
        "symbol": string,
        "network": string,
        "decimals": number,
        "address": string
    },
    textColor: string,
    lightTextColor: string,
    openSheet: () => void
    openRedeem: () => void
}

const WalletItem = ({item, textColor, lightTextColor, openSheet, openRedeem}: props) => {
    const {width} = useWindowDimensions()

    return (
        <>

            <View style={[{width}, styles.WalletItem
            ]}>
                <View style={styles.walletItemBody}>
                    <Text style={[styles.walletName, {
                        color: lightTextColor
                    }]}>
                        {item.name}
                    </Text>

                    <Text style={[styles.walletBalance, {
                        color: textColor
                    }]}>

                        {/* {parseFloat(String(item?.balance)).toFixed(8)}*/}
                        {item?.balance}
                    </Text>

                    <Text style={styles.walletName}>
                        {item.amount}
                    </Text>
                </View>

            </View>

            <View style={styles.buttonWrap}>


                {
                    item.name !== 'Points Balance' &&
                    <TouchableOpacity onPress={openSheet} style={styles.withdrawButton}>
                        <Text style={styles.btnText}>
                            Withdraw
                        </Text>
                    </TouchableOpacity>
                }
                {
                    item.name == 'Points Balance' &&
                    <TouchableOpacity onPress={openRedeem} style={styles.withdrawButton}>
                        <Text style={styles.btnText}>
                            Redeem
                        </Text>
                    </TouchableOpacity>
                }
            </View>
        </>
    )
}


export const getConversion = async (symbol: string, amount: string) => {
    let timeoutId: NodeJS.Timeout
    const requestOptions = {
        method: 'GET',
    };

    return Promise.race([
        fetch(`https://pro-api.coinmarketcap.com/v2/tools/price-conversion?CMC_PRO_API_KEY=c8d06b53-dfbe-4de8-9e0d-62fdb128cf8a&amount=${amount}&symbol=${symbol}`, requestOptions)
            .then(response => response.json()),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)

            //  clearTimeout(timeoutId)
        }).then(() => {
            clearTimeout(timeoutId)
        })

    ])
}

const Wallet = () => {

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new MyAnimated.Value(0)).current;
    const slideRef = useRef(null);
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const user = useAppSelector(state => state.user)
    const {responseMessage, responseType, responseState} = user
    const [walletData, setWalletData] = useState<any>([]);
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const [amount, setAmount] = useState('');
    const [USDPrice, setUSDPrice] = useState('');

    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);
    const redeemSheetRef = useRef<BottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => ['1%', '60%'], []);

    const openSheet = () => {
        bottomSheetRef.current?.snapToIndex(1)
    }
    const handleClosePress = () => {
        Keyboard.dismiss()
        if (Platform.OS == 'android') {
            bottomSheetRef.current?.snapToIndex(0)
        } else {
            bottomSheetRef.current?.close()
        }

    }


    // variables
    const snapPointsRedeem = useMemo(() => ['1%', '65%'], []);

    const openRedeem = () => {
        redeemSheetRef.current?.snapToIndex(1)
    }
    const handleClosePressRedeem = () => {
        Keyboard.dismiss()
        if (Platform.OS == 'android') {
            redeemSheetRef.current?.snapToIndex(0)
        } else {
            redeemSheetRef.current?.close()
        }

    }


    const {
        isLoading: loadingWallets,
        data,
        isSuccess,
        isRefetching,
        refetch
    } = useQuery(['getUserWallets'], getUserWallets, {

        onSuccess: (data) => {
            if (data.success) {


            }
        },
    })

    const nearBalance = data?.data?.find((wallet: { network: string; }) => wallet.network == 'near')

    const {
        isLoading: loadingTransactions,
        data: transactions,
        refetch: getTransactions
    } = useQuery(['getUserTransaction'], getUserTransaction, {})

    const {isLoading: loadingPoints, data: points, refetch: fetchPoints} = useQuery(['getUserPoints'], getUserPoints, {


    })


    useEffect(() => {
        if (!loadingPoints && !loadingWallets && data?.success && isSuccess) {
            setWalletData([
                ...data?.data,
                {
                    id: '2',
                    balance: points?.data?.totalPoint,
                    name: 'Points Balance',
                },
            ])
        }
    }, [data, points]);


    const {mutate, isLoading} = useMutation(['withdrawFromWallet'], withdrawFromWallet,

        {

            onSuccess: async (data) => {

                if (data.success) {
                    refetch()
                    handleClosePress()
                    getTransactions()


                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'success',
                        body:  data.message,
                    }))

                } else {
                    handleClosePress()


                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'error',
                        body:  data.message,
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
                    body:  err.message,
                }))
            },
            onSettled: () => {
                queryClient.invalidateQueries(['withdrawFromWallet']);
            }

        })


    const {mutate: redeemPointsNow, isLoading: redeeming} = useMutation(['redeemPoints'], redeemPoints,

        {

            onSuccess: async (data) => {

                if (data.success) {
                    refetch()
                    fetchPoints()
                    getTransactions()
                    handleClosePressRedeem()
                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'success',
                        body:  data.message,
                    }))
                } else {
                    handleClosePressRedeem()

                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'error',
                        body:  data.message,
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
                    body:  err.message,
                }))

            },
            onSettled: () => {
                queryClient.invalidateQueries(['redeemPoints']);
            }

        })


    const viewableItemsChanged = useRef(({viewableItems}) => {
        setCurrentIndex(viewableItems[0].index)
    }).current


    const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

    const renderItem = useCallback(({item}) => (
        <WalletItem lightTextColor={lightTextColor} textColor={textColor} openRedeem={openRedeem} openSheet={openSheet}
                    item={item}/>), [])
    const keyExtractor = useCallback((item: { id: any; }) =>
            item.id
        , [])


    const scrollForward = () => {
        if (currentIndex < walletData.length - 1) {
            slideRef.current.scrollToIndex({index: currentIndex + 1})
        }
        /* if (currentIndex < data?.data?.length - 1) {
             slideRef.current.scrollToIndex({index: currentIndex + 1})
         }*/

    }

    const scrollBackward = () => {
        /*if (currentIndex < data?.data?.length && currentIndex !== 0) {
            slideRef.current.scrollToIndex({index: currentIndex - 1})
        }*/

        if (currentIndex < walletData.length && currentIndex !== 0) {
            slideRef.current.scrollToIndex({index: currentIndex - 1})
        }

    }


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

            amount: '',
            walletAddress: ''

        },
        onSubmit: (values) => {
            const {amount, walletAddress} = values;

            const body = JSON.stringify({
                "token": "near",
                recipient: walletAddress,
                amount,

            })
            mutate(body)


        }
    });


    // renders
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

    useRefreshOnFocus(refetch)
    useRefreshOnFocus(getTransactions)




    useEffect(() => {
        getConversion('Near', amount).then((res) => {
            if (res.status.error_code == '0') {
                setUSDPrice(res.data[0].quote?.USD?.price.toFixed(2))
            }

        })
    }, [amount]);


    return (

        <>


            <SafeAreaView style={[styles.safeArea, {
                backgroundColor
            }
            ]}>
                <SwipeAnimatedToast/>
                <ScrollView
                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>


                    <View style={[styles.topDashboard, {
                        backgroundColor
                    }]}>
                        <NavBar title={"Wallet"}/>

                        {
                            !loadingWallets && data &&

                            <>
                                <TouchableOpacity disabled={currentIndex === 0} onPress={scrollBackward}
                                                  style={[styles.arrowLeft, {
                                                      backgroundColor: theme == 'light' ? Colors.primaryColor : '#fff',
                                                      // opacity: currentIndex === 0 ? 0.3 : 1,
                                                      left: 20,
                                                  }]}>
                                    <Ionicons name="ios-arrow-back-sharp" size={20}
                                              color={theme == 'light' ? "#fff" : "#333"}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={scrollForward}
                                                  disabled={currentIndex === walletData.length - 1}
                                                  style={[styles.arrowLeft, {
                                                      backgroundColor: theme == 'light' ? Colors.primaryColor : '#fff',
                                                      //opacity: currentIndex === data?.data?.length - 1 ? 0.3 : 1,
                                                      right: 20,
                                                  }]}>
                                    <Ionicons name="ios-arrow-forward" size={24}
                                              color={theme == 'light' ? "#fff" : "#333"}/>

                                </TouchableOpacity>
                            </>
                        }
                        <View style={styles.container}>

                            {

                                loadingWallets && <ActivityIndicator size={"small"} color={Colors.primaryColor}/>
                            }


                            {
                                !loadingWallets && data &&

                                <FlatList data={walletData}
                                          renderItem={renderItem}
                                          pagingEnabled
                                          keyExtractor={keyExtractor}
                                          showsHorizontalScrollIndicator={false}
                                          bounces={false}
                                          onScroll={MyAnimated.event([
                                              {nativeEvent: {contentOffset: {x: scrollX}}}
                                          ], {
                                              useNativeDriver: false
                                          })}
                                          onViewableItemsChanged={viewableItemsChanged}
                                          viewabilityConfig={viewConfig}
                                          scrollEventThrottle={32}
                                          ref={slideRef}
                                          horizontal/>

                            }

                            {/* {
                                !loadingWallets && data && currentIndex !== 1 &&
                                <TouchableOpacity onPress={openSheet} style={styles.withdrawButton}>
                                    <Text style={styles.btnText}>
                                        Withdraw
                                    </Text>
                                </TouchableOpacity>
                            }
                            {
                                !loadingWallets && data && currentIndex == 1 &&
                                <TouchableOpacity onPress={openRedeem} style={styles.withdrawButton}>
                                    <Text style={styles.btnText}>
                                        Redeem
                                    </Text>
                                </TouchableOpacity>
                            }*/}
                        </View>


                    </View>


                    <View style={styles.rowTitle}>
                        <Text style={[styles.titleTxt, {
                            color: textColor
                        }]}>
                            Recent Transactions
                        </Text>

                        <Entypo name="back-in-time" size={20} color={textColor}/>
                    </View>

                    <View style={styles.transactions}>
                        {
                            !loadingTransactions && transactions && transactions?.data?.length > 0 &&
                            transactions?.data.map((({hash, amount, network, type, createdAt}) => (
                                <Animated.View layout={Layout.easing(Easing.bounce).delay(20)}
                                               entering={FadeInDown} exiting={FadeOutDown}
                                               key={hash} style={styles.transactionCard}>
                                    <View style={[styles.transactionCardIcon, {
                                        backgroundColor: "#59C965"
                                    }]}>
                                        <FontAwesome name="exchange" size={20} color="#fff"/>
                                    </View>

                                    <View style={styles.transactionCardBody}>
                                        <Text style={[styles.transactionCardTitle, {
                                            color: textColor
                                        }]}>
                                            {amount} {network}
                                        </Text>
                                        <View style={styles.transactionCardBodyBottom}>
                                            <Text style={[styles.transactionCardTitle, {
                                                color: Colors.success
                                            }]}>
                                                {type}
                                            </Text>
                                            <Text style={[styles.transactionCardDate, {
                                                color: lightTextColor
                                            }]}>
                                                {dayjs(createdAt).format('DD/MM/YYYY h:mm A')}
                                            </Text>
                                        </View>
                                    </View>
                                </Animated.View>
                            )))

                        }
                        {/*           <View style={styles.transactionCard}>
                            <View style={[styles.transactionCardIcon, {
                                backgroundColor: "#59C965"
                            }]}>
                                <FontAwesome name="exchange" size={20} color="#fff"/>

                            </View>

                            <View style={styles.transactionCardBody}>
                                <Text style={[styles.transactionCardTitle, {
                                    color: textColor
                                }]}>
                                    1,000 CUSD
                                </Text>
                                <View style={styles.transactionCardBodyBottom}>
                                    <Text style={[styles.transactionCardTitle, {
                                        color: Colors.success
                                    }]}>
                                        Withdrawal failed
                                    </Text>
                                    <Text style={styles.transactionCardDate}>
                                        10/05/2022 at 11:37 AM
                                    </Text>
                                </View>
                            </View>
                        </View>*/}
                    </View>
                </ScrollView>
            </SafeAreaView>


            <BottomSheet
                handleIndicatorStyle={[{backgroundColor: theme == 'light' ? "#121212" : '#cccccc'}, Platform.OS == 'android' && {display: 'none'}]}
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                keyboardBehavior="interactive"
                backdropComponent={renderBackdrop}
                backgroundStyle={{
                    backgroundColor,
                }}

                style={{
                    paddingHorizontal: pixelSizeHorizontal(20)
                }}
            >


                <View style={styles.sheetHead}>


                    <Text style={[styles.sheetTitle, {
                        color: textColor
                    }]}>
                        Near Withdrawal
                    </Text>
                    {Platform.OS == 'android' && <TouchableOpacity onPress={handleClosePress}
                                                                   style={[styles.dismiss, {
                                                                       backgroundColor: theme == 'light' ? "#f8f8f8" : Colors.dark.background
                                                                   }]}>
                        <Ionicons name="close-sharp" size={20} color={textColor}/>
                    </TouchableOpacity>}
                </View>

                <View style={styles.sheetContainer}>
                    <BottomSheetTextInput
                        placeholder="Enter Amount"
                        label={"Amount"}
                        keyboardType={"decimal-pad"}
                        touched={touched.amount}
                        error={touched.amount && errors.amount}

                        onChangeText={(e) => {
                            handleChange('amount')(e);
                            setAmount(e)
                        }}
                        defaultValue={amount}
                        onBlur={(e) => {
                            handleBlur('amount')(e);

                        }}
                        value={values.amount}
                    />

                    <BottomSheetTextInput
                        placeholder="Enter NEAR Address"
                        label={"Address"}
                        keyboardType={"default"}
                        touched={touched.walletAddress}
                        error={touched.walletAddress && errors.walletAddress}

                        onChangeText={(e) => {
                            handleChange('walletAddress')(e);
                        }}
                        onBlur={(e) => {
                            handleBlur('walletAddress')(e);

                        }}
                        value={values.walletAddress}
                    />
                    {
                        USDPrice !== '' &&
                        <View style={styles.conversionRate}>
                            <Text style={[styles.label, {
                                color: textColor
                            }]}>
                                USD conversion:
                            </Text>

                            {
                                <Text style={[styles.label, {
                                    color: textColor
                                }]}>
                                    {amount} Near = {currencyFormatter('en-US', 'USD').format(+USDPrice)}
                                </Text>
                            }

                        </View>
                    }

                    <RectButton style={{marginTop: 30, width: widthPixel(200)}} onPress={() => handleSubmit()}>
                        {
                            isLoading ? <ActivityIndicator size="small" color={"#fff"}/> :

                                <Text style={styles.buttonText}>
                                    Continue

                                </Text>
                        }
                    </RectButton>
                </View>
            </BottomSheet>


            <BottomSheet
                ref={redeemSheetRef}
                index={0}

                snapPoints={snapPointsRedeem}
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

                <RedeemForm nearBalance={nearBalance?.balance} isLoading={redeeming} redeemNow={redeemPointsNow}
                            pointBalance={points?.data?.totalPoint}/>
            </BottomSheet>
        </>
    );
};


const styles = StyleSheet.create({

    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        //  backgroundColor: "#fff",
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {
        //  backgroundColor: Colors.background,
        backgroundColor: "#fff",
        width: '100%',
        alignItems: 'center'
    },
    container: {
        flex: 0.8,
        width: '100%',
        alignItems: 'center'
    },
    arrowLeft: {
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 40,
        top: 120,
        zIndex: 1,
        position: 'absolute',

    },
    topDashboard: {

        height: heightPixel(350),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomStartRadius: 50,
        borderBottomEndRadius: 50,
        shadowColor: "#212121",
        borderRadius: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,

        elevation: 3,
    },
    WalletItem: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: heightPixel(250)
    },
    walletItemBody: {
        width: '100%',
        height: heightPixel(150),
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    walletName: {
        color: Colors.light.text,
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(16),
    },
    walletBalance: {
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(36),
    },
    buttonWrap: {
        width: '100%',
        height: 60,
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    withdrawButton: {
        backgroundColor: Colors.primaryColor,
        width: widthPixel(135),
        height: heightPixel(45),
        borderRadius: 20,
        alignItems: 'center',

        justifyContent: 'center'
    },
    btnText: {
        color: "#fff",
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(16),
    },
    rowTitle: {
        marginTop: 15,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: heightPixel(45),
        flexDirection: 'row'
    },
    titleTxt: {
        color: Colors.light.text,
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(16),
    },
    transactions: {
        width: '100%',
        alignItems: 'center'
    },
    transactionCard: {

        height: heightPixel(80),
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    transactionCardIcon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    transactionCardBody: {

        height: '80%',
        width: '85%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly'
    },
    transactionCardBodyBottom: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    transactionCardDate: {
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandRegular,
        color: "#666666"
    },
    transactionCardTitle: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,

    },
    sheetHead: {
        // paddingHorizontal: pixelSizeHorizontal(20),
        height: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    conversionRate: {
        flexDirection: "row",
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    label: {
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(14)
    },
    redeemButton: {
        marginTop: 30,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
        alignItems: 'center',

    },
    sheetTitle: {
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
    },
    sheetContainer: {
        marginTop: 20,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
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


})

export default Wallet;
