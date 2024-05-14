import React, {useCallback, useEffect, useState} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Platform,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ActivityIndicator, Pressable
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {useQueryClient} from "@tanstack/react-query";

import {AntDesign, Ionicons, Octicons} from "@expo/vector-icons";
import {RootStackScreenProps} from "../../../../types";
import {fontPixel, heightPixel, pixelSizeHorizontal, widthPixel} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";
import SearchInput from "../../../components/inputs/SearchInput";
import * as SecureStore from "expo-secure-store";
import {BASE_URL, ACCESS_TOKEN, DEV_BASE_URL} from "@env";

const BASE_URL_LIVE = DEV_BASE_URL
import _ from 'lodash';
import FastImage from "react-native-fast-image";
import Animated, {FadeInDown, FadeOutDown} from "react-native-reanimated";
import Colors from "../../../constants/Colors";
import {updateProduct} from "../../../app/slices/dataSlice";
import SwipeAnimatedToast from "../../../components/toasty";


interface props {
    item: {
        "id": string,
        "username": string,
        "fullName": string,
        "avatar":string
    },
    selectedItem: any[],

    selectUser: (symbol: {}) => void,
}

const UserItem = ({item,selectUser,selectedItem}: props) => {


    return (
        <Animated.View key={item.id} entering={FadeInDown} exiting={FadeOutDown}>
            <Pressable
                onPress={() => {
                    selectUser(item)
           /* addUser({
            id: item.id,

            name: item.fullName,
        })*/
            }}
            style={styles.favList}>


            <View style={[styles.listIcon, {
                //  backgroundColor: Colors.secondary,
            }]}>


         <FastImage
                                    style={styles.tAvatar}
                                    source={{
                                        cache: FastImage.cacheControl.web,
                                        uri: item.avatar,
                                        priority: FastImage.priority.normal,
                                    }}

                                    resizeMode={FastImage.resizeMode.cover}
/>


            </View>
            <TouchableOpacity onPress={() => {
                selectUser(item)

            }} activeOpacity={0.6} style={styles.listBody}>
                <Text style={styles.bodyTitle}>

                    {item.username}
                </Text>




                    <Text style={styles.bodySubText}>
                        {item.fullName}
                    </Text>


            </TouchableOpacity>
            <View style={styles.listBodyRight}>
                {selectedItem.find(selected => selected.id == item.id) ?
                <AntDesign name="star" size={14} color={Colors.success}/>
                    :
                    <AntDesign name="star" size={14} color={Colors.borderColor}/>
                }
            </View>
        </Pressable>
        </Animated.View>

    )
}

