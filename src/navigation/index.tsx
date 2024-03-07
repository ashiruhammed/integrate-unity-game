/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {FontAwesome, FontAwesome5, Ionicons, Octicons} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {ColorSchemeName, Image, Pressable, View, StyleSheet} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

import {CommunityStackParamList, RootStackParamList, RootTabParamList, RootTabScreenProps} from '../../types';
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
import {StatusBar} from 'expo-status-bar';
import VideoScreen from "../screens/adventure/VideoScreen";
import ConfirmPhonenumber from "../screens/profile/ConfirmPhonenumber";
import MakeAPost from "../screens/communities/components/MakeAPost";
import PostScreen from "../screens/communities/PostScreen";
import Followers from "../screens/communities/Followers";
import CommunityInfo from "../screens/communities/CommunityInfo";
import LeaveReview from "../screens/adventure/LeaveReview";
import GroupSettings from "../screens/communities/GroupSettings";
import LeaveCommunity from "../screens/communities/LeaveCommunity";
import CommentOnPost from "../screens/communities/components/CommentOnPost";
import RequestsScreen from "../screens/communities/RequestsScreen";
import VideoTest from "../screens/VideoTest";
import {useRef} from "react";
import analytics from '@react-native-firebase/analytics';
import {
    createDrawerNavigator, DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
    DrawerContent,
} from '@react-navigation/drawer';
import {widthPixel} from "../helpers/normalize";
import {Icon} from "react-native-elements";
import DeleteAccount from "../screens/profile/DeleteAccount";
import BlockUser from "../screens/communities/components/BlockUser";
import FlagPost from "../screens/communities/components/FlagPost";
import BlockedUsers from "../screens/profile/BlockedUsers";
import CommentScreen from "../screens/communities/CommentScreen";
import ReplyComment from "../screens/communities/seeAll/ReplyComment";
import CreateAIAdventure from "../screens/learn/CreateAIAdventure";
import CreatingAdventure from "../screens/learn/CreatingAdventure";
import DiscoverProducts from "../screens/discover/DiscoverProducts";
import ProductView from "../screens/discover/ProductView";
import ProductInformation from "../screens/discover/create/ProductInformation";
import FundamentalData from "../screens/discover/create/FundamentalData";
import VisualRepresentation from "../screens/discover/create/VisualRepresentation";
import MoreInformation from "../screens/discover/create/MoreInformation";
import ViewPoints from "../screens/wallets/ViewPoints";

const styles = StyleSheet.create({
    displayPhoto: {
        height: widthPixel(100),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    photo: {
        height: '80%',
        width: '80%',
        resizeMode: 'contain'
    }

})
export default function Navigation({colorScheme}: { colorScheme: ColorSchemeName }) {
    const routeNameRef = useRef();
    const navigationRef = useRef();
    const data = useAppSelector(state => state.data)
    const {theme} = data
    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                routeNameRef.current = navigationRef.current.getCurrentRoute().name;
            }}
            onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navigationRef.current.getCurrentRoute().name;

                if (previousRouteName !== currentRouteName) {
                    await analytics().logScreenView({
                        screen_name: currentRouteName,
                        screen_class: currentRouteName,
                    });
                }
                routeNameRef.current = currentRouteName;
            }}
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
const CommunityStack = createNativeStackNavigator<CommunityStackParamList>();
const Drawer = createDrawerNavigator<CommunityStackParamList>();


function CustomDrawerContent(props) {
    const data = useAppSelector(state => state.data)
    const {currentCommunity, theme} = data
    const user = useAppSelector(state => state.user)
    const {userData} = user
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text

    const toggle = () => {
        props.navigation.closeDrawer()
        props.navigation.navigate('LeaveCommunity')

    }
    return (
        <DrawerContentScrollView contentContainerStyle={{}}  {...props}>
            <View style={styles.displayPhoto}>
                <Image
                    source={{uri: currentCommunity.displayPhoto}}
                    style={styles.photo}
                />
            </View>
            <DrawerItemList  {...props} />


            <DrawerItem label="LeaveCommunity"

                        icon={() => (<Octicons name="sign-out" size={18} color={Colors.primaryColor}/>)}

                        onPress={toggle}/>


        </DrawerContentScrollView>
    );
}

function CommunityMenu() {

    const user = useAppSelector(state => state.user)
    const {userData} = user

    const data = useAppSelector(state => state.data)
    const {currentCommunity, theme} = data
    const textColor = theme == 'light' ? Colors.light.text : Colors.dark.text
    return (

        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}

            screenOptions={{headerShown: false, drawerActiveBackgroundColor: Colors.primaryColor}}>
            <Drawer.Screen name="ViewCommunity" options={{
                title: 'Home', drawerIcon: ({focused, size}) => (
                    <Icon
                        name="home"
                        size={18}
                        color={focused ? Colors.primaryColor : 'black'}
                    />
                ),
                drawerActiveTintColor: Colors.primaryColor,
                drawerActiveBackgroundColor: Colors.tintColor
            }} component={ViewCommunity}/>


            <Drawer.Screen name="Followers"
                           options={{
                               drawerIcon: ({size}) => (
                                   <FontAwesome5 name="users" size={16} color={textColor}/>
                               ),
                               drawerActiveTintColor: Colors.primaryColor,
                               drawerActiveBackgroundColor: Colors.tintColor

                           }} component={Followers}/>


            {
                currentCommunity.ownerId == userData.id &&
                currentCommunity.visibility == 'PRIVATE' &&
                <Drawer.Screen name="RequestsScreen"

                               options={{
                                   title: 'Requests',
                                   drawerIcon: ({}) => (
                                       <Ionicons name="person-add" size={18} color={textColor}/>
                                   ),
                                   drawerActiveTintColor: Colors.primaryColor,
                                   drawerActiveBackgroundColor: Colors.tintColor

                               }}

                               component={RequestsScreen}/>
            }


            {
                currentCommunity.ownerId == userData.id
                &&
                <Drawer.Screen name="GroupSettings"

                               options={{
                                   title: 'GroupSettings',
                                   drawerIcon: ({}) => (
                                       <FontAwesome name="cog" size={18} color={textColor}/>
                                   ),
                                   drawerActiveTintColor: Colors.primaryColor,
                                   drawerActiveBackgroundColor: Colors.tintColor

                               }}

                               component={GroupSettings}/>
            }


            <Drawer.Screen name="CommunityInfo"


                           options={{
                               title: 'About',

                               drawerIcon: ({}) => (
                                   <Ionicons name="information-circle" size={18} color={textColor}/>
                               ),
                               drawerActiveTintColor: Colors.primaryColor,
                               drawerActiveBackgroundColor: Colors.tintColor

                           }} component={CommunityInfo}/>
        </Drawer.Navigator>

    );
}


