import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

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

  const { authorization } = useSelector((state) => state.authorization);

  useEffect(() => {
    if (authorization) {
      navigation(-1);
    }
  }, [authorization]);

  return (
    <div className={style['sign-in']}>
      <title className={style['sign-in__title']}>Sign In</title>
      <form onSubmit={handleSubmit(onSubmit)} className={style['sign-in__form']}>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          placeholder="Email address"
          className={classnames(style['sign-in__input'], { [style['sign-in__input--error']]: errors.email })}
          {...register('email', {
            required: true,
            pattern: /^[a-z0-9._%+-]+@[a-z0-9-]+.+.[a-z]{2,4}$/g,
          })}
        />
        <div className={style['sign-in__error']}>
          {errors.email ? <p>Некорректный адрес электронной почты</p> : null}
        </div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          className={classnames(style['sign-in__input'], { [style['sign-in__input--error']]: errors.password })}
          {...register('password', {
            required: 'Поле не должно быть пустым',
          })}
        />
        <div className={style['sign-in__error']}>{errors.password ? <p>{errors.password.message}</p> : null}</div>
        <input type="submit" className={style['sign-in__login']} value="Login" />
      </form>

      <p className={style['sign-in__sign-up']}>
        Already have an account? <Link to="/sign-up">Sign Up</Link>.
      </p>
    </div>
  );
}

export default SignIn;
