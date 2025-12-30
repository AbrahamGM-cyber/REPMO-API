import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateSparePartDto, SparePartFilter, SparePartResponseDto, UpdateSparePartDto } from '../dtos/spare-part.dto';
import { SparePart } from 'src/domain/entities/spare-part.entity';
import { ISparePartRepository } from 'src/domain/repositories/spare-part.interface';
import { UUID } from 'src/domain/value-objects/uuid.value-object';
import { SparePartCode } from 'src/domain/value-objects/spare-part-code-value.objects';
import { IBranchRepository } from 'src/domain/repositories/branch.interface';

@Injectable()
export class SparePartService {
    constructor(
        @Inject('ISparePartRepository')
        private readonly sparepartRepository: ISparePartRepository,
        @Inject('IBranchRepository')
        private readonly branchRepository: IBranchRepository,
    ) {}

    async createSparePart(createSparePartDto : CreateSparePartDto): Promise<SparePartResponseDto> {
        // const branchId = UUID.fromString(createSparePartDto.branchId)
        const branchExists = await this.branchRepository.exists(UUID.fromString(createSparePartDto.branchId));
        if(!branchExists){
            throw new NotFoundException(`Sucursal con ID "${createSparePartDto.branchId}" no encontrada para asignar la parte`)
        }

        const branchId = UUID.fromString(createSparePartDto.branchId);

        const generateCode = await SparePartCode.generate(this.sparepartRepository)
        const newSparePart = SparePart.create({
            code: generateCode.getValue(),
            brand: createSparePartDto.brand,
            description: createSparePartDto.description,
            namePart: createSparePartDto.namePart,
            price: createSparePartDto.price,
            imgUrl: createSparePartDto.imgUrl,
            model: createSparePartDto.model,
            stock: createSparePartDto.stock,
            branchId,
        })
        const savedSparePart = await this.sparepartRepository.save(newSparePart)
        return this.mapToResponseDto(savedSparePart)
    }

    async getSparePartById(id: string): Promise <SparePartResponseDto> {
        const SparePartId = UUID.fromString(id);
        const SparePart = await this.sparepartRepository.findById(SparePartId)

        if(!SparePart){
            throw new NotFoundException(`Parte con ID "${id}" no encontrado`)
        }

        return this.mapToResponseDto(SparePart)
    }

    async getAllSpareParts(filters: SparePartFilter): Promise<{
        data: SparePartResponseDto[],
        total: number;
        page: number;
        totalPages: number;
        nextPage?: number;
        prevPage?: number;
    }>{
        // Convertir page y limit a números
        const page = Number(filters.page ?? 1);  // Si no existe 'page', usa 1 por defecto
        const limit = Number(filters.limit ?? 10);  // Si no existe 'limit', usa 10 por defecto

        const { data, total } = await this.sparepartRepository.findAll({
            ...filters,
            page,
            limit,
        });

        const totalPages = Math.ceil(total / limit);

        const nextPage = page < totalPages ? page + 1 : undefined;
        const prevPage = page > 1 ? page - 1 : undefined;

        return {
            data: data.map(spare_parts => this.mapToResponseDto(spare_parts)),
            total,
            page,
            totalPages,
            nextPage,
            prevPage,
        };
    }

    async updateSparePart(id: string, updateSparePartDto: UpdateSparePartDto): Promise <SparePartResponseDto> {
        const SparePartId = UUID.fromString(id);
        const existingSparePart = await this.sparepartRepository.findById(SparePartId)
        if (! existingSparePart){
            throw new NotFoundException(`Tipo de Solicitud con ID: "${id}" no encontrado para actualizar`)
        }

        existingSparePart.updateNamePart(
            updateSparePartDto.namePart ?? existingSparePart.namePart,
        )

        const updateSparePart = await this.sparepartRepository.save(existingSparePart)

        return this.mapToResponseDto(updateSparePart)
    }

    async getSparePartsByBranchId(branchId: string): Promise<SparePartResponseDto[]> {
        const branchUUID = UUID.fromString(branchId);
        const SpareParts = await this.sparepartRepository.findByBranchId(branchUUID)
        if(!SpareParts) {
            throw new NotFoundException(`Parte con ID "${branchUUID}"  no encontrado`)
        }
        return SpareParts.map(SparePart => this.mapToResponseDto(SparePart)) 
    }

    async deleteSparePart(id: string): Promise<void> {
        const SparePartId = UUID.fromString(id);
        const exists = await this.sparepartRepository.findByBranchId(SparePartId)
        if(!exists) {
            throw new NotFoundException(`Parte con ID "${id}"  no encontrado`)
        }
       await this.sparepartRepository.delete(SparePartId)
    }


    private mapToResponseDto(spare_part: SparePart): SparePartResponseDto {
        return {
            code: spare_part.code,
            id: spare_part.id.getValue(),
            namePart: spare_part.namePart,
            brand: spare_part.code,
            description: spare_part.description,
            price: Number(spare_part.price),
            imgUrl: spare_part.imgUrl,
            model: spare_part.model,
            stock: Number(spare_part.stock),
            branchId: spare_part.branchId
                ? spare_part.branchId.getValue()
                : undefined,
            createdAt: spare_part.createdAt,
            updatedAt: spare_part.updatedAt,
        }
    }
}
