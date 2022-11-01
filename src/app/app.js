import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';

import Header from '../header/header';
import ListArticles from '../list-articles/list-articles';
import SignUp from '../sign-up/sign-up';
import SignIn from '../sign-in/sign-in';
import EditProfile from '../edit-profile/edit-profile';
import CreateArticle from '../create-article/create-article';
import { getUser } from '../store/authorizationSlice';
import ArticlePreview from '../article-preview/article-preview';

import styles from './app.module.scss';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getUser(JSON.parse(localStorage.getItem('token'))));
    }
  }, []);

  const { idArticle, status } = useSelector((state) => state.articleList);
  return (
    <Spin spinning={status === 'loading'} delay={500} size="large">
      <div className={styles.app}>
        <Header />
        <div className={styles.content}>
          <Routes>
            <Route path="/articles" element={<ListArticles />} />
            <Route path={`/article/${JSON.parse(localStorage.getItem('idArticle'))}`} element={<ArticlePreview />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/new-article" element={<CreateArticle />} />
            <Route path={`/articles/${idArticle}/edit`} element={<CreateArticle />} />
            <Route path="/" element={<ListArticles />} />
          </Routes>
        </div>
      </div>
    </Spin>
  );
}

export default App;
