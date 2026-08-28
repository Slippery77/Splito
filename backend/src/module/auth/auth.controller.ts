import { Controller , Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginFormat } from './dto/loginformat';

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService : AuthService 
    ){}
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() dto:LoginFormat){
        return this.authService.signIn(dto);
    };
}