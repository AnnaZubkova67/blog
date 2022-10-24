import { configureStore } from '@reduxjs/toolkit';

import articleListReducer from './articleListSlice';
import articleReducer from './articleSlice';

export default configureStore({
  reducer: {
    articleList: articleListReducer,
    article: articleReducer,
  },
});
