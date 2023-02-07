import React, {useCallback} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Pressable,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from 'react-native';
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../../helpers/normalize";
import {FontAwesome5} from "@expo/vector-icons";
import {Fonts} from "../../../constants/Fonts";
import Colors from "../../../constants/Colors";
import {useNavigation} from "@react-navigation/native";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getAllAdventure, getUserCompletedAdventure} from "../../../action/action";
import {truncate, useRefreshOnFocus} from "../../../helpers";
import {setAdventure} from "../../../app/slices/dataSlice";
import {useAppDispatch} from "../../../app/hooks";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from 'react-native-reanimated';

interface itemProps {
    item: {
        name: string,
        id: string,
        rewardPoint: string,
        enrollments: string,
    },
    action: (visible: boolean) => void,
    setAdventure: (id: string, name: string) => void
}

const AdventureItem = ({item, action, setAdventure}: itemProps) => {
    return (
        <Pressable onPress={() => {
            setAdventure(item.id, item.name)
            action(true)
        }} style={styles.pressCard}>
            <ImageBackground resizeMethod='scale' source={{
                uri: 'https://images.unsplash.com/photo-1587403335644-fa8fef06b261?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80'
            }} style={styles.adventureCard}>
                <View style={styles.cardTop}>
                    <View style={styles.cardTopLeft}>

                    </View>
                    <View style={styles.cardTopLeft}>
                        <FontAwesome5 name="gift" size={16} color={Colors.success}/>
                        <Text style={styles.cardTopLeftText}>
                            {item.rewardPoint} Reward Points
                        </Text>
                    </View>
                </View>

                <View style={styles.cardBottom}>
                    <View style={styles.cardBottomLeft}>

                        <Text style={[styles.cardBottomLeftText, {}]}>
                            {truncate(item.name,25)}
                        </Text>
                        <Text style={styles.cardTextSmall}>
                            {item.enrollments} missions
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                        setAdventure(item.id, item.name)
                        action(true)

                    }} style={styles.startButton}>
                        <Text style={styles.btnText}>
                            Start Adventure
                        </Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>

        </Pressable>
    )
}

interface props {
    action: (state: boolean) => void
}




const InProgress = ({action}: props) => {
    const navigation = useNavigation()
    const dispatch = useAppDispatch()


    //implementing infinite scroll here
    const {
        isLoading,
        data,
        hasNextPage,
        fetchNextPage: fetchNextPageWallet,
        isFetchingNextPage,
        refetch,

        isRefetching
    } = useInfiniteQuery([`getAllAdventure`], ({pageParam = 1}) => getAllAdventure.adventures(pageParam),
        {
            networkMode: 'online',
            refetchOnWindowFocus: true,

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
    const selectAdventure = (id: string, name: string) => {
        dispatch(setAdventure({missionId: id, missionName: name}))
    }
    const keyExtractor = useCallback((item) => item.id, [],);

    const renderItem = useCallback(({item}) => (
        <AdventureItem setAdventure={selectAdventure} action={action} item={item}/>
    ), [])
    useRefreshOnFocus(refetch)

    return (
        <View style={styles.Body}>
            {isLoading && <ActivityIndicator size="small" color={Colors.primaryColor}/>}

            {
                !isLoading && data &&

                <Animated.FlatList
                    key={"adventure"} entering={FadeInDown}
                    exiting={FadeOutDown} layout={Layout.easing(Easing.bounce).delay(20)}
                    style={{
                        width: '100%'
                    }}
                    refreshing={isLoading}
                    onRefresh={refetch}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    data={data?.pages[0].data.result.filter((adventure: { startedAdventure: any; }) => adventure.startedAdventure).flat()}
                    renderItem={renderItem}
                    onEndReached={loadMore}
                    keyExtractor={keyExtractor}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={isFetchingNextPage ?
                        <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    pressCard: {
        borderRadius: 10,
        overflow: 'hidden',
        width: widthPixel(350),
        height: heightPixel(180),

    },
    adventureCard: {
        resizeMode: 'cover',
        paddingHorizontal: pixelSizeHorizontal(20),
        borderRadius: 10,
        width: widthPixel(350),
        height: heightPixel(180),
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTop: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardTopLeft: {
        minWidth: 100,
        height: 35,
        alignItems: 'center',
        flexDirection: 'row',
    },
    cardTopLeftText: {
        marginLeft: 5,
        color: "#fff",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium
    },
    cardBottomLeftText: {
        fontFamily: Fonts.quicksandSemiBold,
        color: "#fff",
        fontSize: fontPixel(14),
    },
    cardTextSmall: {
        color: "#fff",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandRegular
    },
    Body: {
        width: '100%',
        alignItems: 'center',
        flex: 1,
        marginBottom: 80
    },
    cardBottom: {
        width: '100%',
        height: 70,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardBottomLeft: {

        height: 50,
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
    },
    startButton: {
        backgroundColor: Colors.primaryColor,
        width: widthPixel(130),
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        //paddingHorizontal: pixelSizeHorizontal(10),
    },
    btnText: {
        color: "#fff",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium
    }

})

export default InProgress;
