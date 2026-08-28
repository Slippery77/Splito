import { UserModule } from "../users/users.module";
import { RegisterService } from "./register.service";
import { RegisterController } from "./register.controller";
import { Module } from '@nestjs/common';

@Module({
    imports:[UserModule],
    providers:[RegisterService],
    controllers:[RegisterController],
    exports:[RegisterService]
})
export class RegisterModule{};