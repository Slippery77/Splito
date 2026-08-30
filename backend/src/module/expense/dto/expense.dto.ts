import { Type } from "class-transformer";
import {IsString , IsNotEmpty ,IsNumber, Min, ValidateNested, ArrayMinSize} from "class-validator";

class SplitDto{
    @IsString()
    @IsNotEmpty()
    userId!:string

    @IsNumber({maxDecimalPlaces:2})
    @Min(0.01)
    shareAmount!:number
}

export class ExpenseDto{
    @IsString()
    @IsNotEmpty()
    paidBy!:string;

    @IsNumber({maxDecimalPlaces:2})
    @Min(0.01)
    amount!:number;

    @IsString()
    description!:string;

    @Type(()=>SplitDto) //แปลง plain object พวกนี้ให้เป็นวัตถุของ SplitDto
    @ValidateNested({each:true}) //ตรวจข้างใน array ว่า type ถูกต้องไหม
    @ArrayMinSize(1) //กำหนดให้ array มีขนาด 1 มิติ
    splits!:SplitDto[]

}