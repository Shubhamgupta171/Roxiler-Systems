import { Store, Rating, StoreWithUserRating } from "../types/store";

const API_BASE_URL = "http://localhost:3001/api";

class StoreService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAllStores(search?: string): Promise<StoreWithUserRating[]> {
    const url = new URL(`${API_BASE_URL}/stores`);
    if (search) {
      url.searchParams.append("search", search);
    }

    const response = await fetch(url.toString(), {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stores");
    }

    return response.json();
  }

  async createStore(
    storeData: Omit<
      Store,
      "id" | "rating" | "totalRatings" | "createdAt" | "updatedAt"
    >
  ): Promise<Store> {
    const response = await fetch(`${API_BASE_URL}/stores`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(storeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create store");
    }

    return response.json();
  }

  async submitRating(storeId: string, rating: number): Promise<Rating> {
    const response = await fetch(`${API_BASE_URL}/ratings`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ storeId, rating }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to submit rating");
    }

    return response.json();
  }

  async updateRating(ratingId: string, rating: number): Promise<Rating> {
    // Find the user's existing rating for this store
    const stores = await this.getAllStores();
    const store = stores.find((s) => s.userRating);

    if (!store) {
      throw new Error("No existing rating found");
    }

    const response = await fetch(`${API_BASE_URL}/ratings/${store.id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ rating }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update rating");
    }

    return response.json();
  }

  async getStoreRatings(storeId: string): Promise<Rating[]> {
    const response = await fetch(`${API_BASE_URL}/stores/${storeId}/ratings`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch store ratings");
    }

    return response.json();
  }
}

export const storeService = new StoreService();
