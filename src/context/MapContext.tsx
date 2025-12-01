import React, { createContext, useContext, useState, useEffect, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import { MapMode } from '../utils/utils.tsx'

type ProviderProps = { children: ReactNode }
type LatLng = [number, number];

export type MapCtx = {
  map: MapboxMap | null,
  setMap: React.Dispatch<React.SetStateAction<MapboxMap | null>>,
  mapReady: boolean,
  setMapReady: React.Dispatch<React.SetStateAction<boolean>>,
  mapMode: MapMode,
  setMapMode: React.Dispatch<React.SetStateAction<MapMode>>,
  mapPitch: number,
  setMapPitch: React.Dispatch<React.SetStateAction<number>>,
  carModelReady: boolean, 
  setCarModelReady: React.Dispatch<React.SetStateAction<boolean>>,
  treeModelReady: boolean, 
  setTreeModelReady: React.Dispatch<React.SetStateAction<boolean>>,  
  userLocation: Record<string, unknown>,
  setUserLocation: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  modelCount: number,
  setModelCount: React.Dispatch<React.SetStateAction<number>>,
  selectedSpaceId: number | null,
  setSelectedSpaceId: React.Dispatch<React.SetStateAction<number | null>>,
  isPopupVisible: boolean,
  setIsPopupVisible: React.Dispatch<React.SetStateAction<boolean>>,
  isGuideVisible: boolean,
  setIsGuideVisible: React.Dispatch<React.SetStateAction<boolean>>,
  popupData: Record<string, unknown>,
  setPopupData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
  occupiedParkingSpaces: number[],
  setOccupiedParkingSpaces: React.Dispatch<React.SetStateAction<number[]>>,
  parkingSpaceData: Object[],
  setParkingSpaceData: React.Dispatch<React.SetStateAction<Object[]>>
}

const MapContext = createContext<MapCtx | undefined>(undefined)

export function MapProvider({ children }: ProviderProps) {

  const [map, setMap] = useState<MapboxMap | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [carModelReady, setCarModelReady] = useState(false);
  const [treeModelReady, setTreeModelReady] = useState(false);
  const [mapMode, setMapMode] = useState<MapMode>(MapMode.Day);

  const initialPitch = Number(import.meta.env.VITE_MAP_DESKTOP_PITCH) || 0;
  const [mapPitch, setMapPitch] = useState<number>(initialPitch);

  const [userLocation, setUserLocation] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modelCount, setModelCount] = useState<number>(3);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isGuideVisible, setIsGuideVisible] = useState<boolean>(true);
  const [popupData, setPopupData] = useState<Record<string, unknown>>({});
  const [occupiedParkingSpaces, setOccupiedParkingSpaces] = useState<number[]>([]);
  const [parkingSpaceData, setParkingSpaceData] = useState<Object[]>([]);

  useEffect(() => {
    const evtSource = new EventSource(import.meta.env.VITE_PARKING_SSE_ENDPOINT, {
      withCredentials: false
    });

    evtSource.addEventListener(import.meta.env.VITE_PARKING_EVT_NAME, (event) => {
      try {
        const parsed = JSON.parse(event.data);
        //console.log(parsed);
        const occupiedIDs = parsed
          .filter((item) => {
            return item.status === "BUSY";
          })
          .map((item) => {
            return item.sensorId;
          });
          if(carModelReady) {
            //console.log("Car model is now loaded, let's load the SSE data");
            setOccupiedParkingSpaces((prev) => occupiedIDs);
            setParkingSpaceData((prev) => parsed);
          }
      } catch {
        console.log("Non-JSON SSE:", event.data);
      }
    })

    evtSource.onerror = (err) => {
      console.error(err);
      // If connection drops permanently:
      if (evtSource.readyState === EventSource.CLOSED) {
        console.warn("SSE connection closed");
      }
    };

    // Close connection on unmount
    return () => {
      evtSource.close();
    };
  }, [carModelReady]);

  return (
    <MapContext.Provider
      value={{
        map, setMap,
        mapReady, setMapReady,
        mapMode, setMapMode,
        mapPitch, setMapPitch,
        carModelReady, setCarModelReady,
        treeModelReady, setTreeModelReady,
        userLocation, setUserLocation,
        isLoading, setIsLoading,
        modelCount, setModelCount,
        selectedSpaceId, setSelectedSpaceId,
        isPopupVisible, setIsPopupVisible,
        isGuideVisible, setIsGuideVisible,
        popupData, setPopupData,
        occupiedParkingSpaces, setOccupiedParkingSpaces,
        parkingSpaceData, setParkingSpaceData
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export function useMapContext(): MapCtx {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error('useMapContext must be used within MapProvider')
  return ctx
}







