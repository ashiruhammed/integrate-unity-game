import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Platform,
    Image,
    Pressable,
    FlatList, ActivityIndicator, Linking
} from 'react-native';
import {AntDesign, Entypo, FontAwesome, Fontisto, Ionicons, MaterialIcons, Octicons} from "@expo/vector-icons";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppSelector} from "../../app/hooks";
import Colors from "../../constants/Colors";
import {useInfiniteQuery, useQuery, useQueryClient,useMutation} from "@tanstack/react-query";
import {getProductComment, getSingleProduct, upVoteProduct, userNotifications} from "../../action/action";
import {RootStackScreenProps} from "../../../types";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import CommentInput from "../../components/inputs/CommentInput";
import CommentIcon from "../../assets/images/svg/CommentIcon";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView
} from "@gorhom/bottom-sheet";

import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import * as yup from "yup";
import {useFormik} from "formik";
import TextInput from "../../components/inputs/TextInput";
import * as Clipboard from 'expo-clipboard';
import FastImage from "react-native-fast-image";
import Animated, {
    Easing,
    Extrapolate, Extrapolation,
    interpolate, interpolateColor,
    useAnimatedStyle, useDerivedValue,
    useSharedValue, withDelay,
    withRepeat, withSequence, withSpring,
    withTiming
} from "react-native-reanimated";
import {truncateString, useRefreshOnFocus} from "../../helpers";



const openLink = async (url:string) =>{
    Linking.openURL(url)
}


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
        teamName: "Declan Rice",
        image: "https://img.freepik.com/free-photo/3d-rendering-zoom-call-avatar_23-2149556787.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1702339200&semt=ais",
        id: '1',
    }, {
        teamName: "Kelly Rolls",
        image: 'https://img.freepik.com/premium-photo/3d-rendering-zoom-call-avatar_23-2149556775.jpg',
        id: '2',
    }, {
        teamName: "Zobolo Chucks",
        image: 'https://img.freepik.com/premium-photo/3d-rendering-zoom-call-avatar_23-2149556774.jpg',
        id: '3',
    }, {
        teamName: "Bruno Fernandes",
        id: '4',
        image: 'https://img.freepik.com/fotos-premium/3d-darstellung-des-zoom-call-avatars_23-2149556773.jpg?size=626&ext=jpg'
    }, {
        teamName: "Anita Beca",
        id: '5',
        image: 'https://img.freepik.com/free-photo/3d-rendering-zoom-call-avatar_23-2149556779.jpg'
    }, {
        teamName: "Andre Onana",
        image: 'https://img.freepik.com/free-photo/3d-rendering-zoom-call-avatar_23-2149556784.jpg',
        id: '6',
    },
]

interface teamProps {
    item: {
        teamName: string
        image: string

    }
}

interface props {
    item: {
        imageUrl:string,
        id:string
    }
}


const formSchema = yup.object().shape({

    email: yup.string().email("Please enter a valid email address").required('Email is required'),


});


