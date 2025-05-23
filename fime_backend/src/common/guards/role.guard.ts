import { CUSTOM_FORBIDDEN_MESSAGE } from '@/common/decorators/custom-forbidden-message.decorator';
import { IS_PUBLIC_KEY } from '@/common/decorators/public-route.decorator';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';
import { AccessControlService } from '@/modules/shared/access-control.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [Role.FORMER_MEMBER];

    const { user } = context
      .switchToHttp()
      .getRequest<{ user: IAccessTokenPayload }>();
    const userRoles: Role[] = user?.role || [];

    // Nếu user chưa đăng nhập hoặc không có role
    if (userRoles.length === 0) return false;

    // Duyệt qua tất cả vai trò của user để kiểm tra
    const hasPermission = userRoles.some((userRole) =>
      requiredRoles.some((requiredRole) =>
        this.accessControlService.isAuthorized({
          currentRole: userRole,
          requiredRole: requiredRole,
        }),
      ),
    );

    if (!hasPermission) {
      const customForbiddenMessage = this.reflector.getAllAndOverride<string>(
        CUSTOM_FORBIDDEN_MESSAGE,
        [context.getHandler(), context.getClass()],
      );

      throw new ForbiddenException(
        customForbiddenMessage ||
          'Quyền truy cập của bạn không đủ để thực hiện hành động này!',
      );
    }

    return true;
  }
}
