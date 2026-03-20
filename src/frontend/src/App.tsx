import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Navbar from "./components/Navbar";
import ProfileSetup from "./components/ProfileSetup";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import LandingPage from "./pages/LandingPage";
import OutfitOfDayPage from "./pages/OutfitOfDayPage";
import SustainabilityPage from "./pages/SustainabilityPage";
import WardrobePage from "./pages/WardrobePage";

export type Page = "home" | "wardrobe" | "outfit" | "sustainability";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const navigate = (page: Page) => setCurrentPage(page);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={currentPage} navigate={navigate} />
      <ProfileSetup />
      <main className="flex-1">
        {currentPage === "home" && <LandingPage navigate={navigate} />}
        {currentPage === "wardrobe" && <WardrobePage />}
        {currentPage === "outfit" && <OutfitOfDayPage />}
        {currentPage === "sustainability" && <SustainabilityPage />}
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <AppContent />
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
