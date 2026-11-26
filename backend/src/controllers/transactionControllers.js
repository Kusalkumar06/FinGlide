import { TransactionModel } from "../models/transactionModel.js";
import { AccountModel } from '../models/accountModel.js';
import { CategoryModel } from '../models/categoryModel.js';
import mongoose from "mongoose";

export const createTransaction = async(req,res) => {
  const session = await mongoose.startSession();
  try{
    const validatedData = req.validated?.body || req.body;
    const { transactionType, description, categoryId, accountId, fromAccountId, toAccountId, amount, notes, date } = validatedData;
    const userId = req.user.userId;

    // Verify ownership and category type of referenced account(s) and category
    if (transactionType === "Transfer") {
      const fromAcc = await AccountModel.findOne({ _id: fromAccountId, userId });
      const toAcc = await AccountModel.findOne({ _id: toAccountId, userId });
      if (!fromAcc || !toAcc) {
        return res.status(404).json({
          message: "One or both accounts not found or unauthorized",
        });
      }
    } else {
      const acc = await AccountModel.findOne({ _id: accountId, userId });
      if (!acc) {
        return res.status(404).json({
          message: "Account not found or unauthorized",
        });
      }
      const cat = await CategoryModel.findOne({ _id: categoryId, userId });
      if (!cat) {
        return res.status(404).json({
          message: "Category not found or unauthorized",
        });
      }
      if (cat.categoryType !== transactionType) {
        return res.status(400).json({
          message: `Category type mismatch: '${transactionType}' transaction requires an '${transactionType}' category, but found '${cat.categoryType}'`,
          code: "CATEGORY_TYPE_MISMATCH",
        });
      }
    }

    const transactionPayload = {
      userId,
      transactionType,
      description,
      categoryId: categoryId || null,
      accountId: accountId || null,
      fromAccountId: fromAccountId || null,
      toAccountId: toAccountId || null,
      amount,
      notes: notes || "",
    };
    if (date) {
      transactionPayload.date = date;
    }

    let createdTx;
    await session.withTransaction(async () => {
      const createdDocs = await TransactionModel.create([transactionPayload], { session });
      createdTx = createdDocs[0];

      if (transactionType === "Income") {
        await AccountModel.findOneAndUpdate(
          { _id: accountId, userId },
          { $inc: { balance: amount } },
          { session }
        );
      } else if (transactionType === "Expense") {
        await AccountModel.findOneAndUpdate(
          { _id: accountId, userId },
          { $inc: { balance: -amount } },
          { session }
        );
      } else if (transactionType === "Transfer") {
        await AccountModel.findOneAndUpdate(
          { _id: fromAccountId, userId },
          { $inc: { balance: -amount } },
          { session }
        );
        await AccountModel.findOneAndUpdate(
          { _id: toAccountId, userId },
          { $inc: { balance: amount } },
          { session }
        );
      }
    });

    const transactions = await TransactionModel.find({ userId })
      .populate("accountId fromAccountId toAccountId categoryId")
      .sort({ date: -1 });
    const accounts = await AccountModel.find({ userId });

    res.status(201).json({
      message: "Transaction created successfully",
      transactions,
      accounts,
    });
  } catch(err){
    res.status(500).json({
      message: "Error during creating the transaction",
      error: err.message,
    });
  } finally {
    session.endSession();
  }
};

export const getTransactions = async(req,res) => {
  try{
    const allTransactions = await TransactionModel.find({userId:req.user.userId}).populate("accountId fromAccountId toAccountId categoryId").sort({date: -1})

    res.status(201).json({
      message: "All Transactions fetched",
      transactions: allTransactions,
    })
  }catch(err){
    res.status(500).json({
      message: `Error during fetching the transactions ${err}`
    })
  }
}

