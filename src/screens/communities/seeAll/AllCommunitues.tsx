import React, {SetStateAction, useCallback, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Platform,
    Animated,
    Dimensions,
    TouchableOpacity,
    FlatList,
    ActivityIndicator, Modal, Alert, Image
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import NavBar from "../../../components/layout/NavBar";
import SearchValue from "../../../components/inputs/SearchInput";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import SegmentedControl from "../../../components/SegmentContol";
import Colors from "../../../constants/Colors";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";
import {RectButton} from "../../../components/RectButton";
import {SmallRectButton} from "../../../components/buttons/SmallRectButton";
import {useInfiniteQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {followACommunity, getBadge, getPublicCommunities, getSingleBadge} from "../../../action/action";
import CardPublicCommunity from "../../../components/community/PublicCard";
import {setResponse} from "../../../app/slices/userSlice";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {FlashList} from "@shopify/flash-list";
import {IF} from "../../../helpers/ConditionJsx";


const {width} = Dimensions.get('window')
const AllCommunities = () => {

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const user = useAppSelector(state => state.user)
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const {responseState, responseType, responseMessage} = user

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);
    const [badgeId, setBadgeId] = useState('');
    const [communityId, setCommunityId] = useState('');
    const [requiredBadges, setRequiredBadges] = useState('');
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabsChange = useCallback((index: SetStateAction<number>) => {
        setTabIndex(index);
    }, [tabIndex]);
    const scrollX = new Animated.Value(0)
    let position = Animated.divide(scrollX, width)


    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'


    const {
        isLoading: loadingBadge,
        data: badge,
        mutate,
        isSuccess
    } = useMutation(['getSingleBadge'], () => getSingleBadge(badgeId), {

        onSuccess: (data) => {
            if (data.success) {


                    setModalVisible(true)

            }

        },
        onSettled:()=>{
            queryClient.invalidateQueries(['getSingleBadge'])
        }
    })



    const {
        isLoading,
        data,
        hasNextPage,
        fetchNextPage: fetchNextPageWallet,
        isFetchingNextPage,
        refetch,

        isRefetching
    } = useInfiniteQuery([`getPublicCommunities`], ({pageParam = 1}) => getPublicCommunities.communities(pageParam),
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

    const {isLoading: following, mutate: follow} = useMutation(['followACommunity'], followACommunity, {

        onSuccess: (data) => {
            if (data.success) {
                refetch()
                setModalVisible(false)
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'success',
                }))

            } else {
                setModalVisible(false)
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'error',
                }))
            }
        }
    })
    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPageWallet();
        }
    };

    const joinModal = useCallback(async (badgeId: string, accessNFTBadgeAmount: string, communityId: string) => {
        await setBadgeId(badgeId)
        setRequiredBadges(accessNFTBadgeAmount)
        setCommunityId(communityId)
        mutate()

    },[badgeId])
    const followCommunityNow = () => {
        follow({id: communityId})
    }

    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);

    const renderItem = useCallback(({item}) => (
        <CardPublicCommunity loadingBadge={loadingBadge} joinModal={joinModal} theme={theme} item={item}/>
    ), [loadingBadge])


    const updateCurrentSlideIndex = (e: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);

    };

    const closeModal = () => {
        setModalVisible(false)
    }


    const [searchValue, setSearchValue] = useState('');


    return (
        <SafeAreaView style={[styles.safeArea,{
            backgroundColor
        }]}>


            <Modal

                animationType="slide"
                transparent={true}
                visible={modalVisible}

                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(false);
                }}
            >
                <View style={styles.backDrop}>
                    <View style={styles.modalContainer}>

                        <View style={styles.sheetHead}>

                            <TouchableOpacity activeOpacity={0.8} onPress={closeModal}
                                              style={styles.dismiss}>
                                <Ionicons name="ios-close" size={24} color="#929292"/>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.modalBody}>

                            <Text style={styles.missionText}>
                                Requirements
                            </Text>
                            <View style={styles.dripImageWrap}>
                                <Image
                                    source={{uri: badge?.data?.imageUrl}}
                                    style={styles.dripImage}/>
                            </View>


                            <View style={styles.textWrap}>
                                <Text style={styles.missionText}>
                                    {badge?.data?.title}
                                </Text>

                                <Text style={[styles.learnText, {
                                    textAlign: 'center'
                                }]}>
                                    <Text style={{
                                        color: Colors.errorRed
                                    }}>Note:</Text> x{requiredBadges} amount of badge will
                                    be deducted from your account
                                </Text>
                            </View>

                        </View>


                        <RectButton onPress={followCommunityNow} style={{
                            width: 220,
                        }}>
                            {
                                following ? <ActivityIndicator size='small' color={"#fff"}/> :

                                    <Text style={styles.buttonText}>
                                        Use {badge?.data?.title}
                                    </Text>
                            }
                        </RectButton>

                    </View>
                </View>
            </Modal>
            <NavBar title={"Community"}/>
            <View style={styles.searchWrap}>

                <SearchValue isWidth={"80%"} placeholder={'Search for all types of Communities'}
                             value={searchValue}/>

                <View style={[styles.searchTangible,{
                    borderColor
                }]}>
                    <Ionicons name="md-search-outline" size={20} color="#666666"/>
                </View>
            </View>

            <View style={styles.segmentWrap}>
                <SegmentedControl tabs={["All Communities", "My Communities"]}
                                  currentIndex={tabIndex}
                                  onChange={handleTabsChange}
                                  segmentedControlBackgroundColor={backgroundColor}
                                  activeSegmentBackgroundColor={Colors.primaryColor}
                                  activeTextColor={"#fff"}
                                  textColor={"#888888"}
                                  paddingVertical={pixelSizeVertical(8)}/>
            </View>


            <IF condition={tabIndex == 0}>
                <View style={styles.listWrap}>
                    <View style={styles.ActivityCardTop}>
                        <Text style={[styles.listTitle,{
                            color: textColor
                        }]}>
                            Public Communities
                        </Text>

                    </View>


                    {
                        isLoading && <ActivityIndicator size='small' color={Colors.primaryColor}/>
                    }


                    {
                        !isLoading && data && data?.pages[0]?.data?.result.length > 0 &&


                        <FlashList


                            estimatedItemSize={200}
                            refreshing={isLoading}
                            onRefresh={refetch}
                            scrollEnabled
                            showsVerticalScrollIndicator={false}
                            data={data?.pages[0]?.data?.result?.slice(0,8)}
                            renderItem={renderItem}
                            onEndReached={loadMore}
                            keyExtractor={keyExtractor}
                            onEndReachedThreshold={0.3}
                            ListFooterComponent={isFetchingNextPage ?
                                <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                        />
                    }


                </View>
            </IF>


        </SafeAreaView>
    );
};


