import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { base_url, clientServer } from '@/config';
import DashBoardLayout from '@/layout/dashboardLayout';
import UserLayout from '@/layout/userLayout';
import { Button, UserAvatar } from '@/Components/Common';
import { get_all_posts } from '@/config/redux/action/postAction';
import {
  getConnectionsRequest,
  getMyConnectionRequests,
  sendConnectionRequest,
} from '@/config/redux/action/authAction';
import styles from './styles.module.css';

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);
  const [isSendingConnection, setIsSendingConnection] = useState(false);
  const [isDownloadingResume, setIsDownloadingResume] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    dispatch(get_all_posts());
    if (token) {
      dispatch(getConnectionsRequest({ token }));
      dispatch(getMyConnectionRequests({ token }));
    }
  }, [dispatch, router.query.username]);

  useEffect(() => {
    const posts = (postReducer.posts || []).filter(
      (post) => post?.userId?.username === router.query.username
    );
    setUserPosts(posts);
  }, [postReducer.posts, router.query.username]);

  useEffect(() => {
    const targetUserId = userProfile?.userId?._id;
    if (!targetUserId) return;

    const outgoing = Array.isArray(authState.connections) ? authState.connections : [];
    const incoming = Array.isArray(authState.connectionRequest) ? authState.connectionRequest : [];

    const outMatch = outgoing.find((c) => c?.connectionId?._id === targetUserId);
    const inMatch = incoming.find((c) => c?.userId?._id === targetUserId);
    const match = outMatch || inMatch;

    if (match) {
      setIsCurrentUserInConnection(true);
      setIsConnectionNull(match.status_accepted !== true);
    } else {
      setIsCurrentUserInConnection(false);
      setIsConnectionNull(true);
    }
  }, [authState.connections, authState.connectionRequest, userProfile?.userId?._id]);

  const handleConnect = async () => {
    if (isSendingConnection || !userProfile?.userId?._id) return;
    try {
      setIsSendingConnection(true);
      setErrorBanner('');
      await dispatch(
        sendConnectionRequest({
          token: localStorage.getItem('token'),
          user_id: userProfile.userId._id,
        })
      ).unwrap();
    } catch {
      setErrorBanner('Could not send connection request.');
    } finally {
      setIsSendingConnection(false);
    }
  };

  const handleDownloadResume = async () => {
    if (isDownloadingResume || !userProfile?.userId?._id) return;
    try {
      setIsDownloadingResume(true);
      setErrorBanner('');
      const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
      window.open(`${base_url}/${response.data.message}`, '_blank');
    } catch {
      setErrorBanner('Failed to generate resume PDF. Please try again.');
    } finally {
      setIsDownloadingResume(false);
    }
  };

  const profileName = userProfile?.userId?.name || 'ConnectIn Member';

  return (
    <UserLayout>
      <Head>
        <title>{profileName} | ConnectIn</title>
        <meta name="description" content={`View ${profileName}'s profile on ConnectIn.`} />
      </Head>
      <DashBoardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <UserAvatar
              src={userProfile?.userId?.profilePictureUrl}
              name={profileName}
              imageClassName={styles.backDrop}
              fallbackClassName={styles.backDropFallback}
            />
          </div>

          <div className={styles.profileContainer_details}>
            {errorBanner && (
              <div className={styles.errorBanner} role="alert">
                {errorBanner}
              </div>
            )}

            <div className={styles.profileContainer_flex}>
              <div className={styles.mainInfoCol}>
                <div className={styles.nameHeaderRow}>
                  <h2>{profileName}</h2>
                  <p className={styles.usernameText}>@{userProfile?.userId?.username}</p>
                </div>

                {userProfile?.currentPosition && (
                  <p className={styles.headlineText}>{userProfile.currentPosition}</p>
                )}

                <div className={styles.actionsRow}>
                  {isCurrentUserInConnection ? (
                    <button type="button" className={styles.connectedButton} disabled>
                      {isConnectionNull ? 'Pending' : 'Connected'}
                    </button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      loading={isSendingConnection}
                      onClick={handleConnect}
                    >
                      Connect
                    </Button>
                  )}

                  <button
                    type="button"
                    className={styles.downloadResumeBtn}
                    onClick={handleDownloadResume}
                    disabled={isDownloadingResume}
                    title="Download PDF Resume"
                    aria-label="Download PDF Resume"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </button>
                </div>

                {userProfile?.bio && <p className={styles.bioText}>{userProfile.bio}</p>}
              </div>

              <div className={styles.activityCol}>
                <h3 className={styles.activityHeading}>Recent Activity</h3>
                {userPosts.length === 0 ? (
                  <p className={styles.emptyNotice}>No recent posts.</p>
                ) : (
                  userPosts.map((post) => (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media ? <img src={post.mediaUrl} alt="" /> : null}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {(userProfile?.pastWork || []).length === 0 ? (
                <p className={styles.emptyNotice}>No work history listed.</p>
              ) : (
                userProfile.pastWork.map((work, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p>
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years} yrs</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    const username = context?.query?.username;
    if (!username) {
      return { notFound: true };
    }
    const request = await clientServer.get('/user/get_User_Profile_Based_On_Username', {
      params: { username },
    });
    if (!request.data?.userProfile) {
      return { notFound: true };
    }
    return { props: { userProfile: request.data.userProfile } };
  } catch {
    return { notFound: true };
  }
}
