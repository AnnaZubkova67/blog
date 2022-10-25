import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Header from '../header/header';
import ListArticles from '../list-articles/list-articles';
import Article from '../article/article';
import SignUp from '../sign-up/sign-up';
import SignIn from '../sign-in/sign-in';

import styles from './app.module.scss';

function App() {
  const { idArticle } = useSelector((state) => state.articleList);
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.content}>
        <Routes>
          <Route path="/articles" element={<ListArticles />} />
          <Route path={`/article/${idArticle}`} element={<Article />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/" element={<ListArticles />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