const CommunityData = [
    {
        id: "1",

    },
    {
        id: "2"
    }
]

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
alignItems:'center',
        backgroundColor: "#fff",
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    segmentWrap: {
        height: heightPixel(60),
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
    },
    searchWrap: {
        height: heightPixel(90),
        width: '90%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
    },
    searchTangible: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: "#DEE6ED",
        borderWidth: 1,
        borderRadius: 10,

    },
    myCommunityCard: {
        width: '90%',
        height: heightPixel(80),
        shadowColor: "#212121",
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: pixelSizeHorizontal(10),
        marginVertical: pixelSizeVertical(5),
        borderRadius: 10,
        padding: 15,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,
        backgroundColor: '#fff',
        elevation: 3,
    },
    communityLogo: {
        height: 50,
        width: 50,
        borderRadius: 5,
        backgroundColor: "blue"
    },
    bodyCard: {

        marginLeft: 10,
        width: '60%',
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
    },
    cardTitle: {
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text,
        fontSize: fontPixel(16)
    },
    cardTitleSub: {
        fontFamily: Fonts.quicksandRegular,
        color: Colors.light.text,
        fontSize: fontPixel(16)
    },
    ActivityCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        height: heightPixel(70),
    },
    listTitle: {
        fontSize: fontPixel(16),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
    },
    listWrap: {
        width: '90%',

        flex: 1,

    },
    buttonText: {
        marginLeft: 5,
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },


    backDrop: {
        width: '100%',
        flex: 1,
        backgroundColor: 'rgba(5,5,5,0.80)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderRadius: 20,
        backgroundColor: '#fff',
        paddingHorizontal: pixelSizeHorizontal(20),
        height: heightPixel(385)
    },
    modalBody: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',

        height: heightPixel(245)
    },


    sheetHead: {
        height: 50,
        top: -15,
        position: 'absolute',
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },

    dismiss: {
        right: -30,
        backgroundColor: "#fff",
        borderRadius: 30,
        height: 45,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.10,
        shadowRadius: 7.22,

        elevation: 3,
    },


    textWrap: {
        height: 110,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',

    },
    missionText: {
        fontSize: fontPixel(16),
        color: Colors.light.darkText,
        fontFamily: Fonts.quicksandMedium
    },


    dripImageWrap: {
        width: 80,
        height: 80,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',

    },

    dripImage: {

        resizeMode: 'contain',
        width: "90%",
        height: "100%",
    },
    learnText: {
        //  lineHeight: heightPixel(24),
        fontSize: fontPixel(16),
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold
    },
})

export default AllCommunities;
