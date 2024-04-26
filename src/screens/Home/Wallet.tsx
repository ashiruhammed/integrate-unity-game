import React, {SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Platform,
    Dimensions,
    Pressable,
    Image, ActivityIndicator
} from 'react-native';
import {Ionicons, Octicons} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useInfiniteQuery, useQuery, useQueryClient} from "@tanstack/react-query";
import Colors from "../../constants/Colors";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {
    getAllBadges,
    getCCDWallet,
    getUserDashboard,
    getUserPoints,
    getUserWallets, userNFTs,
    userNotifications
} from "../../action/action";
import SegmentedControl from "../../components/segment-control/SegmentContol";
import SegmentContolAlt from "../../components/segment-control/SegmentContolAlt";
import MyCard from "../../components/wallets/cards/MyCard";
import {IF} from "../../helpers/ConditionJsx";
import {RootTabScreenProps} from "../../../types";
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {Portal} from "@gorhom/portal";
import {isWhatPercentOf, useRefreshOnFocus} from "../../helpers";
import Animated, {Easing, FadeInDown, FadeInUp, FadeOutDown, Layout} from "react-native-reanimated";
import MedalIcon from "../../assets/images/svg/MedalIcon";
import HorizontalLine from "../../components/HorizontalLine";
import StarIcon from "../../assets/images/svg/StarIcon";


interface props {


    imageUrl: string
    amount: string,
    id: string,
}


const BadgeItem = ({amount, id, imageUrl}: props) => {
    return (

        <Animated.View key={id} entering={FadeInUp.springify()} exiting={FadeOutDown}
                       layout={Layout.easing(Easing.bounce).delay(20)}
                       style={styles.badgeImageWrap}>
            <View style={styles.badgeImageContainer}>
                <Image
                    source={{uri: imageUrl}}
                    style={styles.badgeImage}/>
            </View>


            <View style={styles.badgeStreakScore}>
                <Text style={styles.badgeStreakText}>
                    x{amount}
                </Text>
            </View>
        </Animated.View>


    )
}


const Wallet = ({navigation}: RootTabScreenProps<'Learn'>) => {


    const [tabIndex, setTabIndex] = useState(0);
    const handleTabsChange = (index: SetStateAction<number>) => {
        setTabIndex(index);
        //  setScreen(index === 0 ? 'Banks' : 'Wallets')
    };


    const {
        isLoading: loadingPoints,
        data: points,
        refetch: fetchPoints
    } = useQuery(['getUserPoints'], getUserPoints, {})

    const {isLoading: loadingUser,data:userDashboard, refetch:fetchDashboard} = useQuery(['getUserDashboard'], getUserDashboard, {})

    const {isLoading: loadingWallets, data, isSuccess, isRefetching, refetch}
        = useQuery(['get-User-Wallets'], getUserWallets, {})
//console.log(data)

    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);


    const handleClose = () => {
        bottomSheetRef?.current?.close()
    }
    // variables
    const snapPoints = useMemo(() => ["1%", "45%"], []);

