import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Pressable,
    Platform,
    ActivityIndicator
} from 'react-native';
import {RootStackScreenProps} from "../../../../types";
import {AntDesign, Ionicons, Octicons} from "@expo/vector-icons";
import ImageIcon from "../../../assets/images/svg/imageIcon";
import Colors from "../../../constants/Colors";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {useInfiniteQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getApprovedProduct, registerProductHunt, updateUserImage, userNotifications} from "../../../action/action";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";
import OpenBoxIcon from "../../../assets/images/svg/OpenBoxIcon";
import SearchInput from "../../../components/inputs/SearchInput";
import Toast from "../../../components/Toast";
import {setResponse, unSetResponse} from "../../../app/slices/userSlice";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {clearProductInfo, updateProduct, updateProductDetails} from "../../../app/slices/dataSlice";
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import dayjs from "dayjs";
import FastImage from "react-native-fast-image";


const MoreInformation = ({navigation}: RootStackScreenProps<'MoreInformation'>) => {


    const [searchValue, setSearchValue] = useState('')

    const dispatch = useAppDispatch()

    const dataSlice = useAppSelector(state => state.data)
    const user = useAppSelector(state => state.user)
    const {theme, productDetails} = dataSlice
    const {responseMessage, responseState, responseType} = user
    const queryClient = useQueryClient();

    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const darkTextColor = theme == 'light' ? Colors.light.darkText : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const tintText = theme == 'light' ? "#AEAEAE" : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? "#DEE5ED" : "#ccc"

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [contentLauchDate, setContentLauchDate] = useState<string>('2023-07-08T12:04:09.124Z');


    // ref
    const bottomSheetRef = useRef<BottomSheetModal>(null);


    const handleClose = () => {
        bottomSheetRef?.current?.close();
    };
    // variables
    const snapPoints = useMemo(() => ["1", "45%"], []);


    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const handleConfirm = (date: Date) => {
        //   setContentLauchDate(dayjs(date).format('YYYY-DD-MM'))
        setContentLauchDate(date)
        dispatch(updateProduct({launchDate: contentLauchDate}))
        // setFieldValue('endDate', dayjs(date).format('YYYY-MM-DD'))
        hideDatePicker();
    };
    const openNotifications = () => {
        navigation.navigate('Notifications')
    }



    const {mutate, isLoading} = useMutation(['registerProductHunt'], registerProductHunt,
        {
            onSuccess: async data => {

                if (data.success) {
                    // alert(message)
                    bottomSheetRef.current?.present()

                    dispatch(setResponse({
                        responseMessage: data.message,
                        responseState: true,
                        responseType: 'success',
                    }))

                } else {


                    dispatch(setResponse({
                        responseMessage: `${data.message} 😞`,
                        responseState: true,
                        responseType: 'error',
                    }))

                }

            },

            onError: (err) => {
                console.log(err)
                dispatch(setResponse({
                    responseMessage: 'Something happened, please try again 😞',
                    responseState: true,
                    responseType: 'error',
                }))


            },
            onSettled: () => {
                queryClient.invalidateQueries(['registerProductHunt']);
            }

        })


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


    const launchProduct = () => {

        const body = JSON.stringify({
            "name": productDetails.name,
            "description": productDetails.description,
            "websiteUrl": productDetails.websiteUrl,
            "ownerWorkedOnProject": productDetails.ownerWorkedOnProject,
            "tagline": productDetails.tagline,
            "googlePlayStoreUrl": productDetails.googlePlayStoreUrl,
            "appleStoreUrl": productDetails.appleStoreUrl,
            "contributors": [],
            "isCountryLimited": productDetails.isCountryLimited,
            "supportedCountries": productDetails.supportedCountries,
            "productLogo": productDetails.productLogo,
            "launchDate": productDetails.launchDate,
            "categories": productDetails.categories,
            "productSteps": productDetails.productSteps,
            "socialMedia": productDetails.socialMedia
        })



       // console.log(productDetails)

        mutate({body})

    }


    useEffect(() => {
        // console.log(user)
        let time: NodeJS.Timeout | undefined;
        if (responseState || responseMessage) {

            time = setTimeout(() => {
                dispatch(unSetResponse())
            }, 3000)

        }
        return () => {
            clearTimeout(time)
        };
    }, [responseState, responseMessage])



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


    const continueScreen = () => {
        dispatch(clearProductInfo())
      navigation.navigate('Dashboard',{
          screen:'Home'
      })
    }


    const openSearch = () =>{
        navigation.navigate('SearchUser')
    }

    return (
        <>

        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
            <Toast message={responseMessage} state={responseType == 'error' ? responseState : false} type={responseType}/>
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
                                         source={require('../../../assets/images/streakicon.png')}>
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


                </View>

                <View style={styles.stepsBox}>
                    <View style={styles.stepsBoxLeft}>

                        <View style={styles.iconBox}>
                            <OpenBoxIcon/>
                        </View>

                        <View style={styles.mainInfo}>
                            <Text style={styles.stepText}>
                                Step 4/4
                            </Text>

                            <Text style={styles.pageTitle}>
                                More Information
                            </Text>
                        </View>

                    </View>


                </View>
                <View style={styles.stepsBoxRight}>
                    <View style={styles.stepsBoxRightWrap}>




                    <TouchableOpacity onPress={showDatePicker} activeOpacity={0.8} style={styles.createBtn}>
                        <AntDesign name="pluscircle" size={14} color={Colors.primaryColor}/>
                        <Text style={styles.createBtnText}>
                            Schedule a Launch Date
                        </Text>
                    </TouchableOpacity>

                        <Text style={styles.contentLauchDate}>
                            {dayjs(contentLauchDate).format('ddd, DD MMM YYYY')}
                        </Text>
                    </View>

                </View>

                <View style={styles.productBanner}>

                    <Text style={styles.productPageTitle}>
                        More Information
                    </Text>

                    <Text style={styles.productPageText}>
                        Few more information you might want to add to your product
                    </Text>
                </View>


                <View style={[styles.container, {
                    height: 60,
                    marginVertical: pixelSizeVertical(20)
                }]}>


                    <Text style={[styles.productPageText, {
                        color: "#333333"
                    }]}>
                        Who worked on this product with you?
                    </Text>
                </View>

                <View style={[styles.container, {
                    height: 30,

                }]}>


                    <Text style={[styles.productPageText, {
                        color: "#333333"
                    }]}>
                        Makers
                    </Text>
                </View>

                <Pressable onPress={openSearch} style={styles.searchBoxWrap}>
                    <SearchInput  placeholder={'Search username here'} value={searchValue}/>

                    <View style={[styles.searchIcon, {
                        borderColor
                    }]}>

                        <AntDesign name="search1" size={18} color="black"/>
                    </View>

                </Pressable>




                <Pressable onPress={launchProduct} style={[styles.claimBtn, {
                    backgroundColor: Colors.primaryColor,
                }]}>
                    {!isLoading ?
                        <Text style={styles.claimBtnText}>
                            Launch Now
                        </Text>
                        :

                        <ActivityIndicator size={"small"} color={"#fff"}/>
                    }
                </Pressable>

                <DateTimePickerModal
                    style={{
                        backgroundColor: "#fff",
                    }}
                    pickerContainerStyleIOS={{
                        backgroundColor: "#fff"
                    }}

                    isDarkModeEnabled={false}
                    cancelTextIOS={"Close"}
                    display={Platform.OS === 'ios' ? "inline" : 'spinner'}
                    themeVariant={theme}
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={(t) => handleConfirm(t)}
                    onCancel={hideDatePicker}
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>

            <BottomSheetModalProvider>
                <BottomSheetModal
                    backdropComponent={renderBackdrop}
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    enableHandlePanningGesture={false}
                    handleStyle={{ display: "none" }}
                    // add bottom inset to elevate the sheet
                    bottomInset={66}
                    index={1}
                    // set `detached` to true
                    detached={true}
                    style={styles.sheetContainer}
                >
                    <BottomSheetView style={styles.contentContainer}>
                        <View style={[styles.sheetHead, {
                            height: 40
                        }]}>


                            <TouchableOpacity onPress={handleClose}
                                              style={[styles.dismiss, {}]}>
                                <Ionicons name="close-sharp" size={20} color={"#11192E"} />
                            </TouchableOpacity>
                        </View>


                        <View style={styles.checkCircle}>

                            <Ionicons name="checkmark" size={34} color={Colors.success} />
                        </View>


                        <Text style={styles.successTitle}>
                            Successful!
                        </Text>
                        <Text style={styles.successText}>
                            {responseMessage}!
                        </Text>


                        <TouchableOpacity onPress={continueScreen} activeOpacity={0.8} style={{marginTop:25,}}>
                            <Text style={styles.textContinue}>
                                Continue
                            </Text>
                        </TouchableOpacity>

                    </BottomSheetView>
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
        width: '100%',
        height: heightPixel(45),
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    stepsBoxRightWrap: {

        height: heightPixel(65),
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    iconBox: {
        backgroundColor: "#FFEDED",
        borderRadius: 100,
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',

    },
    contentLauchDate: {
        marginTop:8,
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandSemiBold,
        color: "#181818",

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

    searchBoxWrap: {

        width: '90%',
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
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        height: 20,
        width: widthPixel(180),
        marginRight: 15,
    },
    createBtnText: {
        marginLeft: 5,
        color: Colors.primaryColor,
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(14),
    },
    container: {
        width: '90%',

    },
    claimBtn: {
        height: 45,

        width: widthPixel(235),
        borderRadius: 30,

        alignItems: 'center',
        marginVertical: 40,
        justifyContent: 'center',
    },
    claimBtnText: {
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quicksandSemiBold
    },
    sheetContainer: {
        width: "90%",
        marginHorizontal: pixelSizeHorizontal(20)
    },
    contentContainer: {
        paddingHorizontal: pixelSizeHorizontal(20),
        alignItems: "center"
    },
    sheetHead: {
        // paddingHorizontal: pixelSizeHorizontal(20),
        height: 60,
        marginTop: 10,
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "row"
    }
    ,
    sheetTitle: {
        marginVertical: 10,
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
    },
    sheetContentText: {
        color: "#5A5A5A",
        fontSize: fontPixel(16),
        lineHeight: 22,
        fontFamily: Fonts.quicksandMedium
    },
    dismiss: {


        borderRadius: 30,
        height: 30,
        width: 30,
        alignItems: "center",
        justifyContent: "center"

    },
    checkCircle: {
        marginTop: 20,
        width: 80,
        height: 80,
        borderRadius: 100,
        backgroundColor: Colors.successTint,
        alignItems: "center",
        justifyContent: "center"
    },
    successTitle: {
        marginVertical: pixelSizeVertical(15),
        color: "#000",
        fontSize: fontPixel(18),

        fontFamily: Fonts.quickSandBold
    },
    successText: {
        marginVertical: pixelSizeVertical(10),
        color: "#5A5A5A",
        fontSize: fontPixel(14),

        fontFamily: Fonts.quicksandMedium
    },
    textContinue:{
        color: "#000",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quickSandBold
    },



})

export default MoreInformation;
