import { Controller, Post , Param , Body, Req, UseGuards, Get } from "@nestjs/common";
import { CreateGroupDto } from "./dto/creategroup.dto";
import { AuthGuard } from "../auth/auth.guard";
import { GroupService } from "./group.service";

@Controller('group')
export class GroupController{
    constructor(private groupService:GroupService){}

    @UseGuards(AuthGuard)
    @Post('createGroup')
    async createGroup(@Body() dto:CreateGroupDto, @Req() request){
        const userId =  request.user.sub;
        return this.groupService.createGroup(dto,userId);
    }
    @UseGuards(AuthGuard)
    @Get(':groupId/members')
    async showMember( @Param('groupId') groupId:string){
        return this.groupService.showMember(groupId);
    }

    @UseGuards(AuthGuard)
    @Post(':groupId/invites')
    async inviteMember(@Param('groupId') groupId:string , @Body('email')email:string ){
        return this.groupService.inviteMember(groupId,email);
    }
}