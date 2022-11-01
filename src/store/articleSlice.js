import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchArticle = createAsyncThunk('article/fetchArticle', async (info, { rejectWithValue }) => {
  try {
    let res = await fetch(`https://blog.kata.academy/api/articles/${info.slug}`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${info.id}`,
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
});

export const postArticle = createAsyncThunk('article/postArticle', async (info, { rejectWithValue }) => {
  try {
    let res = await fetch('https://blog.kata.academy/api/articles', {
      method: 'POST',
      headers: {
        Authorization: `Token ${info.id}`,
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ article: info.body }),
    });
    if (!res.ok) {
      throw new Error('Невозможно загрузить данные');
    }
    res = await res.json();
    return res;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const putEditArticle = createAsyncThunk('article/putEditArticle', async (info, { rejectWithValue }) => {
  try {
    let res = await fetch(`https://blog.kata.academy/api/articles/${info.slug}`, {
      method: 'PUT',
      headers: {
        Authorization: `Token ${info.id}`,
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ article: info.body }),
    });
    if (!res.ok) {
      throw new Error('Невозможно загрузить данные');
    }
    res = await res.json();
    return res;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteArticle = createAsyncThunk('article/deleteArticle', async (info, { rejectWithValue }) => {
  try {
    let res = await fetch(`https://blog.kata.academy/api/articles/${info.slug}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${info.id}`,
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
});

export const postLike = createAsyncThunk('article/postLike', async (info, { rejectWithValue }) => {
  try {
    let res = await fetch(`https://blog.kata.academy/api/articles/${info.name}/favorite`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${info.id}`,
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
});

export const deleteLike = createAsyncThunk('article/deleteLike', async (info, { rejectWithValue }) => {
  try {
    let res = await fetch(`https://blog.kata.academy/api/articles/${info.name}/favorite`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${info.id}`,
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
});

const articleSlice = createSlice({
  name: 'article',
  initialState: {
    status: null,
    error: false,
    fullArticle: {},
    tagList: [],
    activeCreate: false,
  },
  reducers: {
    addTag: (state, action) => {
      state.tagList.push(action.payload.name);
    },
    deleteTag: (state, action) => {
      state.tagList = state.tagList.filter((elem) => elem !== action.payload.tag);
    },
    createArticle: (state, action) => {
      if (action.payload.event === 'create') {
        state.activeCreate = true;
        state.tagList = [];
      } else {
        state.activeCreate = false;
      }
    },
  },
  extraReducers: {
    [fetchArticle.pending]: (state) => {
      state.status = 'loading';
      state.error = false;
    },
    [fetchArticle.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.fullArticle = action.payload.article;
      state.tagList = action.payload.article.tagList;
      state.error = false;
    },
    [fetchArticle.rejected]: (state, action) => {
      state.status = 'rejected';
      state.status = action.payload;
      state.error = true;
    },
    [postArticle.pending]: (state) => {
      state.status = 'loading';
      state.error = false;
    },
    [postArticle.fulfilled]: (state) => {
      state.status = 'resolved';
      state.error = false;
    },
    [postArticle.rejected]: (state, action) => {
      state.status = 'rejected';
      state.status = action.payload;
      state.error = true;
    },
    [putEditArticle.pending]: (state) => {
      state.status = 'loading';
      state.error = false;
    },
    [putEditArticle.fulfilled]: (state) => {
      state.status = 'resolved';
      state.error = false;
    },
    [putEditArticle.rejected]: (state, action) => {
      state.status = 'rejected';
      state.status = action.payload;
      state.error = true;
    },
    [deleteArticle.pending]: (state) => {
      state.status = 'loading';
      state.error = false;
    },
    [deleteArticle.fulfilled]: (state) => {
      state.status = 'resolved';
      state.error = false;
    },
    [deleteArticle.rejected]: (state, action) => {
      state.status = 'rejected';
      state.status = action.payload;
      state.error = true;
    },
    [postLike.pending]: (state) => {
      state.status = 'loading';
      state.error = false;
    },
    [postLike.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.fullArticle = action.payload.article;
      state.error = false;
    },
    [postLike.rejected]: (state, action) => {
      state.status = 'rejected';
      state.status = action.payload;
      state.error = true;
    },
    [deleteLike.pending]: (state) => {
      state.status = 'loading';
      state.error = false;
    },
    [deleteLike.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.fullArticle = action.payload.article;
      state.error = false;
    },
    [deleteLike.rejected]: (state, action) => {
      state.status = 'rejected';
      state.status = action.payload;
      state.error = true;
    },
  },
});

export const { addTag, deleteTag, createArticle } = articleSlice.actions;

export default articleSlice.reducer;
