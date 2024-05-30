import React, {useCallback, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Pressable,
    Image,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import Colors from "../../constants/Colors";
import CircularProgress from "../../components/ProgressBar";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {FlashList} from "@shopify/flash-list";
import {useNavigation} from "@react-navigation/native";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {getAiAdventure, getAllAdventure} from "../../action/action";
import {useRefreshOnFocus} from "../../helpers";
import {setAdventure} from "../../app/slices/dataSlice";
import {isLoading} from "expo-font";
import EmptyState from "../../components/EmptyState";


interface propsAi {
    item: {
        "id": string,
        "name": string,
        "imageUrl": string,
        "description": string,
        "expectations": string,
        "gains": string,
        "earnings": string,
        "difficultyLevel": string,
        "enrollments": 0,
        "rewardPoint": 0,
        "isDeleted": boolean,
        "isFeatured": boolean,
        "creatorId": string,
        "badgeId": string,
        "createdAt": string,
        "updatedAt": string,
        "deletedAt": null,
        "creatorType": string,
        modules: [],
        badge: {},
        "Review": [],
        creator: {},
        _count: {},
        "startedAdventure": boolean,
        "userAdventure": null

    },
    theme: string,
    // action: (visible: boolean) => void,
    setAdventure: (adventure: {}) => void
}

const AdventureAICardItem = ({item, theme, setAdventure}: propsAi) => {
    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor

    return (
        <Pressable onPress={() => {
            setAdventure(item)

        }} style={[styles.learnCard, !item.startedAdventure && {}]}>
            <CircularProgress active={item.startedAdventure}

                              locked={false} size={44} progress={85} strokeWidth={4}/>

            <Pressable onPress={() => {
                setAdventure(item)

            }} style={styles.learnMainCard}>
                <View style={styles.learnMainCardCover}>


                    <Image
                        source={{uri: item.imageUrl}}
                        style={styles.learnMainCardCoverImg}
                    />
                </View>

                <View style={styles.learnCardBody}>
                    <Text style={[styles.missionText, {
                        color: lightText
                    }]}>
                        {item?._count?.modules} missions
                    </Text>

                    <Text style={[styles.titleText, {
                        color: textColor
                    }]}>
                        {item.name}
                    </Text>

                    <View style={styles.rewardPoint}>
                        <Ionicons name="gift" size={14} color={Colors.success}/>
                        <Text style={[styles.rewardPointText, {
                            color: lightText
                        }]}>
                            {item.rewardPoint} Reward Points
                        </Text>
                    </View>


                </View>

                {item?.startedAdventure ?

                    <TouchableOpacity onPress={() => {
                        setAdventure(item)

                    }} style={styles.startBtn}>
                        <Text style={styles.startBtnText}>

                            {item?.status == 'COMPLETED' ? 'Completed' : 'Continue'}
                        </Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => {
                        setAdventure(item)

                    }} style={styles.startBtn}>
                        <Text style={styles.startBtnText}>

                            Start Adventure
                        </Text>
                    </TouchableOpacity>
                }

            </Pressable>

        </Pressable>
    )
}
const AIAdventures = () => {

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice


    const [refreshing, setRefreshing] = useState(false);
    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor


    const keyExtractor = useCallback((item: { id: string }) => item.id, [],);


    const navigation = useNavigation()
    const create = () => {
        navigation.navigate('CreateAIAdventure')
    }

    const selectAdventure = (adventure: {}) => {
        dispatch(setAdventure({adventure}))
        navigation.navigate('AdventureHome')

    }

    const renderItemAi = useCallback(({item}) => (

        <AdventureAICardItem setAdventure={selectAdventure} item={item} theme={theme}/>
    ), [theme])


    const {
        isLoading: loadingAdventures,
        data: adventures,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching
    } = useInfiniteQuery([`getAiAdventure`], ({pageParam = 1}) => getAiAdventure.ai_adventures(pageParam),
        {
            getNextPageParam: lastPage => {
                if (lastPage.next !== null) {
                    return lastPage.next;
                }

                return lastPage;
            },
            getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
        })


    // console.log(allAdventure?.pages[0])


    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    useRefreshOnFocus(refetch)
    return (
        <>


            <TouchableOpacity onPress={create} activeOpacity={0.8} style={styles.createBtn}>
                <AntDesign name="pluscircle" size={14} color={Colors.primaryColor}/>
                <Text style={styles.createBtnText}>
                    Create an adventure with AI
                </Text>
            </TouchableOpacity>

            {!loadingAdventures && adventures?.pages[0]?.data?.result.length < 1 &&
                <EmptyState message={"No AI adventures, create one with the button above"}/>
            }


            {loadingAdventures && <ActivityIndicator size={"small"} color={Colors.primaryColor}/>}

            {!loadingAdventures &&
                <FlashList
                    estimatedItemSize={200}
                    // refreshing={isLoading}
                    //  ListHeaderComponent={renderHeader}
                    onRefresh={refetch}
                    refreshing={loadingAdventures}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    data={adventures?.pages[0]?.data?.result}
                    renderItem={renderItemAi}
                    keyExtractor={keyExtractor}
                    onEndReachedThreshold={0.3}
                    onEndReached={loadMore}
                    ListFooterComponent={isFetchingNextPage ?
                        <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                    /*  refreshControl={
                          <RefreshControl
                              tintColor={Colors.primaryColor}
                              refreshing={refreshing}
                              onRefresh={refresh}
                          />
                      }*/


                />
            }
        </>
    );
};

const styles = StyleSheet.create({
    learnCard: {
        marginVertical: pixelSizeVertical(20),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        height: heightPixel(315),
    },
    learnMainCard: {
        width: widthPixel(285),
        height: heightPixel(315),
        backgroundColor: "#fff",
        shadowColor: "#212121",
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: pixelSizeHorizontal(10),
        borderRadius: 10,
        paddingVertical: 5,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,
        elevation: 3,
    },
    learnMainCardCover: {
        borderRadius: 10,
        height: 120,
        width: '100%',
        overflow: 'hidden'
    },
    learnMainCardCoverImg: {
        objectFit: 'cover',
        borderRadius: 10,
        height: '100%',
        width: '100%'
    },
    learnCardBody: {
        height: 90,
        width: '95%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly'
    },
    missionText: {
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandMedium
    },
    titleText: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quickSandBold
    },
    rewardPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    rewardPointText: {
        marginLeft: 5,
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandMedium
    },
    startBtn: {
        height: 37,

        width: 140,
        borderRadius: 20,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'center',
    },
    startBtnText: {
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quicksandSemiBold
    },
    flatList: {
        width: '100%',

        flex: 1,


    },

    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 30,
        height: 35,
    },
    createBtnText: {
        marginLeft: 5,
        color: Colors.primaryColor,
        fontFamily: Fonts.quicksandSemiBold,
        fontSize: fontPixel(14),
    }
})

export default AIAdventures;
