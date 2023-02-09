import React, {useEffect} from 'react';

import {Text, View, StyleSheet, TouchableOpacity, Dimensions, Image} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {AntDesign} from "@expo/vector-icons";
import PhoneInput from "react-native-phone-number-input";
import Colors from "../../constants/Colors";
import {Fonts} from "../../constants/Fonts";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import {RectButton} from "../../components/RectButton";
import PinInput from "../../components/inputs/PinInput";
import * as yup from "yup";
import {useFormik} from "formik";
import {AuthStackScreenProps} from "../../../types";


const height = Dimensions.get('window').height
const formSchema = yup.object().shape({

    authCode: yup.string().required('Pin is required').min(4, 'Must not be less than 4'),
})

const PhoneNumberConfirm = ({route, navigation}: AuthStackScreenProps<'PhoneNumberConfirm'>) => {

    const {phoneNumber} = route.params

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


        }
    });

    const goBack = () => {
        navigation.goBack()
    }



    return (
        <SafeAreaView style={styles.safeArea}>

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
                            Let’s verify your phone
                            number
                        </Text>
                    </View>
                    <View style={styles.inputWrap}>
                        <View style={[styles.resendMessage, {
                            height: heightPixel(80),
                            justifyContent: 'flex-start'
                        }]}>
                            <Text style={styles.label}>
                                Enter the 4-digit code sent to you at {phoneNumber} change phone number
                            </Text>
                        </View>
                        <PinInput value={values.authCode}
                                  codeLength={4} cellSize={46} cellSpacing={54}

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
                                      borderColor: "#CCCCCC",
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
                            I haven’t received a code <Text style={{
                            fontFamily:Fonts.quickSandBold
                        }}>Resend </Text>(0:10)
                        </Text>
                    </View>

                    <RectButton disabled={!isValid} style={{
                        width:widthPixel(200),
                        marginTop:40,
                    }} onPress={() => handleSubmit()}>

                        <Text style={styles.buttonText}>
                            Request code

                        </Text>

                    </RectButton>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
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
        height:heightPixel(70),
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    titleText: {
        width: '80%',
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
    buttonText:{
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    }
})

export default PhoneNumberConfirm;
