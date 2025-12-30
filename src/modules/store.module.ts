import { Module } from '@nestjs/common';
import { StoreController } from 'src/presentation/controllers/store.controller';
import { StoreService } from 'src/application/services/store.service';
import { PrismaStoreRepository } from 'src/infrastructure/repositories/prisma-store.repository';

@Module({
  providers: [
         StoreService,
          {
              provide: 'IStoreRepository',
              useClass: PrismaStoreRepository
          }
      ],
      controllers: [
         StoreController
      ],
      exports: [
         StoreService
      ]
      
  
})
export class StoreModule {}
