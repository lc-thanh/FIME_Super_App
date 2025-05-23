import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

interface IsAuthorizedParams {
  currentRole: Role;
  requiredRole: Role;
}

@Injectable()
export class AccessControlService {
  private hierarchy: Map<Role, number> = new Map();

  constructor() {
    this.buildRoles([
      Role.FORMER_MEMBER,
      Role.MEMBER,
      Role.MANAGER,
      Role.ADMIN,
    ]);
  }

  private buildRoles(roles: Role[]) {
    roles.forEach((role, index) => {
      this.hierarchy.set(role, index + 1);
    });
  }

  public isAuthorized({
    currentRole,
    requiredRole,
  }: IsAuthorizedParams): boolean {
    const currentPriority = this.hierarchy.get(currentRole);
    const requiredPriority = this.hierarchy.get(requiredRole);

    // Kiểm tra nếu priority của currentRole lớn hơn hoặc bằng requiredRole
    return !!(
      currentPriority !== undefined &&
      requiredPriority !== undefined &&
      currentPriority >= requiredPriority
    );
  }

  public isAuthorizedByRoles(
    currentRoles: Role[],
    requiredRole: Role,
  ): boolean {
    return currentRoles.some((currentRole) =>
      this.isAuthorized({ currentRole, requiredRole }),
    );
  }
}
