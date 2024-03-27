import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Pleas provide your name"],
        minLength: [3, "Name must contain at least 3 character"],
        maxLength: [30, "Name cannot exceed 30 characters"]
    },
    email:{
        type:String,
        required: [true,"Pleas provide your Email"],
        validator: [validator.isEmail,"Please provide valid email"]
    },
    phone:{
        type: Number,
        required:[true,"Please provide your phone number"]
    },
    password:{
        type: String,
        required: [true,"Please provide your Password"],
        minLength: [8, "Name must contain at least 8 character"],
        maxLength: [32, "Name cannot exceed 32 characters"],
        select: false
    },
    role:{
        type:String,
        required: [true,"Pleasse provide your role"],
        enum: ["Job Seeker","Employer"]
    },
},{timestamps:true})

//Hashing
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10);
})

//Checking Pssword
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

//Generating JWT TOken
userSchema.methods.getJWTToken = function() {
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}


export const User = mongoose.model("User",userSchema)