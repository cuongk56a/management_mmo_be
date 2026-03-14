import { Controller, Get, Post, Put, Delete, Route, Body, Query, Path, Tags, Security } from 'tsoa';
import { EmployeeService } from './employee.service';
import { ROLETYPE } from './employee.type';
import { query } from 'express';
import { UserModel } from '../user/user.model';

interface EmployeeCreateBody {
  userId: string;
  role: ROLETYPE.MANAGER | ROLETYPE.STAFF;
  commissionRate?: number;
  isActive?: boolean;
}

interface EmployeeUpdateBody {
  role?: ROLETYPE.MANAGER | ROLETYPE.STAFF;
  commissionRate?: number;
  isActive?: boolean;
}

interface EmployeeGetListQuery {
  role?: ROLETYPE.MANAGER | ROLETYPE.STAFF;
  isActive?: boolean;
  search?: string;
  hasUser?: boolean;
  page?: number;
  limit?: number;
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
    @Query() sort?: string,
    @Query() limit: number = 10,
    @Query() page: number = 1,
    @Query() search?: string,
    @Query() hasUser?: boolean,
    @Query() role?: ROLETYPE.MANAGER | ROLETYPE.STAFF,
    @Query() isActive?: boolean,
  ): Promise<any> {
    const query: any = {
      deletedById: { $exists: false },
    };

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive;

    if (search) {
      const users = await UserModel.find({
        $text: { $search: search }
      }).select('_id');

      query.userId = { $in: users.map(u => u._id) };
    }

    const employees = await EmployeeService.getList(query);
    return {
      status: 'success',
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
  public async getEmployee(@Path() id: string, @Query() hasUser?: boolean): Promise<any> {
    const employee = await EmployeeService.getOne({ _id: id }, { hasUser });
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
