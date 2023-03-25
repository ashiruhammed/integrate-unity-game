import React, {useCallback, useRef, useState} from 'react';

import {Text, View, StyleSheet, TouchableOpacity, Animated as MyAnimated, Image, ActivityIndicator} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import Animated, {
    Easing, FadeInDown,
    FadeInRight, FadeOutDown,
    FadeOutRight,
    Layout,
    SlideInRight,
    SlideOutRight, useSharedValue
} from "react-native-reanimated";
import {StatusBar} from "expo-status-bar";
import {AntDesign, Ionicons, SimpleLineIcons} from "@expo/vector-icons";
import {useAppSelector} from "../../app/hooks";
import Colors from "../../constants/Colors";
import {CommunityStackScreenProps, RootStackScreenProps} from "../../../types";
import Drawer from "./components/Drawer";
import {useQuery} from "@tanstack/react-query";
import {getCommunityFollowers, getCommunityInfo} from "../../action/action";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {FlashList} from "@shopify/flash-list";
import dayjs from "dayjs";
import {useRefreshOnFocus} from "../../helpers";
import Toast from "../../components/Toast";


const H_MAX_HEIGHT = 150;
const H_MIN_HEIGHT = 52;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

interface cardProps {
    theme: 'dark' | 'light',
    item: {
        createdAt: string,
        follower: {
            avatar: string,
            fullName: string,
            username: string,
        }
    },

}

const FollowerCard = ({theme, item}: cardProps) => {
    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    return (
        <Animated.View key={item.follower.username} layout={Layout.easing(Easing.bounce).delay(30)}
                       entering={FadeInDown.springify()} exiting={FadeOutDown} style={[styles.followersCard, {
            borderBottomColor: borderColor
        }]}>
            <View style={styles.avatar}>
                <Image
                    source={{uri: !item.follower.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : item.follower.avatar}}
                    style={styles.image}/>
            </View>

            <View style={styles.CardBody}>
                <View style={styles.bodyName}>
                    <Text style={[styles.nameTxt, {
                        color: textColor
                    }]}>
                        {item.follower.fullName}
                    </Text>
                </View>
                <View style={styles.bodyName}>
                    <Text style={[styles.time, {
                        color: lightTextColor
                    }]}>
                        {dayjs(item.createdAt).format('DD, MMM YYYY')}
                    </Text>
                    <Text style={[styles.nameTxt, {
                        color: textColor,
                        fontSize: fontPixel(14)
                    }]}>
                        {item.follower.username && `@${item.follower.username}`}
                    </Text>
                </View>
            </View>
        </Animated.View>
    )
}


const Followers = ({navigation, route}: CommunityStackScreenProps<'Followers'>) => {

    const user = useAppSelector(state => state.user)
    const {responseState, responseType, responseMessage} = user


    const offset = useSharedValue(0);
    const [toggleMenu, setToggleMenu] = useState(false);

    const dataSlice = useAppSelector(state => state.data)
    const {theme, currentCommunityId} = dataSlice
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'

    const scrollOffsetY = useRef(new MyAnimated.Value(0)).current;
    const headerScrollHeight = scrollOffsetY.interpolate({
        inputRange: [0, H_SCROLL_DISTANCE],
        outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
        extrapolate: "clamp"
    });

    const goBack = () => {
        navigation.goBack()
    }

    const {isLoading, data, refetch} = useQuery(['getCommunityInfo'], () => getCommunityInfo(currentCommunityId), {})
    const {
        isLoading: loading,
        data: followers,
        refetch: getFollowers
    } = useQuery(['CommunityFollowers'], () => getCommunityFollowers(currentCommunityId), {})


    const renderItem = useCallback(
        ({item}) => (
            <FollowerCard theme={theme} item={item}/>
        ),
        [],
    );
    const menuToggle = () => {
        navigation.openDrawer()
    }

    useRefreshOnFocus(getFollowers)
    const renderHeaderItem = useCallback(
        () => (
            <MyAnimated.View style={[styles.cover, {}]}>

                <View style={styles.navBar}>
                    <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
                        <AntDesign name="arrowleft" size={24} color="#fff"/>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={menuToggle} activeOpacity={0.8} style={styles.rightButton}>
                        <SimpleLineIcons name="menu" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>

                <Image
                    source={{uri: data?.data?.displayPhoto}}
                    style={{flex: 0.7, width: 200,}}
                    resizeMode={"contain"}/>
            </MyAnimated.View>
        ), [])

    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);

    return (

        <>


            <SafeAreaView style={[styles.safeArea, {
                backgroundColor
            }]}>
                <Toast message={responseMessage} state={responseState} type={responseType}/>


                <View style={styles.flatlist}>

                    {
                        loading && <ActivityIndicator size='small' color={Colors.primaryColor}
                                                      style={[StyleSheet.absoluteFillObject, styles.loader]}/>
                    }


                    <FlashList
                        ListHeaderComponent={renderHeaderItem}
                        onScroll={MyAnimated.event([

                            {nativeEvent: {contentOffset: {y: scrollOffsetY}}}
                        ], {useNativeDriver: false})}
                        scrollEventThrottle={16}
                        estimatedItemSize={200}
                        refreshing={isLoading}
                        onRefresh={refetch}
                        scrollEnabled
                        showsVerticalScrollIndicator={false}
                        data={followers?.data?.result}
                        renderItem={renderItem}

                        keyExtractor={keyExtractor}
                        onEndReachedThreshold={0.3}

                    />

                </View>

            </SafeAreaView>

        </>

    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#EDEDED",

    },
    flatlist: {

        width: '100%',
        flex: 1,

    },
    cover: {
        width: '100%',
        alignItems: 'center',
        height: heightPixel(160),
        backgroundColor: "#364A8F"
    },
    navBar: {
        paddingHorizontal: pixelSizeHorizontal(24),
        width: '100%',
        height: heightPixel(60),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    rightButton: {
        width: widthPixel(60),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    followersCard: {
        width: '100%',
        height: heightPixel(100),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingHorizontal: pixelSizeHorizontal(20),
    },
    avatar: {
        backgroundColor: '#eee',
        height: 55,
        width: 55,
        borderRadius: 80
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 80
    },
    CardBody: {
        width: '80%',
        justifyContent: 'space-evenly',
        height: '70%',
        alignItems: 'center',
    },
    bodyName: {
        width: '100%',
        justifyContent: 'space-between',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameTxt: {
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text,
        fontSize: fontPixel(16)
    },
    time: {
        marginTop: 5,
        fontFamily: Fonts.quicksandSemiBold,
        fontSize: fontPixel(14)
    },
    loader: {
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)'
    }
})

export default Followers;
