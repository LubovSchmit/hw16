import React, { ChangeEvent } from 'react';
import cn from 'classnames';

import { Input } from '@alfalab/core-components/input';
import { PasswordInput } from '@alfalab/core-components/password-input';
import { Typography } from '@alfalab/core-components/typography';

import styles from './Registr.module.scss';
import { api } from '../../api';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@alfalab/core-components/button';
import * as CONSTANTS from '../../helpers/constants';
import * as RE from '../../helpers/regularExpressions';
import { useAppSelector } from '../../redux/hooks';
import { toast } from 'react-toastify';
import { catchHandler } from '../../helpers/catchHandler';

export const Registr = () => {
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const passCheck = () => {
    return password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  };

  const emailValidation = (email: string) => {
    const emailCheck = () => {
      return RE.emailCheckRE.test(email);
    };
    if (email.length === 0 && !emailCheck()) {
      return CONSTANTS.REG_ERROR_EMPTY_EMAIL;
    } else if (email.length > 0 && !emailCheck()) {
      return CONSTANTS.REG_ERROR_WRONG_EMAIL;
    } else {
      return '';
    }
  };

  const passValidation = (pass: string) => {
    if (pass.length === 0) {
      return CONSTANTS.REG_ERROR_EMPTY_PASS;
    } else if (pass.length > 0 && pass.length < 8) {
      return CONSTANTS.REG_ERROR_SHORT_PASS;
    }
  };

  const confPassValidation = (pass: string, confPass: string) => {
    if (!passValidation(confPass)) {
      if (pass !== confPass) {
        return CONSTANTS.REG_ERROR_DIFF_PASS;
      } else {
        return '';
      }
    } else {
      return passValidation(confPass);
    }
  };

  const registerButtonValidation = () => {
    return emailValidation(email) === '' && confPassValidation(password, confirmPassword) === '';
  };

  const inputsChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    switch (event.currentTarget.name) {
      case 'email':
        setEmail(event.currentTarget.value.trim());
        break;
      case 'password':
        setPassword(event.currentTarget.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(event.currentTarget.value);
        break;
      default:
        break;
    }
  };

  const registerHandler = () => {
    api
      .register(email, password)
      .then(({ data }) => {
        toast.success(data.info);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      })
      .catch(catchHandler);
  };

  if (isLoggedIn) return <Navigate to="/" />;

  return (
    <div className={cn('container', styles.root)}>
      <div className={cn(styles.wrap, 'form-wrap')}>
        <Typography.Title className={cn('form-title')} tag="h1" view="small">
          It-incubator
        </Typography.Title>
        <Typography.Title className={cn('form-subtitle')} tag="h2" view="xsmall">
          Sign Up
        </Typography.Title>
        <Input
          name="email"
          value={email}
          onChange={inputsChangeHandler}
          type="email"
          placeholder="email"
          className={styles.input}
          error={emailValidation(email)}
        />
        <PasswordInput
          value={password}
          placeholder="password"
          name="password"
          onChange={inputsChangeHandler}
          success={passCheck()}
          block
          className={styles.input}
          error={passValidation(password)}
        />
        <PasswordInput
          value={confirmPassword}
          placeholder="confirm password"
          name="confirmPassword"
          onChange={inputsChangeHandler}
          success={confirmPassword.length > 0 && password === confirmPassword}
          block
          className={styles.input}
          error={confPassValidation(password, confirmPassword)}
        />
        <div className={styles.footer}>
          <Link to="/login">
            <Button size="s" view="secondary">
              Cancel
            </Button>
          </Link>
          <Button size="s" view="primary" disabled={!registerButtonValidation()} onClick={registerHandler}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};
