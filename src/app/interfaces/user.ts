import { Address } from './address';

export interface User {
  id?: string;
  name: string;
  cpf: string;
  email: string;
  phoneNumber?: string;
  balance?: number;
  address: Address;
}
