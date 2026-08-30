import { Controller,Post, Param, Body, UseGuards, Get, Req } from "@nestjs/common";
import { ExpenseService } from "./expense.service";
import { AuthGuard } from "../auth/auth.guard";
import { ExpenseDto } from "./dto/expense.dto";

@Controller('group/:groupId/createExpense')
export class ExpenseController{
    constructor(private expenseService:ExpenseService){}
    
    @UseGuards(AuthGuard)
    @Post()
    async createExpense(@Param('groupId') groupId:string , @Req() request,@Body() dto:ExpenseDto){
        const requesterId = request.user.sub;
        return this.expenseService.createExpense(groupId,requesterId,dto);
    }
}