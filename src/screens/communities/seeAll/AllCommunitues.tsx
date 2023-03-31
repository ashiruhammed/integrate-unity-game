import React, {SetStateAction, useCallback, useMemo, useRef, useState} from 'react';

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
import {Entypo, Ionicons, MaterialIcons} from "@expo/vector-icons";
import SegmentedControl from "../../../components/SegmentContol";
import Colors from "../../../constants/Colors";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";
import {RectButton} from "../../../components/RectButton";
import {SmallRectButton} from "../../../components/buttons/SmallRectButton";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    followACommunity,
     getFollowedCommunities,
    getMyCommunities,
    getPublicCommunities,
    getSingleBadge
} from "../../../action/action";
import CardPublicCommunity from "../../../components/community/PublicCard";
import {setResponse, unSetResponse} from "../../../app/slices/userSlice";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {FlashList} from "@shopify/flash-list";
import {IF} from "../../../helpers/ConditionJsx";
import FollowedCommunities from "./FollowedCommunities";
import {RootStackScreenProps} from "../../../../types";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import Checkbox from "expo-checkbox";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import FastImage from "react-native-fast-image";
import {setCurrentCommunityId} from "../../../app/slices/dataSlice";
import ScrollingButtonMenu from "react-native-scroll-menu";
import {titleCase} from "../../../helpers";


const {width} = Dimensions.get('window')


interface CardProps {
    theme: 'light' | 'dark'
    item: {
        community: {
            name: string,
            displayPhoto: string,
            visibility: string,
            ownerId: string,
            id: string,
        }
    },

    leaveCommunity: (id: string) => void,
    seeCommunity: (id: string, ownerId: string, visibility: string, displayPhoto: string) => void
}

