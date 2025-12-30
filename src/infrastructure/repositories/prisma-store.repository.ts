import { Injectable, NotFoundException } from "@nestjs/common";
import { StoreFilter } from "src/application/dtos/store.dto";
import { Store } from "src/domain/entities/store.entity";
import { IStoreRepository } from "src/domain/repositories/store.interface";
import { UUID } from "src/domain/value-objects/uuid.value-object";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "../../../generated/prisma";
import { Branch } from "src/domain/entities/branch.entity";

@Injectable()
export class PrismaStoreRepository implements IStoreRepository {
    constructor(private readonly prisma: PrismaService) {}
    /** 
    * Encuentra un category por su ID
    * @param id El ID del category (como objeto UUID)
    */

    async findLastPrefix(prefix: string): Promise<Store | null> {
        const lastStore = await this.prisma.store.findFirst({
            where: {
                code: {
                    startsWith: prefix
                }
            },
            orderBy:{
                 code: 'desc'
            }
        });
        if(!lastStore) return null;

        return Store.reconstitute({
            id: UUID.fromString(lastStore.id),
            code: lastStore.code,
            nameStore: lastStore.nameStore,
            createdAt: lastStore.createdAt,
            updatedAt: lastStore.updatedAt,
        })
    }

    async findById(id: UUID): Promise<Store | null> {
        const store = await this.prisma.store.findUnique({
            where: { id: id.getValue()},
            
        });

        if(!store){
            return null;
        }

        return Store.reconstitute({
            id: UUID.fromString(store.id),
            nameStore: store.nameStore,
            code: store.code,
            createdAt: store.createdAt,
            updatedAt: store.updatedAt,
            
        });
    };

     async findByCode(code: string): Promise<Store | null> {
        const store = await this.prisma.store.findFirst({
            where: { code: code },
            include: {
            //    spareParts: true,
                branches: true
            },
        });

        if(!store) return null;

        return Store.reconstitute({
            id: UUID.fromString(store.id),
            nameStore: store.nameStore,
            code: store.code,
            createdAt: store.createdAt,
            updatedAt: store.updatedAt,
            Branches: store.branches.map(part => Branch.reconstitute({
                id: UUID.fromString(part.id),
                direction: part.direction,
                latitude: part.latitude ?? 0,
                longitude: part.longitude ?? 0,
                storeId: UUID.fromString(part.storeId)
            }))
        })
    }

    async findAllByPages(filters?: StoreFilter): Promise<{data: Store[], total: number}> {
        const where: Prisma.StoreWhereInput = {};

        if(filters?.code){
            where.code = filters.code
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.prisma.store.count({ where })

        const storeData = await this.prisma.store.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'asc', // asc para ascendente, desc para descendente
            },
        });

        const data = storeData.map((storeData => 
            Store.reconstitute({
                id: UUID.fromString(storeData.id),
                code: storeData.code,
                nameStore: storeData.nameStore,
                createdAt: storeData.createdAt,
                updatedAt: storeData.updatedAt,
            })
        ))
        return{data, total}
    }

    async findAll(filters?: StoreFilter): Promise<Store[]> {
        const where: Prisma.StoreWhereInput = {};

        if(filters?.code){
            where.code = filters.code
        }

        const storeData = await this.prisma.store.findMany({
            where,
            orderBy: {
                createdAt: 'asc', // asc para ascendente, desc para descendente
            },
        });

        return storeData.map((storeData => 
            Store.reconstitute({
                id: UUID.fromString(storeData.id),
                code: storeData.code,
                nameStore: storeData.nameStore,
                createdAt: storeData.createdAt,
                updatedAt: storeData.updatedAt,
               
            })
        ))
    }


    async save(store: Store): Promise<Store> {
        const storeData= store.toJSON();
        const {
        createdAt,
        updatedAt,
        ...dataForPrisma
        } = storeData;
        const savedStore = await this.prisma.store.upsert({
            where: { id: storeData.id },
            update: {
                nameStore: storeData.nameStore,
            },
            create: {
            ...dataForPrisma,
               id: dataForPrisma.id,
               nameStore: dataForPrisma.nameStore,
   
            }
        });

        return Store.reconstitute({
            id: UUID.fromString(savedStore.id),
            code: savedStore.code,
            nameStore: savedStore.nameStore,
            createdAt: savedStore.createdAt,
            updatedAt: savedStore.updatedAt,
        });
    }
    
    async delete(id: UUID): Promise<void> {
       try {
        await this.prisma.store.delete({
            where: { id: id.getValue()},
        });

       } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundException(`Tipo de Solicitud con ID "${id.getValue()}" no encontrada para eliminar.`);
        }
        throw error; // Relanza otros errores de Prisma
       }
   }

   async exists(id: UUID): Promise<boolean> {
        const count = await this.prisma.store.count({
            where: { id: id.getValue() },
        });
        return count > 0;
   }
}