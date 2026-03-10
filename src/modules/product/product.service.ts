import mongoose from 'mongoose';
import { ProductModel } from './product.model';
import ApiError from '../../utils/core/ApiError';
import httpStatus from 'http-status';
import { RedisService } from '../../redis/RedisService';

export class ProductService {
  static async createProduct(productBody: any) {
    const product = await ProductModel.create(productBody);
    await RedisService.setCachedProducts(null); // Clear cache
    return product;
  }

  static async getProducts(query: any) {
    // Basic caching implementation if no query passed
    if (Object.keys(query).length === 0) {
      const cachedProducts = await RedisService.getCachedProducts();
      if (cachedProducts) {
        return cachedProducts;
      }
    }
    const products = await ProductModel.find(query);
    if (Object.keys(query).length === 0) {
       await RedisService.setCachedProducts(products); // default app:products key
    }
    return products;
  }

  static async getProductById(id: string) {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy sản phẩm');
    }
    return product;
  }

  static async updateProductById(id: string, updateBody: any) {
    const product = await this.getProductById(id);
    Object.assign(product, updateBody);
    await product.save();
    
    // Xóa cache
    await RedisService.setCachedProducts(null);
    return product;
  }

  static async deleteProductById(id: string) {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy sản phẩm');
    }
    await product.deleteOne();

    // Xóa cache
    await RedisService.setCachedProducts(null);
    return product;
  }
}
