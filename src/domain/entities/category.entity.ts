// import { ObjectType, Field, ID } from "@nestjs/graphql";
import { CategoryName } from "../value-objects/categoty.value-object";
import { UUID } from "../value-objects/uuid.value-object";

export interface CategoryProps {
    id?: UUID;
    code?: string;
    name_category: string;
    createdAt?: Date;
    updatedAt?: Date;
    categoryCount: number;
}

// @ObjectType()
export class Category {
    private readonly _id: UUID;
    private _name_category: string;
    private _code: string;
    private readonly _createdAt: Date;
    private _updatedAt: Date;
    private _categoryCount: number

    // Constructor privado: Solo se llama desde métodos estáticos
    private constructor(props: CategoryProps) {
        // Si no se proporciona un ID, se crea uno nuevo
    const category_name = CategoryName.create(props.name_category)
       this._id = props.id || UUID.create();
       this._code = props.code || '';
       this._name_category = category_name.getValue();
       this._createdAt = props.createdAt || new Date();
       this._updatedAt = props.updatedAt || new Date(); 
       this._categoryCount = props.categoryCount
    }

     // Getters para acceder a las propiedades de la entidad
    get id(): UUID {
        return this._id;
    }

    get code(): string { // 0 el Value Object
        return this._code;
    }

    get name_category(): string { // 0 el Value Object
        return this._name_category;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get categoryCount(): number {
        return this._categoryCount;
    }

    //Metodo de logica de negocio(Business logic methods): para actualizar el nombre de la categoria
    updateNameCategory(newName: string): void {
        this._name_category = newName;
        this._updatedAt = new Date(); // Actualiza la fecha de modificacion
    }

    //Metodo de fabrica: Para crear una nueva instancia de Category(Factory method)
    static create(props: Omit<CategoryProps, 'id' | 'createdAt' | 'updatedAt'>): Category {
        return new Category(props);
    }

    static reconstitute(props: CategoryProps): Category {
        return new Category(props);
    }

    //Metodo para serializar la entidad a un objeto plano, util para la persistencia(Serialization for persistence)
    toJSON(){
        return {
            id: this._id.getValue(),
            code: this._code,
            name_category: this._name_category, // Obtiene el valor del nombre
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            categoryCount: this._categoryCount
        }
    }
}
