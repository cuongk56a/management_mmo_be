import mongoose from 'mongoose';
import { WalletModel } from './wallet.model';
import { DepositModel } from './deposit.model';
import { WithdrawModel } from './withdraw.model';
import { CustomerModel } from '../customer/customer.model';
import ApiError from '../../utils/core/ApiError';
import httpStatus from 'http-status';

export class WalletService {
  static async getWallet(userId: string) {
    let wallet = await WalletModel.findOne({ userId });
    if (!wallet) {
      wallet = await WalletModel.create({ userId, balance: 0, currency: 'USD' });
    }
    return wallet;
  }

  static async createDeposit(depositBody: any, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const depositPayload: any = {
        userId,
        amount: depositBody.amount,
        currency: depositBody.currency || 'USD',
        method: depositBody.method,
        status: depositBody.method === 'admin' ? 'approved' : 'pending',
      };

      if (depositBody.method === 'bank') {
        const transactionId = new mongoose.Types.ObjectId().toString(); // Generate unique trans ID
        depositPayload.note = `${transactionId} - ${depositBody.amount} - ${depositBody.currency || 'USD'}`;
      }

      const deposit = await DepositModel.create([depositPayload], { session });

      if (depositBody.method === 'admin') {
        let wallet = await WalletModel.findOne({ userId }).session(session);
        if (!wallet) {
          wallet = await WalletModel.create([{ userId, balance: depositBody.amount, currency: depositBody.currency || 'USD' }], { session }).then(res => res[0]);
        } else {
            wallet.balance += depositBody.amount;
            await wallet.save({ session });
        }
      }

      await session.commitTransaction();
      return deposit[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getDepositHistory(userId: string) {
    return DepositModel.find({ userId }).sort({ createdAt: -1 });
  }

  static async createWithdraw(withdrawBody: any, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const wallet = await WalletModel.findOne({ userId }).session(session);
      if (!wallet || wallet.balance < withdrawBody.amount) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Số dư không đủ');
      }

      const customer = await CustomerModel.findOne({ email: (await mongoose.model('User').findById(userId))?.email }).session(session);
      
      if (!customer || customer.totalSpent <= 200) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Tổng chi tiêu phải > 200 USD để được rút tiền');
      }

      const withdraw = await WithdrawModel.create([{
        userId,
        amount: withdrawBody.amount,
        currency: withdrawBody.currency || 'USD',
        status: 'pending'
      }], { session });

      // Deducting balance immediately when pending or keeping it till approval? Here we deduct immediately (hold balance)
      wallet.balance -= withdrawBody.amount;
      await wallet.save({ session });

      await session.commitTransaction();
      return withdraw[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getWithdrawHistory(userId: string) {
    return WithdrawModel.find({ userId }).sort({ createdAt: -1 });
  }
}
