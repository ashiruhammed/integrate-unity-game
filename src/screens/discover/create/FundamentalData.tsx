import React, {useCallback, useMemo, useRef, useState} from 'react';

import {Text, View, StyleSheet, ImageBackground, TouchableOpacity, Pressable, Platform, Keyboard} from 'react-native';
import {AntDesign, Ionicons, Octicons} from "@expo/vector-icons";
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import PushIcon from "../../../assets/images/svg/PushIcon";
import Colors from "../../../constants/Colors";
import {useAppSelector} from "../../../app/hooks";
import {useInfiniteQuery} from "@tanstack/react-query";
import {userNotifications} from "../../../action/action";
import {RootStackScreenProps} from "../../../../types";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";
import * as yup from "yup";
import TextInput from "../../../components/inputs/TextInput";
import HorizontalLine from "../../../components/HorizontalLine";
import {useFormik} from "formik";
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from "@gorhom/bottom-sheet";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";


const formSchema = yup.object().shape({

    productName: yup.string().required('Product Name is required'),
    tagline: yup.string().required('Product Tagline is required'),
    productURL: yup.string().url('Please enter a valid URL').required('Product URL is required'),

});


const Categories = [{
    "_id": "1",
    "label": "SaaS",

}, {
    "_id": "2",
    "label": "Gaming",

}, {
    "_id": "3",
    "label": "NFT",

},
{
    "_id": "4",
    "label": "Design",

},

    ]










interface props {

    selectedItem: any[],
    addPort: (details: {
        "_id": string,

        "label": string,

    }) => void
    selectAsset: (symbol: {}) => void,
    item:
        {
            "_id": string,

            "label": string,

        }

}

const BankItem = ({item, selectedItem, selectAsset, addPort}: props) => {


    return (
        <TouchableOpacity onPress={() => {
            selectAsset(item)
            addPort({
                _id: item._id,

                label: item.label,
            })
        }} activeOpacity={0.6}
                          style={[styles.transactionCardList, {
                              backgroundColor: item._id == selectedItem._id ? "#f9f9f9" : 'transparent'
                          }]}>

            <View style={styles.bankItem}>


                <View style={styles.itemBody}>
                    <Text style={styles.accountName}>
                        {selectedItem.find(selected => selected._id == item._id) ?
                            <Ionicons name="checkbox" size={14} color={Colors.primaryColor}/> : ''}
                    </Text>
                    <Text style={styles.account}>
                        {item.label}
                    </Text>
                </View>


            </View>
        </TouchableOpacity>
    )
}



