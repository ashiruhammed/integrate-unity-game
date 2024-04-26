import React, {useEffect} from 'react';

import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    PanGestureHandlerProps,
} from 'react-native-gesture-handler';

import Animated, {
    FadeInDown, FadeOutDown,
    interpolate, interpolateColor, Layout,
    runOnJS, SharedValue, useAnimatedGestureHandler,

    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import {fontPixel, heightPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";


interface TaskInterface {
    index: number;
    id: string;
    type: 'error' | 'success' | 'info';
    body: string;
}

interface ListItemProps
    extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
    task: TaskInterface;
    onDismiss?: (task: TaskInterface) => void;
    index: number,
    totalLength: number,
    activeIndex: SharedValue<number>
}


const LIST_ITEM_HEIGHT = 120;

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

const SwipeToast: React.FC<ListItemProps> = ({
                                                 index, totalLength,
                                                 task,
                                                 onDismiss,
                                                 simultaneousHandlers,
                                                 activeIndex
                                             }) => {


    const translateX = useSharedValue(0);
    const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
    const marginVertical = useSharedValue(10);
    const opacity = useSharedValue(1);


    const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({


        onActive: (event) => {
            if (activeIndex.value == totalLength) {
                return
            }

            // translateX.value = event.translationX;
            //
            if (activeIndex.value == index) {
                translateX.value = event.translationX;
            }
        },
        onEnd: () => {
            const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESHOLD;
            if (shouldBeDismissed) {
                translateX.value = withTiming(-SCREEN_WIDTH);
                itemHeight.value = withTiming(0);
                marginVertical.value = withTiming(0);
                opacity.value = withTiming(0, undefined, (isFinished) => {
                    if (isFinished && onDismiss) {
                        runOnJS(onDismiss)(task);
                    }
                });
            } else {
                translateX.value = withTiming(0);
            }
        },
    });

    const rStyle = useAnimatedStyle(() => ({

        backgroundColor: interpolateColor(
            activeIndex.value,
            [index - 1, index, index + 1],
            ["#fff", "#f9f9f9", "#fff"]
        ),
        transform: [
            {
                translateX: translateX.value,
            },

            {
                translateY: interpolate(
                    activeIndex.value,
                    [index - 1, index, index + 1],
                    [-12, 0, LIST_ITEM_HEIGHT - 12],
                ),
            },
            /* {
                translateY: interpolate(
                    activeIndex.value,
                    [index - 1, index, index + 1],
                    [-12, 0, LIST_ITEM_HEIGHT - 12],
                ),
            },*/

            {
                scale: interpolate(
                    activeIndex.value,
                    [index - 1, index, index + 1],
                    [0.96, 1, 1],
                )
            }
        ],
    }));

    const rIconContainerStyle = useAnimatedStyle(() => {

        const opacity = withTiming(
            translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0
        );
        return {opacity};
    });

    const rTaskContainerStyle = useAnimatedStyle(() => {

        return {
            //zIndex:  index,
            zIndex: totalLength - index,
            position: 'absolute',
            height: itemHeight.value,
            marginVertical: marginVertical.value,
            opacity: opacity.value,
        };
    });


    return (
        <Animated.View key={index}
                       entering={FadeInDown}
                       exiting={FadeOutDown}
                       style={[styles.taskContainer, rTaskContainerStyle]}>
            <Animated.View style={[styles.iconContainer, rIconContainerStyle]}>


                <Ionicons name="close" size={24} color="#cccc"/>
            </Animated.View>
            <PanGestureHandler
                simultaneousHandlers={simultaneousHandlers}
                onGestureEvent={panGesture}
            >
                <Animated.View
                    style={[styles.task, rStyle,   task.type == 'error' &&{

                        borderColor: Colors.errorRed,
                    },
                        task.type == 'success' &&{

                        borderColor: Colors.success,
                    }]}>

                    {
                        task.type == 'success' &&

                        <View style={styles.toastIconWrap}>
                            <View style={[styles.toastIcon, {
                                backgroundColor: Colors.successTint,
                            }]}>
                                <FontAwesome5 name="thumbs-up" size={18} color={Colors.success}/>
                            </View>
                        </View>
                    }

                    {
                        task.type == 'error' &&
                        <View style={styles.toastIconWrap}>
                            <View style={[styles.toastIcon, {
                                backgroundColor: Colors.errorTint,
                            }]}>
                                <Ionicons name="warning-outline" size={18} color={Colors.errorRed}/>

                            </View>
                        </View>
                    }
                    {
                        task.type == 'info' &&
                        <View style={styles.toastIconWrap}>
                            <View style={[styles.toastIcon, {
                                backgroundColor: Colors.light.text,
                            }]}>
                                <Ionicons name="information-circle-outline" size={18} color="#fff" />

                            </View>
                        </View>
                    }
                    <View style={styles.toastBody}>
                        <Text style={styles.taskTitle}>{task.body}</Text>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    taskContainer: {
        width: '100%',
        alignItems: 'center',


    },
    toastIconWrap: {
            height: '100%',
            width: '8%',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
    toastBody: {
        width: '90%',

        marginLeft: 10,
    },
    task: {
        width: '90%',
        minHeight: 80,
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#645ffd",
        borderWidth: 0.5,

        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        // Shadow for iOS
        shadowOpacity: 0.08,
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowRadius: 10,
        // Shadow for Android
        elevation: 5,
    },
    toastIcon: {
        width: 30,
        height: 30,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center'

    },
    taskTitle: {
        lineHeight: heightPixel(18),
        color: Colors.text,
        fontFamily: Fonts.faktumMedium,
        fontSize: fontPixel(14),
    },
    iconContainer: {
        height: LIST_ITEM_HEIGHT,

        position: 'absolute',
        right: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default SwipeToast;
