import React from 'react';
import Modal from './Modal.tsx';
import Button from './Button.tsx';
import { AlertTriangle, HelpCircle, CheckCircle2 } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'danger';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  isLoading = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
      case 'danger':
        return <AlertTriangle className="h-6 w-6 text-warning" />;
      case 'success':
        return <CheckCircle2 className="h-6 w-6 text-primary" />;
      default:
        return <HelpCircle className="h-6 w-6 text-secondary" />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center p-2">
        <div className="mb-4 p-3 rounded-full bg-slate-900 border border-slate-800">
          {getIcon()}
        </div>
        
        <h3 className="text-lg font-bold text-slate-100 mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex w-full gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={type === 'danger' || type === 'warning' ? 'warning' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Dialog;
