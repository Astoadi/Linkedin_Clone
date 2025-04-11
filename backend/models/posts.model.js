import mongoose from "mongoose";
import Comment from "./comments.model.js";

const postSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    body:{
        type:String,
        required:true,
        trim:true,
    },
    // likes:{
    //     type:Number,
    //     default:0,
    // },
    likes: [{ //new change
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:[]
      }],
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    },
    media:{
        type:String,
        default:"",
    },
    mediaUrl:{
        type:String
    },
    active:{
        type:Boolean,
        default:true,
    },
    fileType:{
        type:String,
        default:"",
    },
});

postSchema.pre('deleteOne',async function(next){
    await Comment.deleteMany({postId:this.getQuery()._id});
    next();
});
//just in case
postSchema.pre('remove', async function(next) {
    await Comment.deleteMany({ postId: this._id });
    next();
});


const  Post=mongoose.model("Post",postSchema);
export default Post;