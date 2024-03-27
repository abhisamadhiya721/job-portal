import mongoose from "mongoose"

mongoose.set("strictQuery", false)
export const dbConnection = async()=>{
    await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("MongoDB Connected Successfully")
    }).catch((error)=>{
        console.log(error);
    })
}