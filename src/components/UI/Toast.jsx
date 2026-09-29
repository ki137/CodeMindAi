import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { state, dispatch } = useApp();

  return (
    <div className="toast-container">
      {state.toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
        />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={16} color="var(--teal)" />,
    warning: <AlertTriangle size={16} color="var(--orange)" />,
    info: <Info size={16} color="var(--yellow-dark, #c9a800)" />,
  };

  return (
    <div className={`toast toast-${toast.type || 'info'}`}>
      {icons[toast.type || 'info']}
      <div style={{ flex: 1 }}>
        {toast.title && (
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: 2 }}>
            {toast.title}
          </div>
        )}
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{toast.message}</div>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', padding: 2 }}>
        <X size={14} />
      </button>
    </div>
  );
}
