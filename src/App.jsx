import { useMemo, useState } from 'react';

const fixedUser = {
  firstName: 'Sandhya',
  lastName: 'Tiwari',
  email: 'sandhya@gmail.com',
  password: 'password123',
  role: 'user',
};

const initialSignUpState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

const initialLoginState = {
  email: '',
  password: '',
};

function App() {
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(initialLoginState);
  const [signUpForm, setSignUpForm] = useState(initialSignUpState);
  const [rememberMe, setRememberMe] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const authHint = useMemo(
    () => `${fixedUser.email} / ${fixedUser.password}`,
    []
  );

  const onLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((previous) => ({ ...previous, [name]: value }));
  };

  const onSignUpChange = (event) => {
    const { name, value } = event.target;
    setSignUpForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const emailMatches = loginForm.email.trim().toLowerCase() === fixedUser.email;
    const passwordMatches = loginForm.password === fixedUser.password;

    if (emailMatches && passwordMatches) {
      setStatus({
        type: 'success',
        text: `Welcome ${fixedUser.firstName} ${fixedUser.lastName}. Role: ${fixedUser.role}. Remember me: ${rememberMe ? 'yes' : 'no'}.`,
      });
      return;
    }

    setStatus({
      type: 'error',
      text: 'Invalid credentials. Only the configured demo account can log in right now.',
    });
  };

  const handleSignUp = (event) => {
    event.preventDefault();

    const isDemoUser =
      signUpForm.firstName.trim().toLowerCase() === fixedUser.firstName.toLowerCase() &&
      signUpForm.lastName.trim().toLowerCase() === fixedUser.lastName.toLowerCase() &&
      signUpForm.email.trim().toLowerCase() === fixedUser.email &&
      signUpForm.password === fixedUser.password;

    if (isDemoUser) {
      setStatus({
        type: 'success',
        text: 'Demo user matches backend record. Switch to Login tab and use those credentials.',
      });
      return;
    }

    setStatus({
      type: 'error',
      text: 'Signup is locked for now. Only the backend-provided demo user is accepted.',
    });
  };

  return (
    <div className="page-shell">
      <main className="auth-card">
        <section className="brand-panel">
          <span className="badge">ESTABLISHED 2024</span>
          <h1>
            The truth is
            <br />
            <span>asymmetric.</span>
          </h1>
          <p>
            Access your editorial command center with secure sign in and direct role
            mapping from your backend profile.
          </p>
          <small>Demo account is currently the only active profile.</small>
        </section>

        <section className="form-panel">
          <div className="mode-switch">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>

          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="subtitle">
            {mode === 'login'
              ? 'Sign in using the backend-configured user only.'
              : 'Signup form is available for UI flow, but only the configured user is accepted.'}
          </p>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={loginForm.email}
                onChange={onLoginChange}
                placeholder="Enter email"
                required
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={loginForm.password}
                onChange={onLoginChange}
                placeholder="Enter password"
                required
              />

              <label className="check-row" htmlFor="rememberMe">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Keep me logged in
              </label>

              <button type="submit" className="submit-btn">
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="auth-form">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={signUpForm.firstName}
                onChange={onSignUpChange}
                placeholder="Sandhya"
                required
              />

              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={signUpForm.lastName}
                onChange={onSignUpChange}
                placeholder="Tiwari"
                required
              />

              <label htmlFor="signUpEmail">Email</label>
              <input
                id="signUpEmail"
                name="email"
                type="email"
                value={signUpForm.email}
                onChange={onSignUpChange}
                placeholder="sandhya@gmail.com"
                required
              />

              <label htmlFor="signUpPassword">Password</label>
              <input
                id="signUpPassword"
                name="password"
                type="password"
                value={signUpForm.password}
                onChange={onSignUpChange}
                placeholder="password123"
                required
              />

              <button type="submit" className="submit-btn">
                Verify Signup
              </button>
            </form>
          )}

          <p className="hint">Allowed credentials: {authHint}</p>

          {status.text ? (
            <div className={`status-box ${status.type}`} role="alert">
              {status.text}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default App;
