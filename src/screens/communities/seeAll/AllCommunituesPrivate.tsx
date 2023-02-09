import React from 'react';

import {Text, View, StyleSheet, Platform} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

const AllCommunities = () => {
    return (
        <SafeAreaView style={styles.safeArea}>


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,

        backgroundColor: "#fff",
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
})

export default AllCommunities;
