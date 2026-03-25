import { useDashboardStore, useThemeStore, useToastStore } from "@/stores";
import StatsCard from "../../../components/ui/StatsCard";
import ChartSection from "../../../components/ui/ChartSection";
import { useGetProducts } from "../../../hooks";
import { TopExpensiveProducts } from "../../../components/ui/TopExpensiveProducts";

const stats = [
  {
    title: "Total Revenue",
    value: "$1,250.00",
    change: "+12.5%",
    desc: "Trending up this month",
    sub: "Visitors for the last 6 months",
    icon: "pi pi-arrow-up",
    color: "text-green-500",
  },
  {
    title: "New Customers",
    value: "1,234",
    change: "-20%",
    desc: "Down 20% this period",
    sub: "Acquisition needs attention",
    icon: "pi pi-arrow-down",
    color: "text-red-500",
  },
  {
    title: "Active Accounts",
    value: "45,678",
    change: "+12.5%",
    desc: "Strong user retention",
    sub: "Engagement exceed targets",
    icon: "pi pi-arrow-up",
    color: "text-green-500",
  },
  {
    title: "Growth Rate",
    value: "4.5%",
    change: "+4.5%",
    desc: "Steady performance increase",
    sub: "Meets growth projections",
    icon: "pi pi-chart-line",
    color: "text-green-500",
  },
];

const DashboardPage = () => {
  // get state
  const theme = useThemeStore((state) => state.theme);

  const { products, isLoading, error } = useGetProducts();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <StatsCard theme={theme} stats={stats} />

      <ChartSection products={products} theme={theme} />

      <TopExpensiveProducts products={products} theme={theme} />
    </div>
  );
};

export default DashboardPage;
