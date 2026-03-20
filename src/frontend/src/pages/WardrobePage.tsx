import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Plus, Repeat, Shirt } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import AddItemModal from "../components/AddItemModal";
import LoginPrompt from "../components/LoginPrompt";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  Category,
  type ClothingItem,
  useGetClothingItems,
  useLogWear,
} from "../hooks/useQueries";

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

const categoryColors: Record<string, string> = {
  tops: "bg-blue-100 text-blue-700",
  bottoms: "bg-purple-100 text-purple-700",
  shoes: "bg-orange-100 text-orange-700",
  outerwear: "bg-slate-100 text-slate-700",
  accessories: "bg-pink-100 text-pink-700",
};

function ClothingCard({ item, index }: { item: ClothingItem; index: number }) {
  const { mutateAsync: logWear, isPending } = useLogWear();

  const handleLogWear = async () => {
    try {
      await logWear(item.id);
      toast.success(`Logged wear for "${item.name}"!`);
    } catch {
      toast.error("Failed to log wear.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden flex flex-col"
      data-ocid={`wardrobe.item.${index + 1}`}
    >
      <div className="relative h-52 bg-muted overflow-hidden">
        <img
          src={item.photo.getDirectURL()}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <Badge
            className={`text-xs font-semibold ${categoryColors[item.category] || "bg-muted text-foreground"} border-0`}
          >
            {item.category}
          </Badge>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3
            className="font-semibold text-foreground text-sm truncate"
            title={item.name}
          >
            {item.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="w-3 h-3 rounded-full border border-border flex-shrink-0"
              style={{ backgroundColor: item.color.toLowerCase() }}
              title={item.color}
            />
            <span className="text-xs text-muted-foreground truncate">
              {item.color}
            </span>
          </div>
        </div>
        {item.styleTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.styleTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Repeat className="w-3 h-3" /> {Number(item.wearCount)} wears
          </span>
          <Button
            size="sm"
            onClick={handleLogWear}
            disabled={isPending}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-7 px-3"
            data-ocid={`wardrobe.item.${index + 1}`}
          >
            {isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              "Log Wear"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function WardrobePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: items, isLoading } = useGetClothingItems();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);

  if (!isAuthenticated) return <LoginPrompt pageName="My Wardrobe" />;

  const filtered =
    filterCategory === "all"
      ? (items ?? [])
      : (items ?? []).filter((i) => i.category === filterCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Wardrobe
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {items?.length ?? 0} items cataloged
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger
              className="w-40 rounded-full"
              data-ocid="wardrobe.select"
            >
              <SelectValue placeholder="Filter category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(Category).map((c) => (
                <SelectItem key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => setAddOpen(true)}
            className="rounded-full bg-btn-dark text-white hover:bg-btn-dark/90"
            data-ocid="wardrobe.open_modal_button"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          data-ocid="wardrobe.loading_state"
        >
          {SKELETON_IDS.map((id) => (
            <div key={id} className="rounded-2xl overflow-hidden">
              <Skeleton className="h-52 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="wardrobe.empty_state"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
            <Shirt className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            {filterCategory === "all"
              ? "Your wardrobe is empty"
              : `No ${filterCategory} yet`}
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            Start by adding your first clothing item. Take a photo or upload one
            to catalog it!
          </p>
          <Button
            onClick={() => setAddOpen(true)}
            className="rounded-full bg-btn-dark text-white hover:bg-btn-dark/90"
            data-ocid="wardrobe.primary_button"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Your First Item
          </Button>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          data-ocid="wardrobe.list"
        >
          {filtered.map((item, i) => (
            <ClothingCard key={item.id.toString()} item={item} index={i} />
          ))}
        </div>
      )}

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
