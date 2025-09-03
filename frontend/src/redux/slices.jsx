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
        registerErr: true,

        activeCategoryTab: "EXPENSE",

        searchTransaction:'',
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

        toggleCategoryTab:(state,data) => {
            state.activeCategoryTab = data.payload;
        },

        setSearchTransaction:(state,data) => {
            state.searchTransaction = data.payload
        }
    },
})

export default slice