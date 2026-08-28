import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class LoginFormat {
    @IsEmail()
    @IsNotEmpty()
    email!:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {message: 'รหัสต้องมีอย่างน้อย 8 ตัวอักษร'})
    password!:string;
}
