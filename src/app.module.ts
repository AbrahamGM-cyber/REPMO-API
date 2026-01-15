import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SparePartModule } from './modules/spare-part.module';
import { StoreModule } from './modules/store.module';
import { BranchModule } from './modules/branch.module';
import { CategoryModule } from './modules/category.module';

@Module({
  imports: [
    PrismaModule,
    SparePartModule,
    StoreModule,
    BranchModule,
    CategoryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
