import { useEffect, useRef, useMemo } from "react";
import { useMapContext } from '../../../context/MapContext';
import { diffFromNow } from '../../../utils/utils';

type Props = {
  map: mapboxgl.Map
}

const ParkingSpaceLayer = ({map} : Props) => {
    
    // Refs

    const initializedRef = useRef(false);
    const lastHoveredId = useRef(null);
    const occupiedParkingSpaceIdsRef = useRef<number[]>([]);
    const parkingSpaceDataRef = useRef<any[]>([]);

    // Context variables

    const {
      setSelectedSpaceId, 
      setPopupData,
      setIsPopupVisible,
      occupiedParkingSpaces,
      parkingSpaceData
    } = useMapContext();

    // Hooks

    const sortedOccupiedSpaces = useMemo(() => {
      occupiedParkingSpaceIdsRef.current = [...occupiedParkingSpaces].sort((a, b) => a - b);
      return [...occupiedParkingSpaces].sort((a, b) => a - b);
    }, [occupiedParkingSpaces]);

    useEffect(() => {
      if (!map || initializedRef.current) return;
      initializedRef.current = true;
      initializeLayer();

      return () => {
        if (map && map.isStyleLoaded()) {
          map.off("click", "ACTIVE_LOTS", activeLotClickHandler);
          map.off("mousemove", "ACTIVE_LOTS", activeLotHoverHandler);
          map.off("mouseout", "ACTIVE_LOTS", activeLotMouseOutHandler);
          map.off("mousemove", "HOVERED_LOT_AREA", hoveredLotHoverHandler);
          map.off("mouseout", "HOVERED_LOT_AREA", hoveredLotMouseOutHandler);        
        }
      }

    }, [map])

    useEffect(() => {
      highlightOccupiedParkingSpaces();
    }, [sortedOccupiedSpaces]);

    useEffect(() => {
      parkingSpaceDataRef.current = parkingSpaceData;      
    }, [parkingSpaceData]);

    // Methods

    const initializeLayer = () => {
    
        // Define value based styling rules
      map.setPaintProperty('ACTIVE_LOTS', 'fill-color',
        ['case',
          ["==", ['get', 'SLOT_TYPE'], 'handicapped'],
          "#3DBEFF",
          "#85DCB1"              
        ]
      );       

      // Define events
      map.on("click", "ACTIVE_LOTS", activeLotClickHandler);

      map.on("mousemove", "ACTIVE_LOTS", activeLotHoverHandler);
  
      map.on("mouseout", "ACTIVE_LOTS", activeLotMouseOutHandler);      

      map.on("mousemove", "HOVERED_LOT_AREA", hoveredLotHoverHandler);
  
      map.on("mouseout", "HOVERED_LOT_AREA", hoveredLotMouseOutHandler);

    }

    const highlightOccupiedParkingSpaces = () => {

      if(occupiedParkingSpaceIdsRef.current.length === 0) { 
        map.setPaintProperty('ACTIVE_LOTS', 'fill-color', 
          [
            'case', 
              ["==", ['get', 'SLOT_TYPE'], 'handicapped'], "#3DBEFF",
              "#85DCB1"             
        ]);
        return;
      }

      map.setPaintProperty('ACTIVE_LOTS', 'fill-color',
        ['case', 
          ['in', ["get", "SLOT_DB_ID"], ['literal', occupiedParkingSpaceIdsRef.current]], "#D26870",
          ["==", ['get', 'SLOT_TYPE'], 'handicapped'], "#3DBEFF",
          "#85DCB1"             
        ]
      )
    }    

    // Handlers

    const activeLotClickHandler = (e) => {
      e.originalEvent.preventDefault();
      if (!e.features || !e.features[0]) return;

      const clickedId = e.features[0].properties.SLOT_DB_ID;

      map.setFilter('CLICKED_LOT_AREA', ['==', 'SLOT_DB_ID', clickedId]);
      map.setFilter('CLICKED_LOT_LINE', ['==', 'SLOT_DB_ID', clickedId]);
      map.setLayoutProperty('CLICKED_LOT_AREA', 'visibility', 'visible');      
      map.setLayoutProperty('CLICKED_LOT_LINE', 'visibility', 'visible');        

      const parkingSpaceDataObj = parkingSpaceDataRef.current.find(
        (item) => item.sensorId === e.features[0].properties.SLOT_DB_ID
      )

      // Set context values so that the InfoBox could show
      setSelectedSpaceId(clickedId);
      setPopupData({
        available: !occupiedParkingSpaceIdsRef.current.includes(e.features[0].properties.SLOT_DB_ID),
        ...e.features[0].properties,
        ...parkingSpaceDataObj,
        ...{diff: diffFromNow(parkingSpaceDataObj.lastStatusTimestamp)}
      })
      setIsPopupVisible(true);

    }

    const activeLotHoverHandler = (e) => {
      map.getCanvas().style.cursor = 'pointer';
      if (!e.features || !e.features[0]) return;

      const hoveredId = e.features[0].properties.SLOT_DB_ID

      if (hoveredId !== lastHoveredId.current) {
        lastHoveredId.current = hoveredId;
        map.setLayoutProperty('HOVERED_LOT', 'visibility', 'visible');
        map.setLayoutProperty('HOVERED_LOT_AREA', 'visibility', 'visible');        
        map.setFilter('HOVERED_LOT', ['==', 'SLOT_DB_ID', hoveredId]);
        map.setFilter('HOVERED_LOT_AREA', ['==', 'SLOT_DB_ID', hoveredId]);        
      }
    }

    const activeLotMouseOutHandler = () => {
      //map.getCanvas().style.cursor = '';
      
      lastHoveredId.current = null

      // Reset the hovered_lots and active_lots filters
      map.setLayoutProperty('HOVERED_LOT', 'visibility', 'none');
      map.setLayoutProperty('HOVERED_LOT_AREA', 'visibility', 'none');
    }

    const hoveredLotHoverHandler = () => {
      map.getCanvas().style.cursor = 'pointer';   
    }

    const hoveredLotMouseOutHandler = () => {
      map.getCanvas().style.cursor = '';   
    }

    return (null)
}

export default ParkingSpaceLayer;