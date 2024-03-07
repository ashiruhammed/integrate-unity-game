import React, {FC} from 'react';
import {StyleSheet, View, Text, Pressable} from 'react-native';
import Animated from 'react-native-reanimated';
import Colors from "../../../constants/Colors";
import {fontPixel, heightPixel, pixelSizeHorizontal} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";


interface CardProps {
    action: () => void,
    id: number;
    color: string;
    title: string;
    tag: string;
    percentage: string;
    value: string;
    number: string;
    style: object;
}

const Card: FC<CardProps> = ({id, style, title, percentage, value, number, tag, action}) => {
    const getColor = () => {
        switch (id) {
            case 0:
                return Colors.primaryColor;
            case 1:
                return Colors.secondaryColor;
            case 2:
                return Colors.success;
        }
    };

    return (
        <Animated.View style={style}>


            <Pressable onPress={action} style={cardStyle.container}>
                <View style={[cardStyle.circle]}>
                    <Text style={cardStyle.cardText}>
                        {tag}
                    </Text>

                    <View style={[cardStyle.bottomInfo, {
                        height: 30,
                    }]}>
                        <Text style={cardStyle.cardTitle}>
                            {title}
                        </Text>
                        <Text style={cardStyle.cardTitle}>
                            {number}
                        </Text>
                    </View>

                    <View style={[cardStyle.bottomInfo, {
                        height: 15,
                    }]}>
                        <Text style={cardStyle.cardText}>
                            Value: {value}
                        </Text>

                        <Text style={cardStyle.cardText}>
                            +{percentage}%
                        </Text>
                    </View>
                </View>

            </Pressable>
        </Animated.View>
    );
};

const cardStyle = StyleSheet.create({
    spacer: {
        flex: 1,
    },
    container: {
        flexDirection: 'column',
    },
    circle: {
        height: 80,
        width: '100%',
        marginBottom: 20,
        flexDirection: 'column',

        justifyContent: 'center',
        marginTop: 20,
        paddingHorizontal: pixelSizeHorizontal(20),

    },
    cardTitle: {
        color: "#fff",
        fontSize: fontPixel(20),
        fontFamily: Fonts.quickSandBold
    },
    cardText: {
        color: "#FAB5E7",
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandRegular
    },
    bottomInfo: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },

    topLine: {
        height: 20,
        width: 120,
        borderRadius: 40,
        marginBottom: 20,
        marginLeft: 15,
    },
    bottomLine: {
        height: 20,
        width: 60,
        borderRadius: 40,
        marginBottom: 20,
        marginLeft: 15,
    },
    contentWrap: {
        height: heightPixel(50),
        width: '100%',
        backgroundColor: '#fff',
    }
});

export default Card;
