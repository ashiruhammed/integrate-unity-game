import React from 'react';

import {Text, View, StyleSheet, useWindowDimensions, Animated} from 'react-native';

const Paginator = ({data, scrollX}) => {


    const {width} = useWindowDimensions()

    return (
        <View style={{flexDirection: 'row', height: 64}}>
            {data.map((_: any, i: React.Key | null | undefined) => {
                const inputRange = [(i-1) * width, i * width, (i + 1) * width]

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange:[10,20,10],
                    extrapolate:'clamp'
                })

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange:[0.3,1,0.3],
                    //extrapolate:'clamp'
                })

                return (<Animated.View key={i.toString()} style={[styles.dot,{width:dotWidth,opacity}]}/>)
            })

            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dot: {
        height:10,
        borderRadius:5,
        marginHorizontal:8,
        backgroundColor:"#15227f"
    }
})

export default Paginator;
