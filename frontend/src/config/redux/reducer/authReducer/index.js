import { accessedDynamicData } from "next/dist/server/app-render/dynamic-rendering";

const { createSlice } = require("@reduxjs/toolkit");
const { loginUser, registerUser, getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequests } = require("../../action/authAction");

const initialState={
    user:undefined,
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    isTokenThere:false,
    profileFetched:false,
    connections:[],
    connectionRequest:[],
    allUsers:[],
    allProfilesFetched:false
}
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:()=>initialState,
        handleLoginUser:(state)=>{
            state.message={
                message:"Hello"
            }
        },
        emptyMessage:(state)=>{
            state.message={
                message:""
            }
        },
        setTokenIsThere:(state)=>{
            state.isTokenThere=true;
        },
        setTokenIsNotThere:(state)=>{
            state.isTokenThere=false;
        }
    },
    extraReducers:((builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.isLoading=true;
            state.message={
                message:"Knocking the door..."
            };
        })
        .addCase(loginUser.fulfilled,(state)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.loggedIn=true;
            state.message={
                message:"Login is Successful"
            };
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
        })
        .addCase(registerUser.pending,(state,action)=>{
            state.isLoading=true;
            state.message={
                message:"Registering you..."
            };
        })
        .addCase(registerUser.fulfilled,(state)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.message={
                message:"Registration is Successful, Please login"
            };
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
        })
        .addCase(getAboutUser.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.user=action.payload.profile;
            state.isLoading=false;
            state.isError=false;
            state.profileFetched=true;
            state.isSuccess=true;
        })
        .addCase(getAboutUser.rejected,(state,action)=>{
            state.isError=true;
            state.message=action.payload;
            state.profileFetched=false;
            state.isSuccess=false;
        })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
            state.allUsers=action.payload.profiles;
            state.isLoading=false;
            state.isSuccess=true;
            state.allProfilesFetched=true;
            state.isError=false;
        })
        .addCase(getConnectionsRequest.fulfilled,(state,action)=>{
            state.connections=action.payload;
        })
        .addCase(getConnectionsRequest.rejected,(state,action)=>{
            state.message=action.payload;
        })
        .addCase(getMyConnectionRequests.fulfilled,(state,action)=>{
            state.connectionRequest=action.payload;
        })
        .addCase(getMyConnectionRequests.rejected,(state,action)=>{
            state.message=action.payload;
        })
    })
});

export const {reset,handleLoginUser,emptyMessage,setTokenIsThere,setTokenIsNotThere}=authSlice.actions;

export default authSlice.reducer;
