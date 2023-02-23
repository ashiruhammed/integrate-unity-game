import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';

import VideoPlayer from 'react-native-media-console';
import {useNavigation} from "@react-navigation/native";
import Colors from "../constants/Colors";
import {useState} from "react";

export default function VideoTest() {
    const navigation = useNavigation()
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [fullScreen, setFullScreen] = useState(false);
    return (
        <View style={styles.container}>
            <VideoPlayer
                containerStyle={styles.video}
                videoRef={video}
                source={{uri: 'http://res.cloudinary.com/dj0rcdagd/video/upload/v1676390887/Mission_1_1_cprclk.mp4'}}
navigator={navigation}

                toggleResizeModeOnFullscreen
                onEnterFullscreen={() => setFullScreen(true)}
                fullscreen={fullScreen}
                fullscreenAutorotate
                fullscreenOrientation='all'
                showDuration
                isFullscreen={false}
                seekColor={Colors.primaryColor}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
        alignSelf: 'center',
        width: '100%',
        height: 200,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
