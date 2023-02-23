import React, {useState} from 'react';

import {Text, View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {useInfiniteQuery} from "@tanstack/react-query";
import {getFollowedCommunities} from "../../../action/action";
import Colors from "../../../constants/Colors";



const wait = (timeout: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};
const FollowedCommunities = () => {

    const [refreshing, setRefreshing] = useState(false);

    const {
        isLoading,
        data,
        hasNextPage,
        fetchNextPage: fetchNextPageWallet,
        isFetchingNextPage,
        refetch,

        isRefetching
    } = useInfiniteQuery([`getFollowedCommunities`], ({pageParam = 1}) => getFollowedCommunities.communities(pageParam),
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


    const refresh = () => {
        setRefreshing(true)
        refetch()

        wait(2000).then(() => setRefreshing(false));
    }

    return (
        <View style={styles.listWrap}>




            {



                <FlatList

                    refreshing={isLoading}
                    onRefresh={refetch}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    data={allMyCommunities?.pages[0]?.data?.result}
                    renderItem={renderItem}
                    onEndReached={loadMore}
                    keyExtractor={keyExtractor}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={loading ?
                        <ActivityIndicator size="small" color={Colors.primaryColor}/> : null}
                />
            }


        </View>
    );
};

const styles = StyleSheet.create({})

export default FollowedCommunities;
