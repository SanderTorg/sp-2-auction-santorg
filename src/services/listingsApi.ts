import { get } from "./api";

export async function getAllListings() {
  try {
    const response = await get(
      "/auction/listings?sort=created&sortOrder=desc&_bids=true&_seller=true"
    );
    return response?.data || [];
  } catch (error) {
    console.error("Failed to load listings:", error);
    return [];
  }
}
