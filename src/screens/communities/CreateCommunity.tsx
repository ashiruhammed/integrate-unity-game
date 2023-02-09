import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {Text, View, StyleSheet, Image, Platform, Keyboard, TouchableOpacity, ActivityIndicator} from 'react-native';
import NavBar from "../../components/layout/NavBar";
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {fontPixel, heightPixel, pixelSizeHorizontal} from "../../helpers/normalize";
import * as yup from "yup";
import {useFormik} from "formik";
import {RootStackScreenProps} from "../../../types";
import TextInput from "../../components/inputs/TextInput";
import SelectInput from "../../components/inputs/SelectInput";
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from "@gorhom/bottom-sheet";
import Colors from "../../constants/Colors";
import {Fonts} from "../../constants/Fonts";
import {Ionicons} from "@expo/vector-icons";
import {
    BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setResponse, unSetResponse} from "../../app/slices/userSlice";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import TextAreaInput from '../../components/inputs/TextArea';
import {RectButton} from "../../components/RectButton";
import HorizontalLine from "../../components/HorizontalLine";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {allAvailableBadges, createCommunity, updateCompleteProfile, uploadToCloudinary} from "../../action/action";
import Toast from "../../components/Toast";
import {isLessThanTheMB} from "../../helpers";
import {api_key, upload_preset} from "../../constants";


const getFileInfo = async (fileURI: string) => {
    const fileInfo = await FileSystem.getInfoAsync(fileURI, {
        size: true,

    })

    return fileInfo


}

const formSchema = yup.object().shape({
    communityName: yup.string().min(2, 'Name is Too short').required('Community name is required'),
    //   category: yup.string().required('Category is required').trim('No white spaces'),
    memberLimit: yup.string().required('Member is required'),
    gateWayUsername: yup.string().required('Gateway username is required'),
    badgeId: yup.string().required('Please provide Badge required for access'),
    // amountOfBadge: yup.string().required('Please provide number of Badges access'),
    // NFTAccess: yup.string().required('Please provide NFTs required for access'),
    about: yup.string().required('Please community description'),

});

