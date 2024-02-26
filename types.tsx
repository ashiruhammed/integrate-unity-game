/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Games from "./src/screens/Home/Games";
import CreateAIAdventure from "./src/screens/learn/CreateAIAdventure";
import CreatingAdventure from "./src/screens/learn/CreatingAdventure";


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
    CreateAIAdventure: undefined;
    CreatingAdventure: {
        adventureTitle:string
    };
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
        phone: string
    }

    AdventureHome: undefined;
    VideoScreen: {
        currentLessonId: string,
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
    BlockedUsers: undefined
    CommentScreen: {
        comment: {
            "commentDislikesCount": number,
            "commentLikesCount": number,
            "commentRepliesCount": number,
            "content": string,
            "createdAt": string,
            "deletedAt": null,
            "id": string,
            "imageUrl": null,
            "isDeleted": boolean,
            "isEdited": boolean,
            "liked": boolean,
            "parentId": string,
            "postId": string,
            "updatedAt": string,
            "user": {
                "avatar": string,
                "fullName": string,
                "id": string,
                "username": string,
            },
            "userId": string,
        }
    }
    CommentOnPost: {
        id: string,
        post: {}
    },
    ReplyComment: {
        id: string,
        parentId: string,
        post: {},
    },

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




    ViewCommunity: undefined

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
   // Adventures: undefined;
    Learn: undefined;
    Games: undefined;

    Wallet: undefined;
    MarketPlace: undefined;
    Profile: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>>;
