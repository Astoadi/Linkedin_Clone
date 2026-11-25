import React, { useEffect, useState } from 'react';

export function getInitials(name = 'User') {
  return (name || 'User')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';
}

export default function UserAvatar({
  src,
  name = 'User',
  alt,
  imageClassName = '',
  fallbackClassName = '',
  onClick,
  title,
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={imageClassName}
        onClick={onClick}
        title={title}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div
      className={fallbackClassName || imageClassName}
      onClick={onClick}
      title={title}
      aria-label={alt || name}
    >
      {getInitials(name)}
    </div>
  );
}
