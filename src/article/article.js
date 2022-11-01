import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { NavLink } from 'react-router-dom';

import { createArticle, fetchArticle, deleteArticle } from '../store/articleSlice';

import styles from './article.module.scss';
import likeImg from './heart.svg';

function Article() {
  const dispatch = useDispatch();
  const { idArticle } = useSelector((state) => state.articleList);

  useEffect(() => {
    dispatch(fetchArticle(JSON.parse(localStorage.getItem('idArticle'))));
  }, []);
  const { article } = useSelector((state) => state.article);
  const { username } = useSelector((state) => state.authorization);
  const { token } = useSelector((state) => state.authorization);

  const control = (
    <div className={styles.article__buttons}>
      <button
        type="button"
        className={styles['article__button-delete']}
        onClick={() => dispatch(deleteArticle({ id: token, slug: idArticle }))}
      >
        Delete
      </button>
      <NavLink
        to={`/articles/${idArticle}/edit`}
        className={styles['article__button-edit']}
        onClick={() => dispatch(createArticle({ event: 'edit' }))}
      >
        Edit
      </NavLink>
    </div>
  );

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
            <ul className={styles['article-preview__tags']}>
              {article.tagList.map((elem) => (
                <button type="button" className={styles['article-preview__tag']} key={Math.random()}>
                  {elem}
                </button>
              ))}
            </ul>
            <p className={styles.article__text}>{article.description}</p>
            <p className={styles.article__body}>{article.body}</p>
          </div>
          <div className={styles.article__profile}>
            <div className={styles.article__info}>
              <div>
                <p className={styles['article__user-name']}>{article.author.username}</p>
                <p className={styles.article__date}>{format(new Date(article.createdAt), 'MMMM d, y')}</p>
              </div>
              <img src={article.author.image} alt="user img" className={styles['article__user-img']} />
            </div>
            {username === article.author.username ? control : null}
          </div>
        </li>
      );
    }
  };

  return articleContent();
}

export default Article;
