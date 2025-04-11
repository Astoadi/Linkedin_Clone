import { clientServer } from "@/config";

const { createAsyncThunk } = require("@reduxjs/toolkit");

export const loginUser=createAsyncThunk(
    "user/login",
    async (user,thunkAPI)=>{
        try{
            const response=await clientServer.post("/login",{
                email:user.email,
                password:user.password
            });

            if(response.data.token){
                localStorage.setItem("token",response.data.token);
            }else{
                return thunkAPI.rejectWithValue({message:"token not provided"});
            }

            return thunkAPI.fulfillWithValue(response.data.token);
            
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const registerUser=createAsyncThunk(
    "user/register",
    async (user,thunkAPI)=>{
        try{
            const request=await clientServer.post("/register",{
                username:user.username,
                password:user.password,
                email:user.email,
                name:user.name
            });
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAboutUser=createAsyncThunk(
    "user/getAboutUser",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.get('/get_user_and_proflie',{
                params:{
                    token:user.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const getAllUsers=createAsyncThunk(
    "user/getAllUser",
    async (_,thunkAPI)=>{
        try{
            const response=await clientServer.get('/user/get_all_users');
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const sendConnectionRequest=createAsyncThunk(
    'user/sendConnectionRequest',
    async (connectionData,thunkAPI)=>{
        try{
            const response=await clientServer.post('/user/send_connection_request',{
                token:connectionData.token,
                connectionId:connectionData.user_id
            });
            thunkAPI.dispatch(getConnectionsRequest({token:connectionData.token}));
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const getConnectionsRequest=createAsyncThunk(
    'user/getConnectionsRequest',
    async (connectionData,thunkAPI)=>{
        try{
            const response=await clientServer.get('/user/getConnectionRequests',{
                params:{
                    token:connectionData.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const getMyConnectionRequests=createAsyncThunk(
    'user/getMyConnectionRequest',
    async (connectionData,thunkAPI)=>{
        try{
            const response=await clientServer.get('/user/user_connection_request',{
                params:{
                    token:connectionData.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const AcceptConnection=createAsyncThunk(
    'user/AcceptConnection',
    async (connectionData,thunkAPI)=>{
        try{
            const response=await clientServer.post('/user/accept_connection_request',{
                token:connectionData.token,
                requestId:connectionData.requestId,
                action_type:connectionData.action_type
            });
            thunkAPI.dispatch(getConnectionsRequest({token:connectionData.token}));
            thunkAPI.dispatch(getMyConnectionRequests({token:connectionData.token}));
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)