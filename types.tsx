/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {
        }
    }
}

export type RootStackParamList = {
    auth: NavigatorScreenParams<AuthStackParamList> | undefined;
    Dashboard: NavigatorScreenParams<RootTabParamList> | undefined;
    EditProfile: undefined;
    Wallet: undefined;
    Leaderboard: undefined;
    Badges: undefined;
    Settings: undefined;
    MyReferrals: undefined;
    AllCommunities: undefined;
    ReferAFriend: undefined;
    Modal: undefined;
    OnBoardingScreen: undefined;
    CreateCommunity: undefined;
    ConfirmPhonenumber: undefined;
    ViewCommunity: {
        id:string
    };
    AdventureHome: undefined;
    VideoScreen: {
        lessonId?:string,
        adventureId?:string
    };
    QuizScreen: {
        lessonId:string,
        "nextModuleId"?: "f5ce3abf-8e61-4bd1-b992-9904a5219129",
        "hasNextLesson"?: false,
        "isLastAdventureModule"?: true,
        "isLastModuleLesson"?: false,
    };
    AllBadges: undefined;
    NFTs: undefined;
    Notifications: undefined;
    MakeAPost: {
        id:string
    };
    PostScreen:{
        postId:string,
        communityId:string
    }
    Followers:{
        id:string
    }
    LeaveReview:{
        adventureId:string
    }
    CommunityInfo:{
        id:string
    }
    NotFound: undefined;
};


export type AuthStackParamList = {
    RegisterScreen: undefined;
    PhoneNumberConfirm: {
        phoneNumber: string
    };
    EmailConfirm: {
        email: string
    };
    PasswordChange: {
        email: string
    };

    LoginNow: undefined;
    ForgotPassword: undefined;
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, Screen>;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList,
    Screen>;

export type RootTabParamList = {
    Home: undefined;
    Adventures: undefined;
    Community: undefined;
    MarketPlace: undefined;
    Profile: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>>;
