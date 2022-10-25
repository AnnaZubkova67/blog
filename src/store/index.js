import { configureStore } from '@reduxjs/toolkit';

import articleListReducer from './articleListSlice';
import articleReducer from './articleSlice';
import authorizationReducer from './authorizationSlice';

export default configureStore({
  reducer: {
    articleList: articleListReducer,
    article: articleReducer,
    authorization: authorizationReducer,
  },
});
