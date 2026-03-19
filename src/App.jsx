import "@/assets/styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "primeicons/primeicons.css";
import { BrowserRouter as Router } from "react-router-dom";
import { LoadingRenderer } from "./components/ui/LoadingRenderer";
import { StoreInitializer } from "./components/ui/StoreInitializer";
import { ToastComponent } from "./components/ui/Toast";
import AppRoutes from "./route";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <StoreInitializer />
      <Router>
        <AppRoutes />
      </Router>
      <ToastComponent />
      <LoadingRenderer />
    </QueryClientProvider>
  );
}
