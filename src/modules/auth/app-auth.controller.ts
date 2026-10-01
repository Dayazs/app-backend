import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserGuard } from './guards/user.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from './strategies/jwt.strategy';

@Controller('app/auth')
export class AppAuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.registerUser(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.loginUser(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, UserGuard)
  me(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
