import { UUID } from "../value-objects/uuid.value-object";
import { SparePart } from "../entities/spare-part.entity";
import { SparePartFilter } from "src/application/dtos/spare-part.dto";

export interface ISparePartRepository{

    // ==========================================
    // PUBLIC SECTION (CLIENTS)
    // ==========================================
    findCatalog(filters?: SparePartFilter): Promise<{data: SparePart[], total: number}>;
    findCatalogByCategoryId(categoryId: UUID): Promise<{data:SparePart[], total: number}>;

    // ==========================================
    // PRIVATE SECTION (ADMIN/USER)
    // ==========================================
    findAll(filters?: SparePartFilter): Promise<{data: SparePart[], total: number}>;
    findById(id: UUID): Promise<SparePart | null>;
    // findByCode(code: string): Promise<SparePart | null>;
    findByBranchId(branchId: UUID): Promise<SparePart[] | null>;
    save(sparePart: SparePart): Promise<SparePart> ;
    delete(id: UUID): Promise<void>;
    exists(id: UUID): Promise<boolean>;
}