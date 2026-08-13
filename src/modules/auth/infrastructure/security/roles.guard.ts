import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StaffRole } from '../../domain/entities/staff-user.entity';
import { ROLES_KEY } from './roles.decorator';
import { AuthenticatedStaff } from './jwt.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<StaffRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: AuthenticatedStaff }>();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.role as StaffRole)) {
      throw new ForbiddenException('No tiene permisos para esta acción');
    }

    return true;
  }
}
