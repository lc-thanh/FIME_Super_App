import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
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
import {
  imageFileFilter,
  userAvatarLimits,
  userAvatarsStorage,
} from '@/configs/multer.config';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: userAvatarsStorage,
      fileFilter: imageFileFilter,
      limits: userAvatarLimits,
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      message: 'Tạo người dùng mới thành công!',
      data: await this.userService.create(createUserDto, file?.filename),
    };
  }

  @Get()
  async findAll(
    @Query() params: UserFilterType,
  ): Promise<UserPaginatedResponse> {
    return this.userService.findAll(params);
  }

  @Get(':id')
  async findOne(@UuidParam() id: string) {
    const user = await this.userService.findOne(id, ['id']);
    if (!user) {
      throw new NotFoundException('Không tồn tại người dùng với ID đã cho!');
    }
    return user;
  }

  @Patch(':id')
  update(@UuidParam() id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@UuidParam() id: string) {
    return this.userService.remove(id);
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
