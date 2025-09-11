import { AccountModel } from "../models/accountModel.js"; 
import { TransactionModel } from "../models/transactionModel.js";
import mongoose from "mongoose";

export const createAccount = async(req,res) => {
  try{
    const {name ,accountType, balance, institution} = req.body;

    const exsisting_account = await AccountModel.findOne({name})

    if (exsisting_account){
        return res.status(400).json({
            message: "account name already exists. Try using another name.",
        })
    } else {
        const newAccount = await AccountModel.create({
        userId: req.user.userId,
        name, accountType, balance,institution
      });

      res.status(201).json({
        new_account : newAccount,
      })
    }
  } catch(err){
    res.status(500).json({
      message: `Error during creating the account ${err}`
    })
  }
}

export const getAccounts = async(req,res) => {
  try{
    const allAccounts = await AccountModel.find({userId: req.user.userId});

    res.status(200).json({
      accounts : allAccounts,
    });
  } catch(err){
    res.status(500).json({
      message: `Error during fetching the accounts ${err}`
    })
  }
}

export const updateAccount = async(req,res) => {
  try{
    const updatedAccount = await AccountModel.findOneAndUpdate({_id:req.params.id,userId:req.user.userId},req.body,{new:true});

    res.status(200).json({
      updatedAccount : updatedAccount
    })
  } catch(err){
    res.status(500).json({
      message: `Error during updating the account ${err}`
    })
  }
}

export const deleteAccount = async(req,res) => {
  try{
    const deletedAccount = await AccountModel.findOneAndDelete({_id:req.params.id, userId:req.user.userId})

    res.status(200).json({
      message : "Account deleted successfully."
    })
  } catch(err){
    res.status(500).json({
      message: `Error during deleting the account ${err}`
    })
  }
}

export const monthlySummary = async(req,res) => {
  try{
    const userId = new mongoose.Types.ObjectId(req.user.userId)
    const year = parseInt(req.query.year)
    console.log(userId,year)
    const accounts = await AccountModel.find({userId});
    if(!accounts){
      return res.status(400).json({
        message: `No account fetched during the fetching the accounts summary. summary: ${accounts}`
      })
    }

    const accountMap = {};
    accounts.forEach(account => {
      accountMap[account._id.toString()] = account.name;
    })

    const transactions = await TransactionModel.aggregate([
      {
        $match :{
          userId: userId,
          date: {
            $gte : new Date(`${year}-01-01`),
            $lte : new Date(`${year}-12-31`)
          }
        }
      },
      {
        $project: {
          month: {$month : "$date"},
          amount: 1,
          transactionType: 1,
          accountId: 1,
          fromAccountId: 1,
          toAccountId: 1,
        }
      }
    ])

    console.log(transactions)

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const summary = months.map((eachmonth) => {      
      let base = { month: eachmonth };
      accounts.forEach(acc => {
        base[acc.name] = 0;
      });
      return base;
    })
    const balances = {}
    accounts.forEach(acc => {
      balances[acc._id.toString()] = 0;
    })

    transactions.forEach(eachTransac => {
      const monthIndex = eachTransac.month - 1;
      if (eachTransac.transactionType === "Income" && eachTransac.accountId){
        balances[eachTransac.accountId.toString()] += eachTransac.amount; 
      } else if( eachTransac.transactionType === "Expense" && eachTransac.accountId) {
        balances[eachTransac.accountId.toString()] -= eachTransac.amount;
      } else if(eachTransac.transactionType === "Transfer" && eachTransac.fromAccountId && eachTransac.toAccountId) {
        balances[eachTransac.fromAccountId.toString()] -= eachTransac.amount;
        balances[eachTransac.toAccountId.toString()] += eachTransac.amount;
      }

      let namedBalances = {};
      Object.keys(balances).forEach(id => {
        namedBalances[accountMap[id]] = balances[id] 
      })

      summary[monthIndex] = {
        ...summary[monthIndex],
        ...namedBalances
      };
    })

    res.status(201).json({
      message: "Monthly accounts summary fetched successfully.",
      summary: summary,
    })
  } catch(err){
    res.status(500).json({
      message: `Error during fetching the account summary ${err}.`
    })
  }
}