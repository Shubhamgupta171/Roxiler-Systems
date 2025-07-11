import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
  ParseIntPipe
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(@Request() req, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(req.user.id, createRatingDto);
  }
@Put(':id')
update(
  @Param('id', ParseIntPipe) storeId: number,
  @Request() req,
  @Body() updateRatingDto: UpdateRatingDto,
) {
  return this.ratingsService.update(storeId, req.user.id, updateRatingDto);
}

@Get('store/:storeId')
findByStore(@Param('storeId', ParseIntPipe) storeId: number) {
  return this.ratingsService.findByStore(storeId);

  }
}