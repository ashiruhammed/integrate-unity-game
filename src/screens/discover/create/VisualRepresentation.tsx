import React, {useEffect, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Pressable,
    ScrollView,
    Platform,
    ActivityIndicator, Image, Button
} from 'react-native';
import {AntDesign, Ionicons, Octicons} from "@expo/vector-icons";
import PushIcon from "../../../assets/images/svg/PushIcon";
import Colors from "../../../constants/Colors";
import {SafeAreaView} from "react-native-safe-area-context";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getUserDashboard, uploadToCloudinary, userNotifications} from "../../../action/action";
import {RootStackScreenProps} from "../../../../types";
import ImageIcon from "../../../assets/images/svg/imageIcon";
import HorizontalLine from "../../../components/HorizontalLine";
import ImagePic from "../../../assets/images/svg/ImagePic";
import {setResponse, unSetResponse} from "../../../app/slices/userSlice";
import {api_key, upload_preset} from "../../../constants";
import FastImage from "react-native-fast-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {isLessThanTheMB} from "../../../helpers";
import {IF} from "../../../helpers/ConditionJsx";
import {addNotificationItem, addProductStep, updateProduct, updateProductDetails} from "../../../app/slices/dataSlice";
import SwipeAnimatedToast from "../../../components/toasty";



const getFileInfo = async (fileURI: string) => {
    const fileInfo = await FileSystem.getInfoAsync(fileURI, {
        size: true,

    })

    return fileInfo


}


