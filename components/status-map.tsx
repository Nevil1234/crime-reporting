"use client"

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface StatusMapProps {
  reportLocation: string; // WKT format from the database
  officerLocation?: [number, number]; // Optional officer coordinates
}

export default function StatusMap({ reportLocation, officerLocation }: StatusMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [eta, setEta] = useState<string | null>(null);

  // Parse WKT location string to get coordinates
  useEffect(() => {
    const parseLocation = (wkt: string) => {
      // Try SRID format first
      let matches = wkt.match(/SRID=\d+;POINT\((-?\d+\.?\d*) (-?\d+\.?\d*)\)/);
      if (matches) {
        return [parseFloat(matches[2]), parseFloat(matches[1])]; // [lat, lng]
      }
      
      // Fall back to regular POINT format
      matches = wkt.match(/POINT\((-?\d+\.?\d*) (-?\d+\.?\d*)\)/);
      return matches ? [parseFloat(matches[2]), parseFloat(matches[1])] : null;
    };
    
    const coordinates = parseLocation(reportLocation);
    if (coordinates) {
      setUserCoordinates(coordinates as [number, number]);
    }
  }, [reportLocation]);

  // Initialize map once coordinates are available
  useEffect(() => {
    if (!mapContainerRef.current || !userCoordinates) return;
    
    // Calculate center point between user and officer locations
    const center = officerLocation 
      ? [(userCoordinates[0] + officerLocation[0])/2, (userCoordinates[1] + officerLocation[1])/2]
      : userCoordinates;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [center[1], center[0]], // [lng, lat] format for Mapbox
      zoom: 13
    });
    
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    map.on('load', () => {
      // Add user marker (blue)
      new mapboxgl.Marker({ color: "#3b82f6" })
        .setLngLat([userCoordinates[1], userCoordinates[0]])
        .setPopup(new mapboxgl.Popup().setHTML("<strong>Incident Location</strong>"))
        .addTo(map);
      
      // Add officer marker if available (green)
      if (officerLocation) {
        new mapboxgl.Marker({ color: "#10b981" })
          .setLngLat([officerLocation[1], officerLocation[0]])
          .setPopup(new mapboxgl.Popup().setHTML("<strong>Responding Officer</strong>"))
          .addTo(map);
        
        // Add line between the two points
        map.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': [
                [userCoordinates[1], userCoordinates[0]],
                [officerLocation[1], officerLocation[0]]
              ]
            }
          }
        });
        
        map.addLayer({
          'id': 'route',
          'source': 'route',
          'type': 'line',
          'paint': {
            'line-color': '#888',
            'line-width': 2,
            'line-dasharray': [2, 1]
          }
        });
        
        // Calculate distance and ETA
        const distance = calculateDistance(
          userCoordinates[0], userCoordinates[1],
          officerLocation[0], officerLocation[1]
        );
        setDistance(distance.toFixed(1));
        
        // Estimate ETA (assume average speed of 30 mph or ~50 km/h)
        const timeInMinutes = Math.round((distance / 50) * 60);
        setEta(`~${timeInMinutes} min`);
      }
    });
    
    mapRef.current = map;
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [userCoordinates, officerLocation]);
  
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="w-full h-60 rounded-md overflow-hidden"></div>
      
      {/* Map legend */}
      <div className="absolute bottom-3 left-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 rounded-md text-xs shadow-md">
        <div className="flex items-center mb-1">
          <div className="h-2 w-2 bg-blue-500 rounded-full mr-1"></div>
          <span>Incident Location</span>
        </div>
        <div className="flex items-center">
          <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
          <span>Officer Location</span>
        </div>
      </div>
      
      {distance && eta && (
        <div className="absolute bottom-3 right-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 rounded-md text-xs shadow-md">
          <div className="flex items-center mb-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{distance} km away</span>
          </div>
          <div className="flex items-center">
            <span>ETA: {eta}</span>
          </div>
        </div>
      )}
    </div>
  );
}