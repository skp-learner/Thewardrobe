import { Button } from "@/components/ui/button";
import { Lock, Shirt } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginPromptProps {
  pageName: string;
}

export default function LoginPrompt({ pageName }: LoginPromptProps) {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
      data-ocid="login.section"
    >
      <div className="bg-card rounded-3xl p-10 shadow-card max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Sign In Required
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          You need to log in to access <strong>{pageName}</strong>. Your
          wardrobe data is stored securely on the Internet Computer.
        </p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 py-5"
          data-ocid="login.primary_button"
        >
          <Shirt className="w-4 h-4 mr-2" />
          {isLoggingIn ? "Logging in..." : "Login with Internet Identity"}
        </Button>
      </div>
    </div>
  );
}
