import React, {useEffect} from 'react';

import {Text, View, StyleSheet, Platform, ActivityIndicator} from 'react-native';
import Toast from "../../components/Toast";
import {SafeAreaView} from "react-native-safe-area-context";
import {setResponse, unSetResponse, updateUserInfo} from "../../app/slices/userSlice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Colors from "../../constants/Colors";
import NavBar from "../../components/layout/NavBar";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import * as yup from "yup";
import {useFormik} from "formik";
import PinInput from "../../components/inputs/PinInput";
import {Fonts} from "../../constants/Fonts";
import {RootStackScreenProps} from "../../../types";
import {RectButton} from "../../components/RectButton";
import {getUser, requestPhoneVerification, verifyPhone} from "../../action/action";


const formSchema = yup.object().shape({

    phoneOtpCode: yup.string().required('Otp Code number is required'),


});


const ConfirmPhonenumber = ({navigation, route}: RootStackScreenProps<'ConfirmPhonenumber'>) => {

    const {phone} = route.params
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const user = useAppSelector(state => state.user)
    const {responseMessage, responseType, responseState, userData} = user
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const [counter, setCounter] = React.useState(10);
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text


    const {isLoading: loadingUser, refetch: fetchUser} = useQuery(['user-data'], getUser, {
        onSuccess: (data) => {
            if (data.success) {

                dispatch(updateUserInfo(data.data))

            }
        },
    })

    const {isLoading, mutate} = useMutation(['verifyPhone'], verifyPhone, {
        onSuccess: (data) => {

                if (data.success) {
                    fetchUser()

                    dispatch(setResponse({
                        responseMessage: data.message,
                        responseState: true,
                        responseType: 'success',
                    }))
                    navigation.navigate('Dashboard')
                } else {
                    dispatch(setResponse({
                        responseMessage: data.message,
                        responseState: true,
                        responseType: 'error',
                    }))
                }


        },
        onSettled: () => {
            queryClient.invalidateQueries(['verifyPhone'])
        }
    })


    const {isLoading: loading, mutate: resendCodeNow} = useMutation(['requestPhoneVerification'],requestPhoneVerification,{
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
            queryClient.invalidateQueries(['requestPhoneVerification']);
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


            phoneOtpCode: '',


        },
        onSubmit: (values) => {
            const {phoneOtpCode,} = values;

            const body = JSON.stringify({
                phoneOtpCode

            })
            mutate(body)
        }
    });


    const resend = () => {
        const body = JSON.stringify({
            phone: !userData?.phone ? phone : userData?.phone,
        })
        resendCodeNow(body)
        setCounter(10)
    }


    useEffect(() => {
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);


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
        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
            <Toast message={responseMessage} state={responseState} type={responseType}/>
            <KeyboardAwareScrollView
                style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                backgroundColor
            }]} scrollEnabled
                showsVerticalScrollIndicator={false}>
                <NavBar title={"Verify Phone"}/>




                <View style={styles.authContainer}>

                    <View style={[styles.resendMessage, {
                        height: heightPixel(80),
                        justifyContent: 'flex-start'
                    }]}>
                        <Text style={[styles.label,{
                            color:textColor
                        }]}>
                            Enter the 6-digit code sent to you at {!userData?.phone ? phone : userData?.phone}
                        </Text>
                    </View>
                    <PinInput value={values.phoneOtpCode}
                              codeLength={6} cellSize={36} cellSpacing={14}

                              autoFocus={true}

                              cellStyle={[styles.cellStyle, {
                                  borderColor: errors.phoneOtpCode ? Colors.errorRed : Colors.border,
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
                                  setFieldValue('phoneOtpCode', text)
                              }}

                              restrictToNumbers={false}/>
                    <View style={styles.resendMessage}>
                        <Text style={[styles.resendMessageTxt,{
                            color:textColor
                        }]}>
                            I haven’t received a code <Text disabled={counter !== 0} onPress={resend} style={{
                            fontFamily: Fonts.quickSandBold
                        }}>Resend </Text>
                            (0:{counter}) { loading &&<ActivityIndicator size='small' color={Colors.primaryColor}/>}
                        </Text>

                    </View>
                </View>





            </KeyboardAwareScrollView>

            <RectButton disabled={!isValid} style={{
                width: widthPixel(200),
                bottom: 40,
                position:'absolute'
            }} onPress={() => handleSubmit()}>
                {
                    isLoading ? <ActivityIndicator size='small' color="#fff"/>
                        :
                        <Text style={styles.buttonText}>
                            Continue

                        </Text>
                }
            </RectButton>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#fff",

        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {

        //  backgroundColor: Colors.background,
        backgroundColor: "#fff",
        width: '100%',
        alignItems: 'center'
    },

    authContainer: {

        paddingHorizontal: pixelSizeHorizontal(20),
        justifyContent: 'flex-start',
        width: '100%',
        alignItems: 'center',
        marginTop: 35,
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
    },
    label: {
        width: '100%',
        marginBottom: 15,
        lineHeight: heightPixel(25),
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
    },
})

export default ConfirmPhonenumber;
