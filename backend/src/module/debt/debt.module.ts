import { Module } from "@nestjs/common";
import { ExpenseRepository } from "../expense/expense.repository";
import { DebtService } from "./debt.service";

@Module({
    imports:[ExpenseRepository],
    providers:[DebtService],
    controllers:[],
    exports:[]
})
export class DebtModule{};