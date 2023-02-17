import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, Image, ActivityIndicator, Platform} from 'react-native';
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
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from "react-native-reanimated";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {setAuthenticated, setResponse, unSetResponse, updateUserInfo} from "../../app/slices/userSlice";
import * as SecureStore from 'expo-secure-store';
import {getUser, loginUser, userAppleOAuth, userFBOAuth, userGoogleAuth} from "../../action/action";
import Toast from "../../components/Toast";
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from 'expo-apple-authentication';
import GoogleIcon from "../../components/GoogleIcon";
import HorizontalLine from "../../components/HorizontalLine";
import {LoginButton, AccessToken, AuthenticationToken} from 'react-native-fbsdk-next';



WebBrowser.maybeCompleteAuthSession();

const formSchema = yup.object().shape({

    email: yup.string().email("Please enter a valid email address").required('Email is required'),
    password: yup.string().required('Password is required'),

});


const height = Dimensions.get('window').height

const LoginNow = ({navigation}: AuthStackScreenProps<'LoginNow'>) => {


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

    const [focusPassword, setFocusPassword] = useState<boolean>(false);
    const [contentPassword, setContentPassword] = useState<string>('');


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







    useEffect(() => {



        if (googleResponse?.type === "success") {



            const {access_token,id_token,code}  = googleResponse.params;
                //console.log(code)

               // console.log(id_token)
           // setAccessToken(access_token)
            const body = JSON.stringify({
                "grantType": "access_token",
                "tokens": {  access_token}
              //  "referralCode": "gate"
            })

            googleAuthLogin(body)

        }
    }, [googleResponse]);



    const signupNow = () => {
        navigation.navigate('RegisterScreen')
    }



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


     const {mutate:appleOAuth, isLoading:appleAuthenticating} = useMutation(['userAppleOAuth'], userAppleOAuth, {

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


     const {mutate:FBOAuth, isLoading:fbAuthenticating} = useMutation(['userFBOAuth'], userFBOAuth, {

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



    const {mutate:googleAuthLogin, isLoading:googleAuthenticating} = useMutation(['userGoogleAuth'], userGoogleAuth, {

        onSuccess: async (data) => {
//console.log(data)
            if (data.success) {


                SecureStore.setItemAsync('Gateway-Token', data.data.token).then(() => {
                    fetchUser()
                })


            }  else {
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
                queryClient.invalidateQueries(['login-user']);
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

            email: '',
            password: '',
        },
        onSubmit: (values) => {
            const {email, password} = values;
            const body = JSON.stringify({email:email.toLowerCase(), password})
            mutate(body)

        }
    });
    const forgotPassword = () => {
        navigation.navigate('ForgotPassword')
    }
    const goBack = () => {
        navigation.goBack()
    }


    useEffect(() => {

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

                <View
                               style={styles.topWithLogo}>

                    <View style={styles.imageWrap}>


                        <Image source={require('../../assets/images/iconBee.png')} style={[
                            styles.image,
                            {resizeMode: 'contain'}
                        ]}/>
                    </View>
                </View>

                <Toast message={responseMessage} state={responseState} type={responseType}/>

                <View style={styles.authContainer}>
                   {/* <View style={styles.topBar}>
                        <TouchableOpacity onPress={goBack} style={styles.backBtn}>


                            <AntDesign name="arrowleft" size={24} color="#848484"/>
                            <Text style={styles.backTxt}>
                                Back
                            </Text>
                        </TouchableOpacity>
                    </View>*/}


                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>
                            Sign in
                        </Text>
                    </View>


                    <TouchableOpacity   onPress={async () => await googleAuth()} activeOpacity={0.6} style={[styles.buttonSignUp,{
                        borderWidth:1,
                        borderColor:Colors.borderColor,
                        marginVertical:pixelSizeVertical(10),
                    }]}>

                        <GoogleIcon/>
                        <Text style={[ {
                            fontFamily:Fonts.quicksandSemiBold,
                            fontSize:fontPixel(14),
                            color: Colors.light.text,
                        }]}>
                            Continue with Google
                        </Text>
                    </TouchableOpacity>
                    <View style={{
                        marginVertical:pixelSizeVertical(10)
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
                                           // console.log(data.accessToken.toString())
                                            const body = JSON.stringify({
                                                access_token: data.accessToken.toString(),

                                                "referralCode" : "",
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
                            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
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
                                        full_name: `${credential.fullName?.familyName} ${credential.fullName?.givenName}`,
                                        source: "mobile",
                                        "referralCode" : "",
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

                        placeholder="Email address"
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
                        label="Email"/>


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
                            No account yet? <Text style={{
                            color: Colors.primaryColor
                        }}>Get one here</Text>
                        </Text>

                    </TouchableOpacity>

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
alignItems:'center'

        //  backgroundColor: "#FFFFFF",
    },
    topWithLogo: {

        width: '100%',
        //   flex:0.15,
        height: 100,
position:'relative',
        zIndex:-10
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
        width: '100%',
        height: 50,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    titleText: {
        width: '60%',
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
        marginVertical: pixelSizeVertical(15),
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
        height: 100,
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
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderRadius: 10,
        width: widthPixel(292),

        height: heightPixel(56)
    },
})

export default LoginNow;
