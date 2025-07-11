import React, { useState, useEffect } from 'react';
import { Store, Eye, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
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
import { adminService } from '../../services/adminService';
import { storeService } from '../../services/storeService';
import { Store as StoreType } from '../../types/store';
import { CreateStoreForm } from './CreateStoreForm';

export const StoresTable: React.FC = () => {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [filteredStores, setFilteredStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [stores, filters, sortConfig]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllStores();
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
        store.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        store.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        store.address.toLowerCase().includes(filters.address.toLowerCase())
      );
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof StoreType];
      const bValue = b[sortConfig.key as keyof StoreType];
      
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

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleViewStore = (store: StoreType) => {
    setSelectedStore(store);
    setIsDetailModalOpen(true);
  };

  const handleStoreCreated = () => {
    setIsCreateModalOpen(false);
    fetchStores();
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Stores Management</h3>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Store
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Filter by name..."
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Filter by email..."
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Filter by address..."
              value={filters.address}
              onChange={(e) => handleFilterChange('address', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Table */}
          {filteredStores.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHeader
                    sortKey="name"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  >
                    Name
                  </SortableTableHeader>
                  <SortableTableHeader
                    sortKey="email"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  >
                    Email
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
                    Rating
                  </SortableTableHeader>
                  <SortableTableHeader
                    sortKey="totalRatings"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  >
                    Total Ratings
                  </SortableTableHeader>
                  <SortableTableHeader
                    sortKey="createdAt"
                    currentSort={sortConfig}
                    onSort={handleSort}
                  >
                    Created
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
                      <div className="font-medium">{store.name}</div>
                    </TableCell>
                    <TableCell>{store.email}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={store.address}>
                        {store.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={store.rating} size="sm" />
                        <span className="text-sm text-gray-600">
                          {store.rating.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{store.totalRatings}</span>
                    </TableCell>
                    <TableCell>
                      {new Date(store.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewStore(store)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              title="No stores found"
              description="No stores match your current filters. Try adjusting your search criteria."
              icon={Store}
            />
          )}
        </CardContent>
      </Card>

      {/* Create Store Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Store"
        size="lg"
      >
        <CreateStoreForm onSuccess={handleStoreCreated} />
      </Modal>

      {/* Store Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Store Details"
        size="md"
      >
        {selectedStore && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedStore.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{selectedStore.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">{selectedStore.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="mt-1 flex items-center space-x-2">
                  <StarRating rating={selectedStore.rating} />
                  <span className="text-sm text-gray-600">
                    {selectedStore.rating.toFixed(1)} ({selectedStore.totalRatings} reviews)
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Created</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedStore.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};