import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {UserModel} from "../models/userModel.js"
import { CategoryModel } from "../models/categoryModel.js";
import { AccountModel } from "../models/accountModel.js"; 
import "dotenv/config"
import { defaultCategories,defaultAccounts } from "../default.js"


export const register = async(req,res) => {
    const {username,password,email} = req.body;
    try{
        const exsisting_user = await UserModel.findOne({username})
        if (exsisting_user){
            return res.status(400).json({
                message: "User already exists. Try using another name.",
                error:true,
                user:exsisting_user
            })
        } else {
            const hashed_pass = await bcrypt.hash(password,10);
            const newUser = await UserModel.create({username,email,password:hashed_pass})

            const accountsWithuser = defaultAccounts.map(acc => ({
                userId: newUser._id,
                ...acc,
            }))

            await AccountModel.insertMany(accountsWithuser)

            const categoriesWithuser = defaultCategories.map(cate => ({
                userId: newUser._id,
                ...cate,
            }))

            await CategoryModel.insertMany(categoriesWithuser)

            res.status(201).json({
                message: "User created successfully.",
                result:newUser,
                error:false
            })
        }
    } catch (err){
        res.status(500).json({
            error : `Something went wrong during registration. Error: ${err}`
        })
    }
}


export const login = async (req,res) => {
    const {username,password} = req.body
    const exsisting_user = await UserModel.findOne({username});
    try{
        if (!exsisting_user){
            return res.status(400).json({
                message: "User not registered yet.",
            })
        } else {
            const validPassword = await bcrypt.compare(password, exsisting_user.password);
            if (!validPassword){
                return res.status(400).json({
                    message: "Invalid Credentials."
                })
            } else {
                const secret_code = process.env.SECRET_CODE
                const payload = {
                    username,
                    email:exsisting_user.email,
                }
                const jwtToken = jwt.sign(payload,secret_code, {expiresIn : "1d"})

                res.cookie("authToken", jwtToken, {
                    httpOnly: true,   
                    secure: false, 
                    sameSite: "none",
                    maxAge: 24 * 60 * 60 * 1000,//[ 1 day]
                }).json({
                    message: "Login Successfull.",
                }) 
            }
        }
    } catch (err){
        res.status(500).json({
            error: `Something went wrong during Authentication. Error: ${err}`
        })
    }
}

export const check = async(req,res) => {
    res.status(200).json({
        message: `User is authenticated`,
        success:true,
    })
}

export const logout = async(req,res) => {
    res.clearCookie("authToken",{
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure:process.env.NODE_ENV === "production",
    })

    res.status(200).json({
        message:  `User logged out`,
        success:true,
    })
}