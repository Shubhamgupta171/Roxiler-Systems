import React, { useState, useEffect } from 'react';
import { Star, Users, TrendingUp, Calendar, Store } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { StarRating } from '../ui/StarRating';
import { Badge } from '../ui/Badge';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  SortableTableHeader, 
  TableCell,
  EmptyState,
  SortConfig 
} from '../ui/Table';
import { useAuth } from '../../contexts/AuthContext';
import { storeService } from '../../services/storeService';
import { Rating } from '../../types/store';

export const StoreOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [storeData, setStoreData] = useState<any>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [sortedRatings, setSortedRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' });

  useEffect(() => {
    fetchStoreData();
  }, [user]);

  useEffect(() => {
    applySorting();
  }, [ratings, sortConfig]);

  const fetchStoreData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // For store owners, we'll fetch their store data and ratings
      // This would typically be done through a store owner specific API
      const mockStoreData = {
        id: '1',
        name: `${user.name}'s Store`,
        email: user.email,
        address: user.address,
        rating: 4.3,
        totalRatings: 156
      };
      
      const mockRatings: Rating[] = [
        {
          id: '1',
          userId: '1',
          storeId: '1',
          rating: 5,
          userName: 'John Smith',
          createdAt: '2024-01-20T14:30:00Z',
          updatedAt: '2024-01-20T14:30:00Z'
        },
        {
          id: '2',
          userId: '2',
          storeId: '1',
          rating: 4,
          userName: 'Sarah Johnson',
          createdAt: '2024-01-20T12:15:00Z',
          updatedAt: '2024-01-20T12:15:00Z'
        },
        {
          id: '3',
          userId: '3',
          storeId: '1',
          rating: 5,
          userName: 'Michael Brown',
          createdAt: '2024-01-20T09:45:00Z',
          updatedAt: '2024-01-20T09:45:00Z'
        },
        {
          id: '4',
          userId: '4',
          storeId: '1',
          rating: 3,
          userName: 'Emily Davis',
          createdAt: '2024-01-19T16:20:00Z',
          updatedAt: '2024-01-19T16:20:00Z'
        },
        {
          id: '5',
          userId: '5',
          storeId: '1',
          rating: 5,
          userName: 'David Wilson',
          createdAt: '2024-01-19T11:45:00Z',
          updatedAt: '2024-01-19T11:45:00Z'
        }
      ];
      
      setStoreData(mockStoreData);
      setRatings(mockRatings);
    } catch (error) {
      console.error('Failed to fetch store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySorting = () => {
    const sorted = [...ratings].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Rating];
      const bValue = b[sortConfig.key as keyof Rating];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setSortedRatings(sorted);
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const averageRating = storeData.rating;
  const totalRatings = storeData.totalRatings;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Dashboard</h1>
        <p className="text-gray-600">Monitor your store's performance and ratings</p>
      </div>

      {/* Store Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{storeData.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{storeData.address}</p>
              <div className="flex items-center space-x-2">
                <StarRating rating={storeData.rating} />
                <span className="text-sm font-medium text-gray-700">
                  {storeData.rating.toFixed(1)} ({storeData.totalRatings} reviews)
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Average Rating</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{averageRating.toFixed(1)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Total Ratings</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{totalRatings}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Ratings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">User Ratings</h3>
            </div>
            <Badge variant="secondary">{ratings.length} Total</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {sortedRatings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHeader
                    sortKey="userName"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  >
                    User Name
                  </SortableTableHeader>
                  <SortableTableHeader
                    sortKey="rating"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  >
                    Rating
                  </SortableTableHeader>
                  <SortableTableHeader
                    sortKey="createdAt"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  >
                    Date Submitted
                  </SortableTableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRatings.map((rating) => (
                  <TableRow key={rating.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{rating.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={rating.rating} size="sm" />
                        <Badge 
                          variant={rating.rating >= 4 ? 'success' : rating.rating >= 3 ? 'warning' : 'danger'}
                        >
                          {rating.rating} Stars
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(rating.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              title="No ratings yet"
              description="Your store hasn't received any ratings yet."
              icon={Star}
            />
          )}
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-green-600">New ratings</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">48</p>
                <p className="text-sm text-blue-600">Total ratings</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating Trend</p>
                <p className="text-2xl font-bold text-gray-900">+0.2</p>
                <p className="text-sm text-green-600">vs last month</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};