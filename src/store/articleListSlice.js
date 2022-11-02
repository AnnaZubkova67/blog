import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchArticleList = createAsyncThunk(
  'articleList/fetchArticleList',
  async (pagIndex, { rejectWithValue }) => {
    try {
      let res = await fetch(`https://blog.kata.academy/api/articles?limit=20&offset=${(pagIndex - 1) * 20}`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${JSON.parse(localStorage.getItem('token'))}`,
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
      });
      if (!res.ok) {
        throw new Error('Невозможно загрузить данные');
      }
      res = await res.json();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const articleListSlice = createSlice({
  name: 'articleList',
  initialState: {
    status: '',
    error: false,
    idArticle: '',
    pagination: 1,
    articleList: [],
    articlesCount: 0,
  },
  reducers: {
    gettingID: (state, action) => {
      localStorage.setItem('idArticle', JSON.stringify(action.payload.id));
      state.idArticle = action.payload.id;
    },

    setPagination: (state, action) => {
      state.pagination = action.payload.index;
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

export const { gettingID, setPagination } = articleListSlice.actions;

export default articleListSlice.reducer;
