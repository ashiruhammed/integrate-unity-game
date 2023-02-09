import {Text, TextInputProps, TextInput as RNTextInput, StyleSheet, View, TouchableOpacity} from "react-native";
import React, {FC} from "react";
import Colors from "../../constants/Colors";

import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical} from "../../helpers/normalize";
import {Ionicons} from "@expo/vector-icons";

import {Fonts} from "../../constants/Fonts";
import Animated, {FadeInDown, FadeOutDown} from "react-native-reanimated";
import {useAppSelector} from "../../app/hooks";


interface Props extends TextInputProps {
    inputBg?: string,
    placeholder: string;
    error?: string;
    inputHeight?: number;
    borderRadius?: number;
    inputWrapHeight?: number;
    label?: string;
    isWidth?: null | string | number,
    touched?: boolean;
    password?: boolean;
    leftIcon?: boolean | React.ReactNode;
    icon?: boolean | React.ReactNode;
    rightIcon?: boolean | React.ReactNode;
    focus?: boolean;
    rightText?: boolean;
    rightBtnText?: string;
    rightAction?: () => void;
    value: string;
    action?: () => void;
    passState?: boolean
    labelColor?: boolean
}


const SearchValue: FC<Props> = ({
                                         rightIcon,
                                         inputBg,
                                         rightAction,
                                         rightBtnText,
                                         icon,
                                         borderRadius,
                                         inputWrapHeight,
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
                                         labelColor,
                                         ...props
                                     }) => {

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    let validationColor, validationLabelColor;

    validationColor = !touched ? Colors.border : focus ? Colors.light.text : error ? Colors.errorRed : Colors.light.text
    validationLabelColor = !touched ? Colors.light.text : focus ? Colors.light.text : error ? Colors.errorRed : Colors.light.text

    return (



            <View style={[styles.inputContainer, {
                width:isWidth ? isWidth : '80%',
                borderRadius:  10,
                borderColor: theme == 'light' ?"#DEE6ED" : Colors.dark.borderColor,
                backgroundColor: 'transparent',
                height: inputHeight ? inputHeight : heightPixel(45),
            }]}>


                {leftIcon &&

                    <View style={styles.leftIcon}>
                        <Text style={styles.signTxt}>
                            $
                        </Text>
                    </View>
                }
                {
                    icon &&
                    <View style={styles.leftIcon}>
                        <Text style={styles.signTxt}>
                            {icon}
                        </Text>
                    </View>
                }
                <RNTextInput

                    {...props}
                    placeholder={placeholder}

                    placeholderTextColor={"#9CA3AF"}
                    style={[styles.input, {
                        width: password || leftIcon || rightIcon || icon ? '90%' : '100%',
                        color: '#131313',

                    }]}/>

                {
                    rightIcon && <TouchableOpacity onPress={action} style={styles.passBtn}>

                        {rightIcon}

                    </TouchableOpacity>
                }
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






    )
}

const styles = StyleSheet.create({
    inputWrap: {
        width: '100%',
        justifyContent: "center",

    },
    input: {
        fontSize: fontPixel(12),
        paddingHorizontal: pixelSizeHorizontal(16),
        fontFamily: Fonts.quicksandRegular,
        height: '100%',

    },
    label: {
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
    },
    errorMessage: {
        position: 'relative',


        fontSize: fontPixel(12),
        color: Colors.errorRed,
        textTransform: 'capitalize',
        fontFamily: Fonts.quicksandSemiBold,
    },
    inputContainer: {

alignItems:'center',
        justifyContent:'center',
        marginTop: 8,
        marginBottom: 10,
        borderWidth: 1,
        flexDirection: 'row',


    },
    passBtn: {
        height: '100%',
        width: '8%',
        alignItems: 'center',
        justifyContent: "center"
    },

    labelWrap: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    errorContainer: {

        height: '20%',
        width: '100%',

        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    leftIcon: {
        height: '100%',
        width: '8%',
        alignItems: 'flex-end',
        justifyContent: "center"
    },
    signTxt: {

        fontSize: fontPixel(14),
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold,

    }

})

export default SearchValue
