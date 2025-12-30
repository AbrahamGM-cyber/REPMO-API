import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SparePartModule } from './modules/spare-part.module';
import { StoreModule } from './modules/store.module';
import { BranchModule } from './modules/branch.module';

@Module({
  imports: [
    PrismaModule,
    SparePartModule,
    StoreModule,
    BranchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
