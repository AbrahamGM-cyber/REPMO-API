import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class SparePartResponseDto {
    code:               string;
    id?:                string;
    brand:              string;
    description:        string;
    namePart:           string;
    price?:              number;                    
    stock?:              number;                     
    model:              string;
    imgUrl:             string;
    branchId?:           string; 
    branch?:             any;   
    createdAt?: Date;
    updatedAt?: Date;              
}

export class CreateSparePartDto{
    @IsString()
    brand: string;

    @IsString()
    description: string;

    @IsString()
    @IsNotEmpty()
    namePart: string;

    @IsNumber()
    price: number;

    @IsNumber()
    stock: number;

    @IsString()
    model: string;

    @IsString()
    imgUrl: string;

    // @IsString()
    // code: string;

    @IsUUID()
    @IsNotEmpty()
    branchId: string;
}

export class UpdateSparePartDto{
    @IsOptional()
    @IsString()
    brand: string;

    @IsString()
    @IsOptional()
    namePart: string;

    @IsOptional()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsNumber()
    stock: number;

    @IsOptional()
    @IsString()
    model: string;

    @IsOptional()
    @IsString()
    imgUrl: string;

    @IsUUID()
    @IsOptional()
    branchId: string;
}

export class SparePartFilter {
    @IsString()
    @IsOptional()
    code: string;

    @IsOptional()
    @IsString()
    brand: string;

    @IsOptional()
    @IsString()
    model: string;

    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;
}