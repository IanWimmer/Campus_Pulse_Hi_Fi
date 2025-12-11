export type EventType = {
  id: string;
  title: string;
  image_path: string;
  description: string;
  datetime: string;
  recurring: boolean;
  recurrence_intervall?: "daily" | "weekly" | "monthly" | "yearly" | null;
  location: string;
  geo_location: string;
  public_status: "public" | "private";
  categories: string[];
  max_participants: number;
  participants: number;
  user_enrolled?: boolean;
  created_by_user?: boolean;
};

export type NavigationTabType = {
  id: number;
  icon: React.ReactElement;
};

export type DateTimeRange = {
  start: string | null;
  end: string | null;
};

export type UserType = {
  id: string;
  name: string;
  enrollments: string[]; // foreign key list of event ids
  my_events: string[]; // foreign key list of event ids
};

export type RoomCoordinates = {
  lat: number;
  lon: number;
};
