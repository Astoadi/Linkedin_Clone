import React from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';
import { BrandLogo } from '@/Components/Common';

export default function NavBarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleLogOutUser = () => {
    localStorage.removeItem('token');
    dispatch(reset());
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navContainer} aria-label="Main Navigation">
        <div className={styles.logoWrapper}>
          <BrandLogo
            className={styles.brandSvg}
            onClick={() => router.push('/')}
            ariaLabel="ConnectIn Homepage"
          />
        </div>

        <div className={styles.actionsContainer}>
          {authState.profileFetched ? (
            <div className={styles.navLinksList}>
              <div
                className={`${styles.navItem} ${router.pathname === '/dashboard' ? styles.activeNavItem : ''}`}
                onClick={() => router.push('/dashboard')}
                title="Feed"
              >
                <svg className={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                <span className={styles.navLabel}>Feed</span>
              </div>

              <div
                className={`${styles.navItem} ${router.pathname === '/my_connections' ? styles.activeNavItem : ''}`}
                onClick={() => router.push('/my_connections')}
                title="My Network"
              >
                <svg className={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                <span className={styles.navLabel}>My Network</span>
              </div>

              <div
                className={`${styles.navItem} ${router.pathname === '/discover' ? styles.activeNavItem : ''}`}
                onClick={() => router.push('/discover')}
                title="Discover"
              >
                <svg className={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                <span className={styles.navLabel}>Discover</span>
              </div>

              <div
                className={`${styles.navItem} ${router.pathname === '/profile' ? styles.activeNavItem : ''}`}
                onClick={() => router.push('/profile')}
                title="Profile"
              >
                <svg className={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span className={styles.navLabel}>Profile</span>
              </div>

              <div className={styles.divider} />

              <button type="button" className={styles.logoutButton} onClick={handleLogOutUser}>
                Sign Out
              </button>
            </div>
          ) : (
            <div className={styles.guestNavList}>
              <div
                className={styles.guestNavItem}
                onClick={() => router.push('/discover')}
                title="Discover Members"
              >
                <svg className={styles.guestNavIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                <span className={styles.guestNavLabel}>Discover</span>
              </div>

              <div className={styles.divider} />

              <button
                type="button"
                className={styles.joinButton}
                onClick={() => router.push('/login?mode=signup')}
              >
                Join now
              </button>

              <button
                type="button"
                className={styles.signInButton}
                onClick={() => router.push('/login?mode=signin')}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
