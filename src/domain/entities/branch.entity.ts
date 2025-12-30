import { UUID } from "../value-objects/uuid.value-object"; 
import { SparePart } from "./spare-part.entity";

export interface BranchProps {
    id?:            UUID;      
    direction:      string
    latitude?:      number     
    longitude?:     number     
    createdAt?:     Date;
    updatedAt?:     Date;  
    storeId:       UUID; 
    SpareParts?:    SparePart[]         
}
 
export class Branch {
    // private readonly _code: string;
    private readonly _id: UUID;
    private _direction: string;
    private _latitude: number;
    private _longitude: number;
    private readonly _createdAt: Date;
    private _updatedAt: Date;
     private readonly _storeId: UUID;
      private _SpareParts: SparePart[] = [];

    private constructor(props: BranchProps) {
        // this._code= props.code;
        this._id = props.id || UUID.create();
        this._direction = props.direction;
        this._latitude = props.latitude ?? 0;
        this._longitude = props.longitude ?? 0;
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt || new Date();
        this._storeId = props.storeId;
        this._SpareParts = props.SpareParts || [];
    }

  // Getters
  // get code(): string {
  //   return this._code;
  // }

  get id(): UUID {
    return this._id;
  }

  get direction(): string {
    return this._direction;
  }

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get storeId(): UUID{
    return this._storeId;
  }

  get SpareParts(): SparePart[] {
    return this._SpareParts;
  }


  // Business logic methods
  updateDirection(
    newDirection: string, 
    newLatitude: number,
    newLongitude: number,
  ): void {
    this._direction = newDirection;
    this._latitude = newLatitude;
    this._longitude = newLongitude;
    this._updatedAt = new Date();
  }

  // Factory method
  static create(props: Omit<BranchProps, 'id' | 'createdAt' | 'updatedAt'>): Branch {
    return new Branch(props);
  }

  // Reconstitution method
  static reconstitute(props: BranchProps): Branch {
    return new Branch(props);
  }

  // Serialization for persistence
  toJSON() {
    return {
      // code: this._code,
      id: this._id.getValue(),
      direction: this._direction,
      latitude: this._latitude,
      longitude: this._longitude,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      storeId: this._storeId?.getValue(),
    };
  }
}
