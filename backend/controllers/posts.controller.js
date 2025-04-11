import Comment from '../models/comments.model.js';
import Post from '../models/posts.model.js';
import User from '../models/user.model.js';
export const activeCheck=async (req,res)=>{
    return res.status(200).json({message:"Running"});
}

export const createPost=async (req,res)=>{
    const {token}=req.body;
    try{
        const user=await User.findOne({token:token});
        if(!user) return res.status(404).json({message:"User not found"}); 
        const post=new Post({
            userId:user._id,
            body:req.body.body,
            media:req.file !=undefined?req.file.filename:"",
            mediaUrl:req.file!=undefined?req.file.path:"",
            fileType:req.file!=undefined?req.file.mimetype.split("/")[1]:""
        });
        await post.save();
        return res.status(200).json({message:"Post created"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getAllPosts=async (req,res)=>{
    try{
        const posts=await Post.find().populate("userId","name username email profilePicture profilePictureUrl");
        return res.json({posts:posts});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const deletePost=async (req,res)=>{
    const {token,postId}=req.body;
    try{
        const user=await User.findOne({token:token}).select("_id");
        if(!user) return res.status(500).json({message:"User not found"});
        const post=await Post.findOne({_id:postId});
        if(!post) return res.status(404).json({message:"Post not found"});
        if(user._id.toString()!==post.userId.toString()) return res.json({message:"Unauthorized"});
        await Post.deleteOne({_id:postId});
        return res.json({message:"Post Deleted"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const commentPost=async (req,res)=>{
    const {token,post_id,comment_body}=req.body;
    try{
        const user=await User.findOne({token:token}).select("_id");
        if(!user) return res.status(404).json({message:"User not found"});
        const post=await Post.findOne({_id:post_id});
        if(!post) return res.status(404).json({message:"Post not found"});
        const comment=new Comment({
            userId:user._id,
            postId:post_id,
            body:comment_body
        });
        await comment.save();
        return res.status(200).json({message:"Comment Created"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const get_comments_by_post=async (req,res)=>{
    const {post_id}=req.query;
    try{
        const post=await Post.findOne({_id:post_id});
        if(!post) return res.status(404).json({message:"Post not found"});
        //what ta has written return res.json({comments:post.comments}); and this what i have written
        const comments=await Comment.find({postId:post_id}).populate("userId","name username profilePictureUrl");
        return res.json({comments:comments.reverse()});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}


export const delete_comment_of_user=async (req,res)=>{
    const {token,comment_id}=req.body;
    try{
        const user=await User.findOne({token:token}).select("_id");
        if(!user) return res.status(404).json({message:"User not found"});
        const comment=await Comment.findOne({_id:comment_id});
        if(!comment) return res.status(404).json({message:"Comment not found"});
        if(user._id.toString()!==comment.userId.toString()) return res.json({message:"Unauthorized"});
        await Comment.deleteOne({_id:comment_id});
        return res.json({message:"Comment Deleted"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const increment_likes=async (req,res)=>{
    const {post_id,token}=req.body;
    try{
        const post=await Post.findOne({_id:post_id});
        if(!post) return res.status(404).json({message:"Post not found"});
        const user=await User.findOne({token:token}).select("_id");
        if(!user) return res.status(404).json({message:"User not found"});
       // post.likes=post.likes+1;
       let action='';
       if(!post.likes) post.likes=[];
       const likesAsString=post.likes.map(id=>id.toString());
       if(!likesAsString.includes(user._id.toString())){
        post.likes.push(user._id);
        action='Liked';
       }else{
        post.likes=post.likes.filter((id)=>id.toString()!==user._id.toString());
        action='Unliked';
       }
        await post.save();
        return res.json({message:`${action}`});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

// export const decrement_likes=async (req,res)=>{
//     const {post_id,user_id}=req.body;
//     try{
//         const post=await Post.findOne({_id:post_id});
//         if(!post) return res.status("Post not found");
//         const user=await User.findOne({token:token}).select("_id");
//         if(!user) return res.status(404).json({message:"User not found"});
//         //post.likes=post.likes-1;
//         post.likes=post.likes.filter((user)=>user!==user._id)
//         await post.save();
//         return res.json({message:"Likes Incremented"});
//     }catch(error){
//         return res.status(500).json({message:error.message});
//     }
// }