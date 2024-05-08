import React, {useEffect, useRef, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Image,
    ImageBackground,
    ActivityIndicator, Pressable
} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {SafeAreaView} from "react-native-safe-area-context";
import {RootStackScreenProps} from "../../../types";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import {AntDesign, Ionicons, Octicons} from "@expo/vector-icons";
import {Fonts} from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import NavBar from "../../components/layout/NavBar";
import HorizontalLine from "../../components/HorizontalLine";
import Svg, {Circle} from "react-native-svg";
import AvatarShape from "../../components/AvatarShape";
import {useFormik} from "formik";
import * as yup from "yup";
import PhoneInput from "react-native-phone-number-input";
import Animated, {FadeInDown, FadeOutDown} from "react-native-reanimated";
import TextInput from "../../components/inputs/TextInput";
import {RectButton} from "../../components/RectButton";
import PhoneInputText from "../../components/inputs/PhoneInputText";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getUser,
    loginUser,
    updateCompleteProfile,
    updateUser,
    updateUserImage,
    uploadToCloudinary
} from "../../action/action";
import * as SecureStore from "expo-secure-store";
import {setAuthenticated, setResponse, unSetResponse, updateUserInfo} from "../../app/slices/userSlice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import Toast from "../../components/Toast";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {isLessThanTheMB} from "../../helpers";
import FastImage from "react-native-fast-image";
import Constants from "expo-constants";
import {api_key, upload_preset} from "../../constants";
import SwipeAnimatedToast from "../../components/toasty";
import {addNotificationItem} from "../../app/slices/dataSlice";


const formSchema = yup.object().shape({
    fullName: yup.string().min(2, 'Name is Too short').required('Name is required').trim('No white spaces'),
    userName: yup.string().min(2, 'User name is Too short').required('User Name is required').trim('No white spaces'),
  //  phoneNumber: yup.string().min(10, 'Please enter a valid phone number').required('Phone number is required'),
   // email: yup.string().email("Please enter a valid email address").required('Email is required'),

});


const getFileInfo = async (fileURI: string) => {
    const fileInfo = await FileSystem.getInfoAsync(fileURI, {
        size: true,

    })

    return fileInfo


}


const isRunningInExpoGo = Constants.appOwnership === 'expo'

