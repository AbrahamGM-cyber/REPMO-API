import { Injectable, NotFoundException } from "@nestjs/common";
import { Category } from "../../domain/entities/category.entity";
import { ICategoryRepository } from "src/domain/repositories/category.interface";
import { UUID } from "../../domain/value-objects/uuid.value-object";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
    constructor(private readonly prisma: PrismaService) {}
    /** 
    * Encuentra un category por su ID
    * @param id El ID del category (como objeto UUID)
    */
   async findById(id: UUID): Promise<Category | null> {
        const categoryData = await this.prisma.category.findUnique({
            where: { id: id.getValue() },

        });

        if (!categoryData) {
            return null;
        }

        return Category.reconstitute({
            id: UUID.fromString(categoryData.id),
            name_category: categoryData.name_category,
            createdAt: categoryData.createdAt,
            updatedAt: categoryData.updatedAt,
            categoryCount: categoryData.categoryCount,
            code: categoryData.code,
        });
    }


   async findAll(): Promise<Category[]> {
        const categoriesData = await this.prisma.category.findMany({
            orderBy: {
                createdAt: 'asc', // asc para ascendente, desc para descendente
            },
        });

        return categoriesData.map((categoryData) =>
            Category.reconstitute({
                id: UUID.fromString(categoryData.id),
                name_category: categoryData.name_category,
                createdAt: categoryData.createdAt,
                updatedAt: categoryData.updatedAt,
                categoryCount: categoryData.categoryCount,
                code: categoryData.code,
            })
        );
    }


    async save(category: Category): Promise<Category> {
        const categoryData= category.toJSON()
        const savedCategory = await this.prisma.category.upsert({
           
            where: { id: categoryData.id }, 
            update: {
                name_category: categoryData.name_category,
            
                // updatedAt: categoryData.updatedAt,
            },
            create: categoryData,
                // id: categoryData.id,
                // name_category: categoryData.name_category,
                // createdAt: categoryData.createdAt,
                // updatedAt: categoryData.updatedAt,
            
        });

        return Category.reconstitute({
            id: UUID.fromString(savedCategory.id),
            name_category: savedCategory.name_category,
            createdAt: savedCategory.createdAt,
            updatedAt: savedCategory.updatedAt,
            categoryCount: savedCategory.categoryCount,
            code: savedCategory.code,
        });
    }
    /** 
    * Encuentra un category por su ID
    * @param id El ID del category (como objeto UUID)
    */
   async delete(id: UUID): Promise<void> {
       try {
        await this.prisma.category.delete({
            where: { id: id.getValue()},
        });

       } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundException(`Categoría con ID "${id.getValue()}" no encontrada para eliminar.`);
        }
        throw error; // Relanza otros errores de Prisma
       }
   }

   async exists(id: UUID): Promise<boolean> {
        const count = await this.prisma.category.count({
            where: { id: id.getValue() },
        });
        return count > 0;
   }
}