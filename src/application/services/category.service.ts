import { Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { Category } from 'src/domain/entities/category.entity';
import { ICategoryRepository } from 'src/domain/repositories/category.interface';
import { UUID } from 'src/domain/value-objects/uuid.value-object';

@Injectable()
export class CategoriesService {
    constructor(
        @Inject('ICategoryRepository')
        private readonly categoryRepository: ICategoryRepository,
    ) {}

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto>{
        
        const generateCode = 'CAT-2'
        const newCategory= Category.create({
            name_category: createCategoryDto.name_category,
            categoryCount: 0,
            code: generateCode
        });
        const savedCategory = await this.categoryRepository.save(newCategory)
        return this.mapToResponseDto(savedCategory);
    }

    async getCategories(): Promise<CategoryResponseDto[]>{
        const categories = await this.categoryRepository.findAll();
        return categories.map(category => this.mapToResponseDto(category)
        );
    }

    
    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
        const categoryID = UUID.fromString(id);
        const existingCategory = await this.categoryRepository.findById(categoryID)
        if(!existingCategory){
            throw new NotFoundException(`Categoria con ID "${id}" no encontrado para actualizar`)
        }
        
        existingCategory.updateNameCategory(
            updateCategoryDto.name_category ??  existingCategory.name_category,
        )

        const updateCategory = await this.categoryRepository.save(existingCategory)

        return this.mapToResponseDto(updateCategory);
    }

    async getCategoryById(id: string): Promise<CategoryResponseDto> {
        const categoryId = UUID.fromString(id);

        const category = await this.categoryRepository.findById(categoryId)
        if (!category) {
            throw new NotFoundException(`Categoria con ID "${id}" no encontrado`)
        }
        return this.mapToResponseDto(category);
    }


    async deleteCategory(id: string): Promise<void> {
        const categoryID = UUID.fromString(id)
        const exists = await this.categoryRepository.findById(categoryID);
        if (!exists) {
            throw new NotFoundException(`Categoria con ID "${id}" no encontrado para eliminar`)
        }       
        await this.categoryRepository.delete(categoryID);  
    }

    private mapToResponseDto(category: Category): CategoryResponseDto {
        return {
            id: category.id.getValue(),
            name_category: category.name_category,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            categoryCount: category.categoryCount,
            code: category.code,
        }
    }
}
