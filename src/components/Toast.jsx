import React, { useEffect, useState, useCallback } from 'react';

/**
 * Toast notification container and items.
 * Accessible with role="status" and aria-live="polite".
 * Supports auto-dismiss and an optional action button (e.g., "Undo").
 */
export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);

  const triggerDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 250); // Match CSS fadeOut duration
  }, [toast.id, onDismiss]);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerDismiss();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.duration, triggerDismiss]);

  const handleAction = () => {
    if (toast.action && toast.action.onClick) {
      toast.action.onClick();
    }
    triggerDismiss();
  };

  return (
    <div className={`toast-card toast-${toast.type || 'info'} ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {toast.type === 'delete' || toast.type === 'danger' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          ) : toast.type === 'success' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          )}
        </span>
        <span className="toast-message">{toast.message}</span>
      </div>

      <div className="toast-actions">
        {toast.action && (
          <button
            type="button"
            className="toast-action-btn"
            onClick={handleAction}
          >
            {toast.action.label || 'Undo'}
          </button>
        )}
        <button
          type="button"
          className="toast-close-btn"
          onClick={triggerDismiss}
          aria-label="Dismiss notification"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Visual countdown progress bar */}
      <div 
        className="toast-progress" 
        style={{ animationDuration: `${toast.duration || 4000}ms` }}
      />
    </div>
  );
}
