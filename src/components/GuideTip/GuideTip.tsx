// Core
import { useCallback } from 'react';

// Context
import { useMapContext } from '../../context/MapContext';

// Icons
import { XMarkIcon } from '@heroicons/react/24/outline';


const GuideTip = () => {
  const { setIsGuideVisible } = useMapContext();

  const guideCloseClickedHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setIsGuideVisible(false);    
  }, [])

  return (
    <div className="absolute w-3/4 md:w-auto bottom-5 left-1/2 transform -translate-x-1/2 bg-[rgba(0,0,0,0.6)] text-zinc-900 px-4 py-2 rounded-3xl shadow-md flex items-center justify-between z-10 border-blue-500 border-2 border">
    <span className="text-sm font-medium text-white">
      Click on a spot for more information
    </span>
    <button
      className="text-zinc-500 hover:text-zinc-800 cursor-pointer ms-3"
      aria-label="Close"
      onClick={guideCloseClickedHandler}
    >
      <XMarkIcon className="h-5 w-5 text-blue-500" />
    </button>
  </div>    
  )
}
export default GuideTip;