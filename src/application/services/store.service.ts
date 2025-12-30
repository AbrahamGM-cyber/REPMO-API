import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { StoreResponseDto, CreateStoreDto, UpdateStoreDto } from '../dtos/store.dto';
import { Store } from 'src/domain/entities/store.entity';
import { IStoreRepository } from 'src/domain/repositories/store.interface';
import { UUID } from 'src/domain/value-objects/uuid.value-object';
import { StoreFilter } from '../dtos/store.dto';
import { StoreCode } from 'src/domain/value-objects/store-code.value-objects';

@Injectable()
export class StoreService {
    constructor(
        @Inject('IStoreRepository')
        private readonly storeRepository: IStoreRepository,
    ) {}

    async createStore(createStoreDto : CreateStoreDto): Promise<StoreResponseDto> {
        const storeCode = await StoreCode.generate(this.storeRepository);
        
        const newStore = Store.create({
            code: storeCode.getValue(),
            nameStore: createStoreDto.nameStore,
        })
        const savedStore = await this.storeRepository.save(newStore)
        return this.mapToResponseDto(savedStore)
    }

    async getStoreById(id: string): Promise <StoreResponseDto> {
        const StoreId = UUID.fromString(id);
        const Store = await this.storeRepository.findById(StoreId)

        if(!Store){
            throw new NotFoundException(`Parte con ID "${id}" no encontrado`)
        }

        return this.mapToResponseDto(Store)
    }

    async getStoreByCode(code: string): Promise<StoreResponseDto> {
        const store = await this.storeRepository.findByCode(code);

        if (!store) {
            throw new NotFoundException(`Tienda con código ${code} no encontrada`);
        }

        // El mapToResponseDto debe estar preparado para mapear los arrays de spareParts y branches
        return this.mapToResponseDto(store);
    }

    async getAllStoresByPages(filters: StoreFilter): Promise<{
        data: StoreResponseDto[],
        total: number;
        page: number;
        totalPages: number;
        nextPage?: number;
        prevPage?: number;
    }>{
        // Convertir page y limit a números
        const page = Number(filters.page ?? 1);  // Si no existe 'page', usa 1 por defecto
        const limit = Number(filters.limit ?? 10);  // Si no existe 'limit', usa 10 por defecto

        const { data, total } = await this.storeRepository.findAllByPages({
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

    async updateStore(id: string, updateStoreDto: UpdateStoreDto): Promise <StoreResponseDto> {
        const StoreId = UUID.fromString(id);
        const existingStore = await this.storeRepository.findById(StoreId)
        if (! existingStore){
            throw new NotFoundException(`Tipo de Solicitud con ID: "${id}" no encontrado para actualizar`)
        }

        existingStore.updateNameStore(
            updateStoreDto.nameStore ?? existingStore.nameStore,
        )

        const updateStore = await this.storeRepository.save(existingStore)

        return this.mapToResponseDto(updateStore)
    }

    async deleteStore(id: string): Promise<void> {
        const StoreId = UUID.fromString(id);
        const exists = await this.storeRepository.findById(StoreId)
        if(!exists) {
            throw new NotFoundException(`Parte con ID "${id}"  no encontrado`)
        }
       await this.storeRepository.delete(StoreId)
    }


    private mapToResponseDto(store: Store): StoreResponseDto {
        const response: StoreResponseDto =  {
            code: store.code,
            id: store.id.getValue(),
            nameStore: store.nameStore,
            createdAt: store.createdAt,
            updatedAt: store.updatedAt,
        }

        if(store.Branches && store.Branches.length > 0) {
            response.Branches = store.Branches?.map(part => ({
                id: part.id.getValue(),
                direction: part.direction,
                latitude: part.latitude,
                longitude: part.longitude              
            }));
        }
        return response;
    }
}

