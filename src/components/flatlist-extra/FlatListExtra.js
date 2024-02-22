import React, {memo, Fragment} from 'react';
import {FlatList, View} from 'react-native';

function chunk(array, size = 1) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
}

export const FlatListExtra = ({
                                  id,
                                  data,
                                  numRows,
                                  renderItem,
                                  keyExtractor,
                                  ...props
                              }) => {
    const keyExtractorDefault =
        keyExtractor || ((item, key) => (id ? item[id] : key));
    const getData = numRows ? chunk(data, numRows) : data;
    const RenderItemChunk = memo(({item: items, key}) => (
        <View key={key}>
            {items.map((item, index) => {
                const keyItem = id
                    ? item[id]
                    : keyExtractor
                        ? keyExtractor(item, index)
                        : index;
                return <Fragment key={keyItem}>{renderItem({item})}</Fragment>;
            })}
        </View>
    ));

    return (
        <FlatList
            data={getData}
            renderItem={
                numRows
                    ? ({item, key}) => <RenderItemChunk item={item} key={key} />
                    : renderItem
            }
            keyExtractor={!numRows ? keyExtractorDefault : undefined}
            {...props}
        />
    );
};
