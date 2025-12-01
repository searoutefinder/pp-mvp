const Legend = ({}) => {
 return (
    <div className={`absolute top-5 md:top-auto md:bottom-5 left-5 bg-black/60 border border-2 border-blue-500 rounded-3xl px-5 py-2 flex flex-row space-x-4 text-white text-sm z-10`}>

      <div className="flex items-center space-x-2">
        <svg width="20" height="20">
          <circle cx="10" cy="10" r="10" fill="rgba(0, 255, 0, 0.5)" />
        </svg>
        <span>Available</span>
      </div>

      <div className="flex items-center space-x-2">
        <svg width="20" height="20">
          <circle cx="10" cy="10" r="10" fill="rgba(255, 0, 0, 0.5)" />
        </svg>
        <span>Unavailable</span>
      </div>

    </div>     
 )
}

export default Legend;