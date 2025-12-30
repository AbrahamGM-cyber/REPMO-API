import { Module } from '@nestjs/common';
import { SparePartController } from 'src/presentation/controllers/spare-part.controller';
import { SparePartService } from 'src/application/services/spare-part.service';
import { PrismaSparePartRepository } from 'src/infrastructure/repositories/prisma-spare-part.repository';
import { PrismaBranchRepository } from 'src/infrastructure/repositories/prisma-branch.repository';

@Module({
    providers: [
        SparePartService,
        {
            provide: 'ISparePartRepository',
            useClass: PrismaSparePartRepository
        },
        {
            provide: 'IBranchRepository',
            useClass: PrismaBranchRepository
        }
    ],
    controllers: [
        SparePartController
    ],
    exports: [
        SparePartService
    ]
    

})
export class SparePartModule {}
