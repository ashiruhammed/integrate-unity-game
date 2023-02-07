import React, {useCallback, useRef, useState} from 'react';

import {Text, View, StyleSheet, FlatList, Animated, TouchableOpacity} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import OnBoardingItem from "../../components/onboarding/OnBoardingItem";
import Paginator from "../../components/onboarding/Paginator";
import NextButton from "../../components/onboarding/NextButton";
import {fontPixel, heightPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Colors from "../../constants/Colors";


const slides = [
    {
        id: '1',
        imagePath: require('../../assets/images/onboarding/gatewaymascot.png'),
        title: 'Hey, Friend',
        description: 'Welcome to gateway, a fun & free place to learn about crypto & blockchain',
    },
    {
        id: '2',
        imagePath: require('../../assets/images/onboarding/Adventures.png'),
        title: 'Adventures',
        description: 'Pick an adventure to learn with relatable stories. Take your missions, complete your quiz and tasks for an enjoyable experience',
    },
    {
        id: '3',
        imagePath: require('../../assets/images/onboarding/progressbar.png'),
        title: 'Progress Bar',
        description: 'Build your gateway character to unlock exclusive rewards by participating in adventures, communities and marketplace',
    },
    {
        id: '4',
        imagePath: require('../../assets/images/onboarding/Community.png'),
        title: 'Community',
        description: 'Join your tribe of fellow learners in communities of shared interests to build connections and unlock more rewards',
    },
    {
        id: '5',
        imagePath: require('../../assets/images/onboarding/Rewards.png'),
        title: 'Rewards',
        description: 'Earn rewards in points, crypto, badges and \n NFTs for completing adventures and other activities on the app',
    },
];


const OnBoardingScreen = ({skip}: { skip: () => void }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slideRef = useRef(null);

    const viewableItemsChanged = useRef(({viewableItems}) => {
        setCurrentIndex(viewableItems[0].index)
    }).current


    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slideRef.current.scrollToIndex({index: currentIndex + 1})
        }

        if (currentIndex + 1 == slides.length  ) {
            skip()

        }
    }

    const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

    const renderItem = useCallback(({item}) => (<OnBoardingItem item={item}/>), [])
    const keyExtractor = useCallback((item: { id: any; }) =>
            item.id
        , [])


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topSkip}>
                <TouchableOpacity onPress={skip}>
                    <Text style={styles.skipText}>
                        Skip
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={{flex: 3}}>
                    <FlatList data={slides}
                              renderItem={renderItem}
                              pagingEnabled
                              keyExtractor={keyExtractor}
                              showsHorizontalScrollIndicator={false}
                              bounces={false}
                              onScroll={Animated.event([
                                  {nativeEvent: {contentOffset: {x: scrollX}}}
                              ], {
                                  useNativeDriver: false
                              })}
                              onViewableItemsChanged={viewableItemsChanged}
                              viewabilityConfig={viewConfig}
                              scrollEventThrottle={32}
                              ref={slideRef}
                              horizontal/>
                </View>
                <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slides.length)}/>
                {/*  <Paginator data={slides} scrollX={scrollX}/>*/}
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({

    safeArea: {
        width: '100%',
        flex: 1,

        alignItems: 'center',
        backgroundColor: "#fff",

    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topSkip: {
        paddingHorizontal: 20,
        width: '100%',
        height: heightPixel(60),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    skipText: {
        fontFamily: Fonts.quicksandSemiBold,
        fontSize: fontPixel(16),
        color: Colors.light.text
    }

})

export default OnBoardingScreen;
