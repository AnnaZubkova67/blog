import React from 'react';
import { Link } from 'react-router-dom';

import styles from './header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <p className={styles.header__text}>Realworld Blog</p>
      <div className={styles.header__authorization}>
        <Link to="/sign-up" className={styles.header__text}>
          Sign In
        </Link>
        <button type="button" className={[styles['header__button--active'], styles.header__text].join(' ')}>
          Sign Up
        </button>
      </div>
    </header>
  );
}

export default Header;
