import { Controller, Get, Post, Put, Delete, Route, Body, Query, Path, Tags, Security } from 'tsoa';
import { ReportService } from './report.service';

@Route('reports')
@Tags('Reports')
@Security('jwt', ['ADMIN'])
export class ReportController extends Controller {

  /**
   * Xem chi tiết báo cáo 1 tháng định sẵn. Sẽ tự động trích xuất / tổng kết mới nhất
   * Gửi param YYYY-MM
   */
  @Get('monthly')
  public async getMonthlyReport(
    @Query() month?: string
  ): Promise<any> {
    await ReportService.generateMonthlyReport(month);

    const query = month ? { month } : {};
    const reports = await ReportService.getMonthlyReports(query);

    return {
      status: 'success',
      data: { report: reports[0] }
    };
  }

  /**
   * Xem lịch sử các báo cáo (dạng list các tháng cũ)
   */
  @Get('/')
  public async getMonthlyReports(): Promise<any> {
    const reports = await ReportService.getMonthlyReports({});
    return {
      status: 'success',
      results: reports.length,
      data: { reports }
    };
  }
}
