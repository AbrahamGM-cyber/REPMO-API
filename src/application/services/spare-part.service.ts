import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateSparePartDto, SparePartFilter, SparePartResponseDto, UpdateSparePartDto, publicSparePartResponseDto } from '../dtos/spare-part.dto';
import { SparePart } from 'src/domain/entities/spare-part.entity';
import { ISparePartRepository } from 'src/domain/repositories/spare-part.interface';
import { UUID } from 'src/domain/value-objects/uuid.value-object';
import { SparePartCode } from 'src/domain/value-objects/spare-part-code-value.objects';
import { IBranchRepository } from 'src/domain/repositories/branch.interface';
import { ICategoryRepository } from 'src/domain/repositories/category.interface';

@Injectable()
export class SparePartService {
    constructor(
        @Inject('ISparePartRepository')
        private readonly sparepartRepository: ISparePartRepository,
        @Inject('IBranchRepository')
        private readonly branchRepository: IBranchRepository,
        @Inject('ICategoryRepository')
        private readonly categoryRepository: ICategoryRepository,
    ) {}

    // ==========================================
    // PUBLIC SECTION (CLIENTS)
    // ==========================================

    async getPublicSpareParts(filters: SparePartFilter): Promise<{
        data: publicSparePartResponseDto[],
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
            data: data.map(spare_parts => this.mapToPublicResponseDto(spare_parts)),
            total,
            page,
            totalPages,
            nextPage,
            prevPage,
        };
    }

    async getSparePartsByCategoryId(categoryId: string, filters: SparePartFilter): Promise<{
        data: publicSparePartResponseDto[],
        total: number;
        page: number;
        totalPages: number;
        nextPage?: number;
        prevPage?: number;
    }> {
        const categoryUUID = UUID.fromString(categoryId);

        const result = await this.sparepartRepository.findCatalogByCategoryId(categoryUUID)
        
        if(!result.data) {
            throw new NotFoundException(`Parte con ID "${categoryUUID}"  no encontrado`)
        }

        // Convertir page y limit a números
        const page = Number(filters.page ?? 1);  // Si no existe 'page', usa 1 por defecto
        const limit = Number(filters.limit ?? 10);  // Si no existe 'limit', usa 10 por defecto
        const totalPages = Math.ceil(result.total / limit);

        const nextPage = page < totalPages ? page + 1 : undefined;
        const prevPage = page > 1 ? page - 1 : undefined;

        // return SpareParts.map(SparePart => this.mapToPublicResponseDto(SparePart)) 

        return {
            data: result.data.map(spare_parts => this.mapToPublicResponseDto(spare_parts)),
            total: result.total,
            page,
            totalPages,
            nextPage,
            prevPage,
        }
    }

    private mapToPublicResponseDto(spare_part: SparePart): publicSparePartResponseDto {
        return {
            code: spare_part.code,
            namePart: spare_part.namePart,
            brand: spare_part.code,
            price: spare_part.price.getValue(),
            imgUrl: spare_part.imgUrl,
            model: spare_part.model,
            branch: spare_part.branch ? {
                direction: spare_part.branch.direction,
                // Limpiamos la tienda dentro de la sucursal
                store: spare_part.branch.store ? {
                    code: spare_part.branch.store.code,
                    nameStore: spare_part.branch.store.nameStore,
                } : undefined
            } : undefined,
            // Si necesitas la categoría, límpiala también aquí
            category: spare_part.category ? {
                name_category: spare_part.category.name_category,
            } : undefined
        }
    }

    // ==========================================
    // PRIVATE SECTION (ADMIN / USERS)
    // ==========================================

    async createSparePart(createSparePartDto : CreateSparePartDto): Promise<SparePartResponseDto> {
        // const branchId = UUID.fromString(createSparePartDto.branchId)
        const branchExists = await this.branchRepository.exists(UUID.fromString(createSparePartDto.branchId));
        if(!branchExists){
            throw new NotFoundException(`Sucursal con ID "${createSparePartDto.branchId}" no encontrada para asignar la parte`)
        }

        const categoryExists = await this.categoryRepository.exists(UUID.fromString(createSparePartDto.categoryId));
        if(!categoryExists){
            throw new NotFoundException(`Categoria con ID "${createSparePartDto.categoryId}" no encontrada para asignar la parte`)
        }

        const branchId = UUID.fromString(createSparePartDto.branchId);
        const categoryId = UUID.fromString(createSparePartDto.categoryId);

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
            categoryId
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
            brand: spare_part.brand,
            description: spare_part.description,
            price: spare_part.price.getValue(),
            imgUrl: spare_part.imgUrl,
            model: spare_part.model,
            stock: spare_part.stock.getValue(),
            branchId: spare_part.branchId
                ? spare_part.branchId.getValue()
                : undefined,
            categoryId: spare_part.categoryId
                ? spare_part.categoryId.getValue()
                : undefined,
            branch: spare_part.branch,
            category: spare_part.category,
            createdAt: spare_part.createdAt,
            updatedAt: spare_part.updatedAt,
        }
    }

    
}
