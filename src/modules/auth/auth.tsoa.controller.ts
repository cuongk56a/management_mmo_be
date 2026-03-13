import { Controller, Post, Patch, Route, Body, Tags, Security, Get } from 'tsoa';

interface RegisterBody {
    email: string;
    password?: string;
    fullName?: string;
    phone?: string;
    code?: string;
    [key: string]: any;
}

interface LoginBody {
    email: string;
    password?: string;
}

interface ChangePasswordBody {
    password?: string;
    newPassword?: string;
    cfNewPassword?: string;
}

interface ForgotPasswordBody {
    email?: string;
    code?: string;
}

interface LoginPortalBody {
    targetId?: string;
}

interface SendMailBody {
    email?: string;
}

@Route('auth')
@Tags('Auth')
export class AuthTsoaController extends Controller {

    @Security('jwt')
    @Get('me')
    public async me(): Promise<any> {
        return;
    }

    /**
     * Đăng ký tài khoản mới
     */
    @Post('register')
    public async register(@Body() body: RegisterBody): Promise<any> {
        return;
    }

    /**
     * Đăng nhập
     */
    @Post('login')
    public async login(@Body() body: LoginBody): Promise<any> {
        return;
    }

    /**
     * Cấp lại token
     */
    @Post('refresh')
    public async refresh(): Promise<any> {
        return;
    }

    /**
     * Đổi mật khẩu
     */
    @Security('jwt')
    @Patch('change-password')
    public async changePassword(@Body() body: ChangePasswordBody): Promise<any> {
        return;
    }

    /**
     * Quên mật khẩu
     */
    @Post('forgot-password')
    public async forgotPassword(@Body() body: ForgotPasswordBody): Promise<any> {
        return;
    }

    /**
     * Gửi mail xác thực
     */
    @Post('send-mail')
    public async sendMail(@Body() body: SendMailBody): Promise<any> {
        return;
    }
}
