import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { useLanguage } from '../contexts/language-context';
import { useForm } from '../hooks/use-form';
import { email as emailValidator, required } from '../utils/validation';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { t } = useLanguage();

  // Get the intended destination from location state, or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: [required(), emailValidator()],
      password: [required()],
    },
    onSubmit: async (values) => {
      try {
        await signIn(values.email, values.password);
        // Navigate to the intended destination
        navigate(from, { replace: true });
      } catch (error) {
        // This will be handled by the form error state
        throw new Error(t('auth.loginError'));
      }
    },
  });

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '28rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4f46e5' }}>
            {t('common.appName')}
          </h1>
          <p style={{ marginTop: '0.5rem', color: '#64748b' }}>
            {t('auth.loginTitle')}
          </p>
        </div>

        {errors.form && (
          <div style={{
            marginBottom: '1rem',
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}>
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {t('auth.email')}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: errors.email ? '1px solid #ef4444' : '1px solid #cbd5e1'
              }}
              required
            />
            {errors.email && (
              <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>
                {errors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {t('auth.password')}
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: errors.password ? '1px solid #ef4444' : '1px solid #cbd5e1'
              }}
              required
            />
            {errors.password && (
              <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}>
                {errors.password}
              </p>
            )}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                backgroundColor: '#4f46e5',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontWeight: '500',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? '0.7' : '1'
              }}
            >
              {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <p style={{ color: '#64748b' }}>
            {t('auth.noAccount')}{' '}
            <Link to="/register" style={{ color: '#4f46e5', textDecoration: 'none' }}>
              {t('auth.register')}
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" style={{ fontSize: '0.875rem', color: '#64748b', textDecoration: 'none' }}>
            {t('auth.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
