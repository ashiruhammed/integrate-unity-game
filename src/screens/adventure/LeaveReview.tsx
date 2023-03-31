import React, {useEffect, useState} from 'react';

import {Text, View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import Toast from "../../components/Toast";
import {SafeAreaView} from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {RootStackScreenProps} from "../../../types";
import {StatusBar} from "expo-status-bar";
import SvgStarComponent from "../../assets/images/svg/StarSVG";
import Slider from "@react-native-community/slider";
import Animated, {Easing, FadeInLeft, FadeOutLeft, Layout} from 'react-native-reanimated';
import {RectButton} from "../../components/RectButton";
import {useFormik} from "formik";
import * as yup from "yup";
import TextInput from "../../components/inputs/TextInput";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {leaveAReview} from "../../action/action";
import {setResponse, unSetResponse} from "../../app/slices/userSlice";




const formSchema = yup.object().shape({
    text: yup.string().required('Comment is required'),
    //   category: yup.string().required('Category is required').trim('No white spaces'),
    // NFTAccess: yup.string().required('Please provide NFTs required for access'),


});


const LeaveReview = ({navigation,route}: RootStackScreenProps<'LeaveReview'>) => {

    const {adventureId}= route.params

    const queryClient = useQueryClient();
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.user)
    const {responseState, responseType, responseMessage} = user
    const [star, setStar] = useState(1);

    const dataSlice = useAppSelector(state => state.data)
    const {submissions, theme} = dataSlice

    const backgroundColor = theme == 'light' ? "#FEF1F1" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const borderColor = theme == 'light' ? "#DBDBDB" : Colors.dark.borderColor
    const optionBg = theme == 'light' ? "#fff" : "#141414"


    const starArray = new Array(star).fill(undefined).map((val, idx) => idx)



  const {mutate,isLoading} =  useMutation(['leaveAReview'],leaveAReview,{
      onSuccess: async (data) => {

          if (data.success) {
              dispatch(setResponse({
                  responseMessage: data.message,
                  responseState: true,
                  responseType: 'success',
              }))

             navigation.navigate('AdventureHome')


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
          queryClient.invalidateQueries(['leaveAReview']);
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
            text: '',



        },
        onSubmit: (values) => {
            const {text} = values
            const body = JSON.stringify({
                rating: star,
                text,
                adventureId
            })

            mutate(body)
        }
    });


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


            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>

                <StatusBar style={theme == 'light' ? 'dark' : 'light'}/>
                <Toast message={responseMessage} state={responseState} type={responseType}/>
                <KeyboardAwareScrollView style={{width: '100%',}} contentContainerStyle={styles.scrollView} scrollEnabled
                            showsVerticalScrollIndicator={false}>

                    <View style={styles.topBar}>
                        <Text style={[styles.title, {
                            color: textColor
                        }]}>
                            Mission Finished
                        </Text>
                    </View>


                    <Text style={[styles.question, {color: textColor}]}>
                        How was
                        your Mission?
                    </Text>

                    <Text style={[styles.starNumber, {color: textColor}]}>
                        {star} Star
                    </Text>

                    <View style={styles.starWrap}>

                        {
                            starArray.map((val, idx) => (
                                <Animated.View key={idx.toString()} entering={FadeInLeft} exiting={FadeOutLeft}
                                               layout={Layout.easing(Easing.bounce).delay(20)} style={styles.star}>
                                    <SvgStarComponent/>
                                </Animated.View>
                            ))
                        }


                    </View>


                    <Slider

                        step={1}
                        style={{width: '90%', height: 40}}
                        minimumValue={1}
                        maximumValue={5}
                        value={star}
                        onValueChange={(value) => setStar(value)}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                    />




                    <TextInput
                        keyboardType={"default"}
                        touched={touched.text}
                        error={touched.text && errors.text}

                        onChangeText={(e) => {
                            handleChange('text')(e);

                        }}
                        onBlur={(e) => {
                            handleBlur('text')(e);

                        }}

                        value={values.text}
                        label="" placeholder={"Add a comment"}/>

                </KeyboardAwareScrollView>

                <RectButton disabled={isLoading} onPress={()=>handleSubmit()}  style={{
                    width: widthPixel(200),
                    position: 'absolute',
                    bottom:30
                }}>
                    {
                        isLoading ? <ActivityIndicator size='small' color="#fff"/> :

                            <Text style={styles.buttonText}>
                                Submit

                            </Text>
                    }
                </RectButton>

            </SafeAreaView>

        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: pixelSizeHorizontal(20),

    },
    scrollView: {

        width: '100%',
        alignItems: 'center'
    },
    topBar: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: heightPixel(40)
    },
    title: {
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(18),
    },
    starNumber: {
        marginVertical: pixelSizeVertical(10),
        color: Colors.light.text,
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(16),
    },
    question: {
        textAlign: 'center',
        width: '55%',
        lineHeight: heightPixel(38),
        marginVertical: pixelSizeVertical(20),
        color: Colors.light.text,
        fontFamily: Fonts.quicksandSemiBold,
        fontSize: fontPixel(32),
    },
    starWrap: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        alignItems: 'center',
        height: heightPixel(250),
    },
    star: {
        marginHorizontal: pixelSizeHorizontal(3)
    },
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
})

export default LeaveReview;
