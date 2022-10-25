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
    if (!res.ok) {
      throw new Error('Невозможно загрузить данные');
    }
    res = await res.json();
    return res;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authorizationSlice = createSlice({
  name: 'authorization',
  initialState: {
    status: null,
    error: false,
    authorization: false,
    email: '',
    token: '',
    username: '',
  },
  reducers: {},
  extraReducers: {
    [postSignUp.pending]: (state) => {
      state.status = 'loading';
      state.error = false;
    },
    [postSignUp.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.email = action.payload.user.email;
      state.token = action.payload.user.token;
      state.username = action.payload.user.username;
      state.authorization = true;
      state.error = false;
    },
    [postSignUp.rejected]: (state) => {
      state.status = 'rejected';
      state.error = true;
    },
  },
});

export default authorizationSlice.reducer;
