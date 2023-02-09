import React from 'react';

import {Text, View, StyleSheet, FlatList} from 'react-native';
import {FontAwesome} from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import {fontPixel, heightPixel} from "../../../helpers/normalize";
import {Fonts} from "../../../constants/Fonts";



interface ReferralProps {
    item: {
        "id": string,
        "userId": string,
        "amount": number,
        "reason": string,
        "transactionId": null,
        "isDeleted": boolean,
        "createdAt": string,
        "deletedAt": null,
        "user": {
            "username": null,
            "avatar": string,
            "fullName": string,
            "id": string
        }
    }
}

const ReferralItem = ({}:ReferralProps)=>{
    return(
        <View style={styles.transactionCard}>
            <View style={[styles.transactionCardIcon, {
                backgroundColor: "#59C965"
            }]}>
                <FontAwesome name="exchange" size={20} color="#fff"/>

            </View>

            <View style={styles.transactionCardBody}>
                <Text style={[styles.transactionCardTitle, {
                    color: Colors.light.text
                }]}>
                    1,000 CUSD
                </Text>
                <View style={styles.transactionCardBodyBottom}>
                    <Text style={[styles.transactionCardTitle, {
                        color: Colors.success
                    }]}>
                        Link used by James
                    </Text>
                    <Text style={styles.transactionCardDate}>
                        10/05/2022 at 11:37 AM
                    </Text>
                </View>
            </View>
        </View>
    )
}

const AllRefHistory = () => {
    return (
        <View>

           {/* <FlatList data={filterCategory}
                      keyExtractor={keyExtractor}
                      renderItem={renderItem}
                      showsVerticalScrollIndicator={false}
                      initialNumToRender={30}
                      refreshing={isLoading}
                      scrollEnabled
                      onEndReached={loadMore}
                      onEndReachedThreshold={0.3}
                      ListFooterComponent={isFetchingNextPage ?
                          <ActivityIndicator size="small" color={Colors.primary}/> : null}
            />*/}
        </View>
    );
};

const styles = StyleSheet.create({
    transactionCard: {

        height: heightPixel(80),
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    transactionCardIcon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    transactionCardBody: {

        height: '80%',
        width: '85%',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly'
    },
    transactionCardBodyBottom: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    transactionCardDate: {
        fontSize: fontPixel(12),
        fontFamily: Fonts.quicksandRegular,
        color: "#666666"
    },
    transactionCardTitle: {
        fontSize: fontPixel(14),
        fontFamily: Fonts.quicksandSemiBold,

    },
})

export default AllRefHistory;
