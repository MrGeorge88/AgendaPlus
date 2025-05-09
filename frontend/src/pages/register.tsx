import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Form, FormGroup, FormActions } from '../components/ui/form';
import { AlertWithIcon } from '../components/ui/alert';
import { useAuth } from '../contexts/auth-context';
import { useLanguage } from '../contexts/language-context';
import { useForm } from '../hooks/use-form';
import { email as emailValidator, required, minLength, match } from '../utils/validation';

export function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!name) {
      setError(t('auth.nameRequired'));
      return;
    }

    if (!email) {
      setError(t('auth.emailRequired'));
      return;
    }

    if (!password) {
      setError(t('auth.passwordRequired'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.passwordMinLength'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDontMatch'));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await signUp(email, password, name);

      // Check if email confirmation is required
      if (response && response.message) {
        setRegistrationSuccess(true);
        setSuccessMessage(response.message);
      } else {
        // If no confirmation required, redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('auth.registerError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">{t('common.appName')}</h1>
          <p className="mt-2 text-slate-500">{t('auth.registerTitle')}</p>
        </div>

        {registrationSuccess ? (
          <div className="text-center">
            <AlertWithIcon variant="success" className="mb-4">
              {successMessage || t('auth.emailConfirmationSent')}
            </AlertWithIcon>
            <p className="mb-4 text-slate-600">
              {t('auth.checkEmailInstructions')}
            </p>
            <Button asChild className="mt-4">
              <Link to="/login">{t('auth.backToLogin')}</Link>
            </Button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormGroup>
                <Input
                  label={t('auth.name')}
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Input
                  label={t('auth.email')}
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Input
                  label={t('auth.password')}
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText={t('auth.passwordHelperText')}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Input
                  label={t('auth.confirmPassword')}
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </FormGroup>

              <FormActions>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t('auth.registering') : t('auth.register')}
                </Button>
              </FormActions>
            </form>

            <div className="mt-4 text-center text-sm">
              <p className="text-slate-500">
                {t('auth.haveAccount')}{' '}
                <Link to="/login" className="text-primary hover:underline">
                  {t('auth.login')}
                </Link>
              </p>
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-slate-500 hover:underline">
            {t('auth.backToHome')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
