import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchArticle } from '../store/articleSlice';

import styles from './article.module.scss';
import likeImg from './heart.svg';

function Article() {
  const dispatch = useDispatch();
  const { idArticle } = useSelector((state) => state.articleList);

  useEffect(() => {
    dispatch(fetchArticle(idArticle));
  }, [idArticle]);
  const { article } = useSelector((state) => state.article);

  // eslint-disable-next-line consistent-return
  const articleContent = () => {
    if (article) {
      return (
        <li className={styles.article}>
          <div className={styles.article__description}>
            <title className={styles.article__title}>
              {article.title}
              <div className={styles.article__like}>
                <img src={likeImg} alt="like" />
                12
              </div>
            </title>
            <button type="button" className={styles.article__tag}>
              Tag1
            </button>
            <p className={styles.article__text}>{article.description}</p>
            <p className={styles.article__body}>{article.body}</p>
          </div>
          <div className={styles.article__profile}>
            <div>
              <p className={styles['article__user-name']}>{article.author.username}</p>
              <p className={styles.article__date}>March 5, 2020 </p>
            </div>
            <img src={article.author.image} alt="user img" className={styles['article__user-img']} />
          </div>
        </li>
      );
    }
  };

  return articleContent();
}

export default Article;
