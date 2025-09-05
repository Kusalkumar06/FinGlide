import { CategoryModel } from "../models/categoryModel.js";

export const createCategory = async(req,res) => {
  try{
    const {name, categoryType, icon, color, description} = req.body;

    const exsisting_category = await CategoryModel.findOne({name})

    if (exsisting_category){
        return res.status(400).json({
            message: "category name already exists. Try using another name.",
        })
    } else {
        const newCategory = await CategoryModel.create({
        userId: req.user.userId,
        name, categoryType, icon, color, description
      });

      res.status(201).json({
        new_category : newCategory,
      })
    }
  } catch(err){
    res.status(500).json({
      message: `Error during creating the category ${err}`
    })
  }
}

export const getCategories = async(req,res) => {
  try{
    const allCategories = await CategoryModel.find({userId: req.user.userId});

    res.status(200).json({
      Categories : allCategories,
    });
  } catch(err){
    res.status(500).json({
      message: `Error during fetching the categories ${err}`
    })
  }
}

export const updateCategory = async(req,res) => {
  try{
    const updatedCategory = await CategoryModel.findOneAndUpdate({_id:req.params.id,userId:req.user.userId},req.body,{new:true});

    res.status(200).json({
      updatedCategory : updatedCategory
    })
  } catch(err){
    res.status(500).json({
      message: `Error during updating the category ${err}`
    })
  }
}

export const deleteCategory = async(req,res) => {
  try{
    const deletedCategory = await CategoryModel.findOneAndDelete({_id:req.params.id, userId:req.user.userId})

    res.status(200).json({
      message : "Category deleted successfully."
    })
  } catch(err){
    res.status(500).json({
      message: `Error during deleting the Category ${err}`
    })
  }
}