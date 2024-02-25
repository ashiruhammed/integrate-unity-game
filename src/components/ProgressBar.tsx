import React from 'react';
import { View, StyleSheet,Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Colors from "../constants/Colors";
import {SimpleLineIcons} from "@expo/vector-icons";
import {IF} from "../helpers/ConditionJsx";
interface CircularProgressProps {
    size: number;
    progress: number;
    strokeWidth: number;
    active: boolean;
    locked: boolean;
}
const CircularProgress = ({ size, progress, strokeWidth ,active,locked}:CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progressPer = ((100 - progress) / 100) * circumference;

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <Circle
                    stroke="#E9E9E9"
                    fill="none"
                    strokeWidth={strokeWidth}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                />
                <Circle
                    stroke={active ?Colors.primaryColor : "#E9E9E9"}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference}, ${circumference}`}
                    strokeDashoffset={progressPer}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    transform={`rotate(-60 ${size / 2} ${size / 2})`}
                />

            </Svg>

            <IF condition={!active}>


            {locked ?

            <View style={styles.iconContainer}>

                <SimpleLineIcons name="lock" size={15} color="#DADADA"  />
            </View>

                :
                <View style={styles.iconContainer}>

                <SimpleLineIcons name="lock-open" size={15} color="#DADADA" />
                </View>
            }
            </IF>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CircularProgress;
