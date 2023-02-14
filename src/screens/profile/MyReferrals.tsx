import React, {useCallback} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Platform,
    ImageBackground,
    ActivityIndicator,
    Animated as MyAnimated
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import NavBar from "../../components/layout/NavBar";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import HorizontalLine from "../../components/HorizontalLine";
import Colors from "../../constants/Colors";
import {RectButton} from "../../components/RectButton";
import {Fonts} from "../../constants/Fonts";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {RootStackScreenProps} from "../../../types";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {generateReferralHistory, referralDashboard} from "../../action/action";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout} from "react-native-reanimated";
import dayjs from "dayjs";
import {useAppSelector} from "../../app/hooks";
import {FlashList} from "@shopify/flash-list";


interface ReferralProps {
    theme:'light' | 'dark'
    item: {
        "id": string,
        "userId": string,
        "amount": number,
        "reason": string,
        "transactionId": null,
        "isDeleted": boolean,
        "createdAt": string,
        "deletedAt": null,
        "user": {
            "username": null,
            "avatar": string,
            "fullName": string,
            "id": string
        }
    }
}

const ReferralItem = ({item}: ReferralProps) => {
    return (
        <Animated.View key={item.id} entering={FadeInDown}
              exiting={FadeOutDown} layout={Layout.easing(Easing.bounce).delay(20)} style={styles.transactionCard}>
            <View style={[styles.transactionCardIcon, {
                backgroundColor: "#59C965"
            }]}>
                <FontAwesome name="exchange" size={20} color="#fff"/>

            </View>

            <View style={styles.transactionCardBody}>
                <Text style={[styles.transactionCardTitle, {
                    color: Colors.light.text
                }]}>
                    {item.amount} CUSD
                </Text>
                <View style={styles.transactionCardBodyBottom}>
                    <Text style={[styles.transactionCardTitle, {
                        color: Colors.success
                    }]}>
                        {item.reason}
                    </Text>
                    <Text style={styles.transactionCardDate}>
                        {dayjs(item.createdAt).format('MM/DD/YYYY')} at {dayjs(item.createdAt).format('hh:mm A')}
                    </Text>
                </View>
            </View>
        </Animated.View>
    )
}

const MyReferrals = ({navigation}: RootStackScreenProps<'MyReferrals'>) => {

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const referAFriend = () => {
        navigation.navigate('ReferAFriend')
    }

  //  const {isLoading, data} = useQuery(['generateReferralHistory'], generateReferralHistory)


        const {
            status,
            data,
            error,
            isFetching,
            isLoading,
            refetch,
            isFetchingNextPage,
            isFetchingPreviousPage,
            fetchNextPage,
            fetchPreviousPage,
            hasNextPage,
            hasPreviousPage,
        } = useInfiniteQuery(
            [`the-categories`], ({pageParam = 1}) =>
                referralDashboard.referrals({pageParam})
            ,
            {
                retry:true,
                getNextPageParam: lastPage => {
                    if (lastPage.next !== null) {
                        return lastPage.next;
                    }

                    return lastPage;
                },
                getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
                onError:(err)=>{
                    console.log(err)
                }
            },


        )


        const loadMore = () => {
            if (hasNextPage) {
                fetchNextPage();
            }
        }
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text


    const renderItem = useCallback(
        ({item}) => (
            <ReferralItem theme={theme} item={item}/>
        ),
        [data,theme],
    );
    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);


    const renderHeaderItem = useCallback(
        () => (
<>
    <ImageBackground source={require('../../assets/images/confetti.png')} style={[styles.topDashboard,{
        backgroundColor
    }]}>
        <View style={styles.pointBox}>

            <Text style={[styles.refText,{
                color: textColor
            }]}>
                Total Referrals
            </Text>

            <View style={styles.points}>
                <Text style={[styles.refText, {
                    color: "#fff",
                    fontSize: fontPixel(40)
                }]}>
                    {data?.pages[0]?.data?.totalPointsGained}
                </Text>
            </View>
        </View>

        <RectButton onPress={referAFriend} style={{marginTop: 30, width: widthPixel(200)}}>
            <Text style={styles.buttonText}>
                Refer a Friend

            </Text>
        </RectButton>
    </ImageBackground>

    <HorizontalLine width={"90%"} color={theme == 'light' ? Colors.borderColor : '#313131'}/>
    <View style={styles.titleWrap}>
        <Text style={[styles.utilityTitle,{
            color: textColor
        }]}>
            Referral Points
        </Text>
    </View>
</>
        ),[])

    return (
        <SafeAreaView style={[styles.safeArea,{
            backgroundColor
        }]}>
            <View
             style={[styles.scrollView,{
                backgroundColor
            }]} >
                <NavBar noBell title={"My Referrals"}/>



                {
                    isLoading && <ActivityIndicator size="small" color={Colors.primaryColor}/>
                }
               {
                    !isLoading && data &&


                   <View style={{
                       width: '100%',
                       flex: 1,
                   }}>


                        <FlashList
                            ListHeaderComponent={renderHeaderItem}
                            scrollEventThrottle={16}
                            estimatedItemSize={200}
                            refreshing={isLoading}
                            onRefresh={refetch}
                            scrollEnabled
                            showsVerticalScrollIndicator={false}
                            data={data?.pages[0]?.data?.referralHistory}
                            renderItem={renderItem}

                            keyExtractor={keyExtractor}
                            onEndReachedThreshold={0.3}
                            ListFooterComponent={isFetchingNextPage ?
                                <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                        />
                   </View>
                        }



            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
alignItems:'center',
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {
        //  backgroundColor: Colors.background,
        flex: 1,
        //  backgroundColor: Colors.background,

        width: '100%',
        alignItems: 'center'
    },
    topDashboard: {

        height: heightPixel(310),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',

    },
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    pointBox: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        height: heightPixel(150),
        width: '100%',

    },
    refText: {
        fontSize: fontPixel(18),
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold
    },
    points: {
        alignItems: 'center',
        justifyContent: 'center',
        width: widthPixel(175),
        height: heightPixel(65),
        borderRadius: 5,
        backgroundColor: "#FFE226"
    },

    titleWrap: {
        marginTop: 15,
paddingHorizontal:pixelSizeHorizontal(20),
        width: '100%',

        alignItems: 'center',
        justifyContent: 'space-between',
        height: heightPixel(45),
        flexDirection: 'row'
    },
    utilityTitle: {
        fontFamily: Fonts.quickSandBold,

        fontSize: fontPixel(16)
    },
    transactions: {
        width: '100%',
        alignItems: 'center'
    },
    transactionCard: {

        height: heightPixel(80),
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    transactionCardIcon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    transactionCardBody: {

        height: '80%',
        width: '85%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly'
    },
    transactionCardBodyBottom: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    transactionCardDate: {
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandRegular,
        color: "#666666"
    },
    transactionCardTitle: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,

    },
})

export default MyReferrals;
