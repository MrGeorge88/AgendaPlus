import { Layout } from "../components/layout/layout";
import { useLanguage } from "../contexts/language-context";
import { BarChart3 } from 'lucide-react';

export function Analytics() {
  const { t } = useLanguage();

  return (
    <Layout title={t('navigation.analytics')}>
      <div className="space-y-6">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Analytics Avanzados
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Próximamente: análisis predictivos, insights de IA y métricas avanzadas de negocio.
          </p>
        </div>
      </div>
    </Layout>
  );
}
