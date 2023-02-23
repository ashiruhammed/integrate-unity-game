import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';
import {enableScreens} from "react-native-screens";
import 'react-native-gesture-handler';
import OnBoarding from "./src/screens/onboarding/OnBoarding";
import {useEffect, useRef, useState} from "react";
import * as Application from 'expo-application';
import {PermissionsAndroid} from 'react-native'
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
import {useNavigation} from "@react-navigation/native";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {
    getFcmToken,
    getFcmTokenFromLocalStorage,
    requestUserPermission,
    notificationListener,
} from './notification';
import { Settings } from 'react-native-fbsdk-next'
import {BASE_URL} from "./src/action/action";
Settings.initializeSDK();
Settings.setAppID('533333598894233');
enableScreens()

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
                   'Authorization': `Bearer ${BearerToken}`
               }
               const requestOptions = {
                   method: 'POST',
                   headers: myHeaders,
                   body: body,
               };
               const promise = Promise.race([
                   fetch(`${BASE_URL}/preferences/update`, requestOptions)
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
            <SafeAreaProvider>
                {
                    firstLaunch ?

                        <OnBoarding skip={skip}/>
                        :

                        <Provider store={store}>
                            {/*@ts-ignore*/}

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
                        </Provider>
                }
                <StatusBar/>
            </SafeAreaProvider>
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
