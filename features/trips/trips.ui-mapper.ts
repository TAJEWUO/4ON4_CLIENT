import type { Trip as DomainTrip } from "./trips.types";

export function mapTripToTripCard(trip: DomainTrip) {
  return {
    id: Number(trip.id),
    name: trip.safariName,
    startDate: trip.startDate,
    endDate: trip.endDate,
    locations: trip.destinations,
    isSelf: true, // your rule: self trips
  };
}
