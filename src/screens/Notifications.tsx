import React, {useCallback} from 'react';

import {Text, View, StyleSheet, Platform, TouchableOpacity, Image, ActivityIndicator, I18nManager} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import NavBar from "../components/layout/NavBar";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical} from "../helpers/normalize";
import {Fonts} from "../constants/Fonts";
import Colors from "../constants/Colors";
import {useAppSelector} from "../app/hooks";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from "react-native-reanimated";
import {useInfiniteQuery} from "@tanstack/react-query";
import {readNotifications, userNotifications} from "../action/action";
import {FlashList} from "@shopify/flash-list";
import dayjs from "dayjs";
import {useRefreshOnFocus} from "../helpers";
import FastImage from "react-native-fast-image";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from "react-native-gesture-handler";
import AppleStyleSwipeableRow from "../components/AppleStyleSwipeableRow";
import GmailStyleSwipeableRow from "../components/GmailStyleSwipeableRow";
import SwipeAnimatedToast from "../components/toasty";
import {addNotificationItem} from "../app/slices/dataSlice";
import {useDispatch} from "react-redux";


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





//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false);

type DataRow = {
    from: string;
    when: string;
    message: string;
};

const Row = ({ item }: { item: DataRow }) => (
    // eslint-disable-next-line no-alert
    <RectButton style={styles.rectButton} onPress={() => window.alert(item.from)}>
        <Text style={styles.fromText}>{item.from}</Text>
        <Text numberOfLines={2} style={styles.messageText}>
            {item.message}
        </Text>
        <Text style={styles.dateText}>{item.when} ❭</Text>
    </RectButton>
);

const SwipeableRow = ({item, theme,avatar}: props) => {

const dispatch = useDispatch()
    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tint

    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const handlePress = (id:string) => {


        readNotifications(id).then(res =>{
            console.log(res)
            if(res.success){
                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'success',
                    body: res.message,
                }))

            }else{
                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: res.message,
                }))

            }
        })
        // Add your onPress functionality here
    };
 /*   if (index % 2 === 0) {
        return (
            <AppleStyleSwipeableRow>
                <Row item={item} />
            </AppleStyleSwipeableRow>
        );
    } else {*/
        return (
            <AppleStyleSwipeableRow onPress={()=>handlePress(item.id)}>
                <Animated.View key={item.id}
                               entering={FadeInDown.springify()} exiting={FadeOutDown} style={styles.notificationCard}>

                    <View style={styles.roundImage}>
                        <FastImage
                            style={styles.userAvatar}
                            source={{
                                uri: !avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : avatar,
                                cache: FastImage.cacheControl.web,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />

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
            </AppleStyleSwipeableRow>
        );

};

const Notifications = () => {

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const user = useAppSelector(state => state.user)
    const {userData} = user

const close = () => {

}




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
        ({item,index}) => (
            <SwipeableRow item={item} index={index} theme={theme} />
        ),
        [theme],
    );


    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);

useRefreshOnFocus(refetch)
    return (
        <SafeAreaView style={[styles.safeArea, {
            backgroundColor
        }]}>
            <SwipeAnimatedToast/>
            <NavBar noBell title={"Notification"}/>


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
                    !isLoading && notifications && notifications?.pages[0]?.data?.result?.length > 0 &&

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
        flex: 1,
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



/*SWIPE*/


    rectButton: {
        flex: 1,
        height: 80,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    separator: {
        backgroundColor: 'rgb(200, 199, 204)',
        height: StyleSheet.hairlineWidth,
    },
    fromText: {
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    messageText: {
        color: '#999',
        backgroundColor: 'transparent',
    },
    dateText: {
        backgroundColor: 'transparent',
        position: 'absolute',
        right: 20,
        top: 10,
        color: '#999',
        fontWeight: 'bold',
    },
})

export default Notifications;