interface UserProps {
    "id": string,
    "fullName": string,
}
const SearchUser = ({navigation}: RootStackScreenProps<'SearchUser'>) => {


    const [searchValue, setSearchValue] = useState('')

    const dispatch = useAppDispatch()

    const dataSlice = useAppSelector(state => state.data)
    const user = useAppSelector(state => state.user)
    const {theme, productDetails, } = dataSlice

    const queryClient = useQueryClient();

    const [isLoading, setIsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])

    const backgroundColor = theme == 'light' ? "#FFFFFF" : "#141414"
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const darkTextColor = theme == 'light' ? Colors.light.darkText : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor
    const tintText = theme == 'light' ? "#AEAEAE" : Colors.dark.tintTextColor
    const borderColor = theme == 'light' ? "#DEE5ED" : "#ccc"



    const [selectedUser, setSelectedUser] = useState<UserProps[]>([]);


  /*  useEffect(() => {
        dispatch(updateProduct({
            contributors:[]
        }))
    }, []);*/
    const updateSelectUser = useCallback((payload: {
        "id": string,
        "name": string,

    }) => {

        const newData = selectedUser.findIndex((cat: { id: string }) => cat.id === payload.id)

        if (newData >= 0) {
            setSelectedUser((prevSelectedCats) => {
                return prevSelectedCats.filter(
                    (cat) => cat.id !== payload.id
                );
            });
        } else {

            setSelectedUser(selectedCats => [...selectedCats, {...payload}])
        }
    }, [selectedUser])



    const searchUsers = async (query: string) => {
        setIsLoading(true);
        try {
            let Token = await SecureStore.getItemAsync('Gateway-Token');

            const myHeaders = {
                'Authorization': `Bearer ${Token}`,
                'x-access-token': ACCESS_TOKEN,
                'x-client-type': 'web',
            }


            let timeoutId: NodeJS.Timeout


            const requestOptions = {
                method: 'GET',
                headers: myHeaders,

            };


            const response = await fetch(`${BASE_URL_LIVE}/user/search/${query}`, requestOptions);
            const data = await response.json();
            setSearchResults(data.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedSearch = _.debounce(searchUsers, 300);
    useEffect(() => {
        if (searchValue.length > 2) {
            debouncedSearch(searchValue.toLowerCase());
        } else {
            setSearchResults([]);
        }
    }, [searchValue]);


    const keyExtractor = useCallback((item: { id: any; }) => item.id, [],);

    const renderItem = useCallback(({item}) => (
            <UserItem item={item} selectUser={updateSelectUser} selectedItem={selectedUser}/>
        )
        , [selectedUser])


    const confirmSelection  = ()=>{
        const contributors = Object.values(selectedUser).map(item => item.id);
        dispatch(updateProduct({
            contributors
        }))
navigation.goBack()
       // console.log(contributors)
    }

    return (
        <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
            <SwipeAnimatedToast/>

            <View style={styles.navButtonWrap}>
                <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}
                                  style={styles.navButton}>

                    <AntDesign name="arrowleft" size={24} color="black"/>
                    <Text style={[styles.backText, {
                        color: darkTextColor
                    }]}>Cancel</Text>
                </TouchableOpacity>


            </View>


            <View style={styles.searchBoxWrap}>
                <SearchInput onChangeText={(e) => setSearchValue(e)} placeholder={'Search username here'}
                             value={searchValue}/>

                <View style={[styles.searchIcon, {
                    borderColor
                }]}>

                    <AntDesign name="search1" size={18} color="black"/>
                </View>

            </View>
            <View
                style={[styles.scrollView, {
                    backgroundColor
                }]}
            >

            {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primaryColor}/>
            ) : searchResults.length > 0 && (


                <FlatList
                    data={searchResults}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    scrollEnabled
                />

            )}
            </View>

            <Pressable disabled={!selectedUser} onPress={confirmSelection} style={[styles.claimBtn, selectedUser.length > 0 ? {
                backgroundColor: Colors.primaryColor,
            } : { backgroundColor: Colors.borderColor,}]}>

                <Text style={styles.claimBtnText}>
              Confirm selection
                </Text>
            </Pressable>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#FEF1F1",
        paddingBottom: Platform.OS === 'ios' ? -40 : 0
    },
    scrollView: {
        flex: 1,
        //  backgroundColor: Colors.background,

        width: '100%',

        paddingHorizontal: pixelSizeHorizontal(20)
    },
    navButtonWrap: {
        paddingHorizontal: pixelSizeHorizontal(15),
        width: '100%',
        height: heightPixel(40),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    navButton: {
        width: '15%',
        height: '100%',
        justifyContent: 'flex-start',
        flexDirection: 'row',

        alignItems: 'center',
    },
    backText: {
        marginLeft: 5,
        fontSize: fontPixel(16),
        fontFamily: Fonts.quicksandMedium
    },
    searchBoxWrap: {

        width: '90%',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    searchIcon: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 10
    },

    favList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: heightPixel(90),
        borderBottomColor: "#F3F4F6",
        borderBottomWidth: 1
    },
    listBottom: {
        width: '100%',
        height: '40%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    listIcon: {
        width: 35,
        height: 35,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tAvatar: {

        borderRadius: 100,
        resizeMode: 'cover',
        width: '100%',
        height: '100%'
    },
    listBody: {
        width: '55%',
        height: '50%',
        marginLeft:5,
        alignItems: 'flex-start',
        justifyContent: 'space-evenly'
    },
    listBodyRight: {
        width: '30%',
        height: '50%',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    bodyTitle: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quickSandBold,
        color: Colors.light.text,
        textTransform:'capitalize'
    },
    bodySubText: {

        fontSize: fontPixel(12),
        fontFamily: Fonts.quickSandBold,
        color: "#9CA3AF"
    },
    claimBtn: {
        height: 45,
position:'absolute',
        bottom:50,
        width: widthPixel(235),
        borderRadius: 30,

        alignItems: 'center',
        marginVertical: 40,
        justifyContent: 'center',
    },
    claimBtnText: {
        fontSize: fontPixel(14),
        color: "#fff",
        fontFamily: Fonts.quicksandSemiBold
    },


})

export default SearchUser;
