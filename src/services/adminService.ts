import { User } from "../types/auth";
import { DashboardStats } from "../types/dashboard";

const API_BASE_URL = "http://localhost:3001/api";

class AdminService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }

    return response.json();
  }

  async getAllUsers(filters?: {
    name?: string;
    email?: string;
    address?: string;
    role?: string;
  }): Promise<User[]> {
    const url = new URL(`${API_BASE_URL}/admin/users`);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return response.json();
  }

  async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt"> & {
      password: string;
    }
  ): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create user");
    }

    return response.json();
  }

  async getUserDetails(userId: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    return response.json();
  }

  async getAllStores(filters?: {
    name?: string;
    email?: string;
    address?: string;
  }): Promise<any[]> {
    const url = new URL(`${API_BASE_URL}/admin/stores`);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stores");
    }

    return response.json();
  }

  async createStore(storeData: {
    name: string;
    email: string;
    address: string;
  }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/admin/stores`, {
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
}

export const adminService = new AdminService();
