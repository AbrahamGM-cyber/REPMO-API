export class Stock {
  private readonly _value: number;

  private constructor(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Invalid stock');
    }
    this._value = value;
  }

  static create(value: number): Stock {
    return new Stock(value);
  }

  getValue(): number {
    return this._value;
  }
}