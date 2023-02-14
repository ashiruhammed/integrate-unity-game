import React, {useCallback} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Pressable,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ActivityIndicator, Button
} from 'react-native';
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../../helpers/normalize";
import {FontAwesome5} from "@expo/vector-icons";
import {Fonts} from "../../../constants/Fonts";
import Colors from "../../../constants/Colors";
import {useNavigation} from "@react-navigation/native";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {
    getAllAdventure,
    getEnrolledAdventure,
    getInProgressAdventure,
    getUserCompletedAdventure
} from "../../../action/action";
import {truncate, useRefreshOnFocus} from "../../../helpers";
import {setAdventure} from "../../../app/slices/dataSlice";
import {useAppDispatch} from "../../../app/hooks";
import Animated, {Easing, FadeInDown, FadeInLeft, FadeInUp, FadeOutDown, FadeOutLeft, Layout} from 'react-native-reanimated';
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
        currentModule: {},
        currentLesson: {},
        "adventure": {
            "id": string,
            "name": string,
            "imageUrl": "https://link.toimage.com",
            "description": "Test 2 Adventure Description",
            "gains": "You'll learn",
            "expectations": "You go sha learn",
            "earnings": "You no go see shege. You will earn some cool reward if you complete this adventure",
            "difficultyLevel": "BEGINNER",
            "enrollments": 1,
            "rewardPoint": 0
        },
    },

    action: (continueVisible: boolean) => void,
    setAdventure: (adventure: {  }) => void
}

const isRunningInExpoGo = Constants.appOwnership === 'expo'
const AdventureItem = ({item, action, setAdventure}: itemProps) => {

//console.log(item.id, item?.adventure?.name, item?.currentModule)

    return (
        <Pressable onPress={() => {
            setAdventure(item)

            action(true)
        }} style={styles.pressCard}>


            <FastImage  resizeMode={FastImage.resizeMode.cover}  source={{
                uri: item?.adventure?.imageUrl,
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
                            {item?.adventure?.rewardPoint} Reward Points
                        </Text>
                    </View>
                </View>

                <View style={styles.cardBottom}>
                    <View style={styles.cardBottomLeft}>

                        <Text style={[styles.cardBottomLeftText, {}]}>

                            {truncate(item?.adventure?.name,25)}
                        </Text>
                        <Text style={styles.cardTextSmall}>
                            {item?.adventure?.enrollments} missions
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => {
                        setAdventure(item)
                        action(true)

                    }} style={styles.startButton}>
                        <Text style={styles.btnText}>
                         Continue
                        </Text>
                    </TouchableOpacity>
                </View>

            </FastImage>



        </Pressable>
    )
}

interface props {
    action?: (continueVisible: boolean) => void
}



const AllEnrolledAdventure = ({action}: props) => {
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
    } =
        //useInfiniteQuery([`getAllAdventure`], ({pageParam = 1}) => getAllAdventure.adventures(pageParam),
        useInfiniteQuery([`InProgressAdventure`], ({pageParam = 1}) => getInProgressAdventure.inProgress(pageParam),
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
    const selectAdventure = (adventure:{}) => {

        dispatch(setAdventure({adventure:adventure?.adventure}))


    }
    const keyExtractor = useCallback((item) => item.id, [],);

    const renderItem = useCallback(({item}) => (
        <AdventureItem setAdventure={selectAdventure} action={action} item={item}/>
    ), [data])


    useRefreshOnFocus(refetch)

    return (
        <View  style={styles.Body}>

            {
               !isLoading &&   !data && <View>
                    <Button title={'Refresh'} onPress={() => refetch()}/>
                </View>
            }

            {isLoading && <ActivityIndicator size="small" color={Colors.primaryColor}/>}

           {
                !isLoading && data &&

                <FlashList


                    estimatedItemSize={200}
                    refreshing={isLoading}
                    onRefresh={refetch}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    data={data?.pages[0].data?.result}
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
        width: '95%',
        backgroundColor: Colors.primaryColor,
        height: heightPixel(180),
        marginVertical: pixelSizeVertical(12),
        alignSelf: 'center',
    },
    backDrop: {
        width: '100%',
        height: '100%',

        position: 'absolute',
        backgroundColor: 'rgba(5,5,5,0.22)',
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
        width:'55%',
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

export default AllEnrolledAdventure;
