import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchArticle = createAsyncThunk('ticket/fetchTicket', async (id, { rejectWithValue }) => {
  try {
    let res = await fetch(`https://blog.kata.academy/api/articles/${id}`);
    if (!res.ok) {
      throw new Error('Невозможно загрузить данные');
    }
    res = await res.json();
    return res;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const articleSlice = createSlice({
  name: 'article',
  initialState: {
    status: null,
    error: null,
    article: null,
  },
  reducers: {},
  extraReducers: {
    [fetchArticle.pending]: (state) => {
      state.status = 'loading';
      state.error = false;
    },
    [fetchArticle.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.article = action.payload.article;
      state.error = false;
    },
    [fetchArticle.rejected]: (state, action) => {
      state.status = 'rejected';
      state.status = action.payload;
      state.error = true;
    },
  },
});

export default articleSlice.reducer;
