import { UUID } from "../value-objects/uuid.value-object";
import { Branch } from "../entities/branch.entity";
import { BranchFilter } from "src/application/dtos/branch.dto";

export interface IBranchRepository {
    findById(id: UUID): Promise<Branch | null>;
    findByStoreId(storeId: UUID): Promise<Branch[] | null>;
    // findAllByPages(filters?: BranchFilter): Promise<{data: Branch[], total: number}>;
    findAll(filters?: BranchFilter): Promise<Branch[]>
    save(branch: Branch): Promise<Branch> ;
    delete(id: UUID): Promise<void>;
    exists(id: UUID): Promise<boolean>;
}
