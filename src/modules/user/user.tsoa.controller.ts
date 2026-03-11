import { Controller, Get, Post, Patch, Route, Body, Query, Path, Tags, Security } from 'tsoa';

interface CreateUserBody {
    email?: string;
    phone?: string;
    fullName: string;
    avatar?: string;
    birthday?: string;
    country?: string;
    address?: string;
    organizationId?: string;
    classId: string;
    [key: string]: any;
}

interface UpdateUserBody {
    email?: string;
    phone?: string;
    fullName?: string;
    avatar?: string;
    birthday?: string;
    country?: string;
    address?: string;
    organizationId?: string;
    [key: string]: any;
}

@Route('user')
@Tags('User')
export class UserTsoaController extends Controller {
    /**
     * Tạo user mới
     */
    @Security('jwt')
    @Post('/')
    public async createUser(@Body() body: CreateUserBody): Promise<any> {
        return;
    }

    /**
     * Lấy danh sách user có phân trang
     */
    @Security('jwt')
    @Get('/')
    public async getList(
        @Query() sort?: string,
        @Query() limit: number = 10,
        @Query() page: number = 1,
        @Query() search?: string,
        @Query() phone?: string,
        @Query() email?: string,
        @Query() isAdmin?: boolean,
    ): Promise<any> {
        return;
    }

    /**
     * Lấy danh sách toàn bộ user (Admin)
     */
    @Security('jwt', ['ADMIN', 'SELLER'])
    @Get('all')
    public async getAll(): Promise<any> {
        return;
    }

    /**
     * Lấy thông tin chi tiết một user
     */
    @Security('jwt')
    @Get('{userId}')
    public async getOne(@Path() userId: string): Promise<any> {
        return;
    }

    /**
     * Cập nhật thông tin user
     */
    @Security('jwt')
    @Patch('{userId}')
    public async updateOne(
        @Path() userId: string,
        @Body() body: UpdateUserBody
    ): Promise<any> {
        return;
    }

    /**
     * Xoá user
     */
    // @Security('jwt')
    //@Delete('{userId}')
    //public async deleteOne(@Path() userId: string): Promise<any> {
    //  return;
    //}
}
