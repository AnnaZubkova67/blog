import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';

import { postArticle, putEditArticle, addTag, deleteTag } from '../store/articleSlice';

import style from './create-article.module.scss';

function CreateArticle() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { authorization, token } = useSelector((state) => state.authorization);

  useEffect(() => {
    if (!authorization) {
      navigation('/sign-in');
    }
  }, [authorization]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onBlur',
  });

  const { tagList, status, error } = useSelector((state) => state.article);
  const { idArticle } = useSelector((state) => state.articleList);
  const [tagName, setTagName] = useState('');
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);

  const clickAddTag = () => {
    dispatch(addTag({ name: tagName }));
    setTagName('');
  };

  const onSubmit = async (data) => {
    data.tagList = tagList;
    if (JSON.parse(localStorage.getItem('activeCreate'))) {
      await dispatch(postArticle({ id: token, body: data }));
      reset();
      setCreate(true);
      setTimeout(() => setCreate(false), 2000);
    } else {
      await dispatch(putEditArticle({ id: token, body: data, slug: idArticle }));
      setEdit(true);
      setTimeout(() => setEdit(false), 2000);
    }
  };

  const { fullArticle } = useSelector((state) => state.article);
  const activeCreate = JSON.parse(localStorage.getItem('activeCreate'));

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: 'white',
      }}
      spin
    />
  );

  const creationSuccess = (
    <Alert message="The article was successfully added" type="success" className={style['create-article__alert']} />
  );
  const editSuccess = (
    <Alert
      message="The article has been successfully modified"
      type="success"
      className={style['create-article__alert']}
    />
  );

  const errorElement = (
    <div className={style['create-article__alert']}>
      <Alert message="Error" description="Something went wrong, try again :(" type="error" showIcon />
    </div>
  );
  const content = (
    <div className={style['create-article']}>
      <title className={style['create-article__title']}>{activeCreate ? 'Create new article' : 'Edit article'}</title>
      <form onSubmit={handleSubmit(onSubmit)} className={style['create-article__form']}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Title"
          value={activeCreate ? '' : fullArticle.title}
          className={classnames(style['create-article__input'], {
            [style['create-article__input--error']]: errors.title,
          })}
          {...register('title', {
            required: 'Поле не должно быть пустым',
          })}
        />
        <div className={style['create-article__error']}>{errors.title ? <p>{errors.title.message}</p> : null}</div>
        <label htmlFor="short-description">Short description</label>
        <input
          id="short-description"
          type="text"
          placeholder="Short description"
          value={activeCreate ? '' : fullArticle.description}
          className={classnames(style['create-article__input'], {
            [style['create-article__input--error']]: errors.description,
          })}
          {...register('description', {
            required: 'Поле не должно быть пустым',
          })}
        />
        <div className={style['create-article__error']}>
          {errors.description ? <p>Поле не должно быть пустым</p> : null}
        </div>
        <label htmlFor="text">Text</label>
        <textarea
          id="text"
          placeholder="Text"
          rows="10"
          value={activeCreate ? '' : fullArticle.body}
          className={classnames(style['create-article__input'], {
            [style['create-article__input--error']]: errors.text,
          })}
          {...register('body', {
            required: 'Поле не должно быть пустым',
          })}
        />
        <div className={style['create-article__error']}>{errors.text ? <p>{errors.text.message}</p> : null}</div>
        <div>Tags</div>
        {tagList.map((elem) => (
          <div className={style['create-article__tags']} key={Math.random()}>
            <input
              id="tags"
              placeholder="Tag"
              type="text"
              className={style['create-article__tag']}
              defaultValue={elem}
            />
            <button
              type="button"
              className={style['create-article__delete-tag']}
              onClick={() => dispatch(deleteTag({ tag: elem }))}
            >
              Delete
            </button>
          </div>
        ))}
        <label htmlFor="tags" className={style['create-article__tags']}>
          <input
            id="tags"
            placeholder="Tag"
            type="text"
            className={style['create-article__tag']}
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
          />
          <button type="button" className={style['create-article__delete-tag']} onClick={() => setTagName('')}>
            Delete
          </button>
          <button type="button" className={style['create-article__add-tag']} onClick={clickAddTag}>
            Add tag
          </button>
        </label>
        <button
          type="submit"
          className={style['create-article__send']}
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
      {create && !error ? creationSuccess : null}
      {edit && !error ? editSuccess : null}
      {error ? errorElement : null}
      {content}
    </>
  );
}

export default CreateArticle;
