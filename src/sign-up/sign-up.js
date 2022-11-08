import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { postSignUp } from '../store/authorizationSlice';

import style from './sign-up.module.scss';

function SignUp() {
  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });

  const dispatch = useDispatch();
  const navigation = useNavigate();

  const watchPassword = watch('password');

  const onSubmit = (data) => {
    delete data.repeatPassword;
    dispatch(postSignUp(data));
  };

  const { authorization, errorMessage, error, status } = useSelector((state) => state.authorization);

  useEffect(() => {
    if (authorization) {
      navigation(-1);
    }
  }, [authorization]);

  const errorElement = (
    <div className={style['form__error-message']}>
      <Alert
        message="Error"
        description="Something went wrong, it is impossible to create a new account :("
        type="error"
        showIcon
      />
    </div>
  );

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: 'white',
      }}
      spin
    />
  );

  return (
    <>
      {error ? errorElement : null}
      <div className={style.form}>
        <title className={style.form__title}>Create new account</title>
        <form onSubmit={handleSubmit(onSubmit)} className={style.form__shape}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            placeholder="Username"
            className={classnames(style.form__input, {
              [style['form__input--error']]: errors.username || errorMessage.username,
            })}
            {...register('username', {
              required: true,
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="new-password"
            placeholder="Password"
            className={classnames(style.form__input, { [style['form__input--error']]: errors.password })}
            {...register('password', {
              required: true,
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
          <label htmlFor="repeat">Repeat password</label>
          <input
            id="repeat"
            type="new-password"
            placeholder="Repeat password"
            className={classnames(style.form__input, { [style['form__input--error']]: errors.repeatPassword })}
            {...register('repeatPassword', {
              required: true,
              validate: (value) => value === watchPassword,
            })}
          />
          <div className={style.form__error}>
            {errors.repeatPassword ? <p>{errors.repeatPassword.message}</p> : null}
          </div>
          <input
            id="information"
            type="checkbox"
            {...register('repeatPassword', {
              required: true,
            })}
          />
          <label htmlFor="information" className={style.form__information}>
            I agree to the processing of my personal information
          </label>
          <button type="submit" className={style.form__submit} disabled={!isValid}>
            {status === 'loading' ? <Spin indicator={antIcon} /> : 'Create'}
          </button>
        </form>

        <p className={style['form__sign-in']}>
          Already have an account? <Link to="/sign-in">Sign In</Link>.
        </p>
      </div>
    </>
  );
}

export default SignUp;
