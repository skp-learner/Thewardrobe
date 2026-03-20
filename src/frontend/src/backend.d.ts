import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ClothingItem {
    id: bigint;
    seasons: Array<Season>;
    owner: Principal;
    name: string;
    color: string;
    category: Category;
    photo: ExternalBlob;
    wearCount: bigint;
    lastWorn?: bigint;
    styleTags: Array<string>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface CalendarEvent {
    id: bigint;
    owner: Principal;
    date: string;
    name: string;
    eventType: EventType;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export enum Category {
    accessories = "accessories",
    tops = "tops",
    bottoms = "bottoms",
    shoes = "shoes",
    outerwear = "outerwear"
}
export enum EventType {
    work = "work",
    sport = "sport",
    casual = "casual",
    formal = "formal"
}
export enum Season {
    fall = "fall",
    winter = "winter",
    summer = "summer",
    spring = "spring"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCalendarEvent(name: string, date: string, eventType: EventType): Promise<bigint>;
    createClothingItem(name: string, category: Category, color: string, styleTags: Array<string>, seasons: Array<Season>, photo: ExternalBlob): Promise<bigint>;
    getCalendarEvents(): Promise<Array<CalendarEvent>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClothingItems(): Promise<Array<ClothingItem>>;
    getOutfitSuggestion(weatherCode: bigint, eventType: EventType): Promise<Array<ClothingItem>>;
    getSustainabilityReport(): Promise<Array<ClothingItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeather(lat: number, lon: number): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    logWear(itemId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    testWearCycle(itemId: bigint): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
