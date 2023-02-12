import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { ApiTags } from '@nestjs/swagger';
import { EventPattern } from '@nestjs/microservices';

@Controller('search')
@ApiTags('Search - CRUD')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @EventPattern('product_created')
  async createSeachPost(@Body() data: any) {
    return await this.searchService.createSeachPost(data);
  }

  @Get()
  async searchText(@Query('search') search: string) {
    return await this.searchService.searchText(search);
  }

  @EventPattern('product_update')
  async updateSearch(@Body() updateSearchDto: any) {
    return await this.searchService.updateSearch(updateSearchDto);
  }

  @EventPattern('product_delete')
  removeSearch(@Body() data: any) {
    return this.searchService.removeSearch(data);
  }
}
