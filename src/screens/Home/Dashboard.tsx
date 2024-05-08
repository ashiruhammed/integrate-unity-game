import React, {useCallback, useEffect, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Platform,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    ImageBackground, Pressable, Image, FlatList
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import {RootTabScreenProps} from "../../../types";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useInfiniteQuery, useQuery, useQueryClient} from "@tanstack/react-query";
import {useRefreshOnFocus, wait} from "../../helpers";
import {Ionicons, Octicons} from "@expo/vector-icons";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {getUserDashboard, userNotifications} from "../../action/action";
import {Fonts} from "../../constants/Fonts";

import GameIconLarge from "../../assets/images/svg/GameIconLarge";
import {FlatListExtra} from "../../components/flatlist-extra";
import {BlurView} from "expo-blur";
import {updateUserDashboard} from "../../app/slices/userSlice";
import LearnSVG from "../../assets/images/svg/LearnSVG";
import ProductIcon from "../../assets/images/svg/ProductIcon";
import StreakIcon from "../../assets/images/svg/StreakIcon";
import messaging from "@react-native-firebase/messaging";


const users = [
    {
        id: '1',
        image: 'https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
        id: '2',
        image: "https://images.pexels.com/photos/3394335/pexels-photo-3394335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        id: '3',
        image: "https://images.pexels.com/photos/428333/pexels-photo-428333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        id: '4',
        image: "https://images.pexels.com/photos/3626313/pexels-photo-3626313.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        id: '5',
        image: "https://images.pexels.com/photos/1832959/pexels-photo-1832959.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        id: '6',
        image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        id: '7',
        image: "https://images.pexels.com/photos/3674249/pexels-photo-3674249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        id: '8',
        image: "https://images.pexels.com/photos/11805711/pexels-photo-11805711.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
    },
];


const Games = [{
    gameImage: "https://images.pexels.com/photos/2708981/pexels-photo-2708981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    id:'1',
    name:"It takes two",
    category:"Multiplayer"
},{
    gameImage: "https://images.pexels.com/photos/6080928/pexels-photo-6080928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    id:'2',
    name:"Fortnite",
    category:"Single-player"
}]


interface AchievementsProps {
    item: {
        title: string,
        subText: string,
        bg: string,
        color: string,
icon:React.JSX.Element

    }

}

interface gameProps {
    item:{
        gameImage:string,
        name:string,
        category:string
    }
}

interface props {
    item: {
        image: string
    }
}

const FriendItem = ({item}: props) => {

    return (
        <Pressable style={styles.friendsOnlineCard}>
            <View style={styles.dotOnline}/>
            <Image source={{uri: item.image}} style={styles.friendsOnlineCardImage}/>
        </Pressable>
    )
}
const GameItem = ({item}: gameProps) => {

    return (
        <Pressable style={styles.gameCard}>
            <ImageBackground resizeMode={'cover'} resizeMethod={'scale'} style={styles.gameCardImage}
                             source={{uri:item.gameImage}}>

                <View style={styles.gameCardBottom}>
                    <BlurView intensity={40} tint="light" style={[styles.blurContainer, {
                        backgroundColor: '#4F4F4F40',

                    },
                    ]}>
                        <View style={styles.bodyWrap}>
                            <Text style={styles.bottomTxt}>
                                {item.name}
                            </Text>

                            <Text style={styles.bottomSubTxt}>
                                <Octicons name="people" size={12} color="#CCCCCC"/>    {item.category}
                            </Text>
                        </View>


                    </BlurView>

                </View>
            </ImageBackground>
        </Pressable>
    )
}


const AchievementsItem = ({item}: AchievementsProps) => {
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    return (
        <Pressable style={[styles.achievementsCard, {
            backgroundColor: item.bg
        }]}>


            <View style={styles.achievementsCardLeft}>
                <Text style={[styles.achievementsCardTitle, {
                    color: textColor
                }]}>
                    {item.title}
                </Text>
                <Text style={[styles.achievementsCardSubText, {
                    color: item.color
                }]}>
                    {item.subText}
                </Text>
            </View>

            <View style={[styles.iconWrap,{
                backgroundColor: item.color
            }]}>

                {item.icon}
            </View>

        </Pressable>
    )
}

