import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { createRoot } from "react-dom/client";

import "mapbox-gl/dist/mapbox-gl.css";

function Mapbox(props) {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWFudWFyZXJhYSIsImEiOiJjbTEwZDZkMXgwZjRhMmxzOGhvZmhhZnk0In0.NWYGUQwiqYsNXixuz43aMA";

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [props.location[1], props.location[0]], // lng, lat
      zoom: 10, // starting zoom
      minZoom: 4, // Locking zoom-out level (min zoom level)
      maxZoom: 22, // Optional, just in case to limit zoom-in level
    });

    // Add navigation control (zoom buttons)
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    const CustomMarker = () => (
      <div className="relative flex flex-col items-center justify-center px-4 py-2 text-white bg-black rounded-lg">
        <p>{props.name}</p>
        {/* Triangle tip */}
        <div className="absolute w-0 h-0 border-t-8 border-l-8 border-r-8 border-l-transparent border-r-transparent border-t-black -bottom-2"></div>
      </div>
    );

    // Create a container element for the marker
    const markerDiv = document.createElement("div");

    // Use createRoot for React 18 compatibility
    const root = createRoot(markerDiv);
    root.render(<CustomMarker />);

    // Add the custom marker to the map
    new mapboxgl.Marker(markerDiv)
      .setLngLat([props.location[1], props.location[0]]) // lng, lat
      .addTo(mapRef.current);

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [props.location]);

  return (
    <>
      <div
        style={{ height: "100%", borderRadius: "20px" }}
        ref={mapContainerRef}
        className="map-container"
      />
    </>
  );
}

export default Mapbox;
