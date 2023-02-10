/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {FontAwesome} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {ColorSchemeName, Pressable} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

import {RootStackParamList, RootTabParamList, RootTabScreenProps} from '../../types';
import LinkingConfiguration from './LinkingConfiguration';
import OnBoardingScreen from "../screens/onboarding/OnBoarding";
import {AuthNavigator} from "./AuthNavigation";
import MyBottomTab from "./tabs/MyBottomTab";
import EditProfile from "../screens/profile/EditProfile";
import Wallet from "../screens/profile/Wallet";
import Leaderboard from "../screens/profile/Leaderboard";
import Badges from "../screens/profile/Badges";
import Settings from "../screens/profile/Settings";
import MyReferrals from "../screens/profile/MyReferrals";
import ReferAFriend from "../screens/profile/refAfriend/ReferAFriend";
import AllCommunities from "../screens/communities/seeAll/AllCommunitues";
import CreateCommunity from "../screens/communities/CreateCommunity";
import ViewCommunity from "../screens/communities/ViewCommunity";
import AdventureHome from "../screens/adventure/AdventureHome";
import QuizScreen from "../screens/adventure/QuizScreen";
import {useAppSelector} from "../app/hooks";
import AllBadges from "../screens/profile/badges/AllBadges";
import NFTs from "../screens/profile/badges/NFTs";
import Notifications from "../screens/Notifications";
import { StatusBar } from 'expo-status-bar';
import VideoScreen from "../screens/adventure/VideoScreen";
import ConfirmPhonenumber from "../screens/profile/ConfirmPhonenumber";
import MakeAPost from "../screens/communities/components/MakeAPost";
import PostScreen from "../screens/communities/PostScreen";
import Followers from "../screens/communities/Followers";
import CommunityInfo from "../screens/communities/CommunityInfo";
import LeaveReview from "../screens/adventure/LeaveReview";
import GroupSettings from "../screens/communities/GroupSettings";
import LeaveCommunity from "../screens/communities/LeaveCommunity";

export default function Navigation({colorScheme}: { colorScheme: ColorSchemeName }) {
  const data = useAppSelector(state => state.data)
    const {theme} = data
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
                    <StatusBar style={theme === 'dark' ? 'light' : 'dark'}/>
            <RootNavigator/>
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    const user = useAppSelector(state => state.user)
    const {isAuthenticated, authenticated} = user

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,

        }} initialRouteName={"auth"}>
            {
                !isAuthenticated &&

                <Stack.Screen options={{
                    headerShown: false
                }} name="auth" component={AuthNavigator}/>
            }
            {
                isAuthenticated &&
                <Stack.Group>
                    <Stack.Screen name="Dashboard" component={MyBottomTab}/>
                    <Stack.Group screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_right'
                    }}>
                        <Stack.Screen name="EditProfile" component={EditProfile}/>
                        <Stack.Screen name="Wallet" component={Wallet}/>
                        <Stack.Screen name="Leaderboard" component={Leaderboard}/>
                        <Stack.Screen name="Badges" component={Badges}/>
                        <Stack.Screen name="Settings" component={Settings}/>
                        <Stack.Screen name="MyReferrals" component={MyReferrals}/>
                        <Stack.Screen name="ReferAFriend" component={ReferAFriend}/>
                    </Stack.Group>
                    <Stack.Group screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_left'
                    }}>

                        <Stack.Screen name="CreateCommunity" component={CreateCommunity}/>
                        <Stack.Screen name="ConfirmPhonenumber" component={ConfirmPhonenumber}/>
                        <Stack.Screen name="ViewCommunity" component={ViewCommunity}/>
                        <Stack.Screen name="GroupSettings" component={GroupSettings}/>
                        <Stack.Screen name="LeaveCommunity" component={LeaveCommunity}/>
                        <Stack.Screen name="PostScreen" options={{
                        animation:'slide_from_right'
                        }} component={PostScreen}/>
                        <Stack.Screen name="Followers" component={Followers}/>
                        <Stack.Screen name="LeaveReview" component={LeaveReview}/>
                        <Stack.Screen name="CommunityInfo" component={CommunityInfo}/>
                        <Stack.Screen name="AllCommunities" component={AllCommunities}/>
                        <Stack.Screen name="AdventureHome" component={AdventureHome}/>
                        <Stack.Screen name="VideoScreen" component={VideoScreen}/>
                        <Stack.Screen name="QuizScreen" component={QuizScreen}/>
                        <Stack.Screen name="AllBadges" component={AllBadges}/>


                        <Stack.Screen name="Notifications" options={{
                              animation: 'slide_from_bottom'
                        }}  component={Notifications}/>
                        <Stack.Screen name="NFTs" component={NFTs}/>
                        <Stack.Screen name="MakeAPost" options={{
                            animation: 'slide_from_bottom'
                        }}  component={MakeAPost}/>

                    </Stack.Group>


                </Stack.Group>
            }
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
            <Stack.Group screenOptions={{presentation: 'modal'}}>
                <Stack.Screen name="Modal" component={ModalScreen}/>
            </Stack.Group>
        </Stack.Navigator>
    );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */


/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={30} style={{marginBottom: -3}} {...props} />;
}
