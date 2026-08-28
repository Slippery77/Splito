import { RegisterForm } from "./dto/registerformat";
import { UserService } from "../users/users.service";
import { ConflictException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class RegisterService{
    constructor(
        private userService: UserService
    ){}
    async register (dto:RegisterForm) {
        const emailIsExisted = await this.userService.findByEmail(dto.email);
        if(emailIsExisted){
            throw new ConflictException("อีเมลนี้มีอยู่แล้ว");
        }
        
        const salt = await bcrypt.genSalt();
        const passwordHashing = await bcrypt.hash(dto.password, salt);

        try{
            const createAccount = await this.userService.createAccount(dto.email, passwordHashing, dto.display_name)
            return { message:"succesfully created an Account!",
                createAccount
            };
        
        }catch(errors){
            throw errors;
        }
    
    }
}