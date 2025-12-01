import { MapProvider } from './context/MapContext';
import Map from './components/Map/Map'

import './App.css'

function App() {
  return (
    <div className="w-screen h-screen">
      <MapProvider>
        <Map></Map>
      </MapProvider>
    </div>
  )
}

export default App
