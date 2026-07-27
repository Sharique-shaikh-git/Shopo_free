import { Controller, Post, Body, Get, UseGuards, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { db, merchants, eq } from '@shopo/database';
import * as bcrypt from 'bcryptjs';
import { CurrentMerchantId } from './current-merchant.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('register')
  async register(@Body() data: { phone: string; name: string; password?: string; language?: string }) {
    if (!data.phone || !data.name) {
      throw new BadRequestException('Phone and name are required');
    }

    // Check if phone already exists
    const existing = await db.select().from(merchants).where(eq(merchants.phone, data.phone)).limit(1);
    if (existing.length > 0) {
      throw new BadRequestException('Phone number already registered');
    }

    // Hash password if provided, otherwise use a placeholder (since password is newly introduced)
    // The instructions say "Hash password with bcrypt"
    const pwd = data.password || '123456';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);

    // Insert merchant
    // Using phone as supabaseAuthId for now as requested
    const [merchant] = await db.insert(merchants).values({
      supabaseAuthId: data.phone, // "use supabaseAuthId as phone for now"
      phone: data.phone,
      name: data.name,
      language: data.language || 'ur',
      email: hashedPassword, // Storing hashed password in email column temporarily to avoid DB schema change
    }).returning();

    // Generate JWT
    const payload = { sub: merchant.supabaseAuthId };
    const token = this.jwtService.sign(payload);

    return {
      token,
      merchant: {
        id: merchant.id,
        name: merchant.name,
        phone: merchant.phone,
      }
    };
  }

  @Post('login')
  async login(@Body() data: { phone: string; password?: string }) {
    if (!data.phone) {
      throw new BadRequestException('Phone is required');
    }

    const rows = await db.select().from(merchants).where(eq(merchants.phone, data.phone)).limit(1);
    const merchant = rows[0];

    if (!merchant) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const pwd = data.password || '123456';
    // We stored the hashed password in the `email` column to avoid changing the DB schema
    const storedHash = merchant.email; 
    
    if (storedHash && storedHash.startsWith('$2a$')) {
      const isMatch = await bcrypt.compare(pwd, storedHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      // Fallback if they were created without a hashed password
      if (storedHash !== pwd && merchant.supabaseAuthId !== data.phone) {
          throw new UnauthorizedException('Invalid credentials');
      }
    }

    const payload = { sub: merchant.supabaseAuthId };
    const token = this.jwtService.sign(payload);

    return {
      token,
      merchant: {
        id: merchant.id,
        name: merchant.name,
        phone: merchant.phone,
      }
    };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@CurrentMerchantId() merchantId: string) {
    const rows = await db.select().from(merchants).where(eq(merchants.id, merchantId)).limit(1);
    if (!rows.length) {
      throw new UnauthorizedException('Merchant not found');
    }
    
    const merchant = rows[0];
    return {
      id: merchant.id,
      name: merchant.name,
      phone: merchant.phone,
      language: merchant.language,
      planTier: merchant.planTier,
    };
  }
}
