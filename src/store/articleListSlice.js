import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchArticleList = createAsyncThunk('ticket/fetchTicket', async (pagIndex, { rejectWithValue }) => {
  try {
    let res = await fetch(`https://blog.kata.academy/api/articles?limit=20&offset=${(pagIndex - 1) * 20}`);
    if (!res.ok) {
      throw new Error('Невозможно загрузить данные');
    }
    res = await res.json();
    return res;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const articleListSlice = createSlice({
  name: 'articleList',
  initialState: {
    status: null,
    error: null,
    idArticle: null,
    articleList: [],
    articlesCount: null,
  },
  reducers: {
    gettingID: (state, action) => {
      state.idArticle = action.payload.id;
    },
  },
  extraReducers: {
    [fetchArticleList.pending]: (state) => {
      state.status = 'loading';
      state.error = false;
    },
    [fetchArticleList.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.articleList = action.payload.articles;
      state.articlesCount = action.payload.articlesCount;
      state.error = false;
    },
    [fetchArticleList.rejected]: (state, action) => {
      state.status = 'rejected';
      state.status = action.payload;
      state.error = true;
    },
  },
});

export const { gettingID } = articleListSlice.actions;

export default articleListSlice.reducer;
