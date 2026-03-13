import { Controller, Get, Post, Route, Body, Query, Tags, Security } from 'tsoa';

interface OrderCreateBody {
  customerId: string;
  productId: string;
  price: number;
  currency?: 'USD' | 'VND';
}

@Route('order')
@Tags('Order')
@Security('jwt')
export class OrderTsoaController extends Controller {

  /**
   * Xem danh sách đơn hàng
   * Staff chỉ thấy đơn hàng của khách hàng do mình quản lý
   */
  @Get('/')
  public async getList(
    @Query() status?: 'pending' | 'completed' | 'cancelled',
    @Query() staffId?: string
  ): Promise<any> {
    return;
  }

  /**
   * Tạo đơn hàng mới
   */
  @Security('jwt', ['ADMIN', 'STAFF'])
  @Post('/')
  public async createOne(@Body() body: OrderCreateBody): Promise<any> {
    return;
  }
}
