import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Matches } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    name : string

    @IsOptional()
    @IsNumber()
    age : number

    @IsOptional()
    @IsString()
    @IsPhoneNumber('BD')
    @Matches(/^(?:\+88|88)?(01[3-9]\d{8})$/, {
      message: 'phone number is not valid',
    })
    phone : string
}
