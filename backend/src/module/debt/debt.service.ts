import { Injectable } from "@nestjs/common";
import { ExpenseRepository } from "../expense/expense.repository";

@Injectable()
export class DebtService{
    constructor(
        private expenseRepository : ExpenseRepository,
    ){}
    async checkDept(groupId:string){
        const totalPaid = await this.expenseRepository.getTotalPaid(groupId);
        const totalOwed = await this.expenseRepository.getTotalOwed(groupId);

        const net = new Map<string, number>();
            for(const p of totalPaid){
                net.set(p.user_id, (net.get(p.user_id) ?? 0) + Number(p.total_paid))
            }
            for(const o of totalOwed){
                net.set(o.user_id, (net.get(o.user_id) ?? 0) - Number(o.total_owed))
            }
            type Balance = { userId:string, amount:number};
            const creditors:Balance[] = [];
            const debtors:Balance[]= [];
            for (const [userId, amount] of net){
                if(amount>0){ //เจ้าหนี้จ่ายเกินส่วนตัวเอง
                    creditors.push({userId,amount});
                }
                if (amount < 0){//ลูกหนี้จ่ายน้อยกว่าที่ควร
                    debtors.push({userId,amount:Math.abs(amount)});
                }
            }
            // เรียง array ให้เป็นมากไปน้อย เพราะจะใช้ในการจับคู่ ลูกหนี้ที่มีหนี้เยอะสุด กับ เจ้าหนี้ที่ถูกติดหนี้เยอะสุด 
            creditors.sort((a,b) => b.amount-a.amount);
            debtors.sort((a,b) => b.amount-a.amount);

            type Transaction = { debt:string, credit:string , amount:number};
            const transaction:Transaction[] =[];
            while(debtors.length>0 && creditors.length>0){
                const debtor = debtors[0];
                const creditor = creditors[0];
                const amount = Math.min(debtor.amount, creditor.amount);
                //บันทึก transaction ที่เกิดขึ้น
                transaction.push({debt:debtor.userId, credit:creditor.userId,amount})
                //หัก amount ออกจากทั้ง debtor.amount และ creditor.amount
                debtor.amount -= amount;
                creditor.amount -= amount;

                //ถ้า debtor.amount เหลือ 0 → เอาออกจาก debtors array
                if(debtor.amount === 0){
                    debtors.shift(); 
                //ถ้า creditor.amount เหลือ 0 → เอาออกจาก creditors array
                }else if(creditor.amount ===0 ){
                    creditors.shift();
                } 
            }
        return transaction;
    }
}