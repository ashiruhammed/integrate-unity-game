import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useRef, useState} from "react";
import {PermissionsAndroid, TouchableOpacity, View, Text, StyleSheet, Alert, Linking} from 'react-native'
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';
import {enableScreens} from "react-native-screens";
import 'react-native-gesture-handler';
import OnBoarding from "./src/screens/onboarding/OnBoarding";

import {PersistQueryClientProvider} from "@tanstack/react-query-persist-client";
import {
    QueryClient,
    QueryClientProvider, focusManager, MutationCache, useQuery
} from '@tanstack/react-query'
import {createSyncStoragePersister} from "@tanstack/query-sync-storage-persister";
import {Provider} from "react-redux";
import {persistor, store} from "./src/app/store";
import {PersistGate} from "redux-persist/integration/react";
import {PortalProvider} from "@gorhom/portal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';
import {Platform} from "react-native";

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {
    getFcmToken,
    getFcmTokenFromLocalStorage,
    requestUserPermission,
    notificationListener,
} from './notification';
import { Settings } from 'react-native-fbsdk-next'
import appsFlyer from 'react-native-appsflyer';
import {BASE_URL,AppID,DEV_BASE_URL,ACCESS_TOKEN} from "@env";
import {logoutUser} from "./src/app/slices/userSlice";
import {fontPixel, heightPixel} from "./src/helpers/normalize";
import {Colors} from "react-native/Libraries/NewAppScreen";
import {Fonts} from "./src/constants/Fonts";
import ErrorBoundary from "react-native-error-boundary";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import VersionCheck from 'react-native-version-check';
Settings.initializeSDK();
Settings.setAppID(AppID);
enableScreens()

const BASE_URL_LIVE = DEV_BASE_URL

appsFlyer.initSdk(
    {
        devKey: 'ZQCnz6xc7VeXUpnbXj4cG5',
        isDebug: false,
        appId: 'id1669256052',
        onInstallConversionDataListener:false, //Optional
        onDeepLinkListener: true, //Optional
        timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
    },
    (result) => {
      //  console.log(result);
    },
    (error) => {
       // console.error(error);
    }
);



Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


const persister = createSyncStoragePersister({
    storage: window.localStorage,
});


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            networkMode: 'online',
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
            staleTime: 2000,
            retry: 0,
        },
    },
    // configure global cache callbacks to show toast notifications
    mutationCache: new MutationCache({
        onSuccess: (data) => {
            //  toast.success(data.message);
        },
        onError: (error) => {
            // toast.error(error.message);
        },
    }),
});



