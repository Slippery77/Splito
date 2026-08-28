import { LoginFormat } from "./dto/loginformat";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { UserService } from "../users/users.service";
@Injectable()
export class AuthService{
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ){}
    async signIn(dto:LoginFormat): Promise<{access_token:string}>{
        const users = await this.userService.findByEmail(dto.email);

        if(!users){
            throw new UnauthorizedException('Invalid Credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, users.password_hash);
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid Password');
        }
        const payload = {sub: users.user_id, email:users.email};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}