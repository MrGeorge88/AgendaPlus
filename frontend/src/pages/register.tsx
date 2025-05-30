import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Form, FormGroup, FormActions } from '../components/ui/form';
import { AlertWithIcon } from '../components/ui/alert';
import { useAuth } from '../contexts/auth-context';
import { useSimpleTranslation } from '../lib/translations';
import { useForm } from '../hooks/use-form';
import { email as emailValidator, required, minLength, match } from '../utils/validation';

export function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { t } = useSimpleTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Simple function for translations with fallback
  const getText = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

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
        // If no confirmation required, redirect to agenda
        navigate('/agenda');
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
          <h1 className="text-2xl font-bold text-primary">AgendaPlus</h1>
          <p className="mt-2 text-slate-500">{getText('auth.registerTitle', 'Crea tu cuenta')}</p>
        </div>

        {registrationSuccess ? (
          <div className="text-center">
            <AlertWithIcon variant="success" className="mb-4">
              {successMessage || getText('auth.emailConfirmationSent', 'Se ha enviado un correo de confirmación')}
            </AlertWithIcon>
            <p className="mb-4 text-slate-600">
              {getText('auth.checkEmailInstructions', 'Revisa tu correo electrónico y haz clic en el enlace de confirmación para activar tu cuenta.')}
            </p>
            <Button asChild className="mt-4">
              <Link to="/login">{getText('auth.backToLogin', 'Volver al login')}</Link>
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
                  label={getText('auth.name', 'Nombre')}
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
                  label={getText('auth.email', 'Correo electrónico')}
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
                  label={getText('auth.password', 'Contraseña')}
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText={getText('auth.passwordHelperText', 'Mínimo 6 caracteres')}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Input
                  label={getText('auth.confirmPassword', 'Confirmar contraseña')}
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
                  {isSubmitting ? getText('auth.registering', 'Registrando...') : getText('auth.register', 'Registrarse')}
                </Button>
              </FormActions>
            </form>

            <div className="mt-4 text-center text-sm">
              <p className="text-slate-500">
                {getText('auth.haveAccount', '¿Ya tienes cuenta?')}{' '}
                <Link to="/login" className="text-primary hover:underline">
                  {getText('auth.login', 'Inicia sesión')}
                </Link>
              </p>
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-slate-500 hover:underline">
            {getText('auth.backToHome', 'Volver al inicio')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
