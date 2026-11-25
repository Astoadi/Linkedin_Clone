import React, { useEffect } from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, getAboutUser } from '@/config/redux/action/authAction';
import { UserAvatar } from '@/Components/Common';

export default function DashBoardLayout({ children, showRightSidebar = true }) {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    dispatch(setTokenIsThere());

    if (!authState.profileFetched) {
      dispatch(getAboutUser({ token }));
    }
    if (!authState.allProfilesFetched) {
      dispatch(getAllUsers());
    }
  }, [dispatch, router, authState.profileFetched, authState.allProfilesFetched]);

  const currentUser = authState.user;
  const recommendedUsers = (authState.allUsers || [])
    .filter((u) => u?.userId?._id && u.userId._id !== currentUser?.userId?._id)
    .slice(0, 3);

  const currentPath = router.pathname;

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.mainGrid}>
        <aside className={styles.leftSidebar}>
          <div className={styles.stickyLeft}>
            <div className={styles.userCard}>
              <div className={styles.cardBanner} />
              <div
                className={styles.avatarWrapper}
                onClick={() => router.push('/profile')}
                title="View Profile"
              >
                <UserAvatar
                  src={currentUser?.userId?.profilePictureUrl}
                  name={currentUser?.userId?.name}
                  imageClassName={styles.userAvatar}
                  fallbackClassName={styles.avatarFallback}
                />
              </div>

              <div className={styles.userMeta}>
                <h3 className={styles.userName} onClick={() => router.push('/profile')}>
                  {currentUser?.userId?.name || 'ConnectIn Member'}
                </h3>
                <p className={styles.userHeadline}>
                  {currentUser?.currentPosition ||
                    currentUser?.bio ||
                    (currentUser?.userId?.username ? `@${currentUser.userId.username}` : 'Member at ConnectIn')}
                </p>
              </div>

              <div
                className={styles.userStats}
                onClick={() => router.push('/my_connections')}
                title="Manage Connections"
              >
                <div className={styles.statRow}>
                  <div>
                    <span className={styles.statLabel}>Connections</span>
                    <div className={styles.statSubtitle}>Grow your network</div>
                  </div>
                  <span className={styles.statValue}>Manage</span>
                </div>
              </div>

              <div className={styles.cardFooter} onClick={() => router.push('/profile')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
                <span>My Profile</span>
              </div>
            </div>

            <div className={styles.navCard}>
              <div
                className={`${styles.navItem} ${currentPath === '/dashboard' ? styles.navItemActive : ''}`}
                onClick={() => router.push('/dashboard')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span>Feed</span>
              </div>

              <div
                className={`${styles.navItem} ${currentPath === '/my_connections' ? styles.navItemActive : ''}`}
                onClick={() => router.push('/my_connections')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
                <span>My Network</span>
              </div>

              <div
                className={`${styles.navItem} ${currentPath === '/discover' ? styles.navItemActive : ''}`}
                onClick={() => router.push('/discover')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <span>Discover</span>
              </div>
            </div>
          </div>
        </aside>

        <main className={styles.feedColumn}>{children}</main>

        {showRightSidebar && (
          <aside className={styles.rightSidebar}>
            <div className={styles.stickyRight}>
              <div className={styles.widgetCard}>
                <div className={styles.widgetHeader}>
                  <h3 className={styles.widgetTitle}>Add to your feed</h3>
                  <svg className={styles.widgetInfoIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                  </svg>
                </div>

                <div className={styles.recommendationsList}>
                  {recommendedUsers.length > 0 ? (
                    recommendedUsers.map((rec) => {
                      const recUsername = rec?.userId?.username;
                      const recName = rec?.userId?.name || 'Member';
                      const recHeadline = rec?.currentPosition || `@${recUsername}`;

                      return (
                        <div key={rec.userId._id} className={styles.recItem}>
                          <UserAvatar
                            src={rec?.userId?.profilePictureUrl}
                            name={recName}
                            imageClassName={styles.recAvatar}
                            fallbackClassName={styles.recAvatarFallback}
                            onClick={() => router.push(`/view_profile/${recUsername}`)}
                          />

                          <div className={styles.recMeta}>
                            <h4
                              className={styles.recName}
                              onClick={() => router.push(`/view_profile/${recUsername}`)}
                              title={recName}
                            >
                              {recName}
                            </h4>
                            <p className={styles.recHeadline}>{recHeadline}</p>
                            <button
                              type="button"
                              className={styles.recButton}
                              onClick={() => router.push(`/view_profile/${recUsername}`)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                              </svg>
                              <span>View</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.6)', margin: 0 }}>
                      No recommendations right now.
                    </p>
                  )}
                </div>

                <div className={styles.viewAllLink} onClick={() => router.push('/discover')}>
                  View all recommendations →
                </div>
              </div>

              <div className={styles.sidebarFooter}>
                <div className={styles.footerLinks}>
                  <span className={styles.footerLink}>About</span>
                  <span className={styles.footerLink}>Accessibility</span>
                  <span className={styles.footerLink}>Help Center</span>
                  <span className={styles.footerLink}>Privacy & Terms</span>
                </div>
                <p className={styles.copyright}>
                  <span className={styles.brandLogoSmall}>ConnectIn</span> Corporation © {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>

      <nav className={styles.mobileBottomNav} aria-label="Mobile Navigation">
        <button
          type="button"
          className={`${styles.mobileNavItem} ${currentPath === '/dashboard' ? styles.mobileNavItemActive : ''}`}
          onClick={() => router.push('/dashboard')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span>Home</span>
        </button>

        <button
          type="button"
          className={`${styles.mobileNavItem} ${currentPath === '/my_connections' ? styles.mobileNavItemActive : ''}`}
          onClick={() => router.push('/my_connections')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          <span>My Network</span>
        </button>

        <button
          type="button"
          className={`${styles.mobileNavItem} ${currentPath === '/discover' ? styles.mobileNavItemActive : ''}`}
          onClick={() => router.push('/discover')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <span>Discover</span>
        </button>

        <button
          type="button"
          className={`${styles.mobileNavItem} ${currentPath === '/profile' ? styles.mobileNavItemActive : ''}`}
          onClick={() => router.push('/profile')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
