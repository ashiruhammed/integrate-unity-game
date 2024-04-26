import React, {useEffect, useState} from 'react';

import {Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, ActivityIndicator} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {AntDesign} from "@expo/vector-icons";

import Colors from "../../constants/Colors";
import {Fonts} from "../../constants/Fonts";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import {RectButton} from "../../components/RectButton";
import PinInput from "../../components/inputs/PinInput";
import * as yup from "yup";
import {useFormik} from "formik";
import {AuthStackScreenProps} from "../../../types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {confirmEmail, getUser, requestCode} from "../../action/action";
import {useAppDispatch, useAppSelector} from "../../app/hooks";

import {setAuthenticated, updateUserInfo} from "../../app/slices/userSlice";

import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import SwipeAnimatedToast from "../../components/toasty";
import {addNotificationItem} from "../../app/slices/dataSlice";


const height = Dimensions.get('window').height
const formSchema = yup.object().shape({

    authCode: yup.string().required('Pin is required').min(6, 'Must not be less than 4'),
})

const EmailConfirm = ({route, navigation}: AuthStackScreenProps<'EmailConfirm'>) => {


    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const {email} = route.params
    const [countDown, setCountDown] = useState(0);
    const [counter, setCounter] = useState(10);
    const user = useAppSelector(state => state.user)
    const {responseMessage, responseType, responseState} = user



    const {isLoading: loadingUser, mutate:fetchUser} = useMutation(['user-data'], getUser, {
        onSuccess: (data) => {
            if (data.success) {

                dispatch(updateUserInfo(data.data))
                dispatch(setAuthenticated({
                    isAuthenticated: true
                }))

            }
        },
    })


    const {mutate: resendCodeNow, isLoading: sending} = useMutation(['requestCode'], requestCode, {
        onSuccess: (data) => {

            if (data.success) {

                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'success',
                    body: data.message,
                }))

            } else {


                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: data.message,
                }))
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['requestCode']);
        }
    })
    const {mutate, isLoading} = useMutation(['confirmEmail'], confirmEmail, {
        onSuccess: async (data) => {

            if (data.success) {

                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'success',
                    body: data.message,
                }))
                 SecureStore.setItemAsync('Gateway-Token', data.data.token).then(() => {
                    fetchUser()
                })

            } else {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)


                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: data.message,
                }))
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['confirmEmail']);
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
                email:email.toLowerCase(),
                "otpCode": authCode
            })


            mutate(body)
        }
    });

    const goBack = () => {
        navigation.goBack()
    }




    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    const resend = () => {
        const body = JSON.stringify({
            email: email.toLowerCase(),
        })
        resendCodeNow(body)
        setCounter(10)
    }






    return (

        <>

            <SafeAreaView style={styles.safeArea}>

                <SwipeAnimatedToast/>

                {
                    loadingUser &&
                    <ActivityIndicator size="large" color={Colors.primaryColor}
                                       style={[StyleSheet.absoluteFill, {
                                           zIndex: 1,
                                           backgroundColor: 'rgba(0,0,0,0.1)'
                                       }]}/>
                }
                <KeyboardAwareScrollView scrollEnabled
                                         style={{
                                             width: '100%',
                                         }}
                                         showsVerticalScrollIndicator={false}
                                         showsHorizontalScrollIndicator={false}
                                         contentContainerStyle={
                                             styles.container
                                         }>
                    <View style={styles.topWithLogo}>

                        <View style={styles.imageWrap}>


                            <Image source={require('../../assets/images/iconBee.png')} style={[
                                styles.image,
                                {resizeMode: 'contain'}
                            ]}/>
                        </View>
                    </View>

                    <View style={styles.authContainer}>
                        <View style={styles.topBar}>
                            <TouchableOpacity onPress={goBack} style={styles.backBtn}>


                                <AntDesign name="arrowleft" size={24} color="#848484"/>
                                <Text style={styles.backTxt}>
                                    Back
                                </Text>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>
                                Let’s verify your email
                                address
                            </Text>
                        </View>
                        <View style={styles.inputWrap}>
                            <View style={[styles.resendMessage, {
                                height: heightPixel(80),
                                justifyContent: 'flex-start'
                            }]}>
                                <Text style={styles.label}>
                                    Enter the 6-digit code sent to you at {email} <Text style={{
                                    color: Colors.primaryColor
                                }}>
                                    Change email</Text>
                                </Text>
                            </View>
                            <PinInput value={values.authCode}
                                      codeLength={6} cellSize={36} cellSpacing={14}

                                      autoFocus={true}

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


                        </View>


                        <View style={styles.resendMessage}>
                            <Text style={styles.resendMessageTxt}>
                                I haven’t received a code <Text disabled={counter !== 0} onPress={resend} style={[{
                                    color:counter == 0 ? Colors.primaryColor : "#000",
                                fontFamily: Fonts.quickSandBold
                            }]}>Resend </Text>
                                (0:{counter})
                            </Text>
                        </View>
                        <RectButton disabled={!isValid} style={{
                            width: widthPixel(200),
                            marginTop: 40,
                        }} onPress={() => handleSubmit()}>
                            {
                                isLoading ? <ActivityIndicator size='small' color="#fff"/>
                                    :
                                    <Text style={styles.buttonText}>
                                        Continue

                                    </Text>
                            }
                        </RectButton>

                    </View>


                </KeyboardAwareScrollView>
            </SafeAreaView>
        </>
    );
};


const styles = StyleSheet.create({

    safeArea: {
        width: '100%',
        flex: 1,

        alignItems: 'center',
        backgroundColor: Colors.tintColor,

    },
    container: {
        width: '100%',


        //  backgroundColor: "#FFFFFF",
    },
    topWithLogo: {
        width: '100%',
        //   flex:0.15,
        height: 100
    },
    imageWrap: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: heightPixel(90)
    },
    image: {
        height: '100%',
        width: '90%',
        justifyContent: 'center'
    },
    authContainer: {
        zIndex: 1,
        height: height - 100,
        bottom: 0,
        paddingHorizontal: pixelSizeHorizontal(20),
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: "#fff",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        alignItems: 'center',
        padding: 20
    },
    topBar: {

        width: '100%',
        height: heightPixel(60),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    backBtn: {
        width: 70,
        height: 40,
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    backTxt: {
        marginLeft: 8,
        fontSize: fontPixel(16),
        color: Colors.light.tintTextColor,
        fontFamily: Fonts.quicksandRegular
    },
    titleContainer: {
        width: '100%',
        height: heightPixel(70),
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    titleText: {
        width: '70%',
        fontSize: fontPixel(24),
        color: Colors.light.text,
        lineHeight: heightPixel(35),
        fontFamily: Fonts.quicksandSemiBold
    },
    inputWrap:
        {

            marginTop: 25,
            height: heightPixel(145),
            width: '100%',

            justifyContent: "flex-start",
        },
    label: {
        width: '100%',
        marginBottom: 15,
        lineHeight: heightPixel(25),
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
    },
    cellStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: heightPixel(50),
        width: widthPixel(50),
        borderWidth: 1,
    },
    resendMessage: {
        width: '100%',
        height: heightPixel(50),
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    resendMessageTxt: {
        color: "#333333",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandRegular,
    },
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    }

})

export default EmailConfirm;
