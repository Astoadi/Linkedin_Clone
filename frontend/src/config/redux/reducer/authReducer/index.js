import { createSlice } from '@reduxjs/toolkit';
import {
  loginUser,
  registerUser,
  getAboutUser,
  getAllUsers,
  getConnectionsRequest,
  getMyConnectionRequests,
} from '../../action/authAction';

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: '',
  isTokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  allUsers: [],
  allProfilesFetched: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: () => initialState,
    emptyMessage: (state) => {
      state.message = '';
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = 'Login is Successful';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = 'Registration is Successful, Please login';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAboutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.user = action.payload?.profile;
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = Boolean(action.payload?.profile);
        state.isSuccess = true;
      })
      .addCase(getAboutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.profileFetched = false;
        state.isSuccess = false;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = Array.isArray(action.payload?.profiles) ? action.payload.profiles : [];
        state.isLoading = false;
        state.isSuccess = true;
        state.allProfilesFetched = true;
        state.isError = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getConnectionsRequest.fulfilled, (state, action) => {
        state.connections = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getConnectionsRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequest = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getMyConnectionRequests.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});

export const { reset, emptyMessage, setTokenIsThere } = authSlice.actions;

export default authSlice.reducer;
