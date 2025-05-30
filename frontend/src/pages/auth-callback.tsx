import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AlertWithIcon } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useLanguage } from '../contexts/language-context';

export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the URL hash (e.g., #access_token=...)
        const hash = window.location.hash;

        if (hash && hash.includes('access_token')) {
          // Process the callback URL with Supabase
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            throw error;
          }

          if (data?.session) {
            // Email verification successful
            setLoading(false);
            // Redirect to agenda after a short delay
            setTimeout(() => {
              navigate('/agenda');
            }, 2000);
          } else {
            throw new Error('No session found');
          }
        } else {
          throw new Error('Invalid callback URL');
        }
      } catch (err) {
        console.error('Error processing email confirmation:', err);
        setError(err instanceof Error ? err.message : 'Error processing email confirmation');
        setLoading(false);
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">{t('common.appName')}</h1>
          <p className="mt-2 text-slate-500">{t('auth.emailConfirmation')}</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-slate-600">{t('common.loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <AlertWithIcon variant="error" className="mb-4">
              {error}
            </AlertWithIcon>
            <Button asChild className="mt-4">
              <a href="/login">{t('auth.backToLogin')}</a>
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <AlertWithIcon variant="success" className="mb-4">
              {t('auth.emailConfirmed')}
            </AlertWithIcon>
            <p className="mb-4 text-slate-600">
              {t('auth.redirecting')}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
