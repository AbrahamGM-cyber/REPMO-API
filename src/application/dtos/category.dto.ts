import { IsNotEmpty, IsString, IsOptional, IsUUID, MinLength, MaxLength } from 'class-validator'

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name_category: string;
}

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(255, { message: 'Name cannot exceed 255 characters' })
    name_category?: string;
}

export class CategoryResponseDto {
    id: string;
    code: string;
    name_category: string;
    createdAt: Date;
    updatedAt: Date;
    categoryCount: number
}