const CardFollowedCommunity = ({theme, item, seeCommunity, leaveCommunity}: CardProps) => {
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    return (
        <TouchableOpacity activeOpacity={0.8}
                          onPress={() => seeCommunity(item.community.id, item.community.ownerId, item.community.visibility,
                              item.community.displayPhoto,)}
                          style={[styles.myCommunityCard, {
                              backgroundColor: theme == 'dark' ? '#141414' : "#fff"
                          }]}>

            <View style={styles.communityLogo}>
                <FastImage
                    style={styles.communityLogoImag}
                    source={{
                        uri: item?.community.displayPhoto,
                        cache: FastImage.cacheControl.web,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />

            </View>

            <View style={styles.bodyCard}>
                <Text style={[styles.cardTitle, {
                    color: textColor
                }]}>
                    {item?.community.name}
                </Text>
                <Text style={[styles.cardTitleSub, {
                    color: textColor
                }]}>
                    {item.totalUsersJoined} Members
                </Text>
            </View>

            <SmallRectButton onPress={() => leaveCommunity(item.community.id)} style={{}}>
                <Text style={styles.buttonText}>
                    Leave

                </Text>
            </SmallRectButton>

        </TouchableOpacity>
    )
}
const AllCommunities = ({navigation}: RootStackScreenProps<'AllCommunities'>) => {

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const user = useAppSelector(state => state.user)
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const {responseState, responseType, responseMessage} = user
    const [terms, setTerms] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);
    const [badgeId, setBadgeId] = useState('');
    const [communityId, setCommunityId] = useState('');
    const [requiredBadges, setRequiredBadges] = useState('');
    const [tabIndex, setTabIndex] = useState('0');
    const handleTabsChange = useCallback((index: SetStateAction<number>) => {
        setTabIndex(index);
    }, [tabIndex]);
    const scrollX = new Animated.Value(0)
    let position = Animated.divide(scrollX, width)

    const [searchValue, setSearchValue] = useState('');


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
        onSettled: () => {
            queryClient.invalidateQueries(['getSingleBadge'])
        }
    })


    const sheetRef = useRef<BottomSheet>(null);

    const sheetRefMore = useRef<BottomSheet>(null);


    // variables
    const snapPoints = useMemo(() => ["1%", "70%"], []);
    const handleSnapPress = useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);


    // variables
    const snapPointsMore = useMemo(() => ["1%", "80%"], []);
    const handleSnapPressMore = useCallback((index: number) => {
        handleClosePress()
        sheetRefMore.current?.snapToIndex(index);
    }, []);
    const handleClosePressMore = useCallback(() => {
        sheetRefMore.current?.close();
    }, []);


    const createCommunity = () => {
        if (terms) {
            handleClosePressMore()
            handleClosePress()
            navigation.navigate('CreateCommunity')
        }
    }

    // renders
    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                style={{
                    backgroundColor: 'rgba(25,25,25,0.34)'
                }}
                {...props}
                disappearsOnIndex={0}
                appearsOnIndex={1}
            />
        ),
        []
    );


    const {
        isLoading: loadingFollowedCommunities,
        data: followedCommunities,
        hasNextPage: hasNextComPage,
        fetchNextPage,
        refetch: refetchCommunities,

        isRefetching: isFetchingCommunities
    } = useInfiniteQuery([`getFollowedCommunities`], ({pageParam = 1}) => getFollowedCommunities.communities(pageParam),
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


    const {
        isLoading: loading,
        data: allMyCommunities,

        refetch: fetchMyCommunity,

    } = useInfiniteQuery([`UserOwnedCommunities`], getMyCommunities.mine,
        {
            networkMode: 'online',
            onSuccess: (data) => {

            }
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

    const leaveCommunity = (communityId: string) => {

        navigation.navigate('LeaveCommunity', {
            id: communityId
        })
    }
    const seeCommunity = (id: string) => {
        dispatch(unSetResponse())
        navigation.navigate('ViewCommunity', {
            id
        })
    }
    const joinModal = useCallback(async (badgeId: string, accessNFTBadgeAmount: string, communityId: string) => {
        await setBadgeId(badgeId)
        setRequiredBadges(accessNFTBadgeAmount)
        setCommunityId(communityId)
        mutate()

    }, [badgeId])
    const followCommunityNow = () => {
        follow({id: communityId})
    }

    const viewTheCommunity = (id: string, ownerId: string, visibility: string, displayPhoto: string) => {

        dispatch(setCurrentCommunityId({
            id,
            currentCommunity: {
                ownerId: ownerId,
                visibility: visibility,
                displayPhoto: displayPhoto
            }
        }))
        navigation.navigate('SeeCommunity', {
            screen: 'ViewCommunity',
            //params:{id:item.id}
        })
    }


    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);

    const renderItem = useCallback(({item}) => (
        <CardPublicCommunity viewTheCommunity={viewTheCommunity} loadingBadge={loadingBadge} joinModal={joinModal}
                             theme={theme} item={item}/>
    ), [loadingBadge, theme, tabIndex])

    const renderItemFollowed = useCallback(({item}) => (
        <CardFollowedCommunity leaveCommunity={leaveCommunity} seeCommunity={viewTheCommunity} theme={theme}
                               item={item}/>
    ), [theme, tabIndex])


    const updateCurrentSlideIndex = (e: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);

    };


    const renderHeaderItem = useCallback(
        ({}) => (
            <>


            </>
        ), [tabIndex])

    const closeModal = () => {
        setModalVisible(false)
    }

    let filterCommunity: readonly any[] | null | undefined = []
    let filterFollowedCommunity: readonly any[] | null | undefined = []

    if (tabIndex == '0') {


        if (!isLoading && data && data?.pages[0]?.data) {
            filterCommunity = data?.pages[0]?.data?.result?.filter((community: { name: string | string[]; }) =>
                community?.name?.includes(titleCase(searchValue).trim())
            )
        }
    }
    if (tabIndex == '1') {


        if (!isLoading && data && data?.pages[0]?.data) {
            filterFollowedCommunity = followedCommunities?.pages[0]?.data?.result?.filter((community: { community: { name: string | string[]; } }) =>
                community?.community.name?.includes(titleCase(searchValue).trim())
            )
        }
    }


    return (

        <>
            <SafeAreaView style={[styles.safeArea, {
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
                                 value={searchValue} onChangeText={(e) => setSearchValue(e)}/>

                    <View style={[styles.searchTangible, {
                        borderColor
                    }]}>
                        <Ionicons name="md-search-outline" size={20} color="#666666"/>
                    </View>
                </View>

                <View style={styles.segmentWrap}>
                    <ScrollingButtonMenu
                        items={[
                            {
                                id: "0",
                                name: 'All Communities',
                            },
                            {
                                id: "1",
                                name: 'Followed communities',
                            },
                            {
                                id: "2",
                                name: 'My Communities',
                            },

                        ]}
                        textStyle={{
                            fontSize: fontPixel(12),
                            textAlign: 'center',
                            color:textColor,
                            fontFamily:Fonts.quicksandSemiBold
                        }}
                        activeBackgroundColor={Colors.primaryColor}
                        buttonStyle={styles.tabButtonStyle}
                        onPress={(e: { id: React.SetStateAction<string>; }) => {
                            setTabIndex(e.id)
                        }}
                        selected={tabIndex}
                    />
                </View>


                {
                    tabIndex == '0'
                    &&
                    <View style={styles.ActivityCardTop}>
                        <Text style={[styles.listTitle, {
                            color: textColor
                        }]}>
                            Public Communities
                        </Text>
                    </View>
                }
                {
                    tabIndex == '1'
                    &&
                    <View style={styles.ActivityCardTop}>
                        <Text style={[styles.listTitle, {
                            color: textColor
                        }]}>
                            My Communities
                        </Text>
                    </View>
                }


                {
                    isLoading && <ActivityIndicator size='small' color={Colors.primaryColor}/>
                }
                {
                    loading && <ActivityIndicator size='small' color={Colors.primaryColor}/>
                }

                <IF condition={tabIndex == '0'}>
                    <View style={styles.listWrap}>
                        {/*    */}


                        <FlatList


                            refreshing={isLoading}
                            onRefresh={refetch}
                            scrollEnabled
                            showsVerticalScrollIndicator={false}
                            data={filterCommunity}
                            renderItem={renderItem}
                            onEndReached={loadMore}
                            keyExtractor={keyExtractor}
                            onEndReachedThreshold={0.3}
                            ListFooterComponent={isFetchingNextPage ?
                                <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                        />


                    </View>
                </IF>
                <IF condition={tabIndex == '1'}>
                    <View style={styles.listWrap}>


                        {


                            <FlatList
                                ListHeaderComponent={renderHeaderItem}
                                ListHeaderComponentStyle={{

                                    alignItems: 'center',
                                    width: '100%'
                                }
                                }

                                refreshing={loadingFollowedCommunities}
                                onRefresh={refetchCommunities}
                                scrollEnabled
                                showsVerticalScrollIndicator={false}
                                data={filterFollowedCommunity}
                                renderItem={renderItemFollowed}

                                keyExtractor={keyExtractor}
                                onEndReachedThreshold={0.3}
                                ListFooterComponent={loading ?
                                    <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                            />
                        }


                    </View>
                </IF>
                <IF condition={tabIndex == '2'}>
                    <View style={styles.listWrap}>


                        <View style={styles.startCommunity}>
                            <Text style={[styles.TextTitle, {
                                color: textColor
                            }]}>
                                Create your own Community
                            </Text>
                            <RectButton onPress={() => handleSnapPress(1)} style={{
                                width: 190
                            }}>
                                <Text style={styles.buttonText}>
                                    Create Community
                                </Text>
                            </RectButton>


                        </View>
                        {


                            <FlatList


                                refreshing={isLoading}
                                onRefresh={refetch}
                                scrollEnabled
                                showsVerticalScrollIndicator={false}
                                data={allMyCommunities?.pages[0]?.data?.result}
                                renderItem={renderItem}
                                onEndReached={loadMore}
                                keyExtractor={keyExtractor}
                                onEndReachedThreshold={0.3}
                                ListFooterComponent={loading ?
                                    <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                            />
                        }


                    </View>
                </IF>


            </SafeAreaView>


            <BottomSheet
                index={0}


                backdropComponent={renderBackdrop}
                ref={sheetRef}
                snapPoints={snapPoints}
                style={{
                    paddingHorizontal: pixelSizeHorizontal(20)
                }}
                backgroundStyle={{
                    backgroundColor,
                }}
                handleIndicatorStyle={[{
                    backgroundColor: theme == 'light' ? "#121212" : '#cccccc'
                }, Platform.OS == 'android' && {display: 'none'}]}
            >
                <BottomSheetView style={styles.sheetContainer}>
                    <View style={styles.popSheetHead}>

                        <Text style={[styles.sheetTitle, {
                            color: textColor
                        }]}>
                            Create a Community Group
                        </Text>

                        {
                            Platform.OS == 'android' &&
                            <TouchableOpacity activeOpacity={0.8} onPress={() => handleClosePress()}
                                              style={styles.dismiss}>
                                <Ionicons name="ios-close" size={24} color="black"/>
                            </TouchableOpacity>
                        }
                    </View>

                    <View style={styles.sheetBody}>
                        <Text style={[styles.bodyText, {
                            color: textColor
                        }]}>
                            The Community page allows gateway learners
                            to find the best communities to join and learn
                            with their tribe. All learners are in various
                            locations worldwide with every individual
                            having unique interests. Communities connect
                            them together!
                        </Text>
                        <Text style={[styles.bodyText, {
                            color: textColor
                        }]}>
                            Do you want to start a community for your
                            group, country or specific topic to make
                            learning more fun & engaging for gateway
                            learners? To ensure the safety of our learners,
                            we have curated a list of requirements and
                            guidelines to create a community page on the
                            gateway.

                        </Text>

                        <Text onPress={() => handleSnapPressMore(1)} style={[styles.bodyText, {
                            color: "#1579E4",
                            fontFamily: Fonts.quicksandMedium,
                            textDecorationLine: "underline"
                        }]}>
                            See requirements and guidelines here.
                        </Text>
                    </View>


                    <TouchableOpacity activeOpacity={0.9} onPress={() => setTerms(!terms)} style={styles.terms}>
                        <View style={styles.checkboxContainer}>


                            <Checkbox
                                // style={styles.checkbox}
                                value={terms}
                                onValueChange={(value) => setTerms(value)}
                                color={terms ? Colors.primaryColor : undefined}
                            />
                        </View>


                        <View style={styles.termsText}>
                            <Text style={{
                                color: textColor,
                                fontFamily: Fonts.quicksandRegular,
                                lineHeight: heightPixel(20)
                            }}>
                                By creating an account, you agree to the terms of
                                use and privacy policy.
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <RectButton onPress={createCommunity} style={{
                        width: 200
                    }}>
                        <Text style={{
                            position: 'absolute',
                            fontSize: fontPixel(16),
                            color: "#fff",
                            fontFamily: Fonts.quickSandBold
                        }}>
                            Continue

                        </Text>

                    </RectButton>

                </BottomSheetView>
            </BottomSheet>


            <BottomSheet
                index={0}

                backdropComponent={renderBackdrop}
                ref={sheetRefMore}
                snapPoints={snapPointsMore}
                style={{
                    paddingHorizontal: pixelSizeHorizontal(20)
                }}
                backgroundStyle={{
                    backgroundColor,
                }}
                handleIndicatorStyle={[{
                    backgroundColor: theme == 'light' ? "#121212" : '#cccccc'
                }, Platform.OS == 'android' && {display: 'none'}]}
            >
                <BottomSheetView style={styles.sheetContainer}>
                    <View style={styles.popSheetHead}>

                        <Text style={[styles.sheetTitle, {
                            color: textColor
                        }]}>
                            Requirements and Guidelines
                        </Text>

                        {
                            Platform.OS == 'android' &&

                            <TouchableOpacity activeOpacity={0.8} onPress={() => handleClosePressMore()}
                                              style={styles.dismiss}>
                                <Ionicons name="ios-close" size={24} color="black"/>
                            </TouchableOpacity>
                        }


                    </View>

                    <View style={styles.sheetBody}>


                        <View style={styles.list}>
                            <Entypo name="dot-single" size={20} color="black"/>
                            <Text style={[styles.bodyText, {
                                color: textColor
                            }]}>
                                Existing communities built primarily for
                                education with more than 1000 members
                                can create a community page.
                            </Text>
                        </View>
                        <View style={styles.list}>
                            <Entypo name="dot-single" size={20} color="black"/>
                            <Text style={[styles.bodyText, {
                                color: textColor
                            }]}>
                                Your account should be at least 3 months
                                old, with constant user activities.
                            </Text>
                        </View>
                        <View style={styles.list}>
                            <Entypo name="dot-single" size={20} color="black"/>
                            <Text style={[styles.bodyText, {
                                color: textColor
                            }]}>
                                If you do not have an existing community
                                and will like to create a new one on
                                gateway.
                            </Text>
                        </View>
                        <View style={styles.list}>
                            <Entypo name="dot-single" size={20} color="black"/>
                            <Text style={[styles.bodyText, {
                                color: textColor
                            }]}>
                                The community topic should reflect and
                                further discussions around adventures on
                                gateway.
                            </Text>
                        </View>
                        <View style={styles.list}>
                            <Entypo name="dot-single" size={20} color="black"/>
                            <Text style={[styles.bodyText, {
                                color: textColor
                            }]}>
                                Product-centric communities cannot create
                                a community page except if they have
                                been featured in one of gateway
                                adventures.
                            </Text>
                        </View>
                        <View style={styles.list}>
                            <Entypo name="dot-single" size={20} color="black"/>
                            <Text style={[styles.bodyText, {
                                color: textColor
                            }]}>
                                Product advertising in communities is not
                                allowed and will be deleted except if they
                                have been featured in one of gateway
                                adventures.

                            </Text>
                        </View>
                    </View>


                    <RectButton onPress={createCommunity} style={{
                        width: 200
                    }}>
                        <Text style={{
                            position: 'absolute',
                            fontSize: fontPixel(16),
                            color: "#fff",
                            fontFamily: Fonts.quickSandBold
                        }}>
                            Ok, i understand

                        </Text>

                    </RectButton>

                </BottomSheetView>
            </BottomSheet>


        </>
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
        alignItems: 'center',
        backgroundColor: "#fff",

    },
    segmentWrap: {
        height: heightPixel(60),
        width: '95%',
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


    cardTitleSub: {
        fontFamily: Fonts.quicksandRegular,
        color: Colors.light.text,
        fontSize: fontPixel(16)
    },
    ActivityCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '85%',
        height: heightPixel(70),
    },
    listTitle: {
        fontSize: fontPixel(16),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
    },
    listWrap: {
        width: '90%',
alignItems:'center',
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

        backgroundColor: "#fff",
        borderRadius: 30,
        height: 35,
        width: 35,
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


    myCommunityCard: {
        width: '100%',
        height: heightPixel(80),
        shadowColor: "#212121",
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginVertical: pixelSizeVertical(5),
        borderRadius: 10,
        padding: 15,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,

        elevation: 3,
    },
    communityLogo: {
        height: 50,
        width: 50,
        borderRadius: 5,
        backgroundColor:Colors.primaryColor
    },
    communityLogoImag: {
        height: '100%',
        width: '100%',
        borderRadius: 5,
        resizeMode: 'cover'
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
    startCommunity: {
        width: '100%',
        height: heightPixel(100),
        borderRadius: 10,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderStyle: 'dashed',

        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    TextTitle: {

        fontSize: fontPixel(16),
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold
    },

    sheetContainer: {
        width: '100%',
        alignItems: 'center',
        // paddingHorizontal: pixelSizeHorizontal(20)
    },
    sheetBody: {
        width: '100%',

    },
    bodyText: {
        marginVertical: pixelSizeVertical(5),
        textAlign: 'justify',
        fontFamily: Fonts.quicksandRegular,
        fontSize: fontPixel(14),
        color: Colors.light.text
    },
    terms: {
        width: '100%',
        height: heightPixel(100),
        alignItems: 'flex-start',
        justifyContent: 'center',

        flexDirection: 'row'
    },
    checkboxContainer: {
        height: '90%',
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    termsText: {
        height: '100%',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    list: {

        // flexWrap:'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '90%',

        marginVertical: pixelSizeVertical(10)
    },
    sheetTitle: {
        //width: '70%',
        textAlign: 'center',
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
        color: "#000000"
    },
    popSheetHead: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    tabButtonStyle:{
        borderWidth:0,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 0,
    }
})

export default AllCommunities;
