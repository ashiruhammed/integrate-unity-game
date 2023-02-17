import React, {useCallback, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Animated as MyAnimated,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Pressable, Modal, Alert
} from 'react-native';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import Animated, {Easing, FadeInDown, FadeOutDown, Layout, useSharedValue} from "react-native-reanimated";
import Colors from "../../constants/Colors";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    approveCommunityRequest,
    communityRequests,
    declineCommunityRequest,
    getCommunityFollowers,
    getCommunityInfo
} from "../../action/action";
import {useRefreshOnFocus} from "../../helpers";
import {AntDesign, SimpleLineIcons} from "@expo/vector-icons";
import {RootStackScreenProps} from "../../../types";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Drawer from "./components/Drawer";
import {SafeAreaView} from "react-native-safe-area-context";
import Toast from "../../components/Toast";
import {FlashList} from "@shopify/flash-list";
import dayjs from "dayjs";
import LottieView from "lottie-react-native";
import {RectButton} from "../../components/RectButton";
import {store} from "../../app/store";
import {setResponse} from "../../app/slices/userSlice";


interface props {
    theme: 'light' | 'dark',
    item: {
        "communityId": string,
        "createdAt": string,
        "deletedAt": null,
        "id": string,
        "isDeleted": false,
        "status": string,
        "user": {
            "avatar": "",
            "email": string,
            "fullName": string,
            "username": string,
        },
        "userId": string,
    },
    selectUser: (user: {},id:string) => void
}

