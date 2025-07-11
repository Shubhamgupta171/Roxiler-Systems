import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '../auth/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private checkAdminRole(user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied. Admin role required.');
    }
  }

  @Get('dashboard')
  getDashboardStats(@Request() req) {
    this.checkAdminRole(req.user);
    return this.adminService.getDashboardStats();
  }

  @Post('users')
  createUser(@Request() req, @Body() createUserDto: CreateUserDto) {
    this.checkAdminRole(req.user);
    return this.adminService.createUser(createUserDto);
  }

  @Get('users')
  getAllUsers(@Request() req, @Query() filters: any) {
    this.checkAdminRole(req.user);
    return this.adminService.getAllUsers(filters);
  }

  @Get('users/:id')
  getUserById(@Request() req, @Param('id') id: string) {
    this.checkAdminRole(req.user);
    return this.adminService.getUserById(id);
  }

  @Get('stores')
  getAllStores(@Request() req, @Query() filters: any) {
    this.checkAdminRole(req.user);
    return this.adminService.getAllStores(filters);
  }

  @Post('stores')
  createStore(@Request() req, @Body() createStoreDto: any) {
    this.checkAdminRole(req.user);
    return this.adminService.createStore(createStoreDto);
  }
}