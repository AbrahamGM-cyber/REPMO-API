import { Controller, UsePipes, ValidationPipe, Get, Post, Delete, HttpCode, HttpStatus, Put, Body, Param, Query } from '@nestjs/common';
import { SparePartResponseDto, CreateSparePartDto, UpdateSparePartDto, SparePartFilter } from 'src/application/dtos/spare-part.dto';
import { SparePartService } from 'src/application/services/spare-part.service';

@Controller('spare-part')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class SparePartController {
  constructor(private readonly SparePartService: SparePartService) {}

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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<SparePartResponseDto> {
    return this.SparePartService.getSparePartById(id);
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

  @Get('branch/:branchId')
  @HttpCode(HttpStatus.OK)
  async findByBranchId(@Param('branchId') branchId: string): Promise<SparePartResponseDto[]> {
    return this.SparePartService.getSparePartsByBranchId(branchId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.SparePartService.deleteSparePart(id);
  }
} 
