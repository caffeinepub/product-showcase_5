import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
        text-sm font-medium transition-all duration-200
        ${
          isAuthenticated
            ? 'bg-muted hover:bg-muted/80 text-foreground'
            : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {disabled ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Logging in...</span>
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </>
      )}
    </button>
  );
}
