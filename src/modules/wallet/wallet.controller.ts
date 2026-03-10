import { Controller, Get, Post, Put, Delete, Route, Body, Query, Path, Tags, Security, Request } from 'tsoa';
import { WalletService } from './wallet.service';

interface DepositBody {
  amount: number;
  currency?: 'USD' | 'VND';
  method: 'bank' | 'admin';
}

interface WithdrawBody {
  amount: number;
  currency?: 'USD' | 'VND';
}

@Route('wallet')
@Tags('Wallet')
@Security('jwt')
export class WalletController extends Controller {

  /**
   * Xem ví cá nhân
   */
  @Get('/')
  public async getWallet(@Request() request: any): Promise<any> {
    const user = (request as any).user;
    const wallet = await WalletService.getWallet(user.id);
    return {
      status: 'success',
      data: { wallet }
    };
  }

  /**
   * KH Yêu cầu nạp tiền (hoặc Admin cấp tiền)
   */
  @Post('deposit')
  public async createDeposit(
    @Request() request: any,
    @Body() body: DepositBody
  ): Promise<any> {
    const user = (request as any).user;
    const deposit = await WalletService.createDeposit(body, user.id);
    this.setStatus(201);
    return {
      status: 'success',
      data: { deposit }
    };
  }

  /**
   * Xem lịch sử nạp tiền
   */
  @Get('deposit-history')
  public async getDepositHistory(@Request() request: any): Promise<any> {
    const user = (request as any).user;
    const deposits = await WalletService.getDepositHistory(user.id);
    return {
      status: 'success',
      results: deposits.length,
      data: { deposits }
    };
  }

  /**
   * Yêu cầu rút tiền khỏi ví
   */
  @Post('withdraw')
  public async createWithdraw(
    @Request() request: any,
    @Body() body: WithdrawBody
  ): Promise<any> {
    const user = (request as any).user;
    const withdraw = await WalletService.createWithdraw(body, user.id);
    this.setStatus(201);
    return {
      status: 'success',
      data: { withdraw }
    };
  }

  /**
   * Xem lịch sử rút tiền
   */
  @Get('withdraw-history')
  public async getWithdrawHistory(@Request() request: any): Promise<any> {
    const user = (request as any).user;
    const withdraws = await WalletService.getWithdrawHistory(user.id);
    return {
      status: 'success',
      results: withdraws.length,
      data: { withdraws }
    };
  }
}
