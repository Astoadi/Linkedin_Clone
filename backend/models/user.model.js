import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    active:{
        type:Boolean,
        default:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
        default:"default.jpg",
    },
    profilePictureUrl:{ //new change
        type:String,
        default:"https://res.cloudinary.com/dnoqhur9p/image/upload/v1743594439/userDefault_lbwjdv.jpg"
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    token:{
        type:String,
        default:"",
    }
});
const User=mongoose.model("User",userSchema);
export default User;