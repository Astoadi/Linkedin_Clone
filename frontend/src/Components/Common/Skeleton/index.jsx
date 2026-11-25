import React from 'react';
import styles from './styles.module.css';

export default function Skeleton({
  variant = 'text',
  width,
  height,
  borderRadius,
  count = 1,
  className = '',
  style = {},
}) {
  const customStyles = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(borderRadius ? { borderRadius } : {}),
    ...style,
  };

  if (variant === 'post') {
    return (
      <div className={`${styles.postSkeleton} ${className}`} aria-busy="true" aria-label="Loading post...">
        <div className={styles.postHeader}>
          <div className={`${styles.shimmer} ${styles.avatarSkeleton}`} />
          <div className={styles.headerLines}>
            <div className={`${styles.shimmer} ${styles.textSkeleton}`} style={{ width: '140px', height: '14px' }} />
            <div className={`${styles.shimmer} ${styles.textSkeleton}`} style={{ width: '90px', height: '10px' }} />
          </div>
        </div>
        <div className={styles.postBody}>
          <div className={`${styles.shimmer} ${styles.textSkeleton}`} style={{ width: '100%', height: '12px' }} />
          <div className={`${styles.shimmer} ${styles.textSkeleton}`} style={{ width: '92%', height: '12px' }} />
          <div className={`${styles.shimmer} ${styles.textSkeleton}`} style={{ width: '65%', height: '12px' }} />
        </div>
        <div className={`${styles.shimmer} ${styles.mediaSkeleton}`} />
        <div className={styles.postFooter}>
          <div className={`${styles.shimmer} ${styles.buttonSkeleton}`} />
          <div className={`${styles.shimmer} ${styles.buttonSkeleton}`} />
          <div className={`${styles.shimmer} ${styles.buttonSkeleton}`} />
        </div>
      </div>
    );
  }

  if (variant === 'profileCard') {
    return (
      <div className={`${styles.cardSkeleton} ${className}`} aria-busy="true" aria-label="Loading profile...">
        <div className={`${styles.shimmer} ${styles.cardBannerSkeleton}`} />
        <div className={`${styles.shimmer} ${styles.cardAvatarSkeleton}`} />
        <div className={`${styles.shimmer} ${styles.textSkeleton}`} style={{ width: '70%', height: '16px', margin: '8px auto' }} />
        <div className={`${styles.shimmer} ${styles.textSkeleton}`} style={{ width: '85%', height: '12px', margin: '4px auto' }} />
        <div className={`${styles.shimmer} ${styles.buttonPillSkeleton}`} />
      </div>
    );
  }

  if (count > 1) {
    return (
      <div className={styles.multiTextWrapper}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${styles.shimmer} ${styles.textSkeleton} ${className}`}
            style={{
              ...customStyles,
              width: index === count - 1 ? '60%' : (width || '100%'),
            }}
          />
        ))}
      </div>
    );
  }

  const variantClass = styles[variant] || styles.textSkeleton;

  return (
    <div
      className={`${styles.shimmer} ${variantClass} ${className}`}
      style={customStyles}
      aria-hidden="true"
    />
  );
}
