import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import ConnectionRequest from "../models/connection.model.js";
import axios from 'axios';

const convertUserDataToPDF=async (userData)=>{
    const doc=new PDFDocument;
    const outputPath=crypto.randomBytes(32).toString("hex")+".pdf";
    const stream=fs.createWriteStream("uploads/"+outputPath);
    doc.pipe(stream);

    //new code
    try{
        const imageResponse=await axios.get(userData.userId.profilePictureUrl,{
            responseType:'arraybuffer'
        });
       // const imageBuffer=Buffer.from(imageResponse.data,'binary');
    

    doc.image(Buffer.from(imageResponse.data), {
        align: 'center',
        width:80
      });
    }catch(err){
        console.error(err.message);
    }
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.fontSize(14).text(`Name:${userData.userId.name}`).moveDown();
      doc.fontSize(14).text(`Username:${userData.userId.username}`).moveDown();
      doc.fontSize(14).text(`Email:${userData.userId.email}`).moveDown();
      doc.fontSize(14).text(`Bio:${userData.bio}`).moveDown();
      doc.fontSize(14).text(`Current Position:${userData.currentPosition}`).moveDown();
      doc.fontSize(14).text("Past Work:");
      userData.pastWork.forEach((work)=>{
        doc.fontSize(14).text(`Company Name:${work.company}`).moveDown();
        doc.fontSize(14).text(`Position:${work.position}`).moveDown();
        doc.fontSize(14).text(`Years:${work.years}`).moveDown();
      });
      doc.end();
      return outputPath;
}

export const register=async (req,res)=>{
    try{
        const {name,email,password,username}=req.body;
        if(!name || !email || !password || !username) return res.status(400).json({message:"All fields are required"});
        const user=await User.findOne({email});
        if(user) return res.status(400).json({message:"User Already Exists"});
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({
            name,
            email,
            password:hashedPassword,
            username,
        });
        await newUser.save();
        const profile=new Profile({
            userId:newUser._id,
        });
        await profile.save();

        return res.status(201).json({ message: "User Created", userId: newUser._id });
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password) return res.status(400).json({message:"All fields are required"});
        const user=await User.findOne({email});
        if(!user) return res.status(404).json({message:"User Not found"});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid Credentials"});
        const token=crypto.randomBytes(32).toString("hex");
        await User.updateOne({_id:user._id},{token});
        return res.status(200).json({token:token});
    }catch(error){
        return res.status(500).json({message:error.message});
    }

}

export const uploadProfilePicture=async (req,res)=>{
    const {token}=req.body;
    try{
        const user=await User.findOne({token:token});
        if(!user) return res.status(400).json({message:"User not found"});
        user.profilePicture=req.file.filename;
        user.profilePictureUrl=req.file.path;//new change
        await user.save();
        return res.json({message:"Profile Picture Updated"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const updateUserProfile=async (req,res)=>{
    try{
        const {token,...newUserData}=req.body;
        const user=await User.findOne({token:token});
        if(!user) return res.status(404).json({message:"User not found"});
        const {username,email}=newUserData;
        const existingUser=await User.findOne({$or:[{username},{email}]});
        if(existingUser){
            if(existingUser || String(existingUser.id)!==String(user._id)){
                return res.status(400).json({message:"User already exists"});
            }
        }
        Object.assign(user,newUserData);
        await user.save();
        return res.json({message:"User updated"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getUserAndProfile=async(req,res)=>{
    try{
        const {token}=req.query;
        const user=await User.findOne({token:token});
        if(!user) return res.status(404).json({message:"User not found"});
        const userProfile=await Profile.findOne({userId:user._id}).populate("userId","name email username profilePicture profilePictureUrl");
        return res.json({profile:userProfile});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const updateProfileData=async (req,res)=>{
    try{
        const {token,...newUserData}=req.body;
        const user=await User.findOne({token:token});
        if(!user) return res.status(404).json({message:"User not found"});
        const profile_to_update=await Profile.findOne({userId:user._id});
        Object.assign(profile_to_update,newUserData);
        await profile_to_update.save();
        return res.json({message:"Profile Updated"});

    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getAllUsers=async (req,res)=>{
    try{
        const allProfiles=await Profile.find().populate().populate("userId","name email username profilePicture profilePictureUrl");
        return res.json({profiles:allProfiles});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const downloadProfile=async (req,res)=>{
    const user_id=req.query.id;
    const userProfile=await Profile.findOne({userId:user_id}).populate("userId","name email username profilePicture profilePictureUrl");
    if(!userProfile) return res.status(404).json({message:"User Profile Not Found"});
    let a=await convertUserDataToPDF(userProfile);
    return res.json({message:a});
}

export const sendConnectionRequest=async (req,res)=>{ 
    const {token,connectionId}=req.body;
    try{
        const user=await User.findOne({token:token});
        if(!user) return res.status(404).json({message:"User not found"});
        const connectionUser=await User.findOne({_id:connectionId});
        if(!connectionUser) return res.json(404).json({message:"User not found"});
        const existingRequest=await ConnectionRequest.findOne({userId:user._id,connectionId:connectionUser._id});
        if(existingRequest) return res.json({message:"Request already sent"});
        const request=new ConnectionRequest({
            userId:user._id,
            connectionId:connectionUser._id
        });
        await request.save();
        return res.json({message:"Request sent"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getMyConnectionRequest=async (req,res)=>{ //maine kisko request bheji hai
    const {token}=req.query;
    try{
        const user=await User.findOne({token:token});
        if(!user) return res.json({message:"User not found"});
        const connections=await ConnectionRequest.find({userId:user._id})
        .populate("connectionId","name username email profilePicture profilePictureUrl");
        return res.json(connections);
    }catch(error){
        return res.staus(500).json({message:error.message});
    }
}

export const whatAreMyConnections=async (req,res)=>{
    const {token}=req.query;
    try{
        const user=await User.findOne({token:token});
        if(!user) return res.json({message:"User not found"});
        const connections=await ConnectionRequest.find({connectionId:user._id})
        .populate("userId","name username email profilePicture profilePictureUrl");
        return res.json(connections);
    }catch(error){
        return res.staus(500).json({message:error.message});
    }
}

export const acceptConnectionRequest=async (req,res)=>{
    const {token,requestId,action_type}=req.body;
    try{
        const user=await User.findOne({token:token});
        if(!user) return res.staus(404).json({message:"User not found"});
        const connection=await ConnectionRequest.findOne({_id:requestId});
        if(!connection) return res.status(404).json({message:"Connection not found"});
        if(action_type==="accept"){
            connection.status_accepted=true;
        }else{
            connection.status_accepted=false;
        }
        await connection.save();
        return res.json({message:"Request Updated"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const  getUserProfileBasedOnUsername=async (req,res)=>{
    const {username}=req.query;
    try{
        const user=await User.findOne({username:username});
        if(!user) return res.status(404).json({message:"User not found"});
        const userProfile=await Profile.findOne({userId:user._id}).populate("userId","name username email profilePicture profilePictureUrl");
        if(!userProfile) return res.status(404).json({message:'User Profile Not Found'});
        return res.json({userProfile:userProfile});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}