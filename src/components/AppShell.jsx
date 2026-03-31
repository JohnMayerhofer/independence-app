import { useEffect, useState } from 'react';
import { useGoals } from '../store/GoalContext';
import { initGapi, initTokenClient, requestToken, signOut as apiSignOut } from '../api/sheets';

const VIEWS = ['Goals', 'Progress', 'Background'];

export default function AppShell({ currentView, onViewChange, children }) {
  const { state, setAuth, signOut, fetchGoals } = useGoals();
  const [gapiReady, setGapiReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    async function setup() {
      await initGapi();
      initTokenClient(
        async ({ user, canEditTeam }) => {
          setAuth(user, canEditTeam);
          setAuthLoading(false);
          await fetchGoals();
        },
        () => setAuthLoading(false)
      );
      setGapiReady(true);
    }
    setup();
  }, []);

  function handleSignIn() {
    setAuthLoading(true);
    requestToken();
  }

  function handleSignOut() {
    apiSignOut();
    signOut();
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title">
          <span className="app-title-main">Independence</span>
          <span className="app-title-sub">Progress Tracker</span>
        </div>
        <nav className="app-nav">
          {VIEWS.map((v) => (
            <button
              key={v}
              className={`nav-btn ${currentView === v ? 'active' : ''}`}
              onClick={() => onViewChange(v)}
            >
              {v}
            </button>
          ))}
        </nav>
        <div className="app-auth">
          {state.authed ? (
            <div className="user-info">
              {state.user?.picture && (
                <img src={state.user.picture} className="user-avatar" alt="" />
              )}
              <div className="user-details">
                <span className="user-name">{state.user?.name}</span>
                <span className="user-role">
                  {state.canEditSelf ? 'Self Eval' : state.canEditTeam ? 'Support Team' : 'Viewer'}
                </span>
              </div>
              <button className="btn btn-sm" onClick={handleSignOut}>Sign Out</button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSignIn}
              disabled={!gapiReady || authLoading}
            >
              {authLoading ? 'Signing in...' : 'Sign In with Google'}
            </button>
          )}
        </div>
      </header>
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
