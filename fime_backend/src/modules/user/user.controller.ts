import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserFilterType,
  UserPaginatedResponse,
} from '@/modules/user/dto/user-pagination';
import { UuidParam } from '@/common/decorators/uuid-param.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
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
}
