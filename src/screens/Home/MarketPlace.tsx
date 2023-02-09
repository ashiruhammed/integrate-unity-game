import React from 'react';

import {Text, View, StyleSheet, ScrollView, Platform, Image} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import {RectButton} from "../../components/RectButton";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from 'react-native-reanimated';
import {useAppSelector} from "../../app/hooks";


const MarketPlace = () => {

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice


    const backgroundColor = theme == 'light' ? "#FEF1F1" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text


    return (
        <SafeAreaView style={[styles.safeArea,{
            backgroundColor
        }]}>
            <ScrollView
                style={{width: '100%',}} contentContainerStyle={[styles.scrollView,{
                backgroundColor
            }]} scrollEnabled
                showsVerticalScrollIndicator={false}>
                <View style={styles.space}/>
                <Animated.View key={"cartImageWrap"} entering={FadeInDown}
                               exiting={FadeOutDown} layout={Layout.easing(Easing.bounce).delay(20)} style={styles.cartImageWrap}>
                    <Image source={require('../../assets/images/cartimage.png')} style={styles.cartImage}/>
                </Animated.View>
                <Animated.Text key={"message"} entering={FadeInDown}
                               exiting={FadeOutDown} layout={Layout.easing(Easing.bounce).delay(20)} style={[styles.message,{
                                   color: textColor
                }]}>
                    Marketplace is coming soon
                </Animated.Text>

                {/* <RectButton style={{
                    width:190
                }} onPress={() => handleSnapPress(1)}>
                    <Text style={styles.buttonText}>

                    </Text>
                </RectButton>*/}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,

       // backgroundColor: "#FEF1F1",
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {
        paddingHorizontal: pixelSizeHorizontal(20),
        //  backgroundColor: Colors.background,
        //backgroundColor: "#FEF1F1",
        width: '100%',
        alignItems: 'center'
    },
    space: {
        height: heightPixel(120),
        width: '100%'
    },
    cartImageWrap: {
        width: widthPixel(320),
        alignItems: 'center',
        justifyContent: 'center',
        height: heightPixel(350)
    }, cartImage: {
        resizeMode: 'cover',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    message: {
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
      //  color: Colors.light.text

    }
})

export default MarketPlace;
