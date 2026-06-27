import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-slate-100 font-sans selection:bg-primary/30 selection:text-primary">
      {/* Toast Notification Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-panel border-slate-800 text-slate-100',
          duration: 4000,
          style: {
            background: '#111715',
            color: '#F3F4F6',
            border: '1px solid rgba(74, 200, 130, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#4AC882',
              secondary: '#111715',
            },
          },
          error: {
            iconTheme: {
              primary: '#E8865A',
              secondary: '#111715',
            },
          },
        }}
      />
      
      {/* Page Routing Outlet */}
      <Outlet />
    </div>
  );
};

export default AppLayout;
