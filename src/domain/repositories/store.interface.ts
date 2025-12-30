import { UUID } from "../value-objects/uuid.value-object";
import { Store } from "../entities/store.entity";
import { StoreFilter } from "src/application/dtos/store.dto";

export interface IStoreRepository {
    findById(id: UUID): Promise<Store | null>;
    findByCode(code: string): Promise<Store | null>;
    findAllByPages(filters?: StoreFilter): Promise<{data: Store[], total: number}>;
    findAll(filters?: StoreFilter): Promise<Store[]>
    save(store: Store): Promise<Store> ;
    delete(id: UUID): Promise<void>;
    exists(id: UUID): Promise<boolean>;
}
