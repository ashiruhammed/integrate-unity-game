import React from 'react';
import {Text, TextProps} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const GradientText = (props: React.JSX.IntrinsicAttributes & React.JSX.IntrinsicClassAttributes<Text> & Readonly<TextProps>) => {
    return (
        <MaskedView maskElement={<Text {...props} />}>
            <LinearGradient
                colors={['#FF8BF7', '#00AAFF', '#00AAFF']}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}>
                <Text {...props} style={[props.style, {opacity: 0}]} />
            </LinearGradient>
        </MaskedView>
    );
};

export default GradientText;
