import { FormEvent, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Header from '../../components/header/header';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch, useAppSelector } from '../../store';
import { AuthData } from '../../types/auth-data';
import { loginAction } from '../../store/api-actions';
import { APP_ROUTE, AuthorizationStatus, CITIES } from '../../const';
import { getAuthorizationStatus } from '../../store/selectors';
import { generateRandomNumber } from '../../utils/mocks';
import { City } from '../../types/city';
import { setCity } from '../../store/slice/app-data';

function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const randomCity = CITIES[generateRandomNumber(0, CITIES.length - 1)];
  const navigate = useNavigate();
  const handleCityBind = (city: City) => {
    dispatch(setCity(city));
    navigate(APP_ROUTE.Root);
  };

  const loginRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [passwordError, setPasswordError] = useState('');
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  const isAuth = authorizationStatus === AuthorizationStatus.Auth;

  const validatePassword = (password: string): boolean => {
    const hasLetter = /[a-zA-Zа-яА-Я]/.test(password);
    const hasDigit = /\d/.test(password);
    return hasLetter && hasDigit;
  };

  const onSubmit = (authData: AuthData) => {
    dispatch(loginAction(authData));
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (loginRef.current !== null && passwordRef.current !== null) {
      const password = passwordRef.current.value;

      if (!validatePassword(password)) {
        setPasswordError('Пароль должен содержать минимум одну букву и одну цифру');
        return;
      }

      setPasswordError('');
      onSubmit({
        login: loginRef.current.value,
        password: password,
      });
    }
  };

  const handlePasswordChange = () => {
    if (passwordError) {
      setPasswordError('');
    }
  };

  if (isAuth) {
    return <Navigate to={APP_ROUTE.Root} replace />;
  }

  return (
    <div className="page page--gray page--login">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Header />
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form onSubmit={handleSubmit} className="login__form form" action="#" method="post">
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  ref={loginRef}
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  data-testid="emailElement"
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  ref={passwordRef}
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handlePasswordChange}
                  data-testid="passwordElement"
                />
              </div>
              <button className="login__submit form__submit button" type="submit">
                Sign in
              </button>
              {passwordError && (
                <div
                  data-testid="password-error"
                  style={{
                    color: 'red',
                    fontSize: '12px',
                    marginTop: '5px',
                    position: 'absolute'
                  }}
                >
                  {passwordError}
                </div>
              )}
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a className="locations__item-link" onClick={() => handleCityBind(randomCity)}>
                <span>{randomCity.name}</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
