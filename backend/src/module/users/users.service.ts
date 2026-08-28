import { Injectable } from "@nestjs/common";
import { UserRepository } from "../users/users.repository";

@Injectable()
export class UserService{
    constructor(private readonly userRepository : UserRepository){}

    async findByEmail(email:string){
        return this.userRepository.findByEmail(email);
    }
    async createAccount(email: string, password:string, display_name:string){
        return this.userRepository.createAccount(email,password,display_name);
    }
}
