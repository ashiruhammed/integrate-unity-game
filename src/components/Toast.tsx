import React from 'react';
import {Image, View} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Directions, Gesture, GestureDetector, RectButton} from 'react-native-gesture-handler';
import {Dimensions, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from "../constants/Colors";
import {fontPixel, heightPixel} from "../helpers/normalize";
import {Fonts} from "../constants/Fonts";
import {unSetResponse} from "../app/slices/userSlice";
import {useAppDispatch} from "../app/hooks";
import Animated, {
    Easing,
    FadeInDown,
    FadeOutDown,
    FadeOutUp,
    Layout, runOnJS,
    SlideInDown,
    SlideOutUp, useAnimatedStyle, useSharedValue, withTiming
} from 'react-native-reanimated';
import {AnimatePresence, MotiView} from "moti";







interface ToastInterface {
    message: string,
    state: boolean,
    type?: 'success' | 'error' | 'info' | 'none',
    action?: () => void,
    cta?: boolean,
    toastHeight?: number,
    copy?: boolean,
    button?: React.ReactNode
}




const Toast = ({
                   action,
                   cta, copy,
                   toastHeight,
                   message, state, type
               }: ToastInterface) => {


    let color;
    if (type === 'error') {
        color = Colors.errorRed
    } else if (type === 'success') {
        color = Colors.success
    } else if (type === 'info') {
        color = Colors.disabled;
    }
    const dispatch = useAppDispatch()

    const clearToast = () => {
        dispatch(unSetResponse())
    }



    return (
        <>
            <AnimatePresence exitBeforeEnter>
                {
                    state &&


                    <MotiView from={{
                        opacity: 0,
                        translateY: -50,
                    }}
                              transition={{
                                  //@ts-ignore
                                  type: 'timing',
                                  duration: 350,
                                  delay: 300,
                              }}
                              animate={{
                                  opacity: 1,
                                  translateY: 50,

                              }}
                              exit={{
                                  opacity: 0,
                                  translateY: -50,
                              }}

                              style={[{
                                  borderColor:color,
                                  backgroundColor: "#fff",
                                  height:  heightPixel(100),
                              }, styles.toastWrap]}>


                        <TouchableOpacity onPress={()=>clearToast()} style={styles.toastView}>

                            <View style={styles.toastBody}>
                                <Text style={[styles.toastMessage, {
                                    color:color
                                }]}>
                                    {message}
                                </Text>

                                <View style={styles.mascotWrap}>
                                    {
                                        type == 'error' ?

                                            <Image source={require('../assets/images/sadmascot.png')} style={styles.mascot}/>
                                            :
                                            <Image source={require('../assets/images/happyBee.png')} style={styles.mascot}/>
                                    }
                                </View>
                            </View>
                            {
                                cta &&
                                <TouchableOpacity onPress={action} activeOpacity={0.6} style={styles.toastBtn}>
                                    <Text style={styles.btnText}>
                                        {
                                            copy ? 'Okay' : 'Continue'

                                        }
                                    </Text>

                                </TouchableOpacity>
                            }


                        </TouchableOpacity>
                    </MotiView>

                }
                    </AnimatePresence>

        </>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top:0,
        zIndex: 10,
        height: heightPixel(200),


    },
    toastWrap: {
        width: '90%',
        position: 'absolute',
        zIndex: 100000,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth:0.5,

        padding: 10,
    },
    toastBody: {
        flexDirection:'row',
        height: '90%',
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    mascotWrap:{
        height: '90%',
        width: "15%",
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    mascot:{
        height:50,
        width:40,
        resizeMode:'center'
    },
    toastMessage: {
        width: "80%",

        textTransform: 'capitalize',
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,
        textAlign: 'left'
    },
    toastView: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    toastBtn: {
        borderRadius: 8,
        backgroundColor: Colors.disabled,
        width: '80%',
        height: heightPixel(50),
        alignItems: 'center',
        justifyContent: 'center'

    },
    btnText: {
        color: "#fff",
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium
    }
})

export default Toast;