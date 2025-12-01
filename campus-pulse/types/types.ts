export type EventType = {
  id: number,
  title: string,
  image_path: string,
  description: string,
  datetime: number,
  recurring: boolean,
  recurrence_intervall?: "daily" | "weekly" | "monthly" | "yearly" | null,
  location: string,
  geo_location: string,
  public_status: "public" | "private",
  categories: string[],
  max_participants: number,
  participants: number,
}


export type NavigationTabType = {
  id: number;
  icon: React.ReactElement;
};