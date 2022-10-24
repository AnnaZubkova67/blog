import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from '../header/header';
import ListArticles from '../list-articles/list-articles';
import Article from '../article/article';
import SignUp from '../sign-up/sign-up';

import styles from './app.module.scss';

function App() {
  return (
    <div className={styles.content}>
      <Header />
      <Routes>
        <Route path="/" element={<ListArticles />} />
        <Route path="/article" element={<Article />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
