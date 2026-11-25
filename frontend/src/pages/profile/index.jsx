import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import DashBoardLayout from '@/layout/dashboardLayout';
import UserLayout from '@/layout/userLayout';
import { Button, Skeleton, UserAvatar } from '@/Components/Common';
import { getAboutUser } from '@/config/redux/action/authAction';
import { get_all_posts } from '@/config/redux/action/postAction';
import { clientServer, getApiError } from '@/config';
import {
  validateProfileForm,
  validateWorkForm,
  validateEducationForm,
} from '@/utils/validation';
import styles from './styles.module.css';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);

  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [companyPos, setCompanyPos] = useState('');
  const [companyYears, setCompanyYears] = useState('');

  const [schoolName, setSchoolName] = useState('');
  const [degreeName, setDegreeName] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');

  const [statusMessage, setStatusMessage] = useState(null);
  const [modalError, setModalError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getAboutUser({ token }));
      dispatch(get_all_posts());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!authState.user) return;
    setUserProfile(authState.user);
    const currentUsername = authState.user.userId?.username;
    const posts = (postReducer.posts || []).filter(
      (post) => post?.userId?.username === currentUsername
    );
    setUserPosts(posts);
  }, [authState.user, postReducer.posts]);

  const showStatus = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const updateProfileData = async () => {
    if (!userProfile?.userId || isSavingProfile) return;

    const validation = validateProfileForm({ name: userProfile.userId.name });
    if (!validation.isValid) {
      showStatus('error', validation.firstError);
      return;
    }

    try {
      setIsSavingProfile(true);
      const token = localStorage.getItem('token');
      await clientServer.post('/user_update', {
        token,
        name: userProfile.userId.name.trim(),
      });
      await clientServer.post('/update_profile_data', {
        token,
        bio: userProfile.bio || '',
        currentPosition: userProfile.currentPosition || '',
        pastWork: userProfile.pastWork || [],
        education: userProfile.education || [],
      });
      await dispatch(getAboutUser({ token }));
      showStatus('success', 'Profile updated successfully.');
    } catch (error) {
      showStatus('error', getApiError(error, 'Failed to update profile.').message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const openWorkModal = () => {
    setCompanyName('');
    setCompanyPos('');
    setCompanyYears('');
    setModalError('');
    setIsWorkModalOpen(true);
  };

  const openEducationModal = () => {
    setSchoolName('');
    setDegreeName('');
    setFieldOfStudy('');
    setModalError('');
    setIsEducationModalOpen(true);
  };

  const handleAddingWork = async (e) => {
    e.preventDefault();
    if (isAddingWork) return;

    const validation = validateWorkForm({
      company: companyName,
      position: companyPos,
      years: companyYears,
    });
    if (!validation.isValid) {
      setModalError(validation.firstError);
      return;
    }

    try {
      setIsAddingWork(true);
      setModalError('');
      const token = localStorage.getItem('token');
      await clientServer.post('/update_profile_data', {
        token,
        pastWork: [
          ...(userProfile?.pastWork || []),
          {
            company: companyName.trim(),
            position: companyPos.trim(),
            years: String(companyYears).trim(),
          },
        ],
      });
      setIsWorkModalOpen(false);
      await dispatch(getAboutUser({ token }));
      showStatus('success', 'Work experience added.');
    } catch (error) {
      setModalError(getApiError(error, 'Failed to add work experience.').message);
    } finally {
      setIsAddingWork(false);
    }
  };

  const handleAddingEducation = async (e) => {
    e.preventDefault();
    if (isAddingEducation) return;

    const validation = validateEducationForm({
      school: schoolName,
      degree: degreeName,
      fieldOfStudy,
    });
    if (!validation.isValid) {
      setModalError(validation.firstError);
      return;
    }

    try {
      setIsAddingEducation(true);
      setModalError('');
      const token = localStorage.getItem('token');
      await clientServer.post('/update_profile_data', {
        token,
        education: [
          ...(userProfile?.education || []),
          {
            school: schoolName.trim(),
            degree: degreeName.trim(),
            fieldOfStudy: fieldOfStudy.trim(),
          },
        ],
      });
      setIsEducationModalOpen(false);
      await dispatch(getAboutUser({ token }));
      showStatus('success', 'Education added.');
    } catch (error) {
      setModalError(getApiError(error, 'Failed to add education.').message);
    } finally {
      setIsAddingEducation(false);
    }
  };

  const updateProfilePicture = async (file) => {
    if (!file || isUploadingPicture) return;

    try {
      setIsUploadingPicture(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profile_picture', file);
      formData.append('token', token);
      await clientServer.post('update_profile_picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await dispatch(getAboutUser({ token }));
      showStatus('success', 'Profile picture updated.');
    } catch (error) {
      showStatus('error', getApiError(error, 'Failed to update profile picture.').message);
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const isDirty = Boolean(
    authState.user &&
      userProfile &&
      (authState.user.userId?.name !== userProfile.userId?.name ||
        (authState.user.bio || '') !== (userProfile.bio || '') ||
        (authState.user.currentPosition || '') !== (userProfile.currentPosition || ''))
  );

  return (
    <UserLayout>
      <Head>
        <title>Profile | ConnectIn</title>
        <meta name="description" content="Manage your ConnectIn profile, experience, and education." />
      </Head>
      <DashBoardLayout>
        {!authState.user || !userProfile?.userId ? (
          <Skeleton variant="profileCard" />
        ) : (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <label className={styles.backDrop_overlay} htmlFor="ProfilePictureEdit">
                {isUploadingPicture ? 'Uploading...' : 'Edit'}
              </label>
              <input
                onChange={(e) => updateProfilePicture(e.target.files?.[0])}
                type="file"
                accept="image/*"
                id="ProfilePictureEdit"
                hidden
              />
              <UserAvatar
                src={userProfile.userId.profilePictureUrl}
                name={userProfile.userId.name}
                imageClassName={styles.backDrop}
                fallbackClassName={styles.backDropFallback}
              />
            </div>

            <div className={styles.profileContainer_details}>
              {statusMessage && (
                <div
                  className={`${styles.statusBanner} ${
                    statusMessage.type === 'error' ? styles.statusError : styles.statusSuccess
                  }`}
                  role="status"
                >
                  {statusMessage.text}
                </div>
              )}

              <div className={styles.profileContainer_main}>
                <div className={styles.profileMainLeft}>
                  <div className={styles.profile_viewContainer}>
                    <input
                      className={styles.nameEdit}
                      type="text"
                      aria-label="Full Name"
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          userId: { ...userProfile.userId, name: e.target.value },
                        })
                      }
                      value={userProfile.userId.name || ''}
                    />
                    <p className={styles.profile_viewContainerUsername}>
                      @{userProfile.userId.username}
                    </p>
                  </div>

                  <input
                    className={styles.headlineEdit}
                    type="text"
                    placeholder="Current role or headline (e.g. Software Engineer)"
                    aria-label="Headline"
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, currentPosition: e.target.value })
                    }
                    value={userProfile.currentPosition || ''}
                  />

                  <textarea
                    onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                    className={styles.bioPlaceHolder}
                    placeholder="Write a brief bio about your background..."
                    aria-label="Bio"
                    rows={Math.max(3, Math.ceil((userProfile.bio || '').length / 80))}
                    value={userProfile.bio || ''}
                  />

                  {isDirty && (
                    <div className={styles.saveRow}>
                      <Button
                        variant="primary"
                        loading={isSavingProfile}
                        onClick={updateProfileData}
                      >
                        Update Profile
                      </Button>
                    </div>
                  )}
                </div>

                <div className={styles.recentActivityCol}>
                  <h3 className={styles.recentActivityHeading}>Recent Activity</h3>
                  {userPosts.length === 0 ? (
                    <p className={styles.emptySectionNotice}>No posts yet.</p>
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
                {(userProfile.pastWork || []).length === 0 ? (
                  <p className={styles.emptySectionNotice}>No work history added yet.</p>
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
              <Button variant="outline" size="sm" onClick={openWorkModal} className={styles.sectionBtn}>
                Add Work
              </Button>
            </div>

            <div className={styles.workHistory}>
              <h4>Education</h4>
              <div className={styles.workHistoryContainer}>
                {(userProfile.education || []).length === 0 ? (
                  <p className={styles.emptySectionNotice}>No education added yet.</p>
                ) : (
                  userProfile.education.map((education, index) => (
                    <div key={index} className={styles.workHistoryCard}>
                      <p>
                        {education.degree} - {education.fieldOfStudy}
                      </p>
                      <p>{education.school}</p>
                    </div>
                  ))
                )}
              </div>
              <Button variant="outline" size="sm" onClick={openEducationModal} className={styles.sectionBtn}>
                Add Education
              </Button>
            </div>

            {isWorkModalOpen && (
              <div className={styles.addWorkContainer} onClick={() => setIsWorkModalOpen(false)}>
                <div className={styles.addWorkContainer_main} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Add Experience</h3>
                    <button
                      type="button"
                      className={styles.modalCloseBtn}
                      onClick={() => setIsWorkModalOpen(false)}
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleAddingWork} className={styles.inputContainer} noValidate>
                    {modalError && <span className={styles.inlineError}>{modalError}</span>}
                    <input
                      className={styles.inputField}
                      type="text"
                      placeholder="Company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <input
                      className={styles.inputField}
                      type="text"
                      placeholder="Position"
                      value={companyPos}
                      onChange={(e) => setCompanyPos(e.target.value)}
                    />
                    <input
                      className={styles.inputField}
                      type="number"
                      min="0"
                      placeholder="Years"
                      value={companyYears}
                      onChange={(e) => setCompanyYears(e.target.value)}
                    />
                    <Button type="submit" variant="primary" fullWidth loading={isAddingWork}>
                      Save Experience
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {isEducationModalOpen && (
              <div className={styles.addWorkContainer} onClick={() => setIsEducationModalOpen(false)}>
                <div className={styles.addWorkContainer_main} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Add Education</h3>
                    <button
                      type="button"
                      className={styles.modalCloseBtn}
                      onClick={() => setIsEducationModalOpen(false)}
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleAddingEducation} className={styles.inputContainer} noValidate>
                    {modalError && <span className={styles.inlineError}>{modalError}</span>}
                    <input
                      className={styles.inputField}
                      type="text"
                      placeholder="School"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                    <input
                      className={styles.inputField}
                      type="text"
                      placeholder="Degree"
                      value={degreeName}
                      onChange={(e) => setDegreeName(e.target.value)}
                    />
                    <input
                      className={styles.inputField}
                      type="text"
                      placeholder="Field of Study"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                    />
                    <Button type="submit" variant="primary" fullWidth loading={isAddingEducation}>
                      Save Education
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </DashBoardLayout>
    </UserLayout>
  );
}
