import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, Loader2, Repeat } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import LoginPrompt from "../components/LoginPrompt";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type ClothingItem,
  useGetSustainabilityReport,
  useLogWear,
} from "../hooks/useQueries";

const WEAR_GOAL = 10;
const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

function formatLastWorn(ts?: bigint): string {
  if (!ts) return "Never worn";
  const ms = Number(ts / 1_000_000n);
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "Never worn";
  return `Last worn ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

function WearBar({ count }: { count: number }) {
  const pct = Math.min((count / WEAR_GOAL) * 100, 100);
  return (
    <div className="wear-bar w-full mt-1">
      <div className="wear-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function SustainabilityRow({
  item,
  index,
}: { item: ClothingItem; index: number }) {
  const { mutateAsync: logWear, isPending } = useLogWear();
  const wearCount = Number(item.wearCount);

  const handleWear = async () => {
    try {
      await logWear(item.id);
      toast.success(`Logged wear for "${item.name}"!`);
    } catch {
      toast.error("Failed to log wear.");
    }
  };

  const urgency =
    wearCount === 0
      ? "bg-red-100 text-red-700"
      : wearCount < 3
        ? "bg-orange-100 text-orange-700"
        : "bg-muted text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-4 bg-card rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-shadow"
      data-ocid={`sustainability.item.${index + 1}`}
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
        <img
          src={item.photo.getDirectURL()}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-semibold text-sm text-foreground truncate">
            {item.name}
          </p>
          <Badge className={`text-xs border-0 flex-shrink-0 ${urgency}`}>
            {wearCount} wear{wearCount !== 1 ? "s" : ""}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatLastWorn(item.lastWorn)}
        </p>
        <WearBar count={wearCount} />
        <p className="text-xs text-muted-foreground mt-1">
          {wearCount}/{WEAR_GOAL} wear goal
        </p>
      </div>
      <Button
        size="sm"
        onClick={handleWear}
        disabled={isPending}
        className="flex-shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8 px-3"
        data-ocid={`sustainability.item.${index + 1}`}
      >
        {isPending ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <>
            <Repeat className="w-3 h-3 mr-1" /> Wear It
          </>
        )}
      </Button>
    </motion.div>
  );
}

export default function SustainabilityPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: items, isLoading } = useGetSustainabilityReport();

  if (!isAuthenticated)
    return <LoginPrompt pageName="Sustainability Tracker" />;

  const allItems = items ?? [];
  const totalItems = allItems.length;
  const neverWorn = allItems.filter((i) => Number(i.wearCount) === 0).length;
  const avgWear =
    totalItems > 0
      ? (
          allItems.reduce((sum, i) => sum + Number(i.wearCount), 0) / totalItems
        ).toFixed(1)
      : "0";

  const stats = [
    {
      label: "Total Items",
      value: totalItems,
      sub: "in wardrobe",
      urgent: false,
    },
    { label: "Avg. Wears", value: avgWear, sub: "per item", urgent: false },
    {
      label: "Never Worn",
      value: neverWorn,
      sub: "need attention",
      urgent: neverWorn > 0,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">
            Sustainability Tracker
          </h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-xl">
          A sustainable wardrobe starts with awareness. Discover which items
          need more love — and wear them more, buy less.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-card rounded-2xl p-5 shadow-card text-center ${stat.urgent ? "border-2 border-destructive/20" : ""}`}
          >
            <p
              className={`font-display text-3xl font-bold ${stat.urgent ? "text-destructive" : "text-primary"}`}
            >
              {stat.value}
            </p>
            <p className="text-xs font-semibold text-foreground mt-0.5">
              {stat.label}
            </p>
            <p className="text-xs text-muted-foreground">{stat.sub}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-lg font-bold text-foreground mb-4">
        Items by Usage
      </h2>

      {isLoading ? (
        <div className="space-y-3" data-ocid="sustainability.loading_state">
          {SKELETON_IDS.map((id) => (
            <div
              key={id}
              className="flex items-center gap-4 bg-card rounded-2xl p-4"
            >
              <Skeleton className="w-16 h-16 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : allItems.length === 0 ? (
        <div
          className="flex flex-col items-center py-20 text-center"
          data-ocid="sustainability.empty_state"
        >
          <Leaf className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-1">
            No items tracked yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Add clothing items to your wardrobe to start tracking
            sustainability.
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="sustainability.list">
          {allItems.map((item, i) => (
            <SustainabilityRow key={item.id.toString()} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
