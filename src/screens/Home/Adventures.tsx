import React, {SetStateAction, useCallback, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Platform,
    Modal,
    Alert,
    Pressable,
    TouchableOpacity,
    Image
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import TopBar from "../../components/layout/TopBar";
import SegmentedControl from "../../components/SegmentContol";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical} from "../../helpers/normalize";
import Colors from "../../constants/Colors";
import {IF} from "../../helpers/ConditionJsx";
import AllAdventure from "../adventure/components/AllAdventure";
import Completed from "../adventure/components/Completed";
import {RootTabScreenProps} from "../../../types";
import {Fonts} from "../../constants/Fonts";
import {RectButton} from "../../components/RectButton";
import {Ionicons} from "@expo/vector-icons";
import AdventuresIcon from "../../assets/images/tabs/home/AdventuresIcon";
import {useAppSelector} from "../../app/hooks";
import AllEnrolledAdventure from '../adventure/components/EnrolledAdventure';




const Adventures = ({navigation}: RootTabScreenProps<'Adventures'>) => {

const dataSlice = useAppSelector(state => state.data)
    const {adventure,theme} = dataSlice
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabsChange = useCallback((index: SetStateAction<number>) => {
        setTabIndex(index);
    }, [tabIndex]);
    const [modalVisible, setModalVisible] = useState(false);
    const [continueModalVisible, setContinueModalVisible] = useState(false);




    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text


    const close = () => {
        setModalVisible(false)
        setContinueModalVisible(false)
    }
    const viewAdventure = () => {
        setModalVisible(false)
        setContinueModalVisible(false)
        navigation.navigate('AdventureHome')
    }


    return (
        <SafeAreaView style={[styles.safeArea,{
            backgroundColor
        }]}>

            <Modal

                animationType="slide"
                transparent={true}
                visible={modalVisible}

                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.backDrop}>
                    <View style={[styles.modalContainer,{
                        backgroundColor
                    }]}>

                        <View style={styles.sheetHead}>

                            <TouchableOpacity activeOpacity={0.8} onPress={close}
                                              style={styles.dismiss}>
                                <Ionicons name="ios-close" size={24} color="#929292"/>
                            </TouchableOpacity>

                        </View>

                        <View style={[styles.modalBody,{
                            backgroundColor
                        }]}>
                            <View style={styles.dripImageWrap}>
                                <Image

                                    source={{uri:adventure?.badge?.imageUrl}}
                                    style={styles.dripImage}/>
                            </View>


                            <View style={styles.textWrap}>
                               {/* <Text style={styles.missionText}>
                                    Mission {adventure?._count?.modules}
                                </Text>*/}

                                <Text style={[styles.learnText,{
                                    textAlign:'center',
                                    color:textColor,
                                    lineHeight:heightPixel(22),
                                    textTransform:'capitalize'
                                }]}>
                                    {adventure?.name}
                                </Text>
                            </View>

                            <View style={styles.iconsWrap}>
                                <View style={styles.iconContain}>
                                    <View style={styles.iconAndText}>
                                        <AdventuresIcon/>
                                        <Text style={[styles.learnText, {
                                            marginLeft: 5,
                                            color:textColor,
                                            fontFamily: Fonts.quickSandBold
                                        }]}>{adventure?._count?.modules}</Text>
                                    </View>

                                    <Text style={[styles.missionText, {
                                        fontSize: fontPixel(14),
                                        color:textColor,
                                    }]}>
                                        Missions
                                    </Text>
                                </View>


                                <View style={styles.iconContain}>
                                    <View style={styles.iconAndText}>
                                        <View style={styles.clockWrap}>

                                            <Image source={require('../../assets/images/clock.png')}
                                                   style={styles.clock}/>
                                        </View>
                                        <Text style={[styles.learnText, {
                                            color:textColor,
                                            fontFamily: Fonts.quickSandBold
                                        }]}>5</Text>
                                    </View>

                                    <Text style={[styles.missionText, {
                                        fontSize: fontPixel(14),
                                        color:textColor,
                                    }]}>
                                        Minutes
                                    </Text>
                                </View>
                            </View>

                        </View>


                        <RectButton onPress={viewAdventure} style={{
                            width: 200,

                        }}>
                            <Text style={styles.buttonText}>
                                Start Mission

                            </Text>

                        </RectButton>

                    </View>
                </View>
            </Modal>



            <Modal

                animationType="slide"
                transparent={true}
                visible={continueModalVisible}

                onRequestClose={() => {
                 //   Alert.alert("Modal has been closed.");
                    setContinueModalVisible(!continueModalVisible);
                }}
            >
                <View style={styles.backDrop}>
                    <View style={[styles.modalContainer,{
                        backgroundColor
                    }]}>

                        <View style={styles.sheetHead}>

                            <TouchableOpacity activeOpacity={0.8} onPress={close}
                                              style={styles.dismiss}>
                                <Ionicons name="ios-close" size={24} color="#929292"/>
                            </TouchableOpacity>

                        </View>

                        <View style={[styles.modalBody,{
                            backgroundColor
                        }]}>
                            <View style={styles.dripImageWrap}>
                                <Image
                                    source={{uri: 'https://res.cloudinary.com/dijyr3tlg/image/upload/v1673304924/drip_znhu2i.png'}}
                                    style={styles.dripImage}/>
                            </View>


                            <View style={styles.textWrap}>

                                <Text style={[styles.learnText,{
                                    color: textColor
                                }]}>
                                    {adventure?.name}
                                </Text>
                            </View>

                            <View style={styles.iconsWrap}>
                                <View style={styles.iconContain}>
                                    <View style={styles.iconAndText}>
                                        <AdventuresIcon/>
                                        <Text style={[styles.learnText, {
                                            marginLeft: 5,
                                            color: textColor,
                                            fontFamily: Fonts.quickSandBold
                                        }]}>{adventure?._count?.modules}</Text>
                                    </View>

                                    <Text style={[styles.missionText, {
                                        fontSize: fontPixel(14),
                                        color: textColor
                                    }]}>
                                        Missions
                                    </Text>
                                </View>


                                <View style={styles.iconContain}>
                                    <View style={styles.iconAndText}>
                                        <View style={styles.clockWrap}>

                                            <Image source={require('../../assets/images/clock.png')}
                                                   style={styles.clock}/>
                                        </View>
                                        <Text style={[styles.learnText, {
                                            color: textColor,
                                            fontFamily: Fonts.quickSandBold
                                        }]}>5</Text>
                                    </View>

                                    <Text style={[styles.missionText, {
                                        fontSize: fontPixel(14),
                                        color: textColor
                                    }]}>
                                        Minutes
                                    </Text>
                                </View>
                            </View>

                        </View>


                        <RectButton onPress={viewAdventure} style={{
                            width: 200,

                        }}>
                            <Text style={styles.buttonText}>
                                continue Mission

                            </Text>

                        </RectButton>

                    </View>
                </View>
            </Modal>

            <TopBar title="Adventures" message="Your journey begins now"/>
            <View
                style={[styles.scrollView,{
                    backgroundColor
                }]}>


                <View style={styles.segmentWrap}>
                    <SegmentedControl tabs={["All Adventures", "In-progress", "Completed"]}
                                      currentIndex={tabIndex}
                                      onChange={handleTabsChange}
                                      segmentedControlBackgroundColor={backgroundColor}
                                      activeSegmentBackgroundColor={Colors.primaryColor}
                                      activeTextColor={"#fff"}
                                      textColor={"#888888"}
                                      paddingVertical={pixelSizeVertical(10)}/>
                </View>

                <IF condition={tabIndex === 0}>
                    <AllAdventure action={setModalVisible}/>
                </IF>

                <IF condition={tabIndex === 1}>
                    <AllEnrolledAdventure action={setContinueModalVisible}/>
                </IF>

                <IF condition={tabIndex === 2}>
                    <Completed/>
                </IF>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: pixelSizeHorizontal(20),
        backgroundColor: "#fff",
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {
        flex: 1,

        //  backgroundColor: Colors.background,

        width: '100%',
        alignItems: 'center'
    },
    segmentWrap: {
        height: heightPixel(80),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    backDrop: {
        width: '100%',
        flex: 1,
        backgroundColor: 'rgba(5,5,5,0.80)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,

        paddingHorizontal: pixelSizeHorizontal(20),
        height: heightPixel(385)
    },
    modalBody: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',

        height: heightPixel(275)
    },
    dripImageWrap: {
        width: 80,
        height: 80,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',

    },

    dripImage: {

        resizeMode: 'contain',
        width: "100%",
        height: "100%",
    },
    textWrap: {
        height: 70,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',

    },
    missionText: {
        fontSize: fontPixel(16),
        color: Colors.light.darkText,
        fontFamily: Fonts.quicksandMedium
    },
    learnText: {
        textAlign:'center',
        fontSize: fontPixel(16),
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold
    },
    sheetHead: {
        height: 50,
        top: -15,
        position: 'absolute',
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },

    dismiss: {
        right: -30,
        backgroundColor: "#fff",
        borderRadius: 30,
        height: 45,
        width: 45,
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
    buttonText: {
        position: 'absolute',
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    iconsWrap: {
        width: '100%',
        height: heightPixel(110),
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row'
    },
    iconContain: {
        height: heightPixel(70),
        width: '40%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    iconAndText: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    clockWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
    },
    clock: {
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    }
})

export default Adventures;
