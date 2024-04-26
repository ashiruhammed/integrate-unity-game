import React, {useCallback, useEffect, useMemo, useRef} from 'react';

import {Text, View, StyleSheet, Platform, ActivityIndicator, TouchableOpacity} from 'react-native';
import Toast from "../../components/Toast";
import {SafeAreaView} from "react-native-safe-area-context";
import {logoutUser, setResponse, unSetResponse} from "../../app/slices/userSlice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import Colors from "../../constants/Colors";
import NavBar from "../../components/layout/NavBar";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {Entypo, FontAwesome5, Ionicons} from "@expo/vector-icons";
import {RectButton} from "../../components/RectButton";
import {deleteAccountNow, requestDeleteAccount} from "../../action/action";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import BottomSheet, {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import PhoneInputText from "../../components/inputs/PhoneInputText";
import {useFormik} from "formik";
import * as yup from "yup";
import PinInput from "../../components/inputs/PinInput";
import {addNotificationItem, cleanData} from "../../app/slices/dataSlice";
import SwipeAnimatedToast from "../../components/toasty";


const formSchema = yup.object().shape({

    authCode: yup.string().required('Pin is required').min(6, 'Must not be less than 6'),
})
const DeleteAccount = () => {

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const user = useAppSelector(state => state.user)
    const {
        responseMessage,
        responseType,
        responseState,
        userData: {
            email
        }
    } = user


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


    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text


    const logout = () => {

        queryClient.invalidateQueries()
        SecureStore.setItemAsync('Gateway-Token', '')

        //await queryClient.removeQueries()

        dispatch(logoutUser())
        dispatch(cleanData())

    }


    const {isLoading, mutate} = useMutation(['requestDeleteAccount'], requestDeleteAccount, {
        onSuccess: async (data) => {

            if (data.success) {

                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'success',
                    body:  data.message,
                }))
                openSheet()

            } else {


                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

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
            queryClient.invalidateQueries(['requestDeleteAccount']);
        }

    })

    const {isLoading:loading, mutate:deleteNow} = useMutation(['DeleteAccountNow'], deleteAccountNow, {
        onSuccess: async (data) => {

            if (data.success) {
              //logout
                logout()
            } else {


                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

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
            queryClient.invalidateQueries(['deleteAccountNow']);
        }

    })






    const {
        handleChange, handleSubmit, handleBlur,
        values,
        isValid,
        errors,
        touched,
        isSubmitting,
        setSubmitting,
        setFieldValue
    } = useFormik({
        validationSchema: formSchema,
        initialValues: {
            authCode: '',
        },
        onSubmit: (values) => {
            const {authCode} = values;
            /* navigation.navigate('PhoneNumberConfirm', {
                 phoneNumber: '243242242'
             })*/
            const body = JSON.stringify({

                "otpCode": authCode
            })

            deleteNow(body)

        }
    });

    const requestDelete = () => {
        mutate()
    }




    return (
        <>


            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
                <SwipeAnimatedToast/>
                <KeyboardAwareScrollView
                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>
                    <NavBar title={"Delete account"}/>


                    <View style={styles.topDetails}>
                        <Text style={[styles.title, {
                            color: textColor
                        }]}>
                            If you choose to proceed to delete your account, you will lose
                        </Text>

                    </View>
                    <View style={styles.list}>
                        <Entypo name="dot-single" size={20} color="black"/>
                        <Text style={[styles.bodyText, {
                            color: textColor
                        }]}>
                            All your progress, upvotes and activities
                        </Text>
                    </View>
                    <View style={styles.list}>
                        <Entypo name="dot-single" size={20} color={textColor}/>
                        <Text style={[styles.bodyText, {
                            color: textColor
                        }]}>
                            All your points
                        </Text>
                    </View>

                    <View style={styles.list}>
                        <Entypo name="dot-single" size={20} color={textColor}/>
                        <Text style={[styles.bodyText, {
                            color: textColor
                        }]}>
                            All your Badges
                        </Text>
                    </View>

                    <View style={styles.list}>
                        <Entypo name="dot-single" size={20} color={textColor}/>
                        <Text style={[styles.bodyText, {
                            color: textColor
                        }]}>
                            All your NFTs
                        </Text>
                    </View>

                    <View style={styles.list}>
                        <Entypo name="dot-single" size={20} color={textColor}/>
                        <Text style={[styles.bodyText, {
                            color: textColor
                        }]}>
                            All your created and joined communities
                        </Text>
                    </View>

                    <View style={styles.list}>
                        <Entypo name="dot-single" size={20} color={textColor}/>
                        <Text style={[styles.bodyText, {
                            color: textColor
                        }]}>
                            All your conversations
                        </Text>
                    </View>

                    <View style={styles.list}>
                        <Entypo name="dot-single" size={20} color={textColor}/>
                        <Text style={[styles.bodyText, {
                            color: textColor
                        }]}>
                            All your crypto assets
                        </Text>
                    </View>
                    <View style={styles.list}>
                        <Entypo name="dot-single" size={20} color={textColor}/>
                        <Text style={[styles.bodyText, {
                            color: textColor
                        }]}>
                            All your subscriptions
                        </Text>
                    </View>

                </KeyboardAwareScrollView>

                <RectButton style={styles.button} onPress={requestDelete}>
                    {
                        isLoading ? <ActivityIndicator size='small' color="#fff"/>
                            :
                            <Text style={styles.btnText}>
                                Continue

                            </Text>
                    }
                </RectButton>
            </SafeAreaView>

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
                        Enter OTP
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

                        <PinInput value={values.authCode}
                                  codeLength={6} cellSize={36} cellSpacing={14}


                                  cellStyle={[styles.cellStyle, {
                                      borderColor: errors.authCode ? Colors.errorRed : Colors.border,
                                  }
                                  ]}
                                  containerStyle={{
                                      height: 60,
                                      width: '100%',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                  }}
                                  cellStyleFocused={{
                                      borderColor: "#333",
                                      borderWidth: 2,
                                  }}
                                  onFocus={() => {

                                  }}
                                  textStyle={{

                                      color: Colors.light.text,
                                      fontSize: fontPixel(23),
                                      fontFamily: Fonts.quickSandBold
                                  }}
                                  keyboardType={'numeric'}
                                  MaskDelay={200}
                                  onTextChange={(text) => {
                                      setFieldValue('authCode', text)
                                  }}

                                  restrictToNumbers={false}/>


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
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {
        //  backgroundColor: Colors.background,
        backgroundColor: "#fff",
        width: '100%',
        alignItems: 'center'
    },
    topDetails: {

        paddingHorizontal: pixelSizeHorizontal(15),
        width: '100%',
        height: heightPixel(80)
    },
    title: {
        fontFamily: Fonts.quicksandSemiBold,
        fontSize: fontPixel(16),
        lineHeight: 22,
    },
    cardTopLeft: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',

    },
    cardTopLeftText: {
        marginLeft: 5,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium
    },
    list: {

        // flexWrap:'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '90%',
        minHeight: heightPixel(40),
        paddingVertical: pixelSizeVertical(10)


    },
    bodyText: {
        marginVertical: pixelSizeVertical(5),
        width: '95%',
        fontFamily: Fonts.quicksandRegular,
        fontSize: fontPixel(14),
        color: Colors.light.text
    },
    button: {
        width: widthPixel(200),
        marginTop: 30,
        marginBottom: 50,
    },
    btnText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
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
    cellStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: heightPixel(50),
        width: widthPixel(50),
        borderWidth: 1,
    },
})

export default DeleteAccount;
