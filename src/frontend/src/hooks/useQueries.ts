import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CalendarEvent,
  Category,
  type ClothingItem,
  EventType,
  type ExternalBlob,
  Season,
  type UserProfile,
} from "../backend";
import { useActor } from "./useActor";

export { Category, Season, EventType };
export type { ClothingItem, CalendarEvent, UserProfile };

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

export function useGetClothingItems() {
  const { actor, isFetching } = useActor();
  return useQuery<ClothingItem[]>({
    queryKey: ["clothingItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getClothingItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateClothingItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      category: Category;
      color: string;
      styleTags: string[];
      seasons: Season[];
      photo: ExternalBlob;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createClothingItem(
        params.name,
        params.category,
        params.color,
        params.styleTags,
        params.seasons,
        params.photo,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clothingItems"] }),
  });
}

export function useLogWear() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.logWear(itemId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clothingItems"] });
      qc.invalidateQueries({ queryKey: ["sustainabilityReport"] });
    },
  });
}

export function useGetCalendarEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<CalendarEvent[]>({
    queryKey: ["calendarEvents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCalendarEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCalendarEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      date: string;
      eventType: EventType;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createCalendarEvent(
        params.name,
        params.date,
        params.eventType,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendarEvents"] }),
  });
}

export function useGetWeather(lat: number, lon: number) {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["weather", lat, lon],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getWeather(lat, lon);
    },
    enabled: !!actor && !isFetching,
    staleTime: 10 * 60 * 1000,
  });
}

export function useGetOutfitSuggestion(
  weatherCode: bigint,
  eventType: EventType,
  enabled: boolean,
) {
  const { actor, isFetching } = useActor();
  return useQuery<ClothingItem[]>({
    queryKey: ["outfitSuggestion", weatherCode.toString(), eventType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOutfitSuggestion(weatherCode, eventType);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useGetSustainabilityReport() {
  const { actor, isFetching } = useActor();
  return useQuery<ClothingItem[]>({
    queryKey: ["sustainabilityReport"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSustainabilityReport();
    },
    enabled: !!actor && !isFetching,
  });
}
