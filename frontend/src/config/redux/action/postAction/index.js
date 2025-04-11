const { clientServer } = require("@/config");
const { createAsyncThunk } = require("@reduxjs/toolkit");

export const get_all_posts=createAsyncThunk(
    "post/getAllPosts",
    async (_,thunkAPI)=>{ // just putting here  anything because get all posts doesn't need anything
        try{
            const response=await clientServer.get('/posts');
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const createPost=createAsyncThunk(
    'post/createPost',
    async (userData,thunkAPI)=>{
        try{
            const {file,body}=userData;
            const formData=new FormData();
            formData.append('token',localStorage.getItem("token"));
            formData.append('body',body);
            formData.append('media',file);
            const response=await clientServer.post('/post',formData,{
                headers:{
                    "Content-Type":"multipart/form-data" //to tell multer to handle this way
                }
            });
            if(response.status===200) return thunkAPI.fulfillWithValue("Post Uploaded");
            else return thunkAPI.rejectWithValue("Post Not Uploaded");
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const deletePost=createAsyncThunk(
    'post/deletePost',
    async (post_id,thunkAPI)=>{
        try{
            const response=await clientServer.delete('/delete_post',{
                data:{
                    postId:post_id.post_id,
                    token:localStorage.getItem("token")
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const increasePostLikes=createAsyncThunk(
    'post/increasePostLikes',
    async (post_id,thunkAPI)=>{
        try{
            const response=await clientServer.post('/increment_post_like',{
                post_id:post_id.post_id,
                token:localStorage.getItem("token")
            });
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

// export const decrementPostLikes=createAsyncThunk(
//     'post/decreasePostLikes',
//     async (post_id,thunkAPI)=>{
//         try{
//             const response=await clientServer.post('/decrement_post_like',{
//                 post_id:post_id.post_id
//             });
//             return thunkAPI.fulfillWithValue(response.data);
//         }catch(error){
//             return thunkAPI.rejectWithValue(error.response.data);
//         }
//     }
// )

export const getAllComments=createAsyncThunk(
    'post/getAllComments',
    async (postData,thunkAPI)=>{
        try{
            const response=await clientServer.get('/get_comments',{
                params:{
                    post_id:postData.post_id
                }
            })
            return thunkAPI.fulfillWithValue({
                comments:response.data.comments,
                post_id:postData.post_id
            });
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const postComment=createAsyncThunk(
    'post/postComment',
    async (commentData,thunkAPI)=>{
        try{
            const response=await clientServer.post('/comment',{
                    token:localStorage.getItem("token"),
                    post_id:commentData.post_id,
                    comment_body:commentData.body
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)