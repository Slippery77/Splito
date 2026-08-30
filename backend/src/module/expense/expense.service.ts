import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ExpenseRepository } from "./expense.repository";
import { ExpenseDto } from "./dto/expense.dto";
import { Pool } from "pg";
import { GroupService } from "../group/group.service";

@Injectable()
export class ExpenseService{
    constructor(
        private groupService :GroupService,
        private expenseRepository : ExpenseRepository,
        @Inject('PG_POOL')private readonly pool:Pool
    ){}
    async createExpense(groupID:string,requesterId:string,dto:ExpenseDto ){
        const totalPaid = await this.expenseRepository.getTotalPaid(groupID);
        const totalOwed = await this.expenseRepository.getTotalOwed(groupID);

        const net = new Map<string, number>();

        for(const p of totalPaid){
            net.set(p.user_id, (net.get(p.user_id) ?? 0) + Number(p.total_paid))
        }
        for(const o of totalOwed){
            net.set(o.user_id, (net.get(o.user_id) ?? 0) - Number(o.total_owed))
        }
        
        //เช็คว่ายอดรวมที่หารกัน (shareAmount ทุกคน) ตรงกับยอดที่จ่ายจริง (amount) ไหม ถ้าไม่ตรงก้ throw error ออก
        const totalShare = dto.splits.reduce((sum,s)=> sum + s.shareAmount, 0);
        if(Math.abs(totalShare - dto.amount) > 0.01){
            throw new BadRequestException("ยอดหารรวมไม่เท่ากับยอดที่จ่ายจริง");
        } 
        //Todo : Greedy ต่อ
        await this.groupService.isMember(groupID,requesterId); //ตัวนี้คือคนกดสร้าง expense
        await this.groupService.isMember(groupID, dto.paidBy); //ตัวนี้คือคนจ่ายเงินจริง
        const client = await this.pool.connect();
        try{
            await client.query('BEGIN')
            const expense = await this.expenseRepository.createExpense(client,groupID,dto.paidBy,dto.amount,dto.description)
            
            //forloop ใช้ในการใส่ user และ จำนวนเงินที่หารจ่าย
            for(let i = 0 ; i<dto.splits.length ; i++){
                const split = dto.splits[i];
                await this.expenseRepository.createSplit(client,expense.expense_id, split.userId, split.shareAmount);
            }

            
            await client.query('COMMIT')
            return expense;
        }catch(err){
            await client.query('ROLLBACK');
            throw err;
        }finally{
            client.release()
        }
    }
}
