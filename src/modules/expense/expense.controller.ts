import { Controller, Get, Post, Put, Delete, Route, Body, Query, Path, Tags, Security } from 'tsoa';
import { ExpenseService } from './expense.service';

interface ExpenseCreateBody {
  name: string;
  amount: number;
  currency?: 'USD' | 'VND';
  source: string;
}

@Route('expenses')
@Tags('Expenses')
@Security('jwt', ['ADMIN'])
export class ExpenseController extends Controller {

  /**
   * Xem danh sách chi tiêu công ty
   */
  @Get('/')
  public async getExpenses(): Promise<any> {
    const expenses = await ExpenseService.getExpenses({});
    return {
      status: 'success',
      results: expenses.length,
      data: { expenses }
    };
  }

  /**
   * Tạo chi tiêu mới
   */
  @Post('/')
  public async createExpense(@Body() body: ExpenseCreateBody): Promise<any> {
    const expense = await ExpenseService.createExpense(body);
    this.setStatus(201);
    return {
      status: 'success',
      data: { expense }
    };
  }
}
