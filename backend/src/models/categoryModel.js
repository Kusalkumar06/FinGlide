import mongoose from "mongoose";

const categoryModel = mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  categoryType:{
    type: String,
    enum: ["expense","income"],
    required: true
  },
  icon:{
    type: String,
    default: "💰",
  },
  color:{ 
    type: String,
    default: "#D96D38" 
  },
  description:{
    type: String 
  },
  createdAt:{
    type: Date,
    default: Date.now 
  }
})

export const CategoryModel = mongoose.model("Category",categoryModel)