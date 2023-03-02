import React from 'react';

import {Text, View, StyleSheet, Pressable, Image, ActivityIndicator} from 'react-native';
import {useQuery} from "@tanstack/react-query";
import {getCommunityFollowers} from "../../action/action";
import {useNavigation} from "@react-navigation/native";
import Colors from "../../constants/Colors";
import FastImage from "react-native-fast-image";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {isWhatPercentOf, truncate} from "../../helpers";
import {RectButton} from "../RectButton";
import Constants from "expo-constants";
import {useAppSelector} from "../../app/hooks";
import {IF} from "../../helpers/ConditionJsx";
import {MaterialIcons} from "@expo/vector-icons";


const isRunningInExpoGo = Constants.appOwnership === 'expo'

interface cardProps {
    loadingBadge?: boolean,
    theme: 'light' | 'dark',
    item: {
        status: string,
        description: string,
        totalUsersJoined: string,
        memberLimit: string,
        currentUserJoined: boolean,
        userAlreadyRequest: boolean,
        name: string,
        id: string,
        visibility:string,
        ownerId:string,
        displayPhoto: string,
        remainingSlots: string,
        accessNFTBadgeAmount: string,
        communityFollowers: [],
        badgeId: string,
        owner: {
            id: string,
            fullName: string
        }
    },
    viewTheCommunity:(id:string,ownerId:string,visibility:string,displayPhoto:string)=>void
    joinModal: (badgeId: string, accessNFTBadgeAmount: string, communityId: string) => void
}
const CardPublicCommunity = ({theme, loadingBadge, item, joinModal,viewTheCommunity}: cardProps) => {
    const user = useAppSelector(state => state.user)
    const {userData} = user

    const {isLoading, data} = useQuery(['getCommunityFollowers'], () => getCommunityFollowers(item.id))

    const navigation = useNavigation()
    const open = () => {
        if(item?.owner?.id == userData.id){
            viewTheCommunity(item.id,item.ownerId,item.visibility,item.displayPhoto)
        }else
        if (item.currentUserJoined) {
            viewTheCommunity(item.id,item.ownerId,item.visibility,item.displayPhoto)
        } else {
            joinModal(item.badgeId, item.accessNFTBadgeAmount, item.id)
        }
    }
    const backgroundColor = theme == 'light' ? Colors.light.background : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const tintTextColor = theme == 'light' ? "#AEAEAE": Colors.dark.tintTextColor
    const barBg = theme == 'light' ? "#FEF1F1" : "#141414"

    const props = {size: 40, strokeWidth: 2, text: 'hello'}
    const {size, strokeWidth, text} = props;
    const radius = (size - strokeWidth) / 2;
    const circum = radius * 2 * Math.PI;
    const svgProgress = 100 - 80;
    return (
        <Pressable onPress={open} disabled={item?.userAlreadyRequest && !item.currentUserJoined} style={[styles.communityCard, {
            backgroundColor
        }]}>

            <View style={styles.topCard}>
                <View style={styles.imageWrap}>

                            <FastImage
                                style={styles.avatar}
                                source={{
                                    uri: item?.displayPhoto,
                                    cache: FastImage.cacheControl.web,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                </View>

                <Text style={[styles.cardTitle, {
                    color: textColor
                }]}>
                    {item?.name}
                </Text>
            </View>

            <View style={styles.cardBody}>
                <Text style={[styles.bodyText, {
                    color:tintTextColor
                }]}>
                    Created by: <Text style={{
                    color: textColor,
                    fontSize: fontPixel(14),
                    fontFamily: Fonts.quicksandRegular
                }}> {item?.owner?.fullName} </Text>
                </Text>
                <View style={styles.bodyTextWrap}>


                    <Text style={[styles.bodyText,{
                        color:tintTextColor
                    }]}>
                        {truncate(item.description, 130)}
                    </Text>
                </View>

                <View style={styles.progressBarWrap}>
                    <View style={styles.progressBar}>
                        <View style={[styles.bar, {
                            width: `${isWhatPercentOf(+item.totalUsersJoined, +item.memberLimit)}%`
                        }]}/>


                    </View>
                </View>

                <View style={[styles.cardBodyBG, {
                    //  backgroundColor: barBg
                }]}>
                    <View style={styles.imageOverlap}>
                        {

                            item?.communityFollowers.slice(0, 4).map((({id, follower}) => (
                                <View key={id} style={styles.avatarWrap}>
                                    {isRunningInExpoGo ?

                                        <Image
                                            style={styles.avatar}
                                            source={{
                                                uri: !follower?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : follower?.avatar,
                                            }}
                                            resizeMode={'cover'}
                                        />
                                        :
                                        <FastImage
                                            style={styles.avatar}
                                            source={{
                                                uri: !follower?.avatar ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png' : follower?.avatar,
                                                cache: FastImage.cacheControl.web,
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                    }
                                </View>
                            )))
                        }

                        <View style={styles.numberView}>
                            <Text style={[styles.learnText, {
                                fontSize: fontPixel(10)
                            }]}>
                                +{  item.communityFollowers.length}
                            </Text>
                        </View>

                    </View>


                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>


                        {/* Text */}
                        <Text style={{
                            color: textColor,
                            fontSize: fontPixel(12),
                            fontFamily: Fonts.quicksandRegular
                        }}>


                            {item?.remainingSlots} persons left
                        </Text>
                    </View>


                </View>
            </View>


            <IF condition={item.visibility  == 'PRIVATE'}>


                {
                    item?.owner?.id == userData.id &&

                    <RectButton
                        onPress={open}
                        style={{
                            width: 150
                        }}>
                        <Text style={styles.buttonText}>

                            Open
                        </Text>

                    </RectButton>
                }
                {
                    item?.owner?.id !== userData.id &&  item.currentUserJoined &&

                    <RectButton
                        onPress={open}
                        style={{
                            width: 150
                        }}>
                        <Text style={styles.buttonText}>

                            Open
                        </Text>

                    </RectButton>
                }


                {
                    item?.userAlreadyRequest && !item.currentUserJoined &&

                    <RectButton
                        disabled
                        style={{
                            width: 150,
                            opacity:0.7
                        }}>
                        <Text style={styles.buttonText}>

                            Requested
                        </Text>

                    </RectButton>
                }




                {
                    !item.currentUserJoined  &&    !item?.userAlreadyRequest  && item?.owner?.id !== userData.id &&

                    <RectButton
                        onPress={open}
                        style={{
                            width: 150
                        }}>
                        {
                            loadingBadge ? <ActivityIndicator size='small' color={"#fff"}/>
                                :
                                <>

                                    <MaterialIcons name="lock" size={14} color="#fff"/>
                                    <Text style={[styles.buttonText, {
                                        marginLeft: 5,
                                    }]}>
                                        Request to join

                                    </Text>
                                </>
                        }
                    </RectButton>
                }

            </IF>
            <IF condition={item.visibility !== 'PRIVATE'}>


                {
                    item?.owner?.id == userData.id &&

                    <RectButton
                        onPress={open} style={{
                        width: 150
                    }}>
                        <Text style={styles.buttonText}>

                            Open
                        </Text>

                    </RectButton>
                }


                {
                    item.currentUserJoined &&

                    <RectButton
                        onPress={open} style={{
                        width: 150
                    }}>
                        <Text style={styles.buttonText}>

                            Open
                        </Text>

                    </RectButton>
                }
                {
                    !item.currentUserJoined && item?.owner?.id !== userData.id &&

                    <RectButton disabled={loadingBadge}
                                onPress={open} style={{
                        width: 150
                    }}>
                        {
                            loadingBadge ? <ActivityIndicator size='small' color={"#fff"}/>
                                :

                                <Text style={styles.buttonText}>

                                    Join
                                </Text>
                        }
                    </RectButton>
                }
            </IF>
        </Pressable>
    )
}


const styles = StyleSheet.create({

    communityCard: {
        width: '95%',
        height: heightPixel(300),
        shadowColor: "#212121",
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: pixelSizeHorizontal(10),
        marginVertical: pixelSizeVertical(10),
        borderRadius: 10,
        padding: 15,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.32,
        shadowRadius: 7.22,
        elevation: 3,
    },

    topCard: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    imageWrap: {
        width: 40,
        height: 40,
        borderRadius: 5,
        // backgroundColor: "#ccc"
    },
    avatar: {
        borderRadius: 40,
        resizeMode: 'cover',
        backgroundColor: Colors.border,
        width: "100%",
        height: "100%",
    },
    cardTitle: {
        fontFamily: Fonts.quickSandBold,
        color: "#000000",
        marginLeft: 8,
        fontSize: fontPixel(14)
    },
    bodyTextWrap: {
        width: '100%',
        height: 70,

        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    bodyText: {
        fontFamily: Fonts.quicksandRegular,

        marginLeft: 8,
        lineHeight: heightPixel(18),
        fontSize: fontPixel(12),
    },

    progressBarWrap: {
        height: 20,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressBar: {
        width: '100%',
        backgroundColor: '#F4F5F7',
        height: 5,
        borderRadius: 5,
    },
    bar: {

        backgroundColor: Colors.primaryColor,

        position: 'relative',
        height: 5,
        borderRadius: 5,
    },
    cardBody: {
        width: '100%',
        height: 140,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },

    cardBodyBG: {
        paddingHorizontal: pixelSizeHorizontal(10),
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: "#FEF1F1",
        borderRadius: 10,
    },
    imageOverlap: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '40%',
        height: '100%'
    },
    avatarWrap: {
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: "#ccc",
        width: 20,
        borderRadius: 30,
        height: 20,
        position: 'relative',
        marginLeft: -5
    },
    buttonText: {

        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    numberView: {
        top: 10,
        left: -20,
        position: 'relative',
        backgroundColor: "#fff",
        borderRadius: 10,
        height: 15,
        minWidth: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.30,
        shadowRadius: 7.22,

        elevation: 3,
    },
    learnText: {
        //  lineHeight: heightPixel(24),
        fontSize: fontPixel(16),
        color: Colors.light.text,
        fontFamily: Fonts.quickSandBold
    },
})

export default CardPublicCommunity;
