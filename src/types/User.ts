
export type UserStatus =
  | "online"
  | "away"
  | "dnd"
  | "invisible";

export type UserProfile = {
  id: string;
  username: string;
  bio: string;
  status: UserStatus;
};

export const defaultUser: UserProfile = {
  id: "local-user",
  username: "Developer",
  bio: "Building something meaningful.",
  status: "online",
};
