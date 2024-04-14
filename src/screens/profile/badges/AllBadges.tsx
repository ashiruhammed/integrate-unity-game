import React, {useCallback} from 'react';

import {Text, View, StyleSheet, Platform, Image, ActivityIndicator} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import NavBar from "../../../components/layout/NavBar";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from "react-native-reanimated";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../../helpers/normalize";
import Colors from "../../../constants/Colors";
import {Fonts} from "../../../constants/Fonts";
import {useAppSelector} from "../../../app/hooks";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getAllAdventure, getAllBadges, getBadges} from "../../../action/action";
import {FlashList} from "@shopify/flash-list";
import {isWhatPercentOf, useRefreshOnFocus} from "../../../helpers";
import badges from "../Badges";


interface badgeProps {
    theme: 'light' | 'dark',

    item: {
        imageUrl: string,
        "title": string,
        amount: string,
        worthInPoints: string,
        id: string
    }
}

const BadgeItem = ({
                       theme, item
                   }: badgeProps) => {

    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    return (
        <Animated.View key={item?.id} entering={FadeInDown} exiting={FadeOutDown}
                       layout={Layout.easing(Easing.bounce).delay(20)} style={[styles.badgeItem, {
            backgroundColor,
            borderBottomColor: theme == 'light' ? Colors.borderColor : '#313131',
        }]}>
            <View style={styles.badgeImageWrap}>
                <View style={styles.badgeImageContainer}>
                    <Image
                        source={{uri: item.imageUrl}}
                        style={styles.badgeImage}/>
                </View>


                <View style={styles.streakScore}>
                    <Text style={styles.streakText}>
                        x{item.amount}
                    </Text>
                </View>
            </View>

            <View style={styles.badgeItemBody}>
                <Text style={[styles.badgeTitle, {
                    color: textColor
                }]}>
                    {item?.title}
                </Text>
                <Text style={styles.badgeSubText}>
                    used to get exclusive access to top communities
                </Text>


                <View style={styles.progressBarContainer}>

                    <View style={styles.progressBar}>
                        <View style={[styles.Bar, {
                            width: isWhatPercentOf(+item.worthInPoints, 100)
                        }]}/>

                    </View>
                    <Text style={[styles.badgeSubText, {
                        marginLeft: 10,
                    }]}>
                        {item.worthInPoints}/100
                    </Text>
                </View>

            </View>
        </Animated.View>

    )
}

const AllBadges = () => {
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice


    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor


    const {
        isLoading,
        data,
        hasNextPage,
        fetchNextPage: fetchNextPageWallet,
        isFetchingNextPage,
        refetch,

        isRefetching
    } = useInfiniteQuery([`all-user-badges`], ({pageParam = 1}) => getAllBadges.badges(pageParam),
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


    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPageWallet();
        }
    };
    const keyExtractor = useCallback((item) => item.id, [],);

    const renderItem = useCallback(({item}) => (
        <BadgeItem theme={theme} item={item}/>
    ), [])
    useRefreshOnFocus(refetch)


    return (
        <SafeAreaView style={[styles.safeArea, {
            backgroundColor
        }]}>
            <NavBar title={"Badges"}/>
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
                        data={data?.pages[0]?.data?.flat()}
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

        width: '100%',
        paddingHorizontal: pixelSizeHorizontal(20)
    },
    badgeItem: {
        backgroundColor: "#fff",
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: heightPixel(120),
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1,
    },
    badgeImageWrap: {
        height: heightPixel(110),
        width: widthPixel(85),
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeImageContainer: {
        height:80,
        width: 80,
        alignItems:'center',
        justifyContent:'center'

    },
    badgeImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',

    },
    badgeItemBody: {
        marginLeft: 15,
        height: '80%',
        width: '75%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    badgeTitle: {
        color: Colors.light.text,
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
        backgroundColor: '#DEDEDE'
    },
    Bar: {

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

export default AllBadges;
