import { UUID } from '../value-objects/uuid.value-object';
import { Category } from '../entities/category.entity';

export interface ICategoryRepository {
    findById(id: UUID): Promise<Category | null>;
    findAll(): Promise<Category[]>;
    save(category: Category): Promise<Category>; // Este método usará upsert en el repositorio concreto
    delete(id: UUID): Promise<void>
    exists(id: UUID): Promise<boolean>;
}