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
const barData = [
    {"month":"Jan","income":0,"expense":0},
    {"month":"Feb","income":0,"expense":0},
    {"month":"Mar","income":0,"expense":0},
    {"month":"Apr","income":0,"expense":0},
    {"month":"May","income":0,"expense":0},
    {"month":"Jun","income":0,"expense":0},
    {"month":"Jul","income":0,"expense":0},
    {"month":"Aug","income":0,"expense":0},
    {"month":"Sep","income":0,"expense":0},
    {"month":"Oct","income":0,"expense":0},
    {"month":"Nov","income":0,"expense":0},
    {"month":"Dec","income":0,"expense":0}
]

const slice = createSlice({
    name: "slice",
    initialState:{
      isUserLoggedIn:false,
      loginUsername: "",
      loginPassword: "",
      loginErr: false,

      registerName: "",
      registerEmail: "",
      registerPassword: "",
      registerErr: false,

      activeCategoryTab: "Expense",

      filterOptions: {
        searchTransaction: '',
        searchAccount: 'All',
        searchTransactionType: "All",
        searchCategory: "All"
      },
      pageNum: 1,


      activeReportsTab: 'OVERVIEW',

      budgetList: [],
      categoryList: [],
      accountList: [],
      transactionList:[],

      pieData : [],
      linedata: linedata,
      expVsInc: barData,
      areaData: [],

      speVsbudMonth: new Date().getMonth() +1,
      speVsbudYear: new Date().getFullYear(),
      spendVsBudgetData: [],

      isCategoryModalOpen: false,
      addCategoryForm:{
        name:"",
        categoryType:"Expense",
        icon: "home",
        description: ""
      },

      editCategory: null,
      editCategoryForm: {
        name: "",
        categoryType: "Expense",
        icon: "home",
        description: ""
      },

      isAccountModalOpen: false,
      addAccountForm:{
        name:"",
        accountType: "wallet",
        balance:0,
        accountNumber:"",
        institution: "",
        icon: "cash",
      },

      editAccount : null,
      editAccountForm:{
        name:"",
        accountType: "wallet",
        balance:0,
        accountNumber:"",
        institution: "",
        icon: "cash",
      },

      isTransactionModalOpen: false,
      addTransactionForm: {
        description:"",
        transactionType: "Expense",
        categoryId: "",
        accountId: "",
        fromAccountId: null,
        toAccountId: null,
        amount: 1,
        notes: "",
      },

      isBudgetModalOpen: false,
      addBudgetForm: {
        categoryId: "",
        limit: 0.00,
        period: "monthly",
      },
      addBudgetCategoryError: false,
    },
    reducers:{
      setIsUserLoggedIn: (state,data) => {
        state.isUserLoggedIn = data.payload;
      },
      loginusername: (state,data) => {
        state.loginUsername = data.payload;
      },
      loginpassword:(state,data) => {
        state.loginPassword = data.payload;
      },
      setLoginErr:(state) => {
        state.loginErr = !state.loginErr
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
      setRegisterErr:(state) => {
        state.registerErr = !state.registerErr;
      },

      toggleCategoryTab:(state,data) => {
        state.activeCategoryTab = data.payload;
      },

      setFilterOptionsField:(state,data) => {
        const {field,value} = data.payload;
        state.filterOptions[field] = value;
      },
      setFilterOptions:(state,data) => {
        state.filterOptions = data.payload;
      },
      setPageNum:(state,data) =>{
        state.pageNum = data.payload
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
      setexpVsInc: (state,data) => {
        state.expVsInc = data.payload;
      },
      setAreaData: (state,data) => {
        state.areaData = data.payload;
      },

      setspeVsBudMonth: (state,data) => {
        state.speVsbudMonth = data.payload;
      },
      setspeVsBudYear: (state,data) => {
        state.speVsbudMonth = data.payload;
      },
      setspendVsBudget: (state,data) => {
        state.spendVsBudgetData = data.payload;
      },

      setIsCategoryModalOpen: (state) => {
        state.isCategoryModalOpen = !state.isCategoryModalOpen;
      },
      setAddCategoryForm:(state,data) => {
        const {field,value} = data.payload;
        state.addCategoryForm[field] = value;
      },
      setEntireAddCategoryForm:(state,data) => {
        state.addCategoryForm = data.payload
      },
      
      setEditCategory: (state,data) => {
        state.editCategory = data.payload;
      },
      setEditCategoryForm:(state,data) => {
        const { field, value } = data.payload;
        state.editCategoryForm[field] = value;
      },
      setEntireEditCategoryForm:(state,data) => {
        state.editCategoryForm = data.payload
      },

      setIsAccountModalOpen: (state) => {
        state.isAccountModalOpen = !state.isAccountModalOpen;
      },
      setAddAccountForm: (state,data) => {
        const {field,value} = data.payload;
        state.addAccountForm[field] = value;
      },
      setEntireAddAccountForm: (state,data) => {
        state.addAccountForm = data.payload
      },

      setEditAccount: (state,data) => {
        state.editAccount = data.payload;
      },
      setEditAccountForm: (state,data) => {
        const {field,value} = data.payload;
        state.editAccountForm[field] = value;
      },
      setEntireEditAccountForm: (state,data) => {
        state.editAccountForm = data.payload;
      },

      setIsTransactionModalOpen: (state) => {
        state.isTransactionModalOpen = !state.isTransactionModalOpen;
      },
      setAddTransactionForm: (state,data) => {
        const {field,value} = data.payload;
        state.addTransactionForm[field] = value;
      },
      setEntireAddTransactionForm: (state,data) => {
        state.addTransactionForm = data.payload
      },

      setIsBudgetModalOpen: (state) => {
        state.isBudgetModalOpen = !state.isBudgetModalOpen;
      },
      setAddBudgetForm: (state,data) => {
        state.addBudgetForm = data.payload
      },
      setAddBudgetModalFormField: (state,data) => {
        const {field,value} = data.payload;
        state.addBudgetForm[field] = value;
      },
      setAddBudgetCategoryError: (state,data) => {
        state.addBudgetCategoryError = data.payload;
      },
    },
})

export default slice