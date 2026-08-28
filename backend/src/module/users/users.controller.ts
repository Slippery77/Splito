import {Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UsersController{
    @UseGuards(AuthGuard)
    @Get('me')
    getMyProfile(@Req() request){
        return request['user'];
    }
}