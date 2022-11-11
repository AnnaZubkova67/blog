import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import classnames from 'classnames';
// import { MarkdownIt } from 'markdown-it'
import { Alert, Button, Popconfirm, Spin } from 'antd';

import { gettingID } from '../store/articleListSlice';
import { postLike, deleteLike, fetchArticle, deleteArticle, createArticle } from '../store/articleSlice';
import style from '../form-article/form-article.module.scss';

import styles from './article.module.scss';
import noLikeImg from './heart.svg';
import likeImg from './like.svg';

function Article({ elem }) {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { token, authorization, user } = useSelector((state) => state.authorization);

  const [article, setArticle] = useState({});
  const [mark, setMark] = useState(article.favorited);
  const [deleted, setDeleted] = useState(false);
  const [create, setCreate] = useState(false);
  // eslint-disable-next-line prefer-rest-params
  const presenceOfArguments = Object.keys(arguments[0]).length;

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('activeCreate'))) {
      dispatch(createArticle({ event: 'create' }));
      setCreate(true);
      localStorage.setItem('activeCreate', JSON.stringify(false));
      setTimeout(() => setCreate(false), 2000);
    }
  }, []);

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

  const clickDelete = () => {
    dispatch(deleteArticle({ id: token, slug: id }));
    setDeleted(true);
  };

  useEffect(() => {
    if (deleted) {
      setTimeout(() => {
        setDeleted(false);
        navigation('/articles');
      }, 1000);
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
        to={`/articles/${id}/edit`}
        className={styles['article__button-edit']}
        onClick={() => dispatch(createArticle({ event: 'edit' }))}
      >
        Edit
      </NavLink>
    </div>
  );

  const creationSuccess = (
    <Alert message="The article was successfully added" type="success" className={style['form-article__alert']} />
  );

  // eslint-disable-next-line consistent-return
  const articleContent = () => {
    if (Object.keys(article).length && article && !deleted) {
      return (
        <>
          {create ? creationSuccess : null}
          <li
            className={classnames(styles.article, {
              [styles['article__my-article']]: user.username === article.author.username,
              [styles['article__preview-article']]: presenceOfArguments,
            })}
          >
            <div className={styles.article__description}>
              <div className={styles.article__title}>
                <Link
                  to={`/articles/${article.slug}`}
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
                <ReactMarkdown className={styles.article__body}>{article.body}</ReactMarkdown>
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
        </>
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
