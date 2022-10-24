import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { gettingID } from '../store/articleListSlice';

import styles from './article-preview.module.scss';
import likeImg from './heart.svg';

function ArticlePreview({ author, title, description, slug }) {
  const dispatch = useDispatch();
  return (
    <li className={styles['article-preview']}>
      <div className={styles['article-preview__description']}>
        <Link
          to="/article"
          className={styles['article-preview__title']}
          onClick={() => dispatch(gettingID({ id: slug }))}
        >
          {title}
          <div className={styles['article-preview__like']}>
            <img src={likeImg} alt="like" />
            12
          </div>
        </Link>
        <button type="button" className={styles['article-preview__tag']}>
          Tag1
        </button>
        <p className={styles['article-preview__text']}>{description}</p>
      </div>
      <div className={styles['article-preview__profile']}>
        <div>
          <p className={styles['article-preview__user-name']}>{author.username}</p>
          <p className={styles['article-preview__date']}>March 5, 2020 </p>
        </div>
        <img src={author.image} alt="user img" className={styles['article-preview__user-img']} />
      </div>
    </li>
  );
}

export default ArticlePreview;
