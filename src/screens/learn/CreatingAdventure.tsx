import React, {useEffect} from 'react';

import {Text, View, StyleSheet, Platform, ImageBackground, TouchableOpacity, Image} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {RootStackScreenProps} from "../../../types";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import Animated, {useAnimatedStyle, useSharedValue, withSpring, withTiming,withRepeat} from "react-native-reanimated";
import Colors from "../../constants/Colors";


const CustomProgressBar = ({ progress, width, height }) => {
    const animatedProgress = useSharedValue(0);

    React.useEffect(() => {
        animatedProgress.value = withTiming(progress, { duration: 1000 });
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${animatedProgress.value * 100}%`,
    }));

    return (
        <View style={[styles.barContainer, {  height }]}>
            <Animated.View style={[styles.progressBar, animatedStyle]} />
        </View>
    );
};


const CreatingAdventure = ({navigation}:RootStackScreenProps<'CreatingAdventure'>) => {




    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 1 ? 0 : prevProgress + 0.1));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const position = useSharedValue(0);

    const translateY = useSharedValue(0);

   useEffect(() => {
       translateY.value = withRepeat(
           withSpring(50, {damping: 2, stiffness: 80}),
           -1,
           true
       );
   },[])
    useEffect(() => {
        position.value = withRepeat(
            withSpring(1, { damping: 2, stiffness: 80 }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));


    return (
        <SafeAreaView style={[styles.safeArea]}>
        <ImageBackground source={require('../../assets/images/animated-bg.png')} resizeMode={'cover'} style={styles.backgroundImage}>

            <View style={styles.topBar}>

                <View style={styles.leftButton}>
                    <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.backButton}>
                        <AntDesign name="close" size={24} color="#fff" />

                    </TouchableOpacity>

                </View>

            </View>


            <View style={styles.container}>

                <View style={styles.avatar}>
<Image source={require('../../assets/images/avatar.png')} style={styles.avatarImage}/>
                </View>

                <Text style={styles.noticeText}>
                    A moment while we create
                    your adventure
                </Text>

                <Text style={styles.subNoticeText}>
                    Creating your first lesson...
                </Text>

                <CustomProgressBar progress={progress} width={200} height={16} />
            </View>

            <Animated.View style={[styles.floatingRock,animatedStyle]}>
                <Image source={require('../../assets/images/floating_rock.png')} style={styles.floatingRockImage}/>
            </Animated.View>






        </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#FEF1F1",

    },
    backgroundImage:{
        width: '100%',
        flex: 1,
        alignItems: 'center',
    },
    topBar: {
        paddingHorizontal: pixelSizeHorizontal(15),
        width: '100%',
        height: heightPixel(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    backButton: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    leftButton: {
        width: '15%',
        height: '100%',
        justifyContent: 'flex-start',
        flexDirection:'row',

        alignItems: 'center',
    },
    container:{
        width:'90%',
        alignItems:"center",
        height:heightPixel(400),
        justifyContent:'space-evenly'
    },
    avatar:{
        width:88,
        height:88,
        borderRadius:100,
        alignItems:"center",
        justifyContent:'center'
    }, avatarImage:{
        width:'100%',
        height:'100%',
        borderRadius:100,
        alignItems:"center",
        justifyContent:'center',
        resizeMode:'cover'
    },
    noticeText:{
        fontSize:fontPixel(24),
        lineHeight:30,
        color:"#fff",
        textAlign:'center',
        fontFamily:Fonts.quicksandSemiBold,
        marginVertical:pixelSizeVertical(10)
    },
subNoticeText:{
        fontSize:fontPixel(14),
        color:"#fff",
        textAlign:'center',
        fontFamily:Fonts.quicksandMedium
    },
    progressBar: {
        backgroundColor:"#BF1314",
        height: '100%',
        borderRadius:20,
    },
    barContainer: {

        width:'100%',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        overflow: 'hidden',
    },
    floatingRock:{
        width:'100%',
        height:200,
        alignItems:"center",
        justifyContent:'center',
    },

    floatingRockImage:{
        width:'100%',
        height:'100%',
        alignItems:"center",
        justifyContent:'center',
        resizeMode:'contain'
    },

})

export default CreatingAdventure;
