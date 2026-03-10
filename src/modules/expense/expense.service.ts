import mongoose from 'mongoose';
import { ExpenseModel } from './expense.model';
import ApiError from '../../utils/core/ApiError';
import httpStatus from 'http-status';

export class ExpenseService {
  static async createExpense(expenseBody: any) {
    const expense = await ExpenseModel.create(expenseBody);
    return expense;
  }

  static async getExpenses(query: any) {
    return ExpenseModel.find(query).sort({ createdAt: -1 });
  }

  static async getExpenseById(id: string) {
    const expense = await ExpenseModel.findById(id);
    if (!expense) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy chi tiêu');
    }
    return expense;
  }
}
