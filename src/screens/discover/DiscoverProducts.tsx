import React, {FC, ReactElement, useCallback, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Platform,
    ImageBackground,
    TouchableOpacity,
    Pressable,
    FlatList,
    Image, StyleProp, ViewStyle, ActivityIndicator,
} from 'react-native';
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import {AntDesign, Entypo, FontAwesome, Ionicons, Octicons} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppSelector} from "../../app/hooks";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {getApprovedProduct, getProductTrending, userNotifications} from "../../action/action";
import {RootStackScreenProps} from "../../../types";
import {LinearGradient} from 'expo-linear-gradient';
import GradientText from "../../components/GradientText";
import SearchInput from "../../components/inputs/SearchInput";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView
} from "@gorhom/bottom-sheet";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import AccordionData from "../../components/accordion/AccordionData";
import Accordion from "../../components/accordion/Accordion";

import MasonryList from '@react-native-seoul/masonry-list';
import {truncate, useRefreshOnFocus} from "../../helpers";


interface OwnerProps {
    id: string;
    avatar: string;
    username: string;
    fullName: string;
}

interface CategoryProps {
    id: string;
    name: string;
    slug: string;
}

interface SocialMediaProps {
    name: string;
    url: string;
}

interface UpvoteProps {
    id: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    productId: string;
}


interface props {
    viewProduct:(item:{})=>void
    item: {
        id: string;
        slug: string;
        name: string;
        description: string;
        websiteUrl: string;
        appleStoreUrl: string;
        googlePlayStoreUrl: string;
        ownerWorkedOnProject: boolean;
        tagline: string;
        ownerId: string;
        createdAt: string;
        isDeleted: boolean;
        updatedAt: string;
        deletedAt: string | null;
        isCountryLimited: boolean;
        productLogo: string;
        launchDate: string;
        status: string;
        supportedCountries: any[]; // Adjust the type as needed
        commentCount: number;
        owner: OwnerProps;
        contributors: any[]; // Adjust the type as needed
        categories: CategoryProps[];
        upvotes: UpvoteProps[];
        downvotes: any[]; // Adjust the type as needed
        socialMedia: SocialMediaProps[];
        _count: {
            contributors: number;
            upvotes: number;
            downvotes: number;
            comments: number;
        };
    }

}

const ProductCardItem = ({item,viewProduct}: props) => {
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const darkTextColor = theme == 'light' ? Colors.light.darkText : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const tintText = theme == 'light' ? "#AEAEAE" : Colors.dark.tintTextColor
    return (
        <Pressable onPress={()=>viewProduct(item)} style={styles.productsCard}>
            <View style={styles.topCard}>
                <View style={styles.topCardLeft}>


                    <View style={styles.productsCardImageWrap}>
                        <Image
                            source={{uri: item.productLogo}}
                            style={styles.productsCardImage}
                        />
                    </View>

                    <Text style={[styles.productsCardTitle, {
                        color: darkTextColor
                    }]}>
                        {item.name}
                    </Text>
                </View>

                <View style={styles.pointCardWrap}>
                    <FontAwesome name="thumbs-up" size={19} color={"#E01414"}/>
                    <Text style={[styles.pointCardText, {
                        color: '#E01414'
                    }]}>
                        {item._count.upvotes}
                    </Text>
                </View>


            </View>


            <View style={[styles.tagPill, {
                alignSelf: 'flex-start'
            }]}>
                <Text style={styles.tagPillText}>
                    #2 Ranked for the week
                </Text>
            </View>

            <Text style={[styles.bodyText, {
                color: tintText,
                alignSelf: 'flex-start'
            }]}>
                {truncate(item.description, 72)}
            </Text>

            <View style={styles.productsCardBottom}>
                <View style={styles.tinyAvatar}>
                    <Image
                        source={{uri: item.owner.avatar}}
                        style={styles.tinyAvatarImg}
                    />
                </View>
                <Text style={styles.productsCardBottomText}>
                    {item.owner.fullName}
                </Text>
            </View>
        </Pressable>
    )
}


interface CardsImage {
    id: string;
    imageUrl: string;
    title: string;
}

