import { createSlice } from "@reduxjs/toolkit";

export const slize = createSlice({
    name: 'slize',
    initialState: {
        authorized: false, /* Authentication */
        userdata: null,
        newfile: 0, /* File upload */
        stranger: null, /* Socket id */
        voip: null, /* Audio & Video call */
        ice: null /* Received ice candidates */
    },
    reducers: {
        callAuthorize: (state, action) => {
            state.authorized = action.payload
        },
        callUserdata: (state, action) => {
            state.userdata = action.payload
        },
        callNewfile: (state) => {
            state.newfile += 1
        },
        callStranger: (state, action) => {
            state.stranger = action.payload
        },
        callVoip: (state, action) => {
            state.voip = action.payload
        },
        callIce: (state, action) => {
            state.ice = action.payload
        }
    }
})

export const {
    callAuthorize,
    callUserdata,
    callNewfile,
    callStranger,
    callVoip,
    callIce
} = slize.actions

export default slize.reducer