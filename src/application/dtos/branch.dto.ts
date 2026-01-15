import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { SparePartResponseDto } from "./spare-part.dto";

class StoreResponseNestedDto {
    code:      string;
    nameStore: string
}

export class BranchResponseDto {
    id:             string     
    direction:      string
    latitude?:      number     
    longitude?:     number     
    createdAt?:     Date;
    updatedAt?:     Date; 
    storeId?:           string; 
    SpareParts?:    SparePartResponseDto[];
    store?:         StoreResponseNestedDto;
}

export class CreateBranchDto{
    @IsString()
    @IsNotEmpty()
    direction: string;

    @IsNumber()
    @IsOptional()
    latitude: number;

    @IsNumber()
    @IsOptional()
    longitude: number;

    @IsUUID()
    @IsNotEmpty()
    storeId: string;
}

export class UpdateBranchDto{
    @IsString()
    @IsOptional()
    direction: string;

    @IsNumber()
    @IsOptional()
    latitude: number;
    
    @IsNumber()
    @IsOptional()
    longitude: number;
}

export class BranchFilter {
    @IsString()
    @IsOptional()
    storeId: string;

    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;
}