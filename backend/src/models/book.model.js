import mongoose from "mongoose";
const bookSchema =new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required :true,
        index:true
    },
    author:{
        type:String,
        required:true,
        index:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,   
    },
    cover:{
        type:String,
    },
    file:{
        type:String,
        // required:true
    }     
},{timestamps:true});

export const Book = mongoose.model("Book",bookSchema);