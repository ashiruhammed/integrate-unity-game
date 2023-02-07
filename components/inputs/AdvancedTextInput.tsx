import {Text, TextInputProps, StyleSheet, View, TouchableOpacity} from "react-native";
import React, {FC} from "react";
import Colors from "../../constants/Colors";
import {BottomSheetTextInput as RNTextInput} from "@gorhom/bottom-sheet";
import {fontPixel, heightPixel, pixelSizeHorizontal} from "../../helpers/normalize";
import {Entypo, Ionicons} from "@expo/vector-icons";
import {Fonts} from "../../constants/Fonts";
import Animated, {Easing, FadeInDown, FadeInUp, FadeOutDown, Layout} from "react-native-reanimated";


interface Props extends TextInputProps {
    mainWallet?:boolean
    balanceText:string,
    inputBg?: string,
    placeholder: string;
    error?: string;
    inputHeight?: number;
    borderRadius?: number;
    inputWrapHeight?: number;
    label?: string;
    isWidth?: null | string | number,
    touched?: boolean;
    leftIcon?: boolean | React.ReactNode;
    icon?: boolean | React.ReactNode;
    focus?: boolean;

    value: string;
    actionSelectWallet?: () => void;
    actionMax?: () => void;

    labelColor?: boolean
}


const AdvancedTextInput: FC<Props> = ({
                                          actionSelectWallet,
                                          mainWallet,
                                          balanceText,
                                          inputBg,
                                          icon,
                                          borderRadius,
                                          inputWrapHeight,
                                          leftIcon,
                                          isWidth,
                                          inputHeight,
                                          label,
                                          placeholder,
                                          error,
                                          touched,
                                          focus,
                                          value,
                                          actionMax,
                                          labelColor,
                                          ...props
                                      }) => {


    let validationColor, validationLabelColor;

    validationColor = !touched ? Colors.border : error ? Colors.errorRed : focus ? Colors.primaryColor : Colors.border
    validationLabelColor = !touched ? Colors.light.text : error ? Colors.errorRed : focus ? Colors.primaryColor : Colors.light.text

    return (
        <View style={[styles.inputWrap, {
            height: inputWrapHeight ? inputWrapHeight : heightPixel(110),
            width: isWidth ? isWidth : '100%',
        }]}>


            <View style={[styles.inputContainer, {
                borderRadius: borderRadius ? borderRadius : 10,
                borderColor: validationColor,
                backgroundColor: inputBg ? "#FAFAFA" : 'transparent',
                height: inputHeight ? inputHeight : heightPixel(80),
            }]}>

                <View style={styles.topInputWrap}>


                    <RNTextInput

                        {...props}
                        placeholder={placeholder}

                        placeholderTextColor={"#9CA3AF"}
                        style={[styles.input, {
                            width: "80%",
                            color: '#131313',

                        }]}/>

                    {
                        mainWallet ?

                            <TouchableOpacity onPress={actionSelectWallet} style={styles.passBtn}>

                                <Text style={styles.label}>
                                    Near  <Entypo name="chevron-down" size={14} color="black" />
                                </Text>

                            </TouchableOpacity>
                            :
                            <View style={styles.passBtn}>

                                <Text style={styles.label}>
                                    Points
                                </Text>

                            </View>
                    }


                </View>

                <View style={styles.bottomInputWrap}>
                    <Text style={styles.bottomText}>
                        Balance: <Text style={{color:Colors.light.text}}>{balanceText}</Text>
                    </Text>
                    {  !mainWallet &&
                    <Text style={[styles.maxText]} onPress={actionMax}>
                        MAX
                    </Text>
                    }
                </View>
            </View>


            <View style={styles.errorContainer}>

                {error && <Animated.Text
                    key={error} entering={FadeInDown}
                    exiting={FadeOutDown}

                    style={[styles.errorMessage, {
                        //left:isWidth ? 2 : 0,

                    }]}>
                    {error}
                </Animated.Text>
                }

            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    inputWrap: {
        width: '100%',
        justifyContent: "flex-start",

    },
    input: {
        fontSize: fontPixel(16),

        fontFamily: Fonts.quicksandSemiBold,
        height: '100%',
    },
    label: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quickSandBold,
    },
    bottomText: {
        color: Colors.light.tintTextColor,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandRegular,
    },
    maxText: {
        color: "#3B8BE3",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quickSandBold,
    },
    errorMessage: {
        position: 'relative',
        fontSize: fontPixel(12),
        color: Colors.errorRed,
        textTransform: 'capitalize',
        fontFamily: Fonts.quicksandMedium,
    },
    topInputWrap: {
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
        flexDirection: 'row',
        paddingHorizontal: pixelSizeHorizontal(15),
    },
    bottomInputWrap: {
        paddingHorizontal: pixelSizeHorizontal(15),
        justifyContent: 'space-between',
        width: '100%',
        height: 30,
        flexDirection: 'row',
//backgroundColor:'red',

    },
    inputContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,


    },
    passBtn: {

        height: '100%',
        width: '20%',
        alignItems: 'flex-end',
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

export default AdvancedTextInput
