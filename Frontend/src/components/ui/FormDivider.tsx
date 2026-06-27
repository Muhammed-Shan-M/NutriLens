import React from 'react';

export const FormDivider: React.FC = () => {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px bg-slate-800/60 flex-1" />
      <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 select-none">
        Or continue with
      </span>
      <div className="h-px bg-slate-800/60 flex-1" />
    </div>
  );
};

export default FormDivider;
