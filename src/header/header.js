import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Popconfirm } from 'antd';

import { logOut } from '../store/authorizationSlice';
import { createArticle } from '../store/articleSlice';

import styles from './header.module.scss';
import userImg from './user-img.svg';

function Header() {
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const setActive = ({ isActive }) => (isActive ? styles['header__button--active'] : styles.header__text);

  const { authorization, username, image } = useSelector((state) => state.authorization);

  const clickLogOut = async () => {
    await dispatch(logOut());
    navigation('/articles');
  };

  const notAuthorized = (
    <div className={styles.header__authorization}>
      <NavLink to="/sign-in" className={setActive}>
        Sign In
      </NavLink>
      <NavLink to="/sign-up" className={setActive}>
        Sign Up
      </NavLink>
    </div>
  );

  const logOutButton = (
    <Popconfirm
      placement="bottomRight"
      title="Вы действительно хотите выйти?"
      okText="Да"
      cancelText="Нет"
      onConfirm={clickLogOut}
    >
      <Button className={styles['header__log-out']}>Log Out</Button>
    </Popconfirm>
  );

  const authorized = (
    <div className={styles.header__authorization}>
      <NavLink to="/new-article" className={setActive} onClick={() => dispatch(createArticle({ event: 'create' }))}>
        Create article
      </NavLink>
      <NavLink to="/profile" className={styles.header__user}>
        <p className={styles.header__text}>{username}</p>
        <img src={image !== '' ? image : userImg} alt="user img" className={styles.header__image} />
      </NavLink>
      {logOutButton}
    </div>
  );

  return (
    <header className={styles.header}>
      <NavLink to="/articles" className={setActive}>
        Realworld Blog
      </NavLink>
      {authorization ? authorized : notAuthorized}
    </header>
  );
}

export default Header;