const CustomFallback = (props: { error: Error, resetError: Function }) => (
    <View
              style={styles.errorBoundaryBackdrop}>

        <View

            style={styles.errorBoundaryContainer}>


            <Text style={styles.errorTitle}>Opps! sorry something unexpected happened!</Text>

            <Text style={styles.errorBody}>{props.error.toString()}</Text>

            <View style={{
                flexDirection: 'row',
            }}>
                <TouchableOpacity onPress={() => {
                    props.resetError()
                    queryClient.clear()
                    store.dispatch(logoutUser())
                }} style={styles.resetButton}>
                    <Text style={styles.buttonText}>
                        Restart app
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
)

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    const fcmToken = SecureStore.getItemAsync('fcmtoken');
    const [generatedToken, setGeneratedToken] = useState();
    const isDarkMode = useColorScheme() === 'dark';
 //  const navigation = useNavigation();
    const [firstLaunch, setFirstLaunch] = useState(true);
    const [loading, setLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState('Home');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseState, setResponseState] = useState(false);

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);

   // const notificationListener = useRef();
    const responseListener = useRef();



 /*   useEffect(  () => {
        //console.log('storage', fcmToken, 'newly generated', generatedToken);


    }, [fcmToken, generatedToken]);
*/


    useEffect(() => {
        const checkAppVersion = async () => {
            try {
                const latestVersion = Platform.OS === 'ios'? await fetch(`https://itunes.apple.com/in/lookup?bundleId=com.gatewaymobile.app`)
                        .then(r => r.json())
                        .then((res) => { return res?.results[0]?.version })
                    : await VersionCheck.getLatestVersion({
                        provider: 'playStore',
                        packageName: 'com.gatewaymobile.app',
                        ignoreErrors: true,
                    });
            const urlGoogle = await VersionCheck.getPlayStoreUrl({ appID: 'com.gatewaymobile.app' })
            const urlApple = await VersionCheck.getAppStoreUrl({ appID: 'com.gatewaymobile.app' })

                const currentVersion = VersionCheck.getCurrentVersion();

                if (latestVersion > currentVersion) {
                    Alert.alert(
                        'Update Required',
                        'A new version of the app is available. Please update to continue using the app.',
                        [
                            {
                                text: 'Update Now',
                                onPress: () => {
                                    Linking.openURL(
                                        Platform.OS === 'ios'
                                            ? urlApple
                                            : urlGoogle
                                    );
                                },
                            },
                        ],
                        { cancelable: false }
                    );
                } else {
                    // App is up-to-date; proceed with the app
                }
            } catch (error) {
                // Handle error while checking app version
                console.error('Error checking app version:', error);
            }
        };

        checkAppVersion();
    }, []);


    useEffect(() => {
        const fetchToken = async () => {
            const token = await getFcmToken();
            const BearerToken = await SecureStore.getItemAsync('Gateway-Token');
            if (token) {
                setGeneratedToken(token);
               let timeoutId: NodeJS.Timeout
               const body = JSON.stringify({
                   pushNotificationToken:token ,
               })
               const myHeaders = {
                   'Content-Type': 'application/json',
                   'x-access-token': ACCESS_TOKEN,
                   'Authorization': `Bearer ${BearerToken}`
               }
               const requestOptions = {
                   method: 'POST',
                   headers: myHeaders,
                   body: body,
               };
               const promise = Promise.race([
                   fetch(`${BASE_URL_LIVE}/preferences/update`, requestOptions)
                       .then(response => response.json()),
                   new Promise((resolve, reject) => {
                       //  clearTimeout(timeoutId)
                       timeoutId = setTimeout(() => reject(new Error('Timeout')), 20000)
                   }).then(() => {
                       clearTimeout(timeoutId)
                   })

               ])


            }
        };

        const fetchTokenByLocal = async () => {
            await getFcmTokenFromLocalStorage();
        };
        void fetchToken();
        void fetchTokenByLocal();
        void requestUserPermission();
        void notificationListener();
    }, []);


   /* useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);
*/










    useEffect(() => {
        AsyncStorage.getItem("gateway_user_first_time")
            .then((value) => {

                if (value === null) {
                    setFirstLaunch(true);
                } else if (value == 'false') {

                    setFirstLaunch(false);
                }
            })
            .catch((err) => {
                //   console.log("Error @brace_user_first_time: ", err);
            });
    }, []);
    const skip = async () => {
        await AsyncStorage.setItem('gateway_user_first_time', 'false');
        setFirstLaunch(false)

    }

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <ErrorBoundary FallbackComponent={CustomFallback}>


            <SafeAreaProvider>
                {
                    firstLaunch ?

                        <OnBoarding skip={skip}/>
                        :

                        <Provider store={store}>
                            {/*@ts-ignore*/}
                            <GestureHandlerRootView style={{flex: 1, }}>
                            <PersistGate loading={null} persistor={persistor}>
                                <PersistQueryClientProvider
                                    client={queryClient}
                                    persistOptions={{persister}}
                                    onSuccess={() => {
                                        // resume mutations after initial restore from localStorage was successful
                                        queryClient.resumePausedMutations().then(() => {
                                            queryClient.invalidateQueries();
                                        });
                                    }}
                                >
                                    <QueryClientProvider client={queryClient}>
                                        <PortalProvider>


                                            <Navigation colorScheme={colorScheme}/>
                                        </PortalProvider>
                                    </QueryClientProvider>
                                </PersistQueryClientProvider>
                            </PersistGate>
                            </GestureHandlerRootView>
                        </Provider>
                }
                <StatusBar/>
            </SafeAreaProvider>


            </ErrorBoundary>
        );
    }
}



async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}




const styles = StyleSheet.create({
    errorBoundaryContainer: {
        backgroundColor: "#fff",
        width: '95%',
        borderRadius: 20,
        marginBottom: 50,
        minHeight: heightPixel(240),
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 20,
    },
    errorTitle: {
        fontSize: fontPixel(16),
        color: Colors.errorRed,
        fontFamily: Fonts.quickSandBold
    },
    errorBody: {
        lineHeight: 18,
        fontSize: fontPixel(14),
        color: "#333",
        fontFamily: Fonts.quicksandMedium
    },
    errorBoundaryBackdrop: {
        padding: 10,
        position: 'absolute',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        zIndex: 10,
        backgroundColor: 'rgba(42,42,42,0.61)'
    },
    resetButton: {
        width: '45%',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary
    },
    buttonText: {
        fontSize: fontPixel(16),
        color: "#fff",
        fontFamily: Fonts.quickSandBold
    }
})
