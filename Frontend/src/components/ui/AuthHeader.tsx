import React from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col gap-1.5 text-center lg:text-left mb-6">
      <h2 className="text-xl sm:text-2xl font-black tracking-wide text-slate-100">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-slate-400 font-normal">
        {subtitle}
      </p>
    </div>
  );
};

export default AuthHeader;
