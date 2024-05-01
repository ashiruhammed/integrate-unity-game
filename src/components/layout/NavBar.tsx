import React from 'react';

import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {AntDesign, Octicons} from "@expo/vector-icons";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {useNavigation} from "@react-navigation/native";
import Notifications from "../../screens/Notifications";
import Colors from "../../constants/Colors";
import {useAppSelector} from "../../app/hooks";
import {useInfiniteQuery} from "@tanstack/react-query";
import {userNotifications} from "../../action/action";



interface props {
    title:string,
    noBell?:boolean
    clearBtn?:boolean,
    clearAction?:()=>void
}

const NavBar = ({title,noBell,clearBtn,clearAction}:props) => {
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice
    const {goBack,navigate} = useNavigation()


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

    const openNotifications = ()=>{
        navigate('Notifications')
    }
    const textColor = theme == 'light'  ? Colors.light.text : Colors.dark.text
    return (
        <View style={styles.navBar}>
            <View style={styles.leftBody}>
                <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
                    <AntDesign name="arrowleft" size={24} color={textColor}/>
                </TouchableOpacity>
                <Text style={[styles.screenTitle,{
                    color:textColor
                }
                ]}>
                    {title}
                </Text>
            </View>

            <View style={styles.rightButton}>

                {
                    clearBtn &&

                    <TouchableOpacity onPress={clearAction} activeOpacity={0.6}
                                      style={styles.ClearBtn}>

                        <Text style={styles.ClearText}>  Clear </Text>
                    </TouchableOpacity>
                }
                {
                    !noBell &&

                    <TouchableOpacity onPress={openNotifications} activeOpacity={0.6}
                                      style={styles.roundTopBtn}>

                        {
                            notifications?.pages[0]?.data?.result.length > 0 &&
                            <View style={[styles.dot,{
                            borderColor: theme =='light' ?"#fff":Colors.dark.background,
                        }]}/>
                        }
                        <Octicons name="bell-fill" size={20} color={ theme =='light' ? "#1F2937" : '#fff' }/>
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navBar: {
        paddingHorizontal: pixelSizeHorizontal(24),
        width: '100%',
        height: heightPixel(70),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    leftBody: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%'
    },
    screenTitle: {
        marginLeft: 15,
        fontFamily: Fonts.quickSandBold,
        fontSize: fontPixel(18),
    },
    rightButton: {
        width: widthPixel(60),
        height: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
    ClearBtn: {
        width: 70,
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    ClearText:{
        fontFamily:Fonts.quicksandRegular,
        fontSize:fontPixel(16),
        color:Colors.light.text
    },
    dot: {
        position: 'absolute',
        width: 10,
        height: 10,
        top: 5,
        zIndex: 1,
        right: 10,
        borderWidth:2,

        backgroundColor: Colors.errorRed,
        borderRadius: 15,
    }

})

export default NavBar;
