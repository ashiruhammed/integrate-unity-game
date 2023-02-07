import React, {useCallback} from 'react';

import {
    Text,
    View,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ImageBackground
} from 'react-native';
import {heightPixel, pixelSizeHorizontal, pixelSizeVertical, widthPixel} from "../../../helpers/normalize";
import {useQuery} from "@tanstack/react-query";
import {getUserCompletedAdventure} from "../../../action/action";
import {FlashList} from "@shopify/flash-list";
import Colors from "../../../constants/Colors";
import {useRefreshOnFocus} from "../../../helpers";

interface itemProps {
    item: {
        adventure: { imageUrl },


    },


}


const CompletedCard = ({item}: itemProps) => {

    return (
        <View style={styles.card}>
            <ImageBackground resizeMethod='scale' resizeMode='cover' source={{
                uri: item?.adventure?.imageUrl
            }} style={styles.adventureCard}>
                <View style={styles.backDrop}/>
                <Image style={styles.completedImage} source={require('../../../assets/images/completed.png')}/>
            </ImageBackground>
        </View>
    )
}

const Completed = () => {

    const {isLoading, data, refetch} = useQuery(['getUserCompletedAdventure'], getUserCompletedAdventure)

    const keyExtractor = useCallback((item: { id: string; }) => item.id, [],);


    const renderItem = useCallback(({item}) => (
        <CompletedCard item={item}/>
    ), [])
    useRefreshOnFocus(refetch)

    return (

        <View style={styles.Body}>
            {isLoading && <ActivityIndicator size="small" color={Colors.primaryColor}/>}
            {
                !isLoading && data &&

                <FlashList


                    estimatedItemSize={200}
                    refreshing={isLoading}
                    onRefresh={refetch}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    data={data?.data?.result.flat()}
                    renderItem={renderItem}

                    keyExtractor={keyExtractor}
                    onEndReachedThreshold={0.3}

                />
            }
        </View>
    );
};


const styles = StyleSheet.create({
    Body: {
        width: '100%',

        flex: 1,

    },
    card: {
        borderRadius: 10,
        overflow: 'hidden',
        width: '95%',
        //    backgroundColor: Colors.primaryColor,
        height: heightPixel(180),
        marginVertical: pixelSizeVertical(12),
        alignSelf: 'center',
    },
    backDrop: {
        width: '100%',
        height: '100%',

        position: 'absolute',
        backgroundColor: 'rgba(5,5,5,0.72)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    adventureCard: {


        borderRadius: 10,
        width: '100%',
        height: heightPixel(180),
        alignItems: 'center',
        // backgroundColor: "#222222",
        justifyContent: 'center',
    },
    completedImage: {
        width: '50%',
        height: '60%',
        resizeMode: 'cover'
    }
})

export default Completed;
