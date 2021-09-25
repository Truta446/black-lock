import { Location } from './location';
import { Option } from './option';
import { Lot } from './lot';

export interface LocalStorage {
  location: Location;
  amountCents: number;
  lot: Lot;
  checkIn: CheckIn;
}

interface CheckIn {
  hourOption: Option;
  vehicleId: string;
}
