import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/dashboardLayout';
import UserLayout from '@/layout/userLayout';
import { Skeleton, UserAvatar } from '@/Components/Common';
import { useDebounce } from '@/hooks/useDebounce';
import styles from './styles.module.css';

export default function DiscoverPage() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!authState.allProfilesFetched) {
      dispatch(getAllUsers());
    }
  }, [authState.allProfilesFetched, dispatch]);

  const filteredUsers = useMemo(() => {
    const users = Array.isArray(authState.allUsers) ? authState.allUsers : [];
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) return users.filter((u) => u?.userId?.username);

    return users.filter((user) => {
      if (!user?.userId?.username) return false;
      const name = (user.userId.name || '').toLowerCase();
      const username = (user.userId.username || '').toLowerCase();
      const position = (user.currentPosition || '').toLowerCase();
      return name.includes(term) || username.includes(term) || position.includes(term);
    });
  }, [authState.allUsers, debouncedQuery]);

  return (
    <UserLayout>
      <Head>
        <title>Discover | ConnectIn</title>
        <meta name="description" content="Discover professionals and peers on ConnectIn." />
      </Head>
      <DashBoardLayout>
        <div className={styles.discoverContainer}>
          <div className={styles.discoverHeader}>
            <h1>Discover People</h1>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or role..."
              className={styles.searchInput}
              aria-label="Search members"
            />
          </div>

          {!authState.allProfilesFetched ? (
            <div className={styles.allUserProfile}>
              <Skeleton variant="profileCard" />
              <Skeleton variant="profileCard" />
              <Skeleton variant="profileCard" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>
              No members found{debouncedQuery.trim() ? ` matching "${debouncedQuery.trim()}"` : ''}.
            </div>
          ) : (
            <div className={styles.allUserProfile}>
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => router.push(`/view_profile/${user.userId.username}`)}
                  className={styles.userProfileCard}
                >
                  <UserAvatar
                    src={user.userId.profilePictureUrl}
                    name={user.userId.name}
                    imageClassName={styles.userProfileCard_image}
                    fallbackClassName={styles.userProfileCard_imageFallback}
                  />
                  <div>
                    <h1>{user.userId.name}</h1>
                    <p>{user.currentPosition || user.userId.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
