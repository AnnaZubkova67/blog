import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { postSignIn } from '../store/authorizationSlice';

import style from './sign-in.module.scss';

function SignIn() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });

  const dispatch = useDispatch();
  const navigation = useNavigate();

  const onSubmit = (data) => {
    dispatch(postSignIn(data));
  };

  const { authorization, errorMessage, status, error } = useSelector((state) => state.authorization);

  useEffect(() => {
    if (authorization) {
      navigation(-1);
    }
  }, [authorization]);

  const errorElement = (
    <div className={style['sign-in__error-message']}>
      <Alert message="Error" description="Something went wrong, it's impossible to log in :(" type="error" showIcon />
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
      {error && !Object.keys(errorMessage).length ? errorElement : null}
      <div className={style.form}>
        <title className={style.form__title}>Sign In</title>
        <form onSubmit={handleSubmit(onSubmit)} className={style.form__shape}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            placeholder="Email address"
            className={classnames(style.form__input, {
              [style['form__input--error']]: errors.email || Object.keys(errorMessage).length,
            })}
            {...register('email', {
              required: true,
              pattern: /^[a-z0-9._%+-]+@[a-z0-9-]+.+.[a-z]{2,4}$/g,
            })}
          />
          <div className={style.form__error}>{errors.email ? <p>Некорректный адрес электронной почты</p> : null}</div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className={classnames(style.form__input, {
              [style['form__input--error']]: errors.password || Object.keys(errorMessage).length,
            })}
            {...register('password', {
              required: 'Поле не должно быть пустым',
            })}
          />
          <div className={style.form__error}>
            {errors.password ? <p>{errors.password.message}</p> : null}
            {Object.keys(errorMessage).length ? <p>Invalid email address or password</p> : null}
          </div>
          <button type="submit" className={style.form__submit}>
            {status === 'loading' ? <Spin indicator={antIcon} /> : 'Login'}
          </button>
        </form>

        <p className={style['form__sign-up']}>
          Already have an account? <Link to="/sign-up">Sign Up</Link>.
        </p>
      </div>
    </>
  );
}

export default SignIn;
