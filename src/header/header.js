import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from './header.module.scss';
import userImg from './user-img.svg';

function Header() {
  const setActive = ({ isActive }) => (isActive ? styles['header__button--active'] : styles.header__text);
  const { authorization } = useSelector((state) => state.authorization);
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
  const authorized = (
    <div className={styles.header__authorization}>
      <NavLink to="/sign-in" className={setActive}>
        Create article
      </NavLink>
      <div className={styles.header__user}>
        <p className={styles.header__text}>John Doe</p>
        <img src={userImg} alt="user img" />
      </div>
      <NavLink to="/sign-up" className={styles['header__log-out']}>
        Log Out
      </NavLink>
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
