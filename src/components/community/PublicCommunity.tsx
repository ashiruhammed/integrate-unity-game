import React, {useCallback, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Animated,
    Dimensions,
    FlatList,
    ActivityIndicator,
    Modal,
    Alert,
    TouchableOpacity, Image, Pressable
} from 'react-native';

import Colors from "../../constants/Colors";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";

import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {RectButton} from "../RectButton";
import {Fonts} from "../../constants/Fonts";

import {Svg, Circle, Text as SVGText} from 'react-native-svg'
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    followACommunity,
    getAllAdventure,
    getBadge,
    getCommunityFollowers,
    getPublicCommunities, getSingleBadge
} from "../../action/action";
import FastImage from "react-native-fast-image";
import AdventuresIcon from "../../assets/images/tabs/home/AdventuresIcon";
import {setResponse} from "../../app/slices/userSlice";
import {isWhatPercentOf, truncate, useRefreshOnFocus} from "../../helpers";
import Constants from "expo-constants";
import {useNavigation} from "@react-navigation/native";
import {IF} from "../../helpers/ConditionJsx";
import {setCurrentCommunityId} from "../../app/slices/dataSlice";


interface cardProps {
    loadingBadge: boolean,
    theme: 'light' | 'dark',
    item: {
        status: string,
        description: string,
        totalUsersJoined: string,
        memberLimit: string,
        userAlreadyRequest: boolean,
        currentUserJoined: boolean,
        name: string,
        visibility: string,
        ownerId: string,
        id: string,
        displayPhoto: string,
        remainingSlots: string,
        accessNFTBadgeAmount: string,
        badgeId: string,
        communityFollowers: [],

        owner: {

            id: string
            fullName: string
        }
    },
    viewTheCommunity: (id: string, ownerId: string, visibility: string, displayPhoto: string) => void
    joinModal: (badgeId: string, accessNFTBadgeAmount: string, communityId: string) => void
}

const isRunningInExpoGo = Constants.appOwnership === 'expo'

