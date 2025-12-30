export class SparePartCode {
  private constructor(private readonly value: string) {}

  public static create(code: string): SparePartCode {
    if (!code || code.trim().length === 0) {
      throw new Error('SparePart code cannot be empty');
    }

    const pattern =  /^SPR-\d{4}-\d{2}-\d{6}$/;
    if (!pattern.test(code)) {
      throw new Error(
        'Invalid store code format. Expected format:  STR-XXXX-XX-XXXXXX'
      );
    }

    return new SparePartCode(code.trim());
  }

  static async generate(
    //Data
    repository: any,
  ): Promise<SparePartCode> {
    const now = new Date();
    const year = now.getFullYear(); //2025
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const datePrefix = `${year}-${month}`;

    const lastSparePart = await repository.findLastPrefix(`SPR-${datePrefix}`)
    
    let nextNumber = 1;

    if(lastSparePart && lastSparePart.code) {

      const parts = lastSparePart.code.split('-');
      const lastNumber = parseInt(parts[3], 10)
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    } 
    ///
    const paddedNumber = String(nextNumber).padStart(6, '0');
    const code = `SPR-${datePrefix}-${paddedNumber}`;

    return SparePartCode.create(code);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: SparePartCode): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}