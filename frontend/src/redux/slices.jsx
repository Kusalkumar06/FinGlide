import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "slice",
    initialState:{
        loginUsername: "",
        loginPassword: "",
        loginErr: true,

        registerName: "",
        registerEmail: "",
        registerPassword: "",
        registerErr: true
    },
    reducers:{
        loginusername: (state,data) => {
            state.loginUsername = data.payload;
        },
        loginpassword:(state,data) => {
            state.loginPassword = data.payload;
        },
        registername: (state,data) => {
            state.registerName = data.payload;
        },
        registeremail: (state,data) => {
            state.registerEmail = data.payload;
        },
        registerpassword:(state,data) => {
            state.registerPassword = data.payload;
        },
    },
})

export default slice