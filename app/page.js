import Dashboard from "@/components/Dashboard";
import { getMockData } from "@/lib/mock";

export default function Home() {
  const data = getMockData();
  return <Dashboard initialData={data} />;
}
