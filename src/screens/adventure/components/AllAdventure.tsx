import React, {useCallback} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Pressable,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ActivityIndicator, Button, Image
} from 'react-native';
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../../helpers/normalize";
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
import {FlashList} from "@shopify/flash-list";
import FastImage from "react-native-fast-image";
import Constants from "expo-constants";


interface itemProps {
    item: {
        name: string,
        id: string,
        rewardPoint: string,
        enrollments: string,
        imageUrl: string,
        modules: [],
        userAdventure:{
            status:string
        }
    },

    action: (visible: boolean) => void,
    setAdventure: (adventure: {  }) => void
}


const AdventureItem = ({item, action, setAdventure}: itemProps) => {

    return (
        <Pressable onPress={() => {
            setAdventure(item)
            action(true)
        }} style={styles.pressCard}>




                <FastImage resizeMode={FastImage.resizeMode.cover} source={{
                    uri: item.imageUrl,
                    cache: FastImage.cacheControl.web,
                    priority: FastImage.priority.normal,
                }} style={styles.adventureCard}>


                    <View style={styles.backDrop}/>
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

                            <Text style={[styles.cardBottomLeftText, {
                                textTransform:'capitalize'
                            }]}>
                                {truncate(item.name, 25)}
                            </Text>
                            <Text style={styles.cardTextSmall}>
                                {item?._count?.modules} missions
                            </Text>
                        </View>
                        {
                            item?.userAdventure?.status

                            ?

                                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                    setAdventure(item)
                                    action(true)

                                }} style={styles.startButton}>
                                    <Text style={styles.btnText}>

                                        {
                                            item?.userAdventure?.status == 'COMPLETED' ?  'Completed'  :
                                                item?.userAdventure?.status == 'INPROGESS' || 'INPROGRESS' ? 'In progress'  :  'Start Adventure'
                                        }


                                    </Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                    setAdventure(item)
                                    action(true)

                                }} style={styles.startButton}>
                                    <Text style={styles.btnText}>
                                       Start Adventure
                                    </Text>
                                </TouchableOpacity>
                        }

                    </View>

                </FastImage>

        </Pressable>
    )
}

interface props {
    action: (state: boolean) => void
}

const AllAdventure = ({action}: props) => {
    const navigation = useNavigation()
    const dispatch = useAppDispatch()


    //implementing infinite scroll here
    const {
        isLoading,
        data,
        hasNextPage,
        fetchNextPage,
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
            fetchNextPage();
        }
    };
    const selectAdventure = (adventure:{}) => {
        dispatch(setAdventure({adventure}))

    }
    const keyExtractor = useCallback((item) => item.id, [],);

    const renderItem = useCallback(({item}) => (
        <AdventureItem setAdventure={selectAdventure} action={action} item={item}/>
    ), [])
    useRefreshOnFocus(refetch)
    //  const { ref, inView } = useInView()

    return (
        <View style={styles.Body}>

            {
                !data && !isLoading && <View>
                    <Button title={'Refresh'} onPress={() => refetch()}/>
                </View>
            }

            {isLoading && <ActivityIndicator size="small" color={Colors.primaryColor}/>}

            {
                !isLoading && data && data?.pages[0]?.data?.result.length > 0 &&

                <FlashList


                    estimatedItemSize={200}
                    refreshing={isLoading}
                    onRefresh={refetch}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    data={data?.pages[0]?.data?.result?.flat()}
                    renderItem={renderItem}
                    onEndReached={loadMore}
                    keyExtractor={keyExtractor}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={isFetchingNextPage ?
                        <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                />
            }

          {/*  <Button

                onPress={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                title={isFetchingNextPage
                    ? 'Loading more...'
                    : hasNextPage
                        ? 'Load Newer'
                        : 'Nothing more to load'}/>
*/}

        </View>
    );
};

const styles = StyleSheet.create({
    pressCard: {
        borderRadius: 10,
        overflow: 'hidden',
        width: '95%',
        backgroundColor: Colors.primaryColor,
        height: heightPixel(190),
        marginVertical: pixelSizeVertical(12),
        alignSelf: 'center',
    },
    backDrop: {
        width: '100%',
        height: '100%',

        position: 'absolute',
        backgroundColor: 'rgba(5,5,5,0.32)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    adventureCard: {
        resizeMode: 'cover',

        borderRadius: 10,
        width: '100%',
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
        paddingHorizontal: pixelSizeHorizontal(20)
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

        flex: 1,

    },
    cardBottom: {
        paddingHorizontal: pixelSizeHorizontal(20),
        width: '100%',
        height: 70,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardBottomLeft: {
        width: '55%',
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

export default AllAdventure;
