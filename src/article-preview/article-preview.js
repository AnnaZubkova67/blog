import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import classnames from 'classnames';

import { gettingID } from '../store/articleListSlice';
import { postLike, deleteLike, fetchArticle, deleteArticle, createArticle } from '../store/articleSlice';

import styles from './article-preview.module.scss';
import noLikeImg from './heart.svg';
import likeImg from './like.svg';

function ArticlePreview({ elem }) {
  const dispatch = useDispatch();
  const { username, token } = useSelector((state) => state.authorization);
  const { idArticle } = useSelector((state) => state.articleList);
  const [article, setArticle] = useState({});
  // eslint-disable-next-line prefer-rest-params
  const presenceOfArguments = Object.keys(arguments[0]).length;

  useEffect(() => {
    if (presenceOfArguments) {
      setArticle(elem);
    } else {
      dispatch(fetchArticle({ slug: JSON.parse(localStorage.getItem('idArticle')), id: token }));
    }
  }, []);

  const { fullArticle } = useSelector((state) => state.article);

  useEffect(() => {
    if (Object.keys(fullArticle).length && !presenceOfArguments) {
      setArticle(fullArticle);
    }
  }, [fullArticle]);

  const like = () => {
    if (!article.favorited) {
      dispatch(postLike({ id: token, name: article.slug }));
    } else {
      dispatch(deleteLike({ id: token, name: article.slug }));
    }
  };

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
    if (Object.keys(article).length && article) {
      return (
        <li
          className={classnames(styles.article, {
            [styles['article__my-article']]: username === article.author.username,
            [styles['article__preview-article']]: presenceOfArguments,
          })}
        >
          <div className={styles.article__description}>
            <div className={styles.article__title}>
              <Link
                to={`/article/${article.slug}`}
                className={styles.article__title}
                onClick={() => dispatch(gettingID({ id: article.slug }))}
              >
                {article.title}
              </Link>
              <div role="presentation" className={styles.article__like} onClick={like} onKeyDown={like}>
                <img src={article.favorited ? likeImg : noLikeImg} alt="like" />
                {article.favoritesCount}
              </div>
            </div>
            <ul className={styles.article__tags}>
              {article.tagList.map((value) => (
                <button type="button" className={styles.article__tag} key={Math.random()}>
                  {value}
                </button>
              ))}
            </ul>
            <p className={styles.article__text}>{article.description}</p>
            <p className={styles.article__body}>{!presenceOfArguments ? article.body : null}</p>
          </div>
          <div
            className={classnames(styles.article__profile, {
              [styles['article__full-article-profile']]: !presenceOfArguments,
            })}
          >
            <div className={styles.article__info}>
              <div>
                <p className={styles['article__user-name']}>{article.author.username}</p>
                <p className={styles.article__date}>{format(new Date(article.createdAt), 'MMMM d, y')}</p>
              </div>
              <img src={article.author.image} alt="user img" className={styles['article__user-img']} />
            </div>
            {username === article.author.username && !presenceOfArguments ? control : null}
          </div>
        </li>
      );
    }
  };

  return articleContent();
}

export default ArticlePreview;
