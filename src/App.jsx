import { useMemo, useState } from 'react';
import NewsCard from './components/NewsCard';

const tickerItems = [
  'Global Summit addresses climate crisis in urgent session...',
  'Market indices reach historic high following tech breakthrough...',
  'New archaeological discovery rewrites early trade history...',
];

const heroStory = {
  tag: 'World News',
  title:
    'The Architecture of the Future: How Digital Twins are Reshaping Urban Living',
  author: 'By Elena Vance',
  readTime: '12 Min Read',
  imageClass: 'hero-visual',
};

const featuredSideStories = [
  {
    id: 1,
    category: 'Tech',
    title: 'The Silicon Valley Pivot: Why AI is Swallowing SaaS',
    excerpt:
      'Industry giants are restructuring entire divisions as LLMs become the core interface of modern software.',
    tone: 'blue',
    tag: 'Featured',
  },
  {
    id: 2,
    category: 'Culture',
    title: 'Retrograde: The Surprising Resurgence of Analog Film',
    excerpt:
      'Gen Z is abandoning pixel-perfect smartphone cameras for the grain and soul of 35mm photography.',
    tone: 'amber',
    tag: 'Popular',
  },
];

const trendingStories = [
  {
    id: 1,
    category: 'Markets',
    title: 'Investors react to the latest earnings cycle',
    excerpt: 'A sharp rise in clean energy and AI sectors lifted the broader market.',
    author: 'Financial Desk',
    time: '4 min read',
    tone: 'blue',
    tag: 'Hot',
  },
  {
    id: 2,
    category: 'Education',
    title: 'Students collaborate on a new campus research exchange',
    excerpt: 'Cross-disciplinary teams are publishing faster with a shared digital lab.',
    author: 'Campus Desk',
    time: '6 min read',
    tone: 'teal',
    tag: 'New',
  },
  {
    id: 3,
    category: 'Science',
    title: 'Satellite imagery shows how cities are cooling streets',
    excerpt: 'Reflective materials and shade planning are reducing local heat spikes.',
    author: 'Science Desk',
    time: '8 min read',
    tone: 'amber',
    tag: 'Insight',
  },
  {
    id: 4,
    category: 'Sports',
    title: 'A marathon start line reimagined for a bigger crowd',
    excerpt: 'A fresh layout gives spectators better views and keeps runners moving.',
    author: 'Sports Desk',
    time: '5 min read',
    tone: 'rose',
    tag: 'Live',
  },
];

const allowedLogin = {
  firstName: 'sandhya',
  lastName: 'tiwari',
  email: 'sandhya@gmail.com',
  password: 'password123',
  role: 'user',
};

const loginFormDefaults = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: '',
};

const signupFormDefaults = {
  name: 'Sandhya Tiwari',
  email: 'sandhya@gmail.com',
  password: 'password123',
};

const demoRole = 'user';

