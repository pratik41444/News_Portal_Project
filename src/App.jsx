// ============================================================================
// App.jsx - Main Application Component
// ============================================================================
// This is the root React component for the news portal application.
// It manages:
// - User authentication (login/logout, role-based access)
// - Screen/page state navigation (home, auth, admin views)
// - Content display (hero stories, featured articles, trending cards)
// - Modal interactions (auth prompts, ad placements)
// - Interactive event handling (click-triggered ad displays)
// ============================================================================

import { useCallback, useMemo, useState } from 'react';
import NewsCard from './components/NewsCard';
import useAdTrigger from './hooks/useAdTrigger';

// ============================================================================
// CONTENT DATA STRUCTURES
// ============================================================================

// Breaking news ticker items displayed in the header
const tickerItems = [
  'Global Summit addresses climate crisis in urgent session...',
  'Market indices reach historic high following tech breakthrough...',
  'New archaeological discovery rewrites early trade history...',
];

// Main hero story object displayed prominently on the homepage
const heroStory = {
  tag: 'World News',
  title:
    'The Architecture of the Future: How Digital Twins are Reshaping Urban Living',
  author: 'By Elena Vance',
  readTime: '12 Min Read',
  imageClass: 'hero-visual',
};

// Featured stories displayed in the sidebar
const featuredSideStories = [
  {
    id: 1,
    category: 'Tech',
    title: 'The Silicon Valley Pivot: Why AI is Swallowing SaaS',
    excerpt:
      'Industry giants are restructuring entire divisions as LLMs become the core interface of modern software.',
    tone: 'blue', // CSS class for styling/color theme
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

// Trending articles displayed in the main grid section
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

// ============================================================================
// AUTHENTICATION & FORM DATA
// ============================================================================

// Hardcoded valid user credentials for demo purposes
// In production, this would come from a backend API with secure hashing
const allowedLogin = {
  firstName: 'sandhya',
  lastName: 'tiwari',
  email: 'sandhya@gmail.com',
  password: 'password123',
  role: 'user',
};

// Initial empty state for the user login form
const loginFormDefaults = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

// Initial state for the signup form
const signupFormDefaults = {
  name: 'Sandhya Tiwari',
  email: 'sandhya@gmail.com',
  password: 'password123',
};

// Initial state for admin login form
const adminLoginDefaults = {
  username: '',
  password: '',
};

// ============================================================================
// ADMIN DASHBOARD DATA
// ============================================================================

// Key metrics displayed in admin dashboard
const adminHighlights = [
  {
    label: 'Pending Reviews',
    value: '18',
    detail: 'Stories waiting for editorial approval',
  },
  {
    label: 'Active Campaigns',
    value: '7',
    detail: 'Sponsored placements currently running',
  },
  {
    label: 'Homepage CTR',
    value: '4.8%',
    detail: 'Engagement across the last 24 hours',
  },
];

// Tasks in the admin editorial review queue
const adminQueue = [
  {
    id: 1,
    title: 'Approve investigative feature on urban mobility',
    meta: 'Editorial review due in 2 hours',
  },
  {
    id: 2,
    title: 'Refresh promotional placements for the science desk',
    meta: 'Ad inventory update needed today',
  },
  {
    id: 3,
    title: 'Audit the trending module for duplicate stories',
    meta: 'Cross-check source tags and thumbnails',
  },
];

// Library of sponsored ads that appear randomly during user interactions
const adLibrary = [
  {
    label: 'Sponsored Insight',
    title: 'Upgrade your newsroom workflow',
    copy: 'Run faster editorial approvals with a unified planning board and shared notes.',
    cta: 'Explore Suite',
    tone: 'blue',
  },
  {
    label: 'Partner Offer',
    title: 'A premium analytics layer for publishers',
    copy: 'Track story lift, audience retention, and campaign value from one dashboard.',
    cta: 'View Demo',
    tone: 'amber',
  },
  {
    label: 'Breaking Promotion',
    title: 'Turn attention into subscription growth',
    copy: 'Convert high-intent readers with tailored placement and dynamic offers.',
    cta: 'See Pricing',
    tone: 'teal',
  },
];

// Demo user role for display purposes
const demoRole = 'user';

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
function App() {
  // SCREEN STATE: Determines which view is rendered (home, auth, admin)
  const [screen, setScreen] = useState('home');
  
  // LOGIN STATE: Tracks whether user is authenticated
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // AUTH UI STATE: Tracks which auth tab is active (login, admin, signup)
  const [activeAuthTab, setActiveAuthTab] = useState('login');
  
  // FORM STATES: Store user input for login/admin/signup forms
  const [loginForm, setLoginForm] = useState(loginFormDefaults);
  const [signupForm, setSignupForm] = useState(signupFormDefaults);
  const [adminForm, setAdminForm] = useState(adminLoginDefaults);
  
  // MODAL STATES: Control visibility of auth and ad modals
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [adModal, setAdModal] = useState(null);
  
  // FEEDBACK MESSAGE: Displays auth success/error messages to user
  const [message, setMessage] = useState('');

  // ========================================================================
  // MEMOIZED / DERIVED VALUES
  // ========================================================================
  
  // Concatenate ticker items into a single scrolling string with bullet separators
  // useMemo prevents recalculation on every render unless tickerItems changes
  const breakingText = useMemo(() => tickerItems.join('   •   '), []);
  
  // Returns the current ad modal if one is active, otherwise null
  // Used to conditionally render the ad display modal
  const adminVisibleAd = useMemo(() => {
    if (adModal) {
      return adModal;
    }
    return null;
  }, [adModal]);

  // ========================================================================
  // FORM HANDLING FUNCTIONS
  // ========================================================================

  /**
   * updateForm - Generic form input handler factory
   * Creates a handler function for a specific form state setter
   * Updates form state with input name and value
   * @param {function} setter - The state setter (e.g., setLoginForm)
   * @returns {function} Event handler for input onChange events
   */
  const updateForm = (setter) => (event) => {
    const { name, value } = event.target;
    setter((previous) => ({ ...previous, [name]: value }));
  };

  /**
   * openRandomAd - Selects and displays a random ad from the library
   * Used when ad trigger threshold is reached
   */
  const openRandomAd = useCallback(() => {
    const ad = adLibrary[Math.floor(Math.random() * adLibrary.length)];
    setAdModal(ad);
  }, []);

  const { registerInteraction, resetCounter } = useAdTrigger(openRandomAd);

  // ========================================================================
  // INTERACTION & CLICK HANDLING
  // ========================================================================

  /**
   * handleInteractiveClick - Manages user interactions on the homepage
   * Behavior:
   * - Only active when on home screen
   * - If not logged in, shows auth prompt
   * - If ad is currently open, does nothing
   * - Otherwise, increments click counter
   * - When counter reaches trigger threshold, displays a random ad
   * - Resets counter and generates new random trigger after ad display
   */
  const handleInteractiveClick = () => {
    // Only track interactions on home screen
    if (screen !== 'home') {
      return;
    }

    // Require login before allowing interactions
    if (!isLoggedIn) {
      setShowAuthPrompt(true);
      return;
    }

    // Don't count clicks while ad is already open
    if (adModal) {
      return;
    }
    registerInteraction();
  };

  // ========================================================================
  // AUTHENTICATION HANDLERS
  // ========================================================================

  /**
   * handleLogin - Validates user credentials and logs in
   * Checks all form fields against allowed credentials
   * Updates UI state and messages accordingly
   */
  const handleLogin = (event) => {
    event.preventDefault();
    
    // Validate all credential fields match allowed user
    const isAllowedUser =
      loginForm.firstName === allowedLogin.firstName &&
      loginForm.lastName === allowedLogin.lastName &&
      loginForm.email === allowedLogin.email &&
      loginForm.password === allowedLogin.password;

    // Show error if credentials invalid
    if (!isAllowedUser) {
      setMessage('Invalid credentials. Please use the exact allowed login details.');
      return;
    }

    // Successful login - update state and navigate to home
    setMessage('Login successful.');
    setIsLoggedIn(true);
    setScreen('home');
    setShowAuthPrompt(false);
  };

  /**
   * handleAdminLogin - Validates admin credentials and grants admin access
   * Admin uses default demo credentials (admin / admin)
   */
  const handleAdminLogin = (event) => {
    event.preventDefault();

    // Check admin credentials (simple demo validation)
    if (adminForm.username !== 'admin' || adminForm.password !== 'admin') {
      setMessage('Invalid admin credentials. Use admin / admin to access the admin console.');
      return;
    }

    // Grant admin access and navigate to admin panel
    setMessage('Admin access granted.');
    setIsLoggedIn(true);
    setScreen('admin');
    setShowAuthPrompt(false);
  };

  /**
   * handleSignup - Handles signup form submission
   * Currently disabled in demo; shows message and reverts to login tab
   */
  const handleSignup = (event) => {
    event.preventDefault();
    setMessage('Sign up is disabled for this demo. Please use the allowed login details.');
    setActiveAuthTab('login');
  };

  /**
   * handleLogout - Clears all session state and returns to auth screen
   * Resets forms, modals, counters, and user state
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setScreen('auth');
    setActiveAuthTab('login');
    setMessage('You have been logged out.');
    setLoginForm(loginFormDefaults);
    setAdminForm(adminLoginDefaults);
    setShowAuthPrompt(false);
    setAdModal(null);
    resetCounter();
  };

  /**
   * closeAdModal - Closes the currently displayed ad modal
   */
  const closeAdModal = () => {
    setAdModal(null);
    resetCounter();
  };

  // ========================================================================
  // RENDER FUNCTIONS
  // ========================================================================

  /**
   * renderAuthPanel - Returns the authentication UI (login, signup, admin forms)
   * Content changes based on activeAuthTab state
   */
  const renderAuthPanel = () => (
    <>
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
          className={activeAuthTab === 'admin' ? 'active' : ''}
          onClick={() => setActiveAuthTab('admin')}
        >
          Admin
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

          <button type="submit" className="auth-button">
            Login <span aria-hidden="true">→</span>
          </button>
        </form>
      ) : activeAuthTab === 'admin' ? (
        <form className="auth-form" onSubmit={handleAdminLogin}>
          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            name="username"
            type="text"
            placeholder="admin"
            value={adminForm.username}
            onChange={updateForm(setAdminForm)}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            placeholder="admin"
            value={adminForm.password}
            onChange={updateForm(setAdminForm)}
            required
          />

          <button type="submit" className="auth-button auth-button-admin">
            Open Admin Console <span aria-hidden="true">→</span>
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
    </>
  );

  // ========================================================================
  // CONDITIONAL RENDERING - SCREEN STATES
  // ========================================================================

  // SCREEN 1: Authentication Screen
  // Rendered when user is not logged in or explicitly navigates to auth
  // Displays login/signup forms and branded hero section
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
          {renderAuthPanel()}
        </section>
      </div>
    );
  }

  // SCREEN 2: Admin Dashboard
  // Displayed when admin user logs in
  // Shows editorial review queue, metrics, and ad management tools
  if (screen === 'admin') {
    return (
      <div className="portal-shell admin-shell" onClickCapture={handleInteractiveClick}>
        <header className="site-header admin-header">
          <div className="logo-block">
            <h1>News Portal</h1>
          </div>

          <nav className="site-nav" aria-label="Primary navigation">
            <a href="#">Overview</a>
            <a href="#">Reviews</a>
            <a href="#">Campaigns</a>
            <a href="#">Ads</a>
            <a href="#">Reports</a>
          </nav>

          <div className="header-actions">
            <span className="admin-badge">Admin Console</span>
            <button type="button" className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="ticker-bar" aria-label="Breaking news ticker">
          <span className="breaking-label">ADMIN</span>
          <div className="ticker-track">
            <div className="ticker-text">Editorial dashboards, promotions, and moderation tools in one view.</div>
          </div>
        </div>

        <main className="home-content admin-content">
          <section className="admin-hero">
            <div>
              <span className="hero-tag">CONTROL ROOM</span>
              <h2>Manage the newsroom from a single polished console.</h2>
              <p>
                Review stories, monitor campaigns, and surface premium placements with the same visual rhythm as the public homepage.
              </p>
            </div>

            <div className="admin-status-panel">
              <span className="admin-status-label">Session status</span>
              <strong>Signed in as admin</strong>
              <p>Click anywhere in the console and a sponsored card appears after 5 or 6 interactions.</p>
            </div>
          </section>

          <section className="admin-highlights">
            {adminHighlights.map((item) => (
              <article key={item.label} className="admin-metric-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </section>

          <section className="admin-grid">
            <article className="admin-panel admin-panel-large">
              <div className="section-title-row">
                <h3>Editorial Queue</h3>
                <span className="section-rule" />
              </div>

              <div className="admin-list">
                {adminQueue.map((item) => (
                  <div key={item.id} className="admin-list-item">
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.meta}</p>
                    </div>
                    <button type="button" className="admin-action-button">
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-panel">
              <div className="section-title-row">
                <h3>Ad Rotation</h3>
                <span className="section-rule" />
              </div>

              <div className="admin-copy-stack">
                <p>
                  Random ad cards are triggered at a 5 or 6 click interval to mimic an editorial sponsorship flow.
                </p>
                <button type="button" className="auth-button auth-button-admin" onClick={openRandomAd}>
                  Preview Ad Placement <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          </section>
        </main>

      </div>
    );
  }

  // SCREEN 3: Home/Default Screen
  // Main news portal view displayed to logged-in users
  // Includes: breaking news ticker, hero article, featured stories, trending articles
  // Click interactions trigger auth prompts (if not logged in) or ad displays
  return (
    <div className="portal-shell" onClickCapture={handleInteractiveClick}>
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

      {/* MODAL 1: Auth Prompt - Shows when non-logged-in user interacts with page */}
      {!isLoggedIn && showAuthPrompt ? (
        <div className="auth-modal-backdrop" role="presentation" onClick={() => setShowAuthPrompt(false)}>
          <section className="auth-modal-panel" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="auth-modal-close" onClick={() => setShowAuthPrompt(false)} aria-label="Close login prompt">
              ×
            </button>
            <div className="auth-modal-copy">
              <span className="auth-modal-kicker">Members only</span>
              <h2 id="auth-modal-title">Sign in to use the newsroom</h2>
              <p>Clicking the page opens this prompt. Log in or create an account to continue browsing the portal.</p>
            </div>
            <section className="auth-panel auth-panel-compact">
              {renderAuthPanel()}
            </section>
          </section>
        </div>
      ) : null}

      {/* MODAL 2: Ad Display - Shows triggered ads after click threshold reached */}
      {isLoggedIn && adModal ? (
        <div className="ad-modal-backdrop" role="presentation" onClick={closeAdModal}>
          <article className={`ad-modal tone-${adModal.tone}`} role="dialog" aria-modal="true" aria-label={adModal.title} onClick={(event) => event.stopPropagation()}>
            <span className="news-card-tag">{adModal.label}</span>
            <h3>{adModal.title}</h3>
            <p>{adModal.copy}</p>
            <div className="ad-modal-actions">
              <button type="button" className="auth-button auth-button-admin" onClick={closeAdModal}>
                {adModal.cta}
              </button>
              <button type="button" className="admin-dismiss-button" onClick={closeAdModal}>
                Dismiss
              </button>
            </div>
          </article>
        </div>
      ) : null}
    </div>
  );
}

export default App;


