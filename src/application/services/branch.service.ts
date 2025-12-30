import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BranchResponseDto, CreateBranchDto, UpdateBranchDto } from '../dtos/branch.dto';
import { Branch } from 'src/domain/entities/branch.entity';
import { IBranchRepository } from 'src/domain/repositories/branch.interface';
import { UUID } from 'src/domain/value-objects/uuid.value-object';
import { BranchFilter } from '../dtos/branch.dto';

@Injectable()
export class BranchService {
    constructor(
        @Inject('IBranchRepository')
        private readonly branchRepository: IBranchRepository,
    ) {}

    async createBranch(createBranchDto : CreateBranchDto): Promise<BranchResponseDto> {
        const storeId = UUID.fromString(createBranchDto.storeId);
        const newBranch = Branch.create({
            direction: createBranchDto.direction,
            latitude: createBranchDto.latitude,
            longitude: createBranchDto.longitude,
            storeId
        })
        const savedBranch = await this.branchRepository.save(newBranch)
        return this.mapToResponseDto(savedBranch)
    }

    async getBranchById(id: string): Promise <BranchResponseDto> {
        const BranchId = UUID.fromString(id);
        const Branch = await this.branchRepository.findById(BranchId)

        if(!Branch){
            throw new NotFoundException(`Parte con ID "${id}" no encontrado`)
        }

        return this.mapToResponseDto(Branch)
    }

    async getBranchesByStoreId(storeId: string): Promise<BranchResponseDto[]> {
        const storeUUID = UUID.fromString(storeId);
        const Branches = await this.branchRepository.findByStoreId(storeUUID);

        if (!Branches) {
            throw new NotFoundException(`Tienda con código ${storeId} no encontrada`);
        }

        return Branches.map(branch => this.mapToResponseDto(branch));
    }

    async getAllBranches(filters: BranchFilter): Promise <BranchResponseDto[]> {
        const branches = await this.branchRepository.findAll(filters);
        return branches.map(branch=>  this.mapToResponseDto(branch))
    }
        
    // async getAllBranchsByPages(filters: BranchFilter): Promise<{
    //     data: BranchResponseDto[],
    //     total: number;
    //     page: number;
    //     totalPages: number;
    //     nextPage?: number;
    //     prevPage?: number;
    // }>{
    //     // Convertir page y limit a números
    //     const page = Number(filters.page ?? 1);  // Si no existe 'page', usa 1 por defecto
    //     const limit = Number(filters.limit ?? 10);  // Si no existe 'limit', usa 10 por defecto

    //     const { data, total } = await this.branchRepository.findAllByPages({
    //         ...filters,
    //         page,
    //         limit,
    //     });

    //     const totalPages = Math.ceil(total / limit);

    //     const nextPage = page < totalPages ? page + 1 : undefined;
    //     const prevPage = page > 1 ? page - 1 : undefined;

    //     return {
    //         data: data.map(spare_parts => this.mapToResponseDto(spare_parts)),
    //         total,
    //         page,
    //         totalPages,
    //         nextPage,
    //         prevPage,
    //     };
    // }

    async updateBranch(id: string, updateBranchDto: UpdateBranchDto): Promise <BranchResponseDto> {
        const BranchId = UUID.fromString(id);
        const existingBranch = await this.branchRepository.findById(BranchId)
        if (! existingBranch){
            throw new NotFoundException(`Tipo de Solicitud con ID: "${id}" no encontrado para actualizar`)
        }

        existingBranch.updateDirection(
            updateBranchDto.direction ?? existingBranch.direction,
            updateBranchDto.latitude ?? existingBranch.latitude,
            updateBranchDto.longitude ?? existingBranch.longitude,
        )

        const updateBranch = await this.branchRepository.save(existingBranch)

        return this.mapToResponseDto(updateBranch)
    }

    async deleteBranch(id: string): Promise<void> {
        const BranchId = UUID.fromString(id);
        const exists = await this.branchRepository.findById(BranchId)
        if(!exists) {
            throw new NotFoundException(`Parte con ID "${id}"  no encontrado`)
        }
       await this.branchRepository.delete(BranchId)
    }


    private mapToResponseDto(branch: Branch): BranchResponseDto {
        const response: BranchResponseDto =  {
            // code: branch.code,
            id: branch.id.getValue(),
            direction: branch.direction,
            latitude: branch.latitude,
            longitude: branch.longitude,
            createdAt: branch.createdAt,
            updatedAt: branch.updatedAt,
            storeId: branch.storeId.getValue(),
        }

        if(branch.SpareParts && branch.SpareParts.length > 0) {
            response.SpareParts = branch.SpareParts?.map(part => ({
                id: part.id.getValue(),
                code: part.code,
                namePart: part.namePart,
                brand: part.brand,
                description: part.description,
                price: part.price.getValue(), // Extraemos el valor numérico del Money Value Object
                stock: part.stock.getValue(), // Extraemos el valor del Stock Value Object
                model: part.model,
                imgUrl: part.imgUrl
            }));
        }
        return response;
    }
}

