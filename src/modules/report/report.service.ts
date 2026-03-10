import { OrderModel } from '../order/order.model';
import { ExpenseModel } from '../expense/expense.model';
import { MonthlyReportModel } from './monthlyReport.model';
import moment from 'moment-timezone';

export class ReportService {
  static async generateMonthlyReport(monthStr?: string) {
    // 1. Determine the month string "YYYY-MM"
    const targetMonth = monthStr || moment().format('YYYY-MM');
    const startOfMonth = moment(targetMonth, 'YYYY-MM').startOf('month').toDate();
    const endOfMonth = moment(targetMonth, 'YYYY-MM').endOf('month').toDate();

    // 2. Calculate Revenue and Commission from Orders
    const ordersAggregation = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$price' },
          totalCommission: { $sum: '$commission' }
        }
      }
    ]);

    const totalRevenue = ordersAggregation.length > 0 ? ordersAggregation[0].totalRevenue : 0;
    const totalCommission = ordersAggregation.length > 0 ? ordersAggregation[0].totalCommission : 0;

    // 3. Calculate Expenses
    const expensesAggregation = await ExpenseModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: '$amount' }
        }
      }
    ]);

    const totalExpense = expensesAggregation.length > 0 ? expensesAggregation[0].totalExpense : 0;

    // 4. Calculate Profit
    const profit = totalRevenue - totalExpense - totalCommission;

    // 5. Update or Create Report
    const reportDate = {
      month: targetMonth,
      totalRevenue,
      totalExpense,
      totalCommission,
      profit
    };

    const report = await MonthlyReportModel.findOneAndUpdate(
      { month: targetMonth },
      reportDate,
      { new: true, upsert: true }
    );

    return report;
  }

  static async getMonthlyReports(query: any) {
    return MonthlyReportModel.find(query).sort({ month: -1 });
  }
}
