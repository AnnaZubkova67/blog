import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Alert } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { postArticle, putEditArticle, addTag, deleteTag, fetchArticle } from '../store/articleSlice';

import style from './form-article.module.scss';

function FormArticle() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { authorization, token, status: statusAuthorization, user } = useSelector((state) => state.authorization);
  const { id } = useParams();

  useEffect(() => {
    if (!authorization) {
      navigation('/sign-in');
    } else if (id) {
      dispatch(fetchArticle({ tokenUser: token, slug: id }));
    }
  }, [authorization, id]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onBlur',
  });

  const { tagList, status, error } = useSelector((state) => state.article);
  const [tagName, setTagName] = useState('');
  const [edit, setEdit] = useState(false);

  const clickAddTag = () => {
    dispatch(addTag({ name: tagName }));
    setTagName('');
  };

  const onSubmit = (data) => {
    data.tagList = tagList;
    if (JSON.parse(localStorage.getItem('activeCreate'))) {
      dispatch(postArticle({ id: token, body: data }));
      reset();
    } else {
      dispatch(putEditArticle({ id: token, body: data, slug: id }));
      setEdit(true);
      setTimeout(() => setEdit(false), 2000);
    }
  };

  const { fullArticle } = useSelector((state) => state.article);

  useEffect(() => {
    if (Object.keys(fullArticle).length && fullArticle.author.username !== user.username) {
      navigation(`/articles/${id}`);
    }
  }, [fullArticle, user]);

  useEffect(() => {
    if (!id && !Object.keys(fullArticle).length) {
      reset();
    }
  }, [id, fullArticle]);

  useEffect(() => {
    if (!id && Object.keys(fullArticle).length) {
      navigation(`/articles/${fullArticle.slug}`);
    }
  }, [id, fullArticle]);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: 'white',
      }}
      spin
    />
  );

  const editSuccess = (
    <Alert
      message="The article has been successfully modified"
      type="success"
      className={style['form-article__alert']}
    />
  );

  const errorElement = (
    <div className={style['form-article__alert']}>
      <Alert message="Error" description="Something went wrong, try again :(" type="error" showIcon />
    </div>
  );

  const spinElement = (
    <Spin
      spinning={statusAuthorization === 'loading'}
      delay={500}
      size="large"
      className={style['form-article__spin']}
    />
  );
  const contentElement = (
    <div className={style['form-article']}>
      <title className={style['form-article__title']}>{!id ? 'Create new article' : 'Edit article'}</title>
      <form onSubmit={handleSubmit(onSubmit)} className={style['form-article__form']}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Title"
          defaultValue={!id && fullArticle ? '' : fullArticle.title}
          className={classnames(style['form-article__input'], {
            [style['form-article__input--error']]: errors.title,
          })}
          {...register('title', {
            required: 'The field should not be empty',
          })}
        />
        <div className={style['form-article__error']}>{errors.title ? <p>{errors.title.message}</p> : null}</div>
        <label htmlFor="short-description">Short description</label>
        <input
          id="short-description"
          type="text"
          placeholder="Short description"
          defaultValue={!id ? '' : fullArticle.description}
          className={classnames(style['form-article__input'], {
            [style['form-article__input--error']]: errors.description,
          })}
          {...register('description', {
            required: 'The field should not be empty',
          })}
        />
        <div className={style['form-article__error']}>
          {errors.description ? <p>The field should not be empty</p> : null}
        </div>
        <label htmlFor="text">Text</label>
        <textarea
          id="text"
          placeholder="Text"
          rows="10"
          defaultValue={!id ? '' : fullArticle.body}
          className={classnames(style['form-article__input'], {
            [style['form-article__input--error']]: errors.text,
          })}
          {...register('body', {
            required: 'The field should not be empty',
          })}
        />
        <div className={style['form-article__error']}>{errors.text ? <p>{errors.text.message}</p> : null}</div>
        <div>Tags</div>
        {tagList.map((elem, i) => (
          <div className={style['form-article__tags']} key={Math.random()}>
            <input
              id="tags"
              placeholder="Tag"
              type="text"
              className={style['form-article__tag']}
              defaultValue={elem}
              disabled
            />
            <button
              type="button"
              className={style['form-article__delete-tag']}
              onClick={() => dispatch(deleteTag({ index: i }))}
            >
              Delete
            </button>
          </div>
        ))}
        <label htmlFor="tags" className={style['form-article__tags']}>
          <input
            id="tags"
            placeholder="Tag"
            type="text"
            className={style['form-article__tag']}
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
          />
          <button type="button" className={style['form-article__delete-tag']} onClick={() => setTagName('')}>
            Delete
          </button>
          <button type="button" className={style['form-article__add-tag']} onClick={clickAddTag}>
            Add tag
          </button>
        </label>
        <button
          type="submit"
          className={style['form-article__send']}
          disabled={status === 'loading'}
          onClick={() => window.scroll(0, 0)}
        >
          {status === 'loading' ? <Spin indicator={antIcon} /> : 'Send'}
        </button>
      </form>
    </div>
  );
  return (
    <>
      {edit && !error ? editSuccess : null}
      {error ? errorElement : null}
      {statusAuthorization === 'loading' ? spinElement : null}
      {contentElement}
    </>
  );
}

export default FormArticle;
