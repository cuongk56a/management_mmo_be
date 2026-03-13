import { Controller, Get, Post, Put, Delete, Route, Body, Query, Path, Tags, Security } from 'tsoa';

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

@Route('product')
@Tags('Product')
@Security('jwt')
export class ProductTsoaController extends Controller {

  /**
   * Xem danh sách tất cả sản phẩm
   */
  @Get('/')
  public async getList(
    @Query() type?: string,
    @Query() supplier?: string
  ): Promise<any> {
    return;
  }

  /**
   * Tạo sản phẩm mới (chỉ Admin)
   */
  @Security('jwt', ['ADMIN'])
  @Post('/')
  public async createOne(@Body() body: ProductCreateBody): Promise<any> {
    return;
  }

  /**
   * Xem chi tiết sản phẩm
   */
  @Get('{productId}')
  public async getOne(@Path() productId: string): Promise<any> {
    return;
  }

  /**
   * Sửa sản phẩm (chỉ Admin)
   */
  @Security('jwt', ['ADMIN'])
  @Put('{productId}')
  public async updateOne(@Path() productId: string, @Body() body: ProductUpdateBody): Promise<any> {
    return;
  }

  /**
   * Xoá sản phẩm (chỉ Admin)
   */
  @Security('jwt', ['ADMIN'])
  @Delete('{productId}')
  public async deleteOne(@Path() productId: string): Promise<any> {
    return;
  }
}
