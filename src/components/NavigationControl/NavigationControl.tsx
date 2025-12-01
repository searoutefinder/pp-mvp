// Context
import { useMapContext } from '../../context/MapContext';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'

const NavigationControl = ({map}) => {
  
    const { setUserLocation, setIsLoading, mapPitch, setMapPitch } = useMapContext();

    const startGeolocation = () => {
      setIsLoading(true);
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.')
        return;
      }
      const watchId = navigator.geolocation.watchPosition(
        (position) => {     
          let feature = {"type": "Feature", "properties": {}, "geometry": {"type": "Point", "coordinates": [position.coords.longitude, position.coords.latitude]}}        
          console.log(feature)
          setUserLocation(feature);       
          setIsLoading(false);
        },
        (error) => {
          switch (true) {
            case error.code === 1:
              alert('Permission denied. Please enable location access in your browser settings and refresh the map!');
              setIsLoading(false);
              break;
            case error.code === 2:
              alert('Location information is unavailable.');
              setIsLoading(false);
              break;
            case error.code === 3:
              alert('The request to get location timed out.');
              setIsLoading(false);
              break;
            default:
              alert('An unknown error occurred.');
              setIsLoading(false);
          }
        },
        {
          "enableHighAccuracy": true,
          "maximumAge": 10000
        }
      );          
    }
    const geolocationClickedHandler = () => {
      startGeolocation();
    }
    const mapZoomOutClickedHandler = () => {
      map.setZoom(map.getZoom() - 0.5);
    }
    const mapZoomInClickedHandler = () => {
      map.setZoom(map.getZoom() + 0.5);
    }
    const pitchChangedHandler = () => {
      if(mapPitch === 0) {
        setMapPitch(import.meta.env.VITE_MAP_DESKTOP_PITCH);
      } 
      else
      {
        setMapPitch(0);
      }
    }
  
    return (
    <div className="absolute top-5 right-5 flex flex-col items-center z-10">
      <button
        className="cursor-pointer w-10 h-10 text-white bg-black/60 border border-2 border-blue-500 rounded-t-3xl text-xl leading-none"
        title="Zoom In"
        onClick={mapZoomInClickedHandler}
      >
        +
      </button>
      <button
        className="cursor-pointer w-10 h-10 text-white bg-black/60 border border-2 border-blue-500 rounded-b-3xl text-xl leading-none -mt-px"
        title="Zoom Out"
        onClick={mapZoomOutClickedHandler}
      >
        –
      </button>
      <button            
        className="cursor-pointer w-10 h-10 mt-3 pt-0 text-sm text-white bg-black/60 rounded-full"
        title="Switch dimensions"
        onClick={pitchChangedHandler}
      >
        { mapPitch === 0 ? '2D' : '3D' }
        
      </button>      
      <button            
        className="cursor-pointer w-10 h-10 mt-3 pt-0 text-sm text-white bg-[#5A8DFF] rounded-full"
        title="Find my current location"
        onClick={geolocationClickedHandler}
      >
        <FontAwesomeIcon icon={faLocationCrosshairs} className="text-lg mt-1" />
      </button>
    </div>
  )
}

export default NavigationControl;