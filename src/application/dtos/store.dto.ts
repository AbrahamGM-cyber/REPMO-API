import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { BranchResponseDto } from "./branch.dto";
import { SparePartResponseDto } from "./spare-part.dto";

export class StoreResponseDto {
    code:           string
    id:             string     
    nameStore:      string        
    createdAt?:     Date;
    updatedAt?:     Date;
    Branches?:      BranchResponseDto[];
    SpareParts?:    SparePartResponseDto[];              
}

export class CreateStoreDto{
    @IsString()
    @IsNotEmpty()
    nameStore: string;

    // @IsString()
    // @IsOptional()
    // code: string;
}

export class UpdateStoreDto{
    @IsString()
    @IsOptional()
    nameStore: string;
}

export class StoreFilter {
    @IsString()
    @IsOptional()
    code: string;

    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;
}