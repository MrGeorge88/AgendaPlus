import { Layout } from "../components/layout/layout";
import { Calendar } from "../components/calendar/calendar";
import { useLanguage } from "../lib/translations";

export function Agenda() {
  const { t } = useLanguage();

  return (
    <Layout title={t('navigation.agenda')}>
      <Calendar />
    </Layout>
  );
}
