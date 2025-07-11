// src/admin/admin.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../auth/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { CreateUserDto } from './dto/create-user.dto';

import { CreateStoreDto } from '../stores/dto/create-store.dto';



@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,

    @InjectRepository(Rating)
    private readonly ratingsRepository: Repository<Rating>,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.usersRepository.count(),
      this.storesRepository.count(),
      this.ratingsRepository.count(),
    ]);

    
    return {
      totalUsers,
      totalStores,
      totalRatings,
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async getAllUsers(filters?: {
    name?: string;
    email?: string;
    address?: string;
    role?: string;
  }): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user');

    if (filters?.name) {
      query.andWhere('user.name LIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters?.email) {
      query.andWhere('user.email LIKE :email', {
        email: `%${filters.email}%`,
      });
    }

    if (filters?.address) {
      query.andWhere('user.address LIKE :address', {
        address: `%${filters.address}%`,
      });
    }

    if (filters?.role) {
      query.andWhere('user.role = :role', { role: filters.role });
    }

    query.orderBy('user.createdAt', 'DESC');

    return query.getMany();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async getAllStores(filters?: {
    name?: string;
    email?: string;
    address?: string;
  }): Promise<Store[]> {
    const query = this.storesRepository.createQueryBuilder('store');

    if (filters?.name) {
      query.andWhere('store.name LIKE :name', {
        name: `%${filters.name}%`,
      });
    }



    if (filters?.email) {
      query.andWhere('store.email LIKE :email', {
        email: `%${filters.email}%`,
      });
    }

    if (filters?.address) {
      query.andWhere('store.address LIKE :address', {
        address: `%${filters.address}%`,
      });
    }

    query.orderBy('store.createdAt', 'DESC');

    return query.getMany();
  }

  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const existingStore = await this.storesRepository.findOne({
      where: { email: createStoreDto.email },
    });

    if (existingStore) {
      throw new BadRequestException('Store with this email already exists');
    }

    const store = this.storesRepository.create({
      name: createStoreDto.name,
      email: createStoreDto.email,
      address: createStoreDto.address,
    });

    // Optional: Assign owner if ownerId is provided
   if (createStoreDto.ownerId) {
  const owner = await this.usersRepository.findOne({
where: { id: createStoreDto.ownerId },


  });

  if (!owner) {
    throw new BadRequestException('Invalid owner ID');
  }

  store.owner = owner;
}

    return this.storesRepository.save(store);
  }
}
