import React, {useState} from 'react';

import {Text, View, StyleSheet, Animated, Dimensions, FlatList} from 'react-native';

import Colors from "../../constants/Colors";
import {AntDesign, Ionicons, MaterialIcons} from "@expo/vector-icons";

import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {RectButton} from "../RectButton";
import {Fonts} from "../../constants/Fonts";

import {Svg, Circle, Text as SVGText} from 'react-native-svg'
import {useInfiniteQuery} from "@tanstack/react-query";
import {getPrivateCommunities, getPublicCommunities} from "../../action/action";



const CommunityCard = ({theme}: {theme: 'light'|'dark'}) => {
    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const barBg = theme == 'light' ? "#FEF1F1" : "#141414"
    const props = {size: 40, strokeWidth: 2, text: 'hello'}
    const {size, strokeWidth, text} = props;
    const radius = (size - strokeWidth) / 2;
    const circum = radius * 2 * Math.PI;
    const svgProgress = 100 - 80;
    return (
        <View style={[styles.communityCard,{
            backgroundColor
        }]}>

            <View style={styles.topCard}>
                <View style={styles.imageWrap}>

                </View>

                <Text style={[styles.cardTitle,{
                    color: textColor
                }]}>
                    Waves Academy
                </Text>
            </View>

            <View style={styles.cardBody}>
                <Text style={[styles.cardTitle,{
                    color: textColor,
                    fontSize: fontPixel(14),
                    fontFamily: Fonts.quicksandRegular
                }]}>
                    Created by: David
                </Text>
                <View style={[styles.cardBodyBG,{
                    backgroundColor:barBg
                }]}>
                    <View style={styles.imageOverlap}>
                        <View style={styles.avatarWrap}>

                        </View>
                        <View style={styles.avatarWrap}>

                        </View>
                        <View style={styles.avatarWrap}>

                        </View>
                    </View>


                    <Svg width={size} height={size} style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Background Circle */}
                        <Circle
                            stroke={Colors.borderColor}
                            fill="none"
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            {...{strokeWidth}}
                        />
                        {/* Progress Circle */}
                        <Circle
                            stroke={Colors.primaryColor}
                            fill="none"
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            strokeDasharray={`${circum} ${circum}`}
                            strokeDashoffset={radius * Math.PI * 2 * (svgProgress / 100)}
                            strokeLinecap="round"
                            transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                            {...{strokeWidth}}
                        />
                        <View style={{
                            width: 35,
                            height: 30,
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}>
                            <Ionicons name="person" size={12} color="black"/>
                        </View>
                        {/* Text */}
                        <SVGText

                            fontSize={fontPixel(10)}
                            x={size / 2}
                            y={size / 2 + ((14 / 2) - 1)}
                            textAnchor="middle"
                            fill={textColor}
                        >


                            20 left
                        </SVGText>
                    </Svg>


                </View>
            </View>
            <RectButton style={{
                width:widthPixel(200)
            }}>
                <MaterialIcons name="lock" size={14} color="#fff" />
                <Text style={styles.buttonText}>
                    Request to join

                </Text>
            </RectButton>
        </View>
    )
}


const CommunityData = [
    {
        id: "1",

    },
    {
        id: "2"
    }
]


const {width} = Dimensions.get('window')
interface CardProps {
    theme:'light'|'dark'
}

const PrivateCommunity = ({theme}:CardProps) => {
    const scrollX = new Animated.Value(0)
    let position = Animated.divide(scrollX, width)
    const [dataList, setDataList] = useState(CommunityData)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);


    const {
        isLoading,
        data,
        hasNextPage,
        fetchNextPage: fetchNextPageWallet,
        isFetchingNextPage,
        refetch,

        isRefetching
    } = useInfiniteQuery([`getPrivateCommunities`], ({pageParam = 1}) => getPrivateCommunities.communities(pageParam),
        {
            networkMode: 'online',
            getNextPageParam: lastPage => {
                if (lastPage.next !== null) {
                    return lastPage.next;
                }

                return lastPage;
            },
            getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
        })

    const updateCurrentSlideIndex = (e: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);

    };


    return (
        <FlatList
            data={data?.pages[0]?.data?.result}
            onMomentumScrollEnd={updateCurrentSlideIndex}
            keyExtractor={(item, index) => item.id + index}
            horizontal
            pagingEnabled
            scrollEnabled
            snapToAlignment="center"
            scrollEventThrottle={16}
            decelerationRate={"fast"}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
                return <CommunityCard theme={theme}/>
            }}
            onScroll={
                Animated.event(
                    [

                        {nativeEvent: {contentOffset: {x: scrollX}}},
                    ],
                    {useNativeDriver: false}
                )

            }

        />
    );
};

const styles = StyleSheet.create({


    communityCard: {
        width: widthPixel(320),
        height: heightPixel(220),
        shadowColor: "#212121",
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal:pixelSizeHorizontal(10),
        marginVertical:pixelSizeVertical(5),
        borderRadius: 10,
        padding: 15,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 7.22,

        elevation: 3,
    },

    topCard: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    imageWrap: {
        width: 40,
        height: 40,
        borderRadius: 5,
        backgroundColor: "#ccc"
    },
    cardTitle: {
        fontFamily: Fonts.quickSandBold,
        color: "#000000",
        marginLeft: 8,
        fontSize: fontPixel(16)
    },
    cardBody: {
        width: '100%',
        height: 70,
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },

    cardBodyBG: {
        paddingHorizontal: pixelSizeHorizontal(10),
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
    },imageOverlap: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '40%',
        height: '100%'
    },
    avatarWrap: {
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: "#ccc",
        width: 30,
        borderRadius: 30,
        height: 30,
        position: 'relative',
        marginLeft: -10
    },
    buttonText: {
marginLeft:5,
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },



})

export default PrivateCommunity;
