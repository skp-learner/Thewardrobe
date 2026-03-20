import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Menu, Search, Shirt, X } from "lucide-react";
import { useState } from "react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

interface NavbarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const navLinks: { label: string; page: Page }[] = [
  { label: "My Wardrobe", page: "wardrobe" },
  { label: "Outfit of the Day", page: "outfit" },
  { label: "Sustainability", page: "sustainability" },
];

export default function Navbar({ currentPage, navigate }: NavbarProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const qc = useQueryClient();
  const { data: profile } = useGetCallerUserProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
    } else {
      try {
        await login();
      } catch (e: any) {
        if (e?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const userInitial = profile?.name
    ? profile.name[0].toUpperCase()
    : identity?.getPrincipal().toString().slice(0, 1).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-6">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("home")}
            className="flex items-center gap-2 flex-shrink-0"
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-accent flex items-center justify-center">
              <Shirt className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight hidden sm:block">
              SmartWardrobe
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => navigate(link.page)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
                  currentPage === link.page
                    ? "text-primary nav-active-underline"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden md:flex relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search wardrobe..."
              className="pl-9 rounded-full bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
              data-ocid="nav.search_input"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              data-ocid="nav.button"
            >
              <Bell className="w-5 h-5" />
            </button>
            {isAuthenticated ? (
              <button type="button" onClick={handleAuth} data-ocid="nav.button">
                <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-primary/30 hover:ring-primary transition-all">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </button>
            ) : (
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                size="sm"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="nav.primary_button"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => {
                  navigate(link.page);
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === link.page
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
