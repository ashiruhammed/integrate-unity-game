import React, {useState} from 'react';

import {Text, View, StyleSheet, ImageBackground, TouchableOpacity, Platform, Pressable} from 'react-native';
import {AntDesign, Ionicons, MaterialIcons, Octicons} from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useInfiniteQuery} from "@tanstack/react-query";
import {userNotifications} from "../../../action/action";
import {RootStackScreenProps} from "../../../../types";
import {useAppSelector} from "../../../app/hooks";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";
import {useFormik} from "formik";
import * as yup from "yup";
import PushIcon from "../../../assets/images/svg/PushIcon";
import TextInput from "../../../components/inputs/TextInput";
import HorizontalLine from "../../../components/HorizontalLine";
import CheckYesIcon from "../../../assets/images/svg/CheckYesIcon";
import CheckNoIcon from "../../../assets/images/svg/CheckNoIcon";


const formSchema = yup.object().shape({

    productName: yup.string().required('Product Name is required'),
    productURL: yup.string().url('Please enter a valid URL').required('Product URL is required'),


});


const ProductInformation = ({navigation}: RootStackScreenProps<'ProductInformation'>) => {


    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice


    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const darkTextColor = theme == 'light' ? Colors.light.darkText : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const tintText = theme == 'light' ? "#AEAEAE" : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? "#DEE5ED" : "#ccc"


    const [focusProductName, setFocusProductName] = useState(false)
    const [focusProductUrl, setFocusProductUrl] = useState(false)

    const [checkOption, setCheckOption] = useState<'Yes'|'No'>('No')

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

            productName: '',
            productURL: '',

        },
        onSubmit: (values) => {
            const {productName} = values;
            //     const body = JSON.stringify({email: email.toLowerCase()})

navigation.navigate('FundamentalData')
        }
    });

    return (
        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>

            <KeyboardAwareScrollView

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
                                         source={require('../../../assets/images/streakicon.png')}>
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
                        }]}>Back</Text>
                    </TouchableOpacity>


                </View>


                <View style={styles.stepsBox}>
                    <View style={styles.stepsBoxLeft}>

                        <View style={styles.iconBox}>
                            <PushIcon/>
                        </View>

                        <View style={styles.mainInfo}>
                            <Text style={styles.stepText}>
                                Step 1/4
                            </Text>

                            <Text style={styles.pageTitle}>
                                Product Information
                            </Text>
                        </View>

                    </View>

                    <View style={styles.stepsBoxRight}>
                        <Pressable onPress={()=>handleSubmit()} style={styles.nextStep}>
                            <Text style={styles.nextStepText}>
                                Next Step
                            </Text>
                            <AntDesign name="arrowright" size={16} color={Colors.primaryColor}/>
                        </Pressable>
                    </View>

                </View>



                <View style={styles.productBanner}>

                    <Text style={styles.productPageTitle}>
                        Product Information
                    </Text>

                    <Text style={styles.productPageText}>
                        Please fill in the details below to get an accurate info on your product.
                    </Text>
                </View>


                <View style={styles.authContainer}>



                <TextInput

                    placeholder="Gatewayapp"
                    keyboardType={"default"}
                    touched={touched.productName}
                    error={touched.productName && errors.productName}
                    onFocus={() => setFocusProductName(true)}
                    onChangeText={(e) => {
                        handleChange('productName')(e);

                    }}
                    onBlur={(e) => {
                        handleBlur('productName')(e);
                        setFocusProductName(false);
                    }}

                    focus={focusProductName}
                    value={values.productName}
                    label="Product Name"/>




                    <TextInput

                    placeholder="https://gatewayapp.co"
                    keyboardType={"url"}
                    touched={touched.productURL}
                    error={touched.productURL && errors.productURL}
                    onFocus={() => setFocusProductUrl(true)}
                    onChangeText={(e) => {
                        handleChange('productURL')(e);

                    }}
                    onBlur={(e) => {
                        handleBlur('productURL')(e);
                        setFocusProductUrl(false);
                    }}

                    focus={focusProductUrl}
                    value={values.productURL}
                    label="Product URL"/>

                    <HorizontalLine margin/>



                </View>

                <View style={styles.checkBoxContainer}>
                    <Text style={styles.checkTitle}>
                        Did you work on this product?
                    </Text>

                    <View style={styles.checkItem}>

                        <Pressable onPress={()=>setCheckOption('Yes')} style={[styles.checkBox, checkOption == 'Yes' &&{
                            borderColor:"#000"
                        }]}>
                            <CheckYesIcon/>
                            <Text style={styles.checkBoxText}>
                                Yes
                            </Text>
                        </Pressable>

                        <Pressable onPress={()=>setCheckOption('No')} style={[styles.checkBox, checkOption == 'No' &&{
                            borderColor:"#000"
                        }]}>
                            <CheckNoIcon/>
                            <Text style={styles.checkBoxText}>
                                No
                            </Text>
                        </Pressable>

                    </View>



                </View>

                <Pressable disabled={!isValid} onPress={()=>handleSubmit()} style={styles.claimBtn}>
                    <Text style={styles.claimBtnText}>
                        Next Step
                    </Text>
                </Pressable>

            </KeyboardAwareScrollView>
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

    topBar: {
        paddingHorizontal: pixelSizeHorizontal(15),
        width: '100%',
        height: heightPixel(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    leftButton: {
        width: '15%',
        height: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'row',

        alignItems: 'center',
    },

    backButton: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
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
        width: '15%',
        height: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'row',

        alignItems: 'center',
    },
    rightNavButton: {
        width: widthPixel(100),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    reportText: {
        marginLeft: 5,
        fontSize: fontPixel(14),
        color: Colors.primaryColor,
        fontFamily: Fonts.quicksandMedium
    },
    backText: {
        marginLeft: 5,
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium
    },
    stepsBox: {
        width: '90%',
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    stepsBoxLeft: {
        width: '60%',
        height: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    stepsBoxRight: {
        width: '30%',
        height: '90%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    iconBox: {
        backgroundColor: "#FFEDED",
        borderRadius: 100,
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',

    },
    mainInfo: {

        borderRadius: 100,
        height: 50,
        marginLeft: 10,
        width: '65%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',

    },
    stepText: {
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandMedium,
        color: "#969696"
    },
    pageTitle: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,
        color: "#181818"
    },
    nextStep: {
        width: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    nextStepText: {
        marginRight: 5,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,
        color: Colors.primaryColor
    },
    productBanner:{
        height:heightPixel(120),
        alignItems:'flex-start',
        justifyContent:'center',
        width:'90%',
    },

    productPageTitle:{
        fontSize: fontPixel(24),
        fontFamily: Fonts.quickSandBold,
color:"#000"
    },
    productPageText:{
        lineHeight:22,
        marginTop:10,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
color:"#686868"
    },

    authContainer: {

        justifyContent: 'center',
        width: '90%',
marginTop:40,
    },
    checkBoxContainer:{
        height:heightPixel(120),
        alignItems:'flex-start',
        justifyContent:'center',
        width:'80%',

    },
    checkTitle:{
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
        color:"#333333"
    },
    checkItem:{
        marginTop:10,
        height:heightPixel(80),
        alignItems:'center',
        justifyContent:'space-between',
        width:'100%',
        flexDirection:'row',

    },
    checkBox:{
        height:heightPixel(72),
        alignItems:'center',
        justifyContent:'center',
        width:145,
        borderRadius:6,
        borderColor:"#ccc",
        borderWidth:1,
    },
    checkBoxText:{
        fontSize: fontPixel(10),
        fontFamily: Fonts.quicksandMedium,
        color:"#181818"
    },
    claimBtn: {
        height: 45,

        width: widthPixel(235),
        borderRadius: 30,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        marginVertical: 40,
        justifyContent: 'center',
    },
    claimBtnText: {
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quicksandSemiBold
    }
})

export default ProductInformation;
