import { IsString , IsNotEmpty , MinLength, IsEmail} from 'class-validator';

export class RegisterForm{
    @IsEmail()
    @IsNotEmpty()
    email!:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8,{message:'รหัสต้องมีอย่างน้อย 8 ตัวอักษร'})
    password!:string;

    @IsString()
    @IsNotEmpty()
    display_name!:string;
}