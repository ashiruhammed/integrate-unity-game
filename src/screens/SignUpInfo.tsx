import React, {useState} from 'react';
import * as yup from 'yup';
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, Image} from 'react-native';
import {AuthStackScreenProps} from "../../types";
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Colors from "../constants/Colors";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../helpers/normalize";
import {Fonts} from "../constants/Fonts";
import {AntDesign} from "@expo/vector-icons";
import TextInput from "../components/inputs/TextInput";
import {useFormik} from "formik";
import {RectButton} from "../components/RectButton";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from "react-native-reanimated";






const formSchema = yup.object().shape({


    firstName: yup.string().min(2, 'First name is Too short').required('Your First Name is required').trim('No white spaces'),
    lastName: yup.string().min(2, 'Last name is Too short').required('Your Last Name is required').trim('No white spaces'),
    userName: yup.string().min(2, 'User name is Too short').required('User Name is required').trim('No white spaces'),
    email: yup.string().email("Please enter a valid email address").required('Email is required'),
    password: yup.string().required('Password is required'),
    confirmPass: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required("Password is Required"),
});


const height = Dimensions.get('window').height

const SignUpInfo = ({navigation}: AuthStackScreenProps<'SignUpInfo'>) => {



    const [focusFirstName, setFocusFirstName] = useState<boolean>(false);
    const [contentFirstName, setContentFirstName] = useState<string>('');

    const [focusEmail, setFocusEmail] = useState<boolean>(false);
    const [contentEmail, setContentEmail] = useState<string>('');


    const [focusLastName, setFocusLastName] = useState<boolean>(false);
    const [contentLastName, setContentLastName] = useState<string>('');



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

            lastName: '',
            firstName: '',
            email: '',
            userName: '',
            password: '',
        },
        onSubmit: (values) => {
            const {lastName} = values;

navigation.navigate('Dashboard')
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
                <Animated.View key={"topWithLogo"} entering={FadeInDown}
                               exiting={FadeOutDown} layout={Layout.easing(Easing.bounce).delay(20)}
                               style={styles.topWithLogo}>

                    <View style={styles.imageWrap}>


                        <Image source={require('../assets/images/iconBee.png')} style={[
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
                            We want to know
                            you more
                        </Text>
                    </View>






                <TextInput

                    placeholder="Enter First Name"
                    keyboardType={"default"}
                    touched={touched.firstName}
                    error={touched.firstName && errors.firstName}
                    onFocus={() => setFocusFirstName(true)}
                    onChangeText={(e) => {
                        handleChange('firstName')(e);
                        setContentFirstName(e);
                    }}
                    onBlur={(e) => {
                        handleBlur('firstName')(e);
                        setFocusFirstName(false);
                    }}
                    defaultValue={contentFirstName}
                    focus={focusFirstName}
                    value={values.firstName}
                    label="First Name"/>


                <TextInput

                    placeholder="Enter Last name"
                    keyboardType={"default"}
                    touched={touched.lastName}
                    error={touched.lastName && errors.lastName}
                    onFocus={() => setFocusLastName(true)}
                    onChangeText={(e) => {
                        handleChange('lastName')(e);
                        setContentLastName(e);
                    }}
                    onBlur={(e) => {
                        handleBlur('lastName')(e);
                        setFocusLastName(false);
                    }}
                    defaultValue={contentLastName}
                    focus={focusLastName}
                    value={values.lastName}
                    label="Last Name"/>


                    <TextInput

                        placeholder="@"
                        keyboardType={"default"}
                        touched={touched.userName}
                        error={touched.userName && errors.userName}

                        onChangeText={(e) => {
                            handleChange('userName')(e);

                        }}
                        onBlur={(e) => {
                            handleBlur('userName')(e);

                        }}


                        value={values.userName}
                        label="Gateway Username"/>

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




                    <RectButton style={{
                        width:widthPixel(200)
                    }} onPress={() => navigation.navigate('Dashboard')}>
                        <Text style={{
                            position: 'absolute',
                            fontSize: fontPixel(16),
                            color: "#fff",
                            fontFamily: Fonts.quickSandBold
                        }}>
                            Continue

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
        height:100,
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

})

export default SignUpInfo;
