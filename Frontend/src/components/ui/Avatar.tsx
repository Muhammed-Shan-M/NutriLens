import React, { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User Avatar',
  name = 'User',
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeStyles = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
    xl: 'h-24 w-24 text-3xl',
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full overflow-hidden font-bold select-none shrink-0 border border-slate-800 bg-surface-medium text-primary ${sizeStyles[size]} ${className}`}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="tracking-wide">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
};

export default Avatar;