export const updateTransaction = async(req,res) => {
  const session = await mongoose.startSession();
  try{
    const {id} = req.params;
    const userId = req.user.userId;

    const validatedData = req.validated?.body || req.body;
    const { transactionType, description, categoryId, accountId, fromAccountId, toAccountId, amount, notes, date } = validatedData;

    // 1. Verify ownership and category type of newly referenced account(s) and category
    if (transactionType === "Transfer") {
      const fromAcc = await AccountModel.findOne({ _id: fromAccountId, userId });
      const toAcc = await AccountModel.findOne({ _id: toAccountId, userId });
      if (!fromAcc || !toAcc) {
        return res.status(404).json({
          message: "One or both accounts not found or unauthorized",
        });
      }
    } else {
      const acc = await AccountModel.findOne({ _id: accountId, userId });
      if (!acc) {
        return res.status(404).json({
          message: "Account not found or unauthorized",
        });
      }
      const cat = await CategoryModel.findOne({ _id: categoryId, userId });
      if (!cat) {
        return res.status(404).json({
          message: "Category not found or unauthorized",
        });
      }
      if (cat.categoryType !== transactionType) {
        return res.status(400).json({
          message: `Category type mismatch: '${transactionType}' transaction requires an '${transactionType}' category, but found '${cat.categoryType}'`,
          code: "CATEGORY_TYPE_MISMATCH",
        });
      }
    }

    const updatePayload = {
      transactionType,
      description,
      categoryId: categoryId || null,
      accountId: accountId || null,
      fromAccountId: fromAccountId || null,
      toAccountId: toAccountId || null,
      amount,
      notes: notes || "",
    };
    if (date) {
      updatePayload.date = date;
    }

    let updateTrans;
    await session.withTransaction(async () => {
      // 2. Read the latest transaction inside the protected consistency boundary of the session
      const oldTran = await TransactionModel.findOne({ _id: id, userId }).session(session);
      if (!oldTran) {
        throw new Error("TRANSACTION_NOT_FOUND_IN_SESSION");
      }

      // 3. Atomically reverse old transaction balance impacts using the fresh oldTran state
      if (oldTran.transactionType === "Income") {
        await AccountModel.findOneAndUpdate(
          { _id: oldTran.accountId, userId },
          { $inc: { balance: -oldTran.amount } },
          { session }
        );
      } else if (oldTran.transactionType === "Expense") {
        await AccountModel.findOneAndUpdate(
          { _id: oldTran.accountId, userId },
          { $inc: { balance: oldTran.amount } },
          { session }
        );
      } else if (oldTran.transactionType === "Transfer") {
        await AccountModel.findOneAndUpdate(
          { _id: oldTran.fromAccountId, userId },
          { $inc: { balance: oldTran.amount } },
          { session }
        );
        await AccountModel.findOneAndUpdate(
          { _id: oldTran.toAccountId, userId },
          { $inc: { balance: -oldTran.amount } },
          { session }
        );
      }

      // 4. Conditionally update transaction matching its exact current version (__v) and increment __v
      // This guarantees optimistic concurrency: concurrent updates will either serialize with re-read on retry or detect version conflict
      const currentVersion = oldTran.__v ?? 0;
      updateTrans = await TransactionModel.findOneAndUpdate(
        { _id: id, userId, __v: currentVersion },
        { ...updatePayload, $inc: { __v: 1 } },
        { new: true, runValidators: true, session }
      );

      if (!updateTrans) {
        // Version mismatch or concurrent delete mid-transaction: trigger write conflict rollback
        throw new Error("CONCURRENT_TRANSACTION_MODIFIED");
      }

      // 5. Apply new transaction balance impacts within the same session
      if (updateTrans.transactionType === "Income") {
        await AccountModel.findOneAndUpdate(
          { _id: updateTrans.accountId, userId },
          { $inc: { balance: updateTrans.amount } },
          { session }
        );
      } else if (updateTrans.transactionType === "Expense") {
        await AccountModel.findOneAndUpdate(
          { _id: updateTrans.accountId, userId },
          { $inc: { balance: -updateTrans.amount } },
          { session }
        );
      } else if (updateTrans.transactionType === "Transfer") {
        await AccountModel.findOneAndUpdate(
          { _id: updateTrans.fromAccountId, userId },
          { $inc: { balance: -updateTrans.amount } },
          { session }
        );
        await AccountModel.findOneAndUpdate(
          { _id: updateTrans.toAccountId, userId },
          { $inc: { balance: updateTrans.amount } },
          { session }
        );
      }
    });

    res.status(200).json({
      message: "transaction updated",
      updatedTransaction: updateTrans,
    });
  } catch(err){
    if (err.message === "TRANSACTION_NOT_FOUND_IN_SESSION") {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }
    if (err.message === "CONCURRENT_TRANSACTION_MODIFIED") {
      return res.status(409).json({
        message: "Transaction was concurrently modified or deleted by another request. Please retry.",
        code: "CONCURRENT_MODIFICATION_CONFLICT",
      });
    }
    res.status(500).json({
      message: `Error during updating the transaction ${err}.`
    });
  } finally {
    session.endSession();
  }
}

