import React, {useCallback} from 'react';

import {
    ActivityIndicator,
    Animated as MyAnimated,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from "../../components/Toast";
import {SafeAreaView} from "react-native-safe-area-context";
import {RootStackScreenProps, RootTabScreenProps} from "../../../types";
import NavBar from "../../components/layout/NavBar";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import Colors from "../../constants/Colors";
import {FlashList} from "@shopify/flash-list";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from "react-native-reanimated";
import dayjs from "dayjs";
import {fontPixel, heightPixel, pixelSizeHorizontal} from "../../helpers/normalize";
import {useInfiniteQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {blockedUsers, blockUser, getAllBadges, unblockUser} from "../../action/action";
import {useRefreshOnFocus} from "../../helpers";
import {Fonts} from "../../constants/Fonts";
import {setResponse} from "../../app/slices/userSlice";
import SwipeAnimatedToast from "../../components/toasty";
import {addNotificationItem} from "../../app/slices/dataSlice";


interface cardProps {
    theme: 'dark' | 'light',
    item: {
        createdAt: string,
        "id": string,
        "userId": string,
        "blockedBy": string,
        "reason": string,
        "isDeleted": false,
        "updatedAt": string,
        "user":  {
    "avatar": string,
        "fullName":string,
        "id": string,
        "username": string,
},
    },

    unBlockUser:(userId:string)=>void
}

const UserCard = ({theme, item,unBlockUser}: cardProps) => {

    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    return (
        <Animated.View key={item.id} layout={Layout.easing(Easing.bounce).delay(30)}
                       entering={FadeInDown.springify()} exiting={FadeOutDown} style={[styles.followersCard, {
            borderBottomColor: borderColor
        }]}>
            <View style={styles.avatar}>
                  <Image
                    source={{uri: !item.user.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : item?.user.avatar}}
                    style={styles.image}/>
            </View>

            <View style={styles.CardBody}>
                <View style={styles.bodyName}>
                    <Text style={[styles.nameTxt, {
                        color: textColor
                    }]}>
                        {item.user.fullName}
                    </Text>
                </View>
                <View style={styles.bodyName}>
                    <Text style={[styles.time, {
                        color: lightTextColor
                    }]}>
                        {item.reason}
                    </Text>
                    <TouchableOpacity onPress={()=>unBlockUser(item.userId)}>
                        <Text style={[styles.nameTxt, {
                            color: Colors.primaryColor,
                            fontSize: fontPixel(14)
                        }]}>
                            Unblock User
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    )
}


const BlockedUsers = ({navigation}: RootStackScreenProps<'BlockedUsers'>) => {

    const queryClient = useQueryClient()
    const dispatch = useAppDispatch()
    const dataSlice = useAppSelector(state => state.data)
    const user = useAppSelector(state => state.user)
    const {theme} = dataSlice
    const {responseMessage, responseState, responseType} = user


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
    } = useInfiniteQuery([`blocked-Users`], ({pageParam = 1}) => blockedUsers.blockedList(pageParam),
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


    const {isLoading:unBlocking, mutate: unBlockUserNow} = useMutation(['unBlockUser'], unblockUser, {
        onSuccess: async (data) => {
            if (data.success) {


                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'success',
                    body: data.message,
                }))
                refetch()


            } else {


                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body: data.message,
                }))
                /*  navigation.navigate('EmailConfirm', {
                      email:contentEmail
                  })*/


            }
        },
        onError: (error) => {


            dispatch(addNotificationItem({
                id: Math.random(),
                type: 'error',
                body: error.message,
            }))
        },
        onSettled: () => {
            queryClient.invalidateQueries(['unBlockUser']);
        }
    })



    const keyExtractor = useCallback((item) => item.id, [],);


    const unBlockAUser = (userId:string) => {
const body = JSON.stringify({
    userId
})

        unBlockUserNow(body)
    }
    const renderItem = useCallback(({item}) => (
        <UserCard unBlockUser={unBlockAUser} theme={theme} item={item}/>
    ), [])
    useRefreshOnFocus(refetch)


    return (
        <>


            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
                <SwipeAnimatedToast/>
                <NavBar title={"Blocked Users"}/>
                <View style={styles.flatlist}>

                    {
                        unBlocking && <ActivityIndicator size='small' color={Colors.primaryColor}
                                                        style={[StyleSheet.absoluteFillObject, styles.loader]}/>
                    }
                    {
                        isLoading && <ActivityIndicator size='small' color={Colors.primaryColor}
                                                        style={[StyleSheet.absoluteFillObject, styles.loader]}/>
                    }

                    {
                        !isLoading && data &&

                        <FlashList

                            scrollEventThrottle={16}
                            estimatedItemSize={200}
                            refreshing={isLoading}
                            onRefresh={refetch}
                            scrollEnabled
                            showsVerticalScrollIndicator={false}
                            data={data?.pages[0]?.data?.result}
                            renderItem={renderItem}

                            keyExtractor={keyExtractor}
                            onEndReachedThreshold={0.3}

                        />
                    }
                </View>

            </SafeAreaView>
        </>
    );
};


const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
alignItems:'center',
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    flatlist: {

        width: '100%',
        flex: 1,

    },
    loader: {
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    followersCard: {
        width: '100%',
        height: heightPixel(100),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingHorizontal: pixelSizeHorizontal(20),
    },
    avatar: {
        backgroundColor: '#eee',
        height: 55,
        width: 55,
        borderRadius: 80
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 80
    },
    CardBody: {
        width: '80%',
        justifyContent: 'space-evenly',
        height: '70%',
        alignItems: 'center',
    },
    bodyName: {
        width: '100%',
        justifyContent: 'space-between',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameTxt: {
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text,
        fontSize: fontPixel(16)
    },
    time: {
        marginTop: 5,
        fontFamily: Fonts.quicksandSemiBold,
        fontSize: fontPixel(14)
    },
})

export default BlockedUsers;
