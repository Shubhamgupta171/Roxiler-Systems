import React, { useState, useEffect } from 'react';
import { Search, Star, Store, MapPin, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { StarRating } from '../ui/StarRating';
import { Modal } from '../ui/Modal';
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
import { storeService } from '../../services/storeService';
import { StoreWithUserRating } from '../../types/store';

export const UserDashboard: React.FC = () => {
  const [stores, setStores] = useState<StoreWithUserRating[]>([]);
  const [filteredStores, setFilteredStores] = useState<StoreWithUserRating[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<StoreWithUserRating | null>(null);
  const [rating, setRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [stores, searchTerm, sortConfig]);

  const fetchStores = async () => {
    try {
      const data = await storeService.getAllStores();
      setStores(data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = stores.filter(store => {
      return (
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof StoreWithUserRating];
      const bValue = b[sortConfig.key as keyof StoreWithUserRating];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredStores(filtered);
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRateStore = (store: StoreWithUserRating) => {
    setSelectedStore(store);
    setRating(store.userRating || 0);
    setIsModalOpen(true);
  };

  const handleSubmitRating = async () => {
    if (!selectedStore || rating === 0) return;

    setIsSubmitting(true);
    try {
      if (selectedStore.userRating) {
        // Update existing rating
        await storeService.updateRating(selectedStore.id, rating);
      } else {
        // Submit new rating
        await storeService.submitRating(selectedStore.id, rating);
      }
      
      // Refresh stores list
      await fetchStores();
      setIsModalOpen(false);
      setSelectedStore(null);
      setRating(0);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Discover Stores</h1>
        <p className="text-gray-600">Find and rate amazing stores in your area</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search stores by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Store className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{store.name}</h3>
                    <p className="text-sm text-gray-600">{store.email}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{store.address}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Overall Rating</p>
                  <div className="flex items-center space-x-2">
                    <StarRating rating={store.rating} />
                    <span className="text-sm text-gray-600">({store.totalRatings})</span>
                  </div>
                </div>
              </div>

              {store.userRating && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Your Rating</p>
                  <StarRating rating={store.userRating} />
                </div>
              )}

              <Button
                onClick={() => handleRateStore(store)}
                variant={store.userRating ? "outline" : "primary"}
                className="w-full"
              >
                <Star className="h-4 w-4 mr-2" />
                {store.userRating ? 'Update Rating' : 'Rate Store'}
              </Button>
            </CardContent>
          </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHeader
                    sortKey="name"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  >
                    Store Name
                  </SortableTableHeader>
                  <SortableTableHeader
                    sortKey="address"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  >
                    Address
                  </SortableTableHeader>
                  <SortableTableHeader
                    sortKey="rating"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  >
                    Overall Rating
                  </SortableTableHeader>
                  <SortableTableHeader
                    sortKey="userRating"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  >
                    Your Rating
                  </SortableTableHeader>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Store className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{store.name}</div>
                          <div className="text-sm text-gray-500">{store.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={store.address}>
                        {store.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={store.rating} size="sm" />
                        <span className="text-sm text-gray-600">
                          {store.rating.toFixed(1)} ({store.totalRatings})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {store.userRating ? (
                        <StarRating rating={store.userRating} size="sm" />
                      ) : (
                        <span className="text-sm text-gray-400">Not rated</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleRateStore(store)}
                        variant={store.userRating ? "outline" : "primary"}
                        size="sm"
                      >
                        <Star className="h-4 w-4 mr-1" />
                        {store.userRating ? 'Update' : 'Rate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {filteredStores.length === 0 && !loading && (
        <div className="text-center py-12">
          <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No stores found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStore?.userRating ? 'Update Rating' : 'Rate Store'}
      >
        {selectedStore && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">{selectedStore.name}</h3>
              <p className="text-gray-600">{selectedStore.address}</p>
            </div>

            <div className="flex justify-center">
              <StarRating
                rating={rating}
                interactive
                onRatingChange={setRating}
                size="lg"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitRating}
                disabled={rating === 0 || isSubmitting}
                isLoading={isSubmitting}
                className="flex-1"
              >
                {selectedStore.userRating ? 'Update' : 'Submit'} Rating
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};