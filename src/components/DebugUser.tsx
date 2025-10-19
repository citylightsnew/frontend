/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect, useRef } from 'react';

interface ErrorLog {
  timestamp: string;
  type: 'error' | 'warning';
  message: string;
  stack?: string;
  data?: unknown;
}

interface FrozenData {
  user: unknown;
  localStorage: string | null;
  token: string | null;
  isLoading: boolean;
  authError: string | null;
  detectedProblem?: {
    noRole: boolean;
    noCategoria: boolean;
    hasAuthError: boolean;
  };
}

export default function DebugUser() {
  const { user, isLoading, error: authError } = useAuth();
  const [frozen, setFrozen] = useState(false);
  const [frozenData, setFrozenData] = useState<FrozenData | null>(null);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [consoleErrors, setConsoleErrors] = useState<ErrorLog[]>([]);
  const errorHandlerRef = useRef<any>(null);

  useEffect(() => {
    errorHandlerRef.current = (event: ErrorEvent) => {
      const errorLog: ErrorLog = {
        timestamp: new Date().toISOString(),
        type: 'error',
        message: event.message,
        stack: event.error?.stack,
        data: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      };
      setErrors(prev => [...prev, errorLog]);
      
      if (!frozen) {
        setFrozen(true);
        setFrozenData({
          user,
          localStorage: localStorage.getItem('auth_user'),
          token: localStorage.getItem('auth_token'),
          isLoading,
          authError
        });
      }
    };

    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args: any[]) => {
      const errorLog: ErrorLog = {
        timestamp: new Date().toISOString(),
        type: 'error',
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' '),
        data: args
      };
      setConsoleErrors(prev => [...prev, errorLog]);
      
      if (!frozen && args.some(arg => 
        String(arg).toLowerCase().includes('error') || 
        String(arg).toLowerCase().includes('failed')
      )) {
        setFrozen(true);
        setFrozenData({
          user,
          localStorage: localStorage.getItem('auth_user'),
          token: localStorage.getItem('auth_token'),
          isLoading,
          authError
        });
      }
      
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const errorLog: ErrorLog = {
        timestamp: new Date().toISOString(),
        type: 'warning',
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' '),
        data: args
      };
      setConsoleErrors(prev => [...prev, errorLog]);
      originalWarn.apply(console, args);
    };

    window.addEventListener('error', errorHandlerRef.current);

    return () => {
      if (errorHandlerRef.current) {
        window.removeEventListener('error', errorHandlerRef.current);
      }
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, [frozen, user, isLoading, authError]);

  useEffect(() => {
    if (!frozen && user) {
      const hasProblems = 
        !user.role || 
        !user.role.categoria || 
        authError;
      
      if (hasProblems) {
        setFrozen(true);
        setFrozenData({
          user,
          localStorage: localStorage.getItem('auth_user'),
          token: localStorage.getItem('auth_token'),
          isLoading,
          authError,
          detectedProblem: {
            noRole: !user.role,
            noCategoria: !!(user.role && !user.role.categoria),
            hasAuthError: !!authError
          }
        });
      }
    }
  }, [user, authError, frozen, isLoading]);

  if (import.meta.env.PROD) return null;

  const displayData = frozen ? frozenData : {
    user,
    localStorage: localStorage.getItem('auth_user'),
    token: localStorage.getItem('auth_token') ? '***' + localStorage.getItem('auth_token')?.slice(-10) : null,
    isLoading,
    authError
  };

  const hasErrors = errors.length > 0 || consoleErrors.length > 0;
  const hasProblems = displayData && (displayData as any).user && (!(displayData as any).user.role || !(displayData as any).user.role?.categoria);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: frozen || hasErrors || hasProblems ? '#3a0000' : '#1a1a1a',
        color: frozen || hasErrors || hasProblems ? '#ff6b6b' : '#00ff00',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '11px',
        fontFamily: 'monospace',
        maxWidth: '500px',
        maxHeight: '500px',
        overflow: 'auto',
        zIndex: 9999,
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        border: frozen || hasErrors || hasProblems ? '2px solid #ff0000' : '1px solid #333'
      }}
    >
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold', color: frozen ? '#ff0000' : '#ffff00' }}>
          {frozen ? '� FROZEN - ERROR DETECTED' : '�🐛 DEBUG USER DATA'}
        </div>
        <button
          onClick={() => {
            setFrozen(!frozen);
            if (!frozen) {
              setFrozenData({
                user,
                localStorage: localStorage.getItem('auth_user'),
                token: localStorage.getItem('auth_token'),
                isLoading,
                authError
              });
            }
          }}
          style={{
            background: frozen ? '#ff0000' : '#00ff00',
            color: '#000',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {frozen ? '▶ RESUME' : '⏸ FREEZE'}
        </button>
      </div>

      {hasProblems && (
        <div style={{ 
          background: '#ff000022', 
          border: '1px solid #ff0000', 
          padding: '8px', 
          borderRadius: '4px',
          marginBottom: '10px',
          color: '#ff6b6b'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>⚠️ PROBLEMS DETECTED:</div>
          {displayData && !(displayData as any).user?.role && <div>• User has NO ROLE</div>}
          {displayData && (displayData as any).user?.role && !(displayData as any).user.role.categoria && <div>• Role has NO CATEGORIA</div>}
          {displayData && (displayData as any).authError && <div>• Auth Error: {(displayData as any).authError}</div>}
        </div>
      )}

      {errors.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold', color: '#ff0000', marginBottom: '5px' }}>
            🔥 GLOBAL ERRORS ({errors.length}):
          </div>
          {errors.slice(-3).map((err, i) => (
            <div key={i} style={{ 
              background: '#ff000011', 
              padding: '5px', 
              marginBottom: '5px',
              borderLeft: '3px solid #ff0000',
              fontSize: '10px'
            }}>
              <div style={{ color: '#ff6666' }}>[{new Date(err.timestamp).toLocaleTimeString()}]</div>
              <div style={{ color: '#ffaaaa' }}>{err.message}</div>
              {err.stack && (
                <pre style={{ fontSize: '9px', color: '#ff8888', margin: '5px 0 0 0', whiteSpace: 'pre-wrap' }}>
                  {err.stack.slice(0, 200)}...
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {consoleErrors.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold', color: '#ffaa00', marginBottom: '5px' }}>
            📢 CONSOLE ERRORS ({consoleErrors.length}):
          </div>
          {consoleErrors.slice(-3).map((err, i) => (
            <div key={i} style={{ 
              background: err.type === 'error' ? '#ff000011' : '#ffaa0011', 
              padding: '5px', 
              marginBottom: '5px',
              borderLeft: `3px solid ${err.type === 'error' ? '#ff0000' : '#ffaa00'}`,
              fontSize: '10px'
            }}>
              <div style={{ color: err.type === 'error' ? '#ff6666' : '#ffaa66' }}>
                [{new Date(err.timestamp).toLocaleTimeString()}] {err.type.toUpperCase()}
              </div>
              <div style={{ color: '#ffaaaa' }}>{err.message}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: '5px', fontSize: '10px', color: '#888' }}>
        User Data:
      </div>
      <pre style={{ margin: 0, marginBottom: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {JSON.stringify(displayData, null, 2)}
      </pre>

      <div style={{ fontSize: '9px', color: '#666', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #333' }}>
        Press "FREEZE" to capture current state • Freezes auto on error
      </div>
    </div>
  );
}
