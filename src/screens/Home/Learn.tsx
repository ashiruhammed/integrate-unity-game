import React, {SetStateAction, useCallback, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Platform,
    TouchableOpacity,
    ImageBackground,
    Pressable,
    Image,
    RefreshControl, ActivityIndicator
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useInfiniteQuery, useQuery, useQueryClient} from "@tanstack/react-query";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {AntDesign, Ionicons, Octicons} from "@expo/vector-icons";
import {aiAdventures, getAllAdventure, getUserDashboard, userNotifications} from "../../action/action";
import {RootTabScreenProps} from "../../../types";
import ScrollingButtonMenu from "react-native-scroll-menu";
import SegmentedControl from "../../components/segment-control/SegmentContol";
import CircularProgress from "../../components/ProgressBar";
import {FlashList} from "@shopify/flash-list";
import {IF} from "../../helpers/ConditionJsx";
import AIAdventures from "../learn/AIAdvenrures";
import {useRefreshOnFocus} from "../../helpers";
import {setAdventure} from "../../app/slices/dataSlice";
import FastImage from "react-native-fast-image";
import EmptyState from "../../components/EmptyState";


interface props {
    item: {
        imageUrl: string,
        name: string,
        rewardPoint: number,
        startedAdventure: boolean,

    },
    setAdventure: (adventure: {}) => void
    theme: string
}

const LearnCardItem = ({item, theme, setAdventure}: props) => {
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
                    <FastImage
                        style={styles.learnMainCardCoverImg}
                        source={{
                            uri: !item.imageUrl ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : item.imageUrl.replace(/^http:\/\//i, 'https://'),

                            cache: FastImage.cacheControl.web,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
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


const Learn = ({navigation}: RootTabScreenProps<'Learn'>) => {


    const [tabIndex, setTabIndex] = useState(0);
    const handleTabsChange = (index: SetStateAction<number>) => {
        setTabIndex(index);
        //  setScreen(index === 0 ? 'Banks' : 'Wallets')
    };

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const user = useAppSelector(state => state.user)
    const {userData, responseState, responseType, responseMessage} = user
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice


    const [refreshing, setRefreshing] = useState(false);
    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor


    const {data, isLoading} = useQuery(['aiAdventures'], aiAdventures)
    const {
        isLoading: loadingUser,
        data: userDashboard,
        refetch: fetchDashboard
    } = useQuery(['getUserDashboard'], getUserDashboard, {})


    const {
        isLoading: loadingAdventures,
        data: allAdventure,
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

    // console.log(allAdventure?.pages[0])
    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    const openNotifications = () => {
        navigation.navigate('Notifications')
    }

    const {
        data: notifications,

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

    const keyExtractor = useCallback((item: { id: string }) => item.id, [],);
    const selectAdventure = (adventure: {}) => {
        dispatch(setAdventure({adventure}))
        navigation.navigate('AdventureHome')

    }

    const renderItem = useCallback(({item}) => (

        <LearnCardItem setAdventure={selectAdventure} item={item} theme={theme}/>
    ), [theme])


    useRefreshOnFocus(refetch)

    return (
        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
            <View style={styles.topBar}>

                <View style={styles.leftButton}>

                    <View style={styles.pointWrap}>
                        <Ionicons name="gift" size={16} color="#22BB33"/>
                        <Text style={styles.pointsText}>{userDashboard?.data?.totalPoint}</Text>
                    </View>
                </View>

                <View style={styles.rightButton}>

                    <ImageBackground style={styles.streaKIcon} resizeMode={'contain'}
                                     source={require('../../assets/images/streakicon.png')}>
                        <Text style={styles.streakText}> {userDashboard?.data?.currentDayStreak}</Text>
                    </ImageBackground>

                    <TouchableOpacity onPress={openNotifications} activeOpacity={0.6}
                                      style={styles.roundTopBtn}>
                        {
                            notifications?.pages[0]?.data?.result.some((obj: { isRead: boolean; }) => !obj.isRead) &&
                            <View style={styles.dot}/>
                        }
                        <Octicons name="bell-fill" size={22} color={"#000"}/>
                    </TouchableOpacity>

                </View>

            </View>

            <View style={styles.pageTitleWrap}>
                <Text style={[styles.pageTitle, {
                    color: textColor
                }]}>
                    Learn
                </Text>
            </View>


            <View style={styles.segmentWrap}>

                <SegmentedControl tabs={["Gateway Adventures", "AI Generated Adventures"]}
                                  currentIndex={tabIndex}
                                  onChange={handleTabsChange}
                                  segmentedControlBackgroundColor={"#fff"}
                                  activeSegmentBackgroundColor={Colors.primaryColor}
                                  activeTextColor={textColor}
                                  textColor={"#AFAFAF"}
                                  paddingVertical={pixelSizeVertical(10)}/>

            </View>

            <IF condition={tabIndex === 0}>
                <View style={styles.flatList}>

                    {!loadingAdventures && allAdventure?.pages[0]?.data?.result.length < 1 &&
                        <EmptyState message={"No adventures available yet"}/>
                    }

                    {loadingAdventures && <ActivityIndicator size={"small"} color={Colors.primaryColor}/>}
                    {!loadingAdventures && allAdventure?.pages[0]?.data?.result.length > 0 &&
                        <FlashList
                            estimatedItemSize={200}
                            // refreshing={isLoading}
                            //  ListHeaderComponent={renderHeader}

                            scrollEnabled
                            showsVerticalScrollIndicator={false}
                            data={allAdventure?.pages[0]?.data?.result}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor}
                            onEndReachedThreshold={0.3}
                            ListFooterComponent={isFetchingNextPage ?
                                <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                            /*refreshControl={
                                <RefreshControl
                                    tintColor={Colors.primary}
                                    refreshing={refreshing}
                                    onRefresh={refresh}
                                />
                            }*/


                        />
                    }
                </View>
            </IF>

            <IF condition={tabIndex === 1}>
                <View style={styles.flatList}>

                    <AIAdventures/>

                </View>
            </IF>


        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#FEF1F1",
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    pageTitleWrap: {
        width: '90%',
        marginVertical: pixelSizeVertical(10),
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    pageTitle: {
        fontSize: fontPixel(24),
        fontFamily: Fonts.quickSandBold
    },

    topBar: {
        paddingHorizontal: pixelSizeHorizontal(15),
        width: '100%',
        height: heightPixel(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    leftButton: {
        width: '60%',
        height: '100%',
        justifyContent: 'center',

        alignItems: 'flex-start',
    },
    pointWrap: {
        height: 25,
        paddingHorizontal: pixelSizeHorizontal(10),
        borderRadius: 10,
        minWidth: widthPixel(70),
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'row',
        backgroundColor: "#181818"

    },
    pointsText: {
        color: "#fff",
        marginLeft: 5,
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandSemiBold
    },
    rightButton: {
        width: widthPixel(100),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    streaKIcon: {
        marginRight: 10,
        width: 25,
        resizeMode: 'center',
        height: '100%',
        alignItems: "center",
        justifyContent: "center"
    },
    streakText: {
        marginTop: 10,
        fontSize: fontPixel(12),
        color: "#fff",
        fontFamily: Fonts.quicksandMedium
    },
    roundTopBtn: {
        width: 40,
        height: 40,
        borderRadius: 40,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        position: 'absolute',
        width: 10,
        height: 10,
        top: 5,
        zIndex: 1,
        right: 10,
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: Colors.errorRed,
        borderRadius: 15,
    },
    tabButtonStyle: {
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 0,
    },
    segmentWrap: {
        height: heightPixel(60),
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
    },

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

export default Learn;
