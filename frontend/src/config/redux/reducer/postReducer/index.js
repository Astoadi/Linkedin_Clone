import { createSlice } from "@reduxjs/toolkit"
import { createPost, getAllComments, get_all_posts, increasePostLikes } from "../../action/postAction"

const initialState={
    posts:[],
    isError:false,
    postFetched:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    comments:[],
    postId:"",
}

const postSlice=createSlice({
    name:"post",
    initialState,
    reducers:{
        reset:()=>initialState,
        emptyMessage:(state)=>{
            state.message={
                message:""
            };
        },
        resetPostId:(state)=>{
            state.postId="";
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(get_all_posts.pending,(state,action)=>{
            state.isLoading=true;
            state.message={
                message:"Fetching posts"
            };
        })
        .addCase(get_all_posts.rejected,(state,action)=>{
            state.isLoading=false;
            state.message=action.payload;
            state.isError=true;
        })
        .addCase(get_all_posts.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.message="Post Fetched";
            state.isError=false;
            state.postFetched=true;
            state.posts=action.payload.posts.reverse();
        })
        .addCase(getAllComments.fulfilled,(state,action)=>{
            state.postId=action.payload.post_id;
            state.comments=action.payload.comments;
        })
    }
});

export default postSlice.reducer;
export const {reset,emptyMessage,resetPostId}=postSlice.actions;