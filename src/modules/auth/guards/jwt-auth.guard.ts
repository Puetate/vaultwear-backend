import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "../decorators";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { AppRoles } from "../decorators/types";
import { AuthJwtPayload } from "../types/auth-jwt-payload.type";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) return true;

    const isValid = (await super.canActivate(context)) as boolean;
    if (!isValid) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthJwtPayload;

    const admittedRoles = this.reflector.getAllAndOverride<AppRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!this.isAllowedRole(user.role.roleName, admittedRoles)) {
      return false;
    }

    return true;
  }

  private isAllowedRole(userRole: string, admittedRoles?: AppRoles[]): boolean {
    if (!admittedRoles || admittedRoles.length === 0) {
      return true;
    }
    return admittedRoles.includes(userRole as AppRoles);
  }
}
