/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import GroupSettings from "./src/screens/communities/GroupSettings";
import LeaveCommunity from "./src/screens/communities/LeaveCommunity";
import CommentOnPost from "./src/screens/communities/components/CommentOnPost";
import RequestsScreen from "./src/screens/communities/RequestsScreen";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {
        }
    }
}

export type RootStackParamList = {
    auth: NavigatorScreenParams<AuthStackParamList> | undefined;
    SeeCommunity: NavigatorScreenParams<CommunityStackParamList> | undefined;
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
    ConfirmPhonenumber: {
        phone:string
    }

    AdventureHome: undefined;
    VideoScreen: {
        lessonId?: string,
        adventureId?: string
    };
    QuizScreen: {
        lessonId: string,
        "nextModuleId"?: string,
        "hasNextLesson"?: false,
        "isLastAdventureModule"?: true,
        "isLastModuleLesson"?: false,
    };
    AllBadges: undefined;
    NFTs: undefined;
    DeleteAccount: undefined;
    Notifications: undefined;

    LeaveReview: {
        adventureId: string
    }

    PostScreen: {
        postId: string,
        communityId: string,
        post?: {
            "id": string,
            "communityId": null,
            "category": string,
            "authorId": string,
            "title": string,
            "content": string,
            "description": string,
            "thumbnailUrl": string,
            likes: number,
            commentCount: number,
            liked: boolean,
            "createdAt": string,
            "user": {
                "avatar": string,
                "fullName": string,
                "id": string,
                "username": null,
            },
        }
    }

      MakeAPost: {
        id: string,

    };
    LeaveCommunity: {
        id: string
    }
    BlockUser: {
        userId: string
    }
    FlagPost: {
        postId: string
    }
    BlockedUsers:undefined
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

export type CommunityStackParamList = {
    CommunityInfo: {
        id: string
    }
    GroupSettings: {
        id: string
    }


    CommentOnPost: {
        id: string,
        post: {}
    },

    ViewCommunity:undefined

    Followers: {
        id: string
    }
    RequestsScreen: {
        id: string
    }
};


export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, Screen>;


export type CommunityStackScreenProps<Screen extends keyof CommunityStackParamList> = NativeStackScreenProps<CommunityStackParamList, Screen>;



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