const RequestCard = ({item, theme, selectUser}: props) => {
    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tint

    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    return (
        <Animated.View key={item.id} layout={Layout.easing(Easing.bounce).delay(30)}
                       entering={FadeInDown.springify()} exiting={FadeOutDown}>
            <Pressable onPress={() => selectUser(item.user,item.id)} style={styles.notificationCard}>


                <View
                    style={styles.roundImage}>
                    <Image style={styles.userAvatar}
                           source={{uri: !item.user.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : item.user.avatar}}/>

                </View>

                <View style={styles.notificationBody}>
                    <Text style={[styles.notificationBodyText, {
                        color: textColor,
                    }]}>
                        {item.user.fullName}
                    </Text>
                    <Text style={styles.time}>
                        {dayjs(item.createdAt).format('DD MMM YYYY')}
                    </Text>
                </View>
                <View style={styles.statusWrap}>
                    <Text style={[styles.statusTxt, {
                        color: lightTextColor
                    }]}>
                        {item.status}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    )
}
const RequestsScreen = ({navigation, route}: RootStackScreenProps<'RequestsScreen'>) => {


    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const user = useAppSelector(state => state.user)
    const {responseState, responseType, responseMessage} = user
    const {id} = route.params

    const [requestModalVisible, setRequestModalVisible] = useState(false);
    const animation = useRef(null);
    const [userRequest, setUserRequest] = useState({});
    const [requestId, setRequestId] = useState('');

    const offset = useSharedValue(0);
    const [toggleMenu, setToggleMenu] = useState(false);

    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'

    const {isLoading, data, refetch} = useQuery(['getCommunityInfo'], () => getCommunityInfo(id), {})
    const {
        isLoading: loading,
        data: requests,
        refetch: getRequests
    } = useQuery(['communityRequests'], () => communityRequests(id), {})


    const {mutate: approve, isLoading: approving} = useMutation(['approveCommunityRequest'], approveCommunityRequest, {
        onSuccess: (data) => {

            if (data.success) {
                getRequests()
                setRequestModalVisible(false)
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'succss',
                }))
            } else {
                setRequestModalVisible(false)
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'error',
                }))
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['approveCommunityRequest'])
        }
    })
    const {mutate: reject, isLoading: rejecting} = useMutation(['declineCommunityRequest'], declineCommunityRequest, {
        onSuccess: (data) => {

            if (data.success) {
                getRequests()
                setRequestModalVisible(false)
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'succss',
                }))
            } else {
                setRequestModalVisible(false)
                dispatch(setResponse({
                    responseMessage: data.message,
                    responseState: true,
                    responseType: 'error',
                }))
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(['declineCommunityRequest'])
        }
    })

    const goBack = () => {
        navigation.goBack()
    }


    //console.log(followers?.data?.result)

    const selectUser = (user: {},id:string) => {
setRequestId(id)
        setUserRequest(user)
        setRequestModalVisible(true)

    }

    const renderItem = useCallback(
        ({item}) => (
            <RequestCard selectUser={selectUser} theme={theme} item={item}/>
        ),
        [theme],
    );
    const menuToggle = () => {
        offset.value = Math.random()
        setToggleMenu(!toggleMenu)
    }

    useRefreshOnFocus(getRequests)
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

    const denyReq = () => {
        reject(requestId)
    }
    const approveReq = () => {
        approve(requestId)
    }

    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);


    return (
        <>

            {
                toggleMenu &&

                <Drawer menuToggle={menuToggle} communityId={id}/>
            }


            <Modal

                animationType="slide"
                transparent={true}
                visible={requestModalVisible}

                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setRequestModalVisible(!requestModalVisible);
                }}
            >
                <View style={styles.backDrop}>
                    <View style={styles.modalContainer}>


                        <View style={styles.modalBody}>
                            <View style={styles.dripImageWrap}>
                                <Image
                                    //{}
                                    source={{uri: !userRequest?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : userRequest?.avatar}}
                                    style={styles.dripImage}/>
                            </View>


                            <View style={styles.textWrap}>
                                <Text style={[styles.missionText, {
                                    color: textColor
                                }]}>
                                    {userRequest.fullName}
                                </Text>

                                <Text style={[styles.learnText, {
                                    textAlign: 'center'
                                }]}>
                                    Requested accessed to {data?.data?.name}
                                </Text>
                            </View>

                            <View style={styles.buttonRow}>


                                <RectButton onPress={denyReq} style={{
                                    width: 150,

                                }}>
                                    {
                                        rejecting ? <ActivityIndicator size='small' color={"#fff"}/> :
                                    <Text style={styles.buttonText}>
                                        Deny

                                    </Text>
                                    }
                                </RectButton>

                                <RectButton onPress={approveReq} style={{
                                    width: 150,

                                }}>
                                    {
                                        approving ? <ActivityIndicator size='small' color={"#fff"}/> :

                                            <Text style={styles.buttonText}>
                                                Allow

                                            </Text>
                                    }
                                </RectButton>
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>

            <SafeAreaView style={[styles.safeArea, {
                backgroundColor
            }]}>
                <Toast message={responseMessage} state={responseState} type={responseType}/>


                <View style={styles.flatlist}>

                    {
                        loading && <ActivityIndicator size='small' color={Colors.primaryColor}/>
                    }
                    {
                        !loading && requests &&


                        <FlashList
                            ListHeaderComponent={renderHeaderItem}

                            scrollEventThrottle={16}
                            estimatedItemSize={200}
                            refreshing={isLoading}
                            onRefresh={refetch}
                            scrollEnabled
                            showsVerticalScrollIndicator={false}
                            data={requests?.data?.result}
                            renderItem={renderItem}

                            keyExtractor={keyExtractor}
                            onEndReachedThreshold={0.3}

                        />
                    }
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
    notificationCard: {
        paddingHorizontal: pixelSizeHorizontal(20),
        width: '100%',
        height: heightPixel(80),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    roundImage: {
        width: 40,
        height: 40,
        borderRadius: 40,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        backgroundColor: '#fff',
        resizeMode: 'cover',
    },
    notificationBody: {
        width: '75%',
        marginLeft: 10,
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '80%'
    },
    notificationBodyText: {


        fontFamily: Fonts.quicksandSemiBold,

        fontSize: fontPixel(14)
    },
    time: {
        marginTop: 5,
        fontFamily: Fonts.quicksandRegular,
        color: Colors.light.lightTextColor,
        fontSize: fontPixel(12)
    },
    statusWrap: {
        height: '50%',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    statusTxt: {
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(12)
    },
    backDrop: {
        width: '100%',
        flex: 1,
        backgroundColor: 'rgba(5,5,5,0.80)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#fff',
        paddingHorizontal: pixelSizeHorizontal(20),
        height: heightPixel(335)
    },
    modalBody: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',

        height: heightPixel(300)
    },
    dripImageWrap: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },

    dripImage: {
        borderRadius: 100,
        resizeMode: 'cover',
        width: "100%",
        height: "100%",
    },
    textWrap: {
        height: 70,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',

    },
    missionText: {
        fontSize: fontPixel(14),

        fontFamily: Fonts.quicksandSemiBold
    },
    learnText: {
        width: '50%',
        fontSize: fontPixel(14),
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold,
        lineHeight: heightPixel(18)
    },
    buttonRow: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },

})

export default RequestsScreen;