const PublicCommunityCard = ({theme, loadingBadge, item, joinModal, viewTheCommunity}: cardProps) => {
    const user = useAppSelector(state => state.user)
    const {userData} = user
    const dispatch = useAppDispatch()

    // const {isLoading, data} = useQuery(['getCommunityFollowers'], () => getCommunityFollowers(item.id))


    const open = () => {

        if (item?.owner?.id == userData.id) {

            viewTheCommunity(item.id, item.ownerId, item.visibility, item.displayPhoto)
        } else if (item.currentUserJoined) {

            viewTheCommunity(item.id, item.ownerId, item.visibility, item.displayPhoto)

        } else {
            joinModal(item.badgeId, item.accessNFTBadgeAmount, item.id)
        }
    }
    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const tintTextColor = theme == 'light' ? "#AEAEAE" : Colors.dark.tintTextColor
    const barBg = theme == 'light' ? "#FEF1F1" : "#141414"

    const props = {size: 40, strokeWidth: 2, text: 'hello'}
    const {size, strokeWidth, text} = props;
    const radius = (size - strokeWidth) / 2;
    const circum = radius * 2 * Math.PI;
    const svgProgress = 100 - 80;
    return (
        <Pressable onPress={open} disabled={item?.userAlreadyRequest && !item.currentUserJoined}
                   style={[styles.communityCard, {
                       backgroundColor
                   }]}>

            <View style={styles.topCard}>
                <View style={styles.imageWrap}>

                    <FastImage
                        style={styles.avatar}
                        source={{
                            uri: item?.displayPhoto,
                            cache: FastImage.cacheControl.web,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />

                </View>

                <Text style={[styles.cardTitle, {
                    color: textColor
                }]}>
                    {item?.name}

                </Text>
            </View>

            <View style={styles.cardBody}>
                <Text style={[styles.bodyText, {
                    color: tintTextColor
                }]}>
                    Created by: <Text style={{
                    color: textColor,
                    fontSize: fontPixel(14),
                    fontFamily: Fonts.quicksandRegular
                }}> {item?.owner?.fullName} </Text>
                </Text>
                <View style={styles.bodyTextWrap}>


                    <Text style={[styles.bodyText, {
                        color: tintTextColor
                    }]}>
                        {truncate(item.description, 130)}
                    </Text>
                </View>

                <View style={styles.progressBarWrap}>
                    <View style={styles.progressBar}>
                        <View style={[styles.bar, {
                            width: `${isWhatPercentOf(+item.totalUsersJoined, +item.memberLimit)}%`
                        }]}/>


                    </View>
                </View>

                <View style={[styles.cardBodyBG, {
                    //  backgroundColor: barBg
                }]}>
                    <View style={styles.imageOverlap}>
                        {
                            item.communityFollowers?.length > 0
                            &&
                            item.communityFollowers?.slice(0, 4).map((({id, follower}) => (
                                <View key={id} style={styles.avatarWrap}>

                                    <FastImage
                                        style={styles.avatar}
                                        source={{
                                            uri: !follower?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : follower?.avatar,
                                            cache: FastImage.cacheControl.web,
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />

                                </View>
                            )))
                        }

                        <View style={styles.numberView}>
                            <Text style={[styles.learnText, {
                                fontSize: fontPixel(10)
                            }]}>
                                +{item.communityFollowers?.length}
                            </Text>
                        </View>

                    </View>


                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>


                        {/* Text */}
                        <Text style={{
                            color: textColor,
                            fontSize: fontPixel(12),
                            fontFamily: Fonts.quicksandRegular
                        }}>


                            {item?.remainingSlots} persons left
                        </Text>
                    </View>


                </View>
            </View>


            <IF condition={item.visibility == 'PRIVATE'}>

                {
                    item?.owner?.id == userData.id &&

                    <RectButton
                        onPress={open}
                        style={{
                            width: 150
                        }}>
                        <Text style={styles.buttonText}>

                            Open
                        </Text>

                    </RectButton>
                }
                {
                    item?.owner?.id !== userData.id && item.currentUserJoined &&

                    <RectButton
                        onPress={open}
                        style={{
                            width: 150
                        }}>
                        <Text style={styles.buttonText}>

                            Open
                        </Text>

                    </RectButton>
                }


                {
                    item?.userAlreadyRequest && !item.currentUserJoined &&

                    <RectButton
                        disabled
                        style={{
                            width: 150,
                            opacity: 0.7
                        }}>
                        <Text style={styles.buttonText}>

                            Requested
                        </Text>

                    </RectButton>
                }


                {
                    !item.currentUserJoined && !item?.userAlreadyRequest && item?.owner?.id !== userData.id &&

                    <RectButton
                        onPress={open}
                        style={{
                            width: 150
                        }}>
                        {
                            loadingBadge ? <ActivityIndicator size='small' color={"#fff"}/>
                                :
                                <>

                                    <MaterialIcons name="lock" size={14} color="#fff"/>
                                    <Text style={[styles.buttonText, {
                                        marginLeft: 5,
                                    }]}>
                                        Request to join

                                    </Text>
                                </>
                        }
                    </RectButton>
                }

            </IF>
            <IF condition={item.visibility !== 'PRIVATE'}>


                {
                    item?.owner?.id == userData.id &&

                    <RectButton
                        onPress={open} style={{
                        width: 150
                    }}>
                        <Text style={styles.buttonText}>

                            Open
                        </Text>

                    </RectButton>
                }


                {
                    item.currentUserJoined &&

                    <RectButton
                        onPress={open} style={{
                        width: 150
                    }}>
                        <Text style={styles.buttonText}>

                            Open
                        </Text>

                    </RectButton>
                }
                {
                    !item.currentUserJoined && item?.owner?.id !== userData.id &&

                    <RectButton disabled={loadingBadge}
                                onPress={open} style={{
                        width: 150
                    }}>
                        {
                            loadingBadge ? <ActivityIndicator size='small' color={"#fff"}/>
                                :

                                <Text style={styles.buttonText}>

                                    Join
                                </Text>
                        }
                    </RectButton>
                }
            </IF>
        </Pressable>
    )
}


const {width} = Dimensions.get('window')

interface props {
    theme: 'light' | 'dark',
    searchValue: string
}

const PublicCommunity = ({theme, searchValue}: props) => {

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const scrollX = new Animated.Value(0)
    let position = Animated.divide(scrollX, width)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [badgeId, setBadgeId] = useState('');
    const [communityId, setCommunityId] = useState('');
    const [requiredBadges, setRequiredBadges] = useState('');

    const navigation = useNavigation()
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text


    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background

    const {
        isLoading: loadingBadge,
        data: badge,
        mutate,
        isSuccess
    } = useMutation(['getBadge'], () => getSingleBadge(badgeId), {

        onSuccess: (data) => {
            if (data.success) {
                setModalVisible(true)
            }

        }
    })

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

    const updateCurrentSlideIndex = (e: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);

    };


    //implementing infinite scroll here
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
            onSuccess: (data) => {
                // console.log(data.pages[0].data)
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

    const closeModal = () => {
        setModalVisible(false)
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

    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);

    const renderItem = useCallback(({item}) => (
        <PublicCommunityCard viewTheCommunity={viewTheCommunity} loadingBadge={loadingBadge} joinModal={joinModal}
                             theme={theme} item={item}/>
    ), [loadingBadge, theme])

    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPageWallet();
        }
    };

    function capitalize(s) {
        return s && s[0].toUpperCase() + s.slice(1);
    }

    let filteredCommunity: readonly any[] | null | undefined = []


    function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }


    if (!isLoading && data && data?.pages[0]?.data) {
        filteredCommunity = data?.pages[0]?.data?.result.filter((community: { visibility: string; }) => community.visibility !== 'PRIVATE').slice(0, 8)?.filter((community: { name: string | string[]; }) =>
            community?.name?.includes(titleCase(searchValue).trim())
        )
    }


    useRefreshOnFocus(refetch)

    return (
        <>

            <Modal

                animationType="slide"
                transparent={true}
                visible={modalVisible}
                style={{backgroundColor}}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(false);
                }}
            >
                <View style={styles.backDrop}>
                    <View style={[styles.modalContainer, {
                        backgroundColor
                    }]}>

                        <View style={styles.sheetHead}>

                            <TouchableOpacity activeOpacity={0.8} onPress={closeModal}
                                              style={styles.dismiss}>
                                <Ionicons name="ios-close" size={24} color="#929292"/>
                            </TouchableOpacity>

                        </View>

                        <View style={[styles.modalBody, {
                            backgroundColor
                        }]}>

                            <Text style={[styles.missionText, {
                                color: textColor
                            }]}>
                                Requirements
                            </Text>
                            <View style={styles.dripImageWrap}>
                                <Image
                                    source={{uri: badge?.data?.imageUrl}}
                                    style={styles.dripImage}/>
                            </View>


                            <View style={styles.textWrap}>
                                <Text style={[styles.missionText, {
                                    color: textColor
                                }]}>
                                    {badge?.data?.title}
                                </Text>

                                <Text style={[styles.learnText, {
                                    textAlign: 'center',
                                    color: textColor
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


            {
                isLoading && <ActivityIndicator size='small' color={Colors.primaryColor}/>
            }

            {
                !isLoading && data && data?.pages[0]?.data?.result.length > 0 &&

                <FlatList
                    // data={data?.pages[0]?.data?.result?.slice(0, 8)}
                    data={
                        filteredCommunity
                    }
                    onMomentumScrollEnd={updateCurrentSlideIndex}
                    keyExtractor={keyExtractor}
                    horizontal
                    pagingEnabled
                    scrollEnabled
                    snapToAlignment="center"
                    scrollEventThrottle={16}
                    decelerationRate={"fast"}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                    onScroll={
                        Animated.event(
                            [

                                {nativeEvent: {contentOffset: {x: scrollX}}},
                            ],
                            {useNativeDriver: false}
                        )

                    }

                />
            }
        </>
    );
};

const styles = StyleSheet.create({


    communityCard: {
        width: widthPixel(360),
        height: heightPixel(300),
        shadowColor: "#212121",
        alignItems: 'center',
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

    topCard: {
        width: '100%',
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    imageWrap: {
        width: 40,
        height: 40,
        borderRadius: 5,
        // backgroundColor: "#ccc"
    },
    avatar: {
        borderRadius: 40,
        resizeMode: 'cover',
        backgroundColor: Colors.border,
        width: "100%",
        height: "100%",
    },
    cardTitle: {

        width: '85%',
        fontFamily: Fonts.quickSandBold,
        color: "#000000",
        marginLeft: 8,
        fontSize: fontPixel(14)
    },
    bodyTextWrap: {
        width: '100%',
        height: 70,

        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    bodyText: {
        fontFamily: Fonts.quicksandRegular,

        marginLeft: 8,
        lineHeight: heightPixel(18),
        fontSize: fontPixel(12),
    },

    progressBarWrap: {
        height: 20,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressBar: {
        width: '100%',
        backgroundColor: '#F4F5F7',
        height: 5,
        borderRadius: 5,
    },
    bar: {

        backgroundColor: Colors.primaryColor,

        position: 'relative',
        height: 5,
        borderRadius: 5,
    },
    cardBody: {
        width: '100%',
        height: 140,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },

    cardBodyBG: {
        paddingHorizontal: pixelSizeHorizontal(10),
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: "#FEF1F1",
        borderRadius: 10,
    },
    imageOverlap: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '40%',
        height: '100%'
    },
    avatarWrap: {
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: "#ccc",
        width: 20,
        borderRadius: 30,
        height: 20,
        position: 'relative',
        marginLeft: -5
    },
    buttonText: {

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
    dripImageWrap: {
        width: 80,
        height: 80,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',

    },

    dripImage: {

        resizeMode: 'contain',
        width: "100%",
        height: "100%",
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

    learnText: {
        //  lineHeight: heightPixel(24),
        fontSize: fontPixel(16),
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold
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
    numberView: {
        top: 10,
        left: -20,
        position: 'relative',
        backgroundColor: "#fff",
        borderRadius: 10,
        height: 15,
        minWidth: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.30,
        shadowRadius: 7.22,

        elevation: 3,
    }

})

export default PublicCommunity;
