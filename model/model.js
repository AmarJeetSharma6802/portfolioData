import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        index: true,
        lowercase: true,

    },
    email: {
        type: String,
        required: true, 
        unique: true,
        index: true,
        lowercase: true,
    },
    phone:{
        type: String,
        required: true,
        unique: true,
        index: true,
    },
   message: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    }
},
{
    timestamps:true
}
)

export const portfolioData  = mongoose.model("portfolioData",userSchema) 