function App() {
  const [screen, setScreen] = useState('auth');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeAuthTab, setActiveAuthTab] = useState('login');
  const [loginForm, setLoginForm] = useState(loginFormDefaults);
  const [signupForm, setSignupForm] = useState(signupFormDefaults);
  const [message, setMessage] = useState('');

  const breakingText = useMemo(() => tickerItems.join('   •   '), []);

  const updateForm = (setter) => (event) => {
    const { name, value } = event.target;
    setter((previous) => ({ ...previous, [name]: value }));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const isAllowedUser =
      loginForm.firstName === allowedLogin.firstName &&
      loginForm.lastName === allowedLogin.lastName &&
      loginForm.email === allowedLogin.email &&
      loginForm.password === allowedLogin.password &&
      loginForm.role === allowedLogin.role;

    if (!isAllowedUser) {
      setMessage('Invalid credentials. Please use the exact allowed login details.');
      return;
    }

    setMessage('Login successful.');
    setIsLoggedIn(true);
    setScreen('home');
  };

  const handleSignup = (event) => {
    event.preventDefault();
    setMessage('Sign up is disabled for this demo. Please use the allowed login details.');
    setActiveAuthTab('login');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setScreen('auth');
    setActiveAuthTab('login');
    setMessage('You have been logged out.');
    setLoginForm(loginFormDefaults);
  };

  if (screen === 'auth') {
    return (
      <div className="auth-page">
        <section className="auth-hero">
          <div className="auth-brand">ESTABLISHED 1924</div>
          <h1>
            The truth is
            <span>asymmetric.</span>
          </h1>
          <p>
            Access our global network of investigative journalism, deep-dive analysis,
            and real-time reporting from the digital broadsheet.
          </p>
          <div className="auth-footer-note">© 2024 Editorial Authority</div>
        </section>

        <section className="auth-panel">
          <div className="auth-panel-head">
            <h2>Welcome Back</h2>
            <p>Sign in to manage your editorial subscriptions and saved articles.</p>
            <span className="auth-role-badge">Role: {demoRole}</span>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Authentication tabs">
            <button
              type="button"
              className={activeAuthTab === 'login' ? 'active' : ''}
              onClick={() => setActiveAuthTab('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={activeAuthTab === 'signup' ? 'active' : ''}
              onClick={() => setActiveAuthTab('signup')}
            >
              Create Account
            </button>
          </div>

          {activeAuthTab === 'login' ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <label htmlFor="login-first-name">First Name</label>
              <input
                id="login-first-name"
                name="firstName"
                type="text"
                placeholder="sandhya"
                value={loginForm.firstName}
                onChange={updateForm(setLoginForm)}
                required
              />

              <label htmlFor="login-last-name">Last Name</label>
              <input
                id="login-last-name"
                name="lastName"
                type="text"
                placeholder="tiwari"
                value={loginForm.lastName}
                onChange={updateForm(setLoginForm)}
                required
              />

              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="sandhya@gmail.com"
                value={loginForm.email}
                onChange={updateForm(setLoginForm)}
                required
              />

              <label htmlFor="login-password">Password</label>
              <div className="input-row">
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={updateForm(setLoginForm)}
                  required
                />
                <span className="field-link">Forgot Password?</span>
              </div>

              <label htmlFor="login-role">Role</label>
              <select
                id="login-role"
                name="role"
                value={loginForm.role}
                onChange={updateForm(setLoginForm)}
                required
              >
                <option value="">Select role</option>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>

              <button type="submit" className="auth-button">
                Login <span aria-hidden="true">→</span>
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignup}>
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                name="name"
                type="text"
                placeholder="Arbish Banta Wara"
                value={signupForm.name}
                onChange={updateForm(setSignupForm)}
              />

              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={signupForm.email}
                onChange={updateForm(setSignupForm)}
              />

              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={signupForm.password}
                onChange={updateForm(setSignupForm)}
              />

              <button type="submit" className="auth-button">
                Create an account <span aria-hidden="true">→</span>
              </button>
            </form>
          )}

          {message ? <p className="auth-message">{message}</p> : null}
        </section>
      </div>
    );
  }

  return (
    <div className="portal-shell">
      <header className="site-header">
        <div className="logo-block">
          <h1>News Portal</h1>
        </div>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#">Politics</a>
          <a href="#">Tech</a>
          <a href="#">Science</a>
          <a href="#">Culture</a>
          <a href="#">Opinion</a>
        </nav>

        <div className="header-actions">
          <div className="search-box">
            <span aria-hidden="true">⌕</span>
            <input type="text" placeholder="Search news..." />
          </div>
          {isLoggedIn ? (
            <>
              <span className="signed-in-badge">Signed in</span>
              <button type="button" className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button type="button" className="login-button" onClick={() => setScreen('auth')}>
              Login
            </button>
          )}
        </div>
      </header>

      <div className="ticker-bar" aria-label="Breaking news ticker">
        <span className="breaking-label">BREAKING</span>
        <div className="ticker-track">
          <div className="ticker-text">{breakingText}</div>
        </div>
      </div>

      <main className="home-content">
        <section className="hero-layout">
          <article className="hero-story">
            <div className="hero-overlay" />
            <div className="hero-tag">WORLD NEWS</div>
            <h2>{heroStory.title}</h2>
            <div className="hero-meta">
              <span>{heroStory.author}</span>
              <span>{heroStory.readTime}</span>
            </div>
          </article>

          <div className="side-stack">
            {featuredSideStories.map((story) => (
              <article key={story.id} className="side-story-card">
                <div className="side-story-text">
                  <span className="card-category">{story.category}</span>
                  <h3>{story.title}</h3>
                  <p>{story.excerpt}</p>
                </div>
                <div className={`side-story-art tone-${story.tone}`} aria-hidden="true">
                  <div className="art-sheen" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-title-row">
          <h3>Trending Now</h3>
          <span className="section-rule" />
        </section>

        <section className="trending-grid">
          {trendingStories.map((story) => (
            <NewsCard key={story.id} article={story} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
