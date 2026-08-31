import { Controller , Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { DebtService } from "./debt.service";

@Controller('group')
export class DebtController{
    constructor(private debtService: DebtService){}
    @UseGuards(AuthGuard)
    @Get(':groupId/debts')
    async checkDept(@Param('groupId') groupId:string){
        return this.debtService.checkDept(groupId);
    }

}

