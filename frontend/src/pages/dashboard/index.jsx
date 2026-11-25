import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import UserLayout from '@/layout/userLayout';
import DashBoardLayout from '@/layout/dashboardLayout';
import { Button, Skeleton, UserAvatar } from '@/Components/Common';
import { validatePostForm, validateCommentForm } from '@/utils/validation';
import {
  createPost,
  deletePost,
  getAllComments,
  get_all_posts,
  increasePostLikes,
  postComment,
} from '@/config/redux/action/postAction';
import styles from './styles.module.css';

export default function DashBoard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [postValidationError, setPostValidationError] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isLikingPost, setIsLikingPost] = useState({});
  const [confirmDeletePostId, setConfirmDeletePostId] = useState(null);
  const [isDeletingPost, setIsDeletingPost] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  const fileInputRef = useRef(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    dispatch(get_all_posts());
  }, [dispatch, router]);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [filePreview]);

  const showToast = (message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => setToastMessage(''), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (filePreview) URL.revokeObjectURL(filePreview);

    setFileContent(file);
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    setFilePreview(URL.createObjectURL(file));
    setIsComposerOpen(true);
    setPostValidationError('');
  };

  const removeSelectedFile = () => {
    setFileContent(null);
    setFileName('');
    setFileSize('');
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    setPostValidationError('');
    const validation = validatePostForm({ body: postContent, media: fileContent });
    if (!validation.isValid) {
      setPostValidationError(validation.error);
      return;
    }

    try {
      setIsPosting(true);
      await dispatch(createPost({ body: postContent.trim(), file: fileContent })).unwrap();
      setPostContent('');
      removeSelectedFile();
      setIsComposerOpen(false);
      showToast('Post shared successfully!');
      await dispatch(get_all_posts());
    } catch (err) {
      setPostValidationError(err?.message || 'Failed to upload post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId) => {
    if (isLikingPost[postId]) return;

    try {
      setIsLikingPost((prev) => ({ ...prev, [postId]: true }));
      await dispatch(increasePostLikes({ post_id: postId })).unwrap();
      await dispatch(get_all_posts());
    } catch {
      showToast('Unable to update reaction right now.');
    } finally {
      setIsLikingPost((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeletePost = async (postId) => {
    if (isDeletingPost[postId]) return;

    try {
      setIsDeletingPost((prev) => ({ ...prev, [postId]: true }));
      await dispatch(deletePost({ post_id: postId })).unwrap();
      setConfirmDeletePostId(null);
      showToast('Post deleted.');
      await dispatch(get_all_posts());
    } catch {
      showToast('Failed to delete post.');
    } finally {
      setIsDeletingPost((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleToggleComments = async (postId) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
      setCommentText('');
      setCommentError('');
      return;
    }

    setActiveCommentPostId(postId);
    setCommentText('');
    setCommentError('');
    await dispatch(getAllComments({ post_id: postId }));
  };

  const handlePostComment = async (postId) => {
    setCommentError('');
    const validation = validateCommentForm(commentText);
    if (!validation.isValid) {
      setCommentError(validation.error);
      return;
    }

    try {
      setIsPostingComment(true);
      await dispatch(postComment({ post_id: postId, body: commentText.trim() })).unwrap();
      setCommentText('');
      await dispatch(getAllComments({ post_id: postId }));
      showToast('Comment added.');
    } catch (err) {
      setCommentError(err?.message || 'Failed to post comment.');
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleShare = (postId) => {
    const postUrl = `${window.location.origin}/dashboard#post-${postId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(postUrl);
      showToast('Link copied to clipboard!');
    } else {
      showToast('Post URL ready to share.');
    }
  };

  const currentUser = authState.user;
  const currentUserId = currentUser?.userId?._id;

  return (
    <UserLayout>
      <Head>
        <title>Feed | ConnectIn</title>
        <meta
          name="description"
          content="ConnectIn feed: stay updated with professional connections, share updates, and discover industry insights."
        />
      </Head>

      <DashBoardLayout>
        <div className={styles.feedWrapper}>
          <section className={styles.createPostCard} aria-label="Create a post">
            <div className={styles.createPostTop}>
              <UserAvatar
                src={currentUser?.userId?.profilePictureUrl}
                name={currentUser?.userId?.name}
                alt="Your profile"
                imageClassName={styles.userMiniAvatar}
                fallbackClassName={styles.avatarFallbackSmall}
                onClick={() => router.push('/profile')}
              />

              {!isComposerOpen ? (
                <button
                  type="button"
                  className={styles.startPostTrigger}
                  onClick={() => setIsComposerOpen(true)}
                >
                  Start a post, share what’s on your mind...
                </button>
              ) : (
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>
                    {currentUser?.userId?.name || 'Share an update'}
                  </span>
                </div>
              )}
            </div>

            {isComposerOpen && (
              <div className={styles.postEditorArea}>
                <textarea
                  className={styles.postTextarea}
                  placeholder="What do you want to talk about?"
                  value={postContent}
                  onChange={(e) => {
                    setPostContent(e.target.value);
                    if (postValidationError) setPostValidationError('');
                  }}
                  autoFocus
                />

                {fileContent && (
                  <div className={styles.mediaPreviewContainer}>
                    <div className={styles.mediaPreviewLeft}>
                      {filePreview && (
                        <img
                          src={filePreview}
                          alt="Upload preview"
                          className={styles.mediaThumbnail}
                        />
                      )}
                      <div className={styles.mediaMeta}>
                        <p className={styles.mediaFileName}>{fileName}</p>
                        <p className={styles.mediaFileSize}>{fileSize}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeMediaButton}
                      onClick={removeSelectedFile}
                      title="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}>
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                      </svg>
                      Remove
                    </button>
                  </div>
                )}

                {postValidationError && (
                  <div className={styles.validationAlert} role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, flexShrink: 0 }}>
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                    <span>{postValidationError}</span>
                  </div>
                )}
              </div>
            )}

            <div className={styles.createPostActions}>
              <button
                type="button"
                className={styles.mediaAttachButton}
                onClick={() => fileInputRef.current?.click()}
                title="Add photo or media"
              >
                <svg className={styles.mediaIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                </svg>
                <span>Media</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                hidden
                id="feedMediaUpload"
              />

              <div className={styles.submitActions}>
                {isComposerOpen && (
                  <button
                    type="button"
                    className={styles.cancelPostButton}
                    onClick={() => {
                      setIsComposerOpen(false);
                      setPostValidationError('');
                    }}
                  >
                    Cancel
                  </button>
                )}

                <Button
                  variant="primary"
                  loading={isPosting}
                  disabled={!postContent.trim() && !fileContent}
                  onClick={handleUpload}
                >
                  Post
                </Button>
              </div>
            </div>
          </section>

          <section className={styles.postsContainer} aria-label="Posts Feed">
            {postState.isLoading && !postState.postFetched && <Skeleton variant="post" count={3} />}

            {!postState.isLoading && postState.posts?.length === 0 && (
              <div className={styles.emptyFeedCard}>
                <svg className={styles.emptyFeedIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                </svg>
                <h3 className={styles.emptyFeedTitle}>Your feed is empty</h3>
                <p className={styles.emptyFeedSubtitle}>
                  Share an update, connect with professionals, and keep track of industry insights.
                </p>
              </div>
            )}

            {postState.posts?.map((post) => {
              const author = post?.userId;
              const isAuthor = currentUserId && author?._id === currentUserId;
              const hasLiked = currentUserId && post?.likes?.includes(currentUserId);
              const likesCount = post?.likes?.length || 0;
              const isCommentsOpen = activeCommentPostId === post._id;

              return (
                <article key={post._id} id={`post-${post._id}`} className={styles.postCard}>
                  <div className={styles.postHeader}>
                    <div className={styles.authorMetaGroup}>
                      <UserAvatar
                        src={author?.profilePictureUrl}
                        name={author?.name}
                        imageClassName={styles.authorAvatar}
                        fallbackClassName={styles.authorAvatarFallback}
                        onClick={() => author?.username && router.push(`/view_profile/${author.username}`)}
                      />

                      <div className={styles.authorDetails}>
                        <h4
                          className={styles.authorName}
                          onClick={() => author?.username && router.push(`/view_profile/${author.username}`)}
                        >
                          {author?.name || 'ConnectIn Member'}
                        </h4>
                        <span className={styles.authorUsername}>
                          @{author?.username || 'member'}
                        </span>
                        <div className={styles.postVisibility}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
                          </svg>
                          <span>Public</span>
                        </div>
                      </div>
                    </div>

                    {isAuthor && (
                      confirmDeletePostId === post._id ? (
                        <div className={styles.confirmDeleteGroup}>
                          <Button
                            size="sm"
                            variant="danger"
                            loading={isDeletingPost[post._id]}
                            onClick={() => handleDeletePost(post._id)}
                          >
                            Delete
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isDeletingPost[post._id]}
                            onClick={() => setConfirmDeletePostId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={styles.deletePostButton}
                          onClick={() => setConfirmDeletePostId(post._id)}
                          title="Delete Post"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      )
                    )}
                  </div>

                  {post?.body && <div className={styles.postContent}>{post.body}</div>}

                  {(post?.mediaUrl || post?.media) && (
                    <div className={styles.postMediaWrapper}>
                      <img
                        src={post.mediaUrl || post.media}
                        alt="Post attachment"
                        className={styles.postMediaImage}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className={styles.postSocialMetrics}>
                    <div className={styles.reactionIconsGroup}>
                      {likesCount > 0 && (
                        <div className={styles.reactionsStack}>
                          <span className={styles.reactionBadgeThumb} title="Liked">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M1 8.25a1.25 1.25 0 1 1 2.5 0v7.5a1.25 1.25 0 1 1-2.5 0v-7.5ZM11 3V1.75C11 .784 10.216 0 9.25 0c-.628 0-1.198.332-1.503.864L5.34 5.043C5.122 5.421 5 5.857 5 6.3V14a3 3 0 0 0 3 3h4.636a3 3 0 0 0 2.91-2.272l1.636-6.545A3 3 0 0 0 14.273 4.5H11V3Z" />
                            </svg>
                          </span>
                          <span className={styles.reactionBadgeHeart} title="Love">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.16-1.14c-1.39-1.424-2.354-2.457-3.007-3.414C4.81 11.4 4.5 10.274 4.5 9c0-2.485 2.015-4.5 4.5-4.5 1.243 0 2.37.504 3.182 1.318A4.473 4.473 0 0 1 15.364 4.5C17.849 4.5 19.864 6.515 19.864 9c0 1.274-.31 2.4-1.01 3.348-.654.957-1.617 1.99-3.007 3.414a20.759 20.759 0 0 1-1.16 1.14l-.019.01-.005.003h-.002a.75.75 0 0 1-.998 0l-.002-.002Z" />
                            </svg>
                          </span>
                        </div>
                      )}
                      <span className={styles.metricsText}>
                        {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                      </span>
                    </div>

                    <span className={styles.metricsText} onClick={() => handleToggleComments(post._id)}>
                      {isCommentsOpen && postState.postId === post._id
                        ? `${postState.comments.length} comments`
                        : 'Comments'}
                    </span>
                  </div>

                  <div className={styles.postActionBar}>
                    <button
                      type="button"
                      className={`${styles.actionButton} ${hasLiked ? styles.actionButtonLiked : ''}`}
                      onClick={() => handleLike(post._id)}
                      disabled={isLikingPost[post._id]}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                      </svg>
                      <span>{hasLiked ? 'Liked' : 'Like'}</span>
                    </button>

                    <button
                      type="button"
                      className={styles.actionButton}
                      onClick={() => handleToggleComments(post._id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                      </svg>
                      <span>Comment</span>
                    </button>

                    <button
                      type="button"
                      className={styles.actionButton}
                      onClick={() => handleShare(post._id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>

                  {isCommentsOpen && (
                    <div className={styles.commentsSection}>
                      <div className={styles.commentInputWrapper}>
                        <UserAvatar
                          src={currentUser?.userId?.profilePictureUrl}
                          name={currentUser?.userId?.name}
                          alt="Your avatar"
                          imageClassName={styles.commentAvatar}
                          fallbackClassName={styles.commentAvatarFallback}
                        />

                        <div className={styles.commentInputInner}>
                          <input
                            type="text"
                            className={styles.commentInputField}
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => {
                              setCommentText(e.target.value);
                              if (commentError) setCommentError('');
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handlePostComment(post._id);
                              }
                            }}
                          />

                          {commentError && (
                            <span className={styles.commentErrorMsg} role="alert">
                              {commentError}
                            </span>
                          )}

                          {commentText.trim().length > 0 && (
                            <div className={styles.commentSubmitRow}>
                              <Button
                                variant="primary"
                                loading={isPostingComment}
                                disabled={!commentText.trim()}
                                onClick={() => handlePostComment(post._id)}
                              >
                                Comment
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {postState.postId === post._id && (
                        <div className={styles.commentsList}>
                          {postState.comments.length === 0 ? (
                            <p className={styles.noCommentsNotice}>
                              No comments yet. Be the first to join the conversation!
                            </p>
                          ) : (
                            postState.comments.map((comment) => {
                              const cAuthor = comment?.userId;
                              return (
                                <div key={comment._id} className={styles.commentItem}>
                                  <UserAvatar
                                    src={cAuthor?.profilePictureUrl}
                                    name={cAuthor?.name}
                                    imageClassName={styles.commentAvatar}
                                    fallbackClassName={styles.commentAvatarFallback}
                                  />

                                  <div className={styles.commentBubble}>
                                    <div className={styles.commentAuthorMeta}>
                                      <h5 className={styles.commentAuthorName}>
                                        {cAuthor?.name || 'ConnectIn Member'}
                                      </h5>
                                      <span className={styles.commentAuthorUsername}>
                                        @{cAuthor?.username || 'member'}
                                      </span>
                                    </div>
                                    <p className={styles.commentBody}>{comment.body}</p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        </div>

        {toastMessage && (
          <div className={styles.feedbackToast} role="status">
            {toastMessage}
          </div>
        )}
      </DashBoardLayout>
    </UserLayout>
  );
}
