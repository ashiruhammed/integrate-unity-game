import React from 'react';

import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Octicons} from "@expo/vector-icons";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {useNavigation} from "@react-navigation/native";
import Colors from "../../constants/Colors";
import {useAppSelector} from "../../app/hooks";
import FastImage from "react-native-fast-image";
import Constants from "expo-constants";



interface props {
    title:string,
    message?:string|null,
}


const isRunningInExpoGo = Constants.appOwnership === 'expo'
const TopBar = ({message,title}:props) => {

    const dataSlice = useAppSelector(state => state.data)
    const {missionName,theme} = dataSlice
    const user = useAppSelector(state => state.user)
    const {userData} = user
    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text


    const navigation = useNavigation()
    const openNotifications = ()=>{
        navigation.navigate('Notifications')
    }
    const openProfile = ()=>{
        navigation.navigate('Dashboard',{
            screen:'Profile'
        })
    }
    return (
        <View style={[styles.topBar,{

        }]}>

            <View style={styles.leftButton}>

                <View style={styles.userDetails}>
                    <Text style={[styles.greeting,{
                        color:textColor
                    }]}>
                        {title}
                    </Text>
                    {
                        message &&

                        <Text style={[styles.tag,{
                            color: theme == 'light' ? "#4B5563" : Colors.dark.text
                        }]}>
                            {message}
                        </Text>
                    }
                </View>
            </View>

            <View style={styles.rightButton}>
                <TouchableOpacity onPress={openNotifications} activeOpacity={0.6}
                                  style={styles.roundTopBtn}>
                    <View style={[styles.dot,{
                        borderColor: theme =='light' ?"#fff":Colors.dark.background,
                    }]}/>
                    <Octicons name="bell-fill" size={20} color={ theme =='light' ? "#1F2937" : '#fff' }/>
                </TouchableOpacity>
                <TouchableOpacity onPress={openProfile} activeOpacity={0.6}
                                  style={styles.roundTopBtn}>

                    {
                        isRunningInExpoGo ?
                            <Image
                                style={styles.userAvatar}
                                source={{
                                    uri: !user.userData?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' :  user.userData?.avatar,

                                }}
                            />
                            :

                            <FastImage
                                style={styles.userAvatar}
                                source={{
                                    uri: !user.userData?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' :  user.userData?.avatar,

                                    cache: FastImage.cacheControl.web,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                    }

                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        height: heightPixel(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    rightButton: {
        width: widthPixel(100),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    roundTopBtn: {
        width: 40,
        height: 40,
        borderRadius: 40,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        backgroundColor: '#fff',
        resizeMode: 'cover',
    },
    leftButton: {
        width: '60%',
        height: '100%',
        justifyContent: 'center',

        alignItems: 'flex-start',
    },
    userDetails: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    greeting: {
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(24),
        color: "#000",
    },
    tag: {
        marginTop: 5,
        fontFamily: Fonts.quicksandRegular,
        fontSize: fontPixel(12),
    },
    dot: {
        position: 'absolute',
        width: 10,
        height: 10,
        top: 5,
        zIndex: 1,
        right: 10,
        borderWidth:2,
        borderColor:"#fff",
        backgroundColor: Colors.errorRed,
        borderRadius: 15,
    }

})

export default TopBar;
