import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/language-context';
import { LanguageSwitcher } from '../components/ui/language-switcher';

export function Landing() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="container mx-auto flex items-center justify-between p-4">
        <div className="text-2xl font-bold text-primary">{t('common.appName')} - v2.1</div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher variant="minimal" />
          <Link to="/login">
            <Button variant="ghost">{t('auth.login')}</Button>
          </Link>
          <Link to="/register">
            <Button>{t('auth.register')}</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-6 text-4xl font-bold text-slate-900 md:text-6xl">
          {t('landing.hero.title')}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
          {t('landing.hero.subtitle')}
        </p>
        <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Link to="/register">
            <Button size="lg" className="w-full md:w-auto">
              {t('landing.cta.button')}
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="w-full md:w-auto">
              {t('auth.login')}
            </Button>
          </Link>
        </div>
      </main>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
            {t('landing.features.title')}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-6 shadow-soft">
              <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">{t('landing.features.calendar.title')}</h3>
              <p className="text-slate-600">
                {t('landing.features.calendar.description')}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 shadow-soft">
              <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">{t('landing.features.clients.title')}</h3>
              <p className="text-slate-600">
                {t('landing.features.clients.description')}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 shadow-soft">
              <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">{t('landing.features.metrics.title')}</h3>
              <p className="text-slate-600">
                {t('landing.features.metrics.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 text-xl font-bold">{t('common.appName')}</div>
          <p className="mb-6 text-slate-400">{t('landing.footer.subtitle')}</p>
          <div className="flex justify-center space-x-4">
            <Link to="/login" className="text-slate-400 hover:text-white">
              {t('auth.login')}
            </Link>
            <Link to="/register" className="text-slate-400 hover:text-white">
              {t('auth.register')}
            </Link>
          </div>
          <div className="mt-8 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {t('landing.footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}
