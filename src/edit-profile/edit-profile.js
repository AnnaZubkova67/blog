import React from 'react';
import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { putEditProfile } from '../store/authorizationSlice';

import style from './edit-profile.module.scss';

function EditProfile() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onBlur',
  });

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authorization);

  const onSubmit = async (data) => {
    const user = await dispatch(putEditProfile({ id: token, body: data }));
    if (user.meta.requestStatus === 'fulfilled') {
      reset();
    }
  };

  return (
    <div className={style['edit-profile']}>
      <title className={style['edit-profile__title']}>Edit Profile</title>
      <form onSubmit={handleSubmit(onSubmit)} className={style['edit-profile__form']}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          placeholder="Username"
          className={classnames(style['edit-profile__input'], {
            [style['edit-profile__input--error']]: errors.username,
          })}
          {...register('username', {
            required: 'Поле не должно быть пустым',
            minLength: {
              value: 3,
              message: 'Не менее 3-х символов',
            },
            maxLength: {
              value: 20,
              message: 'Не более 20 символов',
            },
          })}
        />
        <div className={style['edit-profile__error']}>{errors.username ? <p>{errors.username.message}</p> : null}</div>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          placeholder="Email address"
          className={classnames(style['edit-profile__input'], { [style['edit-profile__input--error']]: errors.email })}
          {...register('email', {
            required: true,
            pattern: /^[a-z0-9._%+-]+@[a-z0-9-]+.+.[a-z]{2,4}$/g,
          })}
        />
        <div className={style['edit-profile__error']}>
          {errors.email ? <p>Некорректный адрес электронной почты</p> : null}
        </div>
        <label htmlFor="password">New password</label>
        <input
          id="password"
          type="new-password"
          placeholder="New password"
          className={classnames(style['edit-profile__input'], {
            [style['edit-profile__input--error']]: errors.password,
          })}
          {...register('password', {
            required: 'Поле не должно быть пустым',
            minLength: {
              value: 6,
              message: 'Не менее 6 символов',
            },
            maxLength: {
              value: 40,
              message: 'Не более 40 символов',
            },
          })}
        />
        <div className={style['edit-profile__error']}>{errors.password ? <p>{errors.password.message}</p> : null}</div>
        <label htmlFor="image">Avatar image (url)</label>
        <input
          id="image"
          placeholder="Avatar image "
          className={classnames(style['edit-profile__input'], { [style['edit-profile__input--error']]: errors.image })}
          {...register('image', {
            required: 'Поле не должно быть пустым',
            /* eslint-disable-next-line */
            pattern: /[-a-zA-Z0-9@:%_+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&\/=]*)?/gi,
          })}
        />
        <div className={style['edit-profile__error']}>{errors.image ? <p>Некорректный URL</p> : null}</div>
        <input type="submit" className={style['edit-profile__save']} value="Save" />
      </form>
    </div>
  );
}

export default EditProfile;
