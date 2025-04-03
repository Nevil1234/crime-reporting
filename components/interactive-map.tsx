'use client'
import { useState, useCallback, useEffect } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
import { MapPin, Maximize } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export default function InteractiveMap({
  initialLocation,
  onLocationChange
}: {
  initialLocation: [number, number]
  onLocationChange: (coords: [number, number]) => void
}) {
  const [viewState, setViewState] = useState({
    latitude: initialLocation[0],
    longitude: initialLocation[1],
    zoom: 14
  })

  useEffect(() => {
    setViewState({
      latitude: initialLocation[0],
      longitude: initialLocation[1],
      zoom: 14
    })
  }, [initialLocation])

  const handleMove = useCallback((evt) => {
    const coords = [evt.viewState.latitude, evt.viewState.longitude]
    onLocationChange(coords)
    setViewState(evt.viewState)
  }, [onLocationChange])

  return (
    <div className="h-96 w-full relative">
      <ReactMapGL
        {...viewState}
        onMove={handleMove}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker
          latitude={viewState.latitude}
          longitude={viewState.longitude}
          draggable
          onDragEnd={(evt) => {
            const coords = [evt.lngLat.lat, evt.lngLat.lng]
            onLocationChange(coords)
          }}
        >
          <MapPin className="w-10 h-10 text-red-600 animate-bounce" />
        </Marker>
        
        <div className="absolute top-4 right-4">
          <button
            className="p-2 bg-white rounded-full shadow-md"
            onClick={() => {
              // Add fullscreen implementation if needed
            }}
          >
            <Maximize className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </ReactMapGL>
    </div>
  )
}