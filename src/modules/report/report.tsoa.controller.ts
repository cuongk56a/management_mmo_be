import { Controller, Get, Route, Query, Tags, Security } from 'tsoa';

@Route('report')
@Tags('Report')
@Security('jwt', ['ADMIN'])
export class ReportTsoaController extends Controller {

  /**
   * Xem chi tiết báo cáo 1 tháng định sẵn. Sẽ tự động trích xuất / tổng kết mới nhất
   * Gửi param YYYY-MM
   */
  @Get('monthly')
  public async getMonthlyReport(
    @Query() month?: string
  ): Promise<any> {
    return;
  }

  /**
   * Xem lịch sử các báo cáo (dạng list các tháng cũ)
   */
  @Get('/')
  public async getList(): Promise<any> {
    return;
  }
}
