import { Injectable, Inject } from '@nestjs/common';
import { Pool , PoolClient } from 'pg';

@Injectable()
export class ExpenseRepository{
    constructor (@Inject('PG_POOL') private readonly pool : Pool){}

    async createExpense(client:PoolClient,group_id:string ,paidBy:string, amount:number, description:string){
        const sql=`
            INSERT INTO expense(group_id ,paid_by, amount, description)
            VALUES ($1,$2,$3,$4)
            RETURNING *;
        `
        const result = await client.query(sql ,[group_id,paidBy,amount,description]);
        return result.rows[0];
    }
    async createSplit(client:PoolClient , expense_id:string ,userId:string, shareAmount:number){
        const sql =`
            INSERT INTO expense_splits(expense_id,user_id,share_amount)
            VALUES($1,$2,$3)
            RETURNING *;
        `
        const result = await client.query(sql, [expense_id,userId,shareAmount]);
        return result.rows[0]
    }

    async getTotalPaid(groupId:string ) {
        const sql=`
            SELECT e.paid_by AS user_id ,u.email,  SUM(amount) AS total_paid 
            FROM expense e
            JOIN users u ON u.user_id = e.paid_by 
            WHERE group_id = $1
            GROUP BY e.paid_by, u.email;
        `
        const result = await this.pool.query(sql,[groupId]);
        return result.rows;
    }
    async getTotalOwed(groupId:string){
        const sql = `
            SELECT esp.user_id ,u.email , SUM(share_Amount) AS total_owed
            FROM expense_splits esp
            JOIN expense e ON e.expense_id = esp.expense_id
            JOIN users u ON u.user_id = esp.user_id
            WHERE group_id= $1
            GROUP BY esp.user_id, u.email;
        `
        const result = await this.pool.query(sql,[groupId]);
        return result.rows;
    }
}