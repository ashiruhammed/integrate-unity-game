import React, {useCallback, useState} from 'react';

import {Text, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Button} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import Colors from "../../../constants/Colors";
import {Octicons} from "@expo/vector-icons";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";
import NavBar from "../../../components/layout/NavBar";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {blockUser, unFollowCommunity} from "../../../action/action";
import {setResponse} from "../../../app/slices/userSlice";
import {CommunityStackScreenProps, RootStackScreenProps} from "../../../../types";
import {RectButton} from "../../../components/RectButton";
import Toast from "../../../components/Toast";

const BlockUser = ({navigation, route}: RootStackScreenProps<'BlockUser'>) => {

const {userId} = route.params
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch()

    const user = useAppSelector(state => state.user)
    const {userData, responseState, responseType, responseMessage} = user
    const dataSlice = useAppSelector(state => state.data)
    const {theme,currentCommunityId} = dataSlice
    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const [reasonText, setReasonText] = useState('');

    const lightTextColor = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? Colors.borderColor : '#313131'


    const {isLoading, mutate: BlockUserNow} = useMutation(['BlockUser'], blockUser, {
        onSuccess: async (data) => {
            if (data.success) {

                dispatch(setResponse({
                    responseMessage: "User blocked, thank you for keeping the community clean",
                    responseState: true,
                    responseType: 'success',
                }))
                navigation.navigate('Dashboard', {
                    screen: 'Community'
                })


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
        onError: (error) => {

            dispatch(setResponse({
                responseMessage: error.message,
                responseState: true,
                responseType: 'error',
            }))
        },
        onSettled: () => {
            queryClient.invalidateQueries(['BlockUser']);
        }
    })


    const leaveCommunity = () => {
const body = JSON.stringify({
    userId,
    reason:reasonText
})
        BlockUserNow(body)
    }

    const setReason = (value: string) => {
        setReasonText(value)
    }
    const renderItemReasons = useCallback(({item}: any) => (
        <TouchableOpacity activeOpacity={0.8} style={[styles.ReasonBox,{
            borderTopColor:borderColor
        }]} onPress={() => setReason(item.title)}>

            <Text style={[styles.selectBoxText, {

                color:textColor
            }]}>{item.title}</Text>

            {
                reasonText === item.title ?
                    <Octicons name="check-circle-fill" size={14} color={Colors.primaryColor}/>
                    :
                    <Octicons name="circle" size={14} color={borderColor}/>

            }

        </TouchableOpacity>
    ), [reasonText])

    const keyExtractor = useCallback((item) => item.id, [],);

    return (

        <SafeAreaView style={[styles.safeArea, {
            backgroundColor
        }]}>
            <NavBar title={"What went wrong?"}/>
            <Toast message={responseMessage} state={responseState} type={responseType}/>
            <View style={{
                flex:1,
                width:'100%',
                paddingHorizontal:pixelSizeHorizontal(24),
                alignItems:'center'
            }}>


            <FlatList data={ReasonsReschedule}
                      renderItem={renderItemReasons}
                      keyExtractor={keyExtractor}
                      showsVerticalScrollIndicator={false}/>
            </View>



            <RectButton disabled={isLoading} style={styles.button} onPress={leaveCommunity}>

                {
                    isLoading ? <ActivityIndicator size='small' color="#fff"/>
                        :

                        <Text style={styles.btnText}>
                            Continue

                        </Text>
                }
            </RectButton>




        </SafeAreaView>
    );
};


const ReasonsReschedule = [
    {
        id: "1",
        title: "Was insulted"
    },
    {
        id: "2",
        title: "I was offended"
    }, {
        id: "3",
        title: "This group is not for me"
    },
]

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',

    },
    ReasonBox: {

width:widthPixel(350),
        flexDirection: 'row',
        height: heightPixel(60),
        borderTopWidth: 0.2,

        justifyContent: 'space-between',
        alignItems: 'center'
    },
    summaryContainer: {
        width: '100%',
        alignItems: 'flex-start',
        marginTop: 20,
        marginBottom: 100,
    },

    selectBoxText: {
        fontSize: fontPixel(18),
        fontFamily: Fonts.quicksandMedium,

    },
    btnText: {

        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    },
    button: {
        position:'absolute',
        bottom:40,
        width: 180,
        marginTop: 20,
        marginBottom: 50,
    }

})

export default BlockUser;
