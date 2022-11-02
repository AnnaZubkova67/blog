import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const postSignUp = createAsyncThunk('authorization/postSignUp', async (body, { rejectWithValue }) => {
  try {
    let res = await fetch('https://blog.kata.academy/api/users', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ user: body }),
    });
    if (res.status === 422) {
      return await res.json().then((result) => rejectWithValue(result));
    }
    if (!res.ok) {
      throw new Error();
    }
    res = await res.json();
    return res;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const postSignIn = createAsyncThunk('authorization/postSignIn', async (body, { rejectWithValue }) => {
  try {
    let res = await fetch('https://blog.kata.academy/api/users/login', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ user: body }),
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

export const putEditProfile = createAsyncThunk('authorization/putEditProfile', async (info, { rejectWithValue }) => {
  try {
    let res = await fetch('https://blog.kata.academy/api/user', {
      method: 'PUT',
      headers: {
        Authorization: `Token ${info.id}`,
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ user: info.body }),
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

export const getUser = createAsyncThunk('authorization/getUser', async (id, { rejectWithValue }) => {
  try {
    let res = await fetch('https://blog.kata.academy/api/user', {
      method: 'GET',
      headers: {
        Authorization: `Token ${id}`,
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

const setFulfilled = (state, action) => {
  // if(action.payload.errors){
  //   state.errorMessage = action.payload.errors;
  // }
  state.status = 'resolved';
  state.email = action.payload.user.email;
  state.user = action.payload.user;
  state.token = action.payload.user.token;
  localStorage.setItem('token', JSON.stringify(action.payload.user.token));
  state.username = action.payload.user.username;
  if (action.payload.user.image) {
    state.image = action.payload.user.image;
  }
  state.authorization = true;
  state.error = false;
};

const setRejected = (state) => {
  state.status = 'rejected';
  state.error = true;
};

const authorizationSlice = createSlice({
  name: 'authorization',
  initialState: {
    status: '',
    error: false,
    errorMessage: {},
    user: {},
    authorization: false,
    email: '',
    token: '',
    username: '',
    image: '',
  },
  reducers: {
    logOut: (state) => {
      localStorage.clear();
      state.authorization = false;
      state.email = '';
      state.token = '';
      state.username = '';
      state.image = '';
    },
  },
  extraReducers: {
    [postSignUp.pending]: setPending,
    [postSignUp.fulfilled]: setFulfilled,
    [postSignUp.rejected]: setRejected,
    [postSignIn.pending]: setPending,
    [postSignIn.fulfilled]: setFulfilled,
    [postSignIn.rejected]: setRejected,
    [putEditProfile.pending]: setPending,
    [putEditProfile.fulfilled]: setFulfilled,
    [putEditProfile.rejected]: setRejected,
    [getUser.pending]: setPending,
    [getUser.fulfilled]: setFulfilled,
    [getUser.rejected]: setRejected,
  },
});

export const { logOut } = authorizationSlice.actions;

export default authorizationSlice.reducer;