const SimilarProductCardItem = ({item}: props) => {
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const darkTextColor = theme == 'light' ? Colors.light.darkText : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const tintText = theme == 'light' ? "#AEAEAE" : Colors.dark.tintTextColor
    return (
        <View style={styles.similarProductsCard}>
            <View style={styles.topCard}>
                <View style={styles.topCardLeft}>


                    <View style={styles.simProductsCardImageWrap}>
                        <Image
                            source={{uri: 'https://images.unsplash.com/photo-1611488006018-95b79a137ff5?q=80&w=2953&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}}
                            style={styles.productsCardImage}
                        />
                    </View>

                    <Text style={[styles.simProductsCardTitle, {
                        color: darkTextColor
                    }]}>
                        Ether Vault
                    </Text>
                </View>

                <View style={styles.pointCardWrap}>
                    <FontAwesome name="thumbs-up" size={19} color={"#E01414"}/>
                    <Text style={[styles.pointCardText, {
                        color: '#E01414'
                    }]}>
                        1600
                    </Text>
                </View>


            </View>


            <Text style={[styles.bodyText, {
                color: tintText,
                alignSelf: 'flex-start'
            }]}>
                A secure and easy-to-use wallet for managing your Ethereum and ERC-20...
            </Text>

            <View style={styles.productsCardBottom}>
                <View style={styles.tinyAvatar}>
                    <Image
                        source={{uri: 'https://pub-static.fotor.com/assets/projects/pages/bc0734b486094ec0b1dec9aa4148de39/fotor-45a3795d0c5b46bcadc381a82e81fae0.jpg'}}
                        style={styles.tinyAvatarImg}
                    />
                </View>
                <Text style={styles.productsCardBottomText}>
                    Declan Rice
                </Text>
            </View>
        </View>
    )
}


const ProductCardItem = ({item}: props) => {

    return (
        <View style={styles.productsCard}>
            <FastImage
                style={styles.imageUrl}
                source={{
                    uri: item.imageUrl,

                    cache: FastImage.cacheControl.web,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />



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

const ProductView = ({navigation,route}: RootStackScreenProps<'ProductView'>) => {

    const {item} = route.params
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState('')

    const user = useAppSelector(state => state.user)
    const {userData, responseState, responseType, responseMessage} = user
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(item.websiteUrl);
        setCopied(true)
    };



    const rotation = useSharedValue(0);


    const progress = useSharedValue(0);
    const progressMore = useSharedValue(0);


    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateZ: `${rotation.value}deg` }]
        };
    });

    const {data,isLoading,refetch} = useQuery(['getSingleProduct',item.slug],()=>getSingleProduct(item.slug))
    const {data:comments,isLoading:loadingComments,refetch:fetchComments} = useQuery(['ProductComments',item.id],()=>getProductComment(item.id))

    const {mutate,isLoading:upvoting} = useMutation(['upVoteProduct'],upVoteProduct,{
        onSuccess:(data)=>{
            refetch()

        },
        onSettled: () => {
            queryClient.invalidateQueries(['upVoteProduct']);
        }

    })


    const handlePressLike = () => {
        mutate(item.id)
        progress.value = withTiming(0, { duration: 500 });
        progressMore.value = withTiming(0, { duration: 500 });
        rotation.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withRepeat(withTiming(10, { duration: 100 }), 6, true),
            withTiming(0, { duration: 50 })
        )



    };

    const [list, setList] = useState([]);

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



    useEffect(() => {
        const countries = require('../../constants/countries.json')
        const cons = countries['countries']
        setList(cons)

    }, [])


    const filteredCountries = list.filter(country => {
        return item.supportedCountries.some(filterItem => filterItem.name === country.name);
    });


    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],)
    const renderItem = useCallback(({item}) => (
        <ProductCardItem item={item}/>
    ), [])

    const renderTeamItem = useCallback(({item}) => (
        <TeamItem item={item}/>
    ), [])

    const renderSimilarProductItem = useCallback(({item}) => (
        <SimilarProductCardItem item={item}/>
    ), [])


    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // variables
    const snapPoints = useMemo(() => ["25%", "75%","85%"], []);

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


    const {
        resetForm,
        handleChange, handleSubmit, handleBlur,
        setFieldValue,
        isSubmitting,
        setSubmitting,
        values,
        errors,
        touched,
        isValid
    } = useFormik({
        validationSchema: formSchema,
        initialValues: {

            email: '',

        },
        onSubmit: (values) => {
            const {email} = values;
            const body = JSON.stringify({email: email.toLowerCase()})


        }
    });


    useRefreshOnFocus(refetch)
    useRefreshOnFocus(fetchComments)

