"use client"

import { useEffect, useRef, useState } from "react";
import { MapPin, AlertTriangle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";

// Initialize Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Incident {
  id: string;
  crime_type: string;
  created_at: string;
  location: string;
  coordinates?: { lng: number; lat: number } | null;
}

export default function CrimeMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Improved WKT parser with SRID support
  const parseLocation = (wkt: string) => {
    // Try SRID format first
    let matches = wkt.match(/SRID=\d+;POINT\((-?\d+\.?\d*) (-?\d+\.?\d*)\)/);
    if (matches) return { lng: +matches[1], lat: +matches[2] };
    
    // Fall back to regular POINT format
    matches = wkt.match(/POINT\((-?\d+\.?\d*) (-?\d+\.?\d*)\)/);
    return matches ? { lng: +matches[1], lat: +matches[2] } : null;
  };

  // Helper function for crime marker colors
  const getMarkerColor = (crimeType: string) => {
    switch (crimeType.toLowerCase()) {
      case 'theft': return '#FF0000'; // Red
      case 'assault': return '#8B00FF'; // Purple
      default: return '#FFFF00'; // Yellow
    }
  };

  const fetchIncidents = async () => {
    try {
      if (!navigator.geolocation) throw new Error("Geolocation not supported");
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
          enableHighAccuracy: true,
          timeout: 10000
        });
      });

      const userCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setUserLocation(userCoords);

      const { data, error: supaError } = await supabase.rpc('nearby_reports', {
        lat: userCoords.lat,
        lng: userCoords.lng,
        radius: 10000
      });

      if (supaError) throw supaError;
      if (!data) throw new Error("No data returned");

      const validIncidents = data
        .map(incident => ({
          ...incident,
          coordinates: parseLocation(incident.location)
        }))
        .filter(incident => incident.coordinates);

      setIncidents(validIncidents);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize map when user location is available
  const initializeMap = () => {
    if (!mapContainerRef.current || !userLocation) return;
    
    try {
      // Clean up previous map if it exists
      if (mapRef.current) {
        mapRef.current.remove();
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
      }
      
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [userLocation.lng, userLocation.lat],
        zoom: 13
      });

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add user location marker
      const userMarker = new mapboxgl.Marker({ color: "#007BFF" })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map);
      
      markersRef.current.push(userMarker);

      // Add incident markers once map is loaded
      map.on("load", () => {
        incidents.forEach(incident => {
          if (!incident.coordinates) return;

          const marker = new mapboxgl.Marker({
            color: getMarkerColor(incident.crime_type)
          })
          .setLngLat([incident.coordinates.lng, incident.coordinates.lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <strong>${incident.crime_type}</strong><br/>
              Reported ${formatTime(incident.created_at)}
            `)
          )
          .addTo(map);
          
          markersRef.current.push(marker);
        });
      });

      mapRef.current = map;
    } catch (mapError) {
      console.error("Map initialization error:", mapError);
      setError("Failed to load map. Please try again.");
    }
  };

  // Format relative time for incidents
  const formatTime = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / 3600000);
    return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
  };

  // Fetch incidents on component mount
  useEffect(() => {
    fetchIncidents();
    
    return () => {
      // Clean up map and markers on unmount
      if (mapRef.current) mapRef.current.remove();
      markersRef.current.forEach(marker => marker.remove());
    };
  }, []);

  // Initialize or update map when user location or incidents change
  useEffect(() => {
    if (userLocation) {
      initializeMap();
    }
  }, [userLocation, incidents]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center p-4">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-56 bg-gray-100 dark:bg-gray-800 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
      
      <div ref={mapContainerRef} className="w-full h-full" />

      {!isLoading && incidents.length === 0 && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70">
          <div className="text-center p-4">
            <MapPin className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p>No incidents reported in your area</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-3 bg-white/80 dark:bg-gray-900/80 p-2 rounded-md text-xs shadow-md">
        <div className="flex items-center mb-1">
          <div className="h-2 w-2 bg-red-500 rounded-full mr-1" /> Theft
        </div>
        <div className="flex items-center mb-1">
          <div className="h-2 w-2 bg-purple-500 rounded-full mr-1" /> Assault
        </div>
        <div className="flex items-center">
          <div className="h-2 w-2 bg-yellow-500 rounded-full mr-1" /> Other
        </div>
      </div>
    </div>
  );
}