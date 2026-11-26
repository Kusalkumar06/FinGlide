import { BudgetModel } from "../models/budgetModel.js";
import { TransactionModel } from "../models/transactionModel.js";
import { CategoryModel } from "../models/categoryModel.js";
import mongoose from "mongoose";

const buildBudgetsResponse = async(userId) => {
  const budgets = await BudgetModel.find({userId}).populate("categoryId");

    const results = []

    for (const budget of budgets){

      const query = {
        userId: new mongoose.Types.ObjectId(userId),
        categoryId: new mongoose.Types.ObjectId(budget.categoryId._id),
        transactionType: "Expense",
      };

      if (budget.period === "weekly"){
        const now = new Date();
        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); 
        firstDayOfWeek.setHours(0, 0, 0, 0);

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 7);

        query.date = { $gte: firstDayOfWeek, $lt: lastDayOfWeek };
      } else if (budget.period === "monthly") {
        const start = new Date();
        start.setDate(1); 
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        query.date = { $gte: start, $lt: end };
      }  else if (budget.period === "yearly") {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear() + 1, 0, 1);
        query.date = { $gte: start, $lt: end };
      }

      const spentAggre = await TransactionModel.aggregate([
        {$match : {
          ...query
        }},
        {$group : {_id:null , total: {$sum : "$amount"}}},
      ])

      const spent = spentAggre.length > 0 ? spentAggre[0].total : 0;

      results.push({
        budgetId: budget._id,
        category: budget.categoryId.name,
        categoryId: budget.categoryId._id,
        icon: budget.categoryId.icon,
        limit: budget.limit,
        spent,
        remaining: budget.limit - spent,
        progress: (spent / budget.limit) * 100,
        period: budget.period,
      });
    }

    return results;
}


export const createBudget = async (req,res) => {
    try {
      const validatedData = req.validated?.body || req.body;
      const { categoryId, limit, period } = validatedData;
      const userId = req.user.userId;

      // Verify category ownership and categoryType (must be Expense)
      const category = await CategoryModel.findOne({ _id: categoryId, userId });
      if (!category) {
        return res.status(404).json({
          message: "Category not found or unauthorized",
        });
      }
      if (category.categoryType !== "Expense") {
        return res.status(400).json({
          message: `Budget category must be an Expense category, but found '${category.categoryType}'`,
          code: "CATEGORY_TYPE_MISMATCH",
        });
      }

      const budget = await BudgetModel.create({
        userId,
        categoryId,
        limit,
        period,
      });

      const budgets = await buildBudgetsResponse(userId);

      res.status(201).json({
        message: `Budget created successfully.`,
        budgets,
      });
    } catch(err){
      res.status(500).json({
        message: "Error during creating the budget",
        error: err.message,
      });
    }
};


export const getBudgets = async(req,res) => {
  try {
    const userId = req.user.userId;
    const results = await buildBudgetsResponse(userId);

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
    const validatedData = req.validated?.body || req.body;
    const { categoryId, limit, period } = validatedData;
    const userId = req.user.userId;

    // Verify category ownership and categoryType (must be Expense)
    const category = await CategoryModel.findOne({ _id: categoryId, userId });
    if (!category) {
      return res.status(404).json({
        message: "Category not found or unauthorized",
      });
    }
    if (category.categoryType !== "Expense") {
      return res.status(400).json({
        message: `Budget category must be an Expense category, but found '${category.categoryType}'`,
        code: "CATEGORY_TYPE_MISMATCH",
      });
    }

    const updatePayload = { categoryId, limit, period };

    const updateBudget = await BudgetModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      updatePayload,
      { new: true, runValidators: true }
    );

    if(!updateBudget){
      return res.status(404).json({
        message : "Budget not found",
      });
    }

    res.status(200).json({
      message: `Budget updated successfully.`,
      updatedBudget: updateBudget,
    });
  } catch(err){
    res.status(500).json({
      message: `Error during updating the budget. ${err}`,
    });
  }
};

export const deleteBudget = async(req,res) => {
  try{
    const deleteBudget = await BudgetModel.findOneAndDelete({_id: req.params.id,userId: req.user.userId})
    const userId=req.user.userId
    if(!deleteBudget){
      return res.status(404).json({
        message : "Budget not found",
      });
    }

    const budgets = await buildBudgetsResponse(userId);

    res.status(200).json({
      message: `Budget Deleted successfully.`,
      budgets,
    });
  } catch(err){
    res.status(500).json({
      message: "Error during deleting the budget",
      error: err.message,
    });
  }
};

export const spendVsBudget = async(req,res) => {
  try{
    const userId = req.user.userId;
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year)

    const startDate = new Date(year,month-1,1);
    const endDate = new Date(year,month,0,23,59,59);

    const budgets = await BudgetModel.find({userId}).populate("categoryId")

    const transactions = await TransactionModel.find({
      userId: userId,
      transactionType : "Expense",
      date: {$gte: startDate, $lte: endDate},
    })

    const spentMap = {}
    transactions.forEach((eachTransac) => {
      const catId = eachTransac.categoryId.toString();
      if (!spentMap[catId])
        spentMap[catId] = 0
      spentMap[catId] += eachTransac.amount;
    })


    const results = budgets.map((budget) => ({
      categoryName: budget.categoryId.name,
      budget: budget.limit,
      spent: spentMap[budget.categoryId._id.toString()] || 0,
    }))

    res.status(200).json({
      message: `spendVsBudget data fetched Successfully.`,
      data: results,

    })
  } catch(err){
    res.status(500).json({
      message: `Error during fetching the spendVsBudget ${err}.`
    })
  }
}