export const deleteTransaction = async(req,res) => {
  const session = await mongoose.startSession();
  try{
    const {id} = req.params;
    const userId = req.user.userId;

    let oldTran;
    await session.withTransaction(async () => {
      oldTran = await TransactionModel.findOneAndDelete({_id: id, userId}, { session });

      if(!oldTran){
        throw new Error("TRANSACTION_NOT_FOUND_IN_SESSION");
      }

      if(oldTran.transactionType === "Income"){
        await AccountModel.findOneAndUpdate({_id: oldTran.accountId , userId},{$inc : {balance: -oldTran.amount}}, { session });
      } else if(oldTran.transactionType === "Expense"){
        await AccountModel.findOneAndUpdate({_id: oldTran.accountId, userId}, {$inc: {balance: oldTran.amount}}, { session });
      } else if(oldTran.transactionType === "Transfer"){
        await AccountModel.findOneAndUpdate({_id: oldTran.fromAccountId, userId}, {$inc: {balance: oldTran.amount}}, { session });
        await AccountModel.findOneAndUpdate({_id: oldTran.toAccountId , userId},{$inc : {balance: -oldTran.amount}}, { session });
      }
    });

    const transactions = await TransactionModel.find({ userId }).populate("accountId fromAccountId toAccountId categoryId").sort({date: -1});
    const accounts = await AccountModel.find({ userId });

    res.status(200).json({
      message: `Transaction deleted successfully.`,
      transactions,
      accounts,
    });
  } catch(err){
    if (err.message === "TRANSACTION_NOT_FOUND_IN_SESSION") {
      return res.status(404).json({
        message: `Transaction not found.`
      });
    }
    res.status(500).json({
      message: "Error during deleting the transaction",
      error: err.message,
    });
  } finally {
    session.endSession();
  }
}

export const yearlySummary = async(req,res) => {
  try{
    const userId = req.user.userId;
    const fullYear = new Date().getFullYear()

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const summary = months.map(month => ({
      month: month,
      income: 0,
      expense: 0,
      savings: 0
    }))

    const transactions = await TransactionModel.find({userId:userId,
      date:{
        $gte : new Date(`${fullYear}-01-01`),
        $lte : new Date(`${fullYear}-12-31`)
      }
    })

    transactions.forEach((eachTransac) => {
      const monthIndex = eachTransac.date.getMonth();
      if (eachTransac.transactionType  === "Income"){
        summary[monthIndex].income += eachTransac.amount
      } else if (eachTransac.transactionType === "Expense"){
        summary[monthIndex].expense += eachTransac.amount
      }
    })

    summary.forEach((eachMonth) => {
      eachMonth.savings = eachMonth.income - eachMonth.expense;
    })

    res.status(200).json({
      message: `Summary fetched Successfully.`,
      summary : summary
    })

  } catch(err){
    res.status(500).json({
      message: `Error during fetching the summary ${err}`
    })
  }
}

export const expVsincYearly = async(req,res) => {
  try{
    const userId = req.user.userId;
    const fullYear = new Date().getFullYear()

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const summary = months.map(month => ({
      month: month,
      income: 0,
      expense: 0,
    }))

    const transactions = await TransactionModel.find({userId:userId,
      date:{
        $gte : new Date(`${fullYear}-01-01`),
        $lte : new Date(`${fullYear}-12-31`)
      }
    })

    transactions.forEach((eachTransac) => {
      const monthIndex = eachTransac.date.getMonth();
      if (eachTransac.transactionType  === "Income"){
        summary[monthIndex].income += eachTransac.amount
      } else if (eachTransac.transactionType === "Expense"){
        summary[monthIndex].expense += eachTransac.amount
      }
    })

    res.status(200).json({
      message: `Summary fetched Successfully.`,
      summary : summary
    })

  } catch(err){
    res.status(500).json({
      message: `Error during fetching the summary ${err}`
    })
  }
}