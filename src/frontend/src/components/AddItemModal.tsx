import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { Category, Season, useCreateClothingItem } from "../hooks/useQueries";

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
}

const seasons: { value: Season; label: string }[] = [
  { value: Season.spring, label: "Spring" },
  { value: Season.summer, label: "Summer" },
  { value: Season.fall, label: "Fall" },
  { value: Season.winter, label: "Winter" },
];

export default function AddItemModal({ open, onClose }: AddItemModalProps) {
  const { mutateAsync: createItem, isPending } = useCreateClothingItem();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [color, setColor] = useState("");
  const [styleTags, setStyleTags] = useState("");
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSeason = (season: Season) => {
    setSelectedSeasons((prev) =>
      prev.includes(season)
        ? prev.filter((s) => s !== season)
        : [...prev, season],
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setName("");
    setCategory("");
    setColor("");
    setStyleTags("");
    setSelectedSeasons([]);
    setPhotoFile(null);
    setPhotoPreview(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category || !color.trim() || !photoFile) {
      toast.error("Please fill in all required fields and add a photo.");
      return;
    }
    try {
      const bytes = new Uint8Array(await photoFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setUploadProgress(pct),
      );
      const tags = styleTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await createItem({
        name: name.trim(),
        category: category as Category,
        color: color.trim(),
        styleTags: tags,
        seasons: selectedSeasons,
        photo: blob,
      });
      toast.success(`"${name}" added to your wardrobe!`);
      resetForm();
      onClose();
    } catch {
      toast.error("Failed to add item. Please try again.");
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg" data-ocid="add_item.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Add Clothing Item
          </DialogTitle>
          <DialogDescription>
            Upload a photo and describe your item to catalog it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Photo upload */}
          <div>
            <p className="text-sm font-medium mb-2">Photo *</p>
            <button
              type="button"
              className="w-full border-2 border-dashed border-border rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
              onClick={triggerFileInput}
              data-ocid="add_item.dropzone"
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl"
                />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload a photo
                  </p>
                </>
              )}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <p className="text-xs text-primary font-medium">
                  Uploading {uploadProgress}%...
                </p>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              data-ocid="add_item.upload_button"
            />
          </div>

          {/* Name */}
          <div>
            <Label
              htmlFor="item-name"
              className="text-sm font-medium mb-1 block"
            >
              Name *
            </Label>
            <Input
              id="item-name"
              placeholder="e.g. White Oxford Shirt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-ocid="add_item.input"
            />
          </div>

          {/* Category & Color row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label
                htmlFor="category-select"
                className="text-sm font-medium mb-1 block"
              >
                Category *
              </Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as Category)}
              >
                <SelectTrigger id="category-select" data-ocid="add_item.select">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Category).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="item-color"
                className="text-sm font-medium mb-1 block"
              >
                Color *
              </Label>
              <Input
                id="item-color"
                placeholder="e.g. Navy Blue"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                data-ocid="add_item.input"
              />
            </div>
          </div>

          {/* Style tags */}
          <div>
            <Label
              htmlFor="style-tags"
              className="text-sm font-medium mb-1 block"
            >
              Style Tags
            </Label>
            <Input
              id="style-tags"
              placeholder="casual, minimalist, office (comma-separated)"
              value={styleTags}
              onChange={(e) => setStyleTags(e.target.value)}
              data-ocid="add_item.input"
            />
          </div>

          {/* Seasons */}
          <div>
            <p className="text-sm font-medium mb-2">Seasons</p>
            <div className="flex flex-wrap gap-3">
              {seasons.map((s) => (
                <label
                  key={s.value}
                  htmlFor={`season-${s.value}`}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Checkbox
                    id={`season-${s.value}`}
                    checked={selectedSeasons.includes(s.value)}
                    onCheckedChange={() => toggleSeason(s.value)}
                    data-ocid="add_item.checkbox"
                  />
                  <span className="text-sm">{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="add_item.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-btn-dark text-white hover:bg-btn-dark/90 rounded-full"
              data-ocid="add_item.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
                </>
              ) : (
                "Add to Wardrobe"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
