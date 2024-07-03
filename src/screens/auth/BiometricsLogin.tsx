import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as yup from 'yup';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Platform,
    Button, Alert, Pressable
} from 'react-native';
import {AuthStackScreenProps} from "../../../types";
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Colors from "../../constants/Colors";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {AntDesign} from "@expo/vector-icons";
import TextInput from "../../components/inputs/TextInput";
import {useFormik} from "formik";
import {RectButton} from "../../components/RectButton";

import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {setAuthenticated, setResponse, unSetResponse, updateUserInfo} from "../../app/slices/userSlice";
import * as SecureStore from 'expo-secure-store';
import {getUser, loginUser, userAppleOAuth, userFBOAuth, userGoogleAuth} from "../../action/action";
import Toast from "../../components/Toast";
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';

import Recaptcha, {RecaptchaHandles} from 'react-native-recaptcha-that-works';
import RecaptchaNew from '@erickcrus/react-native-recaptcha';
import {addNotificationItem} from "../../app/slices/dataSlice";
import SwipeAnimatedToast from "../../components/toasty";
import FingerPrint from "../../assets/svgs/FingerPrint";
import FaceID from "../../assets/svgs/FaceID";
import * as LocalAuthentication from 'expo-local-authentication'
import {storage} from "../../helpers/storage";

WebBrowser.maybeCompleteAuthSession();

const formSchema = yup.object().shape({


    password: yup.string().required('Password is required'),

});


const height = Dimensions.get('window').height


const BiometricsLogin = ({navigation}: AuthStackScreenProps<'BiometricsLogin'>) => {

    const recaptcha = useRef();
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const user = useAppSelector(state => state.user)
    const {responseMessage, responseType, responseState} = user
    const [focusFirstName, setFocusFirstName] = useState<boolean>(false);
    const [contentFirstName, setContentFirstName] = useState<string>('');

    const [accessToken, setAccessToken] = useState('');

    const [focusEmail, setFocusEmail] = useState<boolean>(false);
    const [contentEmail, setContentEmail] = useState<string>('');
    const [togglePass, setTogglePass] = useState(true)

    const [captchaToken, setCaptchaToken] = useState('');

    const [focusPassword, setFocusPassword] = useState<boolean>(false);
    const [contentPassword, setContentPassword] = useState<string>('');

    const [token, setToken] = useState('');
    // wherever the useState is located
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isBioMetric, setIsBioMetric] = useState(true);


    const recaptchaMain = useRef();

    const send = () => {
        //console.log('send!');
        recaptchaMain?.current.open();
    }


    const $recaptcha = useRef<RecaptchaHandles>(null);

    const handleOpenPress = useCallback(() => {
        $recaptcha.current?.open();
    }, []);

    const handleClosePress = useCallback(() => {
        recaptchaMain?.current.close();
        //  $recaptcha.current?.close();
    }, []);

    const size = 'normal';


    const onVerify = token => {
        setCaptchaToken(token)
        setToken(token)
        //console.log('success!', token);
    }

    const onExpire = () => {
        console.warn('expired!');
    }


