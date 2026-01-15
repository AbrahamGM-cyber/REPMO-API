import { Module } from '@nestjs/common';
import { CategoriesService } from '../application/services/category.service';
import { CategoryController } from '../presentation/controllers/category.controller';
import { PrismaCategoryRepository } from 'src/infrastructure/repositories/prisma-category.repository';

@Module({
  providers: [
    CategoriesService,
    {
      provide: 'ICategoryRepository',
      useClass: PrismaCategoryRepository,
    }
  ],
  controllers: [CategoryController],
  exports: [CategoriesService]
})
export class CategoryModule {}
