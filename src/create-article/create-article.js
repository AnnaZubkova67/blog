import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { addTag } from '../store/articleSlice';

import style from './create-article.module.scss';

function CreateArticle() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });
  const { tagList } = useSelector((state) => state.article);
  const [tagName, setTagName] = useState('');
  const dispatch = useDispatch();

  const clickAddTag = () => {
    dispatch(addTag({ name: tagName }));
    setTagName('');
  };

  const onSubmit = () => {};
  return (
    <div className={style['create-article']}>
      <title className={style['create-article__title']}>Create new article</title>
      <form onSubmit={handleSubmit(onSubmit)} className={style['create-article__form']}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Title"
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
        <label htmlFor="text">Tags</label>
        <textarea
          id="text"
          placeholder="Text"
          rows="10"
          className={classnames(style['create-article__input'], {
            [style['create-article__input--error']]: errors.text,
          })}
          {...register('body', {
            required: 'Поле не должно быть пустым',
          })}
        />
        <div className={style['create-article__error']}>{errors.text ? <p>{errors.text.message}</p> : null}</div>
        <label htmlFor="tags">Tags</label>
        {tagList.map((elem) => (
          <div className={style['create-article__tags']} key={Math.random()}>
            <input
              id="tags"
              placeholder="Tag"
              type="text"
              className={style['create-article__tag']}
              defaultValue={elem}
            />
            <button type="button" className={style['create-article__delete-tag']}>
              Delete
            </button>
          </div>
        ))}
        <div className={style['create-article__tags']} key={Math.random()}>
          <input
            id="tags"
            placeholder="Tag"
            type="text"
            className={style['create-article__tag']}
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
          />
          <button type="button" className={style['create-article__delete-tag']}>
            Delete
          </button>
          <button type="button" className={style['create-article__add-tag']} onClick={clickAddTag}>
            Add tag
          </button>
        </div>
        <input type="submit" className={style['create-article__send']} value="Send" />
      </form>
    </div>
  );
}

export default CreateArticle;
