import {Image, StyleSheet} from 'react-native';
import React from 'react';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {Entypo} from "@expo/vector-icons";

type Props = {
    progress: Readonly<SharedValue<0 | 1>>;
};

const Chevron = ({progress}: Props) => {
    const iconStyle = useAnimatedStyle(() => ({
        transform: [{rotate: `${progress.value * -180}deg`}],
    }));
    return (
        <Animated.View style={iconStyle}>
          {/*  <Image source={require('../assets/Chevron.png')} style={styles.chevron} />*/}
            <Entypo name="chevron-thin-down" size={16} color={"#000"}/>
        </Animated.View>
    );
};

export default Chevron;

const styles = StyleSheet.create({
    chevron: {
        width: 24,
        height: 24,
    },
});
