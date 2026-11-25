import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { BrandLogo, Button } from '@/Components/Common';
import styles from './style.module.css';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';
import { validateLoginForm, validateRegisterForm } from '@/utils/validation';

export default function LoginComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [userLoginMethod, setLoginMethod] = useState(true);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.mode === 'signup') {
      setLoginMethod(false);
    } else if (router.query.mode === 'signin') {
      setLoginMethod(true);
    }
    if (router.query.email && typeof router.query.email === 'string') {
      setEmail(router.query.email);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (authState.loggedIn) {
      router.push('/dashboard');
    }
  }, [authState.loggedIn, router]);

  useEffect(() => {
    if (!authState.message) return;
    const timer = setTimeout(() => {
      dispatch(emptyMessage());
    }, 4000);
    return () => clearTimeout(timer);
  }, [authState.message, dispatch]);

  const handleToggleMode = () => {
    dispatch(emptyMessage());
    setFieldErrors({});
    setLoginMethod((prev) => !prev);
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = userLoginMethod
      ? validateLoginForm({ email, password })
      : validateRegisterForm({ name, username, email, password });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});

    if (userLoginMethod) {
      try {
        await dispatch(loginUser({ email: email.trim(), password })).unwrap();
      } catch {
        // Error banner handled by authReducer rejected state
      }
      return;
    }

    try {
      await dispatch(
        registerUser({
          username: username.trim().toLowerCase(),
          name: name.trim(),
          email: email.trim(),
          password,
        })
      ).unwrap();
      setLoginMethod(true);
    } catch {
      // Error banner handled by authReducer rejected state
    }
  };

  const backendMessage = authState.message
    ? typeof authState.message === 'object'
      ? authState.message.message || JSON.stringify(authState.message)
      : authState.message
    : null;

  return (
    <>
      <Head>
        <title>{userLoginMethod ? 'Sign In | ConnectIn' : 'Sign Up | ConnectIn'}</title>
        <meta
          name="description"
          content="Sign in or join ConnectIn to connect with colleagues and build your professional network."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className={styles.pageContainer}>
        <header className={styles.headerBar}>
          <div className={styles.brandLogo}>
            <BrandLogo className={styles.logoSvg} onClick={() => router.push('/')} />
          </div>
        </header>

        <main className={styles.mainContent}>
          {!userLoginMethod && (
            <h1 className={styles.signupTopHeadline}>
              Make the most of your professional life
            </h1>
          )}

          <div className={`${styles.authCard} ${!userLoginMethod ? styles.authCardSignUp : ''}`}>
            {userLoginMethod && (
              <>
                <h1 className={styles.cardTitle}>Sign in</h1>
                <p className={styles.cardSubtitle}>Stay updated on your professional world</p>
              </>
            )}

            {backendMessage && (
              <div
                className={`${styles.alertBanner} ${authState.isError ? styles.alertError : styles.alertSuccess}`}
                role="alert"
              >
                <span className={styles.alertText}>{backendMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.formElement} noValidate>
              {!userLoginMethod && (
                <div className={styles.nameRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="nameInput" className={styles.inputLabel}>
                      Full name
                    </label>
                    <input
                      id="nameInput"
                      type="text"
                      value={name}
                      onChange={handleInputChange(setName, 'name')}
                      className={`${styles.inputField} ${fieldErrors.name ? styles.inputError : ''}`}
                      autoComplete="name"
                      aria-invalid={Boolean(fieldErrors.name)}
                    />
                    {fieldErrors.name && (
                      <span className={styles.inlineError} role="alert">
                        {fieldErrors.name}
                      </span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="usernameInput" className={styles.inputLabel}>
                      Username
                    </label>
                    <input
                      id="usernameInput"
                      type="text"
                      value={username}
                      onChange={handleInputChange(setUsername, 'username')}
                      className={`${styles.inputField} ${fieldErrors.username ? styles.inputError : ''}`}
                      autoComplete="username"
                      aria-invalid={Boolean(fieldErrors.username)}
                    />
                    {fieldErrors.username && (
                      <span className={styles.inlineError} role="alert">
                        {fieldErrors.username}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="emailInput" className={styles.inputLabel}>
                  Email
                </label>
                <input
                  id="emailInput"
                  type="email"
                  value={email}
                  onChange={handleInputChange(setEmail, 'email')}
                  className={`${styles.inputField} ${fieldErrors.email ? styles.inputError : ''}`}
                  autoComplete="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                {fieldErrors.email && (
                  <span className={styles.inlineError} role="alert">
                    {fieldErrors.email}
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="passwordInput" className={styles.inputLabel}>
                  <span>Password</span>
                  {!userLoginMethod && (
                    <span className={styles.hintText}>(6+ characters)</span>
                  )}
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="passwordInput"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handleInputChange(setPassword, 'password')}
                    className={`${styles.inputField} ${styles.passwordInput} ${fieldErrors.password ? styles.inputError : ''}`}
                    autoComplete={userLoginMethod ? 'current-password' : 'new-password'}
                    aria-invalid={Boolean(fieldErrors.password)}
                  />
                  <button
                    type="button"
                    className={styles.showPasswordBtn}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className={styles.inlineError} role="alert">
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              {!userLoginMethod && (
                <p className={styles.termsText}>
                  By clicking Agree & Join or Continue, you agree to the ConnectIn{' '}
                  <span className={styles.termsLink}>User Agreement</span>,{' '}
                  <span className={styles.termsLink}>Privacy Policy</span>, and{' '}
                  <span className={styles.termsLink}>Cookie Policy</span>.
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={authState.isLoading}
                className={styles.submitBtn}
              >
                {userLoginMethod ? 'Sign in' : 'Agree & Join'}
              </Button>
            </form>
          </div>

          <div className={styles.switchModeWrapper}>
            <span>{userLoginMethod ? 'New to ConnectIn?' : 'Already on ConnectIn?'}</span>
            <button
              type="button"
              onClick={handleToggleMode}
              className={styles.switchActionLink}
            >
              {userLoginMethod ? 'Join now' : 'Sign in'}
            </button>
          </div>
        </main>

        <footer className={styles.footerSection}>
          <div className={styles.footerInner}>
            <span className={styles.footerBrand}>ConnectIn © {new Date().getFullYear()}</span>
            <span className={styles.footerItem}>User Agreement</span>
            <span className={styles.footerItem}>Privacy Policy</span>
            <span className={styles.footerItem}>Community Guidelines</span>
            <span className={styles.footerItem}>Cookie Policy</span>
            <span className={styles.footerItem}>Copyright Policy</span>
          </div>
        </footer>
      </div>
    </>
  );
}
