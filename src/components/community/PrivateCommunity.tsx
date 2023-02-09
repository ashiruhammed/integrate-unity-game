import React, {useCallback, useState} from 'react';

import {Text, View, StyleSheet, Animated, Dimensions, FlatList, Image} from 'react-native';

import Colors from "../../constants/Colors";
import {AntDesign, Ionicons, MaterialIcons} from "@expo/vector-icons";

import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {RectButton} from "../RectButton";
import {Fonts} from "../../constants/Fonts";

import {Svg, Circle, Text as SVGText} from 'react-native-svg'
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getCommunityFollowers, getPrivateCommunities, getPublicCommunities} from "../../action/action";
import {isWhatPercentOf, truncate} from "../../helpers";
import FastImage from "react-native-fast-image";
import Constants from "expo-constants";



interface cardProps {
   // loadingBadge: boolean,
    theme: 'light' | 'dark',
    item: {
        status: string,
        totalUsersJoined: string,
        memberLimit: string,
        description: string,
        currentUserJoined: boolean,
        name: string,
        id: string,
        displayPhoto: string,
        remainingSlots: string,
        accessNFTBadgeAmount: string,
        badgeId: string,
        owner: {
            fullName: string
        }
    },
    //joinModal: (badgeId: string, accessNFTBadgeAmount: string, communityId: string) => void
}


const isRunningInExpoGo = Constants.appOwnership === 'expo'
const CommunityCard = ({theme,item}: cardProps) => {


    const {isLoading, data} = useQuery(['getCommunityFollowers'], () => getCommunityFollowers(item.id))


    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const tintTextColor = theme == 'light' ? "#AEAEAE": Colors.dark.tintTextColor
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
                <Text style={[styles.bodyText, {
                    color:tintTextColor
                }]}>
                    Created by: <Text style={{
                    color: textColor,
                    fontSize: fontPixel(14),
                    fontFamily: Fonts.quicksandRegular
                }}> {item?.owner?.fullName} </Text>
                </Text>
                <View style={styles.bodyTextWrap}>


                    <Text style={[styles.bodyText,{
                        color:tintTextColor
                    }]}>
                        {truncate(item.description, 130)}
                    </Text>
                </View>

                <View style={styles.progressBarWrap}>
                    <View style={styles.progressBar}>
                        <View style={[styles.bar, {
                            width: `${isWhatPercentOf(+item.totalUsersJoined, +item.memberLimit)}%`
                        }]}/>


                    </View>
                </View>

                <View style={[styles.cardBodyBG, {
                    //  backgroundColor: barBg
                }]}>
                    <View style={styles.imageOverlap}>
                        {
                            !isLoading && data?.data?.result.length > 0
                            &&
                            data?.data?.result.slice(0, 4).map((({id, follower}) => (
                                <View key={id} style={styles.avatarWrap}>
                                    {isRunningInExpoGo ?

                                        <Image
                                            style={styles.avatar}
                                            source={{
                                                uri: !follower?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : follower?.avatar,
                                            }}
                                            resizeMode={'cover'}
                                        />
                                        :
                                        <FastImage
                                            style={styles.avatar}
                                            source={{
                                                uri: !follower?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : follower?.avatar,
                                                cache: FastImage.cacheControl.web,
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                    }
                                </View>
                            )))
                        }

                        <View style={styles.numberView}>
                            <Text style={[styles.learnText, {
                                fontSize: fontPixel(10)
                            }]}>
                                +{data?.data?.result.length}
                            </Text>
                        </View>

                    </View>


                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>


                        {/* Text */}
                        <Text style={{
                            color: textColor,
                            fontSize: fontPixel(12),
                            fontFamily: Fonts.quicksandRegular
                        }}>


                            {item?.remainingSlots} persons left
                        </Text>
                    </View>


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
    const renderItem = useCallback(({item}) => (
        <CommunityCard  theme={theme} item={item}/>
    ), [])

    return (
        <FlatList
            data={data?.pages[0]?.data?.result?.slice(0,8)}
            onMomentumScrollEnd={updateCurrentSlideIndex}
            keyExtractor={(item, index) => item.id + index}
            horizontal
            pagingEnabled
            scrollEnabled
            snapToAlignment="center"
            scrollEventThrottle={16}
            decelerationRate={"fast"}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
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



    buttonText: {
marginLeft:5,
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    bodyTextWrap: {
        width: '100%',
        height: 70,

        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    bodyText: {
        fontFamily: Fonts.quicksandRegular,

        marginLeft: 8,
        lineHeight: heightPixel(18),
        fontSize: fontPixel(12),
    },

    progressBarWrap: {
        height: 20,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressBar: {
        width: '100%',
        backgroundColor: '#F4F5F7',
        height: 5,
        borderRadius: 5,
    },
    bar: {

        backgroundColor: Colors.primaryColor,

        position: 'relative',
        height: 5,
        borderRadius: 5,
    },
    cardBody: {
        width: '100%',
        height: 140,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },

    cardBodyBG: {
        paddingHorizontal: pixelSizeHorizontal(10),
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: "#FEF1F1",
        borderRadius: 10,
    },
    imageOverlap: {
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
        width: 20,
        borderRadius: 30,
        height: 20,
        position: 'relative',
        marginLeft: -5
    },
    avatar: {
        borderRadius: 40,
        resizeMode: 'cover',
        backgroundColor: Colors.border,
        width: "100%",
        height: "100%",
    },
    numberView: {
        top: 10,
        left: -20,
        position: 'relative',
        backgroundColor: "#fff",
        borderRadius: 10,
        height: 15,
        minWidth: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.30,
        shadowRadius: 7.22,

        elevation: 3,
    },
    learnText: {
        //  lineHeight: heightPixel(24),
        fontSize: fontPixel(16),
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold
    },

})

export default PrivateCommunity;
