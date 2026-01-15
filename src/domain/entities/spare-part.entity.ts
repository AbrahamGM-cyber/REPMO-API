import { Money } from "../value-objects/money.value-objects";
import { Stock } from "../value-objects/stock.value-objects";
import { UUID } from "../value-objects/uuid.value-object"; 

export interface SparePartProps {
    code:               string,
    id?:                UUID;
    brand:              string;
    description:        string;
    namePart:           string;
    price:              number;                    
    stock:              number;                     
    model:              string;
    imgUrl:             string;
    branchId:            UUID; 
    categoryId:         UUID;
    branch?:             any;   
    category?:          any;
    createdAt?: Date;
    updatedAt?: Date;              
}
 
export class SparePart {
    private readonly _code: string;
    private readonly _id: UUID;
    private _brand: string;
    private _description: string;
    private _namePart: string;
    private _price: Money;
    private _stock: Stock;
    private _model: string;
    private _imgUrl: string;
    private readonly _branchId: UUID;
    private readonly _categoryId: UUID;
    private _branch: any;
    private _category: any;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: SparePartProps) {
        this._code= props.code;
        this._id = props.id || UUID.create();
        this._brand = props.brand;
        this._description = props.description;
        this._namePart = props.namePart;
        this._price = Money.create(props.price);
        this._stock = Stock.create(props.stock);
        this._model = props.model;
        this._imgUrl = props.imgUrl;
        this._branchId = props.branchId;
        this._categoryId = props.categoryId;
        this._branch = props.branch;
        this._category = props.category;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
    }

  // Getters
  get code(): string {
    return this._code;
  }

  get id(): UUID {
    return this._id;
  }

  get brand(): string {
    return this._brand;
  }

  get description(): string {
    return this._description;
  }

  get namePart(): string {
    return this._namePart;
  }

  get price(): Money {
    return this._price;
  }

  get stock(): Stock {
    return this._stock;
  }

  get model(): string {
    return this._model;
  }

  get imgUrl(): string {
    return this._imgUrl;
  }

  get branchId(): UUID {
    return this._branchId;
  }

  get categoryId(): UUID {
    return this._categoryId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get branch(): any {
    return this._branch;
  }
  get category(): any {
    return this._category;
  }

  // Business logic methods
  updateNamePart(namePart: string): void {
    this._namePart = namePart;
    this._updatedAt = new Date();
  }

  // Factory method
  static create(props: Omit<SparePartProps, 'id' | 'createdAt' | 'updatedAt'>): SparePart {
    return new SparePart(props);
  }

  // Reconstitution method
  static reconstitute(props: SparePartProps): SparePart {
    return new SparePart(props);
  }

  // Serialization for persistence
  toJSON() {
    return {
      code: this._code,
      id: this._id.getValue(),
      brand: this._brand,
      description: this._description,
      namePart: this._namePart,
      price: this._price.getValue(),
      stock: this._stock.getValue(),
      model: this._model,
      imgUrl: this._imgUrl,
      branchId: this._branchId?.getValue(),
      categoryId: this._categoryId?.getValue(),
      branch: this._branch ? this._branch.toJSON() : null,
      category: this._category ? this._category.toJSON() : null,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
