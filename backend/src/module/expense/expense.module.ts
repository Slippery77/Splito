import { Module } from '@nestjs/common';
import { ExpenseRepository } from './expense.repository';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { GroupModule } from '../group/group.module';
import { UserModule } from '../users/users.module';

@Module({
    imports:[GroupModule, UserModule],
    providers:[ExpenseService,ExpenseRepository],
    controllers:[ExpenseController],
})
export class ExpenseModule{};