function RootNavigator() {
    const user = useAppSelector(state => state.user)
    const {isAuthenticated, authenticated, userData} = user

    const data = useAppSelector(state => state.data)
    const {currentCommunity, theme} = data

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
                        <Stack.Screen name="BlockedUsers" component={BlockedUsers}/>

                        <Stack.Screen name="Wallet" component={Wallet}/>
                        <Stack.Screen name="Leaderboard" component={Leaderboard}/>
                        <Stack.Screen name="Badges" component={Badges}/>
                        <Stack.Screen name="Settings" component={Settings}/>
                        <Stack.Screen name="MyReferrals" component={MyReferrals}/>
                        <Stack.Screen name="ReferAFriend" component={ReferAFriend}/>

                    </Stack.Group>

                    <Stack.Group>


                        <Stack.Screen name="LeaveCommunity" options={{
                            animation: 'slide_from_left'
                        }} component={LeaveCommunity}/>

                    </Stack.Group>

                    <Stack.Group screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_left'
                    }}>

                        <Stack.Screen name="CreateCommunity" component={CreateCommunity}/>
                        <Stack.Screen name="ConfirmPhonenumber" component={ConfirmPhonenumber}/>
                        <Stack.Screen name="SeeCommunity" component={CommunityMenu}/>
                        <Stack.Screen name="MakeAPost" options={{
                            animation: 'slide_from_bottom'
                        }} component={MakeAPost}/>
                        <Stack.Screen name="ReplyComment" options={{
                            animation: 'slide_from_bottom'
                        }} component={ReplyComment}/>
                        <Stack.Screen name="CommentScreen" options={{
                            animation: 'slide_from_right'
                        }} component={CommentScreen}/>
                        <Stack.Screen name="BlockUser" options={{
                            animation: 'slide_from_bottom'
                        }} component={BlockUser}/>

                        <Stack.Screen name="PostScreen" options={{animation: 'slide_from_right'}}
                                      component={PostScreen}/>
                        <Stack.Screen name="FlagPost" options={{animation: 'slide_from_bottom'}}
                                      component={FlagPost}/>

                        <Stack.Screen name="CommentOnPost" options={{
                            animation: 'slide_from_bottom'
                        }} component={CommentOnPost}/>
                        {/*         <Stack.Screen name="GroupSettings" component={GroupSettings}/>
                        <Stack.Screen name="LeaveCommunity" component={LeaveCommunity}/>
*/}


                        <Stack.Screen name="LeaveReview" component={LeaveReview}/>
                        {/*   <Stack.Screen name="Followers" component={Followers}/>
                        <Stack.Screen name="RequestsScreen" component={RequestsScreen}/>
                        <Stack.Screen name="LeaveReview" component={LeaveReview}/>
                        <Stack.Screen name="CommunityInfo" component={CommunityInfo}/>*/}
                        <Stack.Screen name="AllCommunities" component={AllCommunities}/>
                        <Stack.Screen name="AdventureHome" component={AdventureHome}/>
                        <Stack.Screen name="VideoScreen" component={VideoScreen}/>
                        <Stack.Screen name="QuizScreen" component={QuizScreen}/>
                        <Stack.Screen name="AllBadges" component={AllBadges}/>
                        <Stack.Screen name="CreateAIAdventure" component={CreateAIAdventure}/>
                        <Stack.Screen name="CreatingAdventure" component={CreatingAdventure}/>
                        <Stack.Screen name="DiscoverProducts" component={DiscoverProducts}/>
                        <Stack.Screen name="ProductView" component={ProductView}/>
                        <Stack.Screen name="ProductInformation" component={ProductInformation}/>
                        <Stack.Screen name="FundamentalData" component={FundamentalData}/>
                        <Stack.Screen name="VisualRepresentation" component={VisualRepresentation}/>
                        <Stack.Screen name="MoreInformation" component={MoreInformation}/>
                        <Stack.Screen name="ViewPoints" component={ViewPoints}/>


                        <Stack.Screen name="Notifications" options={{
                            animation: 'slide_from_bottom'
                        }} component={Notifications}/>
                        <Stack.Screen name="DeleteAccount" component={DeleteAccount}/>
                        <Stack.Screen name="NFTs" component={NFTs}/>
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
