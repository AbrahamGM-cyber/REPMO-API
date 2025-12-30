import { Injectable, NotFoundException } from "@nestjs/common";
import { BranchFilter } from "src/application/dtos/branch.dto";
import { Branch } from "src/domain/entities/branch.entity";
import { IBranchRepository } from "src/domain/repositories/branch.interface";
import { UUID } from "src/domain/value-objects/uuid.value-object";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "../../../generated/prisma";
import { SparePart } from "src/domain/entities/spare-part.entity";
``
@Injectable()
export class PrismaBranchRepository implements IBranchRepository {
    constructor(private readonly prisma: PrismaService) {}
    /** 
    * Encuentra un category por su ID
    * @param id El ID del category (como objeto UUID)
    */

    async findById(id: UUID): Promise<Branch | null> {
        const branchData = await this.prisma.branch.findUnique({
            where: { id: id.getValue()},
            include: {
                spareParts: true,
            },
        });

        if(!branchData){
            return null;
        }

        return Branch.reconstitute({
            id: UUID.fromString(branchData.id),
            direction: branchData.direction,
            latitude: branchData.latitude ?? 0,
            longitude: branchData.longitude ?? 0,
            createdAt: branchData.createdAt,
            updatedAt: branchData.updatedAt,
            storeId: UUID.fromString(branchData.storeId),
            SpareParts: branchData.spareParts.map(spare => SparePart.reconstitute({
                id:  UUID.fromString(spare.id),
                createdAt:spare.createdAt,
                updatedAt:spare.updatedAt,
                brand: spare.brand,
                namePart: spare.namePart,
                stock: spare.stock,
                model: spare.model,
                imgUrl: spare.model,
                description: spare.description,
                code: spare.code,
                price: Number(spare.price),
                branchId:  UUID.fromString(spare.branchId)
            }))
        });
    };

   
    async findByStoreId(storeId: UUID): Promise <Branch[]> {
        const branchData = await this.prisma.branch.findMany({
            where: { storeId: storeId.getValue() },
            include: {
                store: true,
            },
        });

        return branchData.map(branchData => 
            Branch.reconstitute({
                id: UUID.fromString(branchData.id),
                direction: branchData.direction,
                latitude: branchData.latitude ?? 0,
                longitude: branchData.longitude ?? 0,
                createdAt: branchData.createdAt,
                updatedAt: branchData.updatedAt,
                storeId: UUID.fromString(branchData.storeId),
            })
        );
    };

    async findAll(filters?: BranchFilter): Promise<Branch[]> {
        const where: Prisma.BranchWhereInput = {};
        if (filters?.storeId) {
            where.storeId = filters.storeId;
        }

        const branchData = await this.prisma.branch.findMany({
            include: {
                spareParts: true
            },
            where,
            orderBy: {
                createdAt: 'asc', // asc para ascendente, desc para descendente
            },
        });


        return branchData.map(branchData => 
            Branch.reconstitute({
                id: UUID.fromString(branchData.id),
                direction: branchData.direction,
                latitude: branchData.latitude ?? 0,
                longitude: branchData.longitude ?? 0,
                createdAt: branchData.createdAt,
                updatedAt: branchData.updatedAt,
                storeId: UUID.fromString(branchData.storeId),
            })
        );
    }

    

    // async findAllByPages(filters?: BranchFilter): Promise<{data: Branch[], total: number}> {
    //     const where: Prisma.BranchWhereInput = {};
    //     if(filters?.nameStore){
    //         where.nameStore = filters.nameStore
    //     }

    //     const page = filters?.page ?? 1;
    //     const limit = filters?.limit ?? 10;
    //     const skip = (page - 1) * limit;

    //     const total = await this.prisma.branch.count({ where })

    //     const branchData = await this.prisma.branch.findMany({
    //         where,
    //         skip,
    //         take: limit,
    //         include: { 
    //             spareParts:  true 
    //         },
    //         orderBy: {
    //             createdAt: 'asc', // asc para ascendente, desc para descendente
    //         },
    //     });

    //     const data = branchData.map((branchData => 
    //         Branch.reconstitute({
    //             id: UUID.fromString(branchData.id),
    //             direction: branchData.direction,
    //             latitude: branchData.latitude ?? 0,
    //             longitude: branchData.longitude ?? 0,
    //             createdAt: branchData.createdAt,
    //             updatedAt: branchData.updatedAt,
    //             storeId: UUID.fromString(branchData.storeId),
    //         })
    //     ))
    //     return{data, total}
    // }

    async save(branch: Branch): Promise<Branch> {
        const branchData= branch.toJSON();
        const {
        createdAt,
        updatedAt,
        storeId,
        ...dataForPrisma
        } =branchData;
        const savedBranch = await this.prisma.branch.upsert({
            where: { id: branchData.id },
            update: {
                direction: branchData.direction,
                store: {
                    connect: { 
                        id: branchData.storeId?.toString()
                    }
                }
                // ...(branchId && {
                //     branch: {
                //         connect: { id: branchData.branchId?.toString() }
                //     }
                // })
            },
            create: {
                ...dataForPrisma,
                id: dataForPrisma.id,
                direction: dataForPrisma.direction,
                store: {
                    connect: { id: storeId } // Conexión obligatoria
                }
            }
        });

        return Branch.reconstitute({
            id: UUID.fromString(savedBranch.id),
            direction: savedBranch.direction,
            latitude: savedBranch.latitude ?? 0,
            longitude: savedBranch.longitude ?? 0,
            createdAt: savedBranch.createdAt,
            updatedAt: savedBranch.updatedAt,
            storeId: UUID.fromString(savedBranch.storeId),
        });
    }
    
    async delete(id: UUID): Promise<void> {
       try {
        await this.prisma.branch.delete({
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
        const count = await this.prisma.branch.count({
            where: { id: id.getValue() },
        });
        return count > 0;
   }
}