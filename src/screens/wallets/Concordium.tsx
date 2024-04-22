import React, {SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Platform,
    ScrollView,
    Pressable,
    Linking, ActivityIndicator, Keyboard
} from 'react-native';
import {AntDesign, Entypo, Ionicons, Octicons} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useInfiniteQuery, useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import Colors from "../../constants/Colors";
import {createWalletIdentity, getCCDWallet, userNotifications, withdrawFromWallet} from "../../action/action";
import {RootStackScreenProps} from "../../../types";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetView
} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {IF} from "../../helpers/ConditionJsx";
import {WebView} from 'react-native-webview';
import {useRefreshOnFocus} from "../../helpers";
import {useFormik} from "formik";
import * as yup from "yup";
import AdvancedTextInput from "../../components/inputs/AdvancedTextInput";
import TextInput from "../../components/inputs/TextInput";
import {setResponse} from "../../app/slices/userSlice";


const formSchema = yup.object().shape({
    points: yup.number().required('Points amount is required'),
    walletAddress: yup.string().required('Wallet address is required'),


});


const Concordium = ({navigation}: RootStackScreenProps<'Concordium'>) => {


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

    const [points, setPoints] = useState('')
    const [walletAddress, setWalletAddress] = useState('')

    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const darkTextColor = theme == 'light' ? Colors.light.darkText : Colors.dark.text

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


    const bottomSheetRef = useRef<BottomSheetModal>(null);


    const handleClose = () => {
        bottomSheetRef?.current?.close()
    }
    // variables
    const snapPoints = useMemo(() => ["1", "45%"], []);


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


    const {data: ccdWallet, isLoading: isLoadingWallet, refetch} = useQuery(['getCCDwallet'], getCCDWallet)

    //  console.log(ccdWallet)
    const {mutate, isLoading} = useMutation(['createWalletIdentity'], createWalletIdentity, {
        onSuccess: (data) => {
            if (data.success) {
                navigation.navigate('BrowserView', {
                    url: data.data
                })
            }

        },
        onError: (error, variables, context) => {
            console.log(error)
        }


    })



    const {mutate:withdrawNow, isLoading:loadingWithdraw} = useMutation(['withdrawFromWallet'], withdrawFromWallet,

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
                queryClient.invalidateQueries(['withdrawFromWallet']);
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
                "token": "near"
            })

            withdrawNow({body})

        }
    });

    const startNow = () => {
        mutate()
        /*navigation.navigate('BrowserView',{
            url:'https://id-verifier.testnet.concordium.com/api/verify/v1/096cb60717e702e0643598330c5f47da2b2b5c3674985e55f0b816351938348e/909b612d6573c6f931ccd7940517ed3bf8192dd312e7000b6b0da61514413e1b03cca48e7c58d65cd644882b4bb245bdb9ff3d74a2ce7d266a553925bd027a0f'
        })*/
    }


    const maxAmount = () => {
        setPoints(ccdWallet?.data?.data?.ccdBalance)
        setFieldValue('points', ccdWallet?.data?.data?.ccdBalance)
    }
    useRefreshOnFocus(refetch)

    return (

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
                            <Text style={styles.pointsText}>20000</Text>
                        </View>
                    </View>

                    <View style={styles.rightButton}>

                        <ImageBackground style={styles.streaKIcon} resizeMode={'contain'}
                                         source={require('../../assets/images/streakicon.png')}>
                            <Text style={styles.streakText}> 200</Text>
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
                            Concordium
                        </Text>
                    </TouchableOpacity>


                </View>

                {isLoadingWallet &&
                    <ActivityIndicator color={Colors.primaryColor} size='small'/>}

                {!isLoadingWallet &&
                    <IF condition={ccdWallet?.success}>


                        <View style={styles.dashboardBox}>
                            <Text style={styles.cardText}>
                                $CCD
                            </Text>

                            <View style={[styles.bottomInfo, {
                                height: 30,
                            }]}>
                                <Text style={styles.cardTitle}>
                                    Concordium
                                </Text>
                                <Text style={styles.cardTitle}>
                                    {ccdWallet?.data?.data?.ccdBalance}

                                </Text>
                            </View>

                            <View style={[styles.bottomInfo, {
                                height: 15,
                            }]}>
                                <Text style={styles.cardText}>
                                    Value: {ccdWallet?.data?.data?.ccdValue}
                                </Text>

                                <Text style={styles.cardText}>
                                    +4.0%
                                </Text>
                            </View>
                        </View>


                        {/*     <Pressable onPress={handleOpen} style={styles.copyWrap}>
                    <Text style={[styles.copyText, {
                        color: Colors.primaryColor,
                        fontFamily: Fonts.quicksandMedium
                    }]}>
                        View Private Key
                    </Text>

                    <TouchableOpacity activeOpacity={0.8} style={styles.copyBtn}>


                        <AntDesign name="arrowright" size={16} color={Colors.primaryColor}/>
                    </TouchableOpacity>
                </Pressable>*/}

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


                        <View style={styles.transactions}>


                            <Animated.View entering={FadeInDown.delay(200)
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

                        </View>

                    </IF>

                }


                {!isLoadingWallet &&
                    <IF condition={!ccdWallet?.success}>

                        <View style={styles.walletContentContainer}>


                            <Text style={styles.walletTitle}>
                                Welcome to your Wallet
                            </Text>
                            <Text style={styles.walletSheetContentText}>
                                Complete quick KYC to unlock wallet fully. Earn up to $5 afterward. Your wallet can
                                receive
                                Gateway Points, Tokens & NFTs as you explore. Necessary to prevent fraud.
                            </Text>

                            <Pressable onPress={startNow} disabled={isLoading} style={styles.claimBtn}>
                                {
                                    isLoading ? <ActivityIndicator color={"#fff"} size={'small'}/>
                                        :
                                        <Text style={styles.claimBtnText}>
                                            Create wallet
                                        </Text>
                                }
                            </Pressable>
                        </View>
                    </IF>
                }

            </ScrollView>


            <BottomSheetModalProvider>

                <BottomSheetModal
                    backdropComponent={renderBackdrop}
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    // add bottom inset to elevate the sheet
                    bottomInset={140}
                    index={1}
                    // set `detached` to true
                    detached={true}
                    style={styles.sheetContainer}
                >
                    <BottomSheetView style={styles.contentContainer}>
                        <View style={[styles.sheetHead, {
                            height: 40
                        }]}>


                            <TouchableOpacity onPress={handleClose}
                                              style={[styles.dismiss, {}]}>
                                <Ionicons name="close-sharp" size={20} color={"#11192E"}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.sheetTitle}>
                            Private Key
                        </Text>
                        <View style={styles.keyWrap}>
                            <Text style={styles.sheetContentText}>
                                autjrhet4asrydmufo9oiuytr54wasdcvgbnmjuygfdsawq223490oijhvfdsaqavgbe5a456
                            </Text>
                        </View>


                        <Pressable style={styles.claimBtn}>
                            <Text style={styles.claimBtnText}>
                                Copy
                            </Text>
                        </Pressable>
                    </BottomSheetView>


                </BottomSheetModal>
            </BottomSheetModalProvider>


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
                        balanceText={`${ccdWallet?.data?.data?.ccdBalance} Points`}
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

                            <Text style={[styles.buttonText,{
                                color:"#fff"
                            }]}>
                                Withdraw

                            </Text>
                    }
                </TouchableOpacity>


            </BottomSheet>


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
        backgroundColor: "#AE04D9",
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
        width: 45,
        alignItems: 'center',
        justifyContent: 'flex-end',
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
    sheetContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 40,
    },
    contentContainer: {
        paddingHorizontal: pixelSizeHorizontal(20),
        alignItems: 'center',
        justifyContent: 'space-between',
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
    dismiss: {


        borderRadius: 30,
        height: 30,
        width: 30,
        alignItems: "center",
        justifyContent: "center"

    },
    claimBtn: {
        height: 45,

        width: widthPixel(235),
        borderRadius: 30,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',

        justifyContent: 'center',
    },
    claimBtnText: {
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quicksandSemiBold
    },
    keyWrap: {
        marginVertical: 20,
        borderColor: "#CCCCCC",
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: heightPixel(110),
    },


    walletContentContainer: {
        height: heightPixel(500),
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    walletTitle: {
        marginVertical: 10,
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
    },
    walletSheetContentText: {
        color: "#5A5A5A",
        fontSize: fontPixel(16),
        lineHeight: 22,
        textAlign: 'center',
        marginVertical: 15,
        fontFamily: Fonts.quicksandMedium,
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

export default Concordium;