const data: CardsImage[] = [
    {id: '0', title: 'Item 1', imageUrl: 'https://i.redd.it/irsfp5m03m081.jpg'},
    {
        id: '1',
        title: 'Item 2',
        imageUrl: 'https://codespaceinc.co/images/uploads/https___specials-images.forbesimg.com_imageserve_6170e01f8d7639b95a7f2eeb_sotheby-s-nft-natively-digital-1-2-sale-bored-ape-yacht-club-8817-by-yuga-labs_0x0.png'
    },
    {
        id: '2',
        title: 'Item 3',
        imageUrl: "https://cdn.geekwire.com/wp-content/uploads/2022/07/melaniabilustracion-No-Planet-B-square.jpg"
    },
    {
        id: '3',
        title: 'Item 4',
        imageUrl: "https://storage.googleapis.com/billionaire-club-327223.appspot.com/brain_mary_jane_efcfd214be/brain_mary_jane_efcfd214be.png"
    },
    {id: '4', title: 'Item 5', imageUrl: 'https://pbs.twimg.com/media/FMZ-_aYXsAMvecg.jpg:large'},
    {id: '5', title: 'Item 6', imageUrl: 'https://media.zenfs.com/en/accesswire.ca/1e994831850c6e6ed911cf9867c15f1c'},
];
const numColumns = 3;


