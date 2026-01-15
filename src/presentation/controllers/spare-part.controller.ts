import { Controller, UsePipes, ValidationPipe, Get, Post, Delete, HttpCode, HttpStatus, Put, Body, Param, Query } from '@nestjs/common';
import { SparePartResponseDto, CreateSparePartDto, UpdateSparePartDto, SparePartFilter, publicSparePartResponseDto } from 'src/application/dtos/spare-part.dto';
import { SparePartService } from 'src/application/services/spare-part.service';

@Controller('spare-part')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class SparePartController {
  constructor(private readonly SparePartService: SparePartService) {}

  // ==========================================
  // PUBLIC SECTION (CLIENTS)
  // ==========================================

  @Get('catalog')
  @HttpCode(HttpStatus.OK)
  async findCatalog(
    @Query() filters: SparePartFilter
  ): Promise<{
    data: publicSparePartResponseDto[],
    total: number,
    page: number,
    totalPages: number,
    nextPage?: number;
    prevPage?: number;
  }> {
    return this.SparePartService.getPublicSpareParts(filters);
  }

  @Get('catalog/category/:categoryId')
  @HttpCode(HttpStatus.OK)
  async findCatalogByCategoryId(
    @Param('categoryId') categoryId: string, 
    @Query() filters: SparePartFilter): Promise<{
      data: publicSparePartResponseDto[]
      total:number
      page: number,
      totalPages: number,
      nextPage?: number;
      prevPage?: number;
    }> {
    return this.SparePartService.getSparePartsByCategoryId(categoryId, filters);
  }

   // ==========================================
  // PRIVATE SECTION (ADMIN/USER)
  // ==========================================

  @Get('branch/:branchId')
  @HttpCode(HttpStatus.OK)
  async findByBranchId(@Param('branchId') branchId: string): Promise<SparePartResponseDto[]> {
    return this.SparePartService.getSparePartsByBranchId(branchId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() filters: SparePartFilter
  ): Promise<{
    data: SparePartResponseDto[],
    total: number,
    page: number,
    totalPages: number,
    nextPage?: number;
    prevPage?: number;
  }> {
    return this.SparePartService.getAllSpareParts(filters);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<SparePartResponseDto> {
    return this.SparePartService.getSparePartById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSparePartDto): Promise<SparePartResponseDto> {
    return this.SparePartService.createSparePart(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateSparePart(
    @Param('id') id: string,
    @Body() updateSparePartDto: UpdateSparePartDto
  ): Promise<SparePartResponseDto> {
    return this.SparePartService.updateSparePart( id,updateSparePartDto );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.SparePartService.deleteSparePart(id);
  }
} 
