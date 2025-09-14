import express from "express"
import cors from "cors"
import authRouter from "./routes/authRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import trasactionRouter from "./routes/transactionRoutes.js";
import budgetRouter from "./routes/budgetRoutes.js";
import cookieParser from "cookie-parser"

import "dotenv/config"

import { connectDB } from "./config/db.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173","https://finglide-gamma.vercel.app/"], 
  credentials: true,               
}));
app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5000
const URL = process.env.MONGO_URI

if (!URL){
    console.error("MONGO_URI is not defined in the .env file.")
    process.exit(1)
}


async function main(){
    try{
        await connectDB(URL);
        app.listen(PORT, () => {
            console.log(`Server is running in the http://localhost:${PORT}`)
        })
    } catch (err){
        console.error("Error Connecting to the DataBase.",err)
        process.exit(1);
    }
}

main()

app.use('/auth/', authRouter)

app.use('/account/',accountRouter)

app.use('/category/',categoryRouter)

app.use('/transaction/',trasactionRouter)

app.use('/budget/',budgetRouter)