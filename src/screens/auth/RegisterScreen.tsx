import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    useWindowDimensions,
    Image,
    ActivityIndicator, Platform
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {Fonts} from "../../constants/Fonts";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {AuthStackScreenProps} from "../../../types";
import {useFormik} from "formik";
import * as yup from "yup";

import {RectButton} from "../../components/RectButton";
import Rectangle from "../../assets/images/svg/Rectangle";
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {LoginButton, AccessToken} from 'react-native-fbsdk-next';
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from 'react-native-reanimated';
import TextInput from "../../components/inputs/TextInput";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createAccount, getUser, userAppleOAuth, userFBOAuth, userGoogleAuth} from "../../action/action";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import * as SecureStore from 'expo-secure-store';
import {setAuthenticated, setResponse, unSetResponse, updateUserInfo} from "../../app/slices/userSlice";
import PhoneInputText from "../../components/inputs/PhoneInputText";
import Toast from "../../components/Toast";
import GoogleIcon from "../../components/GoogleIcon";
import * as AppleAuthentication from "expo-apple-authentication";
import HorizontalLine from "../../components/HorizontalLine";
import * as Haptics from "expo-haptics";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";


const height = Dimensions.get('window').height

const _handlePressButtonAsync = async (url: string) => {
    let result = await WebBrowser.openBrowserAsync(url);

};


const formSchema = yup.object().shape({
    phoneNumber: yup.string().required('Phone number is required').trim('Spaces not allowed').strict().min(10, 'Please enter a valid phone number'),
    fullName: yup.string().required('Phone number is required'),
    email: yup.string().email('Please provide a valid email').required('Email is required'),
    password: yup.string().required('Password is required').matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#.-:;()_?\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, Uppercase, Lowercase & Number"
    ),
    confirmPass: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required("Password is Required"),
});


