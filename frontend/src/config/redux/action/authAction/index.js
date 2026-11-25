import { clientServer, getApiError } from '@/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'user/login',
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post('/login', {
        email: user.email,
        password: user.password,
      });

      if (!response.data?.token) {
        return thunkAPI.rejectWithValue({ message: 'Token not provided' });
      }

      localStorage.setItem('token', response.data.token);
      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to sign in'));
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post('/register', {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to register'));
    }
  }
);

export const getAboutUser = createAsyncThunk(
  'user/getAboutUser',
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get('/get_user_and_proflie', {
        params: { token: user.token },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to load profile'));
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'user/getAllUser',
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get('/user/get_all_users');
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to load users'));
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  'user/sendConnectionRequest',
  async (connectionData, thunkAPI) => {
    try {
      const response = await clientServer.post('/user/send_connection_request', {
        token: connectionData.token,
        connectionId: connectionData.user_id,
      });
      thunkAPI.dispatch(getConnectionsRequest({ token: connectionData.token }));
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to send request'));
    }
  }
);

export const getConnectionsRequest = createAsyncThunk(
  'user/getConnectionsRequest',
  async (connectionData, thunkAPI) => {
    try {
      const response = await clientServer.get('/user/getConnectionRequests', {
        params: { token: connectionData.token },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to load connections'));
    }
  }
);

export const getMyConnectionRequests = createAsyncThunk(
  'user/getMyConnectionRequest',
  async (connectionData, thunkAPI) => {
    try {
      const response = await clientServer.get('/user/user_connection_request', {
        params: { token: connectionData.token },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to load connection requests'));
    }
  }
);

export const AcceptConnection = createAsyncThunk(
  'user/AcceptConnection',
  async (connectionData, thunkAPI) => {
    try {
      const response = await clientServer.post('/user/accept_connection_request', {
        token: connectionData.token,
        requestId: connectionData.requestId,
        action_type: connectionData.action_type,
      });
      thunkAPI.dispatch(getConnectionsRequest({ token: connectionData.token }));
      thunkAPI.dispatch(getMyConnectionRequests({ token: connectionData.token }));
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to accept request'));
    }
  }
);
