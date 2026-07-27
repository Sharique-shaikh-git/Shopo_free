import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { db, merchants, eq } from '@shopo/database';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    // Using explicit null fallback to satisfy types if secret is missing during init, 
    // though the app shouldn't start without it.
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SUPABASE_JWT_SECRET') || 'dummy-secret',
    });
  }

  async validate(payload: { sub: string }) {
    const authId = payload.sub;

    // Strict Tenant Isolation: Look up merchant by Supabase Auth ID
    const merchantRows = await db
      .select()
      .from(merchants)
      .where(eq(merchants.supabaseAuthId, authId))
      .limit(1);

    const merchant = merchantRows[0];

    if (!merchant) {
      // Unregistered users only have an authId.
      // A specific "RegistrationGuard" could allow access, but standard routes require merchantId.
      return { authId };
    }

    return { 
      authId, 
      merchantId: merchant.id, 
      isActive: merchant.isActive 
    };
  }
}