const CreateCommunity = ({navigation}: RootStackScreenProps<'CreateCommunity'>) => {


    const queryClient = useQueryClient();
    const dispatch = useAppDispatch()
    const dataSlice = useAppSelector(state => state.data)
    const user = useAppSelector(state => state.user)
    const {theme} = dataSlice

    const {responseState, responseType, responseMessage} = user
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [communityName, setCommunityName] = useState('');
    const [fCommunityName, setFCommunityName] = useState(false);

    const [category, setCategory] = useState('');

    const [badgeId, setBadgeId] = useState('');

    const [gateWayUsername, setGateWayUsername] = useState('');
    const [fGateWayUsername, setFGateWayUsername] = useState(false);


    const [memberLimit, setMemberLimit] = useState('');
    const [fMemberLimit, setFMemberLimit] = useState(false);


    const snapPoints = useMemo(() => ["1%", "45%"], []);

    const sheetRefCategory = useRef<BottomSheet>(null);
    const handleSnapPressCategory = useCallback((index: number) => {
        Keyboard.dismiss()
        sheetRefCategory.current?.snapToIndex(index);
    }, []);
    const handleClosePressCategory = useCallback(() => {
        sheetRefCategory.current?.close();
    }, []);


    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const sheetRefBadge = useRef<BottomSheet>(null);
    const handleSnapPressBadge = useCallback((index: number) => {
        Keyboard.dismiss()
        sheetRefBadge.current?.snapToIndex(index);
    }, []);
    const handleClosePressBadge = useCallback(() => {
        sheetRefBadge.current?.close();
    }, []);


    const {isLoading: loadingBadges, data} = useQuery(['allAvailableBadges'], allAvailableBadges)


    const {mutate: addCommunity, isLoading: creating} = useMutation(['createCommunity'], createCommunity,

        {

            onSuccess: async (data) => {
                if (data.success) {


                    dispatch(setResponse({
                        responseMessage: data.message,
                        responseState: true,
                        responseType: 'success',
                    }))


                } else {

                    dispatch(setResponse({
                        responseMessage: data.message,
                        responseState: true,
                        responseType: 'error',
                    }))

                    /*  navigation.navigate('EmailConfirm', {
                          email:contentEmail
                      })*/


                }
            },

            onError: (err) => {
                dispatch(setResponse({
                    responseMessage: err.message,
                    responseState: true,
                    responseType: 'error',
                }))


            },
            onSettled: () => {
                queryClient.invalidateQueries(['createCommunity']);
            }

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
            communityName: '',
            category: '',
            memberLimit: '',
            gateWayUsername: '',
            badgeId: '',
            amountOfBadge: '',
            NFTAccess: '',
            about: ''


        },
        onSubmit: (values) => {
            const {communityName,badgeId, gateWayUsername, memberLimit, category, about} = values
            if (imageUrl !== '') {


                const body = JSON.stringify({
                    badgeid:badgeId,
                    "name": communityName,
                    "slug": gateWayUsername,
                    memberLimit,
                    "displayPhoto": imageUrl,
                    "description": about,
                    "visibility": category.toUpperCase(),

                })

                addCommunity(body)

            } else {
                dispatch(setResponse({
                    responseMessage: "Please provide and image",
                    responseState: true,
                    responseType: 'error',
                }))
            }
        }
    });


    const {mutate, isLoading} = useMutation(['uploadToCloudinary'], uploadToCloudinary,
        {
            onSuccess: async data => {

                // alert(message)
                setImage("")
                setImageUrl(data.url)


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
                queryClient.invalidateQueries(['uploadToCloudinary']);
            }

        })


    const pickImage = async () => {
        // requestPermission()
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // base64:true,
            aspect: [4, 3],
            quality: 0,
        });


        if (!result.cancelled) {
            const fileInfo = await getFileInfo(result?.uri)
            const isLessThan = isLessThanTheMB(fileInfo?.size, 8)
            if (!isLessThan) {
                dispatch(setResponse({
                    responseMessage: 'Image file too large, must be less than 4MB 🤨',
                    responseState: true,
                    responseType: 'error',
                }))
            } else {

                setImage(result.uri);

                // handleChange('photo')(result?.base64);

            }
        }
    };


    useEffect(() => {
        if (!image) {
            return;
        } else if (image) {
            (async () => {

                const data = new FormData()

                //data.append('photo', {uri: image, name: 'photo', type: `image/${type}`} as any)
                /*  data.append('photo',{
                      name: fileName,
                      type: type,
                      uri: Platform.OS === 'ios' ? image.replace('file://', '') : image,
                  })*/
                let type = await image?.substring(image.lastIndexOf(".") + 1);
                let fileName = image.split('/').pop()

                data.append("upload_preset", upload_preset);
                data.append("api_key", api_key);
                data.append('file', {uri: image, name: fileName, type: `image/${type}`} as any)


                mutate({body: data, resource_type: 'image'})

            })()
        }
    }, [image]);


    // renders
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


    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);

    const selectCategory = (category: string,) => {
        setFieldValue('category', category)
        setCategory(category)
        handleClosePressCategory()

    }
    const selectBadge = (badge: string, badgeId: string) => {
        setFieldValue('badgeId', badgeId)
        setBadgeId(badge)
        handleClosePressBadge()

    }


    const renderItem = useCallback(({item}: any) => (
        <TouchableOpacity style={[styles.selectBox, {}]} onPress={() => selectCategory(item.title)}>
            <Text style={[styles.selectBoxText, {
                color: textColor
            }]}>{item.title}</Text>
        </TouchableOpacity>
    ), [])


    const renderItemBadgeAccess = useCallback(({item}: any) => (
        <TouchableOpacity style={[styles.selectBox, {}]} onPress={() => selectBadge(item.title, item.id)}>
            <Text style={[styles.selectBoxText, {
                color: textColor
            }]}>{item.title}</Text>
        </TouchableOpacity>
    ), [])


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


    return (
        <>


            <SafeAreaView style={[styles.safeArea, {
                backgroundColor
            }]}>
                <Toast message={responseMessage} state={responseState} type={responseType}/>

                <KeyboardAwareScrollView
                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>

                    <NavBar title={"Create Community"}/>
                    {
                        isLoading &&
                        <ActivityIndicator color={Colors.primaryColor} size={"small"}
                                           style={[StyleSheet.absoluteFillObject, {
                                               backgroundColor: 'rgba(0,0,0,0.2)',
                                               zIndex: 2,
                                           }]}/>
                    }

                    <View style={styles.imageCanvas}>
                        <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.profileDetailsImage}>

                            {
                                imageUrl &&

                                <Image
                                    style={styles.profileImageSource}
                                    source={{
                                        uri: imageUrl,
                                        // cache: 'only-if-cached'
                                    }}

                                />
                            }
                            <TouchableOpacity onPress={pickImage} activeOpacity={0.9} style={styles.FABCameraBtn}>
                                <Ionicons name="camera-outline" size={22} color="#333"/>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>


                    <View style={styles.authContainer}>
                        <TextInput

                            keyboardType={"default"}
                            touched={touched.communityName}
                            error={touched.communityName && errors.communityName}
                            onFocus={() => setFCommunityName(true)}
                            onChangeText={(e) => {
                                handleChange('communityName')(e);
                                setCommunityName(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('communityName')(e);
                                setFCommunityName(false);
                            }}
                            defaultValue={communityName}
                            focus={fCommunityName}
                            value={values.communityName}
                            label="Community Name"/>


                        <SelectInput

                            //placeholder={"Business Size"}
                            editable={false}
                            action={() => handleSnapPressCategory(1)}
                            label='Category'
                            error={errors.category}
                            autoCapitalize='none'
                            keyboardType='default'
                            returnKeyType='next'
                            returnKeyLabel='next'

                            onChangeText={(e) => {
                                handleChange('category')(e);
                                setCategory(category)
                            }}
                            defaultValue={category}
                            icon='chevron-down'

                            value={values.category}
                            Btn={true}/>


                        <TextInput

                            keyboardType={"number-pad"}
                            touched={touched.memberLimit}
                            error={touched.memberLimit && errors.memberLimit}
                            onFocus={() => setFCommunityName(true)}
                            onChangeText={(e) => {
                                handleChange('memberLimit')(e);
                                setMemberLimit(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('memberLimit')(e);
                                setFMemberLimit(false);
                            }}
                            defaultValue={memberLimit}
                            focus={fMemberLimit}
                            value={values.memberLimit}
                            label="Set Member Limit"/>


                        <TextInput

                            keyboardType={"default"}
                            touched={touched.gateWayUsername}
                            error={touched.gateWayUsername && errors.gateWayUsername}
                            onFocus={() => setFGateWayUsername(true)}
                            onChangeText={(e) => {
                                handleChange('gateWayUsername')(e);
                                setGateWayUsername(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('gateWayUsername')(e);
                                setFGateWayUsername(false);
                            }}
                            defaultValue={gateWayUsername}
                            focus={fGateWayUsername}
                            value={values.gateWayUsername}
                            label="GateWay username"/>


                        <SelectInput

                            //placeholder={"Business Size"}
                            editable={false}
                            action={() => handleSnapPressBadge(1)}
                            label='Set Badge required for access'
                            error={errors.badgeId}
                            autoCapitalize='none'
                            keyboardType='default'
                            returnKeyType='next'
                            returnKeyLabel='next'

                            onChangeText={(e) => {
                                handleChange('badgeId')(e);

                            }}
                            defaultValue={badgeId}
                            icon='chevron-down'

                            value={values.badgeId}
                            Btn={true}/>


                        {/*  <TextInput

                            keyboardType={"number-pad"}
                            touched={touched.amountOfBadge}
                            error={touched.amountOfBadge && errors.amountOfBadge}
                            onFocus={() => setFAmountOfBadge(true)}
                            onChangeText={(e) => {
                                handleChange('amountOfBadge')(e);
                                setAmountOfBadge(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('amountOfBadge')(e);
                                setFAmountOfBadge(false);
                            }}
                            defaultValue={amountOfBadge}
                            focus={fAmountOfBadge}
                            value={values.amountOfBadge}
                            label="Amount of Badge required"/>
*/}

                        {/*  <SelectInput
                            //placeholder={"Business Size"}
                            editable={false}
                            action={() => handleSnapPressBadge(1)}
                            label='Set NFT required for access'
                            error={errors.NFTAccess}
                            autoCapitalize='none'
                            keyboardType='default'
                            returnKeyType='next'
                            returnKeyLabel='next'

                            onChangeText={(e) => {
                                handleChange('NFTAccess')(e);

                            }}

                            icon='chevron-down'

                            value={values.NFTAccess}
                            Btn={true}/>
*/}

                        <TextAreaInput

                            keyboardType={"default"}
                            touched={touched.about}
                            error={errors.about}
                            onChangeText={(e) => {
                                handleChange('about')(e);

                            }}
                            onBlur={(e) => {
                                handleBlur('about')(e);
                            }}

                            value={values.about}
                            label="About community "/>

                    </View>

                    <View style={styles.noteWrap}>
                        <Text style={[styles.note, {
                            color: theme == 'light' ? Colors.light.text : '#838383'
                        }]}>
                            <Ionicons name="information-circle-outline" size={14}
                                      color={theme == 'light' ? Colors.light.text : '#838383'}/> Other community
                            settings can be done after creation.
                        </Text>
                    </View>
                    <HorizontalLine width={'90%'} color={theme == 'light' ? Colors.borderColor : '#313131'}/>
                    <RectButton disabled={!isValid || creating} style={styles.button} onPress={() => handleSubmit()}>

                        {
                            creating ? <ActivityIndicator size='small' color={"#fff"}/>
                                :

                                <Text style={styles.btnText}>
                                    Continue

                                </Text>

                        }
                    </RectButton>
                </KeyboardAwareScrollView>


            </SafeAreaView>


            <BottomSheet

                index={0}
                ref={sheetRefCategory}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}

                style={{
                    paddingHorizontal: pixelSizeHorizontal(20)
                }}
                backgroundStyle={{
                    backgroundColor,
                }}
                handleIndicatorStyle={[{
                    backgroundColor: theme == 'light' ? "#121212" : '#cccccc'
                }, Platform.OS == 'android' && {display: 'none'}]}
            >
                <View style={styles.sheetHead}>
                    {
                        Platform.OS == 'android' && <View style={{
                            width: '10%'
                        }}/>
                    }
                    <Text style={[styles.sheetTitle, {
                        color: textColor
                    }]}>
                        Categories
                    </Text>
                    {
                        Platform.OS == 'android' &&

                        <TouchableOpacity activeOpacity={0.8} onPress={() => handleClosePressCategory()}
                                          style={styles.dismiss}>
                            <Ionicons name="ios-close" size={24} color="black"/>
                        </TouchableOpacity>
                    }

                </View>
                <BottomSheetFlatList data={Category}
                                     renderItem={renderItem}
                                     keyExtractor={keyExtractor}
                                     showsVerticalScrollIndicator={false}/>

            </BottomSheet>

            <BottomSheet

                index={0}
                ref={sheetRefBadge}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}

                style={{
                    paddingHorizontal: pixelSizeHorizontal(20)
                }}
                backgroundStyle={{
                    backgroundColor,
                }}
                handleIndicatorStyle={[{
                    backgroundColor: theme == 'light' ? "#121212" : '#cccccc'
                }, Platform.OS == 'android' && {display: 'none'}]}
            >
                <View style={styles.sheetHead}>
                    {
                        Platform.OS == 'android' && <View style={{
                            width: '10%'
                        }}/>
                    }
                    <Text style={[styles.sheetTitle, {
                        color: textColor
                    }]}>
                        Categories
                    </Text>
                    {
                        Platform.OS == 'android' &&

                        <TouchableOpacity activeOpacity={0.8} onPress={() => handleClosePressBadge()}
                                          style={styles.dismiss}>
                            <Ionicons name="ios-close" size={24} color="black"/>
                        </TouchableOpacity>
                    }

                </View>
                <BottomSheetFlatList data={data?.data?.result}
                                     renderItem={renderItemBadgeAccess}
                                     keyExtractor={keyExtractor}
                                     showsVerticalScrollIndicator={false}/>

            </BottomSheet>
        </>
    );
};


