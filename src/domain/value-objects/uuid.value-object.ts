export class UUID {
  private constructor(private readonly value: string) {}

  static create(): UUID {
    return new UUID(crypto.randomUUID());
  }

  static fromString(value: string): UUID {
    if (!this.isValidUUID(value)) {
      throw new Error('Invalid UUID format');
    }
    return new UUID(value);
  }

  private static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UUID): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
} 