import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {UserState} from "./userSlice";
import {array} from "yup";


let nextIndex = 0;
interface SubmissionProps {
    "questionId": string,
    "optionIds": string[]

}

interface SocialMediaProps {
    "name": string,
    "url": string
}

interface ProductStepsProps
{
    "index": number,
    "imageUrl": string
}


interface CountryProps{
    "name": string,
    "shortName": string,
    "countryCode": string
}


interface TaskInterface {
    index: number;
    id: string;
    type: 'error' | 'success' | 'info';
    body: string;
}


export interface DataState {
    notificationData: [TaskInterface],
    productDetails:
        {
            "name": string,
            "description": string,
            "websiteUrl": string,
            "ownerWorkedOnProject": boolean,
            "tagline": string,
            "googlePlayStoreUrl": string,
            "appleStoreUrl": string,
            "contributors": [],
            "isCountryLimited": boolean,
            "supportedCountries": CountryProps[],
            "productLogo": string,
            "launchDate": string,
            "categories": String[],
            "productSteps": ProductStepsProps[]
            "socialMedia":SocialMediaProps[];
        }

    theme: "light" | "dark",

    "submissions": SubmissionProps [

        ]
    currentCommunityId: string,
    currentCommunity: {
        ownerId: string,
        displayPhoto: string,
        visibility: "PUBLIC" | "PRIVATE"
    },
    adventure: {},
    missionId: string,
    missionName: string,
    missions: string,

    modules: []

}




const initialState: DataState = {
    theme: 'light',

    notificationData: [],
    productDetails: {
        name: "",
        description: "",
        websiteUrl: "",
        ownerWorkedOnProject: true,
        tagline: "",
        googlePlayStoreUrl: "",
        appleStoreUrl: "",
        contributors: [],
        isCountryLimited: true,
        supportedCountries: [],
        productLogo: "",
       launchDate: "",
        categories: [],
        productSteps: [],
        socialMedia: []
    },
    submissions: [
        //  { questionId:'', optionIds:[""]}

    ],
    currentCommunityId: '',
    currentCommunity: {
        ownerId: '',
        visibility: 'PUBLIC',
        displayPhoto: ''
    },
    adventure: {},
    missionId: '',
    missionName: '',
    missions: '',
    modules: []

}

export const dataSlice = createSlice({
    name: 'data',
    initialState,

    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme == 'light' ? 'dark' : 'light'

        },
        setAdventure: (state, action) => {
            state.adventure = action.payload.adventure


        },
        setCurrentCommunityId: (state, action) => {
            state.currentCommunityId = action.payload.id
            state.currentCommunity = action.payload.currentCommunity


        },
        updateProduct: (state, action: PayloadAction<Partial<DataState['productDetails']>>) => {
            state.productDetails = { ...state.productDetails, ...action.payload };
        },

        updateProductDetails: (state, action: PayloadAction<DataState['productDetails']>) => {
            state.productDetails = action.payload;
        },
        updateProductName: (state, action: PayloadAction<string>) => {
            state.productDetails.name = action.payload;
        },

        removeSingleNotification: (state, action) => {
            state.notificationData = state.notificationData.filter((item: {
                index: any;
            }) => item.index !== action.payload.index)
        },

        removeNotificationItem: (state, action) => {
            //  const { index,id } = action.payload.notification;
            const newData = state.notificationData.filter((item, index) => index !== action.payload.notification.index);

            state.notificationData = newData

        },

        clearNotification: (state) => {
            state.notificationData = []

        },
        addNotificationItem: (state, action) => {
            state.notificationData = [action.payload, ...state.notificationData,]
        },
        addProductStep: (state, action: PayloadAction<ProductStepsProps>) => {
            if (!state.productDetails.productSteps) {
                state.productDetails.productSteps = []; // Initialize productSteps if not already initialized
            }

            state.productDetails.productSteps.push({
                ...action.payload,
                index: nextIndex++
            });
        },

        UPDATE_SUBMISSIONS: (state, action) => {

            let idx = state.submissions.findIndex((game: {
                questionId: string
            }) => game.questionId === action.payload.questionId);

            if (idx >= 0) {
                state.submissions[idx] = action.payload;
            }

            //  console.log(idx)

        },
        clearProductInfo:(state,)=>{
            state.productDetails = {
                name: "",
                description: "",
                websiteUrl: "",
                ownerWorkedOnProject: true,
                tagline: "",
                googlePlayStoreUrl: "",
                appleStoreUrl: "",
                contributors: [],
                isCountryLimited: true,
                supportedCountries: [],
                productLogo: "",
                launchDate: "",
                categories: [],
                productSteps: [],
                socialMedia: []
            }


        },

        updateSubmissions: (state, action) => {

            //const newData = state.submissions.findIndex((game: { questionId: string }) => game.questionId === action.payload.questionId)
            const newData = state.submissions.findIndex((game: {
                questionId: string
            }) => game.questionId === action.payload.questionId)
//console.log(state.submissions[newData])

            if (newData >= 0) {
                state.submissions[newData] = action.payload;

                // state.submissions = [...state.submissions, {...action.payload}]
            } else {
                state.submissions = [...state.submissions, {...action.payload}]
            }

            //    state.submissions = [...state.submissions, {...action.payload}]


            //console.log(action.payload.questionId)
        },
        clearSubmissions: (state) => {
            state.submissions = []
        },
        cleanData: () => initialState

    },
})

// Action creators are generated for each case reducer function
export const {
    clearProductInfo,
    updateProduct,
    toggleTheme, setCurrentCommunityId,
    cleanData,
    setAdventure,
    UPDATE_SUBMISSIONS,
    updateSubmissions,
    clearSubmissions,
    updateProductDetails,
    addProductStep,
    removeSingleNotification,
    removeNotificationItem,
    clearNotification,
    addNotificationItem
} = dataSlice.actions

export default dataSlice.reducer