//console.log(item)
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


                    <Pressable onPress={handlePresentModalPress} style={styles.claimProduct}>
                        <Text style={styles.claimProductText}>
                            Will you like to claim this product?
                        </Text>
                    </Pressable>


                    <View style={styles.productDashInfo}>

                        <View style={styles.productsCardImageWrap}>
                            <Image
                                source={{uri: item.productLogo}}
                                style={styles.productsCardImage}
                            />
                        </View>

                        <Text style={styles.productTitle}>
                            {item.name}
                        </Text>

                        <Text style={styles.productDescription}>
                            {item.tagline}
                        </Text>

                    </View>
                    <View style={styles.socialPlug}>
                        <Pressable onPress={()=>openLink(item.socialMedia.find(item => item.name === 'instagram')?.url)} style={styles.shareBtn}>

                            <Entypo name="instagram-with-circle" size={22} color="#BFBFBF" />
                        </Pressable>


                        <Pressable onPress={()=>openLink(item.socialMedia.find(item => item.name === 'twitter')?.url)} style={styles.shareBtn}>
                            <Fontisto name="twitter" size={20} color="#BFBFBF"/>
                        </Pressable>

                        <Pressable onPress={()=>openLink(item.socialMedia.find(item => item.name === 'facebook')?.url)} style={styles.shareBtn}>

                            <FontAwesome name="facebook" size={20} color="#BFBFBF"/>
                        </Pressable>
                    </View>


                    <View style={styles.actionBtnWrap}>
                        <TouchableOpacity onPress={()=>openLink(item.websiteUrl)} style={[styles.actionBtn, {
                            backgroundColor: Colors.primaryColor
                        }]}>
                            <Fontisto name="world-o" size={14} color="#fff"/>
                            <Text style={[styles.buttonText, {
                                color: "#fff"
                            }]}>
                                Visit Website
                            </Text>
                        </TouchableOpacity>


                        <TouchableOpacity activeOpacity={0.7} onPress={handlePressLike}  style={[styles.actionBtn, {
                            backgroundColor: data?.data?.upvotes.find(vote => vote.userId === userData.id) ? Colors.primaryColor : "#F2F2F2"
                        }]}>
                            <Animated.View style={[animatedStyle,{
                                flexDirection:'row',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                             width:'100%'
                            }]}>
                                <FontAwesome name="thumbs-up" size={14} color={data?.data?.upvotes.find(vote => vote.userId === userData.id) ? "#fff" :Colors.primaryColor}/>
                                <Text style={[styles.buttonText, {
                                    color: data?.data?.upvotes.find(vote => vote.userId === userData.id) ? "#fff" : Colors.primaryColor
                                }]}>
                                    Thumbs up
                                </Text>
                            </Animated.View>

                        </TouchableOpacity>
                    </View>


                    <View style={styles.productsContainer}>

                        {
                            isLoading && <ActivityIndicator size={'small'} color={Colors.primaryColor}/>
                        }
                        {
                            !isLoading &&
                           data && data?.data?.productSteps.length > 0 &&


                        <FlatList

                            data={data?.data?.productSteps}
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


                    <View style={styles.copyBoxWrap}>
                        <Text style={styles.sectionTitle}>
                            Shareable Link
                        </Text>
                        <TouchableOpacity activeOpacity={0.9} onPress={copyToClipboard} style={styles.copyBox}>

                            <Text style={styles.copyLinkText}>
                                {item.websiteUrl}
                            </Text>

                            <TouchableOpacity activeOpacity={0.7} onPress={copyToClipboard} style={styles.copyBtn}>
                                {copied ? <Text style={styles.copyBtnText}>Copied</Text> : <Text style={styles.copyBtnText}>Copy</Text>}
                            </TouchableOpacity>
                        </TouchableOpacity>


                    </View>


                    <View style={styles.tagsBoxWrap}>

                        <View style={styles.tagsWrap}>
                            <Text style={styles.tagTitle}>
                                Tags
                            </Text>


                            <View  style={styles.tagItemContainer}>
                                {item.categories.map((cat:{id:string,name:string})=>(
                                <View key={cat.id} style={styles.tagItem}>
                                    <Text style={styles.tagItemText}>
                                        {cat.name}
                                    </Text>
                                </View>
                                ))}


                            </View>
                        </View>


                        <View style={styles.countriesWrap}>
                            <Text style={styles.tagTitle}>
                                Supported Countries
                            </Text>
                            {item.supportedCountries.length > 0 &&
                            <View style={styles.tagItemContainer}>
                                {
                                    filteredCountries.map((country) =>(
                                        <View key={item.phone} style={styles.tagItem}>
                                            <Text>
                                                {country.emoji}
                                            </Text>
                                      {/*      <Image
                                                source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/800px-Flag_of_Egypt.svg.png'}}
                                                style={styles.flagIcon}/>*/}
                                            <Text style={styles.tagItemText}>
                                                {country.name}
                                            </Text>
                                        </View>

                                    ))

                                }

                                <TouchableOpacity activeOpacity={0.8} style={[styles.tagItem, {
                                    backgroundColor: '#F2F2F2'
                                }]}>
                                    <Text style={styles.seeMoreText}> See all</Text>
                                </TouchableOpacity>
                            </View>
                            }
                        </View>

                    </View>


                    <View style={styles.aboutBoxWrap}>
                        <Text style={styles.tagTitle}>
                            About {item.name}
                        </Text>
                        <Text style={styles.authorText}>
                            by {item.owner.fullName}
                        </Text>

                        <Text style={styles.aboutText}>
                            {item.description}
                        </Text>

                        <TouchableOpacity activeOpacity={0.8} style={[styles.tagItem, {
                            backgroundColor: '#F2F2F2',
                            justifyContent: 'flex-start',
                            paddingHorizontal: 0
                        }]}>
                            <Text style={[styles.seeMoreText, {
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


                    <Pressable onPress={()=>navigation.navigate('MakeComment',{
                        id:item.id
                    })} style={styles.wrapCommentBox}>

                        <View style={styles.userAvatar}>
                            <Image source={{uri: !userData.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : userData.avatar}}
                                   style={styles.userAvatarImage}/>
                        </View>
                        <View style={styles.commentBox}>
                            <Text>
                                Leave a comment...
                            </Text>

                            <TouchableOpacity onPress={()=>navigation.navigate('MakeComment',{
                                id:item.id
                            })} style={styles.passBtn}>

                                <Ionicons name="paper-plane-outline" size={18} color="#333333" />

                            </TouchableOpacity>
                        </View>
                       {/* <CommentInput  editable={false} placeholder={'Leave a comment...'} value={commentText}/>
*/}

                    </Pressable>


                    {
                        !loadingComments && comments && comments?.data?.result.length > 0 &&

                        comments?.data?.result.map((comment)=>(
                            <View style={styles.commentCard}>
                                <View style={styles.commentCardTop}>
                                    <View style={styles.commentUserAvatar}>
                                        <Image source={{uri: !comment.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : comment.avatar}}
                                               style={styles.userAvatarImage}/>
                                    </View>

                                    <View style={styles.commentBody}>

                                        <View style={styles.commentDetails}>
                                            <Text style={styles.userName}>
                                                {comment.user.fullName}
                                            </Text>

                                            <Entypo name="dots-three-horizontal" size={24} color="#D9D9D9"/>
                                        </View>

                                        <Text style={styles.commentBodyText}>

                                            {comment.content}
                                        </Text>

                                    </View>
                                </View>

                                <View style={styles.commentCardBottom}>
                                    <View style={styles.usersComment}>

                                    </View>

                                    <Pressable style={styles.bottomBtn}>
                                        <CommentIcon/>
                                        <Text style={styles.bottomBtnText}>
                                            Reply
                                        </Text>
                                    </Pressable>


                                    <Pressable style={styles.bottomBtn}>
                                        <FontAwesome name="thumbs-up" size={18} color="#686868"/>
                                        <Text style={styles.bottomBtnText}>
                                            Thumbs up ({comment.commentLikesCount})
                                        </Text>
                                    </Pressable>


                                    <Pressable onPress={()=>handlePress()} style={styles.bottomBtn}>

                                        <Text style={styles.bottomBtnText}>
                                            Share
                                        </Text>
                                    </Pressable>
                                </View>


                            </View>
                        ))
                    }




                    <View style={styles.statsVault}>

                        <Text style={[styles.friendsOnlineTitle, {
                            color: textColor
                        }]}>
                            Statistics on {item.name}
                        </Text>


                        <View style={styles.vaultBox}>


                            <View style={styles.vaultBoxImageWrap}>
                                <Image
                                    source={{uri:item.productLogo}}
                                    style={styles.productsCardImage}
                                />
                            </View>

                            <View style={styles.vaultBoxBody}>
                                <Text style={styles.vaultTitleBody}>
                                    {item.name}
                                </Text>
                                <Text style={styles.vaultTextBody}>
                                {truncateString(item.description,25)}
                                </Text>


                             {/*   <Text style={styles.vaultTextBody}>
                                    A secure and easy-to-use wallet for managing your Ethereum and ERC-20...
                                </Text>*/}
                            </View>
                        </View>

                    </View>


                    <View style={styles.buttonContainer}>
                        <TouchableOpacity activeOpacity={0.7} onPress={()=>openLink(item.appleStoreUrl)} style={styles.appStoreButton}>
                            <Image
                                source={{uri: 'https://miro.medium.com/v2/resize:fit:1400/1*V9-OPWpauGEi-JMp05RC_A.png'}}
                                style={styles.logo}/>

                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={()=>openLink(item.googlePlayStoreUrl)} style={styles.googlePlayButton}>
                            <Image
                                source={{uri: 'https://contentgrid.thdstatic.com/hdus/en_US/DTCCOMNEW/fetch/NexGen/ContentPage/androidbadgesbox2.png'}}
                                style={styles.logo}/>

                        </TouchableOpacity>
                    </View>

                    {/*<View style={styles.noticeTextWrap}>
                        <Text style={styles.commentBodyText}>
                            Ether Vault by Declan Rice was hunted by David in SaaS, NFTs, DeFi. Made by Tosin, Emmanuel,
                            David, Osazee, Joy, Susan, Richard. Featured on April 8th, 2023. Ether Vault is rated 5/5★
                            by 12
                            users. This is Ether vault first launch.
                        </Text>
                    </View>*/}


                    <View style={styles.otherDetails}>

                        <View style={styles.otherDetailsBox}>
                            <Text style={styles.otherDetailsBoxTitle}>
                                Thumbs up
                            </Text>
                            <Text style={styles.otherDetailsBoxNumber}>
                                {item._count.upvotes}
                            </Text>
                        </View>


                     {/*   <View style={styles.otherDetailsBox}>
                            <Text style={styles.otherDetailsBoxTitle}>
                                Product of the week
                            </Text>
                            <Text style={styles.otherDetailsBoxNumber}>
                                x4
                            </Text>
                        </View>
*/}

                        <View style={styles.otherDetailsBox}>
                            <Text style={styles.otherDetailsBoxTitle}>
                                All Time Ranking
                            </Text>
                            <Text style={styles.otherDetailsBoxNumber}>
                                #{data?.data?.rank}
                            </Text>
                        </View>

                    </View>


                    {/*<View style={[styles.pageTitleWrap, {
                        marginTop: 50,
                    }]}>
                        <Text style={[styles.pageTitle, {
                            color: darkTextColor,
                            width: '70%'
                        }]}>
                            Similar Products
                        </Text>
                    </View>*/}

                 {/*   <View style={[styles.productsContainer, {}]}>


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
                            renderItem={renderSimilarProductItem}
                        />
                    </View>*/}




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


                    <View style={[styles.sheetHead, {}]}>


                        <Text style={[styles.sheetTitle, {

                            color: textColor
                        }]}>

                        </Text>

                        <Text style={[styles.resetText, {}]}>

                        </Text>

                        <TouchableOpacity onPress={handleClose}
                                          style={[styles.dismiss, {}]}>
                            <Ionicons name="close-sharp" size={24} color={textColor}/>
                        </TouchableOpacity>

                    </View>
                    <KeyboardAwareScrollView
                        enableOnAndroid={true}
                        enableResetScrollToCoords={false}
                        bounces={false}
                        contentContainerStyle={{
                            width: "100%",
                            alignItems: "center"
                        }}
                        contentInsetAdjustmentBehavior="always"
                        overScrollMode="always"
                        showsVerticalScrollIndicator={true}
                        style={styles.sheetScrollView}>

                        <View style={styles.cardBody}>

                            <View style={styles.sheetDetails}>


                                <Text style={styles.sheetTitleText}>
                                    We’ll try to access if its really you
                                </Text>

                                <Text style={styles.sheetText}>
                                    This is a verification process to know if you really own <Text style={{
                                        fontFamily:Fonts.quickSandBold,
                                    color:'#000'
                                }}>{item.name}</Text>
                                </Text>




                            </View>
                            <Text style={[styles.sheetText,{
                                marginBottom: 30,
                            }]}>
                                Please enter an email address that matches the product domain <Text style={{
                                fontFamily:Fonts.quickSandBold,
                                color:'#000'
                            }}>({item.websiteUrl}).</Text>
                            </Text>
                            <TextInput

                                placeholder="Email address"
                                keyboardType={"email-address"}
                                touched={touched.email}
                                error={touched.email && errors.email}

                                onChangeText={(e) => {
                                    handleChange('email')(e);

                                }}
                                onBlur={(e) => {
                                    handleBlur('email')(e);

                                }}

                                value={values.email}
                                label="Email"/>

                            <Pressable disabled={!isValid} onPress={()=>handleSubmit()} style={styles.claimBtn}>
                                <Text style={styles.claimBtnText}>
                                    Make Request
                                </Text>
                            </Pressable>
                        </View>
                    </KeyboardAwareScrollView>

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
        minHeight: heightPixel(200),
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
    imageUrl:{
        width: widthPixel(320),
        height: heightPixel(220),
        resizeMode:'cover',
        borderRadius:10,
    },
    tagsBoxWrap: {

        marginTop: 40,
        paddingHorizontal: 20,
        paddingVertical: 25,
        minHeight: heightPixel(160),
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
        minHeight: heightPixel(160),
        borderRadius: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '90%',
        backgroundColor: "#F2F2F2"
    },
    authorText: {
        marginTop: 10,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,
        color: "#464646",

    },
    aboutText: {
        marginTop: 10,
        lineHeight: 26,
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
        color: "#686868",

    },
    teamItem: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        height: 110,

    },
    teamName: {
        marginTop: 8,
        color: "#464646",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,
        textAlign: "center",
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
    wrapCommentBox: {
        width: '90%',
        height: 70,
        marginVertical: pixelSizeVertical(15),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    commentBox:{
        width:'80%',
        borderRadius:  10,
        borderColor: "#CCCCCC",
        backgroundColor: 'transparent',
        height:  heightPixel(55),
        alignItems:'center',
        justifyContent:'space-between',
       paddingHorizontal:20,
        borderWidth: 1,
        flexDirection: 'row',
    },
    commentBoxText:{
        color: '#131313',
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,
    },
    passBtn: {
        height: '100%',
        width: '8%',
        alignItems: 'center',
        justifyContent: "center"
    },

    userAvatar: {
        marginRight: 15,
        width: 36,
        height: 36,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',

    },
    userAvatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        resizeMode: 'cover'

    },
    commentCard: {
        width: '90%',
        marginVertical: pixelSizeVertical(15),
    },
    commentCardTop: {

        width: '100%',

        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    commentUserAvatar: {
        marginRight: 15,
        width: 36,
        height: 36,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

    commentBody: {

        width: '85%',


    },
    commentDetails: {
        height: 40,
        width: '100%',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    userName: {
        color: "#181818",
        fontSize: fontPixel(18),
        fontFamily: Fonts.quicksandSemiBold,
    },
    commentBodyText: {
        color: "#686868",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
        lineHeight: 22,
    },
    commentCardBottom: {
        height: 50,
        width: '100%',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    bottomBtn: {
        height: 40,
        minWidth: 80,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomBtnText: {
        color: "#686868",
        marginLeft: 10,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
    },
    usersComment: {
        width: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    statsVault: {
        width: '90%',


        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: pixelSizeVertical(30),
        marginBottom: 10
    },
    vaultBox: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '90%',
        minHeight: 90,
    },
    vaultBoxImageWrap: {
        marginRight: 10,
        height: 55,
        width: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    vaultBoxBody: {
        width: '80%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

    },
    vaultTitleBody: {
        color: "#000",
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,

    }, vaultTextBody: {
        marginTop: 5,
        color: "#AEAEAE",
        lineHeight: 20,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,

    },


    buttonContainer: {
        flexDirection: 'row',
    },
    appStoreButton: {
        width: widthPixel(130),
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 5,
        marginRight: 10,
    },
    googlePlayButton: {
        width: widthPixel(130),
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 5,
    },

    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',

        borderRadius: 5,
    },
    noticeTextWrap: {
        marginTop: 30,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center'
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


    similarProductsCard: {
        marginTop: 20,
        width: widthPixel(320),
        height: heightPixel(200),
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
    simProductsCardImageWrap: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    simProductsCardImage: {
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

    simProductsCardTitle: {
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
    otherDetails: {
        marginTop: 20,
        height: heightPixel(280),
        alignItems: 'center',
        justifyContent: "space-evenly",
        width: '90%'
    },
    otherDetailsBox: {
        height: 75,
        width: '80%',
        alignItems: 'center',
        justifyContent: "center"
    },
    otherDetailsBoxTitle: {
        fontSize: fontPixel(14),
        color: "#686868",
        fontFamily: Fonts.quicksandMedium
    },
    otherDetailsBoxNumber: {
        fontSize: fontPixel(24),
        marginTop: 5,
        color: "#181818",
        fontFamily: Fonts.quickSandBold
    },
    sheetScrollView: {
        width: "100%",
        marginTop: 10,
        backgroundColor: "#fff"
    },
    sheetHead: {
        // paddingHorizontal: pixelSizeHorizontal(20),
        height: 40,
        width: "100%",
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
        width: "90%",
        flexDirection: "column",
        marginTop: 10,
        alignItems: "center",
    },
    sheetDetails: {
        width: '100%',
        height: 160,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    sheetTitleText: {
        fontSize: fontPixel(24),
        color: '#000',
        fontFamily: Fonts.quickSandBold,
        marginBottom: 20,
    },
    sheetText: {
        fontSize: fontPixel(14),
        color: '#AEAEAE',
        lineHeight: 20,
        fontFamily: Fonts.quicksandMedium,
        marginBottom: 20,
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

})

export default ProductView;
