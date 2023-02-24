import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
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
import {getUser, loginUser, reqPasswordResetCode} from "../../action/action";
import Toast from "../../components/Toast";


const formSchema = yup.object().shape({

    email: yup.string().email("Please enter a valid email address").required('Email is required'),


});


const height = Dimensions.get('window').height

const ForgotPassword = ({navigation}: AuthStackScreenProps<'ForgotPassword'>) => {


    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const user = useAppSelector(state => state.user)
    const {responseMessage, responseType, responseState} = user
    const [focusFirstName, setFocusFirstName] = useState<boolean>(false);
    const [contentFirstName, setContentFirstName] = useState<string>('');

    const [focusEmail, setFocusEmail] = useState<boolean>(false);
    const [contentEmail, setContentEmail] = useState<string>('');
    const [togglePass, setTogglePass] = useState(true)

    const [focusPassword, setFocusPassword] = useState<boolean>(false);
    const [contentPassword, setContentPassword] = useState<string>('');

    const signupNow = () => {
        navigation.navigate('RegisterScreen')
    }



    const {mutate, isLoading} = useMutation(['reqPasswordResetCode'], reqPasswordResetCode,

        {

            onSuccess: async (data) => {

                if (data.success) {


                    navigation.navigate('PasswordChange', {
                        email: contentEmail
                    })


                } else {

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
                queryClient.invalidateQueries(['reqPasswordResetCode']);
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

        },
        onSubmit: (values) => {
            const {email} = values;
            const body = JSON.stringify({email:email.toLowerCase()})
            mutate(body)

        }
    });

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
                <Toast message={responseMessage} state={responseState} type={responseType}/>

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
                         Recover password
                            </Text>
                        </View>


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







                        <RectButton disabled={isLoading || !isValid} style={{

                            width: widthPixel(200)
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
    }
})

export default ForgotPassword;