const RegisterScreen = ({navigation}: AuthStackScreenProps<'RegisterScreen'>) => {

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const [countryCode, setCountryCode] = useState('+234');
    const user = useAppSelector(state => state.user)
    const {responseMessage, responseType, responseState} = user
    const [phoneNumber, setPhoneNumber] = useState('');

    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");

    const [focusFullName, setFocusFullName] = useState<boolean>(false);
    const [contentFullName, setContentFullName] = useState<string>('');

    const [togglePass, setTogglePass] = useState(true)
    const [focusEmail, setFocusEmail] = useState<boolean>(false);
    const [contentEmail, setContentEmail] = useState<string>('');

    const [focusPassword, setFocusPassword] = useState<boolean>(false);
    const [contentPassword, setContentPassword] = useState<string>('');

    const [focusConfirmPassword, setFocusConfirmPassword] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);


    const [_, googleResponse, googleAuth] = Google.useAuthRequest({

        expoClientId:
            "450276546603-kv794hqhb9orlqla7fv5fk64fljbhhnq.apps.googleusercontent.com",
        iosClientId:
            "450276546603-nbqqhqaa8jjb1b5hlvp0bprsripoupke.apps.googleusercontent.com",
        androidClientId:
            "450276546603-fe4l1d0uq37bvjra4pdpfph9nvursbua.apps.googleusercontent.com",
        webClientId: "GOOGLE_GUID.apps.googleusercontent.com",
        selectAccount: true,
    });


    const loginSheet = () => {
        navigation.navigate('LoginNow')
        /* navigation.navigate('EmailConfirm',{
             email:"Orjiace@gmail.com"
         })*/
    }
    const {isLoading: loadingUser, mutate: fetchUser} = useMutation(['user-data'], getUser, {
        onSuccess: (data) => {
            if (data.success) {

                dispatch(updateUserInfo(data.data))
                dispatch(setAuthenticated({
                    isAuthenticated: true
                }))

            }
        },
    })


    const {mutate: FBOAuth, isLoading: fbAuthenticating} = useMutation(['userFBOAuth'], userFBOAuth, {

        onSuccess: async (data) => {

            if (data.success) {


                SecureStore.setItemAsync('Gateway-Token', data.data.token).then(() => {
                    fetchUser()
                })


            } else {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'error',
                }))


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
            queryClient.invalidateQueries(['userFBOAuth']);
        }

    })


    const {mutate, isLoading, isSuccess} = useMutation(['create-account'], createAccount,

        {

            onSuccess: async (data) => {

                if (data.success) {


                    SecureStore.setItemAsync('Ports-Token', data.data.token).then(() => {


                        navigation.navigate('EmailConfirm', {
                            email: contentEmail
                        })
                    })

                } else {

                    dispatch(setResponse({
                        responseMessage: data.message,
                        responseState: true,
                        responseType: 'error',
                    }))


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
                queryClient.invalidateQueries(['create-account']);
            }

        })


    const {mutate: appleOAuth, isLoading: appleAuthenticating} = useMutation(['userAppleOAuth'], userAppleOAuth, {

        onSuccess: async (data) => {

            if (data.success) {


                SecureStore.setItemAsync('Gateway-Token', data.data.token).then(() => {
                    fetchUser()
                })


            } else {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'error',
                }))


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
            queryClient.invalidateQueries(['userAppleOAuth']);
        }

    })

    const {mutate: googleAuthLogin, isLoading: googleAuthenticating} = useMutation(['userGoogleAuth'], userGoogleAuth, {

        onSuccess: async (data) => {
//console.log(data)
            if (data.success) {


                SecureStore.setItemAsync('Gateway-Token', data.data.token).then(() => {
                    fetchUser()
                })


            } else {
                if (data.message == 'Your email is not verified, kindly verify your email to continue.') {
                    navigation.navigate('EmailConfirm', {
                        email: contentEmail
                    })
                } else {
                    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                    dispatch(setResponse({
                        responseMessage: data.message,
                        responseState: true,
                        responseType: 'error',
                    }))

                }
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
            queryClient.invalidateQueries(['userGoogleAuth']);
        }

    })


    const handleClosePress = () => {

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

            phoneNumber: '',
            fullName: '',
            email: '',
            password: '',
            confirmPass: '',
            referralCode: '',
        },
        onSubmit: (values) => {
            const {phoneNumber, fullName, email, password, referralCode} = values;
            const data = JSON.stringify({
                fullName,
                phone: phoneNumber.trim(),
                email: email.toLowerCase(),
                countryCode,
                password,
                referralCode,
            })

            mutate(data)
        }
    });

    useEffect(() => {


        if (googleResponse?.type === "success") {


            const {access_token, id_token, code} = googleResponse.params;
            //console.log(code)

            // console.log(id_token)
            // setAccessToken(access_token)
            const body = JSON.stringify({
                "grantType": "access_token",
                "tokens": {access_token},
                "referralCode": values.referralCode
            })

            googleAuthLogin(body)

        }
    }, [googleResponse]);

    const goBack = () => {
        navigation.goBack()
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


    return (

        <>


            <SafeAreaView style={styles.safeArea}>
                {
                    googleAuthenticating &&
                    <ActivityIndicator size="large" color={Colors.primaryColor}
                                       style={[StyleSheet.absoluteFill, {
                                           zIndex: 1,
                                           backgroundColor: 'rgba(0,0,0,0.1)'
                                       }]}/>
                }
                {
                    appleAuthenticating &&
                    <ActivityIndicator size="large" color={Colors.primaryColor}
                                       style={[StyleSheet.absoluteFill, {
                                           zIndex: 1,
                                           backgroundColor: 'rgba(0,0,0,0.1)'
                                       }]}/>
                }
                {
                    fbAuthenticating &&
                    <ActivityIndicator size="large" color={Colors.primaryColor}
                                       style={[StyleSheet.absoluteFill, {
                                           zIndex: 1,
                                           backgroundColor: 'rgba(0,0,0,0.1)'
                                       }]}/>
                }
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


                    <Animated.View key={"topWithLogo"} entering={FadeInDown}
                                   exiting={FadeOutDown} layout={Layout.easing(Easing.bounce).delay(20)}
                                   style={styles.topWithLogo}>

                        <View style={styles.imageWrap}>


                            <Image source={require('../../assets/images/iconBee.png')} style={[
                                styles.image,
                                {resizeMode: 'contain'}
                            ]}/>
                        </View>
                    </Animated.View>
                    <Toast message={responseMessage} state={responseState} type={responseType}/>
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
                                Join Gateway for free
                            </Text>
                        </View>


                        <TouchableOpacity onPress={async () => await googleAuth()} activeOpacity={0.6}
                                          style={[styles.buttonSignUp, {
                                              borderWidth: 1,
                                              borderColor: Colors.borderColor,
                                              marginVertical: pixelSizeVertical(10),
                                          }]}>

                            <GoogleIcon/>
                            <Text style={[{
                                fontFamily: Fonts.quicksandSemiBold,
                                fontSize: fontPixel(14),
                                color: Colors.light.text,
                            }]}>
                                Sign up with Google
                            </Text>
                        </TouchableOpacity>
                        <View style={{
                            marginVertical: pixelSizeVertical(10)
                        }}>


                            <LoginButton

                                onLoginFinished={
                                    (error, result) => {
                                        if (error) {
                                            console.log("login has error: " + result.error);
                                        } else if (result.isCancelled) {
                                            console.log("login is cancelled.");
                                        } else {
                                            AccessToken.getCurrentAccessToken().then(
                                                (data) => {
                                                    const body = JSON.stringify({
                                                        access_token: data.accessToken.toString(),

                                                        "referralCode":  values.referralCode,
                                                    })
                                                    FBOAuth(body)
                                                }
                                            )
                                        }
                                    }
                                }
                                onLogoutFinished={() => console.log("logout.")}/>
                        </View>

                        {
                            Platform.OS == 'ios' &&

                            <AppleAuthentication.AppleAuthenticationButton

                                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
                                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                                cornerRadius={5}
                                style={styles.buttonSignUp}
                                onPress={async () => {
                                    try {
                                        const credential = await AppleAuthentication.signInAsync({
                                            requestedScopes: [
                                                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                                AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                            ],
                                        });
                                        const body = JSON.stringify({
                                            access_token: credential.identityToken,
                                            full_name: credential.fullName?.familyName,
                                            referralCode: values.referralCode,
                                            "source": "mobile"
                                        })
                                        appleOAuth(body)

                                        // signed in
                                    } catch (e) {
                                        if (e.code === 'ERR_CANCELED') {
                                            // handle that the user canceled the sign-in flow
                                        } else {
                                            // handle other errors
                                        }
                                    }
                                }}
                            />
                        }

                        <HorizontalLine margin/>

                        <TextInput

                            placeholder="Enter Full name"
                            keyboardType={"default"}
                            touched={touched.fullName}
                            error={touched.fullName && errors.fullName}
                            onFocus={() => setFocusFullName(true)}
                            onChangeText={(e) => {
                                handleChange('fullName')(e);
                                setContentFullName(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('firstName')(e);
                                setFocusFullName(false);
                            }}
                            defaultValue={contentFullName}
                            focus={focusFullName}
                            value={values.fullName}
                            label="Full Name"/>

                        <TextInput

                            placeholder="example@gmail.com"
                            keyboardType={"email-address"}
                            touched={touched.email}
                            error={touched.email && errors.email}
                            onFocus={() => setFocusEmail(true)}
                            onChangeText={(e) => {
                                handleChange('email')(e);
                                setContentEmail(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('email')(e);
                                setFocusEmail(false);
                            }}
                            defaultValue={contentEmail}
                            focus={focusEmail}
                            value={values.email}
                            label="Email Address"/>

                        <PhoneInputText

                            error={errors.phoneNumber}
                            defaultValue={phoneNumber}
                            label="Phone number"
                            onChangeText={(text, code) => {
                                handleChange('phoneNumber')(text);
                                setCountryCode(code)
                            }}
                            value={values.phoneNumber}
                            errorMessage=''
                            placeholder="Phone"/>


                        <TextInput

                            password
                            action={() => setTogglePass(!togglePass)}
                            passState={togglePass}
                            secureTextEntry={togglePass}
                            placeholder="Password"
                            keyboardType="default"
                            touched={touched.password}
                            error={touched.password && errors.password}
                            onFocus={() => setFocusPassword(true)}
                            onChangeText={(e) => {
                                handleChange('password')(e);
                                setContentPassword(e);

                            }}
                            onBlur={(e) => {
                                handleBlur('password')(e);
                                setFocusPassword(false);
                            }}
                            defaultValue={contentPassword}
                            focus={focusPassword}
                            value={values.password}
                            label="Password *"/>


                        <TextInput
                            password
                            action={() => setTogglePass(!togglePass)}
                            passState={togglePass}
                            secureTextEntry={togglePass}
                            placeholder="Password"
                            keyboardType="default"
                            touched={touched.confirmPass}
                            error={touched.confirmPass && errors.confirmPass}
                            onFocus={() => setFocusConfirmPassword(true)}
                            onChangeText={(e) => {
                                handleChange('confirmPass')(e);
                                setConfirmPassword(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('confirmPass')(e);
                                setFocusConfirmPassword(false);
                            }}
                            defaultValue={confirmPassword}
                            focus={focusConfirmPassword}
                            value={values.confirmPass}
                            label="Confirm Password *"/>


                        <TextInput

                            placeholder="***********************"
                            keyboardType={"default"}
                            touched={touched.referralCode}
                            onChangeText={(e) => {
                                handleChange('referralCode')(e);

                            }}
                            onBlur={(e) => {
                                handleBlur('referralCode')(e);
                            }}
                            value={values.referralCode}
                            label="Referral code (optional)"/>


                        <RectButton disabled={isLoading || !isValid} style={{
                            width: widthPixel(200)
                        }} onPress={() => handleSubmit()}>
                            {
                                isLoading ? <ActivityIndicator size='small' color="#fff"/>
                                    :

                                    <Text style={styles.buttonText}>
                                        Join Gateway

                                    </Text>
                            }
                        </RectButton>


                        <Text onPress={loginSheet} style={styles.alreadyHaveAcc}>
                            Already have an account?
                        </Text>

                        <View style={styles.wrap}>
                            <Text style={styles.terms}>
                                By proceeding, you consent to get calls, WhatsApp or SMS
                                messages, including by automated means, from Gateway
                                and its affiliates to the number provided.
                            </Text>

                        </View>

                        <View style={styles.wrap}>
                            <Text style={styles.terms}>
                                This site is protected by reCAPTCHA and the Google
                                <Text
                                    onPress={() => _handlePressButtonAsync('https://www.gatewayapp.co/privacy-policy')}
                                    style={{
                                        fontFamily: Fonts.quickSandBold
                                    }}> Privacy Policy</Text> and <Text
                                onPress={() => _handlePressButtonAsync('https://www.gatewayapp.co/terms-and-conditions')}
                                style={{
                                    fontFamily: Fonts.quickSandBold
                                }}> Terms of Service</Text> apply.
                            </Text>

                        </View>

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
    authContainer: {
        zIndex: 1,

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
        height: 50,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    titleText: {
        width: '90%',
        fontSize: fontPixel(24),
        color: Colors.light.text,
        lineHeight: heightPixel(32),
        fontFamily: Fonts.quicksandSemiBold
    },
    inputWrap:
        {

            marginTop: 5,
            height: heightPixel(90),
            width: '100%',
            // justifyContent: "space-evenly",
        },
    label: {
        marginBottom: 15,
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
    },
    errorMessage: {
        position: 'relative',
        marginTop: 10,
        lineHeight: heightPixel(15),
        fontSize: fontPixel(12),
        color: Colors.errorRed,
        textTransform: 'capitalize',
        fontFamily: Fonts.quicksandSemiBold,
    },
    phoneInput: {

        width: '100%',


        borderRadius: 6,
        borderWidth: 1,
        flexDirection: 'row',
        padding: 5,
        height: heightPixel(54),
        // borderColor: Colors.border
    },
    phoneInputTextStyle: {
        borderColor: "#CCCCCC",
        borderWidth: 1,
        backgroundColor: "#fff",
        borderRadius: 10,

        width: '100%'
    },
    flagButtonStyle: {
        borderRadius: 10,
        marginRight: 10,
        borderColor: "#CCCCCC",
        borderWidth: 1,
    },
    flagStyle: {
        height: heightPixel(20),
        width: widthPixel(30),
        // backgroundColor: "#fff",
        borderColor: Colors.border,
        borderWidth: 1,
    },
    wrap: {
        width: '90%',
        alignItems: 'center',
        marginVertical: pixelSizeVertical(35),
    },
    terms: {
        textAlign: 'center',
        lineHeight: heightPixel(22),
        color: Colors.light.text,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandRegular,
    },
    alreadyHaveAcc: {
        marginVertical: pixelSizeVertical(35),
        textAlign: 'center',
        color: Colors.light.text,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
        textDecorationLine: 'underline'
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
        fontSize: fontPixel(24),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
    },
    sheetContainer: {
        marginTop: 40,
        justifyContent: 'flex-start',
        width: '100%',
        alignItems: 'flex-start',
    },
    rowBtn: {
        marginTop: 40,
        height: heightPixel(90),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    buttonSignUp: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderRadius: 10,
        width: widthPixel(292),

        height: heightPixel(56)
    },

})

export default RegisterScreen;
