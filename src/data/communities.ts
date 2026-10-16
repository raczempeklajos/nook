
import type { Community } from "../types/Community";

export const initialCommunities: Community[] = [
  {
    id: "my-space",
    name: "My Space",
    icon: "M",
    channels: [
      {
        id: "general",
        name: "general",
        type: "text",
      },
      {
        id: "projects",
        name: "projects",
        type: "text",
      },
      {
        id: "random",
        name: "random",
        type: "text",
      },
      {
        id: "lounge",
        name: "Lounge",
        type: "voice",
      },
    ],
  },
  {
    id: "developer-hub",
    name: "Developer Hub",
    icon: "D",
    channels: [
      {
        id: "dev-general",
        name: "general",
        type: "text",
      },
      {
        id: "frontend",
        name: "frontend",
        type: "text",
      },
      {
        id: "backend",
        name: "backend",
        type: "text",
      },
    ],
  },
];
