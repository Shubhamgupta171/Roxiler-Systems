import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { StoresService } from '../stores/stores.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    private storesService: StoresService,
  ) {}

  async create(userId: string, createRatingDto: CreateRatingDto): Promise<Rating> {
  const store = await this.storesService.findOne(createRatingDto.storeId);

  const existingRating = await this.ratingsRepository.findOne({
    where: {
      user: { id: userId },
      store: { id: createRatingDto.storeId },
    },
  });

  if (existingRating) {
    throw new BadRequestException('You have already rated this store');
  }

  const rating = this.ratingsRepository.create({
    rating: createRatingDto.rating,
    user: { id: userId },
    store: { id: createRatingDto.storeId },
  });

  const savedRating = await this.ratingsRepository.save(rating);
  await this.storesService.updateRating(createRatingDto.storeId);

  return savedRating;
}

async update(storeId: number, userId: string, updateRatingDto: UpdateRatingDto): Promise<Rating> {
  const rating = await this.ratingsRepository.findOne({
    where: {
      user: { id: userId },
      store: { id: storeId },
    },
    relations: ['store'],
  });

  if (!rating) {
    throw new NotFoundException('Rating not found');
  }

  rating.rating = updateRatingDto.rating;
  const updatedRating = await this.ratingsRepository.save(rating);
  await this.storesService.updateRating(rating.store.id);

  return updatedRating;
}

async findByStore(storeId: number): Promise<Rating[]> {
  return this.ratingsRepository.find({
    where: { store: { id: storeId } },
    relations: ['user'],
  });
}
}