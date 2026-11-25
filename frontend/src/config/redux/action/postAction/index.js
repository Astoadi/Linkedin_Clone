import { clientServer, getApiError } from '@/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const get_all_posts = createAsyncThunk(
  'post/getAllPosts',
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get('/posts');
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to load posts'));
    }
  }
);

export const createPost = createAsyncThunk(
  'post/createPost',
  async ({ file, body }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('token', localStorage.getItem('token'));
      formData.append('body', body);
      if (file) {
        formData.append('media', file);
      }

      const response = await clientServer.post('/post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        return thunkAPI.fulfillWithValue('Post Uploaded');
      }
      return thunkAPI.rejectWithValue({ message: 'Post Not Uploaded' });
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to create post'));
    }
  }
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async ({ post_id }, thunkAPI) => {
    try {
      const response = await clientServer.delete('/delete_post', {
        data: {
          postId: post_id,
          token: localStorage.getItem('token'),
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to delete post'));
    }
  }
);

export const increasePostLikes = createAsyncThunk(
  'post/increasePostLikes',
  async ({ post_id }, thunkAPI) => {
    try {
      const response = await clientServer.post('/increment_post_like', {
        post_id,
        token: localStorage.getItem('token'),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to update like'));
    }
  }
);

export const getAllComments = createAsyncThunk(
  'post/getAllComments',
  async ({ post_id }, thunkAPI) => {
    try {
      const response = await clientServer.get('/get_comments', {
        params: { post_id },
      });
      return thunkAPI.fulfillWithValue({
        comments: response.data?.comments || [],
        post_id,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to load comments'));
    }
  }
);

export const postComment = createAsyncThunk(
  'post/postComment',
  async ({ post_id, body }, thunkAPI) => {
    try {
      const response = await clientServer.post('/comment', {
        token: localStorage.getItem('token'),
        post_id,
        comment_body: body,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getApiError(error, 'Failed to post comment'));
    }
  }
);