// Check if hardware supports biometrics
    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
        })();
    }, []);


    const signupNow = () => {
        navigation.navigate('LoginNow')
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


    const {mutate: appleOAuth, isLoading: appleAuthenticating} = useMutation(['userAppleOAuth'], userAppleOAuth, {

        onSuccess: async (data) => {

            if (data.success) {


                SecureStore.setItemAsync('Gateway-Token', data.data.token).then(() => {
                    fetchUser()
                })


            } else {
                setToken('')
                setCaptchaToken('')
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)


                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: data.message,
                }))

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
            queryClient.invalidateQueries(['userAppleOAuth']);
        }

    })


    const {mutate: FBOAuth, isLoading: fbAuthenticating} = useMutation(['userFBOAuth'], userFBOAuth, {

        onSuccess: async (data) => {

            if (data.success) {


                SecureStore.setItemAsync('Gateway-Token', data.data.token).then(() => {
                    fetchUser()
                })


            } else {
                setToken('')
                setCaptchaToken('')
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)


                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: data.message,
                }))
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
            queryClient.invalidateQueries(['userFBOAuth']);
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
                setCaptchaToken('')
                setToken('')
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)


                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: data.message,
                }))
            }
            /*  navigation.navigate('EmailConfirm', {
                  email:contentEmail
              })*/


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


    const {mutate, isLoading} = useMutation(['login-user'], loginUser, {

        onSuccess: async (data) => {

            if (data.success) {

                setToken('')
                setCaptchaToken('')
                SecureStore.setItemAsync('Gateway-Token', data.data.token).then(() => {
                    fetchUser()
                })


            } else {


                if (data.message == 'Your email is not verified, kindly verify your email to continue.') {
                    navigation.navigate('EmailConfirm', {
                        email: contentEmail
                    })
                } else {

                    setToken('')
                    setCaptchaToken('')
                    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'error',
                        body: data.message,
                    }))
                }
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
            queryClient.invalidateQueries(['login-user']);
        }

    })


    const onFaceId = async () => {
        try {
            // Checking if device is compatible
            const isCompatible = await LocalAuthentication.hasHardwareAsync();

            if (!isCompatible) {
                throw new Error('Your device isn\'t compatible.')
            }

            // Checking if device has biometrics records
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!isEnrolled) {
                throw new Error('No Faces / Fingers found.')
            }

            // Authenticate user


            const auth = await LocalAuthentication.authenticateAsync();
            if (auth.success) {
                // Deserialize the JSON string into an object
                const jsonUser = storage.getString('userData') // { 'password': 'Marc', 'email': 21 }
                const userObject = JSON.parse(jsonUser ? jsonUser : '{}')

                      //  mutate(userData)
                        $recaptcha.current.open()

            } else {
                Alert.alert(
                    'Biometric record not found',
                    'Please verify your identity with your password')
            }


        } catch (error) {
            Alert.alert('An error as occured', error?.message);
        }
    };



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

            email: '',
            password: '',
        },
        onSubmit: (values) => {
            const {email, password} = values;
            const body = JSON.stringify({email: email.toLowerCase(), captchaToken, password})
            //mutate(body

            //  recaptchaMain.current.open()
            $recaptcha.current.open()
        }
    });

    useEffect(() => {
        const jsonUser = storage.getString('userData') // { 'password': 'Marc', 'email': 21 }
        const userObject = JSON.parse(jsonUser ? jsonUser : '{}')

        if (token !== '') {
            const body = JSON.stringify({
                email: userObject.email.toLowerCase(),
                captchaToken: token,
                password: userObject.password
            })

            mutate(body)
        }
    }, [token])
    const forgotPassword = () => {
        navigation.navigate('ForgotPassword')
    }
    const goBack = () => {
        navigation.goBack()
    }


    return (
        <>
            {/* <Recaptcha
                ref={recaptcha}
                siteKey="6Les7rgjAAAAACAihGpA2LD4k-jx7Wjtl68Y8whF"
                baseUrl="https://api.gatewayapp.co"
                onVerify={onVerify}
                onExpire={onExpire}
                size={'compact'}

            />*/}
            <SafeAreaView style={styles.safeArea}>
                <SwipeAnimatedToast/>

                <Recaptcha
                    ref={$recaptcha}
                    lang="eng"
                    footerComponent={<Text style={{
                        fontFamily: Fonts.quickSandBold,
                        fontSize: fontPixel(14),
                        textAlign: 'center',
                        color: Colors.primaryColor,
                        position: 'absolute'
                    }}>Fetching captcha, please wait</Text>}
                   /* headerComponent={
                        <Button title="Close modal" onPress={handleClosePress}/>
                    }*/
                    /* headerComponent={
                         <Button title="Close modal" onPress={handleClosePress}/>
                     }*/
                    /*footerComponent={<Text>Footer here</Text>}*/
                    siteKey="6Les7rgjAAAAACAihGpA2LD4k-jx7Wjtl68Y8whF"
                    baseUrl="https://api.gatewayapp.co"
                    size={'invisible'}
                    theme="light"
                    // onLoad={() => Alert.alert('onLoad event')}
                    // onClose={() => Alert.alert('onClose event')}
                    /* onError={(err) => {
                         Alert.alert('onError event');
                         console.warn(err);
                     }}*/
                    //  onExpire={() => Alert.alert('onExpire event')}
                    onVerify={(token) => {
                        //  console.log({token})
                        // Alert.alert('onVerify event');
                        setToken(token);
                    }}
                    hideBadge={false}
                    enterprise={false}

                />
                {
                    loadingUser &&
                    <ActivityIndicator size="large" color={Colors.primaryColor}
                                       style={[StyleSheet.absoluteFillObject, styles.loader]}/>
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


                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>
                                Welcome Back, David!
                            </Text>
                        </View>


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
                            label="Password"/>

                        <View style={[styles.terms, {
                            marginTop: errors.password ? 10 : 0
                        }]}>
                            <TouchableOpacity onPress={forgotPassword}>
                                <Text style={styles.forgotPass}>Forgot password? <Text style={{
                                    color: Colors.primaryColor
                                }}>Recover here</Text></Text>
                            </TouchableOpacity>
                        </View>


                        <RectButton disabled={isLoading || !isValid || googleAuthenticating} style={{

                            width: widthPixel(200)
                        }} onPress={() => handleSubmit()}>
                            {
                                isLoading || googleAuthenticating ? <ActivityIndicator size='small' color="#fff"/>
                                    :

                                    <Text style={styles.buttonText}>
                                        Sign In

                                    </Text>
                            }
                        </RectButton>


                        <TouchableOpacity style={styles.signUpBtn}>

                            <Text onPress={signupNow} style={styles.alreadyHaveAcc}>
                                Not you? <Text style={{
                                color: Colors.primaryColor
                            }}>Switch account</Text>
                            </Text>

                        </TouchableOpacity>

                        {Platform.OS == 'android' ?
                            <Pressable onPress={onFaceId}>


                                <FingerPrint/>
                            </Pressable>
                            :
                            <Pressable onPress={onFaceId}>
                                <FaceID/>
                            </Pressable>
                        }


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
        alignItems: 'center'

        //  backgroundColor: "#FFFFFF",
    },
    topWithLogo: {

        width: '100%',
        //   flex:0.15,
        height: 100,
        position: 'relative',
        zIndex: -10
    },
    authContainer: {
        zIndex: 1,
        height: height - 50,
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
        marginTop: 50,
        width: '100%',
        height: 120,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    titleText: {

        fontSize: fontPixel(24),
        color: Colors.light.text,
        lineHeight: heightPixel(32),
        fontFamily: Fonts.quicksandSemiBold
    },
    inputWrap:
        {

            marginTop: 25,
            height: heightPixel(140),
            width: '100%',
            // justifyContent: "space-evenly",
        },
    label: {
        marginBottom: 15,
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
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
    signUpBtn: {
        height: heightPixel(40),
        marginBottom: 40,
        marginTop: 15,
        alignItems: 'center',
        flexDirection: 'row',
        width: widthPixel(210),
        justifyContent: 'center'
    },
    alreadyHaveAcc: {

        textAlign: 'center',
        color: Colors.light.text,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,

    },
    forgotPass: {
        color: Colors.light.text,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
        lineHeight: heightPixel(20)
    },
    terms: {
        width: '100%',
        height: 50,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    buttonSignUp: {
        width: widthPixel(210),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,


        height: heightPixel(45)
    },
    fbButtonSignUp: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        width: '100%',

        height: '100%'
    },
    loader: {
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    marginAndText: {
        justifyContent: 'space-around',
        marginVertical: pixelSizeVertical(30),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    maginText: {
        fontSize: fontPixel(14),
        color: Colors.light.text,
        fontFamily: Fonts.quicksandRegular
    }
})

export default BiometricsLogin;
