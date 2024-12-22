// src/types/index.ts

export interface Product {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  images: {
    url: string;
    alt?: string;
    isDefault?: boolean;
  }[];
  inventory: {
    quantity: number;
    reservedQuantity?: number;
    sku: string;
  };
  attributes: {
    name?: string;
    value?: string;
  }[];
  ratings: {
    average?: number;
    count?: number;
  };
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  role?: "user" | "admin";
  phone?: string;
  addresses: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }[];
  refreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  isEmailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
}