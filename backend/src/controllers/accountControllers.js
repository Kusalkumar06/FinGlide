import { AccountModel } from "../models/accountModel.js"; 

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