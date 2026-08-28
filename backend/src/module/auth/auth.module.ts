import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController} from './auth.controller';
import { UserModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            global:true,
            useFactory:()=> ({
                signOptions:{expiresIn:'1d'},
                secret:process.env.JWT_SECRET,
            }),
        }),
    ],
    controllers:[AuthController],
    providers:[AuthService]
})
export class AuthModule{};