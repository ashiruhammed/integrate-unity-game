import React, {SetStateAction, useCallback, useState} from 'react';

import {Text, View, StyleSheet, Platform, Animated, Dimensions, TouchableOpacity} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import NavBar from "../../../components/layout/NavBar";
import SearchValue from "../../../components/inputs/SearchInput";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import SegmentedControl from "../../../components/SegmentContol";
import Colors from "../../../constants/Colors";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";
import {RectButton} from "../../../components/RectButton";
import {SmallRectButton} from "../../../components/buttons/SmallRectButton";


const {width} = Dimensions.get('window')
const AllCommunities = () => {

    const [tabIndex, setTabIndex] = useState(0);
    const handleTabsChange = useCallback((index: SetStateAction<number>) => {
        setTabIndex(index);
    }, [tabIndex]);
    const scrollX = new Animated.Value(0)
    let position = Animated.divide(scrollX, width)
    const [dataList, setDataList] = useState(CommunityData)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const updateCurrentSlideIndex = (e: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);

    };

    const [searchValue, setSearchValue] = useState('');


    return (
        <SafeAreaView style={styles.safeArea}>
            <NavBar title={"All communities"}/>
            <View style={styles.searchWrap}>

                <SearchValue isWidth={"80%"} placeholder={'Search for all types of Communities'}
                             value={searchValue}/>

                <View style={styles.searchTangible}>
                    <Ionicons name="md-search-outline" size={20} color="#666666"/>
                </View>
            </View>

            <View style={styles.segmentWrap}>
                <SegmentedControl tabs={["All Communities", "My Communities"]}
                                  currentIndex={tabIndex}
                                  onChange={handleTabsChange}
                                  segmentedControlBackgroundColor={"#fff"}
                                  activeSegmentBackgroundColor={Colors.primaryColor}
                                  activeTextColor={"#fff"}
                                  textColor={"#888888"}
                                  paddingVertical={pixelSizeVertical(8)}/>
            </View>

            <View style={styles.listWrap}>
                <View style={styles.ActivityCardTop}>
                    <Text style={styles.listTitle}>
                        Public Communities
                    </Text>

                </View>

                <View style={styles.myCommunityCard}>

                    <View style={styles.communityLogo}>

                    </View>

                    <View style={styles.bodyCard}>
                        <Text style={styles.cardTitle}>
                            Waves Academy
                        </Text>
                        <Text style={styles.cardTitleSub}>
                            300 Members
                        </Text>
                    </View>

                    <SmallRectButton style={{

                    }}>
                        <Text style={styles.buttonText}>
                            Join

                        </Text>
                    </SmallRectButton>

                </View>


            </View>
        </SafeAreaView>
    );
};


const CommunityData = [
    {
        id: "1",

    },
    {
        id: "2"
    }
]

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,

        backgroundColor: "#fff",
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    segmentWrap: {
        height: heightPixel(60),
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
    },
    searchWrap: {
        height: heightPixel(90),
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
    },
    searchTangible: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: "#DEE6ED",
        borderWidth: 1,
        borderRadius: 10,

    },
    myCommunityCard: {
        width: '90%',
        height: heightPixel(80),
        shadowColor: "#212121",
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: pixelSizeHorizontal(10),
        marginVertical: pixelSizeVertical(5),
        borderRadius: 10,
        padding: 15,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7.22,
        backgroundColor: '#fff',
        elevation: 3,
    },
    communityLogo: {
        height: 50,
        width: 50,
        borderRadius: 5,
        backgroundColor: "blue"
    },
    bodyCard: {

        marginLeft: 10,
        width: '60%',
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
    },
    cardTitle: {
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text,
        fontSize: fontPixel(16)
    },
    cardTitleSub: {
        fontFamily: Fonts.quicksandRegular,
        color: Colors.light.text,
        fontSize: fontPixel(16)
    },
    ActivityCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        height: heightPixel(70),
    },
    listTitle: {
        fontSize: fontPixel(16),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text
    },
    listWrap: {
        width: '100%',
        alignItems: 'center',

    },
    buttonText: {
        marginLeft: 5,
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },

})

export default AllCommunities;
