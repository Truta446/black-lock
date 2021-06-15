export interface Activity {
  id?: string;
  amount: number;
  description: string;
  startHour: string;
  endHour: string;
  type: string;
  vehicleId: string;
}
