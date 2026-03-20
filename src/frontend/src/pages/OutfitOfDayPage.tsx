import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarPlus, CloudSun, Loader2, Plus, Shirt } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoginPrompt from "../components/LoginPrompt";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type ClothingItem,
  EventType,
  useCreateCalendarEvent,
  useGetCalendarEvents,
  useGetOutfitSuggestion,
  useGetWeather,
} from "../hooks/useQueries";

function getWeatherLabel(code: number): string {
  if (code <= 2) return "Clear";
  if (code === 3) return "Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rainy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 80 && code <= 99) return "Stormy";
  return "Clear";
}

function getWeatherEmoji(code: number): string {
  if (code <= 2) return "☀️";
  if (code === 3) return "☁️";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 99) return "⛈️";
  return "☀️";
}

const eventTypeColors: Record<string, string> = {
  work: "bg-blue-100 text-blue-700",
  casual: "bg-green-100 text-green-700",
  formal: "bg-purple-100 text-purple-700",
  sport: "bg-orange-100 text-orange-700",
};

function OutfitItemCard({
  item,
  index,
}: { item: ClothingItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07 }}
      className="bg-card rounded-2xl shadow-card overflow-hidden"
      data-ocid={`outfit.item.${index + 1}`}
    >
      <div className="h-40 bg-muted overflow-hidden">
        <img
          src={item.photo.getDirectURL()}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm text-foreground truncate">
          {item.name}
        </p>
        <p className="text-xs text-muted-foreground capitalize mt-0.5">
          {item.category} · {item.color}
        </p>
      </div>
    </motion.div>
  );
}

export default function OutfitOfDayPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [coords, setCoords] = useState({ lat: 40.71, lon: -74.01 });
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [eventType, setEventType] = useState<EventType>(EventType.casual);

  const { mutateAsync: createEvent, isPending: creatingEvent } =
    useCreateCalendarEvent();

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {},
    );
  }, []);

  const { data: weatherRaw, isLoading: weatherLoading } = useGetWeather(
    coords.lat,
    coords.lon,
  );
  const { data: events, isLoading: eventsLoading } = useGetCalendarEvents();

  const today = new Date().toISOString().slice(0, 10);
  const todayEvents = (events ?? []).filter((e) => e.date === today);
  const firstEventType = todayEvents[0]?.eventType ?? EventType.casual;

  let weatherCode = 0;
  let temperature: number | null = null;
  if (weatherRaw) {
    try {
      const parsed = JSON.parse(weatherRaw);
      weatherCode = parsed.current?.weather_code ?? 0;
      temperature = parsed.current?.temperature_2m ?? null;
    } catch {
      /* ignore */
    }
  }

  const { data: outfitItems, isLoading: outfitLoading } =
    useGetOutfitSuggestion(
      BigInt(weatherCode),
      firstEventType,
      !weatherLoading && !!weatherRaw,
    );

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) return;
    try {
      await createEvent({ name: eventName.trim(), date: eventDate, eventType });
      toast.success("Event added!");
      setEventName("");
      setAddEventOpen(false);
    } catch {
      toast.error("Failed to add event.");
    }
  };

  if (!isAuthenticated) return <LoginPrompt pageName="Outfit of the Day" />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Outfit of the Day
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          AI-curated looks based on your weather and schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weather Widget */}
        <Card
          className="rounded-2xl shadow-card border-0 bg-card overflow-hidden"
          data-ocid="outfit.panel"
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CloudSun className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Current Weather</h2>
            </div>
            {weatherLoading ? (
              <div className="space-y-2" data-ocid="outfit.loading_state">
                <Skeleton className="h-14 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            ) : (
              <div>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-5xl">
                    {getWeatherEmoji(weatherCode)}
                  </span>
                  {temperature !== null && (
                    <span className="font-display text-5xl font-bold text-foreground">
                      {Math.round(temperature)}°C
                    </span>
                  )}
                </div>
                <Badge className="bg-muted text-foreground border-0 text-sm">
                  {getWeatherLabel(weatherCode)}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {coords.lat.toFixed(2)}°N, {Math.abs(coords.lon).toFixed(2)}°
                  {coords.lon < 0 ? "W" : "E"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Events */}
        <Card
          className="rounded-2xl shadow-card border-0 bg-card"
          data-ocid="outfit.panel"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">
                  Today&apos;s Events
                </h2>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAddEventOpen(true)}
                className="rounded-full text-xs h-7 px-3"
                data-ocid="outfit.open_modal_button"
              >
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            {eventsLoading ? (
              <div className="space-y-2" data-ocid="outfit.loading_state">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            ) : todayEvents.length === 0 ? (
              <div className="text-center py-6" data-ocid="outfit.empty_state">
                <p className="text-muted-foreground text-sm">
                  No events today.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Outfit will be casual-ready.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayEvents.map((ev, i) => (
                  <div
                    key={ev.id.toString()}
                    className="flex items-center justify-between bg-muted rounded-xl px-3 py-2"
                    data-ocid={`outfit.item.${i + 1}`}
                  >
                    <span className="text-sm font-medium text-foreground truncate">
                      {ev.name}
                    </span>
                    <Badge
                      className={`text-xs border-0 ml-2 flex-shrink-0 ${eventTypeColors[ev.eventType] || ""}`}
                    >
                      {ev.eventType}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Outfit Suggestions */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shirt className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground text-lg">
            Suggested Outfit
          </h2>
          <Badge className="bg-muted text-muted-foreground border-0 text-xs">
            {getWeatherLabel(weatherCode)} ·{" "}
            {todayEvents[0]?.eventType ?? "casual"}
          </Badge>
        </div>

        {outfitLoading ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            data-ocid="outfit.loading_state"
          >
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-3 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !outfitItems || outfitItems.length === 0 ? (
          <div
            className="flex flex-col items-center py-16 text-center"
            data-ocid="outfit.empty_state"
          >
            <Shirt className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-foreground mb-1">
              No outfit suggestions yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Add items to your wardrobe to get personalized outfit suggestions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {outfitItems.map((item, i) => (
              <OutfitItemCard key={item.id.toString()} item={item} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Add Event Modal */}
      <Dialog
        open={addEventOpen}
        onOpenChange={(o) => {
          if (!o) setAddEventOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-sm" data-ocid="outfit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Add Calendar Event
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEvent} className="space-y-4 py-2">
            <div>
              <Label
                htmlFor="ev-name"
                className="text-sm font-medium mb-1 block"
              >
                Event Name
              </Label>
              <Input
                id="ev-name"
                placeholder="e.g. Team Meeting"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                data-ocid="outfit.input"
                autoFocus
              />
            </div>
            <div>
              <Label
                htmlFor="ev-date"
                className="text-sm font-medium mb-1 block"
              >
                Date
              </Label>
              <Input
                id="ev-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                data-ocid="outfit.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">
                Event Type
              </Label>
              <Select
                value={eventType}
                onValueChange={(v) => setEventType(v as EventType)}
              >
                <SelectTrigger data-ocid="outfit.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EventType).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddEventOpen(false)}
                data-ocid="outfit.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creatingEvent || !eventName.trim()}
                className="bg-btn-dark text-white hover:bg-btn-dark/90 rounded-full"
                data-ocid="outfit.submit_button"
              >
                {creatingEvent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add Event"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
