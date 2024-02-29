import React, {useCallback, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Platform,
    Image,
    Pressable,
    FlatList
} from 'react-native';
import {AntDesign, FontAwesome, Fontisto, Ionicons, MaterialIcons, Octicons} from "@expo/vector-icons";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppSelector} from "../../app/hooks";
import Colors from "../../constants/Colors";
import {useInfiniteQuery} from "@tanstack/react-query";
import {userNotifications} from "../../action/action";
import {RootStackScreenProps} from "../../../types";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";


const Products = [
    {
        image: "Ether Vault",
        id: '1'
    },
    {
        image: "Tron Vault",
        id: '2'
    }
]


const TeamData = [
    {
        teamName:"Declan Rice",
        image:"https://img.freepik.com/free-photo/3d-rendering-zoom-call-avatar_23-2149556787.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1702339200&semt=ais",
        id:'1',
    },{
        teamName:"Kelly Rolls",
        image: 'https://img.freepik.com/premium-photo/3d-rendering-zoom-call-avatar_23-2149556775.jpg',
        id:'2',
    },{
        teamName:"Zobolo Chucks",
        image:'https://img.freepik.com/premium-photo/3d-rendering-zoom-call-avatar_23-2149556774.jpg',
        id:'3',
    },{
        teamName:"Bruno Fernandes",
        id:'4',
        image:'https://img.freepik.com/fotos-premium/3d-darstellung-des-zoom-call-avatars_23-2149556773.jpg?size=626&ext=jpg'
    },{
        teamName:"Anita Beca",
        id:'5',
        image: 'https://img.freepik.com/free-photo/3d-rendering-zoom-call-avatar_23-2149556779.jpg'
    },{
        teamName:"Andre Onana",
        image: 'https://img.freepik.com/free-photo/3d-rendering-zoom-call-avatar_23-2149556784.jpg',
        id:'6',
    },
]

interface teamProps {
    item: {
        teamName:string
        image: string

    }
}
interface props {
    item: {}
}

const ProductCardItem = ({item}: props) => {

    return (
        <View style={styles.productsCard}>


        </View>
    )
}


const TeamItem = ({item}: teamProps) => {

    return (
        <Pressable style={styles.teamItem}>
            <View style={styles.friendsOnlineCard}>

                <Image source={{uri: item.image}} style={styles.friendsOnlineCardImage}/>
            </View>

<Text style={styles.teamName}>
    {item.teamName}
</Text>

        </Pressable>

    )
}

