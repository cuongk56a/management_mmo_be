import { Controller, Get, Post, Put, Delete, Route, Body, Query, Path, Tags, Security, Request } from 'tsoa';
import { CustomerService } from './customer.service';

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

@Route('customers')
@Tags('Customers')
@Security('jwt')
export class CustomerController extends Controller {

  /**
   * Xem danh sách khách hàng
   * Staff chỉ thấy khách hàng của mình
   */
  @Get('/')
  public async getCustomers(
    @Request() request: any,
    @Query() staffId?: string,
    @Query() leadSourceId?: string
  ): Promise<any> {
    const user = (request as any).user;
    const staffIdFilter = user.role === 'STAFF' ? user.employeeId : staffId;

    const query: any = {};
    if (leadSourceId) query.leadSourceId = leadSourceId;

    const customers = await CustomerService.getCustomers(query, staffIdFilter);
    return {
      status: 'success',
      results: customers.length,
      data: { customers }
    };
  }

  /**
   * Tạo khách hàng mới
   */
  @Security('jwt', ['ADMIN', 'STAFF'])
  @Post('/')
  public async createCustomer(@Body() body: CustomerCreateBody): Promise<any> {
    const customer = await CustomerService.createCustomer(body);
    this.setStatus(201);
    return {
      status: 'success',
      data: { customer }
    };
  }

  /**
   * Xem thông tin một khách hàng
   */
  @Get('{id}')
  public async getCustomer(@Request() request: any, @Path() id: string): Promise<any> {
    const user = (request as any).user;
    const staffIdFilter = user.role === 'STAFF' ? user.employeeId : undefined;
    const customer = await CustomerService.getCustomerById(id, staffIdFilter);
    return {
      status: 'success',
      data: { customer }
    };
  }

  /**
   * Cập nhật thông tin khách hàng
   */
  @Security('jwt', ['ADMIN', 'STAFF'])
  @Put('{id}')
  public async updateCustomer(
    @Request() request: any,
    @Path() id: string,
    @Body() body: CustomerUpdateBody
  ): Promise<any> {
    const user = (request as any).user;
    const staffIdFilter = user.role === 'STAFF' ? user.employeeId : undefined;
    const customer = await CustomerService.updateCustomerById(id, body, staffIdFilter);
    return {
      status: 'success',
      data: { customer }
    };
  }

  /**
   * Xoá khách hàng (Chỉ Admin)
   */
  @Security('jwt', ['ADMIN'])
  @Delete('{id}')
  public async deleteCustomer(@Path() id: string): Promise<any> {
    await CustomerService.deleteCustomerById(id);
    this.setStatus(204);
    return '';
  }
}
