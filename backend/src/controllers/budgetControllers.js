import { BudgetModel } from "../models/budgetModel.js";
import { TransactionModel } from "../models/transactionModel.js";
import mongoose from "mongoose";

export const createBudget = async (req,res) => {
    try {
      const {categoryId, limit,period,icon,color} = req.body;

      const budget = await BudgetModel.create({
        userId: req.user.userId,
        categoryId,limit,period,icon,color
      })

      res.status(201).json({
        message: `Budget created successfully.`,
        budget: budget,
      })
    } catch(err){
      res.status(500).json({
        message: `Error during creating the budget ${err}.`,
      })
    }
}

export const getBudgets = async(req,res) => {
  try {
    const budgets = await BudgetModel.find({userId:req.user.userId}).populate("categoryId");

    const results = []

    for (const budget of budgets){

      const query = {
        userId: new mongoose.Types.ObjectId(req.user.userId),
        categoryId: new mongoose.Types.ObjectId(budget.categoryId._id),
        transactionType: "Expense",
      };

      if (budget.period === "weekly"){
        const now = new Date();
        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
        firstDayOfWeek.setHours(0, 0, 0, 0);

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 7);

        query.date = { $gte: firstDayOfWeek, $lt: lastDayOfWeek };
      } else if (budget.period === "monthly") {
        const start = new Date();
        start.setDate(1); // first day of current month
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        query.date = { $gte: start, $lt: end };
      }  else if (budget.period === "yearly") {
        const now = new Date();
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear() + 1, 0, 1);
        query.date = { $gte: start, $lt: end };
      }

      const spentAggre = await TransactionModel.aggregate([
        {$match : {
          ...query
        }},
        {$group : {_id:null , total: {$sum : "$amount"}}},
      ])
      // console.log(spentAggre)
      // console.log(query)

      const spent = spentAggre.length > 0 ? spentAggre[0].total : 0;

      if (spent === 0 ) continue;

      results.push({
        budgetId: budget._id,
        category: budget.categoryId.name,
        limit: budget.limit,
        spent,
        remaining: budget.limit - spent,
        progress: (spent / budget.limit) * 100,
      });
    }

    res.status(201).json({
      message: `Fetched all Budgets.`,
      Budgets : results,
    })
  } catch(err){
    res.status(500).json({
      message: `Error during fetching the budgets. ${err}`
    })
  }
}

export const updateBudget = async(req,res) => {
  try{
    const updateBudget = await BudgetModel.findOneAndUpdate({_id: req.params.id,userId: req.user.userId},req.body,{new:true})

    if(!updateBudget){
      return res.status(401).json({
        message : "Budget Not found to Update."
      })
    }

    res.status(201).json({
      message: `Budget updated successfully.`,
      updatedBudget: updateBudget,
    })
  } catch(err){
    res.status(500).json({
      message: `Error during updating the budget. ${err}`,
    })
  }
}

export const deleteBudget = async(req,res) => {
  try{
    const deleteBudget = await BudgetModel.findOneAndDelete({_id: req.params.id,userId: req.user.userId})

    if(!deleteBudget){
      return res.status(401).json({
        message : "Budget Not found to Delete."
      })
    }

    res.status(201).json({
      message: `Budget Deleted successfully.`,
      deletedBudget: deleteBudget,
    })
  } catch(err){
    res.status(500).json({
      message: `Error during deleting the budget. ${err}`,
    })
  }
}