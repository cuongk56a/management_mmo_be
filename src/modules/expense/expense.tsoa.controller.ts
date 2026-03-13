import { Controller, Get, Post, Route, Body, Tags, Security } from 'tsoa';

interface ExpenseCreateBody {
  name: string;
  amount: number;
  currency?: 'USD' | 'VND';
  source: string;
}

@Route('expense')
@Tags('Expense')
@Security('jwt', ['ADMIN'])
export class ExpenseTsoaController extends Controller {

  /**
   * Xem danh sách chi tiêu công ty
   */
  @Get('/')
  public async getList(): Promise<any> {
    return;
  }

  /**
   * Tạo chi tiêu mới
   */
  @Post('/')
  public async createOne(@Body() body: ExpenseCreateBody): Promise<any> {
    return;
  }
}
