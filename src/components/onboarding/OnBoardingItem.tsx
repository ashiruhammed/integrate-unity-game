import React from 'react';

import {Text, View, StyleSheet, useWindowDimensions, Image} from 'react-native';
import {fontPixel, heightPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';

interface props {
    item: {
        id:string,
        title: string,
        description: string,
        imagePath: any,

    }
}

const OnBoardingItem = ({item}: props) => {
    const {width} = useWindowDimensions()
    return (
        <Animated.View   key={item.id} entering={FadeInDown}
                           exiting={FadeOutDown} style={{alignItems: 'center', width, justifyContent: 'space-evenly'}}>
            <View style={styles.imageWrap}>


                <Image source={item.imagePath} style={[
                    styles.image,
                    {width, resizeMode: 'contain'}
                ]}/>
            </View>
            <View style={styles.textWrap}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>

            </View>


        </Animated.View>
    );
};

const styles = StyleSheet.create({
    textWrap: {
        width: '60%',
        alignItems: 'center',
        justifyContent: 'flex-start',
      // flex: 0.3
    },

    title: {
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(24),

    },
    description: {
        marginTop: 15,
        textAlign: 'center',
        color: Colors.light.text,
        fontFamily: Fonts.quicksandMedium,
        lineHeight: heightPixel(20),
        fontSize: fontPixel(14),

    },
    imageWrap: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.8,
    },
    image: {
        maxHeight: heightPixel(250),
        width: '90%',
        justifyContent: 'center'
    },

})

export default OnBoardingItem;