const FundamentalData = ({navigation}: RootStackScreenProps<'FundamentalData'>) => {


    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice


    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const darkTextColor = theme == 'light' ? Colors.light.darkText : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const tintText = theme == 'light' ? "#AEAEAE" : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? "#DEE5ED" : "#ccc"


    const [focusProductName, setFocusProductName] = useState(false)
    const [focusProductUrl, setFocusProductUrl] = useState(false)
    const [focusProductTagline, setFocusProductTagline] = useState(false)


    const [category, setCategory] = useState<{
        "_id": string,
        "label": string,
    }>({});


    const [selectedCategory , setSelectedCategory] = useState<any[]>([]);






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

            productName: '',
            productURL: '',
            productTagline: '',

        },
        onSubmit: (values) => {
            const {productName} = values;
            //     const body = JSON.stringify({email: email.toLowerCase()})

            navigation.navigate('FundamentalData')
        }
    });


    const snapPoints = useMemo(() => ["1%", "50%", "75%"], []);

    const sheetRef = useRef<BottomSheet>(null);

    const handleSnapPress = useCallback((index: number) => {
        Keyboard.dismiss()
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);

    const keyExtractor = useCallback((item: { _id: string; }) => item._id, [],
    );
    const renderItem = useCallback(({item}: any) => (
        <BankItem selectedItem={selectedCategory} item={item}
                  addPort={setCategory}
                  selectAsset={updatePort}/>
    ), [selectedCategory]);


    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                style={{
                    backgroundColor: 'rgba(25,25,25,0.34)'
                }}
                {...props}
                disappearsOnIndex={0}
                appearsOnIndex={1}
            />
        ),
        []
    );




    const updatePort = useCallback((payload: {
        "_id": string,
        "label": string,
    }) => {

        const newData = selectedCategory.findIndex((bank: { _id: string }) => bank._id === payload._id)

        if (newData >= 0) {
            setSelectedCategory((prevSelectedBanks) => {
                return prevSelectedBanks.filter(
                    (bank) => bank._id !== payload._id
                );
            });
        } else {

            setSelectedCategory(selectedBanks => [...selectedBanks, {...payload}])
        }
    }, [selectedCategory])







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
                            <PushIcon/>
                        </View>

                        <View style={styles.mainInfo}>
                            <Text style={styles.stepText}>
                                Step 2/4
                            </Text>

                            <Text style={styles.pageTitle}>
                                Fundamental Data
                            </Text>
                        </View>

                    </View>

                    <View style={styles.stepsBoxRight}>
                        <Pressable style={styles.nextStep}>
                            <Text style={styles.nextStepText}>
                                Next Step
                            </Text>
                            <AntDesign name="arrowright" size={16} color={Colors.primaryColor}/>
                        </Pressable>
                    </View>

                </View>


                <View style={styles.productBanner}>

                    <Text style={styles.productPageTitle}>
                        Give us more details about this product
                    </Text>

                    <Text style={styles.productPageText}>
                        We’ll need the tagline, links, socials, about, categories
                    </Text>
                </View>


                <View style={styles.authContainer}>


                    <TextInput

                        placeholder="Gatewayapp"
                        keyboardType={"default"}
                        touched={touched.productName}
                        error={touched.productName && errors.productName}
                        onFocus={() => setFocusProductName(true)}
                        onChangeText={(e) => {
                            handleChange('productName')(e);

                        }}
                        onBlur={(e) => {
                            handleBlur('productName')(e);
                            setFocusProductName(false);
                        }}

                        focus={focusProductName}
                        value={values.productName}
                        label="Product Name"/>


                    <TextInput

                        placeholder="Describe the product ina few words..."
                        keyboardType={"default"}
                        touched={touched.productTagline}
                        error={touched.productTagline && errors.productTagline}
                        onFocus={() => setFocusProductTagline(true)}
                        onChangeText={(e) => {
                            handleChange('productTagline')(e);

                        }}
                        onBlur={(e) => {
                            handleBlur('productTagline')(e);
                            setFocusProductTagline(false);
                        }}

                        focus={focusProductTagline}
                        value={values.productTagline}
                        label="Tagline"/>


                    <TextInput

                        placeholder="https://gatewayapp.co"
                        keyboardType={"url"}
                        touched={touched.productURL}
                        error={touched.productURL && errors.productURL}
                        onFocus={() => setFocusProductUrl(true)}
                        onChangeText={(e) => {
                            handleChange('productURL')(e);

                        }}
                        onBlur={(e) => {
                            handleBlur('productURL')(e);
                            setFocusProductUrl(false);
                        }}

                        focus={focusProductUrl}
                        value={values.productURL}
                        label="Product URL"/>


                    <TouchableOpacity activeOpacity={0.8} style={styles.addLinkBtn}>
                        <AntDesign name="pluscircle" size={14} color={Colors.primaryColor}/>
                        <Text style={styles.linkBtnText}>
                            Add more links
                        </Text>

                        <View style={styles.linkContainer}>
                            <Text style={styles.linksPlaceholderText}>
                                (Google Play Store, App Store)
                            </Text>
                        </View>
                    </TouchableOpacity>


                    <HorizontalLine margin/>


                    <TouchableOpacity activeOpacity={0.8} style={styles.selectPortField}
                                      onPress={() => handleSnapPress(2)}>
                        <View style={styles.labelWrap}>
                            <Text style={styles.labelText}>
                                Categories
                            </Text>
                        </View>
                        <View style={styles.selectedPorts}>

                            <View style={[styles.selectedPortsContainer,
                                selectedCategory.length < 1 && {
                                    alignItems: 'center'
                                }]}>

                                {
                                    selectedCategory.length < 1 &&
                                    <Text style={styles.placegholder}>
                                        Categories
                                    </Text>
                                }

                                {
                                    selectedCategory.map((item, index) => (
                                        <Pressable onPress={() => updatePort(item)} key={item._id}
                                                   style={styles.portItem}>
                                            <Text style={styles.portText}>
                                                {item.label}
                                            </Text>
                                            <Ionicons name="close" size={12} color={"#005FD0"}/>
                                        </Pressable>
                                    ))
                                }


                            </View>
                            {/* <View style={styles.addBtn}>
                                    <Ionicons name="ios-chevron-down-sharp" size={24} color="black"/>
                                </View>*/}
                        </View>


                    </TouchableOpacity>


                </View>


                <Pressable disabled={!isValid} onPress={() => handleSubmit()} style={styles.claimBtn}>
                    <Text style={styles.claimBtnText}>
                        Next Step
                    </Text>
                </Pressable>
            </KeyboardAwareScrollView>
        </SafeAreaView>







    <BottomSheet
        // handleIndicatorStyle={{display: 'none'}}
        index={0}
        ref={sheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
    >
        <View style={[styles.sheetHead, {}]}>


            <TouchableOpacity onPress={handleClosePress}
                              style={[styles.dismiss, {

                              }]}>
                <Ionicons name="close-sharp" size={24} color={textColor} />
            </TouchableOpacity>


            <Text style={[styles.sheetTitle, {

                color:textColor
            }]}>
                Select Categories
            </Text>

            <Text style={[styles.resetText, {

            }]}>
                Reset
            </Text>
        </View>


        {


            <BottomSheetFlatList scrollEnabled
                                 data={Categories}
                                 renderItem={renderItem}
                                 keyExtractor={keyExtractor}
                                 showsVerticalScrollIndicator={false}/>

        }
    </BottomSheet>

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

        justifyContent: 'center',
        width: '90%',
        marginTop: 40,
    },
    addLinkBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
        height: 35,
        marginLeft: 15,
    },
    linkBtnText: {
        marginLeft: 5,
        color: Colors.primaryColor,
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(14),
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 5,
    },
    linksPlaceholderText: {
        color: "#999999",
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(14),
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


    selectPortField: {
        width: '100%',
        minHeight: heightPixel(120),
        alignItems: 'flex-start',
        justifyContent: 'flex-start',

    },
    selectedPorts: {
        width: '100%',
        minHeight: heightPixel(56),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.border
    },
    selectedPortsContainer: {
        width: '100%',
        minHeight: heightPixel(56),
        flexDirection: 'row',
        paddingHorizontal: pixelSizeHorizontal(10),
        paddingVertical: pixelSizeVertical(10),
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    portItem: {
        margin: 5,
        paddingHorizontal: pixelSizeHorizontal(10),
        minHeight: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        borderRadius: 15,
        backgroundColor: "#005FD033"
    },
    portText: {
        marginRight: 5,
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandSemiBold,
        color: Colors.primaryColor
    },

    labelWrap: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: 35
    },
    labelText: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,
        color: "#000000"
    },
    placegholder: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandRegular,
        color: "#6D6D6D"
    },
    sheetHead: {
        paddingHorizontal: pixelSizeHorizontal(20),
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
        color:Colors.primaryColor
    },
    dismiss: {

        right: 10,
        borderRadius: 30,
        height: 30,
        width: 30,
        alignItems: "center",
        justifyContent: "center"

    },

    transactionCardList: {
        paddingHorizontal: pixelSizeHorizontal(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        marginLeft:10,
        height: heightPixel(70),


    },
    bankItem: {
        borderColor: Colors.border,

        borderBottomWidth: 0.5,
        width: '100%',
        height: heightPixel(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemBody: {
        width: '90%',
        height: '70%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },

    accountName: {
        color: "#000",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quickSandBold
    },
    account: {
        color: "#000",
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold
    },
})

export default FundamentalData;