const DiscoverProducts = ({navigation}: RootStackScreenProps<'DiscoverProducts'>) => {


    const [searchValue, setSearchValue] = useState('')

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


    const {data: trending, isLoading, refetch} = useQuery(['getProductTrending'], getProductTrending)


    const {
        data: products,
        isLoading: loadingApproved,
        refetch: fetchApproved
    } = useQuery(['ApprovedProduct'], getApprovedProduct)



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
        <ProductCardItem viewProduct={viewProduct} item={item}/>
    ), [])


    const numColumns = 2;

    const create = () => {
        navigation.navigate('ProductInformation')
    }
    const viewProduct = (item:{}) => {
        navigation.navigate('ProductView',{
            item
        })

    }


    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // variables
    const snapPoints = useMemo(() => ["25%", "55%", "75%"], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {

        bottomSheetModalRef.current?.present();
    }, []);
    const handleClose = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);

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

    const MasonryCard: FC<{ item: CardsImage; style: StyleProp<ViewStyle> }> = ({
                                                                                    item,
                                                                                    style,
                                                                                }, index) => {
        const randomBool = useMemo(() => Math.random() < 0.5, []);


        return (

            <View
                key={item.id}
                style={[styles.item,
                    parseInt(item.id) % numColumns === 0 ? styles.leftItem : styles.rightItem,
                    {
                        // marginVertical: randomBool ? 10 : 5,


                    },]}
            >
                <Image source={{uri: item.imageUrl}} style={styles.itemImage}/>
            </View>

        );
    };

    const renderItemMasonry = ({item, i}): ReactElement => {
        return (
            <MasonryCard item={item}
                         style={[
                             /* {marginLeft: i % 2 === 0 ? 0 : 12}*/

                         ]}
            />
        );
    };


    useRefreshOnFocus(refetch)

    return (
        <>

            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>

                <KeyboardAwareScrollView

                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>


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

                    <View style={[styles.pageTitleWrap, {
                        marginBottom: 25,
                    }]}>
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
                                    <FontAwesome name="thumbs-up" size={12} color="white"/>
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
                                <MasonryList
                                    data={data}
                                    keyExtractor={(item: CardsImage): string => item.id}
                                    numColumns={2}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={renderItemMasonry}


                                />
                                {/* <FlatList

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
                                    <Image source={{uri: item.imageUrl}} style={styles.itemImage}/>
                                </View>
                            )}
                            numColumns={numColumns}
                        />*/}
                            </View>
                        </View>


                    </View>


                    <View style={styles.wrap}>

                        <View style={styles.tagPill}>
                            <Text style={styles.tagPillText}>
                                Trending
                            </Text>
                        </View>
                    </View>


                    <View style={[styles.pageTitleWrap, {}]}>
                        <Text style={[styles.pageTitle, {
                            color: darkTextColor,
                            width: '70%'
                        }]}>
                            Trending Products for the week
                        </Text>
                    </View>

                    <View style={styles.productsContainer}>


                        {isLoading && <ActivityIndicator size={"small"} color={Colors.primaryColor}/>}

                        {
                            !isLoading && trending && trending?.data?.productHuntProjects.length > 0 &&


                            <FlatList

                                data={trending?.data?.productHuntProjects}
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
                        }
                    </View>


                    <View style={styles.wrapSearch}>
                        <Text style={[styles.searchTitle, {
                            color: darkTextColor
                        }]}>
                            Discover different <Text style={{color: Colors.primaryColor}}>products</Text>
                        </Text>

                        <View style={styles.searchBoxWrap}>
                            <SearchInput placeholder={'Search products here'} value={searchValue}/>

                            <View style={[styles.searchIcon, {
                                borderColor
                            }]}>

                                <AntDesign name="search1" size={18} color="black"/>
                            </View>

                        </View>
                    </View>

                    <TouchableOpacity onPress={create} activeOpacity={0.8} style={styles.createBtn}>
                        <AntDesign name="pluscircle" size={14} color={Colors.primaryColor}/>
                        <Text style={styles.createBtnText}>
                            Launch a product
                        </Text>
                    </TouchableOpacity>


                    <View style={styles.filterContainer}>

                        <Pressable onPress={handlePresentModalPress} style={styles.filterCategoryBtn}>
                            <Text style={[styles.filterBtnText, {
                                color: textColor
                            }]}>
                                Categories
                            </Text>
                            <Entypo name="chevron-thin-down" size={16} color={textColor}/>

                        </Pressable>

                        <Pressable onPress={handlePresentModalPress} style={[styles.filterCategoryBtn, {
                            marginLeft: 15,
                        }]}>
                            <Text style={[styles.filterBtnText, {
                                color: textColor
                            }]}>
                                Filters
                            </Text>
                            <Ionicons name="funnel-outline" size={16} color={textColor}/>

                        </Pressable>

                    </View>


                    <View style={[styles.pageTitleWrap, {}]}>
                        <Text style={[styles.pageTitle, {
                            color: darkTextColor,
                            width: '70%'
                        }]}>
                            Products
                        </Text>
                    </View>


                    {loadingApproved && <ActivityIndicator size={"small"} color={Colors.primaryColor}/>}


                    {!loadingApproved && products?.data && products?.data?.productHuntProjects.length > 0 &&

                        products?.data?.productHuntProjects.map((item: any, index: number) => (
                            <Pressable key={item.id} onPress={()=>viewProduct(item)} style={styles.productsCardTwo}>
                                <View style={styles.topCard}>
                                    <View style={styles.topCardLeft}>


                                        <View style={styles.productsCardImageWrap}>
                                            <Image
                                                source={{uri:item.productLogo}}
                                                style={styles.productsCardImage}
                                            />
                                        </View>

                                        <Text style={[styles.productsCardTitle, {
                                            color: darkTextColor
                                        }]}>
                                            {item.name}
                                        </Text>
                                    </View>

                                    <View style={styles.pointCardWrap}>
                                        <FontAwesome name="thumbs-up" size={19} color={"#E01414"}/>
                                        <Text style={[styles.pointCardText, {
                                            color: '#E01414'
                                        }]}>
                                            {item._count.upvotes}
                                        </Text>
                                    </View>


                                </View>


                                <Text style={[styles.bodyText, {
                                    color: tintText,
                                    marginTop: 10,
                                    alignSelf: 'flex-start'
                                }]}>
                                    {truncate(item.description, 100)}
                                </Text>


                                <View style={styles.pillRow}>

                                    {item.categories.map((cat:{id:string,name:string})=>(

                                        <View key={cat.id} style={[styles.tagPillTwo, {
                                            alignSelf: 'flex-start',
                                            marginTop: 10,
                                            marginRight: 10,
                                            minWidth: 45,
                                        }]}>
                                            <Text style={[styles.tagPillText, {
                                                color: "#000"
                                            }]}>
                                                {cat.name}
                                            </Text>
                                        </View>
                                    ))}


                                </View>

                            </Pressable>
                        ))

                    }


                </KeyboardAwareScrollView>
            </SafeAreaView>


            <BottomSheetModalProvider>


                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    backdropComponent={renderBackdrop}
                    snapPoints={snapPoints}
                    //  onChange={handleSheetChanges}
                >
                    <BottomSheetScrollView style={styles.sheetScrollView} contentContainerStyle={{
                        width: "100%",
                        alignItems: "center"
                    }}>

                        <View style={[styles.sheetHead, {}]}>


                            <TouchableOpacity onPress={handleClose}
                                              style={[styles.dismiss, {}]}>
                                <Ionicons name="close-sharp" size={24} color={textColor}/>
                            </TouchableOpacity>


                            <Text style={[styles.sheetTitle, {

                                color: textColor
                            }]}>
                                Products
                            </Text>

                            <Text style={[styles.resetText, {}]}>
                                Reset
                            </Text>
                        </View>

                        <View style={styles.cardBody}>

                            {AccordionData.map((value, index) => {
                                return <Accordion value={value} key={index} type={value.type}/>;
                            })}
                        </View>

                    </BottomSheetScrollView>
                </BottomSheetModal>

            </BottomSheetModalProvider>

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
        marginTop: 20,
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
        overflow: 'hidden'
    },
    item: {

        width: 70,
        // marginVertical: 5,
        height: 75, // Set your desired height here
        borderColor: '#fff',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    leftItem: {
        marginTop: 10,
    },
    rightItem: {
        marginTop: 15,
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
    productRowItemText: {
        fontSize: fontPixel(10),
        color: "#fff",
        marginLeft: 5,
        fontFamily: Fonts.quicksandSemiBold
    },
    scrollView: {
        //  backgroundColor: Colors.background,
        backgroundColor: "#F9F9F9",
        width: '100%',
        alignItems: 'center'
    },
    productsContainer: {
        width: '100%',
        height: 250,


    },
    productsCard: {
        marginTop: 20,
        width: widthPixel(320),
        height: heightPixel(220),
        backgroundColor: "#fff",
        shadowColor: "#212121",
        alignItems: 'center',
        marginHorizontal: pixelSizeHorizontal(10),
        justifyContent: 'space-between',
        paddingHorizontal: pixelSizeHorizontal(20),
        paddingVertical: pixelSizeVertical(10),
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,
        elevation: 3,
    },
    wrap: {
        marginTop: 25,
        width: '90%',
        alignItems: 'flex-start'
    },
    tagPill: {
        backgroundColor: "#FDDCDC",
        paddingHorizontal: pixelSizeHorizontal(10),
        borderRadius: 10,
        minWidth: 65,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagPillText: {
        fontSize: fontPixel(12),
        color: Colors.primaryColor,
        fontFamily: Fonts.quicksandSemiBold
    },
    topCard: {
        height: 60,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    pointCardWrap: {
        width: '30%',
        height: '70%',
        alignItems: 'flex-end',
        justifyContent: 'space-evenly',
    },
    pointCardText: {
        fontSize: fontPixel(12),
        fontFamily: Fonts.quickSandBold
    },
    productsCardImageWrap: {
        height: 50,
        width: 50,
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
    topCardLeft: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    productsCardTitle: {
        fontSize: fontPixel(18),
        marginLeft: 10,
        fontFamily: Fonts.quicksandSemiBold
    },
    bodyText: {
        lineHeight: 20,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
        color: "#AEAEAE"
    },
    productsCardBottom: {
        height: 35,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    tinyAvatar: {
        height: 28,
        width: 28,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tinyAvatarImg: {
        height: '100%',
        width: '100%',
        borderRadius: 100,
        resizeMode: 'cover',
    },
    productsCardBottomText: {
        fontSize: fontPixel(14),
        marginLeft: 10,
        color: "#181818",
        fontFamily: Fonts.quicksandSemiBold
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        height: 55,
        marginLeft: 15,
    },
    createBtnText: {
        marginLeft: 5,
        color: Colors.primaryColor,
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(14),
    },
    wrapSearch: {
        width: '90%',
        height: 70,
        marginVertical: pixelSizeVertical(15),
        alignItems: 'flex-start'
    },
    searchTitle: {
        fontSize: fontPixel(18),
        marginBottom: 5,
        fontFamily: Fonts.quicksandSemiBold
    },
    searchBoxWrap: {

        width: '100%',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    searchIcon: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 10
    },
    filterContainer: {
        marginVertical: pixelSizeVertical(15),
        width: '90%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    filterCategoryBtn: {
        minWidth: 80,
        paddingHorizontal: pixelSizeHorizontal(10),
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        borderRadius: 5,
        borderColor: "#3D3D3D",
        borderWidth: 1,
    },
    filterBtnText: {
        fontSize: fontPixel(14),

        fontFamily: Fonts.quicksandSemiBold
    },


    productsCardTwo: {
        marginTop: 20,
        width: '100%',
        height: heightPixel(180),
        backgroundColor: "#fff",
        alignItems: 'center',
        marginHorizontal: pixelSizeHorizontal(10),
        justifyContent: 'flex-start',
        paddingHorizontal: pixelSizeHorizontal(20),
        paddingVertical: pixelSizeVertical(10),
        borderRadius: 10,

    },
    tagPillTwo: {
        backgroundColor: "#E0E0E0",
        paddingHorizontal: pixelSizeHorizontal(10),
        borderRadius: 10,
        minWidth: 65,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sheetScrollView: {
        width: "100%",
        marginTop: 10,
        backgroundColor: "#fff"
    },
    sheetHead: {
        // paddingHorizontal: pixelSizeHorizontal(20),
        height: 40,
        width: "90%",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row"
    }
    ,
    sheetTitle: {
        fontSize: fontPixel(24),
        fontFamily: Fonts.quickSandBold,

    },
    resetText: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
        color: Colors.primaryColor
    },
    dismiss: {

        right: 10,
        borderRadius: 30,
        height: 30,
        width: 30,
        alignItems: "center",
        justifyContent: "center"

    },
    cardBody: {
        width: "100%",
        flexDirection: "column",
        marginTop: 10,
        alignItems: "center"
    },


    itemAccord: {
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
    },
    pillRow:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap:'wrap',
        width: '100%'
    }

})

export default DiscoverProducts;
