import { Controller, Get, Post, Put, Delete, Route, Body, Query, Path, Tags, Security } from 'tsoa';

interface CustomerCreateBody {
  name: string;
  email: string;
  phone: string;
  staffId?: string;
  leadSourceId?: string;
}

interface CustomerUpdateBody {
  name?: string;
  email?: string;
  phone?: string;
  staffId?: string;
  leadSourceId?: string;
}

@Route('customer')
@Tags('Customer')
@Security('jwt')
export class CustomerTsoaController extends Controller {

  /**
   * Xem danh sách khách hàng
   */
  @Get('/')
  public async getList(
    @Query() staffId?: string,
    @Query() leadSourceId?: string
  ): Promise<any> {
    return;
  }

  /**
   * Tạo khách hàng mới
   */
  @Security('jwt', ['ADMIN', 'STAFF'])
  @Post('/')
  public async createOne(@Body() body: CustomerCreateBody): Promise<any> {
    return;
  }

  /**
   * Xem thông tin một khách hàng
   */
  @Get('{customerId}')
  public async getOne(@Path() customerId: string): Promise<any> {
    return;
  }

  /**
   * Cập nhật thông tin khách hàng
   */
  @Security('jwt', ['ADMIN', 'STAFF'])
  @Put('{customerId}')
  public async updateOne(
    @Path() customerId: string,
    @Body() body: CustomerUpdateBody
  ): Promise<any> {
    return;
  }

  /**
   * Xoá khách hàng (Chỉ Admin)
   */
  @Security('jwt', ['ADMIN'])
  @Delete('{customerId}')
  public async deleteOne(@Path() customerId: string): Promise<any> {
    return;
  }
}
