import * as React from "react";
import { useCallback } from 'react';
import { useMapContext } from '../../context/MapContext';

type parkingSpaceDataPropertiesType = {
  available: boolean,
  carRegistrationNumbers: string[],
  diff: Record<string, string>,
  lastStatusTimestamp: string,
  sensorId: number,
  status: string,
  NAME: string,
  SLOT_DB_ID: number,
  SLOT_ID: number,
  SLOT_TYPE: string,
  TYPE: string
}

type Props = {
  onClose: (visible: boolean) => void
  parkingSpaceDataProperties?: parkingSpaceDataPropertiesType | null
}

const InfoBox = ({onClose, parkingSpaceDataProperties} : Props) => {
  
  const { isPopupVisible } = useMapContext(); 

  const closeClickHandler = useCallback(() => {
    onClose(false)
  }, [onClose]);

  if (!parkingSpaceDataProperties ) return null; 

  const isAvailable = parkingSpaceDataProperties.available;
  const hasDiffData = parkingSpaceDataProperties.hasOwnProperty("diff");

  return (
      <div className={`z-50 rounded-t-xl lg:rounded-none absolute flex flex-col p-5 left-0 bottom-0 lg:bottom-auto lg:left-1/8 lg:top-1/2  lg:transform lg:-translate-y-1/2 w-full lg:w-1/4 bg-[rgba(29,29,29,0.8)] ${!isPopupVisible ? 'hidden' : ''}`}>

        <div className="flex flex-row w-full border-b-2 border-[#3dbeff]/50 pb-5">
          <h2 className="w-4/5 flex flex-col">
            <span className={`flex text-md lg:text-xl sofia-sans-semibold ${isAvailable ? `text-[#3dbeff]/100` : `text-[#D04D4F]/80`}`}>
              {isAvailable ? `Available` : `Occupied`}
            </span>
            <span className='flex text-[#e2e2e2]/70 text-md lg:text-xl sofia-sans-semibold'>Parking Spot</span>
          </h2>
          <button type="button" className="w-1/5 flex justify-end cursor-pointer" onClick={closeClickHandler}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#3dbeff" strokeOpacity="0.5" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-row w-full border-b-2 border-[#3dbeff]/50 py-5 items-center">
          <h3 className="w-1/2 uppercase text-xs items-center">
            <span className="text-[#e2e2e2] mr-1">Time</span>
            <span className={`${isAvailable ? `text-[#3dbeff]/100` : `text-[#D04D4F]/80`}`}>
              {isAvailable ? `Available` : `Occupied`}
            </span>
          </h3>
          <div className="w-1/2 uppercase text-white justify-end flex flex-row items-baseline gap-2">
            <span className="text-xl lg:text-3xl leading-none">{hasDiffData ? parkingSpaceDataProperties.diff.hours : ''}</span>
            <span className="text-xs leading-none">hours</span>
            <span className="text-xl lg:text-3xl leading-none">{hasDiffData ? parkingSpaceDataProperties.diff.minutes : ''}</span>
            <span className="text-xs leading-none">minutes</span>
          </div>
        </div>

        {!isAvailable ? 
          <div className="flex flex-row w-full border-b-2 border-[#3dbeff]/50 py-5 items-center">
            <h3 className="w-1/2 uppercase text-xs text-[#E2E2E2]">License plate</h3>
            <p className="w-1/2 text-[#FFFFFF] uppercase  justify-end flex text-xl lg:text-3xl">{parkingSpaceDataProperties.hasOwnProperty("carRegistrationNumbers") ? parkingSpaceData.carRegistrationNumbers
.length > 0 ? parkingSpaceDataProperties.carRegistrationNumbers[0] : `N/A` : ''}</p>
          </div>       
          : ''
        }

      </div>
  )
}
export default InfoBox;