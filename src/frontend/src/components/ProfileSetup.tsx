import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shirt } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useSaveUserProfile,
} from "../hooks/useQueries";

export default function ProfileSetup() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: profile, isLoading, isFetched } = useGetCallerUserProfile();
  const { mutateAsync: saveProfile, isPending } = useSaveUserProfile();
  const [name, setName] = useState("");

  const showSetup =
    isAuthenticated && !isLoading && isFetched && profile === null;

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      await saveProfile({ name: name.trim() });
      toast.success("Welcome to SmartWardrobe!");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <Dialog open={showSetup}>
      <DialogContent className="sm:max-w-md" data-ocid="profile_setup.dialog">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Shirt className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="font-display text-xl">
              Welcome to SmartWardrobe!
            </DialogTitle>
          </div>
          <DialogDescription>
            Tell us your name to personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Label htmlFor="profile-name" className="text-sm font-medium">
            Your Name
          </Label>
          <Input
            id="profile-name"
            placeholder="e.g. Alex Chen"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="mt-2"
            autoFocus
            data-ocid="profile_setup.input"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={isPending || !name.trim()}
            className="w-full rounded-full bg-primary text-primary-foreground"
            data-ocid="profile_setup.submit_button"
          >
            {isPending ? "Saving..." : "Get Started"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
