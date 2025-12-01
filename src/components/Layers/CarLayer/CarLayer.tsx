import { useEffect, useRef } from "react";
import { useMapContext } from '../../../context/MapContext';
import { Threebox } from 'threebox-plugin';
import type { Feature, Point, GeoJsonProperties  } from "geojson";

type Props = {
  map: mapboxgl.Map
  modelReady: boolean
}

const CarLayer = ({map, modelReady} : Props) => {
    
    const initializedRef = useRef<boolean | false>(false);
    const carModelRef = useRef<any | null>(null);

    const { setCarModelReady, occupiedParkingSpaces, setIsLoading } = useMapContext();

    useEffect(() => {
      if(!carModelRef.current) { return; }
      if(!modelReady) { return; }
      if(occupiedParkingSpaces.length > 0) {
        map.setFilter('ANCHORS', [
          "all",
          [
            "match",
            ["get", "TYPE"],
            ["SLOT_ANCHOR"],
            true,
            false
          ],
          [
            "match",
            ["geometry-type"],
            ["Point"],
            true,
            false
          ],
          ['in', ["get", "DB_ID"], ['literal', occupiedParkingSpaces]]
        ]);
        map.once("idle", () => {          
          updateModels();
        });
      }
      else
      {
        console.log("All slots are free")
      }
    }, [occupiedParkingSpaces]);
    

    useEffect(() => {
      if (!map || initializedRef.current) return;
      // The map object has been passed and is ready for use in the Car Layer component
      initializedRef.current = true;
      initializeLayer();
      
      
      return () => {
        if (map && map.isStyleLoaded() && window.tb) {

          map.off('moveend', updateModels);
          map.off('zoomend', updateModels);
          
          if (window.tb) {
            window.tb.clear();
            map.triggerRepaint();
          }
        
          if (map.getLayer("car-model-lyr")) {
            map.removeLayer("car-model-lyr");
          }          
        }
      };

    }, []);

    useEffect(() => {
      if(modelReady !== true) { return }
      console.log("Car model has been loaded!")
    }, [modelReady]);

    const on3dLayerAdd = () => {
      window.tb = new Threebox(map, map.getCanvas().getContext('webgl'), { defaultLights: true });
      
      const options = {
        obj: import.meta.env.VITE_CAR_MODEL_URL,
        type: "gltf",
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 90, y: 15, z: 0 },
        units: "meters",
        anchor: "center"
      };
  
      window.tb.loadObj(options, (model) => {
        model.userData.carModel = true;
        carModelRef.current = model;
        
        // Indicate that the car model is loaded
        setCarModelReady(true);

        // place models for currently visible points
        const isReadyPoll = setInterval(() => {
          
          const features = map.queryRenderedFeatures({ layers: ['ANCHORS'] }) as Feature<GeoJSON.Geometry, GeoJsonProperties>[];
          const featurePoints = features
          .filter((f): f is Feature<Point> => f.geometry.type === 'Point') // type guard
          .map(f => ({
            lng: f.geometry.coordinates[0],
            lat: f.geometry.coordinates[1]
          }));

          if(featurePoints.length === 0) { 
            return; 
          }
          else
          {
            updateModels();

            // Clear the interval once the Anchors layer is loaded completely
            clearInterval(isReadyPoll);
          }
        }, 200); 
        

      });      
    }
    const on3dLayerUpdate = () => {
      window.tb.update();
    }

    const initializeLayer = () => {
      
      setIsLoading(true);

      map.addLayer({
        id: "car-model-lyr",
        type: "custom",
        renderingMode: "3d",
        onAdd: on3dLayerAdd,
        render: on3dLayerUpdate
      });        
    
      map.on('moveend', updateModels);
      map.on('zoomend', updateModels); 
      
    }
    const displayModels = (positions) => {
      if (!carModelRef.current || carModelRef.current === null) { return; }
    
      window.tb.clear();

      positions.forEach((pos) => {
        const clone = carModelRef.current.duplicate();
        const worldPos = window.tb.projectToWorld([pos[0], pos[1], 0])
        clone.position.set(worldPos.x, worldPos.y, worldPos.z);
        clone.scale.set(0.025, 0.025, 0.025);
        clone.rotation.set(0, 0, -117 * (Math.PI / 180));
        window.tb.add(clone);          
      });

      map.triggerRepaint();
      setIsLoading(false);
    };
    const updateModels = () => {
      const features = map.queryRenderedFeatures({ layers: ['ANCHORS'] }) as Feature<GeoJSON.Geometry, GeoJsonProperties>[];
      const featurePoints = features
      .filter((f): f is Feature<Point> => f.geometry.type === 'Point') // type guard
      .map(f => ({
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1]
      }));
      displayModels(featurePoints);      
    }
    

    return null;
}
export default CarLayer;