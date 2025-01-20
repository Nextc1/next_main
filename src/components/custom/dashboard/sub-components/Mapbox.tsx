import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { usePropertiesStore } from "../../../../state-management/store";

const Mapbox = (props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [spinEnabled, setSpinEnabled] = useState(true);
  const { userInvestments } = usePropertiesStore();
  const [properties, setProperties] = useState([]);
  let userInteracting = false;

  useEffect(() => {
    if (userInvestments.properties) {
      setProperties(userInvestments.properties);
    }
  }, [userInvestments]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWFudWFyZXJhYSIsImEiOiJjbHVua3JhcHAxNjRkMmpwN2p1a2VwcTZlIn0.M7SLaBn_r3ldw0KuawrZbA";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 1, // starting zoom
      maxZoom: 15,
      projection: "globe", // Adding the globe projection
    });

    // mapRef.current.on("style.load", () => {
    //   mapRef.current!.setFog({}); // Set the default atmosphere style
    // });

    // Add custom markers for properties that have "yourShares"
    // const propertiesWithYourShares = props.dummyData.filter(
    //   (item) => item.yourShares !== undefined
    // );

    properties.forEach((property) => {
      // Create a custom HTML element for the marker
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.innerHTML = `
        <div class="marker-content bg-black text-white">
          <strong>${property.JSONData.name}</strong>
          <br />
          <span>${property.quantity} shares</span>
        </div>
      `;

      // Optionally, style the custom marker
      el.style.background = "black";
      el.style.padding = "5px";
      el.style.borderRadius = "8px";
      el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
      el.style.textAlign = "center";
      el.style.color = "white";

      // lat and lon are seperated by a comma as a string, extract it
      const [longitude, latitude] =
        property.JSONData.attributes.propertyLocation.split(",");

      console.log("longitude", longitude);
      console.log("latitude", latitude);

      // Add the custom marker to the map
      new mapboxgl.Marker(el)
        .setLngLat([parseFloat(latitude), parseFloat(longitude)])
        .addTo(mapRef.current!);
    });

    // Spin globe functionality
    const spinGlobe = () => {
      if (!mapRef.current || !spinEnabled || userInteracting) return;
      const zoom = mapRef.current.getZoom();
      const secondsPerRevolution = 60; // 2 minutes for one rotation
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      let distancePerSecond = 360 / secondsPerRevolution;

      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }

      const center = mapRef.current.getCenter();
      center.lng -= distancePerSecond;
      mapRef.current.easeTo({ center, duration: 1000, easing: (n) => n });

      mapRef.current.once("moveend", spinGlobe); // Continue spinning after each movement
    };

    // Event listeners for user interaction to stop spinning during interaction
    const stopSpinOnInteraction = () => {
      console.log("User interacting with the map");
      userInteracting = true;
    };
    const resumeSpinAfterInteraction = () => {
      console.log("User stopped interacting with the map");
      userInteracting = false;
      spinGlobe(); // Restart the spinning
    };

    mapRef.current.on("mousedown", stopSpinOnInteraction);
    mapRef.current.on("mouseup", resumeSpinAfterInteraction);
    mapRef.current.on("dragend", resumeSpinAfterInteraction);
    mapRef.current.on("pitchend", resumeSpinAfterInteraction);
    mapRef.current.on("rotateend", resumeSpinAfterInteraction);

    spinGlobe(); // Start spinning

    return () => {
      mapRef.current!.remove(); // Cleanup the map on component unmount
    };
  }, [properties, spinEnabled]);

  return (
    <div
      style={{ height: "100%" }}
      ref={mapContainerRef}
      className="map-container rounded-xl"
    />
  );
};

export default Mapbox;
