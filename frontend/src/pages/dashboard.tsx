import { Layout } from "../components/layout/layout";
import { Calendar } from "../components/calendar/calendar";

export function Dashboard() {
  return (
    <Layout title="Agenda del día">
      <Calendar />
    </Layout>
  );
}
