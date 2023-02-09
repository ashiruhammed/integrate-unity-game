//for custom text input here
import {StyleSheet, Text, TextInput as RNTextInput, TextInputProps, TouchableOpacity, View} from "react-native";
import React, {FC} from "react";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import {fontPixel, heightPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {useAppSelector} from "../../app/hooks";


interface Props extends TextInputProps {
    placeholder?: string;
    error?: string;
    label: string;
    touched?: boolean;
    password?: boolean;
    value: string;
    icon?: any;
    text?: string;
    Btn: boolean;
    action?: any;
}


//this is custom text input to allow use mimic a select picker

const SelectInput = ({
                         label,
                         password,
                         placeholder,
                         error,
                         touched,
                         value,
                         action,
                         text,
                         icon, Btn,
                         ...props
                     }: Props) => {
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice


    let validationColor, validationLabelDarkColor, validationLabelColor, validationDarkColor;

    validationColor = !touched ? Colors.border : error ? Colors.border : Colors.border
    validationDarkColor = !touched ? Colors.dark.borderColor : error ? Colors.errorRed : Colors.borderColor
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    validationLabelColor = !touched ? Colors.light.darkText : error ? Colors.errorRed : Colors.light.darkText
    validationLabelDarkColor = !touched ? Colors.dark.text : error ? Colors.errorRed : Colors.dark.text
    return (
        <View style={{
            width: '100%',
            height: heightPixel(120),

            justifyContent: 'center',

        }}>
            {
                label && <View style={styles.labelWrap}>
                    <Text style={[
                        {color: theme == 'light' ? validationLabelColor : validationLabelDarkColor},
                        styles.label]}>
                        {label}
                    </Text>


                </View>
            }
            <TouchableOpacity onPress={action} style={[styles.inputWrap,
                {borderColor: theme == 'light' ? validationColor : validationDarkColor,}
            ]}>

                <RNTextInput
                    onPressIn={action}
                    {...props}
                    placeholder={placeholder}
                    placeholderTextColor="#6D6D6D"
                    style={[styles.input, {
                        //  backgroundColor:  'rgba(151, 151, 151, 0.25)',
                        color:textColor,

                    }]}/>
                {
                    Btn
                    &&
                    <TouchableOpacity onPress={action} style={styles.btn}>
                        {
                            icon &&

                            <Ionicons name={icon} size={20}
                                      color={Colors.light.text}/>
                        }
                        {
                            text && <Text style={{
                                color: '#333',
                                fontSize: fontPixel(14),
                                fontFamily: Fonts.quickSandBold,
                            }}>{text}</Text>
                        }

                    </TouchableOpacity>

                }
            </TouchableOpacity>

            <View style={styles.errorContainer}>

                {error && <Text
                    style={[styles.errorMessage, {
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
    //inputs
    input: {
        fontSize: fontPixel(16),
        lineHeight: heightPixel(20),
        padding: 10,
        width: '90%',
        fontFamily: Fonts.quicksandSemiBold,
        height: '90%',
        textTransform: 'capitalize'
    },
    label: {
        //marginLeft: 10,
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
    },
    errorMessage: {
        position: 'relative',

        lineHeight: heightPixel(15),
        fontSize: fontPixel(12),
        color: Colors.errorRed,
        textTransform: 'capitalize',
        fontFamily: Fonts.quicksandMedium,
    },
    inputWrap: {
        width: '100%',
        height: heightPixel(56),
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    btn: {
        height: '100%',
        width: '10%',
        alignItems: 'flex-start',
        justifyContent: "center"
    },
    errorContainer: {
        height: '20%',
        width: '100%',
        paddingBottom: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    labelWrap: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
})

export default SelectInput
