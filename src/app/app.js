import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Alert } from 'antd';

import Header from '../header/header';
import ListArticles from '../list-articles/list-articles';
import SignUp from '../sign-up/sign-up';
import SignIn from '../sign-in/sign-in';
import EditProfile from '../edit-profile/edit-profile';
import CreateArticle from '../create-article/create-article';
import NetworkState from '../network-state/network-state';
import { getUser } from '../store/authorizationSlice';
import Article from '../article/article';

import styles from './app.module.scss';

function App() {
  const dispatch = useDispatch();
  const [network, setNetwork] = useState(true);

  const onNetworkState = () => {
    if (network) {
      setNetwork(false);
    } else {
      setNetwork(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getUser(JSON.parse(localStorage.getItem('token'))));
    }
  }, []);

  const networkElement = (
    <div className={styles.app__error}>
      <Alert message="You are not connected to the network :(" type="error" showIcon />
    </div>
  );

  return (
    <>
      <NetworkState onNetworkState={onNetworkState} />
      {!network ? networkElement : null}
      <div className={styles.app}>
        <Header />
        <div className={styles.content}>
          <Routes>
            <Route path="/articles" element={<ListArticles />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/new-article" element={<CreateArticle />} />
            <Route
              path={`/articles/${JSON.parse(localStorage.getItem('idArticle'))}/edit`}
              element={<CreateArticle />}
            />
            <Route path="/" element={<ListArticles />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
