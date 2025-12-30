import { Controller, UsePipes, ValidationPipe, Get, Put, Post, Query, HttpCode, HttpStatus, Body, Param, Delete } from '@nestjs/common';
import { StoreResponseDto, CreateStoreDto, UpdateStoreDto } from 'src/application/dtos/store.dto';
import { StoreFilter } from 'src/application/dtos/store.dto';
import { StoreService } from 'src/application/services/store.service';

@Controller('store')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class StoreController {
    constructor(private readonly StoreService: StoreService) {}
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateStoreDto): Promise<StoreResponseDto> {
        return this.StoreService.createStore(dto);
    }
    
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateStore(
        @Param('id') id: string,
        @Body() updateStoreDto: UpdateStoreDto
    ): Promise<StoreResponseDto> {
        return this.StoreService.updateStore( id,updateStoreDto );
    }
    
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string): Promise<StoreResponseDto> {
        return this.StoreService.getStoreById(id);
    }

    @Get('code/:code')
    @HttpCode(HttpStatus.OK)
    async findByCode(@Param('code') code: string): Promise<StoreResponseDto> {
        return this.StoreService.getStoreByCode(code);
    }
    
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAllByPages(
        @Query() filters: StoreFilter
    ): Promise<{
        data: StoreResponseDto[],
        total: number,
        page: number,
        totalPages: number,
        nextPage?: number;
        prevPage?: number;
    }> {
        return this.StoreService.getAllStoresByPages(filters);
    }

    // @Get()
    // @HttpCode(HttpStatus.OK)
    // async findAll(
    //     @Query() filters: StoreFilter
    // ): Promise<StoreResponseDto[]> {
    //     return this.StoreService.getAllStores(filters);
    // }
    
    //   @Get('store/:storeId')
    //   @HttpCode(HttpStatus.OK)
    //   async findByStore(@Param('storeId') storeId: string): Promise<StoreResponseDto[]> {
    //     return this.StoreService.getStoresByStoreId(storeId);
    //   }
    
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string): Promise<void> {
        return this.StoreService.deleteStore(id);
    }
}
