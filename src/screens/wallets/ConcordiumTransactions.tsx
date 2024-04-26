import React, {useCallback} from 'react';

import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import NavBar from "../../components/layout/NavBar";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppSelector} from "../../app/hooks";
import Colors from "../../constants/Colors";
import {RootStackScreenProps} from "../../../types";
import {useQuery} from "@tanstack/react-query";
import {walletTransactions} from "../../action/action";
import Animated, {FadeInDown, FadeOutDown} from "react-native-reanimated";
import {AntDesign} from "@expo/vector-icons";
import dayjs from "dayjs";
import {fontPixel, heightPixel, pixelSizeHorizontal, pixelSizeVertical} from "../../helpers/normalize";
import {Fonts} from "../../constants/Fonts";
import {FlashList} from "@shopify/flash-list";
import {useRefreshOnFocus} from "../../helpers";




interface props{
    item:{

    }
}

const TransactionItem= ({item}:props)=>{
    return(
        <Animated.View key={item.hash} entering={FadeInDown.delay(200).randomDelay()} exiting={FadeOutDown} style={styles.breakDownCard}>
            <View style={[styles.boxSign, {
                backgroundColor: Colors.errorTint
            }]}>
                <AntDesign name="arrowdown" size={20} style={{transform: [{rotate: "40deg"}]}}
                           color={Colors.errorRed}/>
            </View>

            <View style={styles.boxTransactionBody}>

                <View style={styles.boxTransactionBodyLeft}>
                    <Text style={styles.transactionTitle}>
                        {item.type}
                    </Text>
                    <Text style={styles.transactionDate}>
                        {dayjs(item.createdAt).format('ddd, DD MMM YYYY')}
                    </Text>
                </View>

                <View style={[styles.boxTransactionBodyLeft, {
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start'
                }]}>
                    <Text style={styles.transactionTitle}>
                        {item.amount} {item.token}
                    </Text>

                </View>
            </View>


        </Animated.View>
    )
}



const ConcordiumTransactions = ({navigation}:RootStackScreenProps<'ConcordiumTransactions'>) => {


    const {data:transactions,isLoading:loadingTransactions,refetch} = useQuery(['walletTransactions'],walletTransactions)
    const dataSlice = useAppSelector(state => state.data)
    const {theme} = dataSlice


    const backgroundColor = theme == 'light' ? "#fff" : Colors.dark.background
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    const lightText = theme == 'light' ? Colors.light.tintTextColor : Colors.dark.tintTextColor

    const keyExtractor = useCallback((item) => item.hash, [],);
    const renderItem = useCallback(({item})=>(
        <TransactionItem item={item}/>
    ),[])


    useRefreshOnFocus(refetch)
    return (
        <SafeAreaView style={[styles.safeArea, {
            backgroundColor
        }]}>
            <NavBar title={"Transactions"}/>

            <View
                style={[styles.scrollView, {
                    backgroundColor
                }]}
            >

            {loadingTransactions && <ActivityIndicator size="small" color={Colors.primaryColor}/>}

            {
                !loadingTransactions && transactions &&

                <FlashList


                    estimatedItemSize={200}
                    refreshing={loadingTransactions}
                    onRefresh={refetch}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    data={transactions.data.filter((transact: { token: string; }) => transact.token === 'CCD')}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onEndReachedThreshold={0.3}

                />
            }
</View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({

    safeArea: {
        width: '100%',
        flex: 1,
        backgroundColor: "#fff",

    },
    breakDownCard: {
marginVertical:pixelSizeVertical(5),
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%", height: heightPixel(60),

        backgroundColor: "#fff", borderRadius: 10,
        flexDirection: "row"
    },


    boxSign: {
        alignSelf: "flex-start",
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        marginTop: 10
    },
    boxTransactionBody: {
        width: '85%',

        justifyContent: 'space-between',
        height: '100%',
        alignItems: 'center',
        flexDirection: 'row',

    },
    boxTransactionBodyLeft: {

        width: '45%',
        height: '70%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        flexDirection: 'column',

    },
    transactionTitle: {
        color: Colors.light.text,
        fontFamily: Fonts.quicksandSemiBold,
        fontSize: fontPixel(14),
    },
    transactionDate: {
        color: "#9C9C9C",
        fontFamily: Fonts.quicksandMedium,
        fontSize: fontPixel(12),
    },
    scrollView: {
        flex: 1,
        //  backgroundColor: Colors.background,

        width: '100%',
        paddingHorizontal: pixelSizeHorizontal(20)
    },
})
export default ConcordiumTransactions;
