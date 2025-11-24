import { useQuery, useMutation } from "convex/react";
// @ts-ignore - API types will be generated when Convex syncs
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export interface Availability {
  id: string;
  veterinarianName: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
  appointmentDuration: number;
  breakTime: number;
}

// Helper function to convert Convex document to frontend type
function convertAvailability(doc: {
  _id: Id<"availability">;
  _creationTime: number;
  veterinarianName: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
  appointmentDuration: number;
  breakTime: number;
}): Availability {
  return {
    id: doc._id,
    veterinarianName: doc.veterinarianName,
    workingDays: doc.workingDays,
    startTime: doc.startTime,
    endTime: doc.endTime,
    appointmentDuration: doc.appointmentDuration,
    breakTime: doc.breakTime,
  };
}

export function useAvailabilityStore(veterinarianName?: string) {
  // @ts-ignore - API types will be generated when Convex syncs
  const singleAvailability = veterinarianName
    ? useQuery(api.availability.getByVeterinarian, { veterinarianName })
    : null;
  // @ts-ignore
  const allAvailabilityData = !veterinarianName
    ? useQuery(api.availability.list)
    : null;
  // @ts-ignore
  const upsertAvailabilityMutation = useMutation(api.availability.upsert);

  const availability: Availability | null = singleAvailability
    ? convertAvailability(singleAvailability)
    : null;

  const allAvailability: Availability[] = allAvailabilityData
    ? allAvailabilityData.map(convertAvailability)
    : [];

  const upsertAvailability = async (data: Omit<Availability, 'id'>) => {
    await upsertAvailabilityMutation({
      veterinarianName: data.veterinarianName,
      workingDays: data.workingDays,
      startTime: data.startTime,
      endTime: data.endTime,
      appointmentDuration: data.appointmentDuration,
      breakTime: data.breakTime,
    });
  };

  return {
    availability,
    allAvailability,
    upsertAvailability,
  };
}

