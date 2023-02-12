import React, {useEffect} from 'react';

import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Toast from "../../../components/Toast";
import Colors from "../../../constants/Colors";
import {SafeAreaView} from "react-native-safe-area-context";
import {unSetResponse} from "../../../app/slices/userSlice";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {useQueryClient} from "@tanstack/react-query";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";
import {RootStackScreenProps} from "../../../../types";
import {useFormik} from "formik";

const CommentOnPost = ({navigation}:RootStackScreenProps<'CommentOnPost'>) => {



    const queryClient = useQueryClient();
    const dispatch = useAppDispatch()

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const user = useAppSelector(state => state.user)


    const {responseState, responseType, responseMessage} = user



    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'



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

            "content": "",


        },
        onSubmit: (values) => {
            const { content} = values
            const body = JSON.stringify({

                content,

            })


        }
    });


    const goBack = () => {
        if (values.content !== '') {
          //  handleSnapPress(1)
        } else {
            navigation.goBack()
        }


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
        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
            <Toast message={responseMessage} state={responseState} type={responseType}/>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={goBack}>
                    <Text style={[styles.btnText, {
                        color: textColor
                    }]}>
                        Cancel
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleSubmit()} disabled={!isValid}
                                  style={[styles.postBtn, {
                                      backgroundColor: isValid ? Colors.primaryColor : borderColor,
                                  }]}>

                    <Text style={styles.btnText}>
                        Comment
                    </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>

    );
};

const styles = StyleSheet.create({


    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: pixelSizeHorizontal(20)
    },
    topBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: heightPixel(50),

    },
    postBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: widthPixel(80),
        height: heightPixel(35),

        borderRadius: 10,

    },
    btnText: {
        color: "#fff",
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(16),

    },

})

export default CommentOnPost;