const ProductView = ({navigation}: RootStackScreenProps<'ProductView'>) => {

    const user = useAppSelector(state => state.user)
    const {userData, responseState, responseType, responseMessage} = user
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice


    const [refreshing, setRefreshing] = useState(false);
    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const darkTextColor = theme == 'light' ? Colors.light.darkText : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const tintText = theme == 'light' ? "#AEAEAE" : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? "#DEE5ED" : "#ccc"


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


    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],)
    const renderItem = useCallback(({item}) => (
        <ProductCardItem item={item}/>
    ), [])

    const renderTeamItem = useCallback(({item}) => (
        <TeamItem item={item}/>
    ), [])



    return (
        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>

            <KeyboardAwareScrollView

                style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                backgroundColor
            }]} scrollEnabled
                showsVerticalScrollIndicator={false}>


                <View style={styles.topBar}>

                    <View style={styles.leftButton}>

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


                <View style={styles.navButtonWrap}>
                    <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}
                                      style={styles.navButton}>

                        <AntDesign name="arrowleft" size={24} color="black"/>
                        <Text style={[styles.backText, {
                            color: darkTextColor
                        }]}>Back</Text>
                    </TouchableOpacity>


                    <TouchableOpacity activeOpacity={0.8}
                                      style={styles.rightNavButton}>
                        <MaterialIcons name="outlined-flag" size={24} color={Colors.primaryColor}/>

                        <Text style={styles.reportText}>Report</Text>
                    </TouchableOpacity>


                </View>


                <View style={styles.claimProduct}>
                    <Text style={styles.claimProductText}>
                        Will you like to claim this product?
                    </Text>
                </View>


                <View style={styles.productDashInfo}>

                    <View style={styles.productsCardImageWrap}>
                        <Image
                            source={{uri: 'https://images.unsplash.com/photo-1611488006018-95b79a137ff5?q=80&w=2953&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}}
                            style={styles.productsCardImage}
                        />
                    </View>

                    <Text style={styles.productTitle}>
                        Ether Vault
                    </Text>

                    <Text style={styles.productDescription}>
                        A secure and easy-to-use wallet for managing your Ethereum and ERC-20...
                    </Text>

                </View>
                <View style={styles.socialPlug}>
                    <Pressable style={styles.shareBtn}>
                        <Ionicons name="paper-plane" size={20} color="#BFBFBF"/>
                    </Pressable>


                    <Pressable style={styles.shareBtn}>
                        <Fontisto name="twitter" size={20} color="#BFBFBF"/>
                    </Pressable>

                    <Pressable style={styles.shareBtn}>

                        <FontAwesome name="facebook" size={20} color="#BFBFBF"/>
                    </Pressable>
                </View>


                <View style={styles.actionBtnWrap}>
                    <TouchableOpacity style={[styles.actionBtn, {
                        backgroundColor: Colors.primaryColor
                    }]}>
                        <Fontisto name="world-o" size={14} color="#fff"/>
                        <Text style={[styles.buttonText, {
                            color: "#fff"
                        }]}>
                            Visit Website
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={[styles.actionBtn, {
                        backgroundColor: "#F2F2F2"
                    }]}>
                        <FontAwesome name="thumbs-up" size={14} color={Colors.primaryColor}/>
                        <Text style={[styles.buttonText, {
                            color: Colors.primaryColor
                        }]}>
                            Thumbs up
                        </Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.productsContainer}>


                    <FlatList

                        data={Products}
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


                <View style={styles.copyBoxWrap}>
                    <Text style={styles.sectionTitle}>
                        Shareable Link
                    </Text>
                    <TouchableOpacity style={styles.copyBox}>

                        <Text style={styles.copyLinkText}>
                            https://gatewayapp.co/ether...
                        </Text>

                        <Pressable style={styles.copyBtn}>
                            <Text style={styles.copyBtnText}>Copy</Text>
                        </Pressable>
                    </TouchableOpacity>


                </View>


                <View style={styles.tagsBoxWrap}>

                    <View style={styles.tagsWrap}>
                        <Text style={styles.tagTitle}>
                            Tags
                        </Text>
                        <View style={styles.tagItemContainer}>
                            <View style={styles.tagItem}>
                                <Text style={styles.tagItemText}>
                                    SaaS
                                </Text>
                            </View>
                        </View>
                    </View>


                    <View style={styles.countriesWrap}>
                        <Text style={styles.tagTitle}>
                            Supported Countries
                        </Text>
                        <View style={styles.tagItemContainer}>
                            <View style={styles.tagItem}>
                                <Image
                                    source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/800px-Flag_of_Egypt.svg.png'}}
                                    style={styles.flagIcon}/>
                                <Text style={styles.tagItemText}>
                                    Egypt
                                </Text>
                            </View>

                            <View style={styles.tagItem}>
                                <Image
                                    source={{uri: 'https://media.istockphoto.com/id/652740802/vector/nigeria.jpg?s=612x612&w=0&k=20&c=CzqO6nCnCM6KXJp-nZWBV3oxRI5963lwdnQ5TT4TN7Q='}}
                                    style={styles.flagIcon}/>
                                <Text style={styles.tagItemText}>
                                    Nigeria
                                </Text>
                            </View>

                            <View style={styles.tagItem}>
                                <Image source={{uri: 'https://cdn.britannica.com/15/15-004-B5D6BF80/Flag-Kenya.jpg'}}
                                       style={styles.flagIcon}/>
                                <Text style={styles.tagItemText}>
                                    Kenya
                                </Text>
                            </View>

                            <View style={styles.tagItem}>
                                <Image
                                    source={{uri: 'https://cdn.britannica.com/27/4227-004-32423B42/Flag-South-Africa.jpg'}}
                                    style={styles.flagIcon}/>
                                <Text style={styles.tagItemText}>
                                    South Africa
                                </Text>
                            </View>

                            <TouchableOpacity activeOpacity={0.8} style={[styles.tagItem, {
                                backgroundColor: '#F2F2F2'
                            }]}>
                                <Text style={styles.seeMoreText}> See all</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>


                <View style={styles.aboutBoxWrap}>
                    <Text style={styles.tagTitle}>
                        About Ether Vault
                    </Text>
                    <Text style={styles.authorText}>
                        by Declan Rice
                    </Text>

                    <Text style={styles.aboutText}>
                        EtherVault is a secure and user-friendly wallet designed for managing Ethereum and ERC-20
                        tokens. It is built on the Ethereum blockchain and allows users to store, send, and receive
                        transactions in a decentralized and trustless manner.
                        One of the key features of EtherVault is its intuitive and easy-to-use interface, which makes it
                        ideal for...
                    </Text>

                    <TouchableOpacity activeOpacity={0.8} style={[styles.tagItem, {
                        backgroundColor: '#F2F2F2',
                        justifyContent: 'flex-start',
                        paddingHorizontal: 0
                    }]}>
                        <Text style={[styles.seeMoreText,{
                            fontFamily: Fonts.quicksandSemiBold
                        }]}> See more</Text>
                    </TouchableOpacity>
                </View>






                <View style={styles.ourTeam}>
                    <View style={{marginBottom: 5}}>
                        <Text style={[styles.friendsOnlineTitle, {
                            color: textColor
                        }]}>
                            Our Wonderful Team
                        </Text>
                    </View>


                    <FlatList

                        data={TeamData}
                        keyExtractor={keyExtractor}
                        horizontal
                        pagingEnabled
                        scrollEnabled
                        snapToAlignment="center"
                        scrollEventThrottle={16}
                        decelerationRate={"fast"}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderTeamItem}
                    />

                </View>


            </KeyboardAwareScrollView>
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

    navButtonWrap: {
        paddingHorizontal: pixelSizeHorizontal(15),
        width: '100%',
        height: heightPixel(40),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    navButton: {
        width: '15%',
        height: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'row',

        alignItems: 'center',
    },
    rightNavButton: {
        width: widthPixel(100),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    reportText: {
        marginLeft: 5,
        fontSize: fontPixel(14),
        color: Colors.primaryColor,
        fontFamily: Fonts.quicksandMedium
    },
    backText: {
        marginLeft: 5,
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium
    },
    claimProduct: {
        width: '100%',
        backgroundColor: "#F2F2F2",
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: pixelSizeVertical(15),

    },
    claimProductText: {
        color: "#D90429",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quickSandBold
    },
    productDashInfo: {
        width: '100%',
        height: heightPixel(230),
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: pixelSizeHorizontal(20),
    },
    productImage: {
        height: 110,
        width: 110,
        borderRadius: 100,

    },
    productTitle: {
        fontSize: fontPixel(24),
        marginLeft: 10,
        fontFamily: Fonts.quicksandSemiBold
    },
    productDescription: {
        textAlign: 'center',
        lineHeight: 25,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
        color: "#AEAEAE"
    },
    productsCardImageWrap: {
        height: 100,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    productsCardImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 100,
    },
    socialPlug: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    shareBtn: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: pixelSizeHorizontal(5)
    },
    actionBtnWrap: {
        width: '100%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 30,
    },
    actionBtn: {
        width: widthPixel(140),
        borderRadius: 30,
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        paddingHorizontal: 10,

        marginHorizontal: pixelSizeHorizontal(20)
    },
    buttonText: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium
    },
    copyBoxWrap: {
        marginTop: 40,
        height: 90,

        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '90%'

    },
    sectionTitle: {
        lineHeight: 25,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
        color: "#AEAEAE"
    },
    copyBox: {
        marginTop: 15,
        backgroundColor: "#F2F2F2",
        height: 55,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    copyLinkText: {
        color: "#464646",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
    },
    copyBtn: {

        width: 50,
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    copyBtnText: {

        fontSize: fontPixel(14),
        fontFamily: Fonts.quickSandBold,
        color: Colors.primaryColor
    },

    productsContainer: {
        width: '100%',
        height: 250,

        marginLeft: 40,
    },

    productsCard: {

        marginTop: 40,
        width: widthPixel(320),
        height: heightPixel(220),
        backgroundColor: Colors.primaryColor,
        shadowColor: "#212121",
        marginHorizontal: pixelSizeHorizontal(10),
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,
        elevation: 3,
    },

    tagsBoxWrap: {

        marginTop: 40,
        paddingHorizontal: 20,
        paddingVertical: 25,
        minHeight: heightPixel(260),
        borderRadius: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '90%',
        backgroundColor: "#F2F2F2"
    },

    tagsWrap: {
        width: '100%',
        alignItems: 'flex-start',
    },

    tagTitle: {
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
        color: "#464646",

    },
    tagItemContainer: {
        width: '100%',
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap'
    },
    tagItem: {
        minWidth: 50,
        height: 30,
        marginRight: 15,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "#E0E0E0"
    },
    tagItemText: {
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandMedium,
        color: "#3D3D3D",

    },

    countriesWrap: {
        marginTop: 25,
        width: '100%',
        alignItems: 'flex-start',
    },
    flagIcon: {
        marginRight: 5,
        width: 15,
        height: 15,
        resizeMode: 'cover',
        borderRadius: 100,
    },
    seeMoreText: {
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandMedium,
        color: '#464646',

    },


    aboutBoxWrap: {

        marginTop: 40,
        paddingHorizontal: 20,
        paddingVertical: 25,
        minHeight: heightPixel(260),
        borderRadius: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '90%',
        backgroundColor: "#F2F2F2"
    },
authorText:{
    marginTop:10,
    fontSize: fontPixel(14),
    fontFamily: Fonts.quicksandSemiBold,
    color: "#464646",

},
    aboutText: {
        marginTop:10,
        lineHeight:26,
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
        color: "#686868",

    },
teamItem:{
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    height: 110,

},
    teamName:{
        marginTop:8,
color:"#464646",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,
        textAlign:"center",
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

    ourTeam: {
        width: '90%',
        height: 140,

        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: pixelSizeVertical(30),
        marginBottom: 10
    },
    friendsOnlineTitle: {

        fontSize: fontPixel(24),
        fontFamily: Fonts.quickSandBold,
    },
})

export default ProductView;
