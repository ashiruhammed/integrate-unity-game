import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {UserState} from "./userSlice";
import {array} from "yup";


interface SubmissionProps {
 "questionId":string,
    "optionIds":string[]

}


export interface DataState {
    theme: "light" | "dark",

    "submissions":SubmissionProps [

    ]
    adventure:{},
    missionId: string,
    missionName: string,
    missions: string,

    modules:[]

}

const initialState: DataState = {
    theme: 'light',

    submissions: [
      //  { questionId:'', optionIds:[""]}
       
    ],
    adventure:{

    },
    missionId: '',
    missionName: '',
    missions: '',
    modules:[]

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
        UPDATE_SUBMISSIONS: (state, action) => {

                let idx = state.submissions.findIndex((game: { questionId: string }) => game.questionId === action.payload.questionId);

                if (idx >= 0) {
                    state.submissions[idx] = action.payload;
                }

              //  console.log(idx)

        },
        updateSubmissions: (state, action) => {

            //const newData = state.submissions.findIndex((game: { questionId: string }) => game.questionId === action.payload.questionId)
            const newData = state.submissions.findIndex((game: { questionId: string }) => game.questionId === action.payload.questionId)
//console.log(state.submissions[newData])

if (newData >= 0) {
   state.submissions[newData] = action.payload;

  // state.submissions = [...state.submissions, {...action.payload}]
}else{
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
    toggleTheme,
    cleanData,
    setAdventure,
    UPDATE_SUBMISSIONS,
    updateSubmissions,
    clearSubmissions
} = dataSlice.actions

export default dataSlice.reducer
