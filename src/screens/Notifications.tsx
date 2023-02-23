import React, {useCallback} from 'react';

import {Text, View, StyleSheet, Platform, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import NavBar from "../components/layout/NavBar";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical} from "../helpers/normalize";
import {Fonts} from "../constants/Fonts";
import Colors from "../constants/Colors";
import {useAppSelector} from "../app/hooks";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from "react-native-reanimated";
import {useInfiniteQuery} from "@tanstack/react-query";
import {userNotifications} from "../action/action";
import {FlashList} from "@shopify/flash-list";
import dayjs from "dayjs";
import {useRefreshOnFocus} from "../helpers";

interface props {
    theme: 'light' | 'dark',
    item: {
        "id": string,
        "title": string,
        "description": string,
        "isRead": false,
        "userId": string,
        "isDeleted": false,
        "createdAt": string,
        "updatedAt": string,
        "deletedAt": null
    },
    avatar:string
}


var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)



const NotificationCard = ({item, theme,avatar}: props) => {
    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tint

    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    return (
        <Animated.View key={item.id} layout={Layout.easing(Easing.bounce).delay(30)}
                       entering={FadeInDown.springify()} exiting={FadeOutDown} style={styles.notificationCard}>

            <View style={styles.roundImage}>
                <Image style={styles.userAvatar}
                       source={{uri:!avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : avatar}}/>

            </View>

            <View style={styles.notificationBody}>
                <Text style={[styles.notificationBodyText,{
                    color: textColor
                }]}>
                    <Text style={{
                        color: textColor,
                        fontFamily: Fonts.quicksandSemiBold,
                    }}>{item.title}</Text> {item.description}
                </Text>
                <Text style={[styles.time,{
                    color: lightTextColor
                }]}>
                    { dayjs(item.createdAt).fromNow() }
                </Text>
            </View>
        </Animated.View>
    )
}

const Notifications = () => {

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const user = useAppSelector(state => state.user)
    const {userData} = user
    const {
        isLoading,
        data: notifications,
        refetch,
        isFetchingNextPage,
        hasNextPage,
        hasPreviousPage,
        fetchNextPage
    } = useInfiniteQuery([`notifications`], ({pageParam = 1}) => userNotifications.notifications({pageParam}),
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
            fetchNextPage();
        }
    };
    const renderItem = useCallback(
        ({item}) => (
            <NotificationCard avatar={userData?.avatar} theme={theme} item={item}/>
        ),
        [],
    );


    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);

useRefreshOnFocus(refetch)
    return (
        <SafeAreaView style={[styles.safeArea, {
            backgroundColor
        }]}>
            <NavBar noBell clearBtn title={"Notification"}/>


            <View
                style={[styles.scrollView, {
                    backgroundColor
                }]}
            >
                {
                    isLoading &&
                    <View style={styles.loading}>
                        <ActivityIndicator color={Colors.primaryColor} size="small"/>
                    </View>
                }


                {
                    !isLoading && notifications && notifications?.pages[0].data.result?.length > 0 &&

                    <FlashList
                    estimatedItemSize={200}
                    refreshing={isLoading}
                    onRefresh={refetch}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    data={notifications?.pages[0].data.result}
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
    notificationCard: {
        width: '100%',
        marginVertical:pixelSizeVertical(10),
        height: heightPixel(80),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

    },
    roundImage: {
        width: 40,
        height: 40,
        borderRadius: 40,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        backgroundColor: '#fff',
        resizeMode: 'cover',
    },
    notificationBody: {
        width: '80%',
        marginLeft: 10,
        alignItems: 'flex-start',
        justifyContent: 'center',

    },
    notificationBodyText: {

        lineHeight:heightPixel(22),
        fontFamily: Fonts.quicksandRegular,
        color: Colors.light.text,
        fontSize: fontPixel(14)
    },
    time: {
        marginTop: 5,
        fontFamily: Fonts.quicksandRegular,
        color: Colors.light.lightTextColor,
        fontSize: fontPixel(12)
    },
    loading: {
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
})

export default Notifications;
