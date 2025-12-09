import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
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
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { User } from '@/common/decorators/user.decorator';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';
import { UserDetailsDto } from '@/modules/user/dto/user-details.dto';
import {
  VALID_IMAGE_MIME_TYPES,
  imageFileFilter,
  memoryStorage,
  USER_AVATAR_MAX_SIZE,
} from '@/configs/multer.config';
import {
  ValidateImageOptions,
  ValidateImagePipe,
} from '@/common/pipes/validate-image.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage,
      limits: {
        fileSize: USER_AVATAR_MAX_SIZE,
      },
      fileFilter: imageFileFilter,
    }),
  )
  @Roles(Role.ADMIN)
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ValidateImagePipe({
        maxBytes: USER_AVATAR_MAX_SIZE,
        allowedMimes: VALID_IMAGE_MIME_TYPES,
        allowNullFile: true,
      } as ValidateImageOptions),
    )
    file: Express.Multer.File,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Tạo người dùng mới thành công!',
      data: await this.userService.create(createUserDto, user, file),
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userService.findOneDetails(id, [
      'id',
    ]);

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

  @Get(':id/profile')
  async getUserProfile(
    @UuidParam() id: string,
  ): Promise<{ message: string; data: UserDetailsDto }> {
    const user = await this.userService.getUserProfile(id);
    return {
      message: 'Lấy thông tin chi tiết người dùng thành công!',
      data: user,
    };
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage,
      limits: {
        fileSize: USER_AVATAR_MAX_SIZE,
      },
      fileFilter: imageFileFilter,
    }),
  )
  @Roles(Role.ADMIN)
  async update(
    @UuidParam() id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ValidateImagePipe({
        maxBytes: USER_AVATAR_MAX_SIZE,
        allowedMimes: VALID_IMAGE_MIME_TYPES,
        allowNullFile: true,
      } as ValidateImageOptions),
    )
    file: Express.Multer.File,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Cập nhật người dùng thành công!',
      data: await this.userService.update(id, updateUserDto, user, file),
    };
  }

  @Post(':id/reset-password')
  @Roles(Role.ADMIN)
  async resetPassword(@UuidParam() id: string) {
    return {
      message: 'Đặt lại mật khẩu thành công!',
      data: await this.userService.resetPassword(id),
    };
  }

  @Post(':id/lock')
  @Roles(Role.ADMIN)
  async lock(@UuidParam() id: string) {
    return {
      message: 'Khóa người dùng thành công!',
      data: await this.userService.lock(id),
    };
  }

  @Post(':id/unlock')
  @Roles(Role.ADMIN)
  async unlock(@UuidParam() id: string) {
    return {
      message: 'Mở khóa người dùng thành công!',
      data: await this.userService.unlock(id),
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@UuidParam() id: string, @User() user: IAccessTokenPayload) {
    return {
      message: 'Xóa người dùng thành công!',
      data: await this.userService.remove(id, user),
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
