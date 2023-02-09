import {createSlice, PayloadAction} from '@reduxjs/toolkit'


export interface UserState {
    isAuthenticated: boolean;
    authenticated: boolean;
    userIsIn: boolean;
    responseState: boolean,
    responseMessage: string,
    responseType: 'error' | 'success' | 'none' | 'info',
    userToken: string,
    userData: {
        "id": string,
        "fullName": string,
        "username": null,
        "email": string,
        "phone": string,
        "avatar": string,
        "interests": [],
        "phoneNumberVerified": boolean
    },
    userDashboard: {
        "currentDayStreak": number,
        "totalPoint": string,
        "totalAccruedPoint": string,
        "joinedAt": string,
        "completedAdventures": number,
        "inProgressAdventures": number,
        "totalBadges": number,
        pointHistory: []
    }
}

const initialState: UserState = {
    isAuthenticated: false,
    authenticated: false,
    userIsIn: false,
    responseState: false,
    responseMessage: '',
    responseType: 'none',
    userToken: '',
    userDashboard: {
        currentDayStreak: 1,
        totalPoint: "0",
        totalAccruedPoint: "0",
        joinedAt: "",
        completedAdventures: 0,
        inProgressAdventures: 0,
        totalBadges: 0,
        pointHistory: []
    },
    userData: {
        id: "",
        fullName: "",
        username: null,
        email: "",
        phone: "",
        avatar: "",
        interests: [],
        phoneNumberVerified: false
    }


}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        increment: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes

        },
        decrement: (state) => {
            //  state.value -= 1
        },
        updateUserInfo: (state, action: PayloadAction<UserState['userData']>) => {
            state.userData = action.payload

        },
        updateUserDashboard: (state, action: PayloadAction<UserState['userDashboard']>) => {
            state.userDashboard = action.payload

        },

        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload.isAuthenticated
        },
        setUserToken: (state, action) => {
            state.userToken = action.payload.userToken

        },
        letUserIn: (state, action) => {
            state.userIsIn = action.payload.userIsIn
        },


        setResponse: (state, action) => {
            state.responseState = action.payload.responseState
            state.responseType = action.payload.responseType
            state.responseMessage = action.payload.responseMessage
        },
        unSetResponse: (state) => {
            state.responseState = false
            state.responseType = 'none'
            state.responseMessage = ''
        },
        logoutUser: () => {

            return initialState


        }

    },
})

// Action creators are generated for each case reducer function
export const {
    setUserToken,
    logoutUser,
    updateUserInfo,
    updateUserDashboard,
    letUserIn,
    unSetResponse,
    setResponse,
    setAuthenticated
} = userSlice.actions

export default userSlice.reducer
