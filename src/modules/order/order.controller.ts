import { Controller, Get, Post, Put, Delete, Route, Body, Query, Path, Tags, Security, Request } from 'tsoa';
import { OrderService } from './order.service';

interface OrderCreateBody {
  customerId: string;
  productId: string;
  price: number;
  currency?: 'USD' | 'VND';
}

@Route('orders')
@Tags('Orders')
@Security('jwt')
export class OrderController extends Controller {

  /**
   * Xem danh sách đơn hàng
   * Staff chỉ thấy đơn hàng của khách hàng do mình quản lý
   */
  @Get('/')
  public async getOrders(
    @Request() request: any,
    @Query() status?: 'pending' | 'completed' | 'cancelled'
  ): Promise<any> {
    const user = (request as any).user;
    const staffIdFilter = user.role === 'STAFF' ? user.employeeId : undefined;

    const query: any = {};
    if (status) query.status = status;

    const orders = await OrderService.getOrders(query, staffIdFilter);
    return {
      status: 'success',
      results: orders.length,
      data: { orders }
    };
  }

  /**
   * Tạo đơn hàng mới
   */
  @Security('jwt', ['ADMIN', 'STAFF'])
  @Post('/')
  public async createOrder(@Body() body: OrderCreateBody): Promise<any> {
    const order = await OrderService.createOrder(body);
    this.setStatus(201);
    return {
      status: 'success',
      data: { order }
    };
  }
}
