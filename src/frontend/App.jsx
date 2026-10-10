import { useEffect, useState, useCallback } from 'react';
import { api } from './models/api';

// Direct Page Imports: Instantaneous zero-delay route switching without loading spinners or Suspense delays
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import RegistrationForm from './pages/RegistrationForm.jsx';
import StudentStatus from './pages/StudentStatus.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import StudentsList from './pages/StudentsList.jsx';
import StudentDetails from './pages/StudentDetails.jsx';

// Global Component Imports
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ParticlesBackground from './components/ParticlesBackground.jsx';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from './controllers/LanguageContext.jsx';

export default function App() {
  const { lang, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(() => {
    // Check if query contains verification token on initial page load
    const params = new URLSearchParams(window.location.search);
    if (params.get('token') || params.get('verifyToken')) {
      return '/verify-email';
    }
    const path = window.location.pathname;
    const search = window.location.search;
    if (path && path !== '/') {
      return path + search;
    }
    return '/';
  });
  const [bootstrapping, setBootstrapping] = useState(() => {
    // Only show session verification loader if an existing stored auth token is present
    return !!localStorage.getItem('uniport_token');
  });

  // Authenticate session on bootup and protect initial route URLs
  useEffect(() => {
    async function bootstrapSession() {
      const token = localStorage.getItem('uniport_token');
      if (!token) {
        // Unauthenticated visitor attempting direct URL entry into protected routes
        const routePath = currentRoute.split('?')[0];
        if (routePath.startsWith('/admin') || routePath.startsWith('/student')) {
          setCurrentRoute('/login');
          window.history.replaceState({}, '', '/login');
        }
        setBootstrapping(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const isVerificationUrl = params.get('token') || params.get('verifyToken') || currentRoute.startsWith('/verify-email');

      try {
        const userData = await api.auth.me();
        setUser(userData);

        const routePath = currentRoute.split('?')[0];

        // Protected URL route access checks for authenticated session
        if (routePath.startsWith('/admin') && userData.role !== 'admin') {
          const fallback = '/student/dashboard';
          setCurrentRoute(fallback);
          window.history.replaceState({}, '', fallback);
        } else if (routePath.startsWith('/student') && userData.role !== 'student') {
          const fallback = '/admin/dashboard';
          setCurrentRoute(fallback);
          window.history.replaceState({}, '', fallback);
        } else if (!isVerificationUrl && ['/', '/login', '/register'].includes(routePath)) {
          const dest = userData.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
          setCurrentRoute(dest);
          window.history.replaceState({}, '', dest);
        }
      } catch (err) {
        console.error("Expired or corrupted token rejected.");
        localStorage.removeItem('uniport_token');
        setUser(null);

        const routePath = currentRoute.split('?')[0];
        if (routePath.startsWith('/admin') || routePath.startsWith('/student')) {
          setCurrentRoute('/login');
          window.history.replaceState({}, '', '/login');
        }
      } finally {
        setBootstrapping(false);
      }
    }
    bootstrapSession();
  }, []);

  // Sync browser back/forward button navigation and handle auth expiration events
  useEffect(() => {
    const handlePopState = () => {
      const fullPath = window.location.pathname + window.location.search;
      const path = window.location.pathname;
      const token = localStorage.getItem('uniport_token');

      // Reject unauthenticated access to protected routes on popstate
      if (!token && (path.startsWith('/student') || path.startsWith('/admin'))) {
        setCurrentRoute('/login');
        window.history.replaceState({}, '', '/login');
        return;
      }

      if (user && user.role === 'student' && path.startsWith('/admin')) {
        setCurrentRoute('/student/dashboard');
        window.history.replaceState({}, '', '/student/dashboard');
        return;
      }

      if (user && user.role === 'admin' && path.startsWith('/student')) {
        setCurrentRoute('/admin/dashboard');
        window.history.replaceState({}, '', '/admin/dashboard');
        return;
      }

      setCurrentRoute(fullPath || '/');
    };

    const handleAuthExpired = () => {
      setUser(null);
      setCurrentRoute('/login');
      window.history.replaceState({}, '', '/login');
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('uniport_auth_expired', handleAuthExpired);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('uniport_auth_expired', handleAuthExpired);
    };
  }, [user]);

  const handleLoginSuccess = useCallback((token, userData) => {
    localStorage.setItem('uniport_token', token);
    setUser(userData);
    const dest = userData.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    setCurrentRoute(dest);
    window.history.pushState({}, '', dest);
  }, []);

  const handleRegisterSuccess = useCallback((token, userData) => {
    localStorage.setItem('uniport_token', token);
    setUser(userData);
    const dest = userData.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    setCurrentRoute(dest);
    window.history.pushState({}, '', dest);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('uniport_token');
    setUser(null);
    setCurrentRoute('/');
    window.history.pushState({}, '', '/');
  }, []);

  const handleNavigate = useCallback((route) => {
    const routePath = route.split('?')[0];

    // Protected Route Guards
    if (!user && (routePath.startsWith('/student') || routePath.startsWith('/admin'))) {
      setCurrentRoute('/login');
      window.history.pushState({}, '', '/login');
      return;
    }
    if (user && user.role === 'student' && routePath.startsWith('/admin')) {
      setCurrentRoute('/student/dashboard');
      window.history.pushState({}, '', '/student/dashboard');
      return;
    }
    if (user && user.role === 'admin' && routePath.startsWith('/student')) {
      setCurrentRoute('/admin/dashboard');
      window.history.pushState({}, '', '/admin/dashboard');
      return;
    }

    setCurrentRoute(route);
    if (window.location.pathname + window.location.search !== route) {
      window.history.pushState({}, '', route);
    }
  }, [user]);

  if (bootstrapping) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-slate-900 dark:text-zinc-100 gap-3 font-semibold">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-[11px] uppercase tracking-wider text-blue-600 font-bold">
          Verifying secure ASU session keys...
        </span>
      </div>
    );
  }

  // Router Conditional Rendering with strict security render boundary
  const renderPageContent = () => {
    const routePath = currentRoute.split('?')[0];
    const queryPart = currentRoute.includes('?') ? currentRoute.split('?')[1] : '';
    const searchParams = new URLSearchParams(queryPart);

    // Render boundary URL security guards
    if ((routePath.startsWith('/admin') || routePath.startsWith('/student')) && !user) {
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onNavigate={handleNavigate}
          apiService={api}
          currentRoute={currentRoute}
        />
      );
    }
    if (routePath.startsWith('/admin') && user?.role !== 'admin') {
      return (
        <StudentDashboard
          user={user}
          onNavigate={handleNavigate}
          apiService={api}
        />
      );
    }
    if (routePath.startsWith('/student') && user?.role !== 'student') {
      return (
        <AdminDashboard
          onNavigate={handleNavigate}
          apiService={api}
        />
      );
    }

    // Parse dynamic administrative routes
    if (routePath.startsWith('/admin/students/')) {
      const parts = routePath.split('/');
      const studentId = parts[3]; // Matches 'id' in: "" / "admin" / "students" / ":id"
      return (
        <StudentDetails
          id={studentId}
          onBack={() => handleNavigate('/admin/students')}
          apiService={api}
        />
      );
    }

    switch (routePath) {
      case '/':
        return (
          <Home
            onNavigate={handleNavigate}
            isLoggedIn={!!user}
            userRole={user?.role}
          />
        );
      case '/login':
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
            apiService={api}
            currentRoute={currentRoute}
          />
        );
      case '/forgot-password':
        return (
          <Login
            initialForgotPassword={true}
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
            apiService={api}
            currentRoute={currentRoute}
          />
        );
      case '/register':
        return (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onNavigate={handleNavigate}
            apiService={api}
          />
        );
      case '/verify-email':
        return (
          <VerifyEmailPage
            onVerified={handleRegisterSuccess}
            onNavigate={handleNavigate}
            apiService={api}
          />
        );

      // Student views
      case '/student/dashboard':
        return (
          <StudentDashboard
            user={user}
            onNavigate={handleNavigate}
            apiService={api}
          />
        );
      case '/student/register-form':
        return (
          <RegistrationForm
            apiService={api}
            onNavigate={handleNavigate}
          />
        );
      case '/student/status':
        return (
          <StudentStatus
            apiService={api}
            onNavigate={handleNavigate}
          />
        );

      // Administrative views
      case '/admin/dashboard':
        return (
          <AdminDashboard
            onNavigate={handleNavigate}
            apiService={api}
          />
        );
      case '/admin/students':
        return (
          <StudentsList
            onNavigate={handleNavigate}
            apiService={api}
            initialStatus={searchParams.get('status')}
            currentRoute={currentRoute}
          />
        );

      default:
        return (
          <Home
            onNavigate={handleNavigate}
            isLoggedIn={!!user}
            userRole={user?.role}
          />
        );
    }
  };

  // Determine if sidebar should be rendered on student/admin pages
  const showSidebar = user && (currentRoute.startsWith('/student') || currentRoute.startsWith('/admin'));
  const isAuthPage = currentRoute === '/login' || currentRoute === '/register' || currentRoute.startsWith('/verify-email');

  return (
    <div
      dir={lang === 'fa' || lang === 'ps' ? 'rtl' : 'ltr'}
      className={`${isAuthPage ? 'min-h-screen min-h-[100dvh]' : 'min-h-screen'} relative bg-transparent flex flex-col text-slate-950 dark:text-zinc-100 antialiased font-sans transition-colors duration-200 w-full max-w-full overflow-x-hidden ${
        lang === 'fa' || lang === 'ps' ? 'font-sans' : ''
      }`}
    >
      <ParticlesBackground quantity={65} />

      {!isAuthPage && (
        <Navbar
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          currentRoute={currentRoute}
        />
      )}

      {showSidebar ? (
        <div className="flex-1 w-full mx-auto flex flex-col md:flex-row min-h-0 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 gap-4 lg:gap-5 relative z-10">
          <Sidebar
            user={user}
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            apiService={api}
          />
          <main className="flex-1 min-w-0 min-h-0">
            {renderPageContent()}
          </main>
        </div>
      ) : (
        <main className={`flex-1 w-full flex flex-col relative z-10 ${isAuthPage ? 'items-center justify-start py-2 sm:py-4 md:py-6' : 'min-h-0'}`}>
          {renderPageContent()}
        </main>
      )}
    </div>
  );
}