const Category = [
    {
        id: '1',
        title: "Public"
    }, {
        id: '2',
        title: "Private"
    },
]


const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',

    },
    scrollView: {

        //  backgroundColor: Colors.background,
        width: '100%',
        alignItems: 'center'
    },
    imageCanvas: {
        height: heightPixel(140),
        width: '90%',
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    authContainer: {

        paddingHorizontal: pixelSizeHorizontal(20),
        justifyContent: 'flex-start',
        width: '100%',
        alignItems: 'center',
        marginTop: 35,
        marginBottom: 35,
    },
    selectBox: {
        //marginHorizontal: pixelSizeHorizontal(20),
        width: '100%',
        height: heightPixel(60),
        borderBottomWidth: 0.2,
        borderBottomColor: Colors.borderColor,
        justifyContent: 'center'
    },
    selectBoxText: {
        fontSize: fontPixel(18),
        fontFamily: Fonts.quicksandMedium,
        color: Colors.light.text
    },

    sheetHead: {
        paddingHorizontal: pixelSizeHorizontal(20),
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    sheetTitle: {
        //width: '70%',
        textAlign: 'center',
        fontSize: fontPixel(18),
        fontFamily: Fonts.quickSandBold,
        color: "#000000"
    },
    dismiss: {
        backgroundColor: "#fff",
        borderRadius: 30,
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.10,
        shadowRadius: 7.22,

        elevation: 3,
    },

    profileDetails: {
        height: heightPixel(200),
        width: '100%',

        alignItems: 'center',
        justifyContent: 'center'
    },
    Details: {

        height: heightPixel(50),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    profileDetailsImage: {
        height: 100,
        width: 100,
        borderRadius: 100,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgLoading: {
        position: 'absolute',
        zIndex: 1,


    },
    profileImageSource: {
        height: 100,
        width: 100,
        resizeMode: 'cover',
        borderRadius: 100,
    },
    FABCameraBtn: {
        position: 'absolute',

        borderRadius: 50,
        width: 40,
        height: 40,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center'
    },

    btnText: {
        //  position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    button: {
        width: 180,
        marginTop: 30,
        marginBottom: 50,
    },
    noteWrap: {
        height: heightPixel(50),
        width: '90%',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    note: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandRegular
    }
})

export default CreateCommunity;
