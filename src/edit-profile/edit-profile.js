import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { putEditProfile } from '../store/authorizationSlice';

import style from './edit-profile.module.scss';

function EditProfile() {
  const navigation = useNavigate();
  const { authorization, user, status, error } = useSelector((state) => state.authorization);

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

  const dispatch = useDispatch();
  const { token, errorMessage } = useSelector((state) => state.authorization);
  const [edit, setEdit] = useState(false);

  const onSubmit = async (data) => {
    const request = await dispatch(putEditProfile({ id: token, body: data }));
    if (request.meta.requestStatus === 'fulfilled') {
      reset();
      setEdit(true);
      setTimeout(() => setEdit(false), 2000);
    }
  };

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: 'white',
      }}
      spin
    />
  );

  const editSuccess = <Alert message="Profile changed successfully" type="success" className={style.form__alert} />;
  const editError = <Alert message="Failed to change profile" type="error" className={style.form__alert} />;

  return (
    <>
      {edit && !error ? editSuccess : null}
      {error ? editError : null}
      <div className={style.form}>
        <title className={style.form__title}>Edit Profile</title>
        <form onSubmit={handleSubmit(onSubmit)} className={style.form__shape}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            placeholder="Username"
            defaultValue={user.username}
            className={classnames(style.form__input, {
              [style['form__input--error']]: errors.username || errorMessage.username,
            })}
            {...register('username', {
              required: 'The field should not be empty',
              minLength: {
                value: 3,
                message: 'Your username must consist of at least 3 characters',
              },
              maxLength: {
                value: 20,
                message: 'Your username must consist of no more than 20 characters',
              },
            })}
          />
          <div className={style.form__error}>
            {errors.username ? <p>{errors.username.message}</p> : null}
            {errorMessage.username ? <p>The username is already taken</p> : null}
          </div>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            placeholder="Email address"
            defaultValue={user.email}
            className={classnames(style.form__input, {
              [style['form__input--error']]: errors.email || errorMessage.email,
            })}
            {...register('email', {
              required: true,
              pattern: /^[a-z0-9._%+-]+@[a-z0-9-]+.+.[a-z]{2,4}$/g,
            })}
          />
          <div className={style.form__error}>
            {errors.email ? <p>Invalid email address</p> : null}
            {errorMessage.email ? <p>Email is already busy</p> : null}
          </div>
          <label htmlFor="password">New password</label>
          <input
            id="password"
            type="new-password"
            placeholder="New password"
            className={classnames(style.form__input, {
              [style['form__input--error']]: errors.password,
            })}
            {...register('password', {
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters',
              },
              maxLength: {
                value: 40,
                message: 'Your password must consist of no more than 40 characters',
              },
            })}
          />
          <div className={style.form__error}>{errors.password ? <p>{errors.password.message}</p> : null}</div>
          <label htmlFor="image">Avatar image (url)</label>
          <input
            id="image"
            placeholder="Avatar image"
            defaultValue={user.image}
            className={classnames(style.form__input, {
              [style['form__input--error']]: errors.image,
            })}
            {...register('image', {
              /* eslint-disable-next-line */
              pattern: /[-a-zA-Z0-9@:%_+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&\/=]*)?/gi,
            })}
          />
          <div className={style.form__error}>{errors.image ? <p>Incorrect URL</p> : null}</div>
          <button type="submit" className={style.form__submit} disabled={status === 'loading'}>
            {status === 'loading' ? <Spin indicator={antIcon} /> : 'Save'}
          </button>
        </form>
      </div>
    </>
  );
}

export default EditProfile;
