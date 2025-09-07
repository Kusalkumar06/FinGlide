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

        activeCategoryTab: "Expense",

        searchTransaction:'',

        activeReportsTab: 'OVERVIEW',

        budgetList: [],
        categoryList: [],
        accountList: [],
        transactionList:[],

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
        },

        setReportsTab:(state,data) => {
            state.activeReportsTab = data.payload;
        },

        setBudgetList:(state,data) => {
            state.budgetList = data.payload;
        },
        setCategoryList:(state,data) => {
            state.categoryList = data.payload;
        },
        setAccountList:(state,data) => {
            state.accountList = data.payload;
        },
        setTransactionList:(state,data) => {
            state.transactionList = data.payload;
        }
    },
})

export default slice