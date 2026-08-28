import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UserRepository } from "./users.repository";
import { UserService } from "./users.service";

@Module({
    controllers:[UsersController],
    providers:[UserService, UserRepository],
    exports:[UserService]
})
export class UserModule{};
