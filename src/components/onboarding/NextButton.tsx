import React, {useCallback, useEffect, useRef} from 'react';

import Svg, {G, Circle} from 'react-native-svg'
import {Text, View, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import ArrowRight from "../../assets/images/svg/ArrowRight";


interface props {
    scrollTo:()=>void,
    percentage: number
}

const NextButton = ({percentage,scrollTo}:props ) => {

    const size = 65
    const strokeWidth = 2;

    const center = size / 2
    const radius = size / 2 - strokeWidth / 2
    const circumference = 2 * Math.PI * radius


    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null) ;


    const animation = (toValue: number) => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: true
        }).start()
    }

    useEffect(() => {
        animation(percentage)
    }, [percentage]);

    useEffect(() => {
        progressAnimation.addListener((value) => {
            const strokeDashoffset = circumference - (circumference * value.value) / 100

            if (progressRef?.current) {
                progressRef.current.setNativeProps({
                    strokeDashoffset
                })
            }
        },[percentage])

        return ()=>{
            progressAnimation.removeAllListeners()
        }
    },[]);


    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <G rotation={"-90"} origin={center}>


                    <Circle stroke={Colors.tintColor} cx={center} cy={center} r={radius} strokeWidth={strokeWidth}/>

                    <Circle ref={progressRef} stroke={Colors.primaryColor} cx={center} cy={center} r={radius}
                            strokeWidth={strokeWidth}

                            strokeDasharray={circumference}
                    />
                </G>
            </Svg>
            <TouchableOpacity onPress={scrollTo} style={styles.button} activeOpacity={0.6}>
                <ArrowRight/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
width:52,
        height:52,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.tintColor,
        borderRadius: 100,

    }
})

export default NextButton;
