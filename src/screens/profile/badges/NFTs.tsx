import React, {useCallback} from 'react';

import {Text, View, StyleSheet, Platform, Image, ActivityIndicator} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import NavBar from "../../../components/layout/NavBar";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../../helpers/normalize";
import Colors from "../../../constants/Colors";
import {Fonts} from "../../../constants/Fonts";
import FruitIcon from "../../../assets/images/svg/FruitIcon";
import WarmIcon from "../../../assets/images/svg/WarmIcon";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from 'react-native-reanimated';
import {useAppSelector} from "../../../app/hooks";
import {useInfiniteQuery} from "@tanstack/react-query";
import {userNFTs} from "../../../action/action";
import { FlashList } from '@shopify/flash-list';
import { useRefreshOnFocus } from '../../../helpers';




interface badgeProps {
    theme: 'light' | 'dark',

    item: {
        imageUrl: string,
        "title": string,
        amount: string,
        worthInPoints: string,
        "metadata":  {
    "copies": null,
        "description": "Blue badge NFT",
        "expires_at": null,
        "extra": null,
        "issued_at": null,
        "media": "https://res.cloudinary.com/dj0rcdagd/image/upload/v1673288411/blue-badge_aavnfr.svg",
        "media_hash": "f8a2e23e150bf7e1227d6969efdedc0029ef01772234708057d78bb9c4aef473",
        "reference": null,
        "reference_hash": null,
        "starts_at": null,
        "title": "Blue badge - 63",
        "updated_at": null,
},

    }
}

const BadgeItem = ({
                       theme, item
                   }: badgeProps) => {

    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    return (
        <Animated.View key={item.metadata.media_hash} entering={FadeInDown} exiting={FadeOutDown} layout={Layout.easing(Easing.bounce).delay(20)}
                               style={[styles.badgeItem,{
                                   backgroundColor,
                                   borderBottomColor: theme == 'light' ? Colors.borderColor : '#313131',
                               }]}>
                    <View style={styles.badgeImageWrap}>
                        <Image
                            source={{uri:item?.metadata?.media}}
                            style={styles.badgeImage}/>

                      {/*  <View style={styles.streakScore}>
                            <Text style={[styles.streakText]}>
                                x1
                            </Text>
                        </View>*/}
                    </View>

                    <View style={styles.badgeItemBody}>
                        <Text style={[styles.badgeTitle,{
                            color:textColor
                        }]}>
                            {item.metadata.title}
                        </Text>
                        <Text style={styles.badgeSubText}>
                            {item.metadata.description}
                        </Text>


                       {/* <View style={styles.progressBarContainer}>

                            <View style={styles.progressBar}>
                                <View style={styles.Bar}/>

                            </View>
                            <Text style={[styles.badgeSubText, {
                                marginLeft: 10,
                            }]}>
                                1/100
                            </Text>
                        </View>*/}

                    </View>
                </Animated.View>

    )
}
const NFTs = () => {

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice


    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text




    const {
        isLoading,
        data,
        hasNextPage,
        fetchNextPage: fetchNextPage,
        isFetchingNextPage,
        refetch,

        isRefetching
    } = useInfiniteQuery([`all-user-nfts`], ({pageParam = 1}) => userNFTs.NFTs(pageParam),
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


//console.log(data?.pages[0]?.data.result)
    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

        const keyExtractor = useCallback((item: { token_id: any; }) => item.token_id, [],);

    const renderItem = useCallback(({item}) => (
        <BadgeItem theme={theme} item={item}/>
    ), [])
    useRefreshOnFocus(refetch)


    return (
        <SafeAreaView style={[styles.safeArea,{
            backgroundColor
        }]}>
            <NavBar title={"NFT's"}/>

  <View
                style={[styles.scrollView, {
                    backgroundColor
                }]}
            >
                {isLoading && <ActivityIndicator size="small" color={Colors.primaryColor}/>}

                {
                    !isLoading && data &&

                    <FlashList


                        estimatedItemSize={200}
                        refreshing={isLoading}
                        onRefresh={refetch}
                        scrollEnabled
                        showsVerticalScrollIndicator={false}
                        data={data?.pages[0]?.data?.result}
                        renderItem={renderItem}
                        onEndReached={loadMore}
                        keyExtractor={keyExtractor}
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={isFetchingNextPage ?
                            <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                    />
                }
            </View>



        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        backgroundColor: "#fff",
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {
        flex: 1,
        //  backgroundColor: Colors.background,
        backgroundColor: "#fff",
        width: '100%',
        paddingHorizontal: pixelSizeHorizontal(20)
    },
    badgeItem: {

        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: heightPixel(120),

        borderBottomWidth: 1,
    },
    badgeImageWrap: {
        height: heightPixel(110),
        width: widthPixel(85),
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'center',

    },
    badgeItemBody: {
        marginLeft: 15,
        height: '80%',
        width: '75%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    badgeTitle: {

        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandSemiBold
    },
    badgeSubText: {

        color: Colors.light.lightTextColor,
        fontSize: fontPixel(14),
        lineHeight: heightPixel(18),
        fontFamily: Fonts.quicksandMedium
    },
    barWrap: {
        height: 30,
        width: '100%'
    },

    progressBarContainer: {
        width: '100%',
        height: heightPixel(30),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    progressBar: {
        width: '75%',
        height: 8,
        borderRadius: 10,
        justifyContent:'center',
        backgroundColor: '#DEDEDE'
    },
    Bar: {
        width: widthPixel(50),
        height: '100%',
        borderRadius: 10,
        backgroundColor: "#325CEE"
    },
    streakScore: {
        position: 'absolute',
        bottom: 10,
        right: 5,
        borderRadius: 10,
        backgroundColor: "#fff",
        width: widthPixel(35),
        height: heightPixel(18),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: pixelSizeHorizontal(5),
        shadowColor: "#212121",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,

        elevation: 3,
    },
    streakText: {
        color: Colors.light.text,
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(12)
    },

})

export default NFTs;
