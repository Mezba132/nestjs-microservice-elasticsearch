import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';

@Controller('product')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads/files/',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const dateTime = Date.now();
          callback(null, `${dateTime}-${name}${fileExtName}`);
        },
      }),
    }),
  )
  @Post('create')
  async createProduct(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Body() body: CreateProductDto,
  ) {
    return await this.productsService.createProduct(body, files);
  }

  @Get('all')
  async getAllProduct(
    @Query('category') category: string,
    @Query('search') search: string,
    @Query('skip') skip: number,
  ) {
    return await this.productsService.getAllProduct(category, skip, search);
  }

  @Patch('update/:id')
  async updateProduct(@Param('id') id: number, @Body() body: UpdateProductDto) {
    return await this.productsService.updateProduct(id, body);
  }

  @Delete('delete/:id')
  async deleteProduct(@Param('id') id: number) {
    return await this.productsService.deleteProduct(id);
  }
}