// renders
    const renderBackdrop = useCallback(
        (props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={0}
                appearsOnIndex={1}
            />
        ),
        []
    );
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

    const openNotifications = () => {
        navigation.navigate('Notifications')
    }


    const {data: ccdWallet,isLoading} = useQuery(['getCCDWallet'], getCCDWallet)
    useEffect(() => {
        if(!isLoading ) {
            if (!data?.success) {
                bottomSheetRef?.current?.expand()
            }

        }
    }, [tabIndex,data])

    const startCCDWallet = () => {
        handleClose()
        navigation.navigate('Concordium')
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



    const {
        isLoading:loadingNFTs,
        data:allUserNFTs,

        fetchNextPage: fetchNextPage,

        refetch:fetchNFTs,


    } = useInfiniteQuery([`all-user-nfts`], ({pageParam = 1}) => userNFTs.NFTs(pageParam),
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
        isLoading:loadingBadge,
        data:badges,
        hasNextPage,
        fetchNextPage: fetchNextPageWallet,
        isFetchingNextPage,
        refetch:fetchBadge,


    } = useInfiniteQuery([`all-user-badges`], ({pageParam = 1}) => getAllBadges.badges(pageParam),
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



    const openScreen = (screen: 'AllBadges' | 'NFTs') => {
        navigation.navigate(screen)
    }



    useRefreshOnFocus(refetch)
//console.log(ccdWallet)

    return (
        <>

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
                                notifications?.pages[0]?.data?.result.length > 0 &&
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
                        Wallet
                    </Text>
                </View>


                <View style={styles.segmentWrap}>

                    <SegmentContolAlt tabs={["Wallets", "Collectibles", "NFT Marketplace"]}
                                      currentIndex={tabIndex}
                                      onChange={handleTabsChange}
                                      segmentedControlBackgroundColor={"#fff"}
                                      activeSegmentBackgroundColor={Colors.primaryColor}
                                      activeTextColor={textColor}
                                      textColor={"#AFAFAF"}
                                      paddingVertical={pixelSizeVertical(10)}/>

                </View>

                <IF condition={tabIndex == 0}>

                    {
                        loadingWallets && <ActivityIndicator size={'small'} color={Colors.primaryColor}/>
                    }
                    {
                        !loadingWallets && ccdWallet &&

                    <MyCard
                        gateBalance={Object.keys(ccdWallet?.data).length > 0 ? ccdWallet?.data?.gateBalance : '0'}
                        gateValue={Object.keys(ccdWallet?.data).length > 0 ? ccdWallet?.data?.gateValue : '0'}
                        ccdBalance={Object.keys(ccdWallet?.data).length > 0 ? ccdWallet?.data?.ccdBalance : '0'}
                            ccdValue={Object.keys(ccdWallet?.data).length > 0 ? ccdWallet?.data?.ccdValue : '0'}
                            totalPoint={points?.data?.totalPoint}/>
                    }
                </IF>

                <IF condition={tabIndex == 1}>
                    <View style={styles.tabContainer}>


                        <View style={styles.titleWrap}>
                            <View style={styles.titleLeft}>
                                <Text style={[styles.rowTitle, {
                                    marginRight: 10,
                                }]}>
                                    Badges
                                </Text>
                                <MedalIcon/>
                            </View>


                            <Pressable onPress={() => openScreen('AllBadges')}>


                                <Text style={[styles.rowTitle, {
                                    fontSize: fontPixel(14),
                                    color: Colors.primaryColor
                                }]}>
                                    See details
                                </Text>
                            </Pressable>
                        </View>

                        <View style={styles.badgesContainer}>
                            {
                                !loadingBadge && badges?.pages[0].data.slice(0,6).map((badge: { id: string; imageUrl: any; amount: string  })=>(


                            <Animated.View
                                key={badge.id}
                                entering={FadeInDown.springify().delay(200)
                                    .randomDelay()
                                } exiting={FadeOutDown}
                                style={styles.badgeImageWrap}>
                                <View style={styles.badgeImageContainer}>
                                    <Image
                                        source={{uri:badge.imageUrl}}
                                        style={styles.badgeImage}/>
                                </View>


                                <View style={styles.badgeStreakScore}>
                                    <Text style={styles.badgeStreakText}>
                                        x{badge.amount}
                                    </Text>
                                </View>
                            </Animated.View>
                                ))
                            }
                        </View>
                        <HorizontalLine/>

                        <View style={[styles.titleWrap, {marginTop: 20,}]}>
                            <View style={styles.titleLeft}>
                                <Text style={[styles.rowTitle, {
                                    marginRight: 10,
                                }]}>
                                    NFTs
                                </Text>
                                <StarIcon/>
                            </View>


                            <Pressable onPress={() => openScreen('NFTs')}>


                                <Text style={[styles.rowTitle, {
                                    fontSize: fontPixel(14),
                                    color: Colors.primaryColor
                                }]}>
                                    See details
                                </Text>
                            </Pressable>
                        </View>


                        <View style={styles.badgesContainer}>


                            {!loadingNFTs && allUserNFTs && allUserNFTs?.pages[0]?.data?.result.slice(0,6).map((item)=>(
                                <Animated.View key={item.metadata.media_hash} entering={FadeInDown} exiting={FadeOutDown}
                                               style={[styles.badgeItem,{
                                                   backgroundColor,
                                                   borderBottomColor: theme == 'light' ? Colors.borderColor : '#313131',
                                               }]}>
                                    <View style={styles.nftImageWrap}>
                                        <Image
                                            source={{uri:item?.metadata?.media}}
                                            style={styles.badgeImage}/>


                                    </View>

                                    <View style={styles.nftItemBody}>
                                        <Text style={[styles.badgeTitle,{
                                            color:textColor
                                        }]}>
                                            {item.metadata.title}
                                        </Text>
                                        <Text style={styles.badgeSubText}>
                                            {item.metadata.description}
                                        </Text>


                                    </View>
                                </Animated.View>
                            ))}

                        </View>
                    </View>
                </IF>

                <IF condition={tabIndex == 2}>
                    <View style={styles.marketplaceContainer}>
                        <Image source={require('../../assets/images/marketplace.png')} style={styles.imageMarketplace}/>


                        <Text style={styles.linkText}>
                            Go to <Text style={{color: Colors.primaryColor}}>Marketplace</Text>
                        </Text>
                    </View>
                </IF>


            </SafeAreaView>

{/*            <Portal>
                <BottomSheet
                    backdropComponent={renderBackdrop}
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    // add bottom inset to elevate the sheet
                    bottomInset={66}
                    index={0}
                    // set `detached` to true
                    detached={true}
                    style={styles.sheetContainer}
                >
                    <BottomSheetView style={styles.contentContainer}>
                        <View style={[styles.sheetHead, {
                            height: 40
                        }]}>


                            <TouchableOpacity onPress={handleClose}
                                              style={[styles.dismiss, {
                                                  backgroundColor: "#11192E"
                                              }]}>
                                <Ionicons name="close-sharp" size={20} color={"#fff"}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.sheetTitle}>
                            Welcome to your Wallet
                        </Text>
                        <Text style={styles.sheetContentText}>
                            Complete quick KYC to unlock wallet fully. Earn up to $5 afterward. Your wallet can receive
                            Gateway Points, Tokens & NFTs as you explore. Necessary to prevent fraud.
                        </Text>

                        <Pressable onPress={startCCDWallet} style={styles.claimBtn}>
                            <Text style={styles.claimBtnText}>
                                Start (1min)
                            </Text>
                        </Pressable>
                    </BottomSheetView>
                </BottomSheet>

            </Portal>*/}

        </>
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

    segmentWrap: {
        height: heightPixel(60),
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
    },
    sheetContainer: {
        width: '90%',
        marginHorizontal: pixelSizeHorizontal(20)
    },
    contentContainer: {
        paddingHorizontal: pixelSizeHorizontal(20),
        alignItems: 'center',
    },
    sheetHead: {
        // paddingHorizontal: pixelSizeHorizontal(20),
        height: 60,
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "row"
    }
    ,
    sheetTitle: {
        marginVertical: 10,
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
    },
    sheetContentText: {
        color: "#5A5A5A",
        fontSize: fontPixel(16),
        lineHeight: 22,
        fontFamily: Fonts.quicksandMedium,
    },
    dismiss: {


        borderRadius: 30,
        height: 30,
        width: 30,
        alignItems: "center",
        justifyContent: "center"

    },
    claimBtn: {
        height: 45,

        width: widthPixel(235),
        borderRadius: 30,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        marginTop: 40,
        justifyContent: 'center',
    },
    claimBtnText: {
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quicksandSemiBold
    },
    marketplaceContainer: {
        width: '90%',
        height: heightPixel(400),
        alignItems: 'center',
        justifyContent: 'flex-end',

    },

    imageMarketplace: {
        width: '90%',
        height: heightPixel(250),
        resizeMode: 'contain',
    },
    linkText: {
        marginTop: 20,
        fontSize: fontPixel(16),
        color: "#000",
        fontFamily: Fonts.quickSandBold
    },
    badgeImageWrap: {
        height: heightPixel(110),
        width: widthPixel(85),
        alignItems: 'center',
        margin: 10,
        justifyContent: 'center',
    },
    badgeImageContainer: {
        height: 80,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center'

    },
    badgeImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',

    },
    badgeItemBody: {
        marginLeft: 15,
        height: '80%',
        width: '75%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },

    badgeStreakScore: {
        position: 'absolute',
        bottom: 10,
        right: 5,
        borderRadius: 10,
        backgroundColor: "#fff",
        width: widthPixel(35),
        height: heightPixel(18),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: pixelSizeHorizontal(5),
        shadowColor: "#212121",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,

        elevation: 3,
    },
    badgeStreakText: {
        color: Colors.light.text,
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(12)
    },
    tabContainer: {
        width: '90%',
        alignItems: 'center',
    },
    titleWrap: {
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',


    },
    titleLeft: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    rowTitle: {

        fontSize: fontPixel(16),
        color: "#333333",
        fontFamily: Fonts.quickSandBold
    },
    badgesContainer: {
        marginTop: 15,
        width: '100%',
        height: heightPixel(260),
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',

    },

    badgeItem: {

        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: heightPixel(120),

        borderBottomWidth: 1,
    },
    nftImageWrap: {
        height: heightPixel(110),
        width: widthPixel(85),
        alignItems: 'center',
        justifyContent: 'center',
    },
    nftImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'center',

    },
    nftItemBody: {
        marginLeft: 15,
        height: '80%',
        width: '75%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    badgeTitle: {

        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandSemiBold
    },
    badgeSubText: {

        color: Colors.light.lightTextColor,
        fontSize: fontPixel(14),
        lineHeight: heightPixel(18),
        fontFamily: Fonts.quicksandMedium
    },
})

export default Wallet;
