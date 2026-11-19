
import type { UserProfile } from "../types/User";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:5000";

export type HealthResponse = {
  status: string;
  application: string;
  message: string;
  timestamp: string;
};

type ApiUser = UserProfile & {
  createdAt: string;
};

type SaveUserRequest = Pick<
  UserProfile,
  "username" | "bio" | "status"
>;

async function parseResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      `API error (${response.status}): ${details}`
    );
  }

  return (await response.json()) as T;
}

export async function getBackendHealth():
  Promise<HealthResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/health`
  );

  return parseResponse<HealthResponse>(response);
}

export async function getUser(
  id: string
): Promise<UserProfile> {
  const response = await fetch(
    `${API_BASE_URL}/api/users/${encodeURIComponent(id)}`
  );

  return parseResponse<ApiUser>(response);
}

export async function createUser(
  user: SaveUserRequest
): Promise<UserProfile> {
  const response = await fetch(
    `${API_BASE_URL}/api/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  return parseResponse<ApiUser>(response);
}

export async function updateUser(
  id: string,
  user: SaveUserRequest
): Promise<UserProfile> {
  const response = await fetch(
    `${API_BASE_URL}/api/users/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  return parseResponse<ApiUser>(response);
}
