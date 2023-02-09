import {Text, TextInputProps, TextInput as RNTextInput, StyleSheet, View, TouchableOpacity} from "react-native";
import React, {FC} from "react";
import Colors from "../../constants/Colors";

import {fontPixel, heightPixel, pixelSizeVertical} from "../../helpers/normalize";
import {Ionicons} from "@expo/vector-icons";
import {Fonts} from "../../constants/Fonts";
import {useAppSelector} from "../../app/hooks";


interface Props extends TextInputProps {
    placeholder: string;
    error?: string;
    inputHeight?: number;
    label?: string;
    isWidth?:null|string|number,
    touched?: boolean;
    password?: boolean;
    leftIcon?: boolean;
    charge?: boolean;
    focus?: boolean;
    rightText?: boolean;
    rightBtnText?: string;
    rightAction?: () => void;
    value: string;
    action?: () =>void;
    passState?: boolean
    optional?: boolean
}


const TextAreaInput: FC<Props> = ({
                                      optional,
                                         charge,
                                         rightAction,
                                         rightBtnText,
                                         leftIcon,
                                         isWidth,
                                         rightText,
                                         inputHeight,
                                         label,
                                         password,
                                         placeholder,
                                         error,
                                         touched,
                                         focus,
                                         value,
                                         action,
                                         passState,
                                         ...props
                                     }) => {

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice






    let validationColor, validationLabelDarkColor, validationLabelColor, validationDarkColor;

    validationColor = !touched ? Colors.border : error ? Colors.border : Colors.border
    validationDarkColor = !touched ? Colors.dark.borderColor : error ? Colors.errorRed : Colors.borderColor
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    validationLabelColor = !touched ? Colors.light.darkText : error ? Colors.errorRed : Colors.light.darkText
    validationLabelDarkColor = !touched ? Colors.dark.text : error ? Colors.errorRed : Colors.dark.text

    return (
        <View style={[styles.inputWrap,{
            height:heightPixel(200)  ,
            width: '100%'
        }]}>
            {
                label && <View style={[styles.labelWrap,{
                    justifyContent: rightText ? 'space-between' : 'flex-start',
                }]}>
                    <Text style={[
                        {color: textColor},
                        styles.label]}>
                        {label}


                    </Text>
                    {
                        optional &&
                        <Text style={[
                    {color:textColor},
                        styles.labelOptional]}>
                        (Optional)
                        </Text>
                    }

                    {
                        rightText && <Text onPress={rightAction} style={[
                            {
                                color: Colors.primary,
                            },
                            styles.label]}>
                            {rightBtnText}
                        </Text>
                    }


                </View>
            }


            <View style={[styles.inputContainer, {
                borderColor: validationColor,
                height: heightPixel(170),
            }]}>

                <RNTextInput
                    multiline

                    {...props}
                    placeholder={placeholder}
                    placeholderTextColor="#6D6D6D"
                    style={[styles.input, {
                        padding:15,
                        width:  '90%',
                        color:  textColor,

                    }]}/>
                {
                    password
                    &&
                    <TouchableOpacity onPress={action} style={styles.passBtn}>
                        {
                            passState ? <Ionicons name="md-eye" size={18} color="#C4C4C4"/>
                                : <Ionicons name="md-eye-off" size={18} color="#C4C4C4"/>
                        }

                    </TouchableOpacity>

                }
            </View>
            <View style={styles.errorContainer}>
                {error && <Text style={[styles.errorMessage,{
                    //left:isWidth ? 2 : 0,

                }]}>
                    {error}
                </Text>
                }
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    inputWrap:{


        width: '100%',
        justifyContent: "flex-start",

    },
    input: {
        fontSize: fontPixel(14),
paddingTop:10,
        fontFamily:Fonts.quickSandBold,
        height: '100%',
    },
    label: {
        fontSize: fontPixel(16),
        fontFamily: Fonts.quickSandBold,
    },
    labelOptional: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandRegular,
marginLeft:5,
    },
    errorMessage: {
        position: 'relative',

        lineHeight: heightPixel(15),
        fontSize: fontPixel(10),
        color: Colors.errorRed,
        textTransform: 'capitalize',
        fontFamily: Fonts.quickSandBold,
    },
    inputContainer: {

        width: '100%',
        marginTop: 8,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',


    },
    passBtn: {
        height: '100%',
        width: '5%',
        alignItems: 'center',
        justifyContent: "center"
    },

    labelWrap:{
        width:'100%',
alignItems:'center',
        flexDirection:'row'
    },
    errorContainer:{

        height:'20%',
        width:'100%',
        paddingBottom: 10,
        justifyContent: 'space-between',
        flexDirection:'row',
    },
    leftIcon:{
        height: '100%',
        width: '8%',
        alignItems: 'flex-end',
        justifyContent: "center"
    },
    signTxt:{

        fontSize:fontPixel(14),
        color:Colors.textDark,
        fontFamily:Fonts.nunitoBold,

    }

})

export default TextAreaInput
