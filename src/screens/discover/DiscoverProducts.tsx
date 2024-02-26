import React, {useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Platform,
    ImageBackground,
    TouchableOpacity,
    Pressable,
    FlatList,
    Image
} from 'react-native';
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import {AntDesign, FontAwesome, Ionicons, Octicons} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppSelector} from "../../app/hooks";
import {useInfiniteQuery} from "@tanstack/react-query";
import {userNotifications} from "../../action/action";
import {RootStackScreenProps} from "../../../types";
import {LinearGradient} from 'expo-linear-gradient';
import GradientText from "../../components/GradientText";
import {FlashList} from "@shopify/flash-list";


const data = [
    {id: '1', title: 'Item 1', imageUrl:'https://i.redd.it/irsfp5m03m081.jpg'},
    {id: '2', title: 'Item 2', imageUrl: 'https://codespaceinc.co/images/uploads/https___specials-images.forbesimg.com_imageserve_6170e01f8d7639b95a7f2eeb_sotheby-s-nft-natively-digital-1-2-sale-bored-ape-yacht-club-8817-by-yuga-labs_0x0.png'},
    {id: '3', title: 'Item 3', imageUrl: "https://cdn.geekwire.com/wp-content/uploads/2022/07/melaniabilustracion-No-Planet-B-square.jpg"},
    {id: '4', title: 'Item 4', imageUrl: "https://storage.googleapis.com/billionaire-club-327223.appspot.com/brain_mary_jane_efcfd214be/brain_mary_jane_efcfd214be.png"},
    {id: '5', title: 'Item 5', imageUrl: 'https://pbs.twimg.com/media/FMZ-_aYXsAMvecg.jpg:large'},
    {id: '6', title: 'Item 6',imageUrl: 'https://media.zenfs.com/en/accesswire.ca/1e994831850c6e6ed911cf9867c15f1c'},
];
const numColumns = 3;


const DiscoverProducts = ({navigation}: RootStackScreenProps<'DiscoverProducts'>) => {


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




    const numColumns = 2;


    return (
        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
            <View style={styles.topBar}>

                <View style={styles.leftButton}>
                    <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}
                                      style={styles.backButton}>

                        <AntDesign name="arrowleft" size={30} color="black"/>
                    </TouchableOpacity>
                    <View style={styles.pointWrap}>
                        <Ionicons name="gift" size={16} color="#22BB33"/>
                        <Text style={styles.pointsText}>20000</Text>
                    </View>
                </View>

                <View style={styles.rightButton}>

                    <ImageBackground style={styles.streaKIcon} resizeMode={'contain'}
                                     source={require('../../assets/images/streakicon.png')}>
                        <Text style={styles.streakText}> 200</Text>
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
                    Discover
                </Text>
            </View>


            <View style={styles.productDashboard}>

                <View style={styles.leftProductDash}>
                    <Text style={styles.leftProductDashTitle}>
                        #1 Top Ranked for the week
                    </Text>


                    <View style={styles.productRow}>

                        <View style={styles.productRowItem}>
                            <Text style={styles.productRowItemText}>
                                NFTworld
                            </Text>
                        </View>

                        <View style={[styles.productRowItem,
                            {justifyContent: 'flex-end'}]}>
                            <FontAwesome name="thumbs-up" size={12} color="white" />
                            <Text style={styles.productRowItemText}>
                                3000 Thumbs up
                            </Text>
                        </View>
                    </View>

                    <View style={styles.textBody}>
                        <Text style={styles.leftProductDashDescription}>
                            Generating of
                        </Text>
                        <GradientText style={styles.leftProductDashDescription}>NFT images
                        </GradientText>
                        <Text style={styles.leftProductDashDescription}> MADE
                        </Text>
                        <GradientText style={styles.leftProductDashDescription}>
                            easy
                            with AI
                        </GradientText>
                        <Text style={styles.leftProductDashDescription}>
                            🔥
                        </Text>
                    </View>


                    <Pressable style={styles.viewBtn}>
                        <Text style={styles.viewBtnText}>
                            View Product
                        </Text>
                    </Pressable>
                </View>


                <View style={styles.rightProductDash}>
                    <View style={styles.masonryWrap}>


                        <FlatList

                            scrollEnabled
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={data}
                            keyExtractor={(item) => item.id}
                            renderItem={({item, index}) => (
                                <View
                                    style={[
                                        styles.item,
                                        index % numColumns === 0 ? styles.leftItem : styles.rightItem,
                                    ]}
                                >
                                   <Image source={{uri:item.imageUrl}} style={styles.itemImage}/>
                                </View>
                            )}
                            numColumns={numColumns}
                        />
                    </View>
                </View>


            </View>


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
        marginVertical: pixelSizeVertical(20),
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
        width: '15%',
        height: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'row',

        alignItems: 'center',
    },
    backButton: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
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
    productDashboard: {
        width: '100%',
        backgroundColor: "#000",
        flexDirection: 'row',
        justifyContent: 'center',

        alignItems: 'center',
        height: heightPixel(250)
    },
    leftProductDash: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '90%',
        width: '55%',

        paddingVertical: pixelSizeVertical(5),
    },
    rightProductDash: {

        alignItems: 'center',
        height: '100%',
        width: '40%',

    },
    leftProductDashTitle: {
        fontSize: fontPixel(12),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    textBody: {
        width: '100%',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        flexWrap: 'wrap'

    },
    productRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-evenly',
        height: 25,
    },
    leftProductDashDescription: {
        fontSize: fontPixel(18),
        color: "#fff",
        lineHeight: 22,
        textTransform: 'uppercase',
        fontFamily: Fonts.quickSandBold
    },
    bottomBtn: {
        height: 40,
        backgroundColor: "#01AAFF",
        width: 140,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    masonryWrap: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        overflow:'hidden'
    },
    item: {

        width: 70,
        margin: 5,
        height: 75, // Set your desired height here
        borderColor: '#fff',
        borderWidth:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemImage:{
        width:'100%',
        height:'100%',
        resizeMode:'cover'
    },
    leftItem: {
        marginTop: 5,
    },
    rightItem: {
        marginTop: -15,
    },
    viewBtn: {
        backgroundColor: "#01AAFF",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        height: 35,
        width: 130,
    },
    viewBtnText: {
        fontSize: fontPixel(14),
        color: "#fff",
        textTransform: 'capitalize',
        fontFamily: Fonts.quicksandSemiBold

    },

    productRowItem: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'flex-start'
    },
    productRowItemText:{
        fontSize: fontPixel(10),
        color: "#fff",
        marginLeft:5,
        fontFamily: Fonts.quicksandSemiBold
    }

})

export default DiscoverProducts;
