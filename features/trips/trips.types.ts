// features/trips/trips.types.ts

export interface Trip {
  id: string;

  safariName: string;

  startDate: string; // ISO string
  endDate: string;   // ISO string

  destinations: string[]; // capsules
  hotels: string[];       // capsules

  additionalInfo: string;

  documents: {
    name: string;
    url: string;
  }[];

  tags: string[]; // self-defined tags

  editable: boolean;
  deletable: boolean;
}
