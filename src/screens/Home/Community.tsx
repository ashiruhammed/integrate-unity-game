import React, {SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import ScrollingButtonMenu from 'react-native-scroll-menu';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Platform,
    TouchableOpacity,
    Image,
    Animated,
    Dimensions, FlatList, Modal, Alert, ActivityIndicator, RefreshControl
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

import TopBar from "../../components/layout/TopBar";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import TextInput from "../../components/inputs/TextInput";
import SearchValue from "../../components/inputs/SearchInput";
import Colors from "../../constants/Colors";
import {Entypo, Ionicons} from "@expo/vector-icons";
import SegmentedControl from "../../components/SegmentContol";
import {Fonts} from "../../constants/Fonts";
import {RectButton} from "../../components/RectButton";

import PrivateCommunity from "../../components/community/PrivateCommunity";
import PublicCommunity from "../../components/community/PublicCommunity";
import {RootTabScreenProps} from "../../../types";
import {IF} from "../../helpers/ConditionJsx";
import {SmallRectButton} from "../../components/buttons/SmallRectButton";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {Portal} from '@gorhom/portal';
import Checkbox from 'expo-checkbox';
import viewCommunity from "../communities/ViewCommunity";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import AdventuresIcon from "../../assets/images/tabs/home/AdventuresIcon";
import Toast from "../../components/Toast";
import {unSetResponse} from "../../app/slices/userSlice";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getAllCommunities, getFollowedCommunities, getMyCommunities, getPublicCommunities} from "../../action/action";
import {titleCase, useRefreshOnFocus} from "../../helpers";
import CardPublicCommunity from "../../components/community/PublicCard";
import {setCurrentCommunityId} from "../../app/slices/dataSlice";
import InActiveCard from "../../components/community/InActiveCard";


const wait = (timeout: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};

