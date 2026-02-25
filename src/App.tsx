import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/lib/appContext";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import TaskBreakdown from "./pages/TaskBreakdown";
import FocusTimer from "./pages/FocusTimer";
import Completion from "./pages/Completion";
import Rest from "./pages/Rest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RootRedirect() {
  const { state } = useApp();
  if (!state.userName) return <Navigate to="/onboarding" replace />;
  return <Navigate to="/home" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/breakdown" element={<TaskBreakdown />} />
            <Route path="/focus" element={<FocusTimer />} />
            <Route path="/completion" element={<Completion />} />
            <Route path="/rest" element={<Rest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
