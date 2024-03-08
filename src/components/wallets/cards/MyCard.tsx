import React, {FC} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Card from './Card';
import Colors from "../../../constants/Colors";
import {useNavigation} from "@react-navigation/native";
import Concordium from "../../../screens/wallets/Concordium";


const {width, height} = Dimensions.get('window');

interface CardContainerProps {
    action: () => void,
    color: string;
    number: string;
    title: string;
    tag: string;
    percentage: string;
    value: string;
    id: number;
    priority: Animated.SharedValue<number>;
    firstPriority: Animated.SharedValue<number>;
    secondPriority: Animated.SharedValue<number>;
    thirdPriority: Animated.SharedValue<number>;
}

const CardContainer: FC<CardContainerProps> = ({
    title,value,tag,percentage,number,
                                                   color,
action,
                                                   id,
                                                   priority,
                                                   firstPriority,
                                                   secondPriority,
                                                   thirdPriority,
                                               }) => {
    const yTranslation = useSharedValue(30);
    const rotation = useSharedValue(30);
    const isRightFlick = useSharedValue(true);

    const gesture = Gesture.Pan()
        .onBegin(({absoluteX, translationY}) => {
            if (absoluteX < width / 2) {
                isRightFlick.value = false;
            }

            yTranslation.value = translationY + 30;
            rotation.value = translationY + 30;
        })
        .onUpdate(({translationY}) => {
            yTranslation.value = translationY + 30;
            rotation.value = translationY + 30;
        })
        .onEnd(() => {
            const priorities = [
                firstPriority.value,
                secondPriority.value,
                thirdPriority.value,
            ];

            const lastItem = priorities[priorities.length - 1];

            for (let i = priorities.length - 1; i > 0; i--) {
                priorities[i] = priorities[i - 1];
            }

            priorities[0] = lastItem;

            firstPriority.value = priorities[0];
            secondPriority.value = priorities[1];
            thirdPriority.value = priorities[2];

            yTranslation.value = withTiming(
                30,
                {
                    duration: 400,
                    easing: Easing.quad,
                },
                () => {
                    isRightFlick.value = true;
                },
            );

            rotation.value = withTiming(
                -1280,
                {
                    duration: 400,
                    easing: Easing.linear,
                },
                () => {
                    rotation.value = 30;
                },
            );
        });

    const style = useAnimatedStyle(() => {
        const getPosition = () => {
            switch (priority.value) {
                case 1.4:
                    return 50;
                case 0.9:
                    return 115;
                case 0.8:
                    return 230;
                default:
                    return 0;
            }
        };

        return {
            position: 'absolute',
            height: 220,
            width: width,
            backgroundColor: color,
            bottom: withTiming(getPosition(), {duration: 500}),
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            zIndex: priority.value * 100,
            transform: [
                {translateY: yTranslation.value},
                {
                    rotate: `${interpolate(
                        rotation.value,
                        isRightFlick.value ? [30, height] : [30, -height],
                        [0, 4],
                    )}rad`,
                },
               /* {
                    scale: withTiming(priority.value, {
                        duration: 250,
                        easing: Easing.linear,
                    }),
                },*/
            ],
        };
    });

    return (
        <GestureDetector gesture={gesture}>
            <Card action={action} id={id} style={style} color={color} title={title} value={value} tag={tag} percentage={percentage} number={number} />
        </GestureDetector>
    );
};

const MyCard = () => {


    const navigation = useNavigation()
    const firstPriority = useSharedValue(1);
    const secondPriority = useSharedValue(0.9);
    const thirdPriority = useSharedValue(0.8);

    return (
        <GestureHandlerRootView style={styles.rootView}>
            <View style={styles.container}>
                <CardContainer
                    action={()=>navigation.navigate('ViewPoints')}
                    id={2}
                    title={"Gateway Points"}
                    tag={"Points"}
                    value={"200"}
                    percentage={"4.0"}
                    number={"5,000,000"}
                    color={"#D90429"}
                    priority={thirdPriority}
                    firstPriority={firstPriority}
                    secondPriority={secondPriority}
                    thirdPriority={thirdPriority}
                />
                <CardContainer
                    id={1}
                    action={()=>navigation.navigate('GatewayToken')}
                    title={"Gateway Token"}
                    tag={"$GATE"}
                    value={"200"}
                    percentage={"4.0"}
                    number={"58,000"}
                    color={"#D9049D"}
                    priority={secondPriority}
                    firstPriority={firstPriority}
                    secondPriority={secondPriority}
                    thirdPriority={thirdPriority}
                />
                <CardContainer
                    id={0}
                    action={()=>navigation.navigate('Concordium')}
                    title={"Concordium"}
                    value={"200"}
                    number={"100,000"}
                    tag={"$CCD"}
                    percentage={"4.0"}
                    color={"#AE04D9"}
                    priority={firstPriority}
                    firstPriority={firstPriority}
                    secondPriority={secondPriority}
                    thirdPriority={thirdPriority}
                />
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    rootView: {
        flex: 1,

    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black',
    },
});

export default MyCard;