const {width} = Dimensions.get('window')
const Community = ({navigation, route}: RootTabScreenProps<'Community'>) => {

    const {newTabIndex } = route.params

    const [tabIndex1, setTabIndex1] = useState<string>( '0');
    const dispatch = useAppDispatch()
    const dataSlice = useAppSelector(state => state.data)
    const user = useAppSelector(state => state.user)
    const {theme} = dataSlice
    const {responseState, responseType, responseMessage} = user
    const [terms, setTerms] = useState(false);





    const [refreshing, setRefreshing] = useState(false);
    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text



    const [searchValue, setSearchValue] = useState('');

    const seeAllPublic = () => {
        navigation.navigate('AllCommunities')
    }


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


    const {
        isLoading,
        data,
        hasNextPage,
        fetchNextPage: fetchNextPageWallet,
        isFetchingNextPage,
        refetch,

        isRefetching
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

    useEffect(() => {
        setTabIndex1(newTabIndex)
    }, [newTabIndex]);


    const {
        isLoading: loading,
        data: allMyCommunities,

        refetch: fetchMyCommunity,

    } = useQuery([`MyCommunities`], getMyCommunities.mine,
        {
            networkMode: 'online',
            onSuccess: (data) => {

            }
        })

    const {
        isLoading:loadingPending,
        data:pendingCommunities,

        refetch:fetchPendingCommunities,


    } = useInfiniteQuery([`getAllCommunitiesPending`], ({pageParam = 1}) => getAllCommunities.communities( 'PENDING'),
        {
            networkMode: 'online',
            getNextPageParam: lastPage => {
                if (lastPage.next !== null) {
                    return lastPage.next;
                }

                return lastPage;
            },
            onSuccess: (data) => {
                // console.log(data.pages[0].data)
            },
            getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
        })

    const {
        isLoading:loadingDeclined,
        data:declinedCommunities,

        refetch:fetchDeclinedCommunities,


    } = useInfiniteQuery([`getAllCommunitiesDeclined`], ({pageParam = 1}) => getAllCommunities.communities( 'DECLINED'),
        {
            networkMode: 'online',
            getNextPageParam: lastPage => {
                if (lastPage.next !== null) {
                    return lastPage.next;
                }

                return lastPage;
            },
            onSuccess: (data) => {
                // console.log(data.pages[0].data)
            },
            getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
        })


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

    const createCommunity = () => {
        if (terms) {
            handleClosePressMore()
            handleClosePress()
            navigation.navigate('CreateCommunity')
        }
    }




    const seeCommunity = (id: string, ownerId: string, visibility: string, displayPhoto: string) => {
        dispatch(unSetResponse())
        dispatch(setCurrentCommunityId({
            id: id,
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

    const refresh = () => {
        setRefreshing(true)
        refetch()

        wait(2000).then(() => setRefreshing(false));
    }


    const leaveCommunity = (communityId: string) => {

        navigation.navigate('LeaveCommunity', {
            id: communityId
        })


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

    const joinModal = () => {

    }
    useEffect(() => {
        // console.log(user)
        let time: NodeJS.Timeout | undefined;
        if (responseState || responseMessage) {

            time = setTimeout(() => {
                dispatch(unSetResponse())
            }, 3000)

        }
        return () => {
            clearTimeout(time)
        };
    }, [responseState, responseMessage])

    let filteredCommunity, filteredOwnCommunity: readonly any[] | null | undefined = []




    if (tabIndex1 == '1') {
        if (!isLoading && data && data?.pages[0]?.data) {
            filteredCommunity = data?.pages[0]?.data?.result.filter((community: { community: { name: string | string[]; } }) =>
                community?.community.name?.includes(titleCase(searchValue).trim())
            )
        }
    }

    if (tabIndex1 == '2') {
        if (!loading && allMyCommunities && allMyCommunities?.data?.result) {
            filteredOwnCommunity = allMyCommunities?.data?.result.filter((community: { name: string | string[]; }) =>
                community?.name?.includes(titleCase(searchValue).trim())
            )
        }
    }


    useRefreshOnFocus(fetchMyCommunity)
    useRefreshOnFocus(refetch)
    useRefreshOnFocus(fetchPendingCommunities)
    useRefreshOnFocus(fetchDeclinedCommunities)


    return (
        <>

            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>

                <ScrollView
                    refreshControl={<RefreshControl tintColor={Colors.borderColor}
                                                    refreshing={refreshing} onRefresh={refresh}/>}
                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>
                    <TopBar title="Community"/>

                    <View style={styles.searchWrap}>

                        <SearchValue isWidth={"85%"} onChangeText={(text) => setSearchValue(text)}
                                     placeholder={'Search for all types of Communities'}
                                     value={searchValue}/>

                        <View style={[styles.searchTangible, {
                            borderColor: theme == 'light' ? "#DEE6ED" : Colors.dark.borderColor
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
                                {
                                    id: "3",
                                    name: 'Pending',
                                },
                                {
                                    id: "4",
                                    name: 'Declined',
                                },
                            ]}
                            containerStyle={{width:'110%',}}
                            textStyle={{
                                fontSize: fontPixel(12),
                                textAlign: 'center',
                                color:textColor,
                                fontFamily:Fonts.quicksandSemiBold
                            }}

                            activeBackgroundColor={Colors.primaryColor}
                            buttonStyle={styles.tabButtonStyle}
                            onPress={(e: { id: React.SetStateAction<string>; }) => {
                                setTabIndex1(e.id)
                            }}
                            selected={tabIndex1}
                        />

                    </View>

                    {
                        !isLoading &&
                        <>

                            <IF condition={tabIndex1 == '0'}>
                                <View style={styles.ActivityCardTop}>
                                    <Text style={[styles.listTitle, {
                                        color: textColor
                                    }]}>
                                        Public Communities
                                    </Text>
                                    <TouchableOpacity onPress={seeAllPublic
                                    } activeOpacity={0.7} style={styles.seeAll}>
                                        <Text style={[styles.tintText, {
                                            color: textColor
                                        }]}>See all</Text>

                                    </TouchableOpacity>
                                </View>
                                <View style={styles.cardContainer}>
                                    <PublicCommunity searchValue={searchValue} theme={theme}/>

                                </View>

                                <View style={styles.ActivityCardTop}>
                                    <Text style={[styles.listTitle, {
                                        color: textColor
                                    }]}>
                                        Private Communities
                                    </Text>
                                    <TouchableOpacity onPress={seeAllPublic
                                    } activeOpacity={0.7} style={styles.seeAll}>
                                        <Text style={[styles.tintText, {
                                            color: textColor
                                        }]}>See all</Text>

                                    </TouchableOpacity>
                                </View>


                                <View style={styles.cardContainer}>
                                    <PrivateCommunity searchValue={searchValue} theme={theme}/>

                                </View>

                            </IF>

                            <IF condition={tabIndex1 == '1'}>


                                {
                                    isLoading && <ActivityIndicator size='small' color={Colors.primaryColor}/>
                                }
                                {
                                    !isLoading && filteredCommunity?.map((({
                                                                               id,
                                                                               community,
                                                                               totalUsersJoined
                                                                           }) => (
                                        <TouchableOpacity key={id} activeOpacity={0.8}
                                                          onPress={() => seeCommunity(community?.id, community.ownerId, community.visibility, community.displayPhoto)}
                                                          style={[styles.myCommunityCard, {
                                                              backgroundColor: theme == 'dark' ? '#141414' : "#fff"
                                                          }]}>

                                            <View style={styles.communityLogo}>
                                                <Image source={{uri: community?.displayPhoto}}
                                                       style={styles.communityLogoImag}/>
                                            </View>

                                            <View style={styles.bodyCard}>
                                                <Text style={[styles.cardTitle, {
                                                    color: textColor
                                                }]}>
                                                    {community?.name}
                                                </Text>
                                                <Text style={[styles.cardTitleSub, {
                                                    color: textColor
                                                }]}>
                                                    {totalUsersJoined} Members
                                                </Text>
                                            </View>

                                            <SmallRectButton onPress={() => leaveCommunity(id)} style={{}}>
                                                <Text style={styles.buttonText}>
                                                    Leave

                                                </Text>
                                            </SmallRectButton>

                                        </TouchableOpacity>
                                    )))
                                }


                            </IF>


                            <IF condition={tabIndex1 == '2'}>

                                <View style={styles.startCommunity}>
                                    <Text style={[styles.TextTitle, {
                                        color: textColor
                                    }]}>
                                        Create your own Community
                                    </Text>
                                    <RectButton style={{
                                        width: 190
                                    }} onPress={() => handleSnapPress(1)}>
                                        <Text style={styles.buttonText}>
                                            Create Community
                                        </Text>
                                    </RectButton>


                                </View>
                                {
                                    filteredOwnCommunity.map((item) => (
                                        <CardPublicCommunity viewTheCommunity={viewTheCommunity} key={item.id}
                                                             joinModal={joinModal} theme={theme}
                                                             item={item}/>
                                    ))
                                }

                            </IF>

                            <IF condition={tabIndex1 == '3'}>


                                {
                                    !loadingPending &&
                                    pendingCommunities?.pages[0]?.data?.result.map((item) => (
                                        <InActiveCard  key={item.id}
                                                              theme={theme}
                                                             item={item}/>
                                    ))
                                }

                            </IF>
                            <IF condition={tabIndex1 == '4'}>


                                {
                                    !loadingDeclined &&
                                    declinedCommunities?.pages[0]?.data?.result.map((item) => (
                                        <InActiveCard  key={item.id}
                                                              theme={theme}
                                                             item={item}/>
                                    ))
                                }

                            </IF>

                        </>
                    }

                </ScrollView>
                <Toast message={responseMessage} state={responseState} type={responseType}/>
            </SafeAreaView>


            <Portal>

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
                        <View style={styles.sheetHead}>

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
                        <View style={styles.sheetHead}>

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
            </Portal>
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
        paddingHorizontal: pixelSizeHorizontal(20),
        //backgroundColor: "#fff",
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {

        //  backgroundColor: Colors.background,
        //  backgroundColor: "#fff",
        width: '100%',
        alignItems: 'center'
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
        width: '100%',

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    searchTangible: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',

        borderWidth: 1,
        borderRadius: 10,

    },

    cardContainer: {

        height: heightPixel(330),
        alignItems: 'center',
        justifyContent: 'center'
    },
    listContainer: {
        width: '100%',
        alignItems: 'center',
        overflow: 'hidden'
    },
    ActivityCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '95%',
        height: heightPixel(70),
    },
    listTitle: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
    },
    tintText: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
        color: Colors.light.text
    },
    seeAll: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    startCommunity: {
        width: '100%',
        height: heightPixel(100),
        borderRadius: 10,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    myCommunityCard: {
        width: '100%',
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

        elevation: 3,
    },
    communityLogo: {
        height: 50,
        width: 50,
        borderRadius: 5,
        // backgroundColor: Colors.primaryColor
    },
    communityLogoImag: {
        height: '100%',
        width: '100%',
        borderRadius: 5,
        resizeMode: 'cover'
    },
    bodyCard: {

        marginLeft: 5,
        width: '55%',
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
    },
    cardTitle: {
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text,
        fontSize: fontPixel(14)
    },
    cardTitleSub: {
        fontFamily: Fonts.quicksandRegular,
        color: Colors.light.text,
        fontSize: fontPixel(14)
    },

    buttonText: {
        marginLeft: 5,
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    TextTitle: {

        fontSize: fontPixel(16),
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold
    },
    sheetHead: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    sheetTitle: {
        //width: '70%',
        textAlign: 'center',
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
        color: "#000000"
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
    sheetContainer: {
        width: '100%',
        alignItems: 'center',
        // paddingHorizontal: pixelSizeHorizontal(20)
    },
    sheetBody: {
        width: '100%',
        marginBottom: 30,
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
        minHeight: heightPixel(40),
        paddingVertical: pixelSizeVertical(10)
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

export default Community;
