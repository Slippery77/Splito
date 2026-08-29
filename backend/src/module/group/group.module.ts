import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { GroupRepository } from './group.repository';
import { UserModule } from '../users/users.module';

@Module({
    imports:[UserModule],
    providers:[GroupService, GroupRepository],
    controllers:[GroupController],
    exports:[GroupService]
})
export class GroupModule{};