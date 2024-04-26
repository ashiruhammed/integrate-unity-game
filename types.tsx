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
import DiscoverProducts from "./src/screens/discover/DiscoverProducts";
import ProductView from "./src/screens/discover/ProductView";
import FundamentalData from "./src/screens/discover/create/FundamentalData";
import VisualRepresentation from "./src/screens/discover/create/VisualRepresentation";
import ViewPoints from "./src/screens/wallets/ViewPoints";
import ConcordiumTransactions from "./src/screens/wallets/ConcordiumTransactions";


interface OwnerProps {
    id: string;
    avatar: string;
    username: string;
    fullName: string;
}

interface CategoryProps {
    id: string;
    name: string;
    slug: string;
}

interface SocialMediaProps {
    name: string;
    url: string;
}

interface UpvoteProps {
    id: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    productId: string;
}


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
    BrowserView: {
        url:string
    };
    MyWallet: undefined;
    DiscoverProducts: undefined;
    ProductInformation: undefined;
    FundamentalData: undefined;
    ViewPoints: undefined;
    Concordium: undefined;
    GatewayToken: undefined;
    MoreInformation: undefined;
    VisualRepresentation: undefined;
    SearchUser: undefined;
    GateTokenTransactions: undefined;
    ConcordiumTransactions: undefined;
    ProductView: {
        item: {
            id: string;
            slug: string;
            name: string;
            description: string;
            websiteUrl: string;
            appleStoreUrl: string;
            googlePlayStoreUrl: string;
            ownerWorkedOnProject: boolean;
            tagline: string;
            ownerId: string;
            createdAt: string;
            isDeleted: boolean;
            updatedAt: string;
            deletedAt: string | null;
            isCountryLimited: boolean;
            productLogo: string;
            launchDate: string;
            status: string;
            supportedCountries: any[]; // Adjust the type as needed
            commentCount: number;
            owner: OwnerProps;
            contributors: any[]; // Adjust the type as needed
            categories: CategoryProps[];
            upvotes: UpvoteProps[];
            downvotes: any[]; // Adjust the type as needed
            socialMedia: SocialMediaProps[];
            _count: {
                contributors: number;
                upvotes: number;
                downvotes: number;
                comments: number;
            };
        }
    };
    MakeComment: {
        id:string
    };
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
