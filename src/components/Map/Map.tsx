// Core
import React, { useEffect, useRef, useCallback } from 'react';

// Packages
import mapboxgl from 'mapbox-gl';

// Utilities
import { getTimePeriod } from '../../utils/utils'

// Context
import { useMapContext } from '../../context/MapContext';

// Child components
import InfoBox from '../../components/InfoBox/InfoBox';
import CarLayer from '../../components/Layers/CarLayer/CarLayer';
import TreeLayer from '../../components/Layers/TreeLayer/TreeLayer';
import ClipperLayer from '../../components/Layers/ClipperLayer/ClipperLayer';
import ParkingSpaceLayer from '../../components/Layers/ParkingSpaceLayer/ParkingSpaceLayer';
import GeolocationLayer from '../../components/Layers/GeolocationLayer/GeolocationLayer';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Legend from '../../components/Legend/Legend';
import GuideTip from '../../components/GuideTip/GuideTip';
import NavigationControl from '../../components/NavigationControl/NavigationControl';


// Style declarations
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Map = () => {

  // References
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const {
    isLoading, 
    map,
    setMap,
    mapReady, 
    setMapReady,
    mapMode,
    setMapMode,
    mapPitch, 
    setSelectedSpaceId,
    setPopupData, 
    popupData, 
    isPopupVisible,
    setIsPopupVisible, 
    setOccupiedParkingSpaces,
    isGuideVisible,
    setIsGuideVisible,
    carModelReady,
    treeModelReady
  } = useMapContext();


  // Event handler methods
  const mapClickHandler = useCallback((e) => {
    
    if (!mapRef.current) return;

    if(!e.originalEvent.defaultPrevented) {
      e.originalEvent.preventDefault();
      // Hide the highlight layers when the user click on the map
      // This way we can save resources on resetting the filter
      mapRef.current.setLayoutProperty('CLICKED_LOT_AREA', 'visibility', 'none');      
      mapRef.current.setLayoutProperty('CLICKED_LOT_LINE', 'visibility', 'none');      

      setSelectedSpaceId(null)
      setPopupData({})
      setIsPopupVisible(false)
    }    
  }, [setSelectedSpaceId, setPopupData, setIsPopupVisible])

  const onLoadHandler = async () => {

    if (!mapRef.current) return;

    // Get the current lightPreset(mapMode) based on the information on sunrise/sunset etc on the given location at the given time
    const currentTimeUnix = Math.floor(Date.now() / 1000)
    const mapModeResult = await getTimePeriod(currentTimeUnix);  

    if(typeof mapModeResult === "undefined") { return }
    
    setMapMode(mapModeResult);

    setMapReady(true); 

    setMap(mapRef.current)

    mapRef.current.on("click", mapClickHandler);
    mapRef.current.on('contextmenu', (e) => e.preventDefault());   
  }

  const popupClosedHandler = useCallback(() => {
    
    if (!mapRef.current) return;

    mapRef.current.setLayoutProperty('CLICKED_LOT_AREA', 'visibility', 'none');      
    mapRef.current.setLayoutProperty('CLICKED_LOT_LINE', 'visibility', 'none');      

    setSelectedSpaceId(null)
    setPopupData({})
    setIsPopupVisible(false)
  }, [isPopupVisible])

  useEffect(() => {
    if(!mapContainerRef.current) { return }
    if(mapRef.current) { return }
      
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: import.meta.env.VITE_MAP_STYLE,
        center: [
          import.meta.env.VITE_MAP_DESKTOP_LNG,
          import.meta.env.VITE_MAP_DESKTOP_LAT
        ],
        zoom: import.meta.env.VITE_MAP_ZOOM,
        pitch: import.meta.env.VITE_MAP_DESKTOP_PITCH,
        bearing: import.meta.env.VITE_MAP_DESKTOP_BEARING,
        maxZoom: import.meta.env.VITE_MAP_MAXZOOM,
        minZoom:import.meta.env.VITE_MAP_MINZOOM,
        /*maxBounds: [
          [23.318797451788214, 42.692418869414155],
          [23.337414976994097, 42.70616336450993]
        ]*/
      })      

      //mapRef.current.dragRotate.disable();
      //mapRef.current.touchZoomRotate.disableRotation();

      mapRef.current.on("load", onLoadHandler)

    return () => {
      if(mapRef.current) {
        mapRef.current.off("click", mapClickHandler);
        mapRef.current.remove();
        mapRef.current = null
      }
    }

  }, [])

  useEffect(() => {
    if(isPopupVisible === true) {
      setIsGuideVisible(false);
    } else {
      setIsGuideVisible(true);
    }    
  }, [isPopupVisible]);

  useEffect(() => {
    
    if (!mapRef.current) return;

    mapRef.current.easeTo({
      "pitch": mapPitch,
      "duration": 500
    });       
  }, [mapPitch])

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Set the map's lightPreset based on the calculated time of the day (dawn, day, dusk, night)
    mapRef.current.setConfigProperty('basemap', 'lightPreset', mapMode);   

  }, [mapMode]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="absolute w-full h-full">
     
        <NavigationControl map={map} />

        {map && mapReady && <CarLayer map={map} modelReady={carModelReady} />}
        {map && mapReady && <TreeLayer map={map} modelReady={treeModelReady} />}
        {map && mapReady && <ClipperLayer map={map} />}
        {map && mapReady && <ParkingSpaceLayer map={map} />}
        {map && mapReady && <GeolocationLayer map={map} />}
        
        {isGuideVisible &&
          <GuideTip />
        }

        <Legend />      

      </div>
      <InfoBox onClose={popupClosedHandler} parkingSpaceData={popupData}/>
      {isLoading && <LoadingSpinner />}
    </div>
  )
}

export default Map;