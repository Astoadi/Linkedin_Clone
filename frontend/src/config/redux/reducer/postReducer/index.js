import { createSlice } from '@reduxjs/toolkit';
import { getAllComments, get_all_posts } from '../../action/postAction';

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  message: '',
  comments: [],
  postId: '',
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    reset: () => initialState,
    emptyMessage: (state) => {
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_all_posts.pending, (state) => {
        state.isLoading = true;
        state.message = 'Fetching posts';
      })
      .addCase(get_all_posts.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.isError = true;
      })
      .addCase(get_all_posts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = 'Post Fetched';
        state.isError = false;
        state.postFetched = true;
        const list = Array.isArray(action.payload?.posts) ? action.payload.posts : [];
        state.posts = [...list].reverse();
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.postId = action.payload.post_id;
        state.comments = Array.isArray(action.payload.comments) ? action.payload.comments : [];
      });
  },
});

export default postSlice.reducer;
export const { reset, emptyMessage } = postSlice.actions;
