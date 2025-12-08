export type EventType = {
  id: string,
  title: string,
  image_path: string,
  description: string,
  datetime: string,
  recurring: boolean,
  recurrence_intervall?: "daily" | "weekly" | "monthly" | "yearly" | null,
  location: string,
  geo_location: string,
  public_status: "public" | "private",
  categories: string[],
  max_participants: number,
  participants: number,
  user_enrolled?: boolean
}


export type NavigationTabType = {
  id: number;
  icon: React.ReactElement;
};



export type UserType = {
  id: string,
  name: string,
  enrollments: string[], // foreign key for event id
}