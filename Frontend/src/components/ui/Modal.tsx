import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl',
  };

  // Render to portal so it mounts at body level
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className={`relative w-full rounded-3xl bg-surface-medium border border-slate-800 p-6 shadow-2xl shadow-black/80 transition-all duration-300 ease-out transform scale-100 ${sizeStyles[size]} z-10`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-900/60 mb-5">
          {title && (
            <h3 className="text-lg font-bold tracking-wide text-slate-100">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 border border-slate-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
