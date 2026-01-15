import { Injectable, NotFoundException } from "@nestjs/common";
import { SparePartFilter } from "src/application/dtos/spare-part.dto";
import { SparePart } from "src/domain/entities/spare-part.entity";
import { ISparePartRepository } from "src/domain/repositories/spare-part.interface";
import { UUID } from "src/domain/value-objects/uuid.value-object";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "../../../generated/prisma";
import { Branch } from "src/domain/entities/branch.entity";
import { Store } from "src/domain/entities/store.entity";
import { Category } from "src/domain/entities/category.entity";

@Injectable()
export class PrismaSparePartRepository implements ISparePartRepository {
    constructor(private readonly prisma: PrismaService) {}
    /** 
    * Encuentra un category por su ID
    * @param id El ID del category (como objeto UUID)
    */

    async findLastPrefix(prefix: string): Promise<SparePart | null> {
            const lastPart = await this.prisma.sparePart.findFirst({
                where: {
                    code: {
                        startsWith: prefix
                    }
                },
                orderBy:{
                    code: 'desc'
                }
            });
            if(!lastPart) return null;
    
            return SparePart.reconstitute({
                id: UUID.fromString(lastPart.id),
                brand: lastPart.brand,
                description: lastPart.description,
                namePart: lastPart.namePart,
                price: Number(lastPart.price),
                stock: lastPart.stock,
                model: lastPart.model,
                imgUrl: lastPart.imgUrl,
                branchId:UUID.fromString(lastPart.branchId),
                categoryId: UUID.fromString(lastPart.categoryId),
                code: lastPart.code,
                createdAt: lastPart.createdAt,
                updatedAt: lastPart.updatedAt,
            });
        }

    // ==========================================
    // PUBLIC SECTION (CLIENTS)
    // ==========================================

