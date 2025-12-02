import * as React from "react";
import { useEffect, useState } from "react";
import { MapProvider } from './context/MapContext';
import Map from './components/Map/Map'

import './App.css'

const App = () => {

  const [isPortrait, setIsPortrait] = useState(
    window.matchMedia("(orientation: portrait)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)");

    const handleOrientationChange = (e: MediaQueryListEvent) => {
      setIsPortrait(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleOrientationChange);
    } else {
      mediaQuery.addListener(handleOrientationChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleOrientationChange);
      } else {
        mediaQuery.removeListener(handleOrientationChange);
      }
    };
  }, []);

  return (
    <div className={`w-screen ${isPortrait === true ? 'h-[calc(100vh-4rem)]' : 'h-screen'} overflow-y-hidden`}>
      <MapProvider>
        <Map></Map>
      </MapProvider>
    </div>
  )
}

export default App;
