
import React, {useEffect, useState} from 'react';
import {Animated, Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {fontPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import Layout from "../../constants/Layout";
import {Fonts} from "../../constants/Fonts";



const shadow = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
}

interface segmentControl {
    tabs: string[],
    onChange: (arg0: any) => void,
    currentIndex: number,
    segmentedControlBackgroundColor: string,
    activeSegmentBackgroundColor: string,
    textColor: string,
    activeTextColor: string,
    paddingVertical: number

}

const defaultProps:segmentControl = {
    tabs: [],
    onChange: () => {
    },
    currentIndex: 0,
    segmentedControlBackgroundColor: '#E5E5EA',
    activeSegmentBackgroundColor: 'white',
    textColor: '#333',
    activeTextColor: '#fff',
    paddingVertical: 12
}


// So that it stretches in landscape mode.
const width = Layout.window.width;

const SegmentContolAlt = ({
                              tabs,
                              onChange,
                              currentIndex,
                              segmentedControlBackgroundColor,
                              paddingVertical,
                              activeSegmentBackgroundColor,
                              textColor,
                              activeTextColor
                          }: segmentControl) => {
    const translateValue = ((width - 2) / tabs?.length);
    const [tabTranslate, setTabTranslate] = React.useState(new Animated.Value(0));
    const [indexTab, setIndexTab] = useState(0)
    // useCallBack with an empty array as input, which will call inner lambda only once and memoize the reference for future calls
    const memoizedTabPressCallback = React.useCallback(
        (index: any) => {
            setIndexTab(index)
            onChange(index);
        },
        []
    );

    useEffect(() => {
        // Animating the active index based current index
        Animated.spring(tabTranslate, {
            toValue:currentIndex * translateValue,
            stiffness: 180,
            damping: 20,
            mass: 1,
            useNativeDriver: true
        }).start()
    }, [currentIndex])

    return (
        <Animated.View style={[
            styles.segmentedControlWrapper,
            Platform.OS == 'ios' &&
     {
             //   borderBottomColor:textColor,
              //  borderBottomWidth:0.5,

            },{

                paddingVertical: paddingVertical,
            }

        ]}>
            <Animated.View
                style={[StyleSheet.absoluteFill, {

                    position: "absolute",
                   // width: (width) / tabs?.length,
                    width:widthPixel(50),
                    top: 0,

                  marginHorizontal: 15,
                },
                    indexTab == 0 &&{
                        marginHorizontal: 40
                    },indexTab == 1 &&{
                        marginHorizontal: 30
                    },
                    {
                    borderBottomWidth:2,
                    borderBottomColor: activeSegmentBackgroundColor,
                   // ...shadow,
                },
                    {
                        transform: [
                            {
                                translateX: tabTranslate
                            }
                        ]
                    }]}
            >
            </Animated.View>
            {
                tabs.map((tab, index) => {
                    const isCurrentIndex = currentIndex === index;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.textWrapper,{}]}
                            onPress={() => memoizedTabPressCallback(index)}
                            activeOpacity={0.7}>
                            <Text numberOfLines={1}
                                  style={[styles.textStyles, {color: isCurrentIndex ?  activeTextColor : textColor}]}>{tab}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    segmentedControlWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        width: width,
        justifyContent: 'center',
        marginVertical: pixelSizeVertical(10)
    },
    textWrapper: {
        flex: 1,

        elevation: 9,
        paddingHorizontal: pixelSizeHorizontal(5),
        width:'100%'
    },
    textStyles: {
        fontSize: fontPixel(14),
        textAlign: 'center',
        textTransform:'capitalize',
        fontFamily: Fonts.quicksandSemiBold
    }
})


SegmentContolAlt.defaultProps = defaultProps


export default SegmentContolAlt;
