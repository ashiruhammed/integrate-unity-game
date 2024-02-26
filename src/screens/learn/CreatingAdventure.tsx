import React from 'react';

import {Text, View, StyleSheet, Platform, ImageBackground} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {RootStackScreenProps} from "../../../types";

const CreatingAdventure = ({navigation}:RootStackScreenProps<'CreatingAdventure'>) => {

    return (
        <SafeAreaView style={[styles.safeArea]}>
        <ImageBackground source={require('../../assets/images/animated-bg.png')} resizeMode={'cover'} style={styles.backgroundImage}>



        </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#FEF1F1",

    },
    backgroundImage:{
        width: '100%',
        flex: 1,
        alignItems: 'center',
    }
})

export default CreatingAdventure;
