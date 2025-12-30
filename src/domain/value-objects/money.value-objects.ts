export class Money {
  private readonly _value: number;

  private constructor(value: number) {
    if (value < 0) {
      throw new Error('Price cannot be negative');
    }
    this._value = Number(value.toFixed(2));
  }

  static create(value: number): Money {
    return new Money(value);
  }

  getValue(): number {
    return this._value;
  }
}