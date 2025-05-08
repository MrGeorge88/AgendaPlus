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

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  } = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationRules: {
      name: [required()],
      email: [required(), emailValidator()],
      password: [required(), minLength(6, t('auth.passwordMinLength'))],
      confirmPassword: [
        required(),
        match('password', t('auth.passwordsDontMatch'))
      ],
    },
    onSubmit: async (values) => {
      try {
        await signUp(values.email, values.password, values.name);
        navigate('/dashboard');
      } catch (error) {
        throw new Error(t('auth.registerError'));
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">{t('common.appName')}</h1>
          <p className="mt-2 text-slate-500">{t('auth.registerTitle')}</p>
        </div>

        <Form
          onSubmit={handleSubmit}
          error={errors.form}
        >
          <FormGroup>
            <Input
              label={t('auth.name')}
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              required
            />
          </FormGroup>

          <FormGroup>
            <Input
              label={t('auth.email')}
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
            />
          </FormGroup>

          <FormGroup>
            <Input
              label={t('auth.password')}
              type="password"
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
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
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              required
            />
          </FormGroup>

          <FormActions>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('auth.registering') : t('auth.register')}
            </Button>
          </FormActions>
        </Form>

        <div className="mt-4 text-center text-sm">
          <p className="text-slate-500">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-primary hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-slate-500 hover:underline">
            {t('auth.backToHome')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
