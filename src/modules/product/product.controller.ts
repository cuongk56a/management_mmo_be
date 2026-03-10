import { Controller, Get, Post, Put, Delete, Route, Body, Query, Path, Tags, Security, Request as TsoaRequest } from 'tsoa';
import { ProductService } from './product.service';

interface ProductCreateBody {
  name: string;
  type: 'external' | 'internal';
  costPrice: number;
  sellPrice: number;
  description?: string;
  supplier?: string;
}

interface ProductUpdateBody {
  name?: string;
  type?: 'external' | 'internal';
  costPrice?: number;
  sellPrice?: number;
  description?: string;
  supplier?: string;
}

@Route('products')
@Tags('Products')
@Security('jwt')
export class ProductController extends Controller {

  /**
   * Xem danh sách tất cả sản phẩm
   */
  @Get('/')
  public async getProducts(
    @Query() type?: string,
    @Query() supplier?: string
  ): Promise<{ status: string; results?: number; data: any }> {
    const query: any = {};
    if (type) query.type = type;
    if (supplier) query.supplier = supplier;

    const products = await ProductService.getProducts(query);
    return {
      status: 'success',
      results: products.length,
      data: { products }
    };
  }

  /**
   * Tạo sản phẩm mới (chỉ Admin)
   */
  @Security('jwt', ['ADMIN'])
  @Post('/')
  public async createProduct(@Body() body: ProductCreateBody): Promise<any> {
    const product = await ProductService.createProduct(body);
    this.setStatus(201);
    return {
      status: 'success',
      data: { product }
    };
  }

  /**
   * Xem chi tiết sản phẩm
   */
  @Get('{id}')
  public async getProduct(@Path() id: string): Promise<any> {
    const product = await ProductService.getProductById(id);
    return {
      status: 'success',
      data: { product }
    };
  }

  /**
   * Sửa sản phẩm (chỉ Admin)
   */
  @Security('jwt', ['ADMIN'])
  @Put('{id}')
  public async updateProduct(@Path() id: string, @Body() body: ProductUpdateBody): Promise<any> {
    const product = await ProductService.updateProductById(id, body);
    return {
      status: 'success',
      data: { product }
    };
  }

  /**
   * Xoá sản phẩm (chỉ Admin)
   */
  @Security('jwt', ['ADMIN'])
  @Delete('{id}')
  public async deleteProduct(@Path() id: string): Promise<any> {
    await ProductService.deleteProductById(id);
    this.setStatus(204);
    return '';
  }
}