    async findCatalog(filters?: SparePartFilter): Promise<{data: SparePart[], total: number}> {
        const where: Prisma.SparePartWhereInput = {};
        if(filters?.brand){
            where.brand = filters.brand
        }

        if(filters?.code){
            where.code = filters.code
        }

        if(filters?.model){
            where.model = filters.model
        }

        if( filters?.categoryId){
            where.model = filters.categoryId
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.prisma.sparePart.count({ where })

        const sparePartData = await this.prisma.sparePart.findMany({
            where,
            skip,
            take: limit,
            include: { 
                branch:{
                    include: {
                        store: true,
                    }
                },
                category: true, //
                
            },
            orderBy: {
                createdAt: 'asc', // asc para ascendente, desc para descendente
            },
        });

        const data = sparePartData.map((sparePartData => 
            SparePart.reconstitute({
                code: sparePartData.code,
                brand: sparePartData.brand,
                description: sparePartData.description,
                namePart: sparePartData.namePart,
                price: Number(sparePartData.price),
                stock: sparePartData.stock,
                model: sparePartData.model,
                imgUrl: sparePartData.imgUrl,
                branchId: UUID.fromString(sparePartData.branchId),
                categoryId: UUID.fromString(sparePartData.categoryId),
                branch: sparePartData.branch ? Branch.reconstitute({
                    id: UUID.fromString(sparePartData.branch.id),
                    direction: sparePartData.branch.direction,
                    storeId: UUID.fromString(sparePartData.branch.storeId),
                    store: sparePartData.branch.store ? Store.reconstitute({
                        nameStore: sparePartData.branch.store.nameStore,
                        code: sparePartData.branch.store.code,
                    }) : undefined,
                }) : undefined,  
                category: sparePartData.category ? Category.reconstitute({
                    id: UUID.fromString(sparePartData.category.id),
                    name_category: sparePartData.category.name_category,
                    categoryCount: sparePartData.category.categoryCount,
                }) : undefined,
                
            })
        ));
        return{data, total}
    }

    async findCatalogByCategoryId(categoryId: UUID, filters?: SparePartFilter): Promise <{data: SparePart[], total: number}> {
        const where: Prisma.SparePartWhereInput = {
        categoryId: categoryId.getValue(),
        
        ...(filters?.brand && { brand: filters.brand}),
        ...(filters?.model && { model: filters.model}),
        ...(filters?.code && { code: filters.code}),
        // if(filters?.code){
        //     where.code = filters.code
        // }

        // if(filters?.model){
        //     where.model = filters.model
        // }
        };
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.prisma.sparePart.count({ where })

        const sparePartData = await this.prisma.sparePart.findMany({
            where,
            skip,
            take: limit,
            include: {
                branch: {
                    include: {
                        store: true
                    }
                },
                category: true,
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        const data = sparePartData.map((sparePartData => 
            SparePart.reconstitute({
                code: sparePartData.code,
                brand: sparePartData.brand,
                description: sparePartData.description,
                namePart: sparePartData.namePart,
                price: Number(sparePartData.price),
                stock: sparePartData.stock,
                model: sparePartData.model,
                imgUrl: sparePartData.imgUrl,
                branchId: UUID.fromString(sparePartData.branchId),
                categoryId: UUID.fromString(sparePartData.categoryId),
                branch: sparePartData.branch ? Branch.reconstitute({
                    id: UUID.fromString(sparePartData.branch.id),
                    direction: sparePartData.branch.direction,
                    storeId: UUID.fromString(sparePartData.branch.storeId),
                    store: sparePartData.branch.store ? Store.reconstitute({
                        nameStore: sparePartData.branch.store.nameStore,
                        code: sparePartData.branch.store.code,
                    }) : undefined,
                }) : undefined,  
                category: sparePartData.category ? Category.reconstitute({
                    id: UUID.fromString(sparePartData.category.id),
                    name_category: sparePartData.category.name_category,
                    categoryCount: sparePartData.category.categoryCount,
                }) : undefined,
            })
        ));
        return{data, total}
    };

    // ==========================================
    // PRIVATE SECTION (ADMIN/USER)
    // ==========================================

    async findAll(filters?: SparePartFilter): Promise<{data: SparePart[], total: number}> {
        const where: Prisma.SparePartWhereInput = {};
        if(filters?.brand){
            where.brand = filters.brand
        }

        if(filters?.code){
            where.code = filters.code
        }

        if(filters?.model){
            where.model = filters.model
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.prisma.sparePart.count({ where })

        const sparePartData = await this.prisma.sparePart.findMany({
            where,
            skip,
            take: limit,
            include: { 
                branch:{
                    include: {
                        store: true,
                    }
                }
                
            },
            orderBy: {
                createdAt: 'asc', // asc para ascendente, desc para descendente
            },
        });

        const data = sparePartData.map((sparePartData => 
            SparePart.reconstitute({
                id: UUID.fromString(sparePartData.id),
                code: sparePartData.code,
                brand: sparePartData.brand,
                description: sparePartData.description,
                namePart: sparePartData.namePart,
                price: Number(sparePartData.price),
                stock: sparePartData.stock,
                model: sparePartData.model,
                imgUrl: sparePartData.imgUrl,
                createdAt: sparePartData.createdAt,
                updatedAt: sparePartData.updatedAt,
                branchId: UUID.fromString(sparePartData.branchId),
                categoryId: UUID.fromString(sparePartData.categoryId),
                branch: sparePartData.branch ? Branch.reconstitute({
                    id: UUID.fromString(sparePartData.branch.id),
                    direction: sparePartData.branch.direction,
                    storeId: UUID.fromString(sparePartData.branch.storeId),
                    // createdAt: sparePartData.branch.createdAt,
                    // updatedAt: sparePartData.branch.updatedAt,
                    store: sparePartData.branch.store ? Store.reconstitute({
                        nameStore: sparePartData.branch.store.nameStore,
                        code: sparePartData.branch.store.code,
                    }) : undefined,
                }) : undefined,    
            })
        ));
        return{data, total}
    }

     async findById(id: UUID): Promise<SparePart | null> {
        const sparePart = await this.prisma.sparePart.findUnique({
            where: { id: id.getValue()},
            include: {
                branch: true,
            },
        });

        if(!sparePart){
            return null;
        }

        return SparePart.reconstitute({
            id: UUID.fromString(sparePart.id),
            brand: sparePart.brand,
            description: sparePart.description,
            namePart: sparePart.namePart,
            price: Number(sparePart.price),
            stock: sparePart.stock,
            model: sparePart.model,
            imgUrl: sparePart.imgUrl,
            branchId:UUID.fromString(sparePart.branchId),
            categoryId: UUID.fromString(sparePart.categoryId),
            code: sparePart.code,
            createdAt: sparePart.createdAt,
            updatedAt: sparePart.updatedAt,
        });
    };

    async findByBranchId(branchId: UUID): Promise <SparePart[]> {
        const sparePartData = await this.prisma.sparePart.findMany({
            where: { branchId: branchId.getValue() },
            include: {
                branch: true,
            },
        });

        return sparePartData.map(sparePartData => 
            SparePart.reconstitute({
                id: UUID.fromString(sparePartData.id),
                brand: sparePartData.brand,
                description: sparePartData.description,
                namePart: sparePartData.namePart,
                price: Number(sparePartData.price),
                stock: sparePartData.stock,
                model: sparePartData.model,
                imgUrl: sparePartData.imgUrl,
                branchId:UUID.fromString(sparePartData.branchId),
                categoryId: UUID.fromString(sparePartData.categoryId),
                code: sparePartData.code,
                createdAt: sparePartData.createdAt,
                updatedAt: sparePartData.updatedAt,
            })
        ) ;
    };


    

    async save(sparePart: SparePart): Promise<SparePart> {
        const sparePartData= sparePart.toJSON();
        const {
        createdAt,
        updatedAt,
        branchId,
        branch,
        categoryId,
        category,
        ...dataForPrisma
        } =sparePartData;
        const savedSparePart = await this.prisma.sparePart.upsert({
            where: { id: sparePartData.id },
            update: {
                namePart: sparePartData.namePart,
                branch: {
                    connect: { 
                        id: sparePartData.branchId?.toString()
                    }
                },
                category: {
                    connect: { 
                        id: sparePartData.categoryId?.toString()
                    }
                }
                // ...(branchId && {
                //     branch: {
                //         connect: { id: sparePartData.branchId?.toString() }
                //     }
                // })
            },
            create: {
                ...dataForPrisma,
                id: dataForPrisma.id,
                namePart: dataForPrisma.namePart,
                branch: {
                    connect: { id: branchId } // Conexión obligatoria
                },
                category: {
                    connect: { id: categoryId }
                }
            }
        });

        return SparePart.reconstitute({
            id: UUID.fromString(savedSparePart.id),
            code: savedSparePart.code,
            brand: savedSparePart.brand,
            description: savedSparePart.description,
            namePart: savedSparePart.namePart,
            price: Number(savedSparePart.price),
            stock: savedSparePart.stock,
            model: savedSparePart.model,
            imgUrl: savedSparePart.imgUrl,
            branchId: UUID.fromString(savedSparePart.branchId),
            categoryId: UUID.fromString(savedSparePart.categoryId),
            createdAt: savedSparePart.createdAt,
            updatedAt: savedSparePart.updatedAt,
        });
    }
    
    async delete(id: UUID): Promise<void> {
       try {
        await this.prisma.sparePart.delete({
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
        const count = await this.prisma.sparePart.count({
            where: { id: id.getValue() },
        });
        return count > 0;
   }
}