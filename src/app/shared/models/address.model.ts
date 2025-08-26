// src/app/shared/models/address.model.ts

/**
 * Interface for representing a user's shipping address.
 */
export interface Address {
    fullName: string;
    addressLine1: string;
    addressLine2?: string; // Optional field for apartment, suite, etc.
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  }
  