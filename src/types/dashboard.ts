import { Store } from './store';
import { Rating } from './store';

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface StoreOwnerDashboard {
  store: Store;
  averageRating: number;
  totalRatings: number;
  recentRatings: Rating[];
}