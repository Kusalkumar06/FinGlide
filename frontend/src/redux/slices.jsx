import { createSlice } from "@reduxjs/toolkit";

const linedata = [
    {"month":"Jan","income":0,"expense":0,"savings":0},
    {"month":"Feb","income":0,"expense":0,"savings":0},
    {"month":"Mar","income":0,"expense":0,"savings":0},
    {"month":"Apr","income":0,"expense":0,"savings":0},
    {"month":"May","income":0,"expense":0,"savings":0},
    {"month":"Jun","income":0,"expense":0,"savings":0},
    {"month":"Jul","income":0,"expense":0,"savings":0},
    {"month":"Aug","income":0,"expense":0,"savings":0},
    {"month":"Sep","income":0,"expense":0,"savings":0},
    {"month":"Oct","income":0,"expense":0,"savings":0},
    {"month":"Nov","income":0,"expense":0,"savings":0},
    {"month":"Dec","income":0,"expense":0,"savings":0}
]

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

        pieData : [],
        linedata: linedata,

        speVsbudMonth: new Date().getMonth() +1,
        speVsbudYear: new Date().getFullYear(),
        spendVsBudgetData: [],

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
        },

        setPieData: (state,data) => {
            state.pieData = data.payload;
        },
        setLineData: (state,data) => {
            state.linedata = data.payload;
        },

        setspeVsBudMonth: (state,data) => {
            state.speVsbudMonth = data.payload;
        },
        setspeVsBudYear: (state,data) => {
            state.speVsbudMonth = data.payload;
        },
        setspendVsBudget: (state,data) => {
            state.spendVsBudgetData = data.payload;
        }
    },
})

export default slice