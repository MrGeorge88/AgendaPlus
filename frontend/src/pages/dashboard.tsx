import { Layout } from "../components/layout/layout";
import { Calendar } from "../components/calendar/calendar";
import { useLanguage } from "../contexts/language-context";

export function Dashboard() {
  const { t } = useLanguage();

  return (
    <Layout title={t("dashboard.title")}>
      <Calendar />
    </Layout>
  );
}
