// features/trips/trips.mapper.ts
import { Trip } from "./trips.types";

export function mapTripFromApi(raw: any): Trip {
  return {
    id: raw._id,

    safariName: raw.safariName ?? raw.name ?? "",

    startDate: raw.startDate ?? "",
    endDate: raw.endDate ?? "",

    destinations: Array.isArray(raw.destinations)
      ? raw.destinations
      : [],

    hotels: Array.isArray(raw.hotels)
      ? raw.hotels
      : [],

    additionalInfo: raw.additionalInfo ?? "",

    documents: Array.isArray(raw.documents)
      ? raw.documents.map((d: any) => ({
          name: d.name ?? "Document",
          url: d.url ?? "",
        }))
      : [],

    tags: Array.isArray(raw.tags) ? raw.tags : [],

    editable: Boolean(raw.editable ?? true),
    deletable: Boolean(raw.deletable ?? true),
  };
}