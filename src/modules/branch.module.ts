import { Module } from '@nestjs/common';
import { BranchService } from 'src/application/services/branch.service';
import { PrismaBranchRepository } from 'src/infrastructure/repositories/prisma-branch.repository';
import { BranchController } from 'src/presentation/controllers/branch.controller';

@Module({
    providers: [
        BranchService,
        {
            provide: 'IBranchRepository',
            useClass: PrismaBranchRepository
        }
    ],
    controllers: [
        BranchController
    ],
    exports: [
        BranchService
    ]
    

})
export class BranchModule {}
