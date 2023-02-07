
import React, {useEffect} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical} from "../helpers/normalize";
import Layout from "../constants/Layout";
import {Fonts} from "../constants/Fonts";
import Colors from "../constants/Colors";



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
    activeTextColor: '#333',
    paddingVertical: pixelSizeVertical(12)
}


// So that it stretches in landscape mode.
const width = Layout.window.width - 42;

const SegmentedControl = ({
                                 tabs,
                                 onChange,
                                 currentIndex,
                                 segmentedControlBackgroundColor,
                                 paddingVertical,
                                 activeSegmentBackgroundColor,
                                 textColor,
                                 activeTextColor
                             }: segmentControl) => {
    const translateValue = ((width - 3) / tabs?.length);
    const [tabTranslate, setTabTranslate] = React.useState(new Animated.Value(0));

    // useCallBack with an empty array as input, which will call inner lambda only once and memoize the reference for future calls
    const memoizedTabPressCallback = React.useCallback(
        (index) => {
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
            {
                backgroundColor: segmentedControlBackgroundColor
            },
            {
                paddingVertical: paddingVertical,
            }
        ]}>
            <Animated.View
                style={[StyleSheet.absoluteFill, {

                    position: "absolute",
                    width: (width - 3) / tabs?.length,
                    top: 0,
                    marginVertical: pixelSizeVertical(2),
                    marginHorizontal: pixelSizeHorizontal(2),
                    backgroundColor: activeSegmentBackgroundColor,
                    borderTopLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    ...shadow,
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
                            style={[styles.textWrapper,{
                            }]}
                            onPress={() => memoizedTabPressCallback(index)}
                            activeOpacity={0.7}>
                            <Text numberOfLines={1}
                                  style={[styles.textStyles,
                                      {color: isCurrentIndex ?  activeTextColor : textColor,
                                         // fontFamily: isCurrentIndex ?  Fonts.quicksandMedium : Fonts.quicksandRegular
                                      }

                                  ]}>{tab}</Text>
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
        fontSize: fontPixel(12),
        textAlign: 'center',
fontFamily:Fonts.quicksandSemiBold
    },

})


SegmentedControl.defaultProps = defaultProps


export default SegmentedControl;
