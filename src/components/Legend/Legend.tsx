import * as React from "react";

const Legend = ({}) => {
 return (
    <div className={`absolute top-5 md:top-auto md:bottom-5 left-5 bg-[rgba(0,0,0,0.6)] border border-2 border-blue-500 rounded-3xl px-5 py-2 flex flex-row space-x-6 text-white text-sm z-10`}>

      <div className="flex items-center">
        <svg width="20" height="20" className="mx-2">
          <circle cx="10" cy="10" r="10" fill="rgba(0, 255, 0, 0.5)" />
        </svg>
        <span className="text-xs md:text-sm">Available</span>
      </div>

      <div className="flex items-center">
        <svg width="20" height="20" className="mx-2">
          <circle cx="10" cy="10" r="10" fill="rgba(255, 0, 0, 0.5)" />
        </svg>
        <span className="text-xs md:text-sm">Unavailable</span>
      </div>

    </div>     
 )
}

export default Legend;