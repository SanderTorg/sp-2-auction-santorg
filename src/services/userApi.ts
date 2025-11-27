import { getUsernameStorage } from "../utils/storage";
import { get } from "./api";

export type ProfileData = {
  name: string;
  email: string;
  bio: string;
  avatar: {
    url: string;
    alt: string;
  };
  banner: {
    url: string;
    alt: string;
  };
  credits: number;
  _count: {
    listings: number;
    wins: number;
  };
};
export type Listings = {
  id: string;
  title: string;
  description: string;
  media: [
    {
      url: string;
      alt: string;
    }
  ];
  tags: [string];
  created: Date;
  updated: Date;
  endsAt: Date;
};

export type Wins = {
  id: string;
  title: string;
  description: string;
  media: [
    {
      url: string;
      alt: string;
    }
  ];
  tags: [string];
  created: Date;
  updated: Date;
  endsAt: Date;
};

let cachedProfileData: ProfileData | null = null;

export async function fetchUserProfile(
  username: string
): Promise<ProfileData | null> {
  try {
    const userName = username || getUsernameStorage();

    if (!userName) {
      console.error("Username is not available.");
      return null;
    }

    const endpoint = `/auction/profiles/${userName}`;
    const response = await get(endpoint);

    if (response.data) {
      cachedProfileData = response.data;

      if (response.data.credits !== undefined) {
        localStorage.setItem("userCredits", response.data.credits.toString());
      }

      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

export async function getUserProfile(): Promise<ProfileData | null> {
  if (cachedProfileData) {
    return cachedProfileData;
  }
  return await fetchUserProfile(getUsernameStorage() || "");
}

export function clearProfileCache(): void {
  cachedProfileData = null;
  localStorage.removeItem("userCredits");
}

export function getCredits(): number {
  if (cachedProfileData?.credits !== undefined) {
    return cachedProfileData.credits;
  }

  const stored = localStorage.getItem("userCredits");
  return stored ? parseInt(stored, 10) : 0;
}

export function getAvatarUrl(): string {
  return cachedProfileData?.avatar?.url || "https://via.placeholder.com/40";
}

export function getAvatarAlt(): string {
  return cachedProfileData?.avatar?.alt || "User avatar";
}

export function getNameApi(): string {
  return cachedProfileData?.name || getUsernameStorage() || "User";
}

export async function refreshProfile(): Promise<ProfileData | null> {
  cachedProfileData = null;
  return await fetchUserProfile(getNameApi() || "");
}
