import { Controller, Get, Post, Route, Body, Tags, Security } from 'tsoa';

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
export class WalletTsoaController extends Controller {

  /**
   * Xem ví cá nhân
   */
  @Get('/')
  public async getWallet(): Promise<any> {
    return;
  }

  /**
   * KH Yêu cầu nạp tiền (hoặc Admin cấp tiền)
   */
  @Post('deposit')
  public async createDeposit(@Body() body: DepositBody): Promise<any> {
    return;
  }

  /**
   * Xem lịch sử nạp tiền
   */
  @Get('deposit-history')
  public async getDepositHistory(): Promise<any> {
    return;
  }

  /**
   * Yêu cầu rút tiền khỏi ví
   */
  @Post('withdraw')
  public async createWithdraw(@Body() body: WithdrawBody): Promise<any> {
    return;
  }

  /**
   * Xem lịch sử rút tiền
   */
  @Get('withdraw-history')
  public async getWithdrawHistory(): Promise<any> {
    return;
  }
}
