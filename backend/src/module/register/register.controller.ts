import {Controller, Post, HttpCode, HttpStatus, Body} from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterForm } from './dto/registerformat';

@Controller('register')
export class RegisterController{
    constructor(private registerService: RegisterService){}
    @HttpCode(HttpStatus.OK)
    @Post('registerAccount')
    async register(@Body() dto: RegisterForm){
        return this.registerService.register(dto);
    }
}

