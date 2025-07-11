import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storesRepository.create(createStoreDto);
    return this.storesRepository.save(store);
  }

  async findAll(search?: string): Promise<Store[]> {
    const query = this.storesRepository.createQueryBuilder('store');
    
    if (search) {
      query.where('store.name LIKE :search OR store.address LIKE :search', {
        search: `%${search}%`,
      });
    }
    
    // Add ordering for consistent results
    query.orderBy('store.createdAt', 'DESC');
    
    return query.getMany();
  }

  async findAllWithUserRatings(userId: string, search?: string): Promise<any[]> {
    const query = this.storesRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.ratings', 'rating', 'rating.user.id = :userId', { userId });

    if (search) {
      query.where('store.name LIKE :search OR store.address LIKE :search', {
        search: `%${search}%`,
      });
    }

    // Add ordering for consistent results
    query.orderBy('store.createdAt', 'DESC');

    const stores = await query.getMany();

    return stores.map(store => ({
      ...store,
      userRating: store.ratings.length > 0 ? store.ratings[0].rating : null,
      ratings: undefined,
    }));
  }

  async findOne(id: number): Promise<Store> {
  const store = await this.storesRepository.findOne({ where: { id } });
  if (!store) {
    throw new NotFoundException('Store not found');
  }
  return store;
}

async updateRating(storeId: number): Promise<void> {
  const ratings = await this.ratingsRepository.find({
    where: { store: { id: storeId } },
  });

  if (ratings.length === 0) {
    await this.storesRepository.update(storeId, {
      rating: 0,
      totalRatings: 0,
    });
    return;
  }

  const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  const averageRating = totalRating / ratings.length;

  await this.storesRepository.update(storeId, {
    rating: Math.round(averageRating * 100) / 100,
    totalRatings: ratings.length,
  });
}
}