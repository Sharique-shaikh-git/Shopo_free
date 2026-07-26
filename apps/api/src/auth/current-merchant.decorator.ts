import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export interface AuthenticatedUser {
  authId: string;
  merchantId?: string;
  isActive?: boolean;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    
    return user as AuthenticatedUser;
  },
);

export const CurrentMerchantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || !user.merchantId) {
      throw new UnauthorizedException('Merchant profile required for this action');
    }
    
    if (user.isActive === false) {
       throw new UnauthorizedException('Merchant account is suspended');
    }

    return user.merchantId;
  },
);
