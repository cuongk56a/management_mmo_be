import { Controller, Get, Post, Put, Delete, Route, Body, Query, Path, Tags, Security } from 'tsoa';
import { EmployeeService } from './employee.service';

interface EmployeeCreateBody {
  userId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
  commissionRate?: number;
}

interface EmployeeUpdateBody {
  name?: string;
  email?: string;
  role?: 'ADMIN' | 'STAFF';
  commissionRate?: number;
}

@Route('employees')
@Tags('Employees')
@Security('jwt', ['ADMIN'])
export class EmployeeTsoaController extends Controller {

  /**
   * Xem danh sách nhân viên
   */
  @Get('/')
  public async getEmployees(
    @Query() role?: 'ADMIN' | 'STAFF'
  ): Promise<any> {
    const query: any = {};
    if (role) query.role = role;

    const employees = await EmployeeService.getAll(query);
    return {
      status: 'success',
      results: employees.length,
      data: { employees }
    };
  }

  /**
   * Tạo nhân viên mới
   */
  @Post('/')
  public async createEmployee(@Body() body: EmployeeCreateBody): Promise<any> {
    const employee = await EmployeeService.createOne(body);
    this.setStatus(201);
    return {
      status: 'success',
      data: { employee }
    };
  }

  /**
   * Xem thông tin một nhân viên
   */
  @Get('{id}')
  public async getEmployee(@Path() id: string): Promise<any> {
    const employee = await EmployeeService.getOne({ _id: id });
    return {
      status: 'success',
      data: { employee }
    };
  }

  /**
   * Cập nhật thông tin nhân viên
   */
  @Put('{id}')
  public async updateEmployee(@Path() id: string, @Body() body: EmployeeUpdateBody): Promise<any> {
    const employee = await EmployeeService.updateOne({ _id: id }, body);
    return {
      status: 'success',
      data: { employee }
    };
  }

  /**
   * Xoá nhân viên
   */
  @Delete('{id}')
  public async deleteEmployee(@Path() id: string): Promise<any> {
    await EmployeeService.deleteOne({ _id: id });
    this.setStatus(204);
    return '';
  }
}
