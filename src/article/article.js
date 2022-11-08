import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import classnames from 'classnames';
import { Alert, Button, Popconfirm, Spin } from 'antd';

import { gettingID } from '../store/articleListSlice';
import { postLike, deleteLike, fetchArticle, deleteArticle, createArticle } from '../store/articleSlice';

import styles from './article.module.scss';
import noLikeImg from './heart.svg';
import likeImg from './like.svg';

function Article({ elem }) {
  // eslint-disable-next-line global-require
  const MarkdownIt = require('markdown-it');
  const md = new MarkdownIt();
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { token, authorization, user } = useSelector((state) => state.authorization);
  const { idArticle } = useSelector((state) => state.articleList);
  const [article, setArticle] = useState({});
  const [mark, setMark] = useState(article.favorited);
  const [deleted, setDeleted] = useState(false);
  // eslint-disable-next-line prefer-rest-params
  const presenceOfArguments = Object.keys(arguments[0]).length;

  useEffect(() => {
    if (presenceOfArguments) {
      setArticle(elem);
    } else {
      dispatch(fetchArticle({ slug: id, tokenUser: token }));
    }
  }, [presenceOfArguments]);

  const { fullArticle, error, status } = useSelector((state) => state.article);

  useEffect(() => {
    if (Object.keys(fullArticle).length && !presenceOfArguments) {
      setArticle(fullArticle);
    }
  }, [fullArticle]);

  const like = async () => {
    if (!article.favorited) {
      await dispatch(postLike({ id: token, name: article.slug }));
      setMark(true);
    } else {
      await dispatch(deleteLike({ id: token, name: article.slug }));
      setMark(false);
    }
  };

  useEffect(() => {
    if ((mark || (!mark && Object.keys(fullArticle).length)) && typeof mark !== 'undefined') {
      setArticle(fullArticle);
    }
  }, [mark]);

  const clickDelete = async () => {
    const request = await dispatch(deleteArticle({ id: token, slug: idArticle }));
    if (request.meta.requestStatus === 'fulfilled') {
      setDeleted(true);
    }
  };

  useEffect(() => {
    if (deleted) {
      setTimeout(() => {
        setDeleted(false);
        navigation('/articles');
      }, 2000);
    }
  }, [deleted]);

  const deleteButton = (
    <Popconfirm
      placement="rightTop"
      title="Are you sure to delete this article?"
      okText="Yes"
      cancelText="No"
      onConfirm={clickDelete}
    >
      <Button className={styles['article__button-delete']}>Delete</Button>
    </Popconfirm>
  );

  const control = (
    <div className={styles.article__buttons}>
      {deleteButton}
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
    if (Object.keys(article).length && article && !deleted) {
      return (
        <li
          className={classnames(styles.article, {
            [styles['article__my-article']]: user.username === article.author.username,
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
              <Popconfirm
                title="Log in to mark the article as liked"
                disabled={authorization}
                onConfirm={() => navigation('/sign-in')}
              >
                <button
                  type="button"
                  disabled={status !== 'resolved'}
                  className={styles.article__like}
                  onClick={authorization ? like : null}
                  onKeyDown={authorization ? like : null}
                >
                  <img src={article.favorited ? likeImg : noLikeImg} alt="like" />
                  {article.favoritesCount}
                </button>
              </Popconfirm>
            </div>
            <ul className={styles.article__tags}>
              {article.tagList.map((value) => (
                <button type="button" className={styles.article__tag} key={Math.random()}>
                  {value}
                </button>
              ))}
            </ul>
            <p className={styles.article__text}>{article.description}</p>
            {!presenceOfArguments ? (
              // eslint-disable-next-line react/no-danger
              <p className={styles.article__body} dangerouslySetInnerHTML={{ __html: md.render(article.body) }} />
            ) : null}
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
            {user.username === article.author.username && !presenceOfArguments ? control : null}
          </div>
        </li>
      );
    }
    if (error) {
      return (
        <div className={styles.article__error}>
          <Alert
            message="Error"
            description="Something went wrong, it is impossible to get the data :("
            type="error"
            showIcon
          />
        </div>
      );
    }
    if (deleted) {
      return (
        <div className={styles.article__error}>
          <Alert message="Success!" description="The article was successfully deleted" type="success" showIcon />
        </div>
      );
    }
    if (status === 'loading') {
      return <Spin spinning={status === 'loading'} delay={500} size="large" className={styles.article__spin} />;
    }
  };

  return articleContent();
}

export default Article;
