import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { BranchResponseDto } from "./branch.dto";
import { CategoryResponseDto } from "./category.dto";

class StoreResponseNestedDto {
    code:      string;
    nameStore: string
}

class BranchResponseNestedDto {
    id?:      string;
    direction: string;
    store?:   StoreResponseNestedDto;
}

class CategoryResponseNestedDto {
    id?:      string;
    name_category: string;
}

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
    categoryId?:       string;
    branch?:             BranchResponseNestedDto;
    category?:           CategoryResponseNestedDto;
    // branch?:             BranchResponseDto;   
    createdAt?: Date;
    updatedAt?: Date;              
}

export class publicSparePartResponseDto {
    code: string;
    price?: number;
    brand: string;
    model: string;
    namePart: string;
    imgUrl: string;
    branch?: BranchResponseNestedDto;
    category?: CategoryResponseNestedDto;
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

    @IsUUID()
    @IsNotEmpty()
    categoryId: string;
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
    @IsString()
    categoryId: string;

    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;
}