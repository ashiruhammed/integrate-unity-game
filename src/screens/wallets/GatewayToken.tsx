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
    ActivityIndicator, Keyboard
} from 'react-native';
import {AntDesign, Entypo, Ionicons, Octicons} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Colors from "../../constants/Colors";
import {
    getCCDWallet,
    getUserDashboard,
    userNotifications, walletTransactions,
    withdrawFromGateWallet,
    withdrawFromWallet
} from "../../action/action";
import {RootStackScreenProps} from "../../../types";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import BottomSheet, {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import AdvancedTextInput from "../../components/inputs/AdvancedTextInput";
import TextInput from "../../components/inputs/TextInput";
import {setResponse} from "../../app/slices/userSlice";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {useFormik} from "formik";
import * as yup from "yup";
import dayjs from "dayjs";
import {truncateString, useRefreshOnFocus} from "../../helpers";
import * as Clipboard from "expo-clipboard";


const formSchema = yup.object().shape({
    points: yup.number().required('Points amount is required'),
    walletAddress: yup.string().required('Wallet address is required'),


});


const GatewayToken = ({navigation}: RootStackScreenProps<'GatewayToken'>) => {


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
    const [points, setPoints] = useState('')
    const [walletAddress, setWalletAddress] = useState('')



    const withdrawSheetRef = useRef<BottomSheet>(null);
    // variables
    const snapPointsRedeem = useMemo(() => ['1%', '65%'], []);

    const handleOpenWithdraw = () => {
        withdrawSheetRef.current?.snapToIndex(1)
    }
    const handleClosePressWithdraw = () => {
        Keyboard.dismiss()
        if (Platform.OS == 'android') {
            withdrawSheetRef.current?.snapToIndex(0)
        } else {
            withdrawSheetRef.current?.close()
        }

    }

       const [copied, setCopied] = useState(false)
    const copyToClipboard = async (copyText: string) => {
        await Clipboard.setStringAsync(copyText);
        setCopied(true)
    };

    const {
        mutate: withdrawNow,
        isLoading: loadingWithdraw
    } = useMutation(['withdrawFromGateWallet'], withdrawFromGateWallet,

        {

            onSuccess: async (data) => {

                if (data.success) {
                    refetch()
                    handleClosePressWithdraw()
                    //  getTransactions()

                    dispatch(setResponse({
                        responseMessage: data.message,
                        responseState: true,
                        responseType: 'success',
                    }))


                } else {
                    handleClosePressWithdraw()
                    dispatch(setResponse({
                        responseMessage: data.message,
                        responseState: true,
                        responseType: 'error',
                    }))

                    /*  navigation.navigate('EmailConfirm', {
                          email:contentEmail
                      })*/


                }
            },

            onError: (err) => {
                dispatch(setResponse({
                    responseMessage: err.message,
                    responseState: true,
                    responseType: 'error',
                }))


            },
            onSettled: () => {
                queryClient.invalidateQueries(['withdrawFromGateWallet']);
            }

        })


    //   console.log(ccdWallet)

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

            points: '',
            walletAddress: '',


        },
        onSubmit: (values) => {
            const {points, walletAddress} = values;

            const body = JSON.stringify({
                amount: points,
                "recipient": walletAddress,
                "token": "ccd"
            })

            withdrawNow(body)

        }
    });


    const {data: transactions, isLoading: loadingTransactions,refetch:fetchTransaction} = useQuery(['GatewalletTransactions'], walletTransactions)

    const {data: ccdWallet, isLoading: isLoadingWallet, refetch} = useQuery(['getCCDwallet'], getCCDWallet)

    const {
        isLoading: loadingUser,
        data: userDashboard,
        refetch: fetchDashboard
    } = useQuery(['getUserDashboard'], getUserDashboard, {})

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

    const maxAmount = () => {
        setPoints(ccdWallet?.data?.gateBalance.toString())
        setFieldValue('points', ccdWallet?.data?.gateBalance)
    }

    useRefreshOnFocus(fetchTransaction)


    return (
        <>
            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>

                <ScrollView

                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>
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
                                    notifications?.pages[0]?.data?.result.length > 0 &&
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
                            }]}>
                                Gateway Token
                            </Text>
                        </TouchableOpacity>


                    </View>


                    <View style={styles.dashboardBox}>
                        <Text style={styles.cardText}>
                            $GATE
                        </Text>

                        <View style={[styles.bottomInfo, {
                            height: 30,
                        }]}>
                            <Text style={styles.cardTitle}>
                                Gateway Token
                            </Text>
                            <Text style={styles.cardTitle}>
                                {!ccdWallet?.data?.gateBalance  ? '0' : ccdWallet?.data?.gateBalance}
                            </Text>
                        </View>

                        <View style={[styles.bottomInfo, {
                            height: 15,
                        }]}>
                            <Text style={styles.cardText}>
                                Value: {!ccdWallet?.data?.gateValue ? '0' : ccdWallet?.data?.gateValue}
                            </Text>

                            {/* <Text style={styles.cardText}>
                            +4.0%
                        </Text>*/}
                        </View>
                    </View>

                    {
                        !isLoadingWallet && ccdWallet?.data !== null && ccdWallet?.success &&

                    <View style={styles.copyWrap}>
                        <Text style={[styles.copyText, {
                            color: "#333333",
                            fontFamily: Fonts.quicksandMedium
                        }]}>
                            {ccdWallet?.data?.address ? truncateString(ccdWallet?.data?.address, 30) : ''}
                        </Text>

                        <TouchableOpacity onPress={() => copyToClipboard(ccdWallet?.data?.address)}
                                          activeOpacity={0.8} style={styles.copyBtn}>
                            <Ionicons name="copy-outline" size={16} color={Colors.primaryColor}/>
                            {copied ? <Text style={styles.copyText}>
                                Copied
                            </Text> : <Text style={styles.copyText}>Copy</Text>}
                        </TouchableOpacity>
                    </View>
                    }
                    <View style={styles.buttonWrap}>

                        <Pressable onPress={handleOpenWithdraw} style={[styles.dahButton, {
                            backgroundColor: "#FDDCDC"
                        }]}>
                            <Text style={[styles.buttonText, {
                                color: "#E01414"
                            }]}>
                                Withdraw
                            </Text>
                        </Pressable>


                    </View>


                    <Pressable onPress={()=>navigation.navigate('GateTokenTransactions')} style={styles.rowTitle}>
                        <Text style={[styles.titleTxt, {
                            color: textColor
                        }]}>
                            Transactions
                        </Text>

                        <Text>
                            See all
                        </Text>
                    </Pressable>


                    <View style={styles.transactions}>

                        {!loadingTransactions && transactions && transactions?.data &&
                            transactions?.data.filter((transaction: { token: string; }) => transaction.token === 'GATE').map((({token,hash,type,createdAt,amount})=>(
                        <Animated.View key={hash} entering={FadeInDown.delay(200)
                            .randomDelay()
                        } exiting={FadeOutDown} style={styles.breakDownCard}>
                            <View style={[styles.boxSign, {
                                backgroundColor: Colors.errorTint
                            }]}>
                                <AntDesign name="arrowdown" size={20} style={{transform: [{rotate: "40deg"}]}}
                                           color={Colors.errorRed}/>
                            </View>

                            <View style={styles.boxTransactionBody}>

                                <View style={styles.boxTransactionBodyLeft}>
                                    <Text style={styles.transactionTitle}>
                                        {type}
                                    </Text>
                                    <Text style={styles.transactionDate}>
                                        {dayjs(createdAt).format('ddd, DD MMM YYYY')}
                                    </Text>
                                </View>

                                <View style={[styles.boxTransactionBodyLeft, {
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start'
                                }]}>
                                    <Text style={styles.transactionTitle}>
                                        {amount} {token}
                                    </Text>

                                </View>
                            </View>


                        </Animated.View>
                                )))
                        }
                    </View>
                </ScrollView>

            </SafeAreaView>

            <BottomSheet
                ref={withdrawSheetRef}
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


                <View style={styles.sheetHead}>


                    <Text style={[styles.sheetTitle, {
                        fontFamily: Fonts.quickSandBold,
                        color: textColor
                    }]}>
                        Withdraw Token
                    </Text>


                    <TouchableOpacity onPress={handleClosePressWithdraw}
                                      style={[styles.dismiss, {
                                          backgroundColor: theme == 'light' ? "#f8f8f8" : Colors.dark.background
                                      }]}>
                        <Ionicons name="close-sharp" size={20} color={textColor}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.sheetContainer}>
                    <AdvancedTextInput

                        placeholder="0.00"
                        label={"Amount"}
                        keyboardType={"number-pad"}
                        touched={touched.points}
                        error={touched.points && errors.points}
                        balanceText={`${!ccdWallet?.data?.gateBalance ? '0' : ccdWallet?.data?.gateBalance} Points`}
                        onChangeText={(e) => {
                            handleChange('points')(e);
                            setPoints(e)
                        }}
                        defaultValue={points}
                        actionMax={maxAmount}
                        onBlur={(e) => {
                            handleBlur('points')(e);

                        }}
                        value={values.points}
                    />


                    <TextInput placeholder={'Address to withdraw to'} value={values.walletAddress}
                               onBlur={(e) => {
                                   handleBlur('walletAddress')(e);

                               }}
                               touched={touched.walletAddress}
                               error={touched.walletAddress && errors.walletAddress}
                               onChangeText={(e) => {
                                   handleChange('walletAddress')(e);
                                   setWalletAddress(e)
                               }}/>


                </View>


                <TouchableOpacity disabled={loadingWithdraw || !isValid} style={[styles.redeemButton, {
                    backgroundColor: isValid ? Colors.primaryColor : Colors.border
                }]} onPress={() => handleSubmit()}>
                    {
                        loadingWithdraw ? <ActivityIndicator size="small" color={"#fff"}/> :

                            <Text style={[styles.buttonText, {
                                color: "#fff"
                            }]}>
                                Withdraw

                            </Text>
                    }
                </TouchableOpacity>


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
        backgroundColor: "#D9049D",
        width: widthPixel(350),
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
    copyWrap: {
        marginTop: 30,
        width: widthPixel(350),
        height: 50,
        borderRadius: 15,
        backgroundColor: "#eee",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: pixelSizeHorizontal(20),
        flexDirection: 'row'
    },
    copyBtn: {
        width: 55,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    copyText: {
        marginLeft: 5,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandRegular,
        color: Colors.primaryColor
    },
    buttonWrap: {
        marginVertical: pixelSizeVertical(15),
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    dahButton: {
        marginHorizontal: pixelSizeHorizontal(15),
        height: 40,
        width: widthPixel(350),
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',

    },
    buttonText: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold
    },
    rowTitle: {

        width: '90%',
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
        justifyContent: 'space-between',
        flexDirection: 'row'
    }
    ,
    sheetTitle: {

        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
    },
    sheetContentText: {
        color: "#000000",
        fontSize: fontPixel(16),
        lineHeight: 25,
        fontFamily: Fonts.quicksandMedium,
    },
    sheetContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 40,
    },
    dismiss: {


        borderRadius: 30,
        height: 30,
        width: 30,
        alignItems: "center",
        justifyContent: "center"

    },
    redeemButton: {
        marginTop: 30,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
        alignItems: 'center',

    },

})

export default GatewayToken;
