import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserFilterType,
  UserPaginatedResponse,
} from '@/modules/user/dto/user-pagination';
import { UuidParam } from '@/common/decorators/uuid-param.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserViewDto } from '@/modules/user/dto/user-view.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      message: 'Tạo người dùng mới thành công!',
      data: await this.userService.create(createUserDto, file),
    };
  }

  @Get()
  async findAll(): Promise<UserViewDto[]> {
    return this.userService.findAll();
  }

  @Get('paginated')
  async findAllPaginated(
    @Query() params: UserFilterType,
  ): Promise<UserPaginatedResponse> {
    return this.userService.findAllPaginated(params);
  }

  @Get(':id')
  async findOne(
    @UuidParam() id: string,
  ): Promise<{ message: string; data: UserViewDto }> {
    const user = await this.userService.findOne(id, ['id']);
    if (!user) {
      throw new NotFoundException('Không tồn tại người dùng với ID đã cho!');
    }
    return {
      message: 'Lấy thông tin người dùng thành công!',
      data: {
        ...user,
        teamName: user.team?.name || null,
        positionName: user.position?.name || null,
        genName: user.gen?.name || null,
      },
    };
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UuidParam() id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      message: 'Cập nhật người dùng thành công!',
      data: await this.userService.update(id, updateUserDto, file),
    };
  }

  @Delete(':id')
  async remove(@UuidParam() id: string) {
    return {
      message: 'Xóa người dùng thành công!',
      data: await this.userService.remove(id),
    };
  }

  // OPTIONAL!!
  // Nếu cần thiết lập một route để lấy file bảo mật hơn (không phải public)
  // @Get('avatar/:filename')
  // getAvatar(@Param('filename') filename: string, @Res() res: Response) {
  //   const filePath = join(
  //     process.cwd(),
  //     'public',
  //     'users',
  //     'avatars',
  //     filename,
  //   );

  //   // Kiểm tra xem file có tồn tại không (optional, bạn có thể bổ sung)
  //   res.sendFile(filePath, (err) => {
  //     if (err) {
  //       res.status(404).json({ message: 'File not found!' });
  //     }
  //   });
  // }
}
