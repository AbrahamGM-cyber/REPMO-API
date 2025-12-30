import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaSparePartRepository } from 'src/infrastructure/repositories/prisma-spare-part.repository';
import { PrismaStoreRepository } from 'src/infrastructure/repositories/prisma-store.repository';
import { PrismaBranchRepository } from 'src/infrastructure/repositories/prisma-branch.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    PrismaSparePartRepository,
    PrismaStoreRepository,
    PrismaBranchRepository
  ],
  exports: [
    PrismaService,
    PrismaSparePartRepository,
    PrismaStoreRepository,
    PrismaBranchRepository
  ]
})
export class PrismaModule {}
