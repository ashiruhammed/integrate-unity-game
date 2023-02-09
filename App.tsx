import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';
import {enableScreens} from "react-native-screens";
import 'react-native-gesture-handler';
import OnBoarding from "./src/screens/onboarding/OnBoarding";
import {useEffect, useState} from "react";

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

enableScreens()


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
    const [firstLaunch, setFirstLaunch] = useState(true);

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