const Dashboard = ({navigation}: RootTabScreenProps<'Home'>) => {


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

    const refresh = () => {
        setRefreshing(true)
        //refetch()

        wait(2000).then(() => setRefreshing(false));
    }

    const openNotifications = () => {
        navigation.navigate('Notifications')
    }

    const {isLoading: loadingUser,data:userDashboard, isRefetching, refetch} = useQuery(['getUserDashboard'], getUserDashboard, {


    })


    useEffect(() => {
        messaging().onNotificationOpenedApp(remoteMessage => {

            /* console.log(
                 'Notification caused app to open from background state:',
                 remoteMessage,
             );*/

            if (!!remoteMessage?.data && remoteMessage?.data?.Wallet) {
                // console.log(`SIGNAL_DATA -> ${remoteMessage}`)
                setTimeout(() => {
                    navigation.navigate("Dashboard",
                        {
                            screen: 'Wallet',
                        }
                    )
                }, 1200);
            }
        });

    }, [])


    const Achievements = [
        {
            icon:<GameIconLarge/>,
            title: 'Games',
            subText: `${!userDashboard?.data?.gamesPlayed ? '0' : userDashboard?.data?.gamesPlayed} Played`,
            id: '1',
            bg: '#FFE8EC',
            color: Colors.primaryColor
        }, {
        icon:<LearnSVG/>,
            title: 'Learn',
            subText: `${!userDashboard?.data?.completedAdventures ? '0': userDashboard?.data?.completedAdventures} Courses Completed`,
            id: '2',
            bg: "#ECFFEE",
            color: '#22BB33'
        }, {
            icon:<ProductIcon/>,
            title: 'Products',
            subText: `${!userDashboard?.data?.totalDiscoveryProduct ? '0' : userDashboard?.data?.totalDiscoveryProduct} Products`,
            id: '3',
            bg: '#FFF1EB',
            color: '#FFAA88'
        }, {
            icon:<StreakIcon/>,
            title: 'Highest Streak',
            subText: `${!userDashboard?.data?.currentDayStreak ? '0' : userDashboard?.data?.currentDayStreak} Daily Streaks`,
            id: '4',
            bg: '#F0F3FF',
            color: '#325AE8'
        },
    ]



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

    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],)

    const renderItem = useCallback(
        ({item}) => <FriendItem item={item}/>,
        [],
    );  const renderItemGame = useCallback(
        ({item}) => <GameItem item={item}/>,
        [],
    );
    const renderAchievementsItem = useCallback(
        ({item}) => <AchievementsItem item={item}/>,
        [],
    );

//console.log(userDashboard)

