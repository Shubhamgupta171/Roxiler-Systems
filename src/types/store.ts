export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  rating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreWithUserRating extends Store {
  userRating?: number;
}