import { Controller, HttpCode, HttpStatus, Post,Body, Put, Param, Delete, Get } from '@nestjs/common';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from 'src/application/dtos/category.dto';
import { CategoriesService } from 'src/application/services/category.service';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoriesService: CategoriesService){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto>{
        console.log('Creando Categoria:', createCategoryDto)
        return this.categoriesService.createCategory(createCategoryDto)
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
        return this.categoriesService.getCategoryById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string, 
        @Body() updateCategoryDto:UpdateCategoryDto
    ): Promise<CategoryResponseDto> {
        return this.categoriesService.updateCategory(id, updateCategoryDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<CategoryResponseDto[]>{
        return this.categoriesService.getCategories();
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        await this.categoriesService.deleteCategory(id)
    }
}
