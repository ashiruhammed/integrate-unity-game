import React, {useEffect, useState} from 'react';

import {Text, View, StyleSheet, Platform, Switch, ActivityIndicator, TouchableOpacity} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import NavBar from "../../components/layout/NavBar";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons} from "@expo/vector-icons";
import HorizontalLine from "../../components/HorizontalLine";
import Colors from "../../constants/Colors";
import * as yup from "yup";
import {useFormik} from "formik";
import TextInput from "../../components/inputs/TextInput";
import {RectButton} from "../../components/RectButton";
import {useSelector} from "react-redux";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {addNotificationItem, toggleTheme} from "../../app/slices/dataSlice";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {changePassword, getUserSettings} from "../../action/action";

import {RootStackScreenProps} from "../../../types";
import SwipeAnimatedToast from "../../components/toasty";


const formSchema = yup.object().shape({


    currentPassword: yup.string().required('Password is required'),
    newPassword: yup.string().required('Password is required').matches(
        /^\S*$/,
        "Must not container spaces"
    ),
    confirmPass: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match').required("Password is Required"),

    /*  confirmPassword: yup.string().required('Password is required').matches(
           /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#.-:;()_?\$%\^&\*])(?=.{8,})/,
           "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
       ),
 */

});


const Settings = ({navigation}: RootStackScreenProps<'Settings'>) => {

    const dispatch = useAppDispatch()
    const queryClient = useQueryClient();
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice

    const user = useAppSelector(state => state.user)
    const {
        responseMessage,
        responseType,
        responseState,
        userData: {
            email
        }
    } = user

    const {data} = useQuery(['getUserSettings'], getUserSettings)

    const [soundEffect, setSoundEffect] = useState(data?.data?.soundEffect);
    const [rewardNotifications, setRewardNotification] = useState(data?.data?.rewardNotification);
    const [adventureNotifications, setAdventureNotification] = useState(data?.data?.adventureNotification);
    const [systemPrompt, setSystemPrompt] = useState(data?.data?.systemPrompts);

    const switchTheme = () => {
        dispatch(toggleTheme())
    }
    //hide and show password
    const [togglePass, setTogglePass] = useState(true)
    const [toggleNewPass, setToggleNewPass] = useState(true)
    const [toggleCPass, setToggleCPass] = useState(true)


    const [focusPassword, setFocusPassword] = useState<boolean>(false);
    const [contentPassword, setContentPassword] = useState<string>('');

    const [focusNewPassword, setFocusNewPassword] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>('');

    const [focusConfirmPassword, setFocusConfirmPassword] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>('');


    const SWITCH_TRACK_COLOR = {
        true: theme == 'light' ? "#f9f9f9" : Colors.dark.background,
        false: theme == 'light' ? "#ccc" : "#1B2531",

    };

    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    /*  const color = Animated.interpolateColors(1, {
          inputRange: [0, 1],
          outputColorRange: ['red', 'blue'],
      });*/

    const deleteAccount = () => {
        navigation.navigate('DeleteAccount')
    }

    const {mutate, isLoading} = useMutation(['changePassword'], changePassword, {
        onSuccess: (data) => {
            if (data.success) {

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
            }

        },
        onSettled: () => {
            queryClient.invalidateQueries(['changePassword']);
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
            currentPassword: '',
            newPassword: '',
            confirmPass: ''

        },
        onSubmit: (values) => {
            const {currentPassword, confirmPass, newPassword} = values
            // wait(2000).then(() => setFakeLoading(false));
            // navigation.navigate('Dashboard')

            const data = JSON.stringify(
                {email, oldPassword: currentPassword, newPassword}
            )
            mutate(data)
        }
    });

    const blockList = () => {
        navigation.navigate('BlockedUsers')
    }



    return (
        <>

            <SwipeAnimatedToast/>
            <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
                <KeyboardAwareScrollView
                    style={{width: '100%',}} contentContainerStyle={[styles.scrollView, {
                    backgroundColor
                }]} scrollEnabled
                    showsVerticalScrollIndicator={false}>
                    <NavBar title={"Settings"}/>

                    <View style={[styles.utilityWrap, {
                        marginTop: 10,
                    }]}>
                        <Text style={[styles.utilityTitle, {
                            color: textColor
                        }]}>
                            General
                        </Text>
                        <View style={styles.utilityRow}>
                            <View style={styles.utilityRowBody}>
                                <SimpleLineIcons name="globe" size={20} color={textColor}/>

                                <Text style={[styles.utilityRowTitle, {
                                    color: textColor
                                }]}>
                                    Language
                                </Text>
                            </View>

                            <Text style={[styles.utilityRowTitle, {
                                marginRight: 8,
                                color: textColor
                            }]}>
                                {data?.data?.language?.toUpperCase()}
                            </Text>

                        </View>

                        <View style={styles.utilityRow}>
                            <View style={styles.utilityRowBody}>

                                <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={textColor}/>
                                <Text style={[styles.utilityRowTitle, {
                                    color: textColor,
                                    textTransform: 'capitalize'
                                }]}>
                                    {theme} Mode
                                </Text>
                            </View>

                            <Switch
                                style={{
                                    marginRight: 15,
                                    borderColor: theme == 'light' ? "#DEE5ED" : Colors.lightBlue,
                                    borderWidth: 1,
                                    backgroundColor: theme == 'light' ? "#f9f9f9" : Colors.dark.background
                                }}

                                trackColor={SWITCH_TRACK_COLOR}
                                thumbColor={theme == 'dark' ? Colors.lightBlue : "#DEE5ED"}
                                ios_backgroundColor={"#fff"}
                                onValueChange={(toggled) => {
                                    switchTheme();
                                }}
                                value={theme == 'dark'}
                            />

                        </View>

                        <View style={styles.utilityRow}>
                            <View style={styles.utilityRowBody}>
                                <AntDesign name="sound" size={20} color={textColor}/>

                                <Text style={[styles.utilityRowTitle, {
                                    color: textColor
                                }]}>
                                    Sound Effects
                                </Text>
                            </View>

                            <Switch
                                style={{
                                    marginRight: 15,
                                    borderColor: !soundEffect ? "#DEE5ED" : Colors.lightBlue,
                                    borderWidth: 1,
                                    backgroundColor: theme == 'light' ? "#fff" : Colors.dark.background
                                }}
                                trackColor={SWITCH_TRACK_COLOR}
                                thumbColor={soundEffect ? Colors.lightBlue : "#DEE5ED"}
                                ios_backgroundColor={"#fff"}
                                onValueChange={(toggled) => {
                                    setSoundEffect(toggled);
                                }}
                                value={soundEffect}
                            />
                        </View>
                    </View>

                    <HorizontalLine width={"90%"} margin color={theme == 'light' ? Colors.borderColor : '#313131'}/>


                    <View style={styles.utilityWrap}>
                        <Text style={[styles.utilityTitle, {
                            color: textColor
                        }]}>
                            Notification Settings
                        </Text>
                        <View style={styles.utilityRow}>
                            <View style={styles.utilityRowBody}>

                                <Ionicons name="compass-outline" size={20} color={textColor}/>
                                <Text style={[styles.utilityRowTitle, {
                                    color: textColor
                                }]}>
                                    Adventure Notifications
                                </Text>
                            </View>

                            <Switch
                                style={{
                                    marginRight: 15,
                                    borderColor: !adventureNotifications ? "#DEE5ED" : Colors.lightBlue,
                                    borderWidth: 1,
                                    backgroundColor: theme == 'light' ? "#fff" : Colors.dark.background
                                }}
                                trackColor={SWITCH_TRACK_COLOR}
                                thumbColor={adventureNotifications ? Colors.lightBlue : "#DEE5ED"}
                                ios_backgroundColor={theme == 'light' ? "#fff" : "#1B2531"}
                                onValueChange={(toggled) => {
                                    setAdventureNotification(toggled);
                                }}
                                value={adventureNotifications}
                            />


                        </View>

                        <View style={styles.utilityRow}>
                            <View style={styles.utilityRowBody}>
                                <Ionicons name="trophy-outline" size={20} color={textColor}/>

                                <Text style={[styles.utilityRowTitle, {
                                    color: textColor
                                }]}>
                                    Reward Notifications
                                </Text>
                            </View>

                            <Switch
                                style={{
                                    marginRight: 15,
                                    borderColor: !rewardNotifications ? "#DEE5ED" : Colors.lightBlue,
                                    borderWidth: 1,
                                    backgroundColor: theme == 'light' ? "#fff" : Colors.dark.background
                                }}
                                trackColor={SWITCH_TRACK_COLOR}
                                thumbColor={rewardNotifications ? Colors.lightBlue : "#DEE5ED"}
                                ios_backgroundColor={"#fff"}
                                onValueChange={(toggled) => {
                                    setRewardNotification(toggled);
                                }}
                                value={rewardNotifications}
                            />

                        </View>

                        <View style={styles.utilityRow}>
                            <View style={styles.utilityRowBody}>
                                <AntDesign name="sound" size={20} color={textColor}/>

                                <Text style={[styles.utilityRowTitle, {
                                    color: textColor
                                }]}>
                                    System Prompts
                                </Text>
                            </View>

                            <Switch
                                style={{
                                    marginRight: 15,
                                    borderColor: !systemPrompt ? "#DEE5ED" : Colors.lightBlue,
                                    borderWidth: 1,
                                    backgroundColor: theme == 'light' ? "#fff" : Colors.dark.background
                                }}
                                trackColor={SWITCH_TRACK_COLOR}
                                thumbColor={systemPrompt ? Colors.lightBlue : "#DEE5ED"}
                                ios_backgroundColor={"#fff"}
                                onValueChange={(toggled) => {
                                    setSystemPrompt(toggled);
                                }}
                                value={systemPrompt}
                            />
                        </View>
                    </View>


                    <HorizontalLine width={"90%"} margin color={theme == 'light' ? Colors.borderColor : '#313131'}/>


                    <View style={[styles.utilityWrap, {
                        justifyContent: 'flex-start',
                        height: heightPixel(70),
                    }]}>
                        <Text style={[styles.utilityTitle, {
                            color: textColor
                        }]}>
                            Privacy
                        </Text>
                        <TouchableOpacity onPress={blockList} activeOpacity={0.8} style={styles.utilityRow}>
                            <View style={styles.utilityRowBody}>
                                <MaterialIcons name="block" size={20} color={textColor}/>
                                <Text style={[styles.utilityRowTitle, {
                                    color: textColor
                                }]}>
                                    Blocked users
                                </Text>
                            </View>

                            <Ionicons name="chevron-forward" size={20} color={lightTextColor}/>


                        </TouchableOpacity>


                    </View>

                    <HorizontalLine width={"90%"} margin color={theme == 'light' ? Colors.borderColor : '#313131'}/>
                    <View style={styles.authContainer}>
                        <Text style={[styles.utilityTitle, {
                            marginBottom: 20,
                            color: textColor
                        }]}>
                            Security Settings
                        </Text>

                        <TextInput
                            password
                            action={() => setTogglePass(!togglePass)}
                            passState={togglePass}
                            secureTextEntry={togglePass}
                            placeholder="Enter Password"
                            keyboardType="default"
                            touched={touched.currentPassword}
                            error={errors.currentPassword}
                            onFocus={() => setFocusPassword(true)}
                            onChangeText={(e) => {
                                handleChange('currentPassword')(e);
                                setContentPassword(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('currentPassword')(e);
                                setFocusPassword(false);
                            }}
                            defaultValue={contentPassword}
                            focus={focusPassword}
                            value={values.currentPassword}
                            label="Current Password"/>

                        <TextInput
                            password
                            action={() => setToggleNewPass(!toggleNewPass)}
                            passState={toggleNewPass}
                            secureTextEntry={toggleNewPass}
                            placeholder="Enter Password"
                            keyboardType="default"
                            touched={touched.newPassword}
                            error={errors.newPassword}
                            onFocus={() => setFocusNewPassword(true)}
                            onChangeText={(e) => {
                                handleChange('newPassword')(e);
                                setNewPassword(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('newPassword')(e);
                                setFocusNewPassword(false);
                            }}
                            defaultValue={newPassword}
                            focus={focusNewPassword}
                            value={values.newPassword}
                            label="New password"/>


                        <TextInput
                            password
                            action={() => setToggleCPass(!toggleCPass)}
                            passState={toggleCPass}
                            secureTextEntry={toggleCPass}
                            placeholder="Enter Password"
                            keyboardType="default"
                            touched={touched.confirmPass}
                            error={touched.confirmPass && errors.confirmPass}
                            onFocus={() => setFocusNewPassword(true)}
                            onChangeText={(e) => {
                                handleChange('confirmPass')(e);
                                setConfirmPassword(e);
                            }}
                            onBlur={(e) => {
                                handleBlur('confirmPass')(e);
                                setFocusConfirmPassword(false);
                            }}
                            defaultValue={confirmPassword}
                            focus={focusConfirmPassword}
                            value={values.confirmPass}
                            label="Confirm password"/>

                        <View style={styles.warningWrap}>
                            <Ionicons name="information-circle-outline" size={14} color="black"/>
                            <Text style={[styles.warning, {
                                color: textColor
                            }]}>
                                Both passwords have to match
                            </Text>
                        </View>


                    </View>
                    <RectButton style={styles.button} onPress={() => handleSubmit()}>
                        {
                            isLoading ? <ActivityIndicator size='small' color="#fff"/>
                                :
                                <Text style={styles.btnText}>
                                    Save Changes

                                </Text>
                        }
                    </RectButton>


                    <HorizontalLine width={"90%"} margin color={theme == 'light' ? Colors.borderColor : '#313131'}/>
                    <View style={styles.authContainer}>
                        <Text style={[styles.utilityTitle, {
                            marginBottom: 20,
                            color: textColor
                        }]}>
                            Dangerous area
                        </Text>

                        <TouchableOpacity onPress={deleteAccount} style={styles.deleteButton}>
                            <Ionicons name="trash-sharp" size={20} color="white"/>
                            <Text style={[styles.utilityTitle, {
                                color: "#fff",
                                marginLeft: 5,
                            }]}>Delete account</Text>
                        </TouchableOpacity>

                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,

        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {
        //  backgroundColor: Colors.background,
        backgroundColor: "#fff",
        width: '100%',
        alignItems: 'center'
    },
    utilityWrap: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        height: heightPixel(200),
        width: '85%'
    },
    utilityTitle: {
        fontFamily: Fonts.quickSandBold,

        fontSize: fontPixel(16)
    },
    utilityRow: {
        height: heightPixel(50),
        width: '100%',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    utilityRowBody: {

        width: '85%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    utilityRowTitle: {
        marginLeft: 10,
        fontFamily: Fonts.quicksandMedium,

        fontSize: fontPixel(14)
    },
    authContainer: {

        paddingHorizontal: pixelSizeHorizontal(20),
        justifyContent: 'flex-start',
        width: '100%',
        alignItems: 'flex-start',

    },
    btnText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    button: {
        width: widthPixel(200),
        marginTop: 30,
        marginBottom: 50,
    },
    warningWrap: {
        width: '100%',
        flexDirection: 'row'
    },
    warning: {
        marginLeft: 5,
        fontFamily: Fonts.quicksandRegular,

        fontSize: fontPixel(12)
    },
    deleteButton: {
        paddingHorizontal: pixelSizeHorizontal(15),
        height: 50,
        backgroundColor: Colors.errorRed,
        borderRadius: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 40,
    }
})

export default Settings;
