import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from '../common/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.productModel.create(createProductDto);
      return { product };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on creating product: ${error}`,
      );
    }
  }

  async findProductsByPlace(placeId: string, paginationDto: PaginationDto) {
    try {
      const query = { place: placeId };
      const { limit = 10, offset = 0 } = paginationDto;

      const [total, products] = await Promise.all([
        this.productModel.countDocuments(query),
        this.productModel
          .find(query)
          .limit(limit)
          .skip(offset)
          .populate('place', '-_id name')
          .select('-createdAt -updatedAt'),
      ]);

      return this.paginationResponse(
        total,
        products,
        limit,
        offset,
        `products/place/${placeId}`,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on getting products of this place: ${error}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.productModel.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on getting product: ${error}`,
      );
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        updateProductDto,
        { new: true },
      );

      if (!updatedProduct) {
        throw new NotFoundException('Product not found');
      }

      return { product: updatedProduct };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on updating product: ${error}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);

      if (!product) {
        throw new NotFoundException(`No product with ID ${id} was found`);
      }

      const deletedProduct = await this.productModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        throw new NotFoundException(`Unable to delete product with ID ${id}`);
      }

      return { product: deletedProduct };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on deleting product: ${error}`,
      );
    }
  }

  private paginationResponse(
    total: number,
    products: Product[],
    limit: number,
    offset: number,
    basePath: string,
  ) {
    return {
      page: offset,
      limit,
      total,
      next:
        offset * limit < total
          ? `${basePath}?offset=${offset + 1}&limit=${limit}`
          : null,
      prev:
        offset - 1 > 0
          ? `${basePath}?offset=${offset - 1}&limit=${limit}`
          : null,
      products,
    };
  }
}
