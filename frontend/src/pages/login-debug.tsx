import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Form, FormGroup, FormActions } from '../components/ui/form';
import { useAuth } from '../contexts/auth-context';
import { useLanguage } from '../lib/translations';
import { useForm } from '../hooks/use-form';
import { email as emailValidator, required } from '../utils/validation';

export function LoginDebug() {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Intentar cargar los contextos y capturar errores
  let authContext = null;
  let languageContext = null;
  let formHook = null;

  try {
    authContext = useAuth();
    debugInfo.push("Auth context loaded successfully");
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    debugInfo.push(`Error loading auth context: ${errorMessage}`);
    setError(`Error loading auth context: ${errorMessage}`);
  }

  try {
    languageContext = useLanguage();
    debugInfo.push("Language context loaded successfully");
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    debugInfo.push(`Error loading language context: ${errorMessage}`);
    setError(`Error loading language context: ${errorMessage}`);
  }

  // Solo intentar usar useForm si no hay errores previos
  if (authContext && languageContext && !error) {
    try {
      const { signIn } = authContext;
      const { t } = languageContext;

      formHook = useForm({
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
            navigate('/dashboard');
          } catch (e) {
            throw new Error(t('auth.loginError'));
          }
        },
      });

      debugInfo.push("Form hook loaded successfully");
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      debugInfo.push(`Error initializing form hook: ${errorMessage}`);
      setError(`Error initializing form hook: ${errorMessage}`);
    }
  }

  // Renderizar información de depuración si hay errores
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Error en la página de login</h1>
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600">
            {error}
          </div>
          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">Información de depuración:</h2>
            <ul className="list-inside list-disc">
              {debugInfo.map((info, index) => (
                <li key={index} className="mb-1 text-sm">
                  {info}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-slate-500 hover:underline">
              Volver a la página principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si todo está bien, renderizar el formulario normal
  if (formHook && authContext && languageContext) {
    const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting } = formHook;
    const { t } = languageContext;

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-primary">AgendaPlus</h1>
            <p className="mt-2 text-slate-500">{t('auth.loginTitle')}</p>
          </div>

          <Form
            onSubmit={handleSubmit}
            error={errors.form}
          >
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
                required
              />
            </FormGroup>

            <FormActions>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('auth.loggingIn') : t('auth.login')}
              </Button>
            </FormActions>
          </Form>

          <div className="mt-4 text-center text-sm">
            <p className="text-slate-500">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-primary hover:underline">
                {t('auth.register')}
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

  // Fallback si algo salió mal pero no se capturó un error específico
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-yellow-600">Cargando página de login...</h1>
        <div className="mb-4">
          <h2 className="mb-2 text-lg font-semibold">Estado de carga:</h2>
          <ul className="list-inside list-disc">
            {debugInfo.map((info, index) => (
              <li key={index} className="mb-1 text-sm">
                {info}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-slate-500 hover:underline">
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}
