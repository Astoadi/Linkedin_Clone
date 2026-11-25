import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AcceptConnection, getMyConnectionRequests } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/dashboardLayout';
import UserLayout from '@/layout/userLayout';
import { Button, UserAvatar } from '@/Components/Common';
import styles from './styles.module.css';

export default function MyConnectionsPage() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [acceptingIds, setAcceptingIds] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getMyConnectionRequests({ token }));
    }
  }, [dispatch]);

  const requests = Array.isArray(authState.connectionRequest) ? authState.connectionRequest : [];
  const pendingRequests = requests.filter((conn) => conn?.status_accepted === null);
  const networkConnections = requests.filter((conn) => conn?.status_accepted !== null);

  const handleAccept = async (e, requestId) => {
    e.stopPropagation();
    if (acceptingIds[requestId]) return;

    try {
      setAcceptingIds((prev) => ({ ...prev, [requestId]: true }));
      await dispatch(
        AcceptConnection({
          token: localStorage.getItem('token'),
          requestId,
          action_type: 'accept',
        })
      ).unwrap();
    } catch {
      // Errors captured by authReducer
    } finally {
      setAcceptingIds((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  return (
    <UserLayout>
      <Head>
        <title>My Network | ConnectIn</title>
        <meta name="description" content="Manage connection invitations and view your ConnectIn network." />
      </Head>
      <DashBoardLayout>
        <div className={styles.pageContainer}>
          <section className={styles.sectionBlock}>
            <h4 className={styles.sectionTitle}>Invitations ({pendingRequests.length})</h4>
            {pendingRequests.length === 0 ? (
              <div className={styles.emptyStateCard}>No pending invitations</div>
            ) : (
              pendingRequests.map((conn) => {
                const sender = conn?.userId;
                if (!sender) return null;
                return (
                  <div
                    key={conn._id}
                    onClick={() => sender.username && router.push(`/view_profile/${sender.username}`)}
                    className={styles.userCard}
                  >
                    <div className={styles.rowLayout}>
                      <UserAvatar
                        src={sender.profilePictureUrl}
                        name={sender.name}
                        imageClassName={styles.avatarImg}
                        fallbackClassName={styles.avatarFallback}
                      />
                      <div className={styles.userInfo}>
                        <h3>{sender.name}</h3>
                        <p>@{sender.username}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        loading={Boolean(acceptingIds[conn._id])}
                        onClick={(e) => handleAccept(e, conn._id)}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </section>

          <section className={styles.sectionBlock}>
            <h4 className={styles.sectionTitle}>My Network ({networkConnections.length})</h4>
            {networkConnections.length === 0 ? (
              <div className={styles.emptyStateCard}>No accepted connections yet</div>
            ) : (
              networkConnections.map((conn) => {
                const peer = conn?.userId;
                if (!peer) return null;
                return (
                  <div
                    key={conn._id}
                    onClick={() => peer.username && router.push(`/view_profile/${peer.username}`)}
                    className={styles.userCard}
                  >
                    <div className={styles.rowLayout}>
                      <UserAvatar
                        src={peer.profilePictureUrl}
                        name={peer.name}
                        imageClassName={styles.avatarImg}
                        fallbackClassName={styles.avatarFallback}
                      />
                      <div className={styles.userInfo}>
                        <h3>{peer.name}</h3>
                        <p>@{peer.username}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
