import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
  ) {}

  createProduct = async (body: CreateProductDto, files: any) => {
    try {
      let price = isNaN(parseInt(body.price)) ? 0 : parseInt(body.price);
      const product = await this.prisma.product.create({
        data: {
          name: body.name,
          description: body.description,
          price,
          productCode: body.productCode,
          category: body.category,
        },
      });

      this.client.emit('product_created', product);

      if (product) {
        let imageInfos = [];
        for (let file of files.file) {
          imageInfos.push({
            prodId: product.id,
            path: file.path,
          });
        }

        await this.prisma.image.createMany({
          data: imageInfos,
          skipDuplicates: false,
        });
      }

      return {
        success: true,
        message: 'Product Saved Successfully',
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };

  getAllProduct = async (category: string, skip: number, search: string) => {
    try {
      if (isNaN(skip)) skip = undefined;
      let products = await this.prisma.product.findMany({
        where: { category, name: { search } },
        skip,
        take: 10,
        orderBy: {
          id: 'asc',
        },
      });
      this.client.emit('hello', 'Hello From Prisma-Postgres');
      return {
        success: true,
        message: 'All Products fetch successfully.',
        data: products,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };

  updateProduct = async (id: number, body: any) => {
    try {
      let updateProduct = await this.prisma.product.update({
        where: { id },
        data: body,
      });
      if (updateProduct) {
        this.client.emit('product_update', updateProduct);
      }
      return {
        success: true,
        message: 'Update data successfully.',
        data: updateProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };

  deleteProduct = async (id: number) => {
    try {
      // let deleteProduct = await this.prisma.product.delete({
      //   where: { id: id },
      // });
      this.client.emit('product_delete', id);
      // return {
      //   sussces: true,
      //   message: 'deleted data successfully.',
      //   data: deleteProduct,
      // };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };
}