const VisualRepresentation = ({navigation}: RootStackScreenProps<'VisualRepresentation'>) => {

    const queryClient = useQueryClient();
    const dataSlice = useAppSelector(state => state.data)

    const user = useAppSelector(state => state.user)
    const {theme,productDetails} = dataSlice
    const {responseMessage,responseType,responseState} = user

    const dispatch = useAppDispatch()

    const [image, setImage] = useState('');
    const [imageLogo, setImageLogo] = useState('');

    const [imageUrl, setImageUrl] = useState('');
    const [imageLogoUrl, setImageLogoUrl] = useState('');


    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const darkTextColor = theme == 'light' ? Colors.light.darkText : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const tintText = theme == 'light' ? "#AEAEAE" : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? "#DEE5ED" : "#ccc"
    const {isLoading: loadingUser,data:userDashboard, isRefetching, refetch:fetchDashboard} = useQuery(['getUserDashboard'], getUserDashboard, {


    })


    const {mutate: createImage, isLoading: creatingImage} = useMutation(['uploadToCloudinary'], uploadToCloudinary,
        {
            onSuccess: async data => {
setImage('')
                // alert(message)
                dispatch(addProductStep({imageUrl: data.secure_url}))

                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'success',
                    body:  'Image added 👍',
                }))
            },

            onError: (err) => {


                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body:  'Something happened, please try again 😞',
                }))

            },
            onSettled: () => {
                queryClient.invalidateQueries(['uploadToCloudinary']);
            }

        })


    const {
        mutate: uploadLogo,
        isLoading: uploadingLogoUrl
    } = useMutation(['uploadLogoToCloudinary'], uploadToCloudinary,
        {
            onSuccess: async data => {

                // alert(message)
                setImageLogo("")
                setImageLogoUrl(data.secure_url)
                dispatch(updateProduct({productLogo: data.secure_url}))

            },

            onError: (err) => {


                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body:  'Something happened, please try again 😞',
                }))


            },
            onSettled: () => {
                queryClient.invalidateQueries(['uploadLogoToCloudinary']);
            }

        })


    const pickImageLogo = async () => {
        // requestPermission()
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            // base64:true,
            //aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled) {
            const fileInfo = await getFileInfo(result?.assets[0].uri)
            const isLessThan = isLessThanTheMB(fileInfo?.size, 8)

            if (Platform.OS == 'ios' && !isLessThan) {


                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body:  'Image file too large, must be less than 4MB 🤨',
                }))

            }

            setImageLogo(result?.assets[0].uri);


        }
    };
    const pickImage = async () => {
        // requestPermission()
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            // base64:true,
            //aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled) {
            const fileInfo = await getFileInfo(result?.assets[0].uri)
            const isLessThan = isLessThanTheMB(fileInfo?.size, 8)

            if (Platform.OS == 'ios' && !isLessThan) {



                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body:  'Image file too large, must be less than 4MB 🤨',
                }))
            }

            setImage(result?.assets[0].uri);


        }
    };



    useEffect(() => {
        if (!imageLogo) {
            return;
        } else if (imageLogo) {
            (async () => {

                const data = new FormData()


                let type = await imageLogo?.substring(imageLogo.lastIndexOf(".") + 1);
                let fileName = imageLogo.split('/').pop()

                // data.append("file", image, "[PROXY]");
                data.append("upload_preset", upload_preset);
                data.append("api_key", api_key);
                data.append('file', {uri: imageLogo, name: fileName, type: `image/${type}`} as any)


                uploadLogo({body: data, resource_type: 'image'})

            })()
        }
    }, [imageLogo]);


    useEffect(() => {
        if (!image) {
            return;
        } else if (image) {
            (async () => {

                const data = new FormData()


                let type = await image?.substring(image.lastIndexOf(".") + 1);
                let fileName = image.split('/').pop()

                // data.append("file", image, "[PROXY]");
                data.append("upload_preset", upload_preset);
                data.append("api_key", api_key);
                data.append('file', {uri: image, name: fileName, type: `image/${type}`} as any)


                createImage({body: data, resource_type: 'image'})

            })()
        }
    }, [image]);


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


    const confirmSelect = () => {
        navigation.navigate('MoreInformation')
    }

    return (
        <>


        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
         <SwipeAnimatedToast/>
            <ScrollView

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

                        <ImageBackground style={styles.streaKIcon} resizeMode={'contain'}
                                         source={require('../../../assets/images/streakicon.png')}>
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


                <View style={styles.navButtonWrap}>
                    <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}
                                      style={styles.navButton}>

                        <AntDesign name="arrowleft" size={24} color="black"/>
                        <Text style={[styles.backText, {
                            color: darkTextColor
                        }]}>Back</Text>
                    </TouchableOpacity>


                </View>



                <View style={styles.stepsBox}>
                    <View style={styles.stepsBoxLeft}>

                        <View style={styles.iconBox}>
                            <ImageIcon/>
                        </View>

                        <View style={styles.mainInfo}>
                            <Text style={styles.stepText}>
                                Step 3/4
                            </Text>

                            <Text style={styles.pageTitle}>
                                Visual Representation
                            </Text>
                        </View>

                    </View>

                    <View style={styles.stepsBoxRight}>
                        <Pressable onPress={() => navigation.navigate('MoreInformation')} style={styles.nextStep}>
                            <Text style={styles.nextStepText}>
                                Next Step
                            </Text>
                            <AntDesign name="arrowright" size={16} color={Colors.primaryColor}/>
                        </Pressable>
                    </View>

                </View>


                <View style={styles.productBanner}>

                    <Text style={styles.productPageTitle}>
                        Imagery
                    </Text>

                    <Text style={styles.productPageText}>
                        Let’s elevate the aesthetics of your product
                    </Text>
                </View>
                <View style={styles.authContainer}>

                    <View style={styles.productLogoContainer}>
                        <View style={styles.imageBoxWrap}>
                            <Text style={styles.imageLabel}>
                                Product Logo
                            </Text>

                            <View style={styles.imageBox}>
                                <IF condition={imageLogoUrl !== ''}>

                                    <FastImage
                                        style={styles.imageLogoUrl}
                                        source={{
                                            uri: productDetails.productLogo,

                                            cache: FastImage.cacheControl.web,
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </IF>
                                <IF condition={imageLogoUrl == ''}>
                                    {
                                        uploadingLogoUrl ? <ActivityIndicator color={Colors.primaryColor}/>
                                            :

                                            <ImagePic/>
                                    }
                                </IF>
                            </View>
                        </View>


                        <View style={styles.selectImageWrap}>

                            <TouchableOpacity activeOpacity={0.8} onPress={pickImageLogo} style={styles.selectImageBtn}>
                                <Text style={styles.selectImageBtnText}>
                                    Select an image
                                </Text>
                            </TouchableOpacity>

                            <Text style={[styles.selectImageBtnText, {
                                lineHeight: 22,
                            }]}>
                                Recommended size: 240x240 | JPG, PNG, GIF. Max size: 2MB
                            </Text>

                        </View>

                    </View>


                    <HorizontalLine margin/>


                    <View style={styles.productBanner}>

                        <Text style={styles.productPageTitle}>
                            Steps
                        </Text>

                        <Text style={styles.productPageText}>
                            You could upload the steps on how to use your with pictures or videos
                        </Text>
                    </View>


                    <Pressable onPress={pickImage} style={styles.imageBigBox}>
                        {
                            creatingImage ? <ActivityIndicator color={Colors.primaryColor} size={"small"}/>
                                :

                                <ImagePic/>
                        }


                        <Text style={styles.browseImageText}>
                            Browse files <Text style={{color: "#686868"}}>or</Text> paste image URL
                        </Text>
                        <Text style={[styles.selectImageBtnText, {
                            lineHeight: 22,
                            marginTop: 20,
                            textAlign: 'center',
                            width: '80%'
                        }]}>
                            Recommended size: 240x240 | JPG, PNG, GIF. Max size: 2MB
                        </Text>
                    </Pressable>


                    <View style={styles.productStepsWrap}>
                        {
                            productDetails?.productSteps &&
                            productDetails.productSteps.length > 0 &&
                            productDetails.productSteps.map((step, index) => (
                                <View key={step.index} style={styles.stepsImageBox}>


                                    <FastImage
                                        style={styles.stepsImageLogo}
                                        source={{
                                            uri: step.imageUrl,

                                            cache: FastImage.cacheControl.web,
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />

                                </View>
                            ))
                        }

                    </View>




                </View>

                <Pressable  onPress={confirmSelect} style={styles.claimBtn}>
                    <Text style={styles.claimBtnText}>
                        Next Step
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
        </>
    )
        ;
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
    stepsBox: {
        width: '90%',
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    stepsBoxLeft: {
        width: '60%',
        height: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    stepsBoxRight: {
        width: '30%',
        height: '90%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    iconBox: {
        backgroundColor: "#FFEDED",
        borderRadius: 100,
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',

    },

    mainInfo: {

        borderRadius: 100,
        height: 50,
        marginLeft: 10,
        width: '65%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',

    },
    stepText: {
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandMedium,
        color: "#969696"
    },
    pageTitle: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,
        color: "#181818"
    },
    nextStep: {
        width: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    nextStepText: {
        marginRight: 5,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,
        color: Colors.primaryColor
    },
    productBanner: {
        height: heightPixel(120),
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '90%',
    },

    productPageTitle: {
        width: '80%',
        fontSize: fontPixel(24),
        fontFamily: Fonts.quickSandBold,
        color: "#000"
    },
    productPageText: {
        lineHeight: 22,
        marginTop: 10,
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandMedium,
        color: "#686868"
    },
    authContainer: {
        marginBottom: 40,
        justifyContent: 'center',
        width: '90%',

    },
    productLogoContainer: {
        width: '90%',
        height: 160,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    imageBoxWrap: {
        height: 140,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },

    imageLabel: {
        marginLeft: 10,
        alignSelf: 'flex-start',
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandRegular,
        color: "#333333"
    },
    imageBox: {
        marginTop: 10,
        width: 130,
        height: 130,
        borderColor: "#CCCCCC",
        borderStyle: 'dashed',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageLogoUrl: {
        backgroundColor: "#CCCCCC",
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 10,

    },
    stepsImageLogo: {
        backgroundColor: "#CCCCCC",
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 10,

    },

    productStepsWrap:{
        marginTop:10,
      flexDirection:'row',
      flexWrap:"wrap",
      width:'100%',
      alignItems:'center' ,
    },
    stepsImageBox:{
        margin: 10,
        width: 90,
        height: 90,
        borderColor: "#CCCCCC",
        borderStyle: 'dashed',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },

    selectImageWrap: {
        paddingHorizontal: 15,
        paddingTop: 15,
        height: 150,

        width: 180,
        justifyContent: 'space-evenly',
        alignItems: 'flex-start'
    },
    selectImageBtn: {
        borderColor: "#E6E6E6",
        borderWidth: 1,
        width: 130,
        height: 35,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectImageBtnText: {
        color: "#686868",
        fontFamily: Fonts.quicksandRegular,
        fontSize: fontPixel(14)
    },
    imageBigBox: {
        alignSelf: 'center',
        marginTop: 10,
        width: '100%',
        height: 310,
        borderColor: "#CCCCCC",
        borderStyle: 'dashed',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },

    browseImageText: {
        marginTop: 20,
        color: "#E01414",
        fontFamily: Fonts.quicksandRegular,
        fontSize: fontPixel(14)
    },
    claimBtn: {
        height: 45,

        width: widthPixel(235),
        borderRadius: 30,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        marginVertical: 40,
        justifyContent: 'center',
    },
    claimBtnText: {
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quicksandSemiBold
    },
})

export default VisualRepresentation;
