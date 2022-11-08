import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchArticle = createAsyncThunk('article/fetchArticle', async (info, { rejectWithValue }) => {
  try {
    let res = await fetch(`https://blog.kata.academy/api/articles/${info.slug}`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${info.tokenUser}`,
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
    const res = await fetch(`https://blog.kata.academy/api/articles/${info.slug}`, {
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

    return true;
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

const setPending = (state) => {
  state.status = 'loading';
  state.error = false;
};

const setFulfilled = (state) => {
  state.status = 'resolved';
  state.error = false;
};

const setRejected = (state, action) => {
  state.status = 'rejected';
  state.status = action.payload;
  state.error = true;
};

const articleSlice = createSlice({
  name: 'article',
  initialState: {
    status: 'resolved',
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
      state.tagList = state.tagList.filter((elem, i) => i !== action.payload.index);
    },
    createArticle: (state, action) => {
      if (action.payload.event === 'create') {
        state.activeCreate = true;
        state.fullArticle = {};
        state.tagList = [];
      } else {
        state.activeCreate = false;
      }
      localStorage.setItem('activeCreate', JSON.stringify(state.activeCreate));
    },

    clearingThePreviousArticle: (state) => {
      state.fullArticle = {};
    },
  },
  extraReducers: {
    [fetchArticle.pending]: setPending,
    [fetchArticle.fulfilled]: (state, action) => {
      setFulfilled(state, action);
      state.fullArticle = action.payload.article;
      state.tagList = action.payload.article.tagList;
    },
    [fetchArticle.rejected]: (state, action) => {
      setRejected(state, action);
      state.status = action.payload;
    },
    [postArticle.pending]: setPending,
    [postArticle.fulfilled]: setFulfilled,
    [postArticle.rejected]: setRejected,
    [putEditArticle.pending]: setPending,
    [putEditArticle.fulfilled]: setFulfilled,
    [putEditArticle.rejected]: setRejected,
    [deleteArticle.pending]: setPending,
    [deleteArticle.fulfilled]: (state, action) => {
      setFulfilled(state, action);
      state.fullArticle = {};
      state.tagList = [];
    },
    [deleteArticle.rejected]: setRejected,
    [postLike.pending]: setPending,
    [postLike.fulfilled]: (state, action) => {
      setFulfilled(state, action);
      state.fullArticle = action.payload.article;
    },
    [postLike.rejected]: setRejected,
    [deleteLike.pending]: setPending,
    [deleteLike.fulfilled]: (state, action) => {
      setFulfilled(state, action);
      state.fullArticle = action.payload.article;
    },
    [deleteLike.rejected]: setRejected,
  },
});

export const { addTag, deleteTag, createArticle, clearingThePreviousArticle } = articleSlice.actions;

export default articleSlice.reducer;
