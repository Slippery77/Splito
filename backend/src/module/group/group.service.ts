import { Injectable, Inject, NotFoundException, UnauthorizedException,ConflictException } from "@nestjs/common";
import { GroupRepository } from "./group.repository";
import { CreateGroupDto } from "./dto/creategroup.dto";
import { UserService } from "../users/users.service";
import { Pool } from 'pg';

@Injectable()
export class GroupService{
    constructor(
        private groupRepository : GroupRepository,
        @Inject('PG_POOL') private pool : Pool,
        private userService : UserService
    ){}
    
    async createGroup(dto: CreateGroupDto, userID:string){
        const client = await this.pool.connect();
        try{
            await client.query('BEGIN');
            const createGroup = await this.groupRepository.createGroup(client,dto.display_name, userID);
            await this.groupRepository.addMember(client,createGroup.group_id,userID);
            await client.query('COMMIT');
            return createGroup;
        }catch(err){
            await client.query('ROLLBACK');
            throw err;
        }finally{
            client.release();
        }
    }
    async showMember(group_id:string){
        const groupIsExisted = await this.groupRepository.findGroup(group_id);
        if(!groupIsExisted){
            throw new NotFoundException("ไม่มีกลุ่มนี้อยู่จริง");
        }
        const groupMemberIsExisted = await this.groupRepository.showMember(group_id);
        if(groupMemberIsExisted.length===0){
            throw new NotFoundException("ในกลุ่มนี้ไม่มีสมาชิก");
        }
        return groupMemberIsExisted;
    }
    async inviteMember(groupId:string, email:string){
        const users = await this.userService.findByEmail(email);
        if(!users){
            throw new NotFoundException("ไม่พบ user นี้ในระบบ");
        }
        const userId = users.user_id;

        const groupDetail = await this.groupRepository.findGroup(groupId)
        if(!groupDetail){
            throw new NotFoundException("ไม่พบ group นี้ในระบบ");
        }

        const existingMember = await this.groupRepository.checkSameUser(groupId, userId)
        if(existingMember){
            throw new ConflictException("มี user นี้อยู่ในกลุ่มแล้ว")
        }

        const inviteMember = await this.groupRepository.inviteMember(groupId, userId);
        return{
            messages: "Successfully invite user",
            inviteMember
        }
    }
}