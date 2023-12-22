import { createSlice } from "@reduxjs/toolkit";

export const slize = createSlice({
    name: 'slize',
    initialState: {
        authorized: false,
        newfile: 0
    },
    reducers: {
        callAuthorize: (state, action) => {
            state.authorized = action.payload
        },
        callNewfile: (state) => {
            state.newfile += 1
        }
    }
})

export const {
    callAuthorize,
    callNewfile
} = slize.actions

export default slize.reducer