export class StoreCode {
  private constructor(private readonly value: string) {}

  public static create(code: string): StoreCode {
    if (!code || code.trim().length === 0) {
      throw new Error('Store code cannot be empty');
    }

    const pattern =  /^STR-\d{4}-\d{2}-\d{4}$/;
    if (!pattern.test(code)) {
      throw new Error(
        'Invalid store code format. Expected format:  STR-XXXX-XX-XXXX'
      );
    }

    return new StoreCode(code.trim());
  }

  static async generate(
    //Data
    repository: any,
  ): Promise<StoreCode> {
    const now = new Date();
    const year = now.getFullYear(); //2025
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const datePrefix = `${year}-${month}`;

    const lastStore = await repository.findLastPrefix(`STR-${datePrefix}`)
    
    let nextNumber = 1;

    if(lastStore && lastStore.code) {

      const parts = lastStore.code.split('-');
      const lastNumber = parseInt(parts[3], 10)
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    } 
    ///
    const paddedNumber = String(nextNumber).padStart(4, '0');
    const code = `STR-${datePrefix}-${paddedNumber}`;

    return StoreCode.create(code);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: StoreCode): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}