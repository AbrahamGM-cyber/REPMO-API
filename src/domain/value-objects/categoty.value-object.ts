import { HttpException, HttpStatus } from "@nestjs/common";

export class CategoryName {
    private constructor(private readonly value: string) { }

    static create(category: string): CategoryName {
        if (!category || category.trim().length === 0) {
            throw new Error('Category cannot be empty');
        }

        if (category.trim().length > 1000) {
            throw new Error('Category cannot exceed 1000 characters');
        }

        const isValid = this.isValidCategoryName(category)

        if(!isValid) throw new HttpException('La primera letra del nombre debe ser en mayuscula.', HttpStatus.BAD_REQUEST)

        return new CategoryName(category.trim());
    }


    private static isValidCategoryName(category: string): boolean {
        const categoryRegex = /^[A-Z]/;
        return categoryRegex.test(category);
    }




    getValue(): string {
        return this.value;
    }

    equals(other: CategoryName): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
} 