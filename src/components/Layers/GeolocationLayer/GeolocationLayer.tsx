import { useEffect, useRef } from "react";
import { useMapContext } from '../../../context/MapContext';
import type { GeoJSONSource } from "mapbox-gl";

type Props = {
  map: mapboxgl.Map
}

const GeolocationLayer = ({map} : Props) => {

    const initializedRef = useRef(false);
    const { userLocation } = useMapContext();   
    
    const isGeoJSONSource = (source: mapboxgl.Source | undefined): source is GeoJSONSource => { 
      return !!source && "setData" in source;
    }

    useEffect(() => {
      if (!map || initializedRef.current) return;
      initializedRef.current = true;
      initializeLayer();
  
      return () => {
        if (map && map.isStyleLoaded()) {

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }
  
    }, [map]);

    useEffect(() => {
      if (!map || !userLocation) return;

      const source = map.getSource("geolocation-src");

      if (!isGeoJSONSource(source)) return;

      source.setData({
        type: "FeatureCollection",
        features: [userLocation],
      });

    }, [map, userLocation]);

    const initializeLayer = () => {
      const x = 150
      const pulsingDot = {
            width: x,
            height: x,
            data: new Uint8Array(x * x * 4),
        
            // When the layer is added to the map,
            // get the rendering context for the map canvas.
            onAdd: function () {
              const canvas = document.createElement('canvas');
              canvas.width = this.width;
              canvas.height = this.height;
              this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
            },
        
            // Call once before every frame where the icon will be used.
            render: function () {
              const duration = 1000;
              const t = (performance.now() % duration) / duration;
        
              const radius = (x / 2) * 0.3;
              const outerRadius = (x / 2) * 0.7 * t + radius;
              const context = this.context as CanvasRenderingContext2D;
        
              // Draw the outer circle.
              context.clearRect(0, 0, this.width, this.height);
              context.beginPath();
              context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
              );
              context.fillStyle = `rgba(45, 122, 247, ${1 - t})`;
              context.fill();
        
              // Draw the inner circle.
              context.beginPath();
              context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
              );
              context.fillStyle = 'rgba(45, 122, 247, 1)';
              context.strokeStyle = 'white';
              context.lineWidth = 2 + 4 * (1 - t);
              context.fill();
              context.stroke();
      
              this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
              ).data;
        
              // Continuously repaint the map, resulting
              // in the smooth animation of the dot.
              map.triggerRepaint();
        
              // Return `true` to let the map know that the image was updated.
              return true;
           }
      }

      map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

      // Define value based styling rules
      map.addSource("geolocation-src", {"type": "geojson", "data": {"type": "FeatureCollection", "features": []}});        
      map.addLayer({
        "id": "geolocation-layer",
        "type": "symbol",
        "source": "geolocation-src",
        "layout": {
          "icon-allow-overlap": true,
          'icon-pitch-alignment': 'map',
          'icon-rotation-alignment': 'map',          
          "icon-image": "pulsing-dot"
        }
      })  
    }    
}

export default GeolocationLayer;