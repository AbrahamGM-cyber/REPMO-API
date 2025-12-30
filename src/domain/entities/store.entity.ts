import { UUID } from "../value-objects/uuid.value-object"; 
import { Branch } from "./branch.entity";


export interface StoreProps {
    code:               string,
    id?:                UUID;     
    nameStore:      string     
    // direction:      string
    // latitude?:      number     
    // longitude?:     number     
    createdAt?:     Date;
    updatedAt?:     Date;
    Branches?:    Branch[];
//     Branches?:      Branch[];          
}
 
export class Store {
    private readonly _code: string;
    private readonly _id: UUID;
    private _nameStore: string;
    // private _direction: string;
    // private _latitude: number;
    // private _longitude: number;
    private readonly _createdAt: Date;
    private _updatedAt: Date;
    private _Branches: Branch[] = [];

    private constructor(props: StoreProps) {
        this._code= props.code;
        this._id = props.id || UUID.create();
        this._nameStore = props.nameStore;
        // this._direction = props.direction;
        // this._latitude = props.latitude ?? 0;
        // this._longitude = props.longitude ?? 0;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
        this._Branches = props.Branches || [];
    }

  // Getters
  get code(): string {
    return this._code;
  }

  get id(): UUID {
    return this._id;
  }

  get nameStore(): string {
    return this._nameStore;
  }

// get direction(): string {
//     return this._direction;
//   }

//   get latitude(): number {
//     return this._latitude;
//   }

//   get longitude(): number {
//     return this._longitude;
//   }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get Branches(): Branch[] {
        return this._Branches;
  }


  // Business logic methods
  updateNameStore(nameStore: string): void {
    this._nameStore = nameStore;
    this._updatedAt = new Date();
  }

  // Factory method
  static create(props: Omit<StoreProps, 'id' | 'createdAt' | 'updatedAt'>): Store {
    return new Store(props);
  }

  // Reconstitution method
  static reconstitute(props: StoreProps): Store {
    return new Store(props);
  }

  // Serialization for persistence
  toJSON() {
    return {
      code: this._code,
      id: this._id.getValue(),
      nameStore: this._nameStore,
      // direction: this._direction,
      // latitude: this._latitude,
      // longitude: this._longitude,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