const EditProfile = ({navigation}: RootStackScreenProps<'EditProfile'>) => {


    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const user = useAppSelector(state => state.user)
    const {responseMessage, responseType, responseState, userData} = user


    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [countryCode, setCountryCode] = useState('NG');
    const [phoneNumber, setPhoneNumber] = useState(userData?.phone);
    const phoneInput = useRef<PhoneInput>(null);
    const [value, setValue] = useState("");
    const [formattedValue, setFormattedValue] = useState("");

    const dataSlice = useAppSelector(state => state.data)
    const {theme,productDetails} = dataSlice
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'

    const {isLoading: loadingUser, refetch, data} = useQuery(['user-data'], getUser, {
        onSuccess: (data) => {
            if (data.success) {

                dispatch(updateUserInfo(data.data))

            }
        },
    })



    const [focusFullName, setFocusFullName] = useState(false);
    const [contentFullName, setContentFullName] = useState(!data?.data?.fullName ? '' : data?.data?.fullName);
    const [focusUserName, setFocusUserName] = useState(false);
    const [contentUserName, setContentUserName] = useState(!data?.data?.username ? '' : data?.data?.username);

    const [focusEmail, setFocusEmail] = useState(false);
    const [contentEmail, setContentEmail] = useState(data?.data?.email);



    const {mutate, isLoading} = useMutation(['update-user-profile'], updateUser,

        {

            onSuccess: async (data) => {

                if (data.success) {

                    refetch()

                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'success',
                        body: data.message,
                    }))

                } else {


                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'error',
                        body: data.message,
                    }))
                    /*  navigation.navigate('EmailConfirm', {
                          email:contentEmail
                      })*/


                }
            },

            onError: (err) => {

                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body:  err.message,
                }))
            },
            onSettled: () => {
                queryClient.invalidateQueries(['update-user-profile']);
            }

        })


    const {mutate: updateImage, isLoading: updating} = useMutation(['updateUserImage'], updateUserImage,
        {
            onSuccess: async data => {

                if (data.success) {
                    // alert(message)
                    refetch()

                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'success',
                        body:  data.message,
                    }))
                } else {


                    dispatch(addNotificationItem({
                        id: Math.random(),
                        type: 'error',
                        body:  data.message,
                    }))
                }

            },

            onError: (err) => {


                dispatch(addNotificationItem({
                    id: Math.random(),
                    type: 'error',
                    body:  'Something happened, please try again 😞',
                }))
            },
            onSettled: () => {
                queryClient.invalidateQueries(['updateUserImage']);
            }

        })


    const {mutate: createImage, isLoading: creatingImage} = useMutation(['uploadToCloudinary'], uploadToCloudinary,
        {
            onSuccess: async data => {

                // alert(message)
                setImage("")
                updateImage(data.secure_url)


            },

            onError: (err) => {
                //console.log(err)

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

                // data.append("file", image, "[PROXY]");
                data.append("upload_preset", upload_preset);
                data.append("api_key", api_key);
                data.append('file', {uri: image, name: fileName, type: `image/${type}`} as any)


                createImage({body: data, resource_type: 'image'})

            })()
        }
    }, [image]);


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

            fullName: contentFullName,
            //phoneNumber: userData?.phone,
            email: data?.data?.email,
            userName: contentUserName,

        },
        onSubmit: (values) => {
            const { userName, fullName} = values;

            const body = JSON.stringify({
                username: userName,
                fullName,
                interests: []

            })
            mutate(body)
        }
    });



    return (

        <>


            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
                <SwipeAnimatedToast/>
                {
                    creatingImage &&
                    <ActivityIndicator color={Colors.primaryColor} size={"small"}
                                       style={[StyleSheet.absoluteFillObject, {
                                           backgroundColor: 'rgba(0,0,0,0.2)',
                                           zIndex: 2,
                                       }]}/>
                }


                <KeyboardAwareScrollView
                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>
                    <NavBar title={"Edit Profile"}/>


                    <View style={styles.imageCanvas}>

                        <Pressable onPress={pickImage} style={styles.userImage}>


                                    <FastImage
                                        style={styles.Image}
                                        source={{
                                            uri: !user.userData?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : user.userData?.avatar,

                                            cache: FastImage.cacheControl.web,
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />

                            <View style={styles.profileImage}>

                                {
                                    updating &&
                                    <ActivityIndicator color={Colors.primaryColor} size={"small"}
                                                       style={[StyleSheet.absoluteFillObject, {
                                                           zIndex: 2,
                                                       }]}/>
                                }
                                {
                                    !updating &&
                                    <TouchableOpacity onPress={pickImage} style={styles.cameraBtn}>
                                        <Ionicons name="camera-outline" size={22} color="#000"/>
                                    </TouchableOpacity>
                                }
                            </View>

                        </Pressable>

                        {/* <Text style={styles.joinedOn}>
                            Joined 23 Oct 2022
                        </Text>*/}


                    </View>

                    <View style={styles.selectAvatar}>
                        <Text style={[styles.joinedOn, {
                            color:textColor
                        }]}>
                            Change profile avatar
                        </Text>

                        <View style={styles.shapes}>

                            {/*
                        <ImageBackground resizeMethod="scale" resizeMode="stretch" source={require('../../assets/images/Polygon.png')}
                                         style={styles.Avatar}>

                        </ImageBackground>*/}

                            {/*
                            <TouchableOpacity style={styles.octagon}>

                                <View style={[styles.octagonUp, styles.octagonBar]} />
                                <View style={[styles.octagonFlat, styles.octagonBar]} />
                                <View style={[styles.octagonLeft, styles.octagonBar]} />
                                <View style={[styles.octagonRight, styles.octagonBar]} />

<AvatarShape/>

                            </TouchableOpacity>*/}


                        </View>
                    </View>

                    <HorizontalLine width={'90%'} color={theme == 'light' ? Colors.borderColor : '#313131'}/>

                    <View style={styles.authContainer}>

                        <TextInput

                            placeholder="Enter First Name"
                            keyboardType={"default"}
                            touched={touched.fullName}
                            error={touched.fullName && errors.fullName}
                            onFocus={() => setFocusFullName(true)}
                            onChangeText={(e) => {
                                handleChange('fullName')(e);
                                setContentFullName(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('fullName')(e);
                                setFocusFullName(false);
                            }}
                            defaultValue={contentFullName}
                            focus={focusFullName}
                            value={values.fullName}
                            label="Full Name"/>

                        <TextInput

                            placeholder="@ Claim your unique username"
                            keyboardType={"default"}
                            touched={touched.userName}
                            error={touched.userName && errors.userName}

                            onChangeText={(e) => {
                                handleChange('userName')(e);

                            }}
                            onBlur={(e) => {
                                handleBlur('userName')(e);

                            }}

                            defaultValue={contentUserName}
                            value={values.userName}
                            label="Username"/>

{/*
TODO!
Lock phone number if it exits

*/}
                        <PhoneInputText
                            editable={false}
                            style={{backgroundColor:"#ccc"}}

                            defaultValue={userData?.phone}
                            label="Phone number"
                            onChangeText={(text,code) => {
                                handleChange('phoneNumber')(text);
                                //setPhoneNumber(text)

                            }}


                            errorMessage=''
                            placeholder="Phone number"/>
                        <TextInput
editable={false}
inputBg={"#eee"}
                            placeholder="Email address"
                            keyboardType={"email-address"}
                            touched={touched.email}
                            error={touched.email && errors.email}
                            onFocus={() => setFocusEmail(true)}
                            onChangeText={(e) => {
                                handleChange('email')(e);
                                setContentEmail(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('email')(e);
                                setFocusEmail(false);
                            }}
                            defaultValue={contentEmail}
                            focus={focusEmail}
                            value={values.email}
                            label="Email"/>
                    </View>
                    <RectButton disabled={isLoading} style={styles.button} onPress={() => handleSubmit()}>

                        {
                            isLoading ? <ActivityIndicator size='small' color="#fff"/>
                                :

                                <Text style={styles.btnText}>
                                    Save changes

                                </Text>
                        }
                    </RectButton>

                </KeyboardAwareScrollView>


            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({


    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#fff",

        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {

        //  backgroundColor: Colors.background,
        backgroundColor: "#fff",
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
    userImage: {
        width: 115,
        height: 115,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 120,
        //  borderWidth:5,
        // borderStyle:'dashed',
        // backgroundColor:Colors.primaryColor,

    },
    Image: {
        width: "100%",
        height: "100%",
        resizeMode: 'cover',
        borderRadius: 120,
    },
    profileImage: {
        width: 95,
        height: 95,
        borderRadius: 120,
        //backgroundColor: Colors.primaryColor,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cameraBtn: {
        position: 'absolute',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        backgroundColor: "#fff",
        zIndex: 8

    },
    joinedOn: {
        color: "#D1D1D1",
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandSemiBold
    },
    selectAvatar: {
        marginTop: 20,
        width: '90%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        height: heightPixel(90),


    },
    shapes: {
        width: '100%',
        height: 50,

        flexDirection: 'row',
        alignItems: 'center',

        justifyContent: 'space-evenly'
    },
    avatarPick: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60
    },
    octagon: {
        /* transform: [
             {rotate: '70deg'}
         ],*/
        // backgroundColor: '#fff',
        shadowColor: "#212121",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.22,
        shadowRadius: 17.22,

        elevation: 3,
    },
    octagonBar: {
        width: 21,
        height: 50,

    },
    octagonUp: {
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    octagonFlat: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 2,
        transform: [
            {rotate: '90deg'}
        ],
        backgroundColor: '#fff',
    },
    octagonLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 2,
        transform: [
            {rotate: '-45deg'}
        ],
        backgroundColor: '#fff',
    },
    octagonRight: {
        borderRadius: 2,
        position: 'absolute',
        top: 0,
        left: 0,
        transform: [
            {rotate: '45deg'}
        ],
        backgroundColor: '#fff',
    },
    Avatar: {
        //    overflow: 'hidden',
        //backgroundColor: '#000',

        width: 65,
        height: 65,
        // borderRadius: 40,


    },
    authContainer: {

        paddingHorizontal: pixelSizeHorizontal(20),
        justifyContent: 'flex-start',
        width: '100%',
        alignItems: 'center',
        marginTop: 35,
    },

    inputWrap:
        {
//backgroundColor:'red',
        // marginTop: 25,
        height: heightPixel(115),
        width: '100%',
        // justifyContent: "space-evenly",
    },
    label: {
        marginBottom: 10,
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium,
    },
    errorMessage: {
        position: 'relative',
        marginTop: 10,
        lineHeight: heightPixel(15),
        fontSize: fontPixel(12),
        color: Colors.errorRed,
        textTransform: 'capitalize',
        fontFamily: Fonts.quicksandSemiBold,
    },
    phoneInput: {

        width: '100%',


        borderRadius: 6,
        borderWidth: 1,
        flexDirection: 'row',
        padding: 5,
        height: heightPixel(54),
        // borderColor: Colors.border
    },
    phoneInputTextStyle: {
        borderColor: "#CCCCCC",
        borderWidth: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        height: heightPixel(54),
        width: '100%'
    },
    flagButtonStyle: {
        borderRadius: 10,
        marginRight: 10,
        borderColor: "#CCCCCC",
        borderWidth: 1,
    },
    flagStyle: {
        height: heightPixel(20),
        width: widthPixel(30),
        // backgroundColor: "#fff",
        borderColor: Colors.border,
        borderWidth: 1,
    },
    btnText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    button: {
        width: 180,
        marginTop: 20,
        marginBottom: 50,
    }

})

export default EditProfile;