useRefreshOnFocus(refetch)

    return (
        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
            <ScrollView
                refreshControl={<RefreshControl tintColor={Colors.primaryColor}
                                                refreshing={refreshing} onRefresh={refresh}/>}
                style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                backgroundColor
            }]} scrollEnabled
                showsVerticalScrollIndicator={false}>


                <View style={styles.topBar}>

                    <View style={styles.leftButton}>

                        <View style={styles.pointWrap}>
                            <Ionicons name="gift" size={16} color="#22BB33"/>
                            <Text style={styles.pointsText}>{userDashboard?.data?.totalPoint}</Text>
                        </View>
                    </View>

                    <View style={styles.rightButton}>
                        <TouchableOpacity onPress={openNotifications} activeOpacity={0.6}
                                          style={styles.roundTopBtn}>
                            {
                                notifications?.pages[0]?.data?.result.some((obj: { isRead: boolean; }) => !obj.isRead)  &&
                                <View style={styles.dot}/>
                            }
                            <Octicons name="bell-fill" size={22} color={"#000"}/>
                        </TouchableOpacity>

                    </View>

                </View>


                <View style={styles.dashWrap}>
                    <Text style={[styles.dashTitle, {
                        color: textColor
                    }]}>
                        Play Games, Learn, Discover and Earn Rewards
                    </Text>
                </View>


                <View style={styles.streakBox}>
                    <View style={styles.dailyStreak}>
                        <ImageBackground style={styles.streaKIcon} resizeMode={'contain'}
                                         source={require('../../assets/images/streakicon.png')}>

                        </ImageBackground>
                        <Text style={[styles.dailyStreakText, {
                            color: textColor
                        }]}>

                            Daily Streak
                        </Text>
                    </View>

                    <Text style={[styles.dailyStreakTextSub, {
                        color: lightText
                    }]}>
                        Login to mark a day
                    </Text>

                </View>


                <View style={styles.friendsOnline}>
                    <View style={{marginBottom: 10}}>
                        <Text style={[styles.friendsOnlineTitle, {
                            color: textColor
                        }]}>
                            Friends Online
                        </Text>
                    </View>


                    <FlatList

                        data={users}
                        keyExtractor={keyExtractor}
                        horizontal
                        pagingEnabled
                        scrollEnabled
                        snapToAlignment="center"
                        scrollEventThrottle={16}
                        decelerationRate={"fast"}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderItem}
                    />

                </View>


                <View style={styles.achievements}>
                    <View style={{marginBottom: 10}}>
                        <Text style={[styles.friendsOnlineTitle, {
                            color: textColor
                        }]}>
                            Achievements
                        </Text>
                    </View>

                    <FlatListExtra

                        data={Achievements}
                        keyExtractor={keyExtractor}
                        horizontal
                        pagingEnabled
                        scrollEnabled
                        numRows={2}
                        snapToAlignment="center"
                        scrollEventThrottle={16}
                        decelerationRate={"fast"}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderAchievementsItem}
                    />


                </View>


                <View style={styles.games}>
                    <View style={styles.titleWrap}>
                        <Text style={[styles.friendsOnlineTitle, {
                            color: textColor
                        }]}>
                            Popular Games
                        </Text>


                        <Text style={styles.seeMoreTxt}>
                            See all
                        </Text>
                    </View>



                    <FlatList

                        data={Games}
                        keyExtractor={keyExtractor}
                        horizontal
                        pagingEnabled
                        scrollEnabled
                        snapToAlignment="center"
                        scrollEventThrottle={16}
                        decelerationRate={"fast"}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderItemGame}
                    />


                </View>


            </ScrollView>
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
    scrollView: {
        //  backgroundColor: Colors.background,
        backgroundColor: "#F9F9F9",
        width: '100%',
        alignItems: 'center'
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
        fontFamily: Fonts.quicksandMedium
    },
    rightButton: {
        width: widthPixel(70),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
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
    dashWrap: {
        width: '100%',
        padding: 15,

    },
    dashTitle: {

        fontSize: fontPixel(24),
        fontFamily: Fonts.quicksandMedium,
        lineHeight: 30

    },
    streakBox: {
        marginTop: 15,
        marginBottom: 10,
        backgroundColor: "#F0F0F0",
        width: '90%',
        height: heightPixel(65),
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        paddingHorizontal: pixelSizeHorizontal(10),
        borderRadius: 10,

    },

    dailyStreak: {
        width: widthPixel(200),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: '70%'
    },
    streaKIcon: {
        width: 40,
        resizeMode: 'center',
        height: '100%'
    },
    dailyStreakText: {
        marginLeft: 10,
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandSemiBold,
    },
    dailyStreakTextSub: {
        marginLeft: 10,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
    },
    friendsOnline: {
        width: '90%',
        height: 80,

        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: pixelSizeVertical(30),
        marginBottom: 10
    },
    friendsOnlineTitle: {
        marginBottom: 5,
        fontSize: fontPixel(16),
        fontFamily: Fonts.quickSandBold,
    },
    friendsOnlineCard: {
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        height: 45,
        borderRadius: 100,
    },
    friendsOnlineCardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        resizeMode: 'cover'
    },
    dotOnline: {
        position: 'absolute',
        width: 10,
        height: 10,
        top: 5,
        zIndex: 1,
        right: 1,

        backgroundColor: "#5AFF60",
        borderRadius: 15,
    },
    achievements: {
        width: '90%',
        height: 200,

        flexWrap: 'wrap',

        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: pixelSizeVertical(30)
    },
    achievementsCard: {
        width: widthPixel(250),
        height: heightPixel(80),
        borderRadius: 10,
        marginRight: 15,
        marginBottom: 15,
        paddingHorizontal: pixelSizeHorizontal(15),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: '#FFE8EC'

    },
    achievementsCardLeft: {
        width: '60%',
        justifyContent: 'center',
        height: '60%',
        alignItems: 'flex-start',

    },
    achievementsCardTitle: {
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandSemiBold,

    },
    achievementsCardSubText: {
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandRegular,

    },
    iconWrap: {
        width: 55,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: Colors.primaryColor
    },
    games: {
        width: '90%',
        height: 330,


        justifyContent: 'flex-start',

        marginTop: 40
    },
    titleWrap: {

        flexDirection: 'row',
        width: '100%',
        // height:40,
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    seeMoreTxt: {
        color: Colors.primaryColor,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
    },
    gameCard: {
        marginRight:15,
        width: widthPixel(250),
        height: heightPixel(270),
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    gameCardImage: {
        width: '100%',
        flex: 1,
        resizeMode: 'cover',
        borderRadius: 10,
        justifyContent: 'flex-end',

        alignItems: 'center'
    },
    gameCardBottom: {
        width: '95%',
        borderRadius: 5,
        height: 55,
        overflow: 'hidden',
        marginBottom: 10,

    },
    bodyWrap: {
        width: '100%',
        height: '80%',
        paddingHorizontal: 5,
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',

    },
    blurContainer: {

        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',


        borderRadius: 5,
        flexDirection: 'row',

        paddingHorizontal: pixelSizeHorizontal(10),
        // Shadow for iOS
    },
    bottomTxt: {
        color: '#fff',

        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandSemiBold
    },
    bottomSubTxt: {
        color: '#CCCCCC',
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandMedium
    }


})

export default Dashboard;
