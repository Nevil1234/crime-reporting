import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseLocation(wkt: string) {
  // Try SRID format first
  let matches = wkt.match(/SRID=\d+;POINT\((-?\d+\.?\d*) (-?\d+\.?\d*)\)/);
  if (matches) {
    return { lng: +matches[1], lat: +matches[2] };
  }
  
  // Fall back to regular POINT format
  matches = wkt.match(/POINT\((-?\d+\.?\d*) (-?\d+\.?\d*)\)/);
  return matches ? { lng: +matches[1], lat: +matches[2] } : null;
}

export function generateOfficerLocation(reportLocationWkt: string) {
  const reportLocation = parseLocation(reportLocationWkt);
  if (!reportLocation) return null;
  
  // Generate a location that's within 0.5-2 km from the report location
  // This simulates an officer who is responding to the incident
  const offsetLat = (Math.random() * 0.015) + 0.005; // ~0.5-2 km
  const offsetLng = (Math.random() * 0.015) + 0.005;
  
  // Randomly decide direction (+ or -)
  const latSign = Math.random() > 0.5 ? 1 : -1;
  const lngSign = Math.random() > 0.5 ? 1 : -1;
  
  return [
    reportLocation.lat + (offsetLat * latSign),
    reportLocation.lng + (offsetLng * lngSign)
  ] as [number, number];
}