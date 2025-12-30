import { Controller, UsePipes, ValidationPipe, Get, Put, Post, Query, HttpCode, HttpStatus, Body, Param, Delete } from '@nestjs/common';
import { BranchResponseDto, CreateBranchDto, UpdateBranchDto } from 'src/application/dtos/branch.dto';
import { BranchFilter } from 'src/application/dtos/branch.dto';
import { BranchService } from 'src/application/services/branch.service';

@Controller('branch')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class BranchController {
    constructor(private readonly BranchService: BranchService) {}
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateBranchDto): Promise<BranchResponseDto> {
        return this.BranchService.createBranch(dto);
    }
    
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateBranch(
        @Param('id') id: string,
        @Body() updateBranchDto: UpdateBranchDto
    ): Promise<BranchResponseDto> {
        return this.BranchService.updateBranch( id,updateBranchDto );
    }
    
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string): Promise<BranchResponseDto> {
        return this.BranchService.getBranchById(id);
    }

    @Get('store/:storeId')
    @HttpCode(HttpStatus.OK)
    async findByStoreId(@Param('storeId') storeId: string): Promise<BranchResponseDto[]> {
        return this.BranchService.getBranchesByStoreId(storeId);
    }
    
    // @Get()
    // @HttpCode(HttpStatus.OK)
    // async findAllPages(
    //     @Query() filters: BranchFilter
    // ): Promise<{
    //     data: BranchResponseDto[],
    //     total: number,
    //     page: number,
    //     totalPages: number,
    //     nextPage?: number;
    //     prevPage?: number;
    // }> {
    //     return this.BranchService.getAllBranchsByPages(filters);
    // }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Query() filters: BranchFilter
    ): Promise<BranchResponseDto[]> {
        return this.BranchService.getAllBranches(filters);
    }
    
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string): Promise<void> {
        return this.BranchService.deleteBranch(id);
